import type { VercelRequest, VercelResponse } from '@vercel/node';

// The Odds API - https://the-odds-api.com
// QUOTA GRATUIT : 500 requêtes/mois - OPTIMISER AU MAXIMUM
const API_KEY = process.env.ODDS_API_KEY || '';
const API_HOST = 'https://api.the-odds-api.com/v4';

// Mapping des compétitions Octogoal vers The Odds API
const SPORT_KEYS: Record<string, string> = {
  'ligue1': 'soccer_france_ligue_one',
  'premierleague': 'soccer_epl',
  'laliga': 'soccer_spain_la_liga',
  'seriea': 'soccer_italy_serie_a',
  'bundesliga': 'soccer_germany_bundesliga',
  'championsleague': 'soccer_uefa_champs_league',
  'europaleague': 'soccer_uefa_europa_league',
  'ligue2': 'soccer_france_ligue_two',
};

// UNIQUEMENT WINAMAX FRANCE - pas de fallback
const BOOKMAKER = 'winamax_fr';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vérifier la clé API
  if (!API_KEY) {
    console.error('[Odds API] ERREUR: ODDS_API_KEY non configurée');
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { sport } = req.query;

  // Sport par défaut : Ligue 1
  const sportKey = SPORT_KEYS[sport as string] || SPORT_KEYS['ligue1'];

  // URL API - UNIQUEMENT Winamax, marchés h2h (1X2) et totals (over/under)
  const apiUrl = `${API_HOST}/sports/${sportKey}/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h,totals&oddsFormat=decimal&bookmakers=${BOOKMAKER}`;

  console.log(`[Odds API] Fetching ${sportKey} (Winamax only)...`);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    // Logger le quota AVANT de vérifier la réponse
    const remainingRequests = response.headers.get('x-requests-remaining');
    const usedRequests = response.headers.get('x-requests-used');

    console.log(`[Odds API] ====== QUOTA ======`);
    console.log(`[Odds API] Requêtes utilisées: ${usedRequests}`);
    console.log(`[Odds API] Requêtes restantes: ${remainingRequests}`);
    console.log(`[Odds API] ===================`);

    // Alerter si quota bas
    if (remainingRequests && parseInt(remainingRequests) < 50) {
      console.warn(`[Odds API] ⚠️ ATTENTION: Seulement ${remainingRequests} requêtes restantes !`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Odds API] Erreur HTTP:', response.status, errorText);

      // Si quota dépassé (402), ne pas exposer l'erreur
      if (response.status === 402) {
        console.error('[Odds API] ❌ QUOTA DÉPASSÉ - Plus de requêtes disponibles');
        return res.status(200).json({ success: false, data: [], quotaExceeded: true });
      }

      return res.status(200).json({ success: false, data: [] });
    }

    const data = await response.json();

    // Transformer et FILTRER : garder uniquement les matchs avec cotes Winamax
    const transformedData = transformOddsData(data);
    const matchesWithWinamax = transformedData.filter(m => m.odds.winamax !== null);

    console.log(`[Odds API] ${data.length} matchs récupérés, ${matchesWithWinamax.length} avec cotes Winamax`);

    // CACHE AGRESSIF : 30 MINUTES côté serveur Vercel
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=300');

    return res.status(200).json({
      success: true,
      sport: sportKey,
      count: matchesWithWinamax.length,
      cachedUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      quota: {
        used: usedRequests,
        remaining: remainingRequests,
      },
      data: matchesWithWinamax,
    });
  } catch (error) {
    console.error('[Odds API] Exception:', error);
    // En cas d'erreur, retourner une réponse vide (pas d'erreur visible)
    return res.status(200).json({ success: false, data: [] });
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

interface WinamaxOdds {
  home: number;
  draw: number;
  away: number;
  overUnder?: {
    line: number;
    over: number;
    under: number;
  };
  lastUpdate: string;
}

interface TransformedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  odds: {
    winamax: WinamaxOdds | null;
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
        winamax: null,
      },
    };

    // Chercher UNIQUEMENT Winamax France - pas de fallback
    const winamaxBookmaker = match.bookmakers.find(b => b.key === 'winamax_fr');

    if (!winamaxBookmaker) {
      return result; // Pas de cotes Winamax = on retourne null
    }

    const h2hMarket = winamaxBookmaker.markets.find(m => m.key === 'h2h');

    if (!h2hMarket) {
      return result;
    }

    const homeOdds = h2hMarket.outcomes.find(o => o.name === match.home_team);
    const drawOdds = h2hMarket.outcomes.find(o => o.name === 'Draw');
    const awayOdds = h2hMarket.outcomes.find(o => o.name === match.away_team);

    // Vérifier que les 3 cotes existent
    if (!homeOdds || !drawOdds || !awayOdds) {
      return result;
    }

    const winamaxOdds: WinamaxOdds = {
      home: homeOdds.price,
      draw: drawOdds.price,
      away: awayOdds.price,
      lastUpdate: winamaxBookmaker.last_update,
    };

    // Over/Under si disponible
    const totalsMarket = winamaxBookmaker.markets.find(m => m.key === 'totals');
    if (totalsMarket) {
      const overOutcome = totalsMarket.outcomes.find(o => o.name === 'Over');
      const underOutcome = totalsMarket.outcomes.find(o => o.name === 'Under');

      if (overOutcome && underOutcome) {
        winamaxOdds.overUnder = {
          line: overOutcome.point || 2.5,
          over: overOutcome.price,
          under: underOutcome.price,
        };
      }
    }

    result.odds.winamax = winamaxOdds;
    return result;
  });
}
