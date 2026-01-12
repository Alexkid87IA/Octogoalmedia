import React from 'react';
import { urlFor } from '../../utils/sanityClient';

// Type pour les sources d'images Sanity
interface SanityImageSource {
  asset?: {
    _ref?: string;
    url?: string;
  } | string;
  url?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

type ImageSource = SanityImageSource | string | null | undefined;

interface SafeImageProps {
  source: ImageSource;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
  fallbackText?: string;
}

// SVG placeholder inline - pas de requête réseau
function getPlaceholderSvg(width: number, height: number, text: string = 'Image'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#1a1a1a"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#666">${text}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default function SafeImage({
  source,
  alt,
  className = '',
  width = 800,
  height = 600,
  loading = 'lazy',
  onError,
  fallbackText = 'Image'
}: SafeImageProps) {
  const placeholder = getPlaceholderSvg(width, height, fallbackText);

  // Si pas de source du tout, retourner placeholder
  if (!source) {
    return <img src={placeholder} alt={alt || ''} className={className} loading={loading} />;
  }

  // Si c'est déjà une URL string
  if (typeof source === 'string') {
    if (!source || source.trim() === '') {
      return <img src={placeholder} alt={alt || ''} className={className} loading={loading} />;
    }
    return (
      <img
        src={source}
        alt={alt}
        className={className}
        loading={loading}
        onError={(e) => {
          (e.target as HTMLImageElement).src = placeholder;
          onError?.();
        }}
      />
    );
  }

  try {
    const imgSource = source as SanityImageSource;

    // Si c'est un objet Sanity avec asset
    if (imgSource?.asset) {
      // Vérifier d'abord si on a une URL directe dans asset.url
      if (typeof imgSource.asset === 'object' && imgSource.asset.url) {
        return (
          <img
            src={imgSource.asset.url}
            alt={alt}
            className={className}
            loading={loading}
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholder;
              onError?.();
            }}
          />
        );
      }

      // Si asset est directement une string URL
      if (typeof imgSource.asset === 'string' && imgSource.asset.startsWith('http')) {
        return (
          <img
            src={imgSource.asset}
            alt={alt}
            className={className}
            loading={loading}
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholder;
              onError?.();
            }}
          />
        );
      }

      // Si on a asset._ref
      if (typeof imgSource.asset === 'object' && imgSource.asset._ref) {
        const ref = imgSource.asset._ref;

        // Vérifier que _ref n'est pas vide
        if (!ref || ref === '') {
          return <img src={placeholder} alt={alt || ''} className={className} loading={loading} />;
        }

        // Vérifier si c'est une URL
        if (ref.startsWith('http')) {
          return (
            <img
              src={ref}
              alt={alt}
              className={className}
              loading={loading}
              onError={(e) => {
                (e.target as HTMLImageElement).src = placeholder;
                onError?.();
              }}
            />
          );
        }

        // Si c'est une vraie référence Sanity (format: image-xxx-xxx-xxx)
        if (ref.includes('image-')) {
          try {
            const imageUrl = urlFor(source)
              .width(width)
              .height(height)
              .auto('format')
              .url();

            if (!imageUrl) {
              return <img src={placeholder} alt={alt || ''} className={className} loading={loading} />;
            }

            return (
              <img
                src={imageUrl}
                alt={alt}
                className={className}
                loading={loading}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholder;
                  onError?.();
                }}
              />
            );
          } catch {
            return <img src={placeholder} alt={alt || ''} className={className} loading={loading} />;
          }
        }

        // Si _ref n'est ni une URL ni une référence Sanity valide
        return <img src={placeholder} alt={alt || ''} className={className} loading={loading} />;
      }
    }

    // Si c'est un objet avec une propriété url directement
    if (imgSource?.url) {
      return (
        <img
          src={imgSource.url}
          alt={alt}
          className={className}
          loading={loading}
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholder;
            onError?.();
          }}
        />
      );
    }

    // Fallback
    return <img src={placeholder} alt={alt || ''} className={className} loading={loading} />;
  } catch {
    onError?.();
    return <img src={placeholder} alt={alt || ''} className={className} loading={loading} />;
  }
}
