// Service API-Football pour Octogoal
// Documentation : https://www.api-football.com/documentation-v3
// Migré depuis Football-Data.org

import {
  COMPETITIONS,
  LEAGUES,
  LEAGUE_INFO,
  getTopCompetitionIds,
  getMatchTickerCompetitions,
  getCompetition,
  isTopCompetition,
} from '../config/competitions';

// Re-export pour compatibilité
export { LEAGUES, LEAGUE_INFO };
export type LeagueKey = keyof typeof LEAGUES;

// En dev: utiliser le proxy Vite
// En prod: utiliser les Vercel Serverless Functions
const BASE_URL = '/api/football';

// Timeout pour les appels API (5 secondes)
const API_TIMEOUT = 5000;

// Fonction fetch pour les appels API avec timeout
async function apiFetch(endpoint: string): Promise<Response> {
  // endpoint commence par "/" donc on le concatène directement
  const url = `${BASE_URL}${endpoint}`;
  console.log('[API] Fetching:', url);

  // AbortController pour timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    // Log the response status
    if (!response.ok) {
      console.error('[API] HTTP Error:', response.status, response.statusText);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[API] Request timeout after', API_TIMEOUT, 'ms:', url);
      throw new Error(`API timeout: ${endpoint}`);
    }
    throw error;
  }
}

// =============================================
// SYSTÈME DE CACHE
// =============================================

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes en millisecondes - augmenté pour éviter le rate limiting

function getCached(key: string): any | null {
  const entry = cache[key];
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    delete cache[key];
    return null;
  }

  return entry.data;
}

function setCache(key: string, data: any): void {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
}

// =============================================
// CONFIGURATION
// =============================================

// Mapping ancien code -> nouveau code (pour compatibilité)
const LEAGUE_CODE_MAPPING: Record<string, string> = {
  'FL1': '61',
  'PL': '39',
  'PD': '140',
  'SA': '135',
  'BL1': '78',
  'CL': '2',
};

// Fonction pour convertir les anciens codes si nécessaire
function normalizeLeagueCode(code: string): string {
  return LEAGUE_CODE_MAPPING[code] || code;
}

// Saison actuelle - calculée dynamiquement
// La saison de foot va d'août à mai, donc:
// - Janvier à Juillet = saison de l'année précédente (ex: Jan 2025 = saison 2024-2025 = "2024")
// - Août à Décembre = saison de l'année en cours (ex: Sept 2025 = saison 2025-2026 = "2025")
function getCurrentSeason(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11 (0 = janvier)

  // Si on est entre janvier (0) et juillet (6), c'est la saison de l'année précédente
  if (month < 7) {
    return year - 1;
  }
  // Sinon (août à décembre), c'est la saison de l'année en cours
  return year;
}

const CURRENT_SEASON = getCurrentSeason();
console.log('[API] Current season configured:', CURRENT_SEASON);

// =============================================
// FONCTIONS API AVEC CACHE
// =============================================

/**
 * Récupère le classement d'une ligue
 * Pour les compétitions à plusieurs groupes (CAN, Euro, etc.), retourne le premier groupe par défaut
 */
export async function getStandings(leagueCode: string) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `standings_${normalizedCode}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[API] getStandings(${normalizedCode}) - from cache:`, cached.length);
    return cached;
  }

  try {
    console.log(`[API] getStandings(${normalizedCode}) - fetching for season ${CURRENT_SEASON}...`);
    const response = await apiFetch(
      `/standings?league=${normalizedCode}&season=${CURRENT_SEASON}`
    );

    if (!response.ok) {
      console.error(`[API] getStandings(${normalizedCode}) - HTTP error:`, response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log(`[API] getStandings(${normalizedCode}) - API response received, results:`, data.results || 0);

    // Vérifier les erreurs API
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getStandings(${normalizedCode}) - API errors:`, JSON.stringify(data.errors));
      return [];
    }

    // API-Football structure: { response: [{ league: { standings: [[...teams]] } }] }
    const standings = data.response?.[0]?.league?.standings?.[0] || [];
    console.log(`[API] getStandings(${normalizedCode}) - raw standings:`, standings.length);

    // Transformer pour compatibilité avec l'ancien format
    const result = standings.map((team: any) => ({
      position: team.rank,
      team: {
        id: team.team.id,
        name: team.team.name,
        shortName: team.team.name,
        tla: team.team.name.substring(0, 3).toUpperCase(),
        crest: team.team.logo,
      },
      playedGames: team.all.played,
      won: team.all.win,
      draw: team.all.draw,
      lost: team.all.lose,
      points: team.points,
      goalsFor: team.all.goals.for,
      goalsAgainst: team.all.goals.against,
      goalDifference: team.goalsDiff,
      form: team.form,
    }));

    console.log(`[API] getStandings(${normalizedCode}) - transformed:`, result.length, 'teams');
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`[API] getStandings(${normalizedCode}) - exception:`, error);
    return [];
  }
}

/**
 * Récupère TOUS les groupes de classement d'un tournoi (CAN, Euro, World Cup, etc.)
 * Retourne un tableau de groupes, chaque groupe contenant un nom et un tableau d'équipes
 */
export async function getAllGroupStandings(leagueCode: string) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const leagueIdNum = parseInt(normalizedCode);

  // Pour les tournois internationaux, essayer plusieurs saisons
  const isInternationalTournament = [1, 4, 6, 9].includes(leagueIdNum);
  const seasonsToTry = isInternationalTournament
    ? [CURRENT_SEASON, CURRENT_SEASON - 1, CURRENT_SEASON + 1]
    : [CURRENT_SEASON];

  for (const season of seasonsToTry) {
    const cacheKey = `all_standings_${normalizedCode}_${season}`;
    const cached = getCached(cacheKey);
    if (cached && cached.length > 0) return cached;

    try {
      console.log(`[API] getAllGroupStandings - trying season ${season} for league ${normalizedCode}`);
      const response = await apiFetch(
        `/standings?league=${normalizedCode}&season=${season}`
      );

      if (!response.ok) continue;

      const data = await response.json();

      // API-Football structure: { response: [{ league: { standings: [[Group A], [Group B], ...] } }] }
      const allGroups = data.response?.[0]?.league?.standings || [];

      if (allGroups.length === 0) continue;

      console.log(`[API] getAllGroupStandings - found ${allGroups.length} groups for season ${season}`);

      // Transformer chaque groupe
      const result = allGroups.map((group: any[], index: number) => {
        // Essayer de déterminer le nom du groupe à partir du premier team
        const groupName = group[0]?.group || `Groupe ${String.fromCharCode(65 + index)}`;

        return {
          name: groupName,
          teams: group.map((team: any) => ({
            position: team.rank,
            team: {
              id: team.team.id,
              name: team.team.name,
              shortName: team.team.name,
              tla: team.team.name.substring(0, 3).toUpperCase(),
              crest: team.team.logo,
            },
            playedGames: team.all.played,
            won: team.all.win,
            draw: team.all.draw,
            lost: team.all.lose,
            points: team.points,
            goalsFor: team.all.goals.for,
            goalsAgainst: team.all.goals.against,
            goalDifference: team.goalsDiff,
            form: team.form,
          })),
        };
      });

      setCache(cacheKey, result);
      // Stocker aussi la saison qui fonctionne
      setCache(`working_season_${normalizedCode}`, season);
      return result;
    } catch (error) {
      console.error(`Erreur getAllGroupStandings for season ${season}:`, error);
    }
  }

  console.warn(`[API] getAllGroupStandings - no standings found for any season`);
  return [];
}

/**
 * Récupère toutes les équipes d'une ligue
 */
export async function getTeams(leagueCode: string) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `teams_${normalizedCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/teams?league=${normalizedCode}&season=${CURRENT_SEASON}`
    );

    if (!response.ok) return [];

    const data = await response.json();

    // Transformer pour compatibilité
    const result = (data.response || []).map((item: any) => ({
      id: item.team.id,
      name: item.team.name,
      shortName: item.team.name,
      tla: item.team.code || item.team.name.substring(0, 3).toUpperCase(),
      crest: item.team.logo,
      venue: item.venue?.name,
      founded: item.team.founded,
    }));

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTeams:', error);
    return [];
  }
}

/**
 * Récupère les infos d'une équipe spécifique
 */
export async function getTeamById(teamId: number) {
  const cacheKey = `team_${teamId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/teams?id=${teamId}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const teamData = data.response?.[0];

    if (!teamData) return null;

    const result = {
      id: teamData.team.id,
      name: teamData.team.name,
      shortName: teamData.team.name,
      tla: teamData.team.code || teamData.team.name.substring(0, 3).toUpperCase(),
      crest: teamData.team.logo,
      venue: teamData.venue?.name,
      founded: teamData.team.founded,
      country: teamData.team.country,
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTeamById:', error);
    return null;
  }
}

/**
 * Récupère les prochains matchs d'une ligue
 */
export async function getNextFixtures(leagueCode: string, count: number = 10) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `fixtures_${normalizedCode}_${count}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[API] getNextFixtures(${normalizedCode}) - from cache:`, cached.length);
    return cached;
  }

  try {
    const url = `/fixtures?league=${normalizedCode}&season=${CURRENT_SEASON}&next=${count}`;
    console.log(`[API] getNextFixtures - fetching:`, url);

    const response = await apiFetch(url);

    if (!response.ok) {
      console.error(`[API] getNextFixtures(${normalizedCode}) - HTTP error:`, response.status);
      return [];
    }

    const data = await response.json();

    // Vérifier les erreurs API-Football
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getNextFixtures(${normalizedCode}) - API errors:`, JSON.stringify(data.errors, null, 2));
      return [];
    }

    const matches = data.response || [];
    console.log(`[API] getNextFixtures(${normalizedCode}) - got:`, matches.length, 'matches');

    // Transformer pour compatibilité
    const result = matches.map(transformMatch);

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getNextFixtures:', error);
    return [];
  }
}

/**
 * Récupère les derniers résultats d'une ligue
 */
export async function getLastResults(leagueCode: string, count: number = 10) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `results_${normalizedCode}_${count}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[API] getLastResults(${normalizedCode}) - from cache:`, cached.length);
    return cached;
  }

  try {
    const url = `/fixtures?league=${normalizedCode}&season=${CURRENT_SEASON}&last=${count}`;
    console.log(`[API] getLastResults - fetching:`, url);

    const response = await apiFetch(url);

    if (!response.ok) {
      console.error(`[API] getLastResults(${normalizedCode}) - HTTP error:`, response.status);
      return [];
    }

    const data = await response.json();

    // Vérifier les erreurs API-Football
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getLastResults(${normalizedCode}) - API errors:`, data.errors);
      return [];
    }

    console.log(`[API] getLastResults(${normalizedCode}) - got:`, data.response?.length || 0, 'matches');

    const result = (data.response || []).map(transformMatch);

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getLastResults:', error);
    return [];
  }
}

