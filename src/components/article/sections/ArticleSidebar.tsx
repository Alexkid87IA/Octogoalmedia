// src/components/article/sections/ArticleSidebar.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Zap, TrendingUp, Tv, Clock, ChevronUp, ChevronDown
} from "lucide-react";
import { SanityArticle, VerticalColors, TableOfContentsHeading } from "../../../types/article.types";
import ArticleAuthor from "../ui/ArticleAuthor";
import TableOfContents from "../ui/TableOfContents";
import { getAllArticles } from "../../../utils/sanityAPI";

interface ArticleSidebarProps {
  article: SanityArticle;
  relatedArticles: SanityArticle[];
  latestArticles?: SanityArticle[];
  headings: TableOfContentsHeading[] | null;
  activeSection: string;
  scrollProgress: number;
  colors: VerticalColors;
  onShare: () => void;
}

// Types pour les onglets du widget Flash
type FlashTab = 'flash' | 'trending' | 'emissions';

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
  article,
  relatedArticles,
  latestArticles = [],
  headings,
  activeSection,
  scrollProgress,
  colors,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState<FlashTab>('flash');
  const [flashArticles, setFlashArticles] = useState<SanityArticle[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<SanityArticle[]>([]);
  const [emissionArticles, setEmissionArticles] = useState<SanityArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les articles pour le widget Flash
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const allArticles = await getAllArticles();
        
        if (allArticles && allArticles.length > 0) {
          // Flash : 10 derniers articles (tous types)
          setFlashArticles(allArticles.slice(0, 10));
          
          // Trending : articles avec isTrending = true
          const trending = allArticles.filter(a => a.isTrending).slice(0, 10);
          setTrendingArticles(trending.length > 0 ? trending : allArticles.slice(0, 5));
          
          // Émissions : articles de type emission
          const emissions = allArticles.filter(a => a.contentType === 'emission').slice(0, 10);
          setEmissionArticles(emissions);
        }
      } catch (error) {
        console.error("Erreur chargement articles Flash:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, []);

  // Fonction pour formater l'heure relative
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInMs = now.getTime() - publishedDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `${diffInDays}j`;
    
    return publishedDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Fonction pour formater l'heure exacte (style Foot Mercato)
  const getExactTime = (date: string) => {
    const publishedDate = new Date(date);
    return publishedDate.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Articles à afficher selon l'onglet actif
  const getDisplayedArticles = () => {
    switch (activeTab) {
      case 'flash':
        return flashArticles;
      case 'trending':
        return trendingArticles;
      case 'emissions':
        return emissionArticles;
      default:
        return flashArticles;
    }
  };

  const displayedArticles = getDisplayedArticles();

  // Configuration des onglets
  const tabs = [
    { id: 'flash' as FlashTab, label: 'Flash', icon: Zap, color: 'text-yellow-400' },
    { id: 'trending' as FlashTab, label: 'Tendances', icon: TrendingUp, color: 'text-pink-500' },
    { id: 'emissions' as FlashTab, label: 'Émissions', icon: Tv, color: 'text-blue-400' },
  ];
  
  return (
    <div className="space-y-6">
      
      {/* Encart Auteur - Compact */}
      {article.author && (
        <ArticleAuthor 
          author={article.author}
          publishedAt={article.publishedAt}
          colors={colors}
          variant="desktop"
        />
      )}
      
      {/* Table des matières - Sticky */}
      {headings && headings.length > 0 && (
        <div className="sticky top-24">
          <TableOfContents
            headings={headings}
            activeSection={activeSection}
            scrollProgress={scrollProgress}
            colors={colors}
            variant="desktop"
          />
        </div>
      )}

      {/* EMPLACEMENT PUB 1 */}
      <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-4 flex items-center justify-center min-h-[250px]">
        <span className="text-gray-500 text-sm">Emplacement Pub (300x250)</span>
      </div>

      {/* Widget Flash - Style Foot Mercato */}
      <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden">
        
        {/* Header avec onglets */}
        <div className="border-b border-gray-700/50">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-all relative ${
                    isActive 
                      ? 'text-white bg-white/5' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className={isActive ? tab.color : ''} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  
                  {/* Indicateur actif */}
                  {isActive && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ 
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary || colors.primary})` 
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Liste des articles */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 text-sm mt-2">Chargement...</p>
            </div>
          ) : displayedArticles.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              Aucun article disponible
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              {displayedArticles.map((item, index) => (
                <Link
                  key={item._id}
                  to={`/article/${item.slug.current}`}
                  className="flex items-start gap-3 p-3 hover:bg-white/5 transition-colors group"
                >
                  {/* Heure */}
                  <span className="text-xs text-gray-500 font-mono w-12 flex-shrink-0 pt-0.5">
                    {getExactTime(item.publishedAt || new Date().toISOString())}
                  </span>
                  
                  {/* Titre */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    
                    {/* Badge catégorie */}
                    {item.categories && item.categories[0] && (
                      <span className="inline-block mt-1 text-xs text-gray-500">
                        {item.categories[0].title}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer - Voir tous */}
        <div className="border-t border-gray-700/50 p-3">
          <Link 
            to="/articles"
            className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>Voir tous les articles</span>
            <ChevronDown size={14} />
          </Link>
        </div>
      </div>

      {/* EMPLACEMENT PUB 2 */}
      <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-4 flex items-center justify-center min-h-[250px]">
        <span className="text-gray-500 text-sm">Emplacement Pub (300x250)</span>
      </div>

      {/* Articles similaires - Version compacte (3 max) */}
      {relatedArticles.length > 0 && (
        <div className="bg-gray-900/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>📰</span> À lire aussi
          </h3>
          
          <div className="space-y-3">
            {relatedArticles.slice(0, 3).map((related) => (
              <Link
                key={related._id}
                to={`/article/${related.slug.current}`}
                className="group block"
              >
                <div className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                  {/* Miniature */}
                  {related.mainImage && related.mainImage.asset && related.mainImage.asset._ref && (
                    <img 
                      src={`https://cdn.sanity.io/images/5rn8u6ed/production/${related.mainImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}?w=80&h=60&fit=crop&auto=format`}
                      alt={related.title}
                      className="w-16 h-12 object-cover rounded flex-shrink-0"
                    />
                  )}
                  
                  {/* Titre */}
                  <h4 className="text-xs text-gray-300 group-hover:text-white transition-colors line-clamp-2 flex-1">
                    {related.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* EMPLACEMENT PUB 3 - Format vertical (optionnel) */}
      <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-4 flex items-center justify-center min-h-[600px]">
        <span className="text-gray-500 text-sm text-center">Emplacement Pub<br/>(300x600)</span>
      </div>

    </div>
  );
};

export default ArticleSidebar;