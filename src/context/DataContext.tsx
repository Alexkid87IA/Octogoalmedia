// src/context/DataContext.tsx
// Ce fichier crée un "chef d'orchestre" qui charge les données une seule fois
// et les partage avec tous les composants qui en ont besoin

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sanityCache } from '../utils/sanityCache';
import { 
  SanityArticle, 
  SanityUniverse, 
  SanityClubFeature, 
  SanityClubPricing,
  SanityPodcast,
  SanityCaseStudy,
  SanitySuccessStory 
} from '../types/sanity';

// Les requêtes Sanity centralisées
const QUERIES = {
  // Articles à la une (avec isFeatured au lieu de featured)
  FEATURED_ARTICLES: `
    *[_type == "article" && isFeatured == true] | order(publishedAt desc)[0...3] {
      _id, title, slug, mainImage, excerpt, publishedAt, 
      featured, isFeatured, readingTime,
      author->{name, image, bio, slug},
      categories[]->{_id, title, slug, description, color}
    }
  `,
  
  // Articles tendances (avec isTrending et trendingOrder)
  RECENT_ARTICLES: `
    *[_type == "article" && isTrending == true] | order(trendingOrder asc, publishedAt desc)[0...6] {
      _id, title, slug, mainImage, excerpt, publishedAt,
      readingTime, isTrending, trendingOrder,
      categories[]->{_id, title, slug, color}
    }
  `,
  
  // Fallback : si pas d'articles trending, prendre les plus récents
  RECENT_ARTICLES_FALLBACK: `
    *[_type == "article"] | order(publishedAt desc)[0...6] {
      _id, title, slug, mainImage, excerpt, publishedAt, readingTime,
      categories[]->{_id, title, slug, color}
    }
  `,
  
  // Derniers articles publiés (pour le widget Flash)
  LATEST_ARTICLES: `
    *[_type == "article"] | order(publishedAt desc)[0...20] {
      _id, title, slug, mainImage, excerpt, publishedAt, readingTime,
      categories[]->{_id, title, slug, color}
    }
  `,
  
  // Univers éditoriaux
  UNIVERSES: `
    *[_type == "universe"] | order(_createdAt desc) {
      _id, title, description, icon, image, color
    }
  `,
  
  // Fonctionnalités du club
  CLUB_FEATURES: `
    *[_type == "clubFeature"] | order(_createdAt asc) {
      _id, title, description, icon, available
    }
  `,
  
  // Tarifs
  CLUB_PRICING: `
    *[_type == "clubPricing"] | order(price asc) {
      _id, title, price, currency, period, features, highlighted, buttonText
    }
  `,
  
  // Podcasts récents
  PODCASTS: `
    *[_type == "podcast"] | order(publishedAt desc)[0...6] {
      _id, title, description, audioUrl, duration, publishedAt, guest, image, episodeNumber
    }
  `,
  
  // Études de cas
  CASE_STUDIES: `
    *[_type == "caseStudy"] | order(_createdAt desc)[0...4] {
      _id, title, company, description, challenge, solution, results, image, slug
    }
  `,
  
  // Success stories
  SUCCESS_STORIES: `
    *[_type == "successStory"] | order(_createdAt desc)[0...3] {
      _id, title, subtitle, content, author, image, metrics
    }
  `
};

// Type pour le contexte
interface DataContextType {
  // Les données
  featuredArticles: SanityArticle[];
  recentArticles: SanityArticle[];
  latestArticles: SanityArticle[];
  universes: SanityUniverse[];
  clubFeatures: SanityClubFeature[];
  clubPricing: SanityClubPricing[];
  podcasts: SanityPodcast[];
  caseStudies: SanityCaseStudy[];
  successStories: SanitySuccessStory[];
  
  // États
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refetch: () => void;
  clearCache: () => void;
}

// Créer le contexte
const DataContext = createContext<DataContextType | null>(null);

/**
 * Provider qui gère toutes les données de l'application
 */
export function DataProvider({ children }: { children: ReactNode }) {
  // États pour stocker les données
  const [featuredArticles, setFeaturedArticles] = useState<SanityArticle[]>([]);
  const [recentArticles, setRecentArticles] = useState<SanityArticle[]>([]);
  const [latestArticles, setLatestArticles] = useState<SanityArticle[]>([]);
  const [universes, setUniverses] = useState<SanityUniverse[]>([]);
  const [clubFeatures, setClubFeatures] = useState<SanityClubFeature[]>([]);
  const [clubPricing, setClubPricing] = useState<SanityClubPricing[]>([]);
  const [podcasts, setPodcasts] = useState<SanityPodcast[]>([]);
  const [caseStudies, setCaseStudies] = useState<SanityCaseStudy[]>([]);
  const [successStories, setSuccessStories] = useState<SanitySuccessStory[]>([]);
  
  // États de chargement et erreur
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge toutes les données depuis Sanity (avec cache)
   * Utilise Promise.allSettled pour être résilient aux erreurs individuelles
   */
  const fetchAllData = async () => {
    console.log('🚀 Chargement des données...');
    setIsLoading(true);
    setError(null);

    try {
      // Charger toutes les données en parallèle avec Promise.allSettled
      // Cela permet de continuer même si certaines requêtes échouent
      const results = await Promise.allSettled([
        sanityCache.fetch<SanityArticle[]>(QUERIES.FEATURED_ARTICLES),
        sanityCache.fetch<SanityArticle[]>(QUERIES.RECENT_ARTICLES),
        sanityCache.fetch<SanityArticle[]>(QUERIES.LATEST_ARTICLES),
        sanityCache.fetch<SanityUniverse[]>(QUERIES.UNIVERSES),
        sanityCache.fetch<SanityClubFeature[]>(QUERIES.CLUB_FEATURES),
        sanityCache.fetch<SanityClubPricing[]>(QUERIES.CLUB_PRICING),
        sanityCache.fetch<SanityPodcast[]>(QUERIES.PODCASTS),
        sanityCache.fetch<SanityCaseStudy[]>(QUERIES.CASE_STUDIES),
        sanityCache.fetch<SanitySuccessStory[]>(QUERIES.SUCCESS_STORIES)
      ]);

      // Extraire les données des résultats (null si échec)
      const getData = <T,>(result: PromiseSettledResult<T | null>): T | null => {
        if (result.status === 'fulfilled') return result.value;
        console.warn('❌ Requête échouée:', result.reason);
        return null;
      };

      const [
        featuredData,
        recentData,
        latestData,
        universesData,
        featuresData,
        pricingData,
        podcastsData,
        casesData,
        storiesData
      ] = results.map(getData);

      // Si pas d'articles trending, utiliser le fallback
      let finalRecentData = recentData as SanityArticle[] | null;
      if (!recentData || (recentData as SanityArticle[]).length === 0) {
        console.log('Pas d\'articles trending, utilisation du fallback');
        try {
          finalRecentData = await sanityCache.fetch<SanityArticle[]>(QUERIES.RECENT_ARTICLES_FALLBACK);
        } catch {
          finalRecentData = [];
        }
      }

      // Mettre à jour les états avec les données reçues (tableau vide si null)
      setFeaturedArticles((featuredData as SanityArticle[]) || []);
      setRecentArticles((finalRecentData as SanityArticle[]) || []);
      setLatestArticles((latestData as SanityArticle[]) || []);
      setUniverses((universesData as SanityUniverse[]) || []);
      setClubFeatures((featuresData as SanityClubFeature[]) || []);
      setClubPricing((pricingData as SanityClubPricing[]) || []);
      setPodcasts((podcastsData as SanityPodcast[]) || []);
      setCaseStudies((casesData as SanityCaseStudy[]) || []);
      setSuccessStories((storiesData as SanitySuccessStory[]) || []);

      // Compter les erreurs
      const failedCount = results.filter(r => r.status === 'rejected').length;
      if (failedCount > 0) {
        console.warn(`⚠️ ${failedCount}/9 requêtes ont échoué mais l'app continue`);
      } else {
        console.log('✅ Toutes les données chargées avec succès');
      }

      console.log(`Articles featured: ${(featuredData as SanityArticle[])?.length || 0}`);
      console.log(`Articles trending: ${(finalRecentData as SanityArticle[])?.length || 0}`);
      console.log(`Articles latest (Flash): ${(latestData as SanityArticle[])?.length || 0}`);
    } catch (err) {
      console.error('❌ Erreur critique lors du chargement des données:', err);
      // Ne pas bloquer l'app même en cas d'erreur critique
      setError('Certaines données n\'ont pas pu être chargées.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Vide le cache et recharge les données
   */
  const clearCache = () => {
    sanityCache.clear();
    fetchAllData();
  };

  // Charger les données au démarrage
  useEffect(() => {
    fetchAllData();
  }, []);

  // Valeur du contexte
  const value: DataContextType = {
    featuredArticles,
    recentArticles,
    latestArticles,
    universes,
    clubFeatures,
    clubPricing,
    podcasts,
    caseStudies,
    successStories,
    isLoading,
    error,
    refetch: fetchAllData,
    clearCache
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * Hook pour utiliser les données dans n'importe quel composant
 * 
 * Exemple d'utilisation:
 * ```tsx
 * const { featuredArticles, isLoading } = useData();
 * ```
 */
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData doit être utilisé dans un DataProvider');
  }
  return context;
}

// Export pour utilisation directe si besoin
export { DataContext };