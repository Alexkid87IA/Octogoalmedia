// src/services/apiFootball.cache.ts
// Système de cache pour API-Football

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export function getCached<T = unknown>(key: string): T | null {
  const entry = cache[key];
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    delete cache[key];
    return null;
  }

  return entry.data as T;
}

export function setCache<T = unknown>(key: string, data: T): void {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
}

export function setCacheWithTimestamp(key: string, data: unknown): void {
  cache[key] = { data, timestamp: Date.now() };
}

export function clearCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key]);
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: Object.keys(cache).length,
    keys: Object.keys(cache),
  };
}
