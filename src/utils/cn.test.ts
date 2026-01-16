import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('should combine multiple class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'active', false && 'hidden');
    expect(result).toBe('base active');
  });

  it('should handle undefined and null', () => {
    const result = cn('base', undefined, null, 'end');
    expect(result).toBe('base end');
  });

  it('should merge Tailwind classes correctly', () => {
    // Later class should override earlier conflicting class
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['foo', 'bar'], 'baz');
    expect(result).toBe('foo bar baz');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'active': true,
      'disabled': false,
      'visible': true,
    });
    expect(result).toBe('active visible');
  });

  it('should merge conflicting Tailwind colors', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should merge conflicting Tailwind spacing', () => {
    const result = cn('m-4', 'm-8');
    expect(result).toBe('m-8');
  });

  it('should return empty string for no inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle complex combinations', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled',
      ['array-class'],
      { 'object-class': true }
    );
    expect(result).toContain('base-class');
    expect(result).toContain('active');
    expect(result).toContain('array-class');
    expect(result).toContain('object-class');
    expect(result).not.toContain('disabled');
  });
});
