// Service Football-Data.org pour Octogoal
// Documentation : https://www.football-data.org/documentation/api
// OPTIMISÉ avec cache pour éviter les erreurs 429 (rate limit)

const BASE_URL = '/api/football';

// =============================================
// SYSTÈME DE CACHE
// =============================================

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

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

// Codes des compétitions Football-Data.org
export const LEAGUES = {
  LIGUE_1: 'FL1',
  PREMIER_LEAGUE: 'PL',
  LA_LIGA: 'PD',
  SERIE_A: 'SA',
  BUNDESLIGA: 'BL1',
  CHAMPIONS_LEAGUE: 'CL',
};

// Infos des ligues pour l'affichage
export const LEAGUE_INFO: Record<string, { name: string; flag: string; color: string; totalMatchdays: number }> = {
  FL1: { name: 'Ligue 1', flag: '🇫🇷', color: 'from-blue-600 to-blue-800', totalMatchdays: 34 },
  PL: { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: 'from-purple-600 to-purple-800', totalMatchdays: 38 },
  PD: { name: 'La Liga', flag: '🇪🇸', color: 'from-red-600 to-orange-600', totalMatchdays: 38 },
  SA: { name: 'Serie A', flag: '🇮🇹', color: 'from-green-600 to-green-800', totalMatchdays: 38 },
  BL1: { name: 'Bundesliga', flag: '🇩🇪', color: 'from-red-600 to-yellow-500', totalMatchdays: 34 },
  CL: { name: 'Champions League', flag: '🏆', color: 'from-blue-900 to-indigo-900', totalMatchdays: 8 },
};

// =============================================
// FONCTIONS API AVEC CACHE
// =============================================

/**
 * Récupère le classement d'une ligue
 */
export async function getStandings(leagueCode: string) {
  const cacheKey = `standings_${leagueCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/competitions/${leagueCode}/standings`
    );
    
    if (!response.ok) {
      console.error('Erreur API:', response.status);
      return [];
    }
    
    const data = await response.json();
    const totalStandings = data.standings?.find(
      (s: any) => s.type === 'TOTAL'
    );
    const result = totalStandings?.table || [];
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getStandings:', error);
    return [];
  }
}

/**
 * Récupère toutes les équipes d'une ligue
 */
export async function getTeams(leagueCode: string) {
  const cacheKey = `teams_${leagueCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/competitions/${leagueCode}/teams`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const result = data.teams || [];
    
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
    const response = await fetch(
      `${BASE_URL}/teams/${teamId}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Erreur getTeamById:', error);
    return null;
  }
}

/**
 * Récupère les prochains matchs d'une ligue
 */
export async function getNextFixtures(leagueCode: string, count: number = 10) {
  const cacheKey = `fixtures_${leagueCode}_${count}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/competitions/${leagueCode}/matches?status=SCHEDULED&limit=${count}`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const result = data.matches || [];
    
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
  const cacheKey = `results_${leagueCode}_${count}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/competitions/${leagueCode}/matches?status=FINISHED&limit=${count}`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const result = data.matches || [];
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getLastResults:', error);
    return [];
  }
}

/**
 * Récupère les matchs d'aujourd'hui
 */
export async function getTodayFixtures() {
  const cacheKey = 'today_fixtures';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/matches`);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const result = data.matches || [];
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTodayFixtures:', error);
    return [];
  }
}

/**
 * Récupère les meilleurs buteurs d'une ligue
 */
export async function getTopScorers(leagueCode: string) {
  const cacheKey = `scorers_${leagueCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/competitions/${leagueCode}/scorers`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const result = data.scorers || [];
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTopScorers:', error);
    return [];
  }
}

// =============================================
// FONCTIONS - MATCHS PAR JOURNÉE
// =============================================

/**
 * Récupère tous les matchs d'une ligue (toutes journées)
 */
export async function getAllMatches(leagueCode: string) {
  const cacheKey = `all_matches_${leagueCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/competitions/${leagueCode}/matches`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const result = data.matches || [];
    
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
  const cacheKey = `matchday_${leagueCode}_${matchday}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/competitions/${leagueCode}/matches?matchday=${matchday}`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const result = data.matches || [];
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getMatchesByMatchday:', error);
    return [];
  }
}

/**
 * Récupère la journée actuelle d'une ligue
 */
export async function getCurrentMatchday(leagueCode: string): Promise<number> {
  const cacheKey = `current_matchday_${leagueCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/competitions/${leagueCode}`
    );
    
    if (!response.ok) return 1;
    
    const data = await response.json();
    const result = data.currentSeason?.currentMatchday || 1;
    
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
    const response = await fetch(
      `${BASE_URL}/teams/${teamId}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    const result = {
      id: data.id,
      name: data.name,
      shortName: data.shortName,
      tla: data.tla,
      crest: data.crest,
      address: data.address,
      website: data.website,
      founded: data.founded,
      clubColors: data.clubColors,
      venue: data.venue,
      coach: data.coach,
      squad: data.squad || [],
      runningCompetitions: data.runningCompetitions || [],
    };
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erreur getTeamDetails:', error);
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
    let url = `${BASE_URL}/teams/${teamId}/matches`;
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const result = data.matches || [];
    
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