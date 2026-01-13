// src/services/oddsService.ts
// Service pour récupérer les cotes Winamax via The Odds API
// OPTIMISÉ : Cache localStorage de 1 heure pour économiser le quota

import { MatchOdds, SportKey, COMPETITION_TO_SPORT } from '../types/odds.types';

const BASE_URL = '/api/odds';

// CACHE AGRESSIF : 1 HEURE en localStorage
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 heure
const CACHE_KEY_PREFIX = 'octogoal_odds_';

// =============================================
// CACHE LOCALSTORAGE
// =============================================

interface CachedData {
  data: MatchOdds[];
  timestamp: number;
  expiresAt: number;
}

function getCacheKey(sport: SportKey): string {
  return `${CACHE_KEY_PREFIX}${sport}`;
}

function getFromLocalStorage(sport: SportKey): MatchOdds[] | null {
  try {
    const key = getCacheKey(sport);
    const cached = localStorage.getItem(key);

    if (!cached) return null;

    const parsed: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Vérifier si le cache est encore valide
    if (now < parsed.expiresAt) {
      const remainingMinutes = Math.round((parsed.expiresAt - now) / 60000);
      console.log(`[OddsService] Cache localStorage HIT pour ${sport} (expire dans ${remainingMinutes}min)`);
      return parsed.data;
    }

    // Cache expiré, le supprimer
    localStorage.removeItem(key);
    console.log(`[OddsService] Cache expiré pour ${sport}`);
    return null;
  } catch (error) {
    console.error('[OddsService] Erreur lecture cache:', error);
    return null;
  }
}

function saveToLocalStorage(sport: SportKey, data: MatchOdds[]): void {
  try {
    const key = getCacheKey(sport);
    const now = Date.now();

    const cacheData: CachedData = {
      data,
      timestamp: now,
      expiresAt: now + CACHE_DURATION_MS,
    };

    localStorage.setItem(key, JSON.stringify(cacheData));
    console.log(`[OddsService] Cache sauvegardé pour ${sport} (1h)`);
  } catch (error) {
    console.error('[OddsService] Erreur sauvegarde cache:', error);
  }
}

// =============================================
// CACHE MÉMOIRE (backup)
// =============================================

const memoryCache: Map<string, { data: MatchOdds[]; expiresAt: number }> = new Map();

function getFromMemory(sport: SportKey): MatchOdds[] | null {
  const cached = memoryCache.get(sport);
  if (cached && Date.now() < cached.expiresAt) {
    console.log(`[OddsService] Cache mémoire HIT pour ${sport}`);
    return cached.data;
  }
  return null;
}

function saveToMemory(sport: SportKey, data: MatchOdds[]): void {
  memoryCache.set(sport, {
    data,
    expiresAt: Date.now() + CACHE_DURATION_MS,
  });
}

// =============================================
// FONCTIONS PRINCIPALES
// =============================================

/**
 * Récupère les cotes Winamax pour une compétition
 * Utilise le cache localStorage en priorité (1h)
 */
export async function getOddsBySport(sport: SportKey): Promise<MatchOdds[]> {
  // 1. Vérifier cache localStorage
  const localCached = getFromLocalStorage(sport);
  if (localCached) return localCached;

  // 2. Vérifier cache mémoire (fallback si localStorage indisponible)
  const memoryCached = getFromMemory(sport);
  if (memoryCached) return memoryCached;

  // 3. Fetch depuis l'API (consomme 1 requête du quota)
  try {
    console.log(`[OddsService] Fetching ${sport} depuis l'API (consomme 1 requête)...`);

    // Timeout de 5 secondes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${BASE_URL}?sport=${sport}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[OddsService] Erreur HTTP ${response.status}`);
      return [];
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      console.warn(`[OddsService] Pas de données pour ${sport}`);
      return [];
    }

    // Logger le quota
    if (result.quota) {
      console.log(`[OddsService] Quota: ${result.quota.used} utilisées, ${result.quota.remaining} restantes`);
    }

    console.log(`[OddsService] ${result.count} matchs avec cotes Winamax`);

    // Sauvegarder dans les deux caches
    saveToLocalStorage(sport, result.data);
    saveToMemory(sport, result.data);

    return result.data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[OddsService] Timeout fetch ${sport} (5s)`);
    } else {
      console.error(`[OddsService] Erreur fetch ${sport}:`, error);
    }
    return [];
  }
}

/**
 * Récupère les cotes par ID de compétition API-Football
 */
export async function getOddsByCompetitionId(competitionId: number): Promise<MatchOdds[]> {
  const sport = COMPETITION_TO_SPORT[competitionId];
  if (!sport) {
    console.warn(`[OddsService] Compétition ${competitionId} non mappée - ID inconnu`);
    console.log('[OddsService] Compétitions supportées:', Object.keys(COMPETITION_TO_SPORT).join(', '));
    return [];
  }
  console.log(`[OddsService] Competition ${competitionId} mapped to sport: ${sport}`);
  return getOddsBySport(sport);
}

/**
 * Trouve les cotes Winamax pour un match spécifique
 * Utilise le cache, ne fait PAS de requête API individuelle
 */
export async function findMatchOdds(
  homeTeam: string,
  awayTeam: string,
  competitionId: number
): Promise<MatchOdds | null> {
  console.log('[OddsService] findMatchOdds called:', { homeTeam, awayTeam, competitionId });
  const allOdds = await getOddsByCompetitionId(competitionId);
  console.log('[OddsService] allOdds count:', allOdds.length);

  if (!allOdds.length) {
    console.log('[OddsService] No odds found for competition', competitionId);
    return null;
  }

  // Normaliser les noms pour la comparaison
  const normalize = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const homeNorm = normalize(homeTeam);
  const awayNorm = normalize(awayTeam);
  console.log(`[OddsService] Searching for: "${homeTeam}" (${homeNorm}) vs "${awayTeam}" (${awayNorm})`);

  // Chercher une correspondance
  const match = allOdds.find((m) => {
    const mHomeNorm = normalize(m.homeTeam);
    const mAwayNorm = normalize(m.awayTeam);

    // Correspondance exacte
    if (mHomeNorm === homeNorm && mAwayNorm === awayNorm) return true;

    // Correspondance partielle
    if (
      (mHomeNorm.includes(homeNorm) || homeNorm.includes(mHomeNorm)) &&
      (mAwayNorm.includes(awayNorm) || awayNorm.includes(mAwayNorm))
    ) {
      return true;
    }

    return false;
  });

  if (match) {
    console.log('[OddsService] Match found:', match.homeTeam, 'vs', match.awayTeam);
  } else {
    console.log('[OddsService] No match found. Available matches:', allOdds.slice(0, 5).map(m => `${m.homeTeam} vs ${m.awayTeam}`));
  }

  return match || null;
}

/**
 * Vide tous les caches (pour debug/test)
 */
export function clearAllOddsCache(): void {
  // Vider localStorage
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });

  // Vider mémoire
  memoryCache.clear();

  console.log('[OddsService] Tous les caches vidés');
}

/**
 * Retourne les stats du cache
 */
export function getCacheStats(): { localStorage: number; memory: number } {
  const localKeys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_KEY_PREFIX));
  return {
    localStorage: localKeys.length,
    memory: memoryCache.size,
  };
}
