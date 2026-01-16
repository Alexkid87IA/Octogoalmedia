// src/components/common/OptimizedImage.tsx
// Composant pour optimiser le chargement des images
// CORRIGÉ : Gère à la fois les références Sanity ET les URLs directes

import React, { useState, useEffect, useRef } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from '../../utils/sanityClient';
import { SanityImage } from '../../types/sanity';

// Créer le builder d'URL pour Sanity
const builder = imageUrlBuilder(sanityClient);

// Type pour les sources d'image flexibles
type ImageSource = SanityImage | string | { asset?: { _ref?: string } } | null | undefined;

interface OptimizedImageProps {
  source: ImageSource;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean; // Pour les images importantes (au-dessus de la ligne de flottaison)
  quality?: number; // Qualité de l'image (1-100)
  blur?: boolean; // Afficher un effet de flou pendant le chargement
  fallbackSrc?: string; // Image de secours si erreur
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Composant d'image optimisée avec:
 * - Lazy loading automatique (charge seulement quand visible)
 * - Optimisation de taille via Sanity (si référence Sanity)
 * - Format WebP automatique si supporté
 * - Placeholder flou pendant le chargement
 * - Gestion des erreurs
 * - Support des URLs directes ET références Sanity
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  quality = 80,
  blur = true,
  fallbackSrc = '/images/placeholder.jpg',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Si priority, charger immédiatement
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  /**
   * Détermine si la source est une URL directe ou une référence Sanity
   */
  const isDirectUrl = (src: ImageSource): boolean => {
    if (typeof src === 'string') {
      return src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/');
    }
    // Si c'est un objet avec asset._ref qui est une URL, c'est aussi une URL directe
    if (src && typeof src === 'object' && 'asset' in src && src.asset?._ref && typeof src.asset._ref === 'string') {
      return src.asset._ref.startsWith('http://') || src.asset._ref.startsWith('https://');
    }
    return false;
  };

  /**
   * Obtenir l'URL de l'image en gérant les différents formats
   */
  const getImageUrl = (): string => {
    // Si erreur, utiliser le fallback
    if (hasError) {
      return fallbackSrc;
    }

    // Si c'est une string directe (URL)
    if (typeof source === 'string') {
      return source;
    }

    // Si c'est un objet avec asset._ref
    if (source?.asset?._ref) {
      const ref = source.asset._ref;
      
      // Si _ref est une URL directe (cas des données mockées)
      if (typeof ref === 'string' && (ref.startsWith('http://') || ref.startsWith('https://'))) {
        return ref;
      }
      
      // Si c'est une vraie référence Sanity (format: image-xxx-xxx-xxx)
      if (typeof ref === 'string' && ref.includes('image-')) {
        try {
          return builder
            .image(source)
            .width(width)
            .height(height)
            .quality(quality)
            .format('webp')
            .url();
        } catch (error) {
          console.warn('Erreur lors de la construction de l\'URL Sanity:', error);
          return fallbackSrc;
        }
      }
    }

    // Si c'est un objet avec une propriété url
    if (source?.url) {
      return source.url;
    }

    // Fallback par défaut
    return fallbackSrc;
  };

  /**
   * Obtenir l'URL de la version floue (pour le placeholder)
   * Seulement pour les vraies références Sanity
   */
  const getBlurUrl = (): string => {
    // Ne pas créer de blur pour les URLs directes
    if (isDirectUrl(source)) {
      return '';
    }

    // Si c'est une vraie référence Sanity
    if (source?.asset?._ref && typeof source.asset._ref === 'string' && source.asset._ref.includes('image-')) {
      try {
        return builder
          .image(source)
          .width(20) // Très petite image pour le flou
          .quality(20)
          .blur(50)
          .url();
      } catch (error) {
        return '';
      }
    }

    return '';
  };

  // Observer pour le lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        // Commencer à charger 100px avant que l'image soit visible
        rootMargin: '100px'
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Gestion du chargement
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Gestion des erreurs
  const handleError = () => {
    console.warn(`Erreur de chargement de l'image: ${alt}`);
    setHasError(true);
    onError?.();
  };

  const imageUrl = getImageUrl();
  const blurUrl = getBlurUrl();

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        maxWidth: '100%'
      }}
    >
      {/* Image floue de placeholder (seulement pour les images Sanity) */}
      {blur && blurUrl && !isLoaded && (
        <img
          src={blurUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110"
          aria-hidden="true"
        />
      )}

      {/* Image principale */}
      {isInView && (
        <img
          ref={imgRef}
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Skeleton loader si pas encore chargé et pas de blur */}
      {!isLoaded && !blurUrl && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  );
};

/**
 * Version simplifiée pour une utilisation rapide
 */
export const QuickImage: React.FC<{
  src: SanityImage | string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => (
  <OptimizedImage
    source={src}
    alt={alt}
    className={className}
    blur={true}
    quality={85}
  />
);

// Export par défaut pour compatibilité
export default OptimizedImage;