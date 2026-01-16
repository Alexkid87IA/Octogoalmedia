import { describe, it, expect } from 'vitest';
import { formatDate, calculateReadingTime, isRecentDate } from './dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format a valid ISO date string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('2024');
      expect(result).toContain('janvier');
    });

    it('should format a Date object', () => {
      const date = new Date('2024-06-20');
      const result = formatDate(date);
      expect(result).toContain('2024');
    });

    it('should return "Date inconnue" for undefined', () => {
      expect(formatDate(undefined)).toBe('Date inconnue');
    });

    it('should return "Date invalide" for invalid date string', () => {
      expect(formatDate('not-a-date')).toBe('Date invalide');
    });

    it('should return "Date inconnue" for empty string', () => {
      expect(formatDate('')).toBe('Date inconnue');
    });
  });

  describe('calculateReadingTime', () => {
    it('should return "1 min de lecture" for empty text', () => {
      expect(calculateReadingTime('')).toBe('1 min de lecture');
      expect(calculateReadingTime(undefined)).toBe('1 min de lecture');
    });

    it('should calculate reading time for short text', () => {
      const shortText = 'Hello world';
      expect(calculateReadingTime(shortText)).toBe('1 min de lecture');
    });

    it('should calculate reading time for longer text', () => {
      // 400 words at 200 wpm = 2 minutes
      const words = Array(400).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe('2 min de lecture');
    });

    it('should use custom words per minute', () => {
      // 200 words at 100 wpm = 2 minutes
      const words = Array(200).fill('word').join(' ');
      expect(calculateReadingTime(words, 100)).toBe('2 min de lecture');
    });

    it('should round up reading time', () => {
      // 250 words at 200 wpm = 1.25 minutes -> 2 minutes
      const words = Array(250).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe('2 min de lecture');
    });
  });

  describe('isRecentDate', () => {
    it('should return false for undefined', () => {
      expect(isRecentDate(undefined)).toBe(false);
    });

    it('should return true for today', () => {
      const today = new Date();
      expect(isRecentDate(today)).toBe(true);
    });

    it('should return true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isRecentDate(yesterday)).toBe(true);
    });

    it('should return false for old dates', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 30);
      expect(isRecentDate(oldDate)).toBe(false);
    });

    it('should use custom days threshold', () => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      expect(isRecentDate(tenDaysAgo, 7)).toBe(false);
      expect(isRecentDate(tenDaysAgo, 15)).toBe(true);
    });

    it('should handle ISO date strings', () => {
      const today = new Date().toISOString();
      expect(isRecentDate(today)).toBe(true);
    });
  });
});
