import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCached, setCache, clearCache, getCacheStats } from './apiFootball.cache';

describe('apiFootball.cache', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('setCache and getCached', () => {
    it('should store and retrieve data', () => {
      setCache('test-key', { foo: 'bar' });
      const result = getCached<{ foo: string }>('test-key');
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should return null for non-existent key', () => {
      const result = getCached('non-existent');
      expect(result).toBeNull();
    });

    it('should store different data types', () => {
      setCache('string', 'hello');
      setCache('number', 42);
      setCache('array', [1, 2, 3]);
      setCache('object', { a: 1 });

      expect(getCached('string')).toBe('hello');
      expect(getCached('number')).toBe(42);
      expect(getCached('array')).toEqual([1, 2, 3]);
      expect(getCached('object')).toEqual({ a: 1 });
    });

    it('should overwrite existing data', () => {
      setCache('key', 'first');
      setCache('key', 'second');
      expect(getCached('key')).toBe('second');
    });
  });

  describe('cache expiration', () => {
    it('should return data before expiration', () => {
      setCache('fresh', 'data');
      expect(getCached('fresh')).toBe('data');
    });

    it('should return null after expiration', () => {
      vi.useFakeTimers();

      setCache('expiring', 'data');
      expect(getCached('expiring')).toBe('data');

      // Advance time by 16 minutes (cache duration is 15 minutes)
      vi.advanceTimersByTime(16 * 60 * 1000);

      expect(getCached('expiring')).toBeNull();

      vi.useRealTimers();
    });

    it('should return data just before expiration', () => {
      vi.useFakeTimers();

      setCache('almost-expiring', 'data');

      // Advance time by 14 minutes (just under 15 minute cache duration)
      vi.advanceTimersByTime(14 * 60 * 1000);

      expect(getCached('almost-expiring')).toBe('data');

      vi.useRealTimers();
    });
  });

  describe('clearCache', () => {
    it('should clear all cached data', () => {
      setCache('key1', 'value1');
      setCache('key2', 'value2');
      setCache('key3', 'value3');

      clearCache();

      expect(getCached('key1')).toBeNull();
      expect(getCached('key2')).toBeNull();
      expect(getCached('key3')).toBeNull();
    });
  });

  describe('getCacheStats', () => {
    it('should return empty stats for empty cache', () => {
      const stats = getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });

    it('should return correct stats after adding items', () => {
      setCache('key1', 'value1');
      setCache('key2', 'value2');

      const stats = getCacheStats();
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });
  });

  describe('type safety', () => {
    it('should handle typed retrieval', () => {
      interface User {
        name: string;
        age: number;
      }

      const user: User = { name: 'John', age: 30 };
      setCache('user', user);

      const retrieved = getCached<User>('user');
      expect(retrieved?.name).toBe('John');
      expect(retrieved?.age).toBe(30);
    });
  });
});
