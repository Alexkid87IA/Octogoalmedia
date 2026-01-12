import type { VercelRequest, VercelResponse } from '@vercel/node';

// The Odds API - https://the-odds-api.com
// Clé API gratuite : 500 requêtes/mois
const API_KEY = process.env.ODDS_API_KEY || 'YOUR_API_KEY_HERE';
const API_HOST = 'https://api.the-odds-api.com/v4';

// Mapping des compétitions Octogoal vers The Odds API
const SPORT_KEYS: Record<string, string> = {
  // Top 5 européens
  'ligue1': 'soccer_france_ligue_one',
  'premierleague': 'soccer_epl',
  'laliga': 'soccer_spain_la_liga',
  'seriea': 'soccer_italy_serie_a',
  'bundesliga': 'soccer_germany_bundesliga',
  // Coupes d'Europe
  'championsleague': 'soccer_uefa_champs_league',
  'europaleague': 'soccer_uefa_europa_league',
  // Autres
  'ligue2': 'soccer_france_ligue_two',
};

// Bookmakers à récupérer (Winamax en priorité)
const BOOKMAKERS = ['winamax', 'unibet', 'betclic', 'pmu'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { sport, markets, regions } = req.query;

  // Sport par défaut : Ligue 1
  const sportKey = SPORT_KEYS[sport as string] || SPORT_KEYS['ligue1'];

  // Markets : h2h (1X2), totals (over/under), spreads
  const marketsParam = markets || 'h2h,totals';

  // Régions : eu pour bookmakers européens (Winamax)
  const regionsParam = regions || 'eu';

  const apiUrl = `${API_HOST}/sports/${sportKey}/odds/?apiKey=${API_KEY}&regions=${regionsParam}&markets=${marketsParam}&oddsFormat=decimal&bookmakers=${BOOKMAKERS.join(',')}`;

  console.log('[Odds API] Fetching:', sportKey);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Odds API] Error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Failed to fetch odds',
        details: errorText
      });
    }

    const data = await response.json();

    // Transformer les données pour notre format
    const transformedData = transformOddsData(data);

    // Headers de cache : 3 minutes pour les cotes
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=60');

    // Retourner les headers d'utilisation API
    const remainingRequests = response.headers.get('x-requests-remaining');
    const usedRequests = response.headers.get('x-requests-used');

    return res.status(200).json({
      success: true,
      sport: sportKey,
      count: transformedData.length,
      apiUsage: {
        remaining: remainingRequests,
        used: usedRequests,
      },
      data: transformedData,
    });
  } catch (error) {
    console.error('[Odds API] Exception:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: String(error)
    });
  }
}

interface OddsApiMatch {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
}

interface TransformedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  odds: {
    winamax?: {
      home: number;
      draw: number;
      away: number;
      overUnder?: {
        line: number;
        over: number;
        under: number;
      };
      lastUpdate: string;
    };
    bestOdds: {
      home: { value: number; bookmaker: string };
      draw: { value: number; bookmaker: string };
      away: { value: number; bookmaker: string };
    };
  };
}

function transformOddsData(data: OddsApiMatch[]): TransformedMatch[] {
  return data.map((match) => {
    const result: TransformedMatch = {
      id: match.id,
      homeTeam: match.home_team,
      awayTeam: match.away_team,
      commenceTime: match.commence_time,
      odds: {
        bestOdds: {
          home: { value: 0, bookmaker: '' },
          draw: { value: 0, bookmaker: '' },
          away: { value: 0, bookmaker: '' },
        },
      },
    };

    // Chercher Winamax en priorité
    const winamaxBookmaker = match.bookmakers.find(b => b.key === 'winamax');
    if (winamaxBookmaker) {
      const h2hMarket = winamaxBookmaker.markets.find(m => m.key === 'h2h');
      const totalsMarket = winamaxBookmaker.markets.find(m => m.key === 'totals');

      if (h2hMarket) {
        const homeOdds = h2hMarket.outcomes.find(o => o.name === match.home_team);
        const drawOdds = h2hMarket.outcomes.find(o => o.name === 'Draw');
        const awayOdds = h2hMarket.outcomes.find(o => o.name === match.away_team);

        result.odds.winamax = {
          home: homeOdds?.price || 0,
          draw: drawOdds?.price || 0,
          away: awayOdds?.price || 0,
          lastUpdate: winamaxBookmaker.last_update,
        };

        if (totalsMarket) {
          const overOutcome = totalsMarket.outcomes.find(o => o.name === 'Over');
          const underOutcome = totalsMarket.outcomes.find(o => o.name === 'Under');

          if (overOutcome && underOutcome) {
            result.odds.winamax.overUnder = {
              line: overOutcome.point || 2.5,
              over: overOutcome.price,
              under: underOutcome.price,
            };
          }
        }
      }
    }

    // Calculer les meilleures cotes tous bookmakers
    for (const bookmaker of match.bookmakers) {
      const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
      if (!h2hMarket) continue;

      const homeOdds = h2hMarket.outcomes.find(o => o.name === match.home_team);
      const drawOdds = h2hMarket.outcomes.find(o => o.name === 'Draw');
      const awayOdds = h2hMarket.outcomes.find(o => o.name === match.away_team);

      if (homeOdds && homeOdds.price > result.odds.bestOdds.home.value) {
        result.odds.bestOdds.home = { value: homeOdds.price, bookmaker: bookmaker.title };
      }
      if (drawOdds && drawOdds.price > result.odds.bestOdds.draw.value) {
        result.odds.bestOdds.draw = { value: drawOdds.price, bookmaker: bookmaker.title };
      }
      if (awayOdds && awayOdds.price > result.odds.bestOdds.away.value) {
        result.odds.bestOdds.away = { value: awayOdds.price, bookmaker: bookmaker.title };
      }
    }

    return result;
  });
}
