// src/services/oddsService.ts
// Service pour récupérer les cotes depuis The Odds API via notre proxy

import {
  MatchOdds,
  OddsApiResponse,
  SportKey,
  COMPETITION_TO_SPORT,
} from '../types/odds.types';

const BASE_URL = '/api/odds';

// Cache en mémoire pour les cotes (3 minutes)
const CACHE_DURATION = 3 * 60 * 1000;
const oddsCache: Map<string, { data: MatchOdds[]; timestamp: number }> = new Map();

function getCached(key: string): MatchOdds[] | null {
  const cached = oddsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[OddsService] Cache hit for ${key}`);
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: MatchOdds[]): void {
  oddsCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Récupère les cotes pour une compétition
 */
export async function getOddsBySport(sport: SportKey): Promise<MatchOdds[]> {
  const cacheKey = `odds_${sport}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    console.log(`[OddsService] Fetching odds for ${sport}...`);
    const response = await fetch(`${BASE_URL}?sport=${sport}`);

    if (!response.ok) {
      console.error(`[OddsService] Error ${response.status} for ${sport}`);
      return [];
    }

    const result: OddsApiResponse = await response.json();

    if (!result.success || !result.data) {
      console.warn(`[OddsService] No data for ${sport}`);
      return [];
    }

    console.log(`[OddsService] Got ${result.count} matches for ${sport}`);
    console.log(`[OddsService] API usage: ${result.apiUsage.used}/${result.apiUsage.remaining} remaining`);

    setCache(cacheKey, result.data);
    return result.data;
  } catch (error) {
    console.error(`[OddsService] Exception for ${sport}:`, error);
    return [];
  }
}

/**
 * Récupère les cotes par ID de compétition API-Football
 */
export async function getOddsByCompetitionId(competitionId: number): Promise<MatchOdds[]> {
  const sport = COMPETITION_TO_SPORT[competitionId];
  if (!sport) {
    console.warn(`[OddsService] Unknown competition ID: ${competitionId}`);
    return [];
  }
  return getOddsBySport(sport);
}

/**
 * Trouve les cotes pour un match spécifique
 * Utilise une correspondance floue sur les noms d'équipes
 */
export async function findMatchOdds(
  homeTeam: string,
  awayTeam: string,
  competitionId: number
): Promise<MatchOdds | null> {
  const allOdds = await getOddsByCompetitionId(competitionId);

  if (!allOdds.length) return null;

  // Normaliser les noms pour la comparaison
  const normalize = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]/g, ''); // Garder que lettres et chiffres

  const homeNorm = normalize(homeTeam);
  const awayNorm = normalize(awayTeam);

  // Chercher une correspondance exacte ou partielle
  const match = allOdds.find((m) => {
    const mHomeNorm = normalize(m.homeTeam);
    const mAwayNorm = normalize(m.awayTeam);

    // Correspondance exacte
    if (mHomeNorm === homeNorm && mAwayNorm === awayNorm) {
      return true;
    }

    // Correspondance partielle (contient)
    if (
      (mHomeNorm.includes(homeNorm) || homeNorm.includes(mHomeNorm)) &&
      (mAwayNorm.includes(awayNorm) || awayNorm.includes(mAwayNorm))
    ) {
      return true;
    }

    return false;
  });

  if (match) {
    console.log(`[OddsService] Found odds for ${homeTeam} vs ${awayTeam}`);
  } else {
    console.log(`[OddsService] No odds found for ${homeTeam} vs ${awayTeam}`);
  }

  return match || null;
}

/**
 * Récupère les cotes pour plusieurs compétitions en parallèle
 */
export async function getOddsForMultipleSports(
  sports: SportKey[]
): Promise<Map<SportKey, MatchOdds[]>> {
  const results = new Map<SportKey, MatchOdds[]>();

  // Fetch en parallèle
  const promises = sports.map(async (sport) => {
    const odds = await getOddsBySport(sport);
    return { sport, odds };
  });

  const resolved = await Promise.all(promises);

  for (const { sport, odds } of resolved) {
    results.set(sport, odds);
  }

  return results;
}

/**
 * Récupère les prochains matchs avec cotes disponibles
 */
export async function getUpcomingMatchesWithOdds(
  sport: SportKey,
  limit: number = 10
): Promise<MatchOdds[]> {
  const allOdds = await getOddsBySport(sport);
  const now = new Date();

  return allOdds
    .filter((m) => new Date(m.commenceTime) > now)
    .filter((m) => m.odds.winamax) // Seulement ceux avec cotes Winamax
    .sort((a, b) => new Date(a.commenceTime).getTime() - new Date(b.commenceTime).getTime())
    .slice(0, limit);
}

/**
 * Vide le cache des cotes
 */
export function clearOddsCache(): void {
  oddsCache.clear();
  console.log('[OddsService] Cache cleared');
}
