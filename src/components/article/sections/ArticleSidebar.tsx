// src/components/article/sections/ArticleSidebar.tsx
// Sidebar intelligente et optimisée
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, Clock, ChevronRight, Flame, Sparkles, Play, ExternalLink,
  Youtube, Instagram, Twitter, Star
} from "lucide-react";
import { SanityArticle, VerticalColors, TableOfContentsHeading } from "../../../types/article.types";
import ArticleAuthor from "../ui/ArticleAuthor";
import TableOfContents from "../ui/TableOfContents";
import { getAllArticles } from "../../../utils/sanityAPI";
import { urlFor } from "../../../utils/sanityClient";

// Encart Publicitaire
const SidebarAd: React.FC<{ format?: 'rectangle' | 'skyscraper'; className?: string }> = ({
  format = 'rectangle',
  className = ''
}) => (
  <div className={`relative ${className}`}>
    <div className={`
      p-4 bg-gray-900/50 border border-dashed border-gray-700 rounded-xl
      flex flex-col items-center justify-center text-center
      ${format === 'skyscraper' ? 'min-h-[600px]' : 'min-h-[250px]'}
    `}>
      <p className="text-[10px] uppercase tracking-widest text-gray-600">
        Publicité
      </p>
    </div>
  </div>
);

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
  const [featuredArticle, setFeaturedArticle] = useState<SanityArticle | null>(null);
  const [latestEmission, setLatestEmission] = useState<SanityArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Déterminer si l'article est "long" (beaucoup de headings)
  const isLongArticle = (headings?.length || 0) >= 3;

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const allArticles = await getAllArticles();

        if (allArticles && allArticles.length > 0) {
          // Flash articles
          setFlashArticles(allArticles.slice(0, 6));

          // Trending
          const trending = allArticles.filter(a => a.isTrending).slice(0, 6);
          setTrendingArticles(trending.length > 0 ? trending : allArticles.slice(0, 5));

          // Emissions
          const emissions = allArticles.filter(a => a.contentType === 'emission');
          setEmissionArticles(emissions.slice(0, 6));
          setLatestEmission(emissions[0] || null);

          // Article à la une (le plus récent trending ou le premier)
          const featured = allArticles.find(a => a.isTrending && a._id !== article._id) ||
                          allArticles.find(a => a._id !== article._id);
          setFeaturedArticle(featured || null);
        }
      } catch (error) {
        console.error("Erreur chargement articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [article._id]);

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `${diffInDays}j`;
    return publishedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getDisplayedArticles = () => {
    switch (activeTab) {
      case 'flash': return flashArticles;
      case 'trending': return trendingArticles;
      case 'emissions': return emissionArticles;
      default: return flashArticles;
    }
  };

  const getArticleImage = (art: SanityArticle, size: number = 200) => {
    try {
      // Cas 1: mainImage avec asset URL directe (format dé-référencé)
      if (art.mainImage?.asset?.url) {
        return art.mainImage.asset.url;
      }
      // Cas 2: mainImage avec asset._ref (format Sanity référence)
      if (art.mainImage?.asset?._ref) {
        return urlFor(art.mainImage).width(size).height(size).url();
      }
      // Cas 3: mainImage a juste un asset (essayer urlFor)
      if (art.mainImage?.asset) {
        try {
          return urlFor(art.mainImage).width(size).height(size).url();
        } catch {
          // Si urlFor échoue, continuer
        }
      }
      // Cas 4: mainImage est une string URL
      if (typeof art.mainImage === 'string' && art.mainImage.startsWith('http')) {
        return art.mainImage;
      }
      // Cas 5: mainImageUrl direct
      if (art.mainImageUrl) return art.mainImageUrl;
      // Cas 6: image dans le champ image (fallback)
      if ((art as any).image?.asset?.url) {
        return (art as any).image.asset.url;
      }
      if ((art as any).image?.asset?._ref) {
        return urlFor((art as any).image).width(size).height(size).url();
      }
      return null;
    } catch (e) {
      console.error('Error getting article image:', e);
      return null;
    }
  };

  const tabs = [
    { id: 'flash' as FlashTab, label: 'Flash', icon: Zap },
    { id: 'trending' as FlashTab, label: 'Tendances', icon: Flame },
    { id: 'emissions' as FlashTab, label: 'Vidéos', icon: Play },
  ];

  return (
    <div className="space-y-6">
      {/* Auteur */}
      {article.author && (
        <ArticleAuthor
          author={article.author}
          publishedAt={article.publishedAt}
          colors={colors}
          variant="desktop"
        />
      )}

      {/* Table des matières (si article long) */}
      {isLongArticle && headings && headings.length > 0 && (
        <TableOfContents
          headings={headings}
          activeSection={activeSection}
          scrollProgress={scrollProgress}
          colors={colors}
          variant="desktop"
        />
      )}

      {/* Widget Flash Info */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        {/* Onglets */}
        <div className="p-1 bg-black/30">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                    text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste */}
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {getDisplayedArticles().map((item) => {
                const imageUrl = getArticleImage(item);
                return (
                  <Link
                    key={item._id}
                    to={`/article/${item.slug.current}`}
                    className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    {imageUrl && (
                      <div className="w-14 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-800">
                        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-xs text-gray-500">{getRelativeTime(item.publishedAt || '')}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Link
          to="/articles"
          className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white p-3 border-t border-white/5"
        >
          Voir tous les articles <ChevronRight size={14} />
        </Link>
      </div>

      {/* À la une - Article vedette */}
      {featuredArticle && (
        <Link
          to={`/article/${featuredArticle.slug.current}`}
          className="block group rounded-xl overflow-hidden bg-gray-900/80 border border-white/10"
        >
          {/* Image grande */}
          <div className="relative aspect-video overflow-hidden">
            {getArticleImage(featuredArticle, 600) ? (
              <img
                src={getArticleImage(featuredArticle, 600)!}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-gray-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-pink-500 rounded-md">
              <Star size={12} className="text-white" />
              <span className="text-xs font-bold text-white">À la une</span>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-4">
            <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
              {featuredArticle.title}
            </h3>
            {featuredArticle.excerpt && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">{featuredArticle.excerpt}</p>
            )}
          </div>
        </Link>
      )}

      {/* Dernière émission Octogoal */}
      {latestEmission && (
        <div className="rounded-xl overflow-hidden bg-gray-900/80 border border-white/10">
          <div className="p-3 border-b border-white/5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
              <Play size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">Dernière émission</span>
          </div>

          <Link to={`/article/${latestEmission.slug.current}`} className="block group">
            <div className="relative aspect-video">
              {getArticleImage(latestEmission, 600) ? (
                <img
                  src={getArticleImage(latestEmission, 600)!}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-gray-900" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Play size={24} className="text-white ml-1" />
                </div>
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-medium text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                {latestEmission.title}
              </h4>
            </div>
          </Link>
        </div>
      )}

      {/* Réseaux sociaux */}
      <div className="rounded-xl bg-gray-900/80 border border-white/10 p-4">
        <h3 className="text-sm font-bold text-white mb-4">Suivez-nous</h3>
        <div className="grid grid-cols-3 gap-2">
          <a
            href="https://youtube.com/@octogoal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors group"
          >
            <Youtube size={20} className="text-red-500" />
            <span className="text-xs text-gray-400 group-hover:text-white">YouTube</span>
          </a>
          <a
            href="https://instagram.com/octogoal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-colors group"
          >
            <Instagram size={20} className="text-pink-500" />
            <span className="text-xs text-gray-400 group-hover:text-white">Instagram</span>
          </a>
          <a
            href="https://twitter.com/octogoal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors group"
          >
            <Twitter size={20} className="text-blue-500" />
            <span className="text-xs text-gray-400 group-hover:text-white">Twitter</span>
          </a>
        </div>
      </div>

      {/* À lire aussi (si article long) */}
      {isLongArticle && relatedArticles.length > 0 && (
        <div className="rounded-xl bg-gray-900/80 border border-white/10 overflow-hidden">
          <div className="p-3 border-b border-white/5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">À lire aussi</span>
          </div>
          <div className="p-2 space-y-1">
            {relatedArticles.slice(0, 4).map((related) => {
              const imageUrl = getArticleImage(related);
              return (
                <Link
                  key={related._id}
                  to={`/article/${related.slug.current}`}
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  <div className="w-14 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-800">
                    {imageUrl ? (
                      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-700" />
                    )}
                  </div>
                  <h4 className="flex-1 text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2">
                    {related.title}
                  </h4>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Pub Skyscraper en fin de sidebar */}
      <SidebarAd format="skyscraper" />

    </div>
  );
};

export default ArticleSidebar;
