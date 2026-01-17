// src/services/apiFootball.cache.ts
// Système de cache pour API-Football

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl?: number; // TTL personnalisé en ms
}

const cache: Record<string, CacheEntry> = {};

// =============================================
// DURÉES DE CACHE OPTIMISÉES
// =============================================
export const CACHE_DURATIONS = {
  // Données statiques - 24h
  TEAM_DETAILS: 24 * 60 * 60 * 1000,      // Infos équipe (nom, logo, stade)
  TEAM_SQUAD: 24 * 60 * 60 * 1000,        // Effectif équipe
  PLAYER_INFO: 24 * 60 * 60 * 1000,       // Infos joueur
  ROUNDS: 24 * 60 * 60 * 1000,            // Journées/Rounds de compétition

  // Données semi-statiques - 2h
  STANDINGS: 2 * 60 * 60 * 1000,          // Classements
  TOP_SCORERS: 2 * 60 * 60 * 1000,        // Buteurs/Passeurs

  // Données dynamiques - 1h
  TEAM_STATS: 60 * 60 * 1000,             // Stats équipe saison
  NEXT_MATCHES: 60 * 60 * 1000,           // Prochains matchs
  LAST_RESULTS: 60 * 60 * 1000,           // Résultats récents

  // Données temps réel - court
  LIVE_MATCHES: 30 * 1000,                // Matchs en direct (30s)
  MATCH_DETAILS: 60 * 1000,               // Détails match en cours (1min)

  // Erreurs
  ERROR_SHORT: 30 * 1000,                 // Erreur courte (30s)
  ERROR_MEDIUM: 2 * 60 * 1000,            // Erreur moyenne (2min)

  // Défaut
  DEFAULT: 15 * 60 * 1000,                // 15 minutes
};

const CACHE_DURATION = CACHE_DURATIONS.DEFAULT;

// Requêtes en cours pour éviter les appels concurrents
const pendingRequests: Map<string, Promise<unknown>> = new Map();

export function getCached<T = unknown>(key: string): T | null {
  const entry = cache[key];
  if (!entry) return null;

  const ttl = entry.ttl || CACHE_DURATION;
  const isExpired = Date.now() - entry.timestamp > ttl;
  if (isExpired) {
    delete cache[key];
    return null;
  }

  return entry.data as T;
}

export function setCache<T = unknown>(key: string, data: T, ttl?: number): void {
  cache[key] = {
    data,
    timestamp: Date.now(),
    ttl,
  };
}

export function setCacheWithTimestamp(key: string, data: unknown): void {
  cache[key] = { data, timestamp: Date.now() };
}

export function clearCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key]);
  pendingRequests.clear();
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: Object.keys(cache).length,
    keys: Object.keys(cache),
  };
}

// Déduplication des requêtes concurrentes
export function getPendingRequest<T>(key: string): Promise<T> | null {
  return pendingRequests.get(key) as Promise<T> | null;
}

export function setPendingRequest<T>(key: string, promise: Promise<T>): void {
  pendingRequests.set(key, promise);
}

export function deletePendingRequest(key: string): void {
  pendingRequests.delete(key);
}