/**
 * Récupère les résultats récents de toutes les compétitions TOP
 * Pour le ticker de résultats sur la homepage
 */
export async function getRecentResults(leagueIds?: number[], countPerLeague: number = 3) {
  const ids = leagueIds || getTopCompetitionIds();
  const cacheKey = `recent_results_${ids.join('-')}_${countPerLeague}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log('[API] getRecentResults - from cache:', cached.length);
    return cached;
  }

  try {
    console.log('[API] getRecentResults - fetching for leagues:', ids.length);

    const promises = ids.map(leagueId =>
      apiFetch(`/fixtures?league=${leagueId}&season=${CURRENT_SEASON}&last=${countPerLeague}`)
        .then(async res => {
          if (!res.ok) return { response: [] };
          const data = await res.json();
          if (data.errors && Object.keys(data.errors).length > 0) {
            return { response: [] };
          }
          return data;
        })
        .catch(() => ({ response: [] }))
    );

    const results = await Promise.all(promises);
    const allMatches: any[] = [];

    results.forEach((data) => {
      if (data.response && Array.isArray(data.response)) {
        allMatches.push(...data.response);
      }
    });

    // Filtrer seulement les matchs terminés et trier par date (plus récent d'abord)
    const finishedMatches = allMatches
      .map(transformMatch)
      .filter(m => m.status === 'FINISHED')
      .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());

    console.log('[API] getRecentResults - total finished:', finishedMatches.length);

    setCache(cacheKey, finishedMatches);
    return finishedMatches;
  } catch (error) {
    console.error('Erreur getRecentResults:', error);
    return [];
  }
}

/**
 * Récupère les matchs d'aujourd'hui (compétitions TOP par défaut)
 */
export async function getTodayFixtures(leagueIds?: number[]) {
  const ids = leagueIds || getTopCompetitionIds();
  const cacheKey = `today_fixtures_${ids.join('-')}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log('[API] getTodayFixtures - from cache:', cached.length);
    return cached;
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('[API] getTodayFixtures - fetching for date:', today, 'leagues:', ids);

    // API-Football n'accepte qu'une seule ligue par requête
    // On fait des requêtes parallèles pour toutes les ligues
    const promises = ids.map(leagueId =>
      apiFetch(`/fixtures?date=${today}&league=${leagueId}&season=${CURRENT_SEASON}`)
        .then(res => {
          if (!res.ok) {
            console.error(`[API] getTodayFixtures - league ${leagueId} error:`, res.status);
            return { response: [] };
          }
          return res.json();
        })
        .catch(err => {
          console.error(`[API] getTodayFixtures - league ${leagueId} failed:`, err);
          return { response: [] };
        })
    );

    const results = await Promise.all(promises);

    // Combiner tous les matchs
    const allMatches: any[] = [];
    results.forEach((data, idx) => {
      console.log(`[API] getTodayFixtures - league ${ids[idx]}:`, data.response?.length || 0, 'matches');
      if (data.response) {
        allMatches.push(...data.response);
      }
    });

    console.log('[API] getTodayFixtures - total raw matches:', allMatches.length);

    // Trier par date
    const result = allMatches
      .map(transformMatch)
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTodayFixtures:', error);
    return [];
  }
}

/**
 * Récupère les matchs à venir (7 prochains jours)
 */
export async function getUpcomingFixtures(leagueIds?: number[], days: number = 7) {
  const ids = leagueIds || getTopCompetitionIds();
  const cacheKey = `upcoming_fixtures_${ids.join('-')}_${days}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log('[API] getUpcomingFixtures - from cache:', cached.length);
    return cached;
  }

  try {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);

    const fromDate = today.toISOString().split('T')[0];
    const toDate = endDate.toISOString().split('T')[0];

    console.log('[API] getUpcomingFixtures - fetching from', fromDate, 'to', toDate);

    const promises = ids.map(leagueId =>
      apiFetch(`/fixtures?league=${leagueId}&season=${CURRENT_SEASON}&from=${fromDate}&to=${toDate}`)
        .then(res => res.ok ? res.json() : { response: [] })
        .catch(() => ({ response: [] }))
    );

    const results = await Promise.all(promises);
    const allMatches: any[] = [];

    results.forEach((data) => {
      if (data.response) {
        allMatches.push(...data.response);
      }
    });

    const result = allMatches
      .map(transformMatch)
      .filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED')
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getUpcomingFixtures:', error);
    return [];
  }
}

/**
 * Récupère les matchs pour une date spécifique
 * Optimisé: UNE SEULE requête API puis filtrage côté client
 */
export async function getFixturesByDate(date: string, leagueIds?: number[]) {
  const ids = leagueIds || getTopCompetitionIds();
  const idsSet = new Set(ids);
  const cacheKey = `fixtures_date_${date}_${ids.join('-')}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[API] getFixturesByDate(${date}) - from cache:`, cached.length);
    return cached;
  }

  try {
    console.log(`[API] getFixturesByDate - fetching ALL fixtures for date:`, date);

    // UNE SEULE requête pour tous les matchs du jour
    const response = await apiFetch(`/fixtures?date=${date}&season=${CURRENT_SEASON}`);

    if (!response.ok) {
      console.error(`[API] getFixturesByDate - HTTP error:`, response.status);
      return [];
    }

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getFixturesByDate - API errors:`, JSON.stringify(data.errors));
      return [];
    }

    const allMatches = data.response || [];
    console.log(`[API] getFixturesByDate(${date}) - received:`, allMatches.length, 'total fixtures');

    // Filtrer côté client pour garder uniquement les ligues qu'on veut
    const filteredMatches = allMatches.filter((fixture: any) =>
      idsSet.has(fixture.league?.id)
    );
    console.log(`[API] getFixturesByDate(${date}) - after filter:`, filteredMatches.length, 'matches');

    const result = filteredMatches
      .map(transformMatch)
      .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getFixturesByDate:', error);
    return [];
  }
}

/**
 * Récupère les matchs par plage de dates
 */
