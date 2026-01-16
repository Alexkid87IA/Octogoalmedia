import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllArticles, getUniverses, getClubFeatures, getClubPricing } from '../utils/sanityAPI';
import { SanityArticle, SanityUniverse, SanityClubFeature, SanityClubPricing } from '../types/sanity';

// Interface pour le contexte global
interface GlobalContextType {
  // Données
  articles: SanityArticle[];
  universes: SanityUniverse[];
  clubFeatures: SanityClubFeature[];
  clubPricing: SanityClubPricing[];
  
  // États de chargement
  isLoadingArticles: boolean;
  isLoadingUniverses: boolean;
  isLoadingClubData: boolean;
  
  // Erreurs
  articlesError: string | null;
  universesError: string | null;
  clubDataError: string | null;
  
  // Source des données (cms ou mock)
  articlesDataSource: 'cms' | 'mock';
  universesDataSource: 'cms' | 'mock';
  clubDataSource: 'cms' | 'mock';
  
  // Méthodes pour rafraîchir les données
  refreshArticles: () => Promise<void>;
  refreshUniverses: () => Promise<void>;
  refreshClubData: () => Promise<void>;
}

// Valeur par défaut du contexte
const defaultContextValue: GlobalContextType = {
  // Données
  articles: [],
  universes: [],
  clubFeatures: [],
  clubPricing: [],
  
  // États de chargement
  isLoadingArticles: false,
  isLoadingUniverses: false,
  isLoadingClubData: false,
  
  // Erreurs
  articlesError: null,
  universesError: null,
  clubDataError: null,
  
  // Source des données
  articlesDataSource: 'cms',
  universesDataSource: 'cms',
  clubDataSource: 'cms',
  
  // Méthodes pour rafraîchir les données (implémentées dans le provider)
  refreshArticles: async () => {},
  refreshUniverses: async () => {},
  refreshClubData: async () => {},
};

// Création du contexte
const GlobalContext = createContext<GlobalContextType>(defaultContextValue);

// Hook personnalisé pour utiliser le contexte
export const useGlobalContext = () => useContext(GlobalContext);

// Provider du contexte
export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  // États pour les données
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [universes, setUniverses] = useState<SanityUniverse[]>([]);
  const [clubFeatures, setClubFeatures] = useState<SanityClubFeature[]>([]);
  const [clubPricing, setClubPricing] = useState<SanityClubPricing[]>([]);
  
  // États de chargement
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isLoadingUniverses, setIsLoadingUniverses] = useState(false);
  const [isLoadingClubData, setIsLoadingClubData] = useState(false);
  
  // Erreurs
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [universesError, setUniversesError] = useState<string | null>(null);
  const [clubDataError, setClubDataError] = useState<string | null>(null);
  
  // Source des données
  const [articlesDataSource, setArticlesDataSource] = useState<'cms' | 'mock'>('cms');
  const [universesDataSource, setUniversesDataSource] = useState<'cms' | 'mock'>('cms');
  const [clubDataSource, setClubDataSource] = useState<'cms' | 'mock'>('cms');
  
  // Fonction pour charger les articles
  const fetchArticles = async () => {
    try {
      setIsLoadingArticles(true);
      setArticlesError(null);
      
      const result = await getAllArticles();
      
      if (result && result.length > 0) {
        setArticles(result);
        setArticlesDataSource('cms');
        // console.log('Articles chargés depuis Sanity CMS');
      } else {
        // Si aucun article n'est trouvé, on garde les articles actuels
        // ou on pourrait définir des articles mockés ici
        setArticlesDataSource('mock');
        // console.log('Aucun article trouvé dans Sanity');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      setArticlesError('Impossible de charger les articles');
      setArticlesDataSource('mock');
    } finally {
      setIsLoadingArticles(false);
    }
  };
  
  // Fonction pour charger les univers
  const fetchUniverses = async () => {
    try {
      setIsLoadingUniverses(true);
      setUniversesError(null);
      
      const result = await getUniverses();
      
      if (result && result.length > 0) {
        setUniverses(result);
        setUniversesDataSource('cms');
        // console.log('Univers chargés depuis Sanity CMS');
      } else {
        // Si aucun univers n'est trouvé, on garde les univers actuels
        setUniversesDataSource('mock');
        // console.log('Aucun univers trouvé dans Sanity');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des univers:', error);
      setUniversesError('Impossible de charger les univers');
      setUniversesDataSource('mock');
    } finally {
      setIsLoadingUniverses(false);
    }
  };
  
  // Fonction pour charger les données du club
  const fetchClubData = async () => {
    try {
      setIsLoadingClubData(true);
      setClubDataError(null);
      
      const [featuresResult, pricingResult] = await Promise.all([
        getClubFeatures(),
        getClubPricing()
      ]);
      
      if (featuresResult && featuresResult.length > 0) {
        setClubFeatures(featuresResult);
        setClubDataSource('cms');
        // console.log('Fonctionnalités du club chargées depuis Sanity CMS');
      } else {
        setClubDataSource('mock');
        // console.log('Aucune fonctionnalité du club trouvée dans Sanity');
      }
      
      if (pricingResult && pricingResult.length > 0) {
        setClubPricing(pricingResult);
        // console.log('Tarifs du club chargés depuis Sanity CMS');
      } else {
        setClubDataSource('mock');
        // console.log('Aucun tarif du club trouvé dans Sanity');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données du club:', error);
      setClubDataError('Impossible de charger les données du club');
      setClubDataSource('mock');
    } finally {
      setIsLoadingClubData(false);
    }
  };
  
  // Chargement initial des données
  useEffect(() => {
    fetchArticles();
    fetchUniverses();
    fetchClubData();
  }, []);
  
  // Valeur du contexte
  const contextValue: GlobalContextType = {
    // Données
    articles,
    universes,
    clubFeatures,
    clubPricing,
    
    // États de chargement
    isLoadingArticles,
    isLoadingUniverses,
    isLoadingClubData,
    
    // Erreurs
    articlesError,
    universesError,
    clubDataError,
    
    // Source des données
    articlesDataSource,
    universesDataSource,
    clubDataSource,
    
    // Méthodes pour rafraîchir les données
    refreshArticles: fetchArticles,
    refreshUniverses: fetchUniverses,
    refreshClubData: fetchClubData,
  };
  
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
