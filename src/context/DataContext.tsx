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
   */
  const fetchAllData = async () => {
    console.log('🚀 Chargement des données...');
    setIsLoading(true);
    setError(null);

    try {
      // Charger toutes les données en parallèle (plus rapide)
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
      ] = await Promise.all([
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
      
      // Si pas d'articles trending, utiliser le fallback
      let finalRecentData = recentData;
      if (!recentData || recentData.length === 0) {
        console.log('Pas d\'articles trending, utilisation du fallback');
        finalRecentData = await sanityCache.fetch<SanityArticle[]>(QUERIES.RECENT_ARTICLES_FALLBACK);
      }

      // Mettre à jour les états avec les données reçues
      setFeaturedArticles(featuredData || []);
      setRecentArticles(finalRecentData || []);
      setLatestArticles(latestData || []);
      setUniverses(universesData || []);
      setClubFeatures(featuresData || []);
      setClubPricing(pricingData || []);
      setPodcasts(podcastsData || []);
      setCaseStudies(casesData || []);
      setSuccessStories(storiesData || []);
      
      console.log('✅ Données chargées avec succès');
      console.log(`Articles featured: ${featuredData?.length || 0}`);
      console.log(`Articles trending: ${finalRecentData?.length || 0}`);
      console.log(`Articles latest (Flash): ${latestData?.length || 0}`);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données. Veuillez réessayer.');
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