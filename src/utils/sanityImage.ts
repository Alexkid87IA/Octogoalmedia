import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from './sanityClient';

// Créer un builder d'URL d'image
const builder = imageUrlBuilder(sanityClient);

/**
 * Vérifie si une valeur est une image Sanity valide
 * @param source - La source à vérifier
 * @returns true si c'est une image Sanity valide, false sinon
 */
export function isValidSanityImage(source: unknown): source is SanityImageSource | string {
  if (!source) return false;
  
  // Si c'est une chaîne et que c'est une URL, c'est valide
  if (typeof source === 'string') {
    return source.startsWith('http://') || source.startsWith('https://');
  }
  
  // Vérifier si c'est un objet d'image Sanity avec un asset
  return (
    typeof source === 'object' && 
    source !== null && 
    (source.asset || source._type === 'image')
  );
}

/**
 * Retourne un builder d'image pour une manipulation sécurisée
 * ou undefined si l'image n'est pas valide
 * @param source Source de l'image
 * @returns Builder d'image ou undefined
 */
export function getImageBuilder(source: unknown) {
  if (!isValidSanityImage(source)) return undefined;
  
  try {
    return builder.image(source);
  } catch (error) {
    console.error("Erreur lors de la création du builder d'image:", error);
    return undefined;
  }
}

/**
 * Génère une URL d'image sécurisée avec fallback
 * @param source Source de l'image
 * @param width Largeur optionnelle
 * @param height Hauteur optionnelle
 * @returns URL de l'image ou URL de placeholder
 */
export function urlFor(source: unknown, width?: number, height?: number): string | ReturnType<typeof builder.image> {
  // Si la source n'est pas valide ou est null, retourner une image placeholder
  if (!source) {
    const size = width && height ? `${width}x${height}` : '800x450';
    const placeholderUrl = `https://via.placeholder.com/${size}?text=Image+non+disponible`;
    
    // Retourner un objet compatible avec la chaîne de méthodes pour éviter les erreurs
    if (typeof width === 'undefined' && typeof height === 'undefined') {
      return {
        url: () => placeholderUrl,
        width: () => ({ height: () => ({ fit: () => ({ url: () => placeholderUrl }) }) })
      };
    }
    
    return placeholderUrl;
  }
  
  // Si c'est déjà une URL string
  if (typeof source === 'string') {
    if (source.startsWith('http://') || source.startsWith('https://')) {
      // Retourner un objet compatible avec la chaîne de méthodes pour éviter les erreurs
      if (typeof width === 'undefined' && typeof height === 'undefined') {
        return {
          url: () => source,
          width: () => ({ height: () => ({ fit: () => ({ url: () => source }) }) })
        };
      }
      
      return source;
    }
    
    const size = width && height ? `${width}x${height}` : '800x450';
    const placeholderUrl = `https://via.placeholder.com/${size}?text=URL+invalide`;
    
    // Retourner un objet compatible avec la chaîne de méthodes pour éviter les erreurs
    if (typeof width === 'undefined' && typeof height === 'undefined') {
      return {
        url: () => placeholderUrl,
        width: () => ({ height: () => ({ fit: () => ({ url: () => placeholderUrl }) }) })
      };
    }
    
    return placeholderUrl;
  }
  
  try {
    // Si c'est un objet d'image Sanity valide
    if (isValidSanityImage(source)) {
      let imageBuilder = builder.image(source as SanityImageSource);
      
      // Si les dimensions sont spécifiées, les appliquer et retourner l'URL directement
      if (typeof width !== 'undefined' || typeof height !== 'undefined') {
        if (width) imageBuilder = imageBuilder.width(width);
        if (height) imageBuilder = imageBuilder.height(height);
        return imageBuilder.auto('format').url();
      }
      
      // Sinon retourner le builder pour permettre la chaîne de méthodes
      return imageBuilder;
    }
  } catch (error) {
    console.error("Erreur lors de la génération de l'URL de l'image:", error);
  }
  
  // Fallback pour les cas non gérés
  const size = width && height ? `${width}x${height}` : '800x450';
  const placeholderUrl = `https://via.placeholder.com/${size}?text=Format+invalide`;
  
  // Retourner un objet compatible avec la chaîne de méthodes pour éviter les erreurs
  if (typeof width === 'undefined' && typeof height === 'undefined') {
    return {
      url: () => placeholderUrl,
      width: () => ({ height: () => ({ fit: () => ({ url: () => placeholderUrl }) }) })
    };
  }
  
  return placeholderUrl;
}

// Export le builder pour les cas où l'accès direct est nécessaire
export { builder as imageBuilder };
