import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  describe('rendering', () => {
    it('should render title', () => {
      render(<EmptyState title="No results found" />);
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('should render title as heading', () => {
      render(<EmptyState title="No data" />);
      expect(screen.getByRole('heading', { name: 'No data' })).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(<EmptyState title="Title" description="This is a description" />);
      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      render(<EmptyState title="Title" />);
      const paragraphs = document.querySelectorAll('p');
      expect(paragraphs.length).toBe(0);
    });
  });

  describe('icon', () => {
    it('should render icon when provided', () => {
      render(
        <EmptyState
          title="No results"
          icon={<span data-testid="custom-icon">Icon</span>}
        />
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should not render icon container when not provided', () => {
      const { container } = render(<EmptyState title="No results" />);
      const iconContainer = container.querySelector('.mb-4.text-gray-400');
      expect(iconContainer).toBeNull();
    });
  });

  describe('action', () => {
    it('should render action when provided', () => {
      render(
        <EmptyState
          title="No results"
          action={<button>Retry</button>}
        />
      );
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('should not render action container when not provided', () => {
      const { container } = render(<EmptyState title="No results" />);
      const actionContainer = container.querySelector('.mt-2');
      expect(actionContainer).toBeNull();
    });
  });

  describe('className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <EmptyState title="Title" className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should maintain default classes with custom className', () => {
      const { container } = render(
        <EmptyState title="Title" className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('flex');
      expect(container.firstChild).toHaveClass('flex-col');
      expect(container.firstChild).toHaveClass('items-center');
    });
  });

  describe('styling', () => {
    it('should be centered', () => {
      const { container } = render(<EmptyState title="Title" />);
      expect(container.firstChild).toHaveClass('items-center');
      expect(container.firstChild).toHaveClass('justify-center');
      expect(container.firstChild).toHaveClass('text-center');
    });

    it('should have padding', () => {
      const { container } = render(<EmptyState title="Title" />);
      expect(container.firstChild).toHaveClass('p-8');
    });
  });
});
