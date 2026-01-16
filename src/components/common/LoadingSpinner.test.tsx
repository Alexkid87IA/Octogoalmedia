import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('rendering', () => {
    it('should render with status role', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have accessible loading text for screen readers', () => {
      render(<LoadingSpinner />);
      expect(screen.getByText('Chargement en cours')).toBeInTheDocument();
    });

    it('should render custom text when provided', () => {
      render(<LoadingSpinner text="Loading data..." />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<LoadingSpinner />);
      const svg = document.querySelector('svg');
      const classList = svg?.getAttribute('class') || '';
      expect(classList).toContain('w-8');
      expect(classList).toContain('h-8');
    });

    it('should apply small size', () => {
      render(<LoadingSpinner size="small" />);
      const svg = document.querySelector('svg');
      const classList = svg?.getAttribute('class') || '';
      expect(classList).toContain('w-5');
      expect(classList).toContain('h-5');
    });

    it('should apply large size', () => {
      render(<LoadingSpinner size="large" />);
      const svg = document.querySelector('svg');
      const classList = svg?.getAttribute('class') || '';
      expect(classList).toContain('w-12');
      expect(classList).toContain('h-12');
    });
  });

  describe('colors', () => {
    it('should apply blue color by default', () => {
      render(<LoadingSpinner />);
      const svg = document.querySelector('svg');
      const classList = svg?.getAttribute('class') || '';
      expect(classList).toContain('text-accent-blue');
    });

    it('should apply white color', () => {
      render(<LoadingSpinner color="white" />);
      const svg = document.querySelector('svg');
      const classList = svg?.getAttribute('class') || '';
      expect(classList).toContain('text-white');
    });

    it('should apply gray color', () => {
      render(<LoadingSpinner color="gray" />);
      const svg = document.querySelector('svg');
      const classList = svg?.getAttribute('class') || '';
      expect(classList).toContain('text-gray-300');
    });
  });

  describe('animation', () => {
    it('should have spin animation', () => {
      render(<LoadingSpinner />);
      const svg = document.querySelector('svg');
      const classList = svg?.getAttribute('class') || '';
      expect(classList).toContain('animate-spin');
    });
  });

  describe('accessibility', () => {
    it('should have aria-live="polite"', () => {
      render(<LoadingSpinner />);
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-hidden on decorative svg', () => {
      render(<LoadingSpinner />);
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
