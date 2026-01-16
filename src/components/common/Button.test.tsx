import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Button } from './Button';

// Wrapper for Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Button', () => {
  describe('rendering', () => {
    it('should render children correctly', () => {
      render(<Button>Click me</Button>, { wrapper: RouterWrapper });
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render as a button by default', () => {
      render(<Button>Button</Button>, { wrapper: RouterWrapper });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render as a link when "to" prop is provided', () => {
      render(<Button to="/test">Link Button</Button>, { wrapper: RouterWrapper });
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('should render as an anchor when "href" prop is provided', () => {
      render(<Button href="https://example.com">External Link</Button>, { wrapper: RouterWrapper });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('variants', () => {
    it('should apply primary variant by default', () => {
      render(<Button>Primary</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gradient-to-r');
    });

    it('should apply secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-white/10');
    });

    it('should apply outline variant', () => {
      render(<Button variant="outline">Outline</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('border');
    });

    it('should apply ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
    });
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<Button>Medium</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-6');
    });

    it('should apply small size', () => {
      render(<Button size="sm">Small</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-4');
    });

    it('should apply large size', () => {
      render(<Button size="lg">Large</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-8');
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should have opacity class when disabled', () => {
      render(<Button disabled>Disabled</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('opacity-50');
    });

    it('should prevent click when disabled link', () => {
      const onClick = vi.fn();
      render(<Button to="/test" disabled onClick={onClick}>Disabled Link</Button>, { wrapper: RouterWrapper });
      const link = screen.getByRole('link');
      fireEvent.click(link);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('fullWidth', () => {
    it('should have full width class when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('w-full');
    });
  });

  describe('icon', () => {
    it('should render icon on the right by default', () => {
      render(<Button icon={<span data-testid="icon">Icon</span>}>With Icon</Button>, { wrapper: RouterWrapper });
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render icon on the left when iconPosition is left', () => {
      render(
        <Button icon={<span data-testid="icon">Icon</span>} iconPosition="left">
          With Icon
        </Button>,
        { wrapper: RouterWrapper }
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>, { wrapper: RouterWrapper });
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('custom className', () => {
    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });
  });
});