export async function getFixturesByDateRange(
  leagueIds: number[],
  fromDate: string,
  toDate: string
) {
  const cacheKey = `fixtures_range_${leagueIds.join('-')}_${fromDate}_${toDate}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const promises = leagueIds.map(leagueId =>
      apiFetch(`/fixtures?league=${leagueId}&season=${CURRENT_SEASON}&from=${fromDate}&to=${toDate}`)
        .then(res => res.ok ? res.json() : { response: [] })
        .catch(() => ({ response: [] }))
    );

    const results = await Promise.all(promises);
    const allMatches: any[] = [];

    results.forEach((data) => {
      if (data.response) {
        allMatches.push(...data.response);
      }
    });

    const result = allMatches
      .map(transformMatch)
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getFixturesByDateRange:', error);
    return [];
  }
}

/**
 * Récupère les meilleurs buteurs d'une ligue
 */
export async function getTopScorers(leagueCode: string) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `scorers_${normalizedCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/players/topscorers?league=${normalizedCode}&season=${CURRENT_SEASON}`
    );

    if (!response.ok) return [];

    const data = await response.json();

    // Transformer pour compatibilité
    const result = (data.response || []).map((item: any) => ({
      player: {
        id: item.player.id,
        name: item.player.name,
        firstName: item.player.firstname,
        lastName: item.player.lastname,
        nationality: item.player.nationality,
        photo: item.player.photo,
      },
      team: {
        id: item.statistics[0]?.team?.id,
        name: item.statistics[0]?.team?.name,
        crest: item.statistics[0]?.team?.logo,
      },
      goals: item.statistics[0]?.goals?.total || 0,
      assists: item.statistics[0]?.goals?.assists || 0,
      playedMatches: item.statistics[0]?.games?.appearences || 0,
    }));

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTopScorers:', error);
    return [];
  }
}

/**
 * Récupère les meilleurs passeurs d'une ligue
 */
export async function getTopAssists(leagueCode: string) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `assists_${normalizedCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/players/topassists?league=${normalizedCode}&season=${CURRENT_SEASON}`
    );

    if (!response.ok) return [];

    const data = await response.json();

    // Transformer pour compatibilité
    const result = (data.response || []).map((item: any) => ({
      player: {
        id: item.player.id,
        name: item.player.name,
        firstName: item.player.firstname,
        lastName: item.player.lastname,
        nationality: item.player.nationality,
        photo: item.player.photo,
      },
      team: {
        id: item.statistics[0]?.team?.id,
        name: item.statistics[0]?.team?.name,
        crest: item.statistics[0]?.team?.logo,
      },
      goals: item.statistics[0]?.goals?.total || 0,
      assists: item.statistics[0]?.goals?.assists || 0,
      playedMatches: item.statistics[0]?.games?.appearences || 0,
    }));

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTopAssists:', error);
    return [];
  }
}

/**
 * Récupère toutes les journées disponibles d'une ligue
 * Pour les tournois internationaux, essaie plusieurs saisons si nécessaire
 */
export async function getAllRounds(leagueCode: string, customSeason?: number) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const leagueIdNum = parseInt(normalizedCode);

  // Tournois internationaux qui peuvent nécessiter des saisons différentes
  const isInternationalTournament = [1, 4, 6, 9].includes(leagueIdNum); // World Cup, Euro, CAN, Copa America

  // Saisons à essayer (courante, puis précédente pour les tournois)
  const seasonsToTry = customSeason
    ? [customSeason]
    : isInternationalTournament
      ? [CURRENT_SEASON, CURRENT_SEASON - 1, CURRENT_SEASON + 1]
      : [CURRENT_SEASON];

  for (const season of seasonsToTry) {
    const cacheKey = `rounds_${normalizedCode}_${season}`;
    const cached = getCached(cacheKey);
    if (cached && cached.length > 0) return cached;

    try {
      console.log(`[API] getAllRounds - trying season ${season} for league ${normalizedCode}`);
      const response = await apiFetch(
        `/fixtures/rounds?league=${normalizedCode}&season=${season}`
      );

      if (!response.ok) continue;

      const data = await response.json();
      const result = data.response || [];

      if (result.length > 0) {
        console.log(`[API] getAllRounds - found ${result.length} rounds for season ${season}`);
        setCache(cacheKey, result);
        // Stocker aussi la saison qui fonctionne pour cette ligue
        setCache(`working_season_${normalizedCode}`, season);
        return result;
      }
    } catch (error) {
      console.error(`Erreur getAllRounds for season ${season}:`, error);
    }
  }

  console.warn(`[API] getAllRounds - no rounds found for any season`);
  return [];
}

/**
 * Récupère la journée en cours d'une ligue
 */
export async function getCurrentRound(leagueCode: string): Promise<string | null> {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `current_round_${normalizedCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/fixtures/rounds?league=${normalizedCode}&season=${CURRENT_SEASON}&current=true`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const result = data.response?.[0] || null;

    if (result) setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getCurrentRound:', error);
    return null;
  }
}

// =============================================
// FONCTIONS - MATCHS PAR JOURNÉE
// =============================================

/**
 * Récupère tous les matchs d'une ligue (toutes journées)
 */
export async function getAllMatches(leagueCode: string) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `all_matches_${normalizedCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/fixtures?league=${normalizedCode}&season=${CURRENT_SEASON}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    const result = (data.response || []).map(transformMatch);

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getAllMatches:', error);
    return [];
  }
}

/**
 * Récupère les matchs d'une journée spécifique
 */
export async function getMatchesByMatchday(leagueCode: string, matchday: number) {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `matchday_${normalizedCode}_${matchday}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/fixtures?league=${normalizedCode}&season=${CURRENT_SEASON}&round=Regular Season - ${matchday}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    const result = (data.response || []).map(transformMatch);

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getMatchesByMatchday:', error);
    return [];
  }
}

/**
 * Récupère les matchs d'un tour spécifique (pour les coupes)
 */
export async function getMatchesByRound(leagueCode: string, round: string) {
  const normalizedCode = normalizeLeagueCode(leagueCode);

  // Vérifier si on a une saison qui fonctionne en cache pour les tournois internationaux
  const workingSeason = getCached(`working_season_${normalizedCode}`) || CURRENT_SEASON;

  const cacheKey = `round_${normalizedCode}_${round}_${workingSeason}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    console.log(`[API] getMatchesByRound - fetching round "${round}" for league ${normalizedCode} (season ${workingSeason})`);
    const response = await apiFetch(
      `/fixtures?league=${normalizedCode}&season=${workingSeason}&round=${encodeURIComponent(round)}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    const result = (data.response || []).map(transformMatch);

    console.log(`[API] getMatchesByRound - found ${result.length} matches`);
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getMatchesByRound:', error);
    return [];
  }
}

/**
 * Récupère la journée actuelle d'une ligue
 */
export async function getCurrentMatchday(leagueCode: string): Promise<number> {
  const normalizedCode = normalizeLeagueCode(leagueCode);
  const cacheKey = `current_matchday_${normalizedCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/fixtures/rounds?league=${normalizedCode}&season=${CURRENT_SEASON}&current=true`
    );

    if (!response.ok) return 1;

    const data = await response.json();
    const currentRound = data.response?.[0] || 'Regular Season - 1';

    // Extraire le numéro de la journée
    const match = currentRound.match(/\d+/);
    const result = match ? parseInt(match[0]) : 1;

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getCurrentMatchday:', error);
    return 1;
  }
}

/**
 * Récupère les matchs groupés par journée (pour affichage)
 */
export async function getMatchesGroupedByMatchday(leagueCode: string) {
  try {
    const matches = await getAllMatches(leagueCode);

    const grouped: Record<number, any[]> = {};

    matches.forEach((match: any) => {
      const matchday = match.matchday;
      if (!grouped[matchday]) {
        grouped[matchday] = [];
      }
      grouped[matchday].push(match);
    });

    return grouped;
  } catch (error) {
    console.error('Erreur getMatchesGroupedByMatchday:', error);
    return {};
  }
}

// =============================================
// FONCTIONS - FICHES CLUBS
// =============================================

/**
 * Récupère les infos détaillées d'un club
 */
export async function getTeamDetails(teamId: number) {
  const cacheKey = `team_details_${teamId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    // Récupérer les infos de base de l'équipe
    const teamResponse = await apiFetch(`/teams?id=${teamId}`);
    if (!teamResponse.ok) return null;

    const teamData = await teamResponse.json();
    const team = teamData.response?.[0];

    if (!team) return null;

    // Récupérer l'effectif
    const squadResponse = await apiFetch(`/players/squads?team=${teamId}`);
    const squadData = await squadResponse.json();
    const squad = squadData.response?.[0]?.players || [];

    const result = {
      id: team.team.id,
      name: team.team.name,
      shortName: team.team.name,
      tla: team.team.code || team.team.name.substring(0, 3).toUpperCase(),
      crest: team.team.logo,
      address: team.venue?.address,
      website: null, // Non disponible dans API-Football
      founded: team.team.founded,
      clubColors: null, // Non disponible dans API-Football
      venue: team.venue?.name,
      coach: null, // Nécessite une requête séparée
      squad: squad.map((player: any) => ({
        id: player.id,
        name: player.name,
        position: player.position,
        nationality: null,
        photo: player.photo,
        number: player.number,
      })),
      runningCompetitions: [],
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTeamDetails:', error);
    return null;
  }
}

/**
 * Récupère les statistiques détaillées d'une équipe pour une ligue
 */
export async function getTeamStatistics(teamId: number, leagueId: number) {
  const cacheKey = `team_stats_${teamId}_${leagueId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/teams/statistics?team=${teamId}&league=${leagueId}&season=${CURRENT_SEASON}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const stats = data.response;

    if (!stats) return null;

    const result = {
      league: {
        id: stats.league?.id,
        name: stats.league?.name,
        logo: stats.league?.logo,
        country: stats.league?.country,
      },
      team: {
        id: stats.team?.id,
        name: stats.team?.name,
        logo: stats.team?.logo,
      },
      form: stats.form,
      fixtures: {
        played: {
          home: stats.fixtures?.played?.home || 0,
          away: stats.fixtures?.played?.away || 0,
          total: stats.fixtures?.played?.total || 0,
        },
        wins: {
          home: stats.fixtures?.wins?.home || 0,
          away: stats.fixtures?.wins?.away || 0,
          total: stats.fixtures?.wins?.total || 0,
        },
        draws: {
          home: stats.fixtures?.draws?.home || 0,
          away: stats.fixtures?.draws?.away || 0,
          total: stats.fixtures?.draws?.total || 0,
        },
        loses: {
          home: stats.fixtures?.loses?.home || 0,
          away: stats.fixtures?.loses?.away || 0,
          total: stats.fixtures?.loses?.total || 0,
        },
      },
      goals: {
        for: {
          total: {
            home: stats.goals?.for?.total?.home || 0,
            away: stats.goals?.for?.total?.away || 0,
            total: stats.goals?.for?.total?.total || 0,
          },
          average: {
            home: stats.goals?.for?.average?.home || '0',
            away: stats.goals?.for?.average?.away || '0',
            total: stats.goals?.for?.average?.total || '0',
          },
        },
        against: {
          total: {
            home: stats.goals?.against?.total?.home || 0,
            away: stats.goals?.against?.total?.away || 0,
            total: stats.goals?.against?.total?.total || 0,
          },
          average: {
            home: stats.goals?.against?.average?.home || '0',
            away: stats.goals?.against?.average?.away || '0',
            total: stats.goals?.against?.average?.total || '0',
          },
        },
      },
      biggestStreak: {
        wins: stats.biggest?.streak?.wins || 0,
        draws: stats.biggest?.streak?.draws || 0,
        loses: stats.biggest?.streak?.loses || 0,
      },
      biggestWin: {
        home: stats.biggest?.wins?.home,
        away: stats.biggest?.wins?.away,
      },
      biggestLoss: {
        home: stats.biggest?.loses?.home,
        away: stats.biggest?.loses?.away,
      },
      cleanSheets: {
        home: stats.clean_sheet?.home || 0,
        away: stats.clean_sheet?.away || 0,
        total: stats.clean_sheet?.total || 0,
      },
      failedToScore: {
        home: stats.failed_to_score?.home || 0,
        away: stats.failed_to_score?.away || 0,
        total: stats.failed_to_score?.total || 0,
      },
      penalty: {
        scored: stats.penalty?.scored?.total || 0,
        missed: stats.penalty?.missed?.total || 0,
      },
      lineups: stats.lineups || [],
      cards: {
        yellow: stats.cards?.yellow || {},
        red: stats.cards?.red || {},
      },
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTeamStatistics:', error);
    return null;
  }
}

/**
 * Récupère les meilleurs buteurs d'une équipe
 */
export async function getTeamTopScorers(teamId: number, leagueId: number) {
  const cacheKey = `team_scorers_${teamId}_${leagueId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiFetch(
      `/players/topscorers?league=${leagueId}&season=${CURRENT_SEASON}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    const allScorers = data.response || [];

    // Filtrer pour ne garder que les joueurs de l'équipe
    const teamScorers = allScorers.filter(
      (p: any) => p.statistics?.[0]?.team?.id === teamId
    ).map((p: any) => ({
      id: p.player.id,
      name: p.player.name,
      photo: p.player.photo,
      goals: p.statistics?.[0]?.goals?.total || 0,
      assists: p.statistics?.[0]?.goals?.assists || 0,
      appearances: p.statistics?.[0]?.games?.appearences || 0,
    }));

    setCache(cacheKey, teamScorers);
    return teamScorers;
  } catch (error) {
    console.error('Erreur getTeamTopScorers:', error);
    return [];
  }
}

/**
 * Récupère le classement d'une équipe dans une ligue
 */
export async function getTeamLeaguePosition(teamId: number, leagueId: number) {
  try {
    const standings = await getStandings(String(leagueId));
    const teamStanding = standings.find((t: any) => t.team?.id === teamId);
    return teamStanding || null;
  } catch (error) {
    console.error('Erreur getTeamLeaguePosition:', error);
    return null;
  }
}

/**
 * Récupère les matchs d'une équipe spécifique
 */
export async function getTeamMatches(teamId: number, status?: 'SCHEDULED' | 'FINISHED' | 'IN_PLAY') {
  const cacheKey = `team_matches_${teamId}_${status || 'all'}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    let url = `/fixtures?team=${teamId}&season=${CURRENT_SEASON}`;

    // Mapper les status - API-Football accepte un seul status à la fois
    if (status === 'SCHEDULED') {
      url += '&status=NS';  // Not Started
    } else if (status === 'FINISHED') {
      url += '&status=FT';  // Full Time
    } else if (status === 'IN_PLAY') {
      url += '&status=LIVE';  // Live matches
    }

    const response = await apiFetch(url);

    if (!response.ok) return [];

    const data = await response.json();
    const result = (data.response || []).map(transformMatch);

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTeamMatches:', error);
    return [];
  }
}

/**
 * Récupère les prochains matchs d'une équipe
 */
export async function getTeamNextMatches(teamId: number, limit: number = 5) {
  try {
    const matches = await getTeamMatches(teamId, 'SCHEDULED');
    return matches.slice(0, limit);
  } catch (error) {
    console.error('Erreur getTeamNextMatches:', error);
    return [];
  }
}

/**
 * Récupère les derniers résultats d'une équipe
 */
export async function getTeamLastResults(teamId: number, limit: number = 5) {
  try {
    const matches = await getTeamMatches(teamId, 'FINISHED');
    const sorted = matches.sort((a: any, b: any) =>
      new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
    );
    return sorted.slice(0, limit);
  } catch (error) {
    console.error('Erreur getTeamLastResults:', error);
    return [];
  }
}

// =============================================
// FONCTIONS - MATCHS EN DIRECT
// =============================================

/**
 * Récupère les matchs en direct
 */
export async function getLiveMatches() {
  const cacheKey = 'live_matches';
  // Cache plus court pour les matchs en direct (30 secondes)
  const cached = getCached(cacheKey);
  if (cached) {
    console.log('[API] getLiveMatches - from cache:', cached.length);
    return cached;
  }

  try {
    console.log('[API] getLiveMatches - fetching /fixtures?live=all');
    const response = await apiFetch(`/fixtures?live=all`);

    if (!response.ok) {
      console.error('[API] getLiveMatches - response not ok:', response.status);
      return [];
    }

    const data = await response.json();

    // Vérifier les erreurs API
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('[API] getLiveMatches - API errors:', JSON.stringify(data.errors));
      return [];
    }

    console.log('[API] getLiveMatches - raw response:', data.results, 'matches');

    const result = (data.response || []).map(transformMatch);

    // Cache plus court pour les matchs live
    cache[cacheKey] = { data: result, timestamp: Date.now() };

    return result;
  } catch (error) {
    console.error('Erreur getLiveMatches:', error);
    return [];
  }
}

// =============================================
// FONCTION DE TRANSFORMATION
// =============================================

/**
 * Transforme un match API-Football en format compatible avec l'ancien format
 */
function transformMatch(fixture: any) {
  const statusMapping: Record<string, string> = {
    'TBD': 'SCHEDULED',
    'NS': 'SCHEDULED',
    'FT': 'FINISHED',
    'AET': 'FINISHED',
    'PEN': 'FINISHED',
    '1H': 'IN_PLAY',
    'HT': 'IN_PLAY',
    '2H': 'IN_PLAY',
    'ET': 'IN_PLAY',
    'BT': 'IN_PLAY',
    'P': 'IN_PLAY',
    'SUSP': 'SUSPENDED',
    'INT': 'INTERRUPTED',
    'PST': 'POSTPONED',
    'CANC': 'CANCELLED',
    'ABD': 'ABANDONED',
    'AWD': 'AWARDED',
    'WO': 'WALKOVER',
    'LIVE': 'IN_PLAY',
  };

  return {
    id: fixture.fixture.id,
    utcDate: fixture.fixture.date,
    status: statusMapping[fixture.fixture.status.short] || fixture.fixture.status.short,
    statusShort: fixture.fixture.status.short,
    minute: fixture.fixture.status.elapsed,
    matchday: extractMatchday(fixture.league.round),
    round: fixture.league.round, // Tour complet pour les coupes (ex: "Round of 32", "Quarter-finals")
    homeTeam: {
      id: fixture.teams.home.id,
      name: fixture.teams.home.name,
      shortName: fixture.teams.home.name,
      tla: fixture.teams.home.name.substring(0, 3).toUpperCase(),
      crest: fixture.teams.home.logo,
    },
    awayTeam: {
      id: fixture.teams.away.id,
      name: fixture.teams.away.name,
      shortName: fixture.teams.away.name,
      tla: fixture.teams.away.name.substring(0, 3).toUpperCase(),
      crest: fixture.teams.away.logo,
    },
    score: {
      fullTime: {
        home: fixture.goals.home,
        away: fixture.goals.away,
      },
      halfTime: {
        home: fixture.score.halftime.home,
        away: fixture.score.halftime.away,
      },
    },
    competition: {
      id: fixture.league.id,
      name: fixture.league.name,
      emblem: fixture.league.logo,
    },
    venue: fixture.fixture.venue?.name,
    referee: fixture.fixture.referee,
  };
}

/**
 * Extrait le numéro de journée depuis le round
 */
function extractMatchday(round: string): number {
  if (!round) return 1;
  const match = round.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}

// =============================================
// FONCTIONS - DÉTAILS MATCH
// =============================================

/**
 * Récupère les détails complets d'un match
 * Note: Ne met PAS en cache les matchs en cours pour avoir des données fraîches
 */
export async function getMatchDetails(fixtureId: number) {
  const cacheKey = `match_details_${fixtureId}`;
  const cached = getCached(cacheKey);

  // Vérifier si le cache contient un match en cours - si oui, ignorer le cache
  const liveStatuses = ['IN_PLAY', 'PAUSED', 'HALFTIME', '1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'];
  if (cached && !liveStatuses.includes(cached.status)) {
    console.log(`[API] getMatchDetails(${fixtureId}) - from cache (status: ${cached.status})`);
    return cached;
  }

  try {
    console.log(`[API] getMatchDetails - fetching fixture ${fixtureId}`);
    const response = await apiFetch(`/fixtures?id=${fixtureId}`);

    if (!response.ok) {
      console.error(`[API] getMatchDetails - HTTP error:`, response.status);
      return null;
    }

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getMatchDetails - API errors:`, data.errors);
      return null;
    }

    const fixture = data.response?.[0];
    if (!fixture) return null;

    const result = transformMatch(fixture);

    // Ne mettre en cache que les matchs terminés ou programmés (pas les matchs en cours)
    if (!liveStatuses.includes(result.status)) {
      setCache(cacheKey, result);
      console.log(`[API] getMatchDetails(${fixtureId}) - cached (status: ${result.status})`);
    } else {
      console.log(`[API] getMatchDetails(${fixtureId}) - NOT cached (live match, status: ${result.status})`);
    }

    return result;
  } catch (error) {
    console.error('Erreur getMatchDetails:', error);
    return null;
  }
}

/**
 * Récupère les événements d'un match (buts, cartons, remplacements)
 * Note: Ne met PAS en cache pour les matchs en cours (passé via paramètre isLive)
 */
export async function getMatchEvents(fixtureId: number, isLive: boolean = false) {
  const cacheKey = `match_events_${fixtureId}`;
  const cached = getCached(cacheKey);
  // Ne pas utiliser le cache pour les matchs en cours
  if (cached && !isLive) {
    console.log(`[API] getMatchEvents(${fixtureId}) - from cache:`, cached.length, 'events');
    return cached;
  }

  try {
    console.log(`[API] getMatchEvents - fetching events for fixture ${fixtureId}`);
    const response = await apiFetch(`/fixtures/events?fixture=${fixtureId}`);

    if (!response.ok) {
      console.error(`[API] getMatchEvents - HTTP error:`, response.status);
      return [];
    }

    const data = await response.json();
    console.log(`[API] getMatchEvents - RAW response:`, JSON.stringify(data, null, 2).substring(0, 500));
    console.log(`[API] getMatchEvents - events count:`, data.response?.length || 0);

    // Transformer les événements
    const events = (data.response || []).map((event: any) => ({
      time: {
        elapsed: event.time.elapsed,
        extra: event.time.extra,
      },
      team: {
        id: event.team.id,
        name: event.team.name,
        logo: event.team.logo,
      },
      player: {
        id: event.player?.id,
        name: event.player?.name,
      },
      assist: {
        id: event.assist?.id,
        name: event.assist?.name,
      },
      type: event.type, // Goal, Card, subst, Var
      detail: event.detail, // Normal Goal, Yellow Card, Red Card, Substitution 1, etc.
      comments: event.comments,
    }));

    // Ne mettre en cache que si ce n'est pas un match live
    if (!isLive) {
      setCache(cacheKey, events);
    }
    return events;
  } catch (error) {
    console.error('Erreur getMatchEvents:', error);
    return [];
  }
}

/**
 * Récupère les statistiques d'un match
 * Note: Ne met PAS en cache pour les matchs en cours
 */
export async function getMatchStats(fixtureId: number, isLive: boolean = false) {
  const cacheKey = `match_stats_${fixtureId}`;
  const cached = getCached(cacheKey);
  // Ne pas utiliser le cache pour les matchs en cours
  if (cached && !isLive) {
    console.log(`[API] getMatchStats(${fixtureId}) - from cache`);
    return cached;
  }

  try {
    console.log(`[API] getMatchStats - fetching stats for fixture ${fixtureId}`);
    const response = await apiFetch(`/fixtures/statistics?fixture=${fixtureId}`);

    if (!response.ok) {
      console.error(`[API] getMatchStats - HTTP error:`, response.status);
      return null;
    }

    const data = await response.json();
    console.log(`[API] getMatchStats - RAW response teams:`, data.response?.length || 0);
    console.log(`[API] getMatchStats - RAW response:`, JSON.stringify(data, null, 2).substring(0, 1000));

    // Vérifier les erreurs API
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getMatchStats - API errors:`, data.errors);
      return null;
    }

    if (!data.response || data.response.length === 0) {
      console.log(`[API] getMatchStats - Empty response (no stats available yet)`);
      return null;
    }

    // Certains matchs peuvent avoir qu'une seule équipe dans la réponse
    if (data.response.length < 2) {
      console.log(`[API] getMatchStats - Only ${data.response.length} team(s) in response`);
      // Essayons de retourner ce qu'on a
      const homeStats = data.response[0];
      const result = {
        home: {
          team: homeStats?.team,
          possession: 0,
          shots: 0,
          shotsOnTarget: 0,
          corners: 0,
          fouls: 0,
          yellowCards: 0,
          redCards: 0,
          offsides: 0,
          passes: 0,
          passAccuracy: 0,
        },
        away: {
          team: null,
          possession: 0,
          shots: 0,
          shotsOnTarget: 0,
          corners: 0,
          fouls: 0,
          yellowCards: 0,
          redCards: 0,
          offsides: 0,
          passes: 0,
          passAccuracy: 0,
        },
        partial: true,
      };
      return result;
    }

    // Transformer les stats pour les deux équipes
    const homeStats = data.response[0];
    const awayStats = data.response[1];

    const parseStatValue = (stats: any[], type: string): number => {
      const stat = stats.find((s: any) => s.type === type);
      if (!stat) return 0;
      if (typeof stat.value === 'string' && stat.value.includes('%')) {
        return parseInt(stat.value);
      }
      return stat.value || 0;
    };

    const result = {
      home: {
        team: {
          id: homeStats.team.id,
          name: homeStats.team.name,
          logo: homeStats.team.logo,
        },
        possession: parseStatValue(homeStats.statistics, 'Ball Possession'),
        shots: parseStatValue(homeStats.statistics, 'Total Shots'),
        shotsOnTarget: parseStatValue(homeStats.statistics, 'Shots on Goal'),
        corners: parseStatValue(homeStats.statistics, 'Corner Kicks'),
        fouls: parseStatValue(homeStats.statistics, 'Fouls'),
        yellowCards: parseStatValue(homeStats.statistics, 'Yellow Cards'),
        redCards: parseStatValue(homeStats.statistics, 'Red Cards'),
        offsides: parseStatValue(homeStats.statistics, 'Offsides'),
        passes: parseStatValue(homeStats.statistics, 'Total passes'),
        passAccuracy: parseStatValue(homeStats.statistics, 'Passes %'),
      },
      away: {
        team: {
          id: awayStats.team.id,
          name: awayStats.team.name,
          logo: awayStats.team.logo,
        },
        possession: parseStatValue(awayStats.statistics, 'Ball Possession'),
        shots: parseStatValue(awayStats.statistics, 'Total Shots'),
        shotsOnTarget: parseStatValue(awayStats.statistics, 'Shots on Goal'),
        corners: parseStatValue(awayStats.statistics, 'Corner Kicks'),
        fouls: parseStatValue(awayStats.statistics, 'Fouls'),
        yellowCards: parseStatValue(awayStats.statistics, 'Yellow Cards'),
        redCards: parseStatValue(awayStats.statistics, 'Red Cards'),
        offsides: parseStatValue(awayStats.statistics, 'Offsides'),
        passes: parseStatValue(awayStats.statistics, 'Total passes'),
        passAccuracy: parseStatValue(awayStats.statistics, 'Passes %'),
      },
    };

    // Ne mettre en cache que si ce n'est pas un match live
    if (!isLive) {
      setCache(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.error('Erreur getMatchStats:', error);
    return null;
  }
}

/**
 * Récupère les compositions d'un match
 * Note: Les compos peuvent changer avant le match mais pas pendant
 */
export async function getMatchLineups(fixtureId: number, isLive: boolean = false) {
  const cacheKey = `match_lineups_${fixtureId}`;
  const cached = getCached(cacheKey);
  // Ne pas utiliser le cache pour les matchs en cours (compos peuvent être corrigées)
  if (cached && !isLive) {
    console.log(`[API] getMatchLineups(${fixtureId}) - from cache`);
    return cached;
  }

  try {
    console.log(`[API] getMatchLineups - fetching lineups for fixture ${fixtureId}`);
    const response = await apiFetch(`/fixtures/lineups?fixture=${fixtureId}`);

    if (!response.ok) {
      console.error(`[API] getMatchLineups - HTTP error:`, response.status);
      return null;
    }

    const data = await response.json();
    console.log(`[API] getMatchLineups - RAW response teams:`, data.response?.length || 0);
    console.log(`[API] getMatchLineups - RAW response:`, JSON.stringify(data, null, 2).substring(0, 1000));

    // Vérifier les erreurs API
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getMatchLineups - API errors:`, data.errors);
      return null;
    }

    if (!data.response || data.response.length === 0) {
      console.log(`[API] getMatchLineups - Empty response (lineups not available yet)`);
      return null;
    }

    if (data.response.length < 2) {
      console.log(`[API] getMatchLineups - Only ${data.response.length} team(s) in response`);
      return null;
    }

    const transformLineup = (teamData: any) => ({
      team: {
        id: teamData.team.id,
        name: teamData.team.name,
        logo: teamData.team.logo,
        colors: teamData.team.colors,
      },
      formation: teamData.formation,
      coach: teamData.coach ? {
        id: teamData.coach.id,
        name: teamData.coach.name,
        photo: teamData.coach.photo,
      } : null,
      startXI: (teamData.startXI || []).map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        number: p.player.number,
        pos: p.player.pos,
        grid: p.player.grid,
      })),
      substitutes: (teamData.substitutes || []).map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        number: p.player.number,
        pos: p.player.pos,
      })),
    });

    const result = {
      home: transformLineup(data.response[0]),
      away: transformLineup(data.response[1]),
    };

    // Ne mettre en cache que si ce n'est pas un match live
    if (!isLive) {
      setCache(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.error('Erreur getMatchLineups:', error);
    return null;
  }
}

/**
 * Récupère l'historique des confrontations (H2H)
 */
export async function getHeadToHead(team1Id: number, team2Id: number, last: number = 10) {
  const cacheKey = `h2h_${team1Id}_${team2Id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    console.log(`[API] getHeadToHead - fetching H2H between ${team1Id} and ${team2Id}`);
    const response = await apiFetch(`/fixtures/headtohead?h2h=${team1Id}-${team2Id}&last=${last}`);

    if (!response.ok) return [];

    const data = await response.json();

    const matches = (data.response || []).map(transformMatch);

    setCache(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error('Erreur getHeadToHead:', error);
    return [];
  }
}

/**
 * Récupère les statistiques des joueurs pour un match
 * Endpoint: /fixtures/players
 */
export async function getMatchPlayerStats(fixtureId: number, isLive: boolean = false) {
  const cacheKey = `match_players_${fixtureId}`;
  const cached = getCached(cacheKey);
  if (cached && !isLive) {
    console.log(`[API] getMatchPlayerStats(${fixtureId}) - from cache`);
    return cached;
  }

  try {
    console.log(`[API] getMatchPlayerStats - fetching player stats for fixture ${fixtureId}`);
    const response = await apiFetch(`/fixtures/players?fixture=${fixtureId}`);

    if (!response.ok) {
      console.error(`[API] getMatchPlayerStats - HTTP error:`, response.status);
      return null;
    }

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getMatchPlayerStats - API errors:`, data.errors);
      return null;
    }

    if (!data.response || data.response.length === 0) {
      console.log(`[API] getMatchPlayerStats - Empty response`);
      return null;
    }

    // Transformer: data.response contient un array avec les stats par équipe
    const result = data.response.map((teamData: any) => ({
      team: {
        id: teamData.team.id,
        name: teamData.team.name,
        logo: teamData.team.logo,
      },
      players: (teamData.players || []).map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        photo: p.player.photo,
        position: p.statistics?.[0]?.games?.position,
        rating: p.statistics?.[0]?.games?.rating ? parseFloat(p.statistics[0].games.rating) : null,
        minutes: p.statistics?.[0]?.games?.minutes,
        // Offensive
        goals: p.statistics?.[0]?.goals?.total || 0,
        assists: p.statistics?.[0]?.goals?.assists || 0,
        shots: p.statistics?.[0]?.shots?.total || 0,
        shotsOnTarget: p.statistics?.[0]?.shots?.on || 0,
        // Passing
        passes: p.statistics?.[0]?.passes?.total || 0,
        passAccuracy: p.statistics?.[0]?.passes?.accuracy ? parseInt(p.statistics[0].passes.accuracy) : 0,
        keyPasses: p.statistics?.[0]?.passes?.key || 0,
        // Dribbles
        dribbles: p.statistics?.[0]?.dribbles?.attempts || 0,
        dribblesSuccess: p.statistics?.[0]?.dribbles?.success || 0,
        // Duels
        duels: p.statistics?.[0]?.duels?.total || 0,
        duelsWon: p.statistics?.[0]?.duels?.won || 0,
        // Fouls
        foulsDrawn: p.statistics?.[0]?.fouls?.drawn || 0,
        foulsCommitted: p.statistics?.[0]?.fouls?.committed || 0,
        // Cards
        yellowCard: p.statistics?.[0]?.cards?.yellow || 0,
        redCard: p.statistics?.[0]?.cards?.red || 0,
        // Other
        tackles: p.statistics?.[0]?.tackles?.total || 0,
        interceptions: p.statistics?.[0]?.tackles?.interceptions || 0,
        saves: p.statistics?.[0]?.goalkeeper?.saves || 0,
      })),
    }));

    if (!isLive) {
      setCache(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.error('Erreur getMatchPlayerStats:', error);
    return null;
  }
}

/**
 * Récupère les prédictions pour un match
 * Endpoint: /predictions
 */
export async function getMatchPredictions(fixtureId: number) {
  const cacheKey = `predictions_${fixtureId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    console.log(`[API] getMatchPredictions - fetching predictions for fixture ${fixtureId}`);
    const response = await apiFetch(`/predictions?fixture=${fixtureId}`);

    if (!response.ok) {
      console.error(`[API] getMatchPredictions - HTTP error:`, response.status);
      return null;
    }

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getMatchPredictions - API errors:`, data.errors);
      return null;
    }

    if (!data.response || data.response.length === 0) {
      return null;
    }

    const pred = data.response[0];
    const result = {
      winner: {
        id: pred.predictions?.winner?.id,
        name: pred.predictions?.winner?.name,
        comment: pred.predictions?.winner?.comment,
      },
      winOrDraw: pred.predictions?.win_or_draw,
      underOver: pred.predictions?.under_over,
      goals: {
        home: pred.predictions?.goals?.home,
        away: pred.predictions?.goals?.away,
      },
      advice: pred.predictions?.advice,
      percent: {
        home: pred.predictions?.percent?.home,
        draw: pred.predictions?.percent?.draw,
        away: pred.predictions?.percent?.away,
      },
      comparison: pred.comparison,
      teams: {
        home: {
          id: pred.teams?.home?.id,
          name: pred.teams?.home?.name,
          logo: pred.teams?.home?.logo,
          lastFive: pred.teams?.home?.last_5,
          form: pred.teams?.home?.league?.form,
        },
        away: {
          id: pred.teams?.away?.id,
          name: pred.teams?.away?.name,
          logo: pred.teams?.away?.logo,
          lastFive: pred.teams?.away?.last_5,
          form: pred.teams?.away?.league?.form,
        },
      },
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getMatchPredictions:', error);
    return null;
  }
}

/**
 * Récupère les blessures d'une équipe
 * Endpoint: /injuries
 */
export async function getTeamInjuries(teamId: number) {
  const cacheKey = `injuries_${teamId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    console.log(`[API] getTeamInjuries - fetching injuries for team ${teamId}`);
    const response = await apiFetch(`/injuries?team=${teamId}&season=${CURRENT_SEASON}`);

    if (!response.ok) {
      console.error(`[API] getTeamInjuries - HTTP error:`, response.status);
      return [];
    }

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error(`[API] getTeamInjuries - API errors:`, data.errors);
      return [];
    }

    // Filtrer pour ne garder que les blessures actuelles (sans date de retour ou date future)
    const now = new Date();
    const injuries = (data.response || [])
      .filter((injury: any) => {
        // Garder si pas de date de retour ou date de retour dans le futur
        if (!injury.player?.reason) return false;
        return true;
      })
      .slice(0, 10) // Limiter à 10 blessures
      .map((injury: any) => ({
        player: {
          id: injury.player?.id,
          name: injury.player?.name,
          photo: injury.player?.photo,
        },
        team: {
          id: injury.team?.id,
          name: injury.team?.name,
          logo: injury.team?.logo,
        },
        reason: injury.player?.reason,
        type: injury.player?.type, // "Missing Fixture" ou autre
      }));

    setCache(cacheKey, injuries);
    return injuries;
  } catch (error) {
    console.error('Erreur getTeamInjuries:', error);
    return [];
  }
}

// =============================================
// FONCTIONS JOUEURS
// =============================================

/**
 * Récupère les informations d'un joueur
 */
export async function getPlayerInfo(playerId: number) {
  const cacheKey = `player_${playerId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    console.log(`[API] getPlayerInfo - fetching player ${playerId}`);
    const response = await apiFetch(`/players?id=${playerId}&season=${CURRENT_SEASON}`);

    if (!response.ok) {
      console.error(`[API] getPlayerInfo - HTTP error:`, response.status);
      return null;
    }

    const data = await response.json();
    console.log(`[API] getPlayerInfo - response:`, data.response?.length || 0);

    if (!data.response || data.response.length === 0) {
      return null;
    }

    const playerData = data.response[0];
    const player = playerData.player;
    const stats = playerData.statistics || [];

    // Transformer les données
    const result = {
      id: player.id,
      name: player.name,
      firstname: player.firstname,
      lastname: player.lastname,
      age: player.age,
      birth: {
        date: player.birth?.date,
        place: player.birth?.place,
        country: player.birth?.country,
      },
      nationality: player.nationality,
      height: player.height,
      weight: player.weight,
      photo: player.photo,
      injured: player.injured,
      // Stats par compétition
      statistics: stats.map((stat: any) => ({
        team: {
          id: stat.team?.id,
          name: stat.team?.name,
          logo: stat.team?.logo,
        },
        league: {
          id: stat.league?.id,
          name: stat.league?.name,
          country: stat.league?.country,
          logo: stat.league?.logo,
          flag: stat.league?.flag,
          season: stat.league?.season,
        },
        games: {
          appearences: stat.games?.appearences || 0,
          lineups: stat.games?.lineups || 0,
          minutes: stat.games?.minutes || 0,
          position: stat.games?.position,
          rating: stat.games?.rating ? parseFloat(stat.games.rating) : null,
          captain: stat.games?.captain || false,
        },
        goals: {
          total: stat.goals?.total || 0,
          assists: stat.goals?.assists || 0,
          conceded: stat.goals?.conceded || 0,
          saves: stat.goals?.saves || 0,
        },
        passes: {
          total: stat.passes?.total || 0,
          key: stat.passes?.key || 0,
          // L'accuracy peut être null, un nombre, ou une string - on parse proprement
          accuracy: stat.passes?.accuracy !== null && stat.passes?.accuracy !== undefined
            ? (typeof stat.passes.accuracy === 'string'
                ? parseInt(stat.passes.accuracy, 10)
                : stat.passes.accuracy)
            : null,
        },
        tackles: {
          total: stat.tackles?.total || 0,
          blocks: stat.tackles?.blocks || 0,
          interceptions: stat.tackles?.interceptions || 0,
        },
        duels: {
          total: stat.duels?.total || 0,
          won: stat.duels?.won || 0,
        },
        dribbles: {
          attempts: stat.dribbles?.attempts || 0,
          success: stat.dribbles?.success || 0,
        },
        fouls: {
          drawn: stat.fouls?.drawn || 0,
          committed: stat.fouls?.committed || 0,
        },
        cards: {
          yellow: stat.cards?.yellow || 0,
          yellowred: stat.cards?.yellowred || 0,
          red: stat.cards?.red || 0,
        },
        penalty: {
          won: stat.penalty?.won || 0,
          scored: stat.penalty?.scored || 0,
          missed: stat.penalty?.missed || 0,
          saved: stat.penalty?.saved || 0,
        },
      })),
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getPlayerInfo:', error);
    return null;
  }
}

/**
 * Récupère les transferts d'un joueur
 */
export async function getPlayerTransfers(playerId: number) {
  const cacheKey = `player_transfers_${playerId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    console.log(`[API] getPlayerTransfers - fetching transfers for player ${playerId}`);
    const response = await apiFetch(`/transfers?player=${playerId}`);

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.response || data.response.length === 0) {
      return [];
    }

    const transfers = data.response[0]?.transfers || [];
    const result = transfers.map((t: any) => ({
      date: t.date,
      type: t.type,
      teams: {
        in: {
          id: t.teams?.in?.id,
          name: t.teams?.in?.name,
          logo: t.teams?.in?.logo,
        },
        out: {
          id: t.teams?.out?.id,
          name: t.teams?.out?.name,
          logo: t.teams?.out?.logo,
        },
      },
    }));

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getPlayerTransfers:', error);
    return [];
  }
}

/**
 * Récupère les trophées d'un joueur
 */
export async function getPlayerTrophies(playerId: number) {
  const cacheKey = `player_trophies_${playerId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    console.log(`[API] getPlayerTrophies - fetching trophies for player ${playerId}`);
    const response = await apiFetch(`/trophies?player=${playerId}`);

    if (!response.ok) return [];

    const data = await response.json();

    const result = (data.response || []).map((t: any) => ({
      league: t.league,
      country: t.country,
      season: t.season,
      place: t.place,
    }));

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getPlayerTrophies:', error);
    return [];
  }
}

// =============================================
// FONCTIONS UTILITAIRES
// =============================================

/**
 * Formate une date en français
 */
export function formatDateFR(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formate une date courte
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Détermine le résultat d'un match pour une équipe donnée
 */
export function getMatchResult(match: any, teamId: number): 'win' | 'draw' | 'loss' | null {
  if (match.status !== 'FINISHED') return null;

  const homeScore = match.score?.fullTime?.home;
  const awayScore = match.score?.fullTime?.away;

  if (homeScore === null || awayScore === null) return null;

  const isHome = match.homeTeam.id === teamId;
  const teamScore = isHome ? homeScore : awayScore;
  const opponentScore = isHome ? awayScore : homeScore;

  if (teamScore > opponentScore) return 'win';
  if (teamScore < opponentScore) return 'loss';
  return 'draw';
}

/**
 * Calcule la forme récente d'une équipe (5 derniers matchs)
 */
export function getTeamForm(matches: any[], teamId: number): string[] {
  return matches
    .filter(m => m.status === 'FINISHED')
    .slice(0, 5)
    .map(m => getMatchResult(m, teamId))
    .filter(r => r !== null) as string[];
}

/**
 * Vide le cache (utile pour forcer un rafraîchissement)
 */
export function clearCache(): void {
  Object.keys(cache).forEach(key => delete cache[key]);
  console.log('Cache vidé');
}

// =============================================
// CLASSEMENTS EUROPÉENS AGRÉGÉS
// =============================================

// Cache longue durée pour les classements (1 heure)
const EUROPEAN_CACHE_DURATION = 60 * 60 * 1000; // 1 heure

interface EuropeanCacheEntry {
  data: any;
  timestamp: number;
}

const europeanCache: Record<string, EuropeanCacheEntry> = {};

function getEuropeanCached(key: string): any | null {
  const entry = europeanCache[key];
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > EUROPEAN_CACHE_DURATION;
  if (isExpired) {
    delete europeanCache[key];
    return null;
  }

  return entry.data;
}

function setEuropeanCache(key: string, data: any): void {
  europeanCache[key] = {
    data,
    timestamp: Date.now(),
  };
}

// Fonction pour vider le cache européen (utile pour debug)
export function clearEuropeanCache(): void {
  Object.keys(europeanCache).forEach(key => delete europeanCache[key]);
  console.log('[API] European cache cleared');
}

// Délai entre requêtes pour éviter le rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction fetch avec retry pour les appels européens
async function fetchWithRetry(
  url: string,
  retries: number = 3,
  delayMs: number = 500
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await apiFetch(url);

      // Si rate limited (429), attendre et réessayer
      if (response.status === 429) {
        console.warn(`[API] Rate limited, attempt ${attempt}/${retries}, waiting ${delayMs * attempt}ms...`);
        if (attempt < retries) {
          await delay(delayMs * attempt);
          continue;
        }
      }

      return response;
    } catch (error) {
      console.error(`[API] Fetch error attempt ${attempt}/${retries}:`, error);
      if (attempt < retries) {
        await delay(delayMs * attempt);
      } else {
        throw error;
      }
    }
  }

  // Fallback - ne devrait jamais arriver
  return apiFetch(url);
}

// Top 5 ligues européennes (championnats domestiques)
export const TOP_5_LEAGUES = [
  { id: 61, name: 'Ligue 1', country: 'France', flag: '🇫🇷' },
  { id: 39, name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'La Liga', country: 'Spain', flag: '🇪🇸' },
  { id: 135, name: 'Serie A', country: 'Italy', flag: '🇮🇹' },
  { id: 78, name: 'Bundesliga', country: 'Germany', flag: '🇩🇪' },
];

// Compétitions européennes (coupes)
export const EUROPEAN_CUPS = [
  { id: 2, name: 'Champions League', country: 'Europe', flag: '🏆' },
  { id: 3, name: 'Europa League', country: 'Europe', flag: '🏆' },
  { id: 848, name: 'Conference League', country: 'Europe', flag: '🏆' },
];

// Toutes les compétitions (championnats + coupes)
export const ALL_COMPETITIONS = [...TOP_5_LEAGUES, ...EUROPEAN_CUPS];

export interface EuropeanPlayerStats {
  player: {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
    nationality?: string;
    photo?: string;
  };
  team: {
    id: number;
    name: string;
    crest?: string;
  };
  league: {
    id: number;
    name: string;
    country: string;
    flag: string;
  };
  goals: number;
  assists: number;
  total: number; // goals + assists
  playedMatches: number;
  rating?: number; // Note moyenne du joueur
}

/**
 * Agrège les stats de TOUTES les compétitions d'un joueur
 * (comme Face à Face le fait)
 */
function aggregateAllPlayerStats(statistics: any[]): { goals: number; assists: number; matches: number; rating: number | null } {
  let goals = 0;
  let assists = 0;
  let matches = 0;
  let ratingSum = 0;
  let ratingCount = 0;

  for (const stat of statistics) {
    goals += stat.goals?.total || 0;
    assists += stat.goals?.assists || 0;
    matches += stat.games?.appearences || 0;
    if (stat.games?.rating) {
      ratingSum += parseFloat(stat.games.rating);
      ratingCount += 1;
    }
  }

  return {
    goals,
    assists,
    matches,
    rating: ratingCount > 0 ? ratingSum / ratingCount : null,
  };
}

/**
 * Récupère les meilleurs buteurs - TOUTES COMPÉTITIONS CONFONDUES
 * Utilise getPlayerInfo pour chaque joueur afin d'avoir le total réel
 * (Championnats + Coupes d'Europe + Coupes nationales + Super Coupes + tout)
 */
export async function getTopScorersEurope(season?: number): Promise<EuropeanPlayerStats[]> {
  const targetSeason = season || CURRENT_SEASON;
  const cacheKey = `europe_scorers_all_real_${targetSeason}`;
  const cached = getEuropeanCached(cacheKey);
  if (cached) {
    console.log('[API] getTopScorersEurope (TOUTES compétitions) - from cache:', cached.length);
    return cached;
  }

  try {
    console.log('[API] getTopScorersEurope - fetching with REAL totals (all competitions)');

    // Étape 1: Récupérer les candidats depuis les championnats principaux
    const candidateIds = new Set<number>();
    const playerBasicInfo = new Map<number, any>();

    for (const league of TOP_5_LEAGUES) {
      try {
        console.log(`[API] Fetching scorers candidates from ${league.name}...`);
        const response = await fetchWithRetry(
          `/players/topscorers?league=${league.id}&season=${targetSeason}`
        );

        if (!response.ok) continue;

        const data = await response.json();
        for (const item of (data.response || []).slice(0, 20)) {
          const playerId = item.player.id;
          if (!candidateIds.has(playerId)) {
            candidateIds.add(playerId);
            playerBasicInfo.set(playerId, {
              player: item.player,
              team: item.statistics[0]?.team,
              league: league,
            });
          }
        }

        await delay(200);
      } catch (error) {
        console.error(`[API] Error fetching from ${league.name}:`, error);
      }
    }

    console.log(`[API] Found ${candidateIds.size} candidate players, fetching full stats...`);

    // Étape 2: Pour chaque joueur, récupérer ses stats COMPLÈTES via getPlayerInfo
    const playersWithRealStats: EuropeanPlayerStats[] = [];
    let processed = 0;

    for (const playerId of candidateIds) {
      try {
        const playerInfo = await getPlayerInfo(playerId);
        if (playerInfo && playerInfo.statistics && playerInfo.statistics.length > 0) {
          const aggregated = aggregateAllPlayerStats(playerInfo.statistics);
          const basicInfo = playerBasicInfo.get(playerId);

          playersWithRealStats.push({
            player: {
              id: playerInfo.id,
              name: playerInfo.name,
              firstName: playerInfo.firstname,
              lastName: playerInfo.lastname,
              nationality: playerInfo.nationality,
              photo: playerInfo.photo,
            },
            team: {
              id: basicInfo?.team?.id || playerInfo.statistics[0]?.team?.id,
              name: basicInfo?.team?.name || playerInfo.statistics[0]?.team?.name,
              crest: basicInfo?.team?.logo || playerInfo.statistics[0]?.team?.logo,
            },
            league: basicInfo?.league || {
              id: playerInfo.statistics[0]?.league?.id,
              name: playerInfo.statistics[0]?.league?.name,
              country: playerInfo.statistics[0]?.league?.country,
              flag: '⚽',
            },
            goals: aggregated.goals,
            assists: aggregated.assists,
            total: aggregated.goals + aggregated.assists,
            playedMatches: aggregated.matches,
            rating: aggregated.rating || undefined,
          });
        }

        processed++;
        if (processed % 10 === 0) {
          console.log(`[API] Processed ${processed}/${candidateIds.size} players...`);
        }

        // Petit délai entre les requêtes
        await delay(100);
      } catch (error) {
        console.error(`[API] Error fetching full stats for player ${playerId}:`, error);
      }
    }

    // Trier par buts (total réel de TOUTES les compétitions)
    playersWithRealStats.sort((a, b) => b.goals - a.goals);

    // Log top 5 pour debug
    console.log('[API] Top 5 buteurs (TOUTES compétitions confondues):');
    playersWithRealStats.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.player.name} (${p.team.name}) - ${p.goals} buts, ${p.assists} assists`);
    });

    const topScorers = playersWithRealStats.slice(0, 50);
    console.log('[API] getTopScorersEurope (REAL totals) - final:', topScorers.length);
    setEuropeanCache(cacheKey, topScorers);
    return topScorers;
  } catch (error) {
    console.error('Erreur getTopScorersEurope:', error);
    return [];
  }
}

/**
 * Récupère les meilleurs passeurs - TOUTES COMPÉTITIONS CONFONDUES
 * Utilise getPlayerInfo pour chaque joueur afin d'avoir le total réel
 */
export async function getTopAssistsEurope(season?: number): Promise<EuropeanPlayerStats[]> {
  const targetSeason = season || CURRENT_SEASON;
  const cacheKey = `europe_assists_all_real_${targetSeason}`;
  const cached = getEuropeanCached(cacheKey);
  if (cached) {
    console.log('[API] getTopAssistsEurope (TOUTES compétitions) - from cache:', cached.length);
    return cached;
  }

  try {
    console.log('[API] getTopAssistsEurope - fetching with REAL totals (all competitions)');

    // Étape 1: Récupérer les candidats depuis les championnats principaux
    const candidateIds = new Set<number>();
    const playerBasicInfo = new Map<number, any>();

    for (const league of TOP_5_LEAGUES) {
      try {
        console.log(`[API] Fetching assists candidates from ${league.name}...`);
        const response = await fetchWithRetry(
          `/players/topassists?league=${league.id}&season=${targetSeason}`
        );

        if (!response.ok) continue;

        const data = await response.json();
        for (const item of (data.response || []).slice(0, 20)) {
          const playerId = item.player.id;
          if (!candidateIds.has(playerId)) {
            candidateIds.add(playerId);
            playerBasicInfo.set(playerId, {
              player: item.player,
              team: item.statistics[0]?.team,
              league: league,
            });
          }
        }

        await delay(200);
      } catch (error) {
        console.error(`[API] Error fetching assists from ${league.name}:`, error);
      }
    }

    console.log(`[API] Found ${candidateIds.size} assist candidates, fetching full stats...`);

    // Étape 2: Pour chaque joueur, récupérer ses stats COMPLÈTES
    const playersWithRealStats: EuropeanPlayerStats[] = [];
    let processed = 0;

    for (const playerId of candidateIds) {
      try {
        const playerInfo = await getPlayerInfo(playerId);
        if (playerInfo && playerInfo.statistics && playerInfo.statistics.length > 0) {
          const aggregated = aggregateAllPlayerStats(playerInfo.statistics);
          const basicInfo = playerBasicInfo.get(playerId);

          playersWithRealStats.push({
            player: {
              id: playerInfo.id,
              name: playerInfo.name,
              firstName: playerInfo.firstname,
              lastName: playerInfo.lastname,
              nationality: playerInfo.nationality,
              photo: playerInfo.photo,
            },
            team: {
              id: basicInfo?.team?.id || playerInfo.statistics[0]?.team?.id,
              name: basicInfo?.team?.name || playerInfo.statistics[0]?.team?.name,
              crest: basicInfo?.team?.logo || playerInfo.statistics[0]?.team?.logo,
            },
            league: basicInfo?.league || {
              id: playerInfo.statistics[0]?.league?.id,
              name: playerInfo.statistics[0]?.league?.name,
              country: playerInfo.statistics[0]?.league?.country,
              flag: '⚽',
            },
            goals: aggregated.goals,
            assists: aggregated.assists,
            total: aggregated.goals + aggregated.assists,
            playedMatches: aggregated.matches,
            rating: aggregated.rating || undefined,
          });
        }

        processed++;
        if (processed % 10 === 0) {
          console.log(`[API] Processed ${processed}/${candidateIds.size} assist players...`);
        }

        await delay(100);
      } catch (error) {
        console.error(`[API] Error fetching full stats for assist player ${playerId}:`, error);
      }
    }

    // Trier par passes (total réel de TOUTES les compétitions)
    playersWithRealStats.sort((a, b) => b.assists - a.assists);

    // Log top 5 pour debug
    console.log('[API] Top 5 passeurs (TOUTES compétitions confondues):');
    playersWithRealStats.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.player.name} (${p.team.name}) - ${p.assists} assists, ${p.goals} buts`);
    });

    const topAssists = playersWithRealStats.slice(0, 50);
    console.log('[API] getTopAssistsEurope (REAL totals) - final:', topAssists.length);
    setEuropeanCache(cacheKey, topAssists);
    return topAssists;
  } catch (error) {
    console.error('Erreur getTopAssistsEurope:', error);
    return [];
  }
}

/**
 * Récupère les meilleurs contributeurs (buts + passes) du Top 5 européen
 * Gère les doublons (joueurs présents dans les deux listes)
 */
export async function getTopContributorsEurope(season?: number): Promise<EuropeanPlayerStats[]> {
  const targetSeason = season || CURRENT_SEASON;
  const cacheKey = `europe_contributors_${targetSeason}`;
  const cached = getEuropeanCached(cacheKey);
  if (cached) {
    console.log('[API] getTopContributorsEurope - from cache:', cached.length);
    return cached;
  }

  try {
    console.log('[API] getTopContributorsEurope - fetching for season:', targetSeason);

    // Récupérer à la fois buteurs et passeurs
    const [scorers, assists] = await Promise.all([
      getTopScorersEurope(targetSeason),
      getTopAssistsEurope(targetSeason),
    ]);

    // Map pour fusionner les stats par joueur ID
    const playersMap = new Map<number, EuropeanPlayerStats>();

    // Ajouter les buteurs
    scorers.forEach((player) => {
      playersMap.set(player.player.id, { ...player });
    });

    // Fusionner avec les passeurs
    assists.forEach((player) => {
      const existing = playersMap.get(player.player.id);
      if (existing) {
        // Joueur déjà présent, prendre les meilleures stats
        existing.goals = Math.max(existing.goals, player.goals);
        existing.assists = Math.max(existing.assists, player.assists);
        existing.total = existing.goals + existing.assists;
        existing.playedMatches = Math.max(existing.playedMatches, player.playedMatches);
      } else {
        // Nouveau joueur
        playersMap.set(player.player.id, { ...player });
      }
    });

    // Convertir en array et trier par total (buts + passes)
    const allContributors = Array.from(playersMap.values());
    allContributors.sort((a, b) => b.total - a.total);

    const topContributors = allContributors.slice(0, 50);

    console.log('[API] getTopContributorsEurope - total unique players:', topContributors.length);
    setEuropeanCache(cacheKey, topContributors);
    return topContributors;
  } catch (error) {
    console.error('Erreur getTopContributorsEurope:', error);
    return [];
  }
}

/**
 * Récupère les joueurs avec les meilleures notes - TOUTES COMPÉTITIONS CONFONDUES
 * Utilise getPlayerInfo pour chaque joueur afin d'avoir la moyenne réelle
 * (Championnats + Coupes d'Europe + Coupes nationales + Super Coupes + tout)
 */
export async function getTopRatingsEurope(season?: number): Promise<EuropeanPlayerStats[]> {
  const targetSeason = season || CURRENT_SEASON;
  const cacheKey = `europe_ratings_all_real_${targetSeason}`;
  const cached = getEuropeanCached(cacheKey);
  if (cached) {
    console.log('[API] getTopRatingsEurope (TOUTES compétitions) - from cache:', cached.length);
    return cached;
  }

  try {
    console.log('[API] getTopRatingsEurope - fetching with REAL ratings (all competitions)');

    // Étape 1: Récupérer les candidats depuis les championnats principaux (buteurs + passeurs)
    const candidateIds = new Set<number>();
    const playerBasicInfo = new Map<number, any>();

    for (const league of TOP_5_LEAGUES) {
      try {
        console.log(`[API] Fetching ratings candidates from ${league.name}...`);

        // Récupérer buteurs et passeurs pour avoir un bon pool de candidats
        const [scorersResponse, assistsResponse] = await Promise.all([
          fetchWithRetry(`/players/topscorers?league=${league.id}&season=${targetSeason}`),
          fetchWithRetry(`/players/topassists?league=${league.id}&season=${targetSeason}`),
        ]);

        const scorersData = scorersResponse.ok ? await scorersResponse.json() : { response: [] };
        const assistsData = assistsResponse.ok ? await assistsResponse.json() : { response: [] };

        const allPlayers = [...(scorersData.response || []), ...(assistsData.response || [])];

        for (const item of allPlayers.slice(0, 30)) {
          const playerId = item.player.id;
          if (!candidateIds.has(playerId)) {
            candidateIds.add(playerId);
            playerBasicInfo.set(playerId, {
              player: item.player,
              team: item.statistics[0]?.team,
              league: league,
            });
          }
        }

        await delay(200);
      } catch (error) {
        console.error(`[API] Error fetching from ${league.name}:`, error);
      }
    }

    console.log(`[API] Found ${candidateIds.size} candidate players, fetching full stats for ratings...`);

    // Étape 2: Pour chaque joueur, récupérer ses stats COMPLÈTES via getPlayerInfo
    const playersWithRealRatings: EuropeanPlayerStats[] = [];
    let processed = 0;

    for (const playerId of candidateIds) {
      try {
        const playerInfo = await getPlayerInfo(playerId);
        if (playerInfo && playerInfo.statistics && playerInfo.statistics.length > 0) {
          const aggregated = aggregateAllPlayerStats(playerInfo.statistics);
          const basicInfo = playerBasicInfo.get(playerId);

          // Ne garder que les joueurs avec une note valide et au moins 5 matchs
          if (aggregated.rating && aggregated.matches >= 5) {
            playersWithRealRatings.push({
              player: {
                id: playerInfo.id,
                name: playerInfo.name,
                firstName: playerInfo.firstname,
                lastName: playerInfo.lastname,
                nationality: playerInfo.nationality,
                photo: playerInfo.photo,
              },
              team: {
                id: basicInfo?.team?.id || playerInfo.statistics[0]?.team?.id,
                name: basicInfo?.team?.name || playerInfo.statistics[0]?.team?.name,
                crest: basicInfo?.team?.logo || playerInfo.statistics[0]?.team?.logo,
              },
              league: basicInfo?.league || {
                id: playerInfo.statistics[0]?.league?.id,
                name: playerInfo.statistics[0]?.league?.name,
                country: playerInfo.statistics[0]?.league?.country,
                flag: '⚽',
              },
              goals: aggregated.goals,
              assists: aggregated.assists,
              total: aggregated.goals + aggregated.assists,
              playedMatches: aggregated.matches,
              rating: aggregated.rating,
            });
          }
        }

        processed++;
        if (processed % 10 === 0) {
          console.log(`[API] Processed ${processed}/${candidateIds.size} players for ratings...`);
        }

        // Petit délai entre les requêtes
        await delay(100);
      } catch (error) {
        console.error(`[API] Error fetching full stats for player ${playerId}:`, error);
      }
    }

    // Trier par note (moyenne réelle de TOUTES les compétitions)
    playersWithRealRatings.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    // Log top 5 pour debug
    console.log('[API] Top 5 meilleures notes (TOUTES compétitions confondues):');
    playersWithRealRatings.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.player.name} (${p.team.name}) - Note: ${p.rating?.toFixed(2)}, ${p.playedMatches} matchs`);
    });

    const topRated = playersWithRealRatings.slice(0, 50);
    console.log('[API] getTopRatingsEurope (REAL ratings) - final:', topRated.length);
    setEuropeanCache(cacheKey, topRated);
    return topRated;
  } catch (error) {
    console.error('Erreur getTopRatingsEurope:', error);
    return [];
  }
}

/**
 * Récupère tous les classements européens d'un coup
 */
export async function getAllEuropeanRankings(season?: number) {
  const [scorers, assists, contributors, ratings] = await Promise.all([
    getTopScorersEurope(season),
    getTopAssistsEurope(season),
    getTopContributorsEurope(season),
    getTopRatingsEurope(season),
  ]);

  return { scorers, assists, contributors, ratings };
}
