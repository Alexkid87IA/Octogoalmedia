import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Définition locale du type SanityImage
export interface SanityImage {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

// Configuration depuis les variables d'environnement
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "5rn8u6ed";
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-01-01"; // Aligné avec votre .env

// Chargement du token depuis les variables d'environnement
const previewToken = import.meta.env.VITE_SANITY_PREVIEW_TOKEN;

// Note: VITE_SANITY_PREVIEW_TOKEN doit être configuré pour le mode preview

// Client public pour les contenus publiés
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  cors: true
});

// Client preview pour les brouillons (avec token)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // IMPORTANT: Pas de CDN pour le preview
  perspective: "raw", // IMPORTANT: "raw" permet de voir TOUS les documents
  cors: true,
  token: previewToken,
  ignoreBrowserTokenWarning: true
});


// Create a reusable image builder instance
const builder = imageUrlBuilder(sanityClient);

// Unified urlFor function for image URL generation
export function urlFor(source: SanityImage | string | undefined) {
  // Si pas de source, retourner un builder factice
  if (!source) {
    return {
      width: (w: number) => ({
        height: (h: number) => ({
          url: () => "https://via.placeholder.com/800x450?text=Image+non+disponible"
        }),
        url: () => "https://via.placeholder.com/800x450?text=Image+non+disponible"
      }),
      height: (h: number) => ({
        width: (w: number) => ({
          url: () => "https://via.placeholder.com/800x450?text=Image+non+disponible"
        }),
        url: () => "https://via.placeholder.com/800x450?text=Image+non+disponible"
      }),
      url: () => "https://via.placeholder.com/800x450?text=Image+non+disponible",
      auto: (format: string) => ({
        url: () => "https://via.placeholder.com/800x450?text=Image+non+disponible"
      })
    };
  }
  
  // Si c'est une string (URL directe)
  if (typeof source === 'string') {
    const finalUrl = (source.startsWith('http://') || source.startsWith('https://')) 
      ? source 
      : "https://via.placeholder.com/800x450?text=Source+invalide";
    
    return {
      width: (w: number) => ({
        height: (h: number) => ({
          url: () => finalUrl
        }),
        url: () => finalUrl
      }),
      height: (h: number) => ({
        width: (w: number) => ({
          url: () => finalUrl
        }),
        url: () => finalUrl
      }),
      url: () => finalUrl,
      auto: (format: string) => ({
        url: () => finalUrl
      })
    };
  }
  
  // Si c'est un objet SanityImage avec asset
  if ((source as SanityImage).asset) {
    return builder.image(source);
  }
  
  // Fallback
  return {
    width: (w: number) => ({
      height: (h: number) => ({
        url: () => "https://via.placeholder.com/800x450?text=Source+image+invalide"
      }),
      url: () => "https://via.placeholder.com/800x450?text=Source+image+invalide"
    }),
    height: (h: number) => ({
      width: (w: number) => ({
        url: () => "https://via.placeholder.com/800x450?text=Source+image+invalide"
      }),
      url: () => "https://via.placeholder.com/800x450?text=Source+image+invalide"
    }),
    url: () => "https://via.placeholder.com/800x450?text=Source+image+invalide",
    auto: (format: string) => ({
      url: () => "https://via.placeholder.com/800x450?text=Source+image+invalide"
    })
  };
}

// Export the builder for cases where direct access is needed
export { builder as imageBuilder };

// Fonction helper pour vérifier si on est en mode preview
export function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('preview') === 'true';
}

// Fonction helper pour obtenir le bon client selon le contexte
export function getClient(preview = false) {
  return preview ? previewClient : sanityClient;
}