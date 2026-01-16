import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SafeImage from './SafeImage'

describe('SafeImage', () => {
  it('renders with string source', () => {
    render(<SafeImage source="https://example.com/image.jpg" alt="Test image" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('renders placeholder when source is null', () => {
    render(<SafeImage source={null} alt="Placeholder" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Placeholder')
    expect(img.getAttribute('src')).toContain('data:image/svg+xml')
  })

  it('renders placeholder when source is empty string', () => {
    render(<SafeImage source="" alt="Empty" />)
    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toContain('data:image/svg+xml')
  })

  it('applies custom className', () => {
    render(<SafeImage source="https://example.com/image.jpg" alt="Test" className="custom-class" />)
    const img = screen.getByRole('img')
    expect(img).toHaveClass('custom-class')
  })

  it('has lazy loading by default', () => {
    render(<SafeImage source="https://example.com/image.jpg" alt="Test" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('can override loading to eager', () => {
    render(<SafeImage source="https://example.com/image.jpg" alt="Test" loading="eager" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('loading', 'eager')
  })

  it('calls onError and shows placeholder on image error', () => {
    const onError = vi.fn()
    render(<SafeImage source="https://invalid-url.com/404.jpg" alt="Error test" onError={onError} />)
    const img = screen.getByRole('img')

    fireEvent.error(img)

    expect(onError).toHaveBeenCalled()
    expect(img.getAttribute('src')).toContain('data:image/svg+xml')
  })

  it('handles Sanity image object with asset.url', () => {
    const sanityImage = {
      asset: {
        url: 'https://cdn.sanity.io/images/test.jpg'
      }
    }
    render(<SafeImage source={sanityImage} alt="Sanity image" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://cdn.sanity.io/images/test.jpg')
  })
})
