// src/pages/CategoryPage.tsx
// Page catégorie - Affiche les sous-catégories + articles récents

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Target,
  Users,
  Sparkles,
  Brain,
  TrendingUp,
  Newspaper,
  Clock,
  Eye,
  RefreshCw,
  MessageSquare,
  Trophy,
  Globe,
  Laugh
} from "lucide-react";
import { SEO } from "../components/common/SEO";
import { Footer } from "../components/layout/Footer";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import ErrorBoundary from "../components/common/ErrorBoundary";
import SafeImage from "../components/common/SafeImage";
import { getArticlesByCategory } from "../utils/sanityAPI";
import { SanityArticle } from "../types/sanity";
import { mainNavItems } from "../config/navigation";

// Clip-paths octogonaux - Style Octogoal
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';
const octagonClipCard = 'polygon(4% 0%, 96% 0%, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0% 96%, 0% 4%)';

// Configuration des catégories avec leurs sous-catégories
const categoryConfig: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  subcategories: Array<{
    title: string;
    icon: React.ElementType;
    links: Array<{ label: string; path: string; description?: string }>;
  }>;
}> = {
  actus: {
    title: "Actus",
    subtitle: "L'actu foot en direct",
    description: "Toute l'actualité du football : transferts, championnats et contenus exclusifs",
    icon: Zap,
    color: "pink",
    subcategories: [
      {
        title: "Transferts",
        icon: RefreshCw,
        links: [
          { label: "Mercato", path: "/rubrique/actus/mercato", description: "Toutes les infos transferts" },
          { label: "Rumeurs", path: "/rubrique/actus/rumeurs", description: "Les bruits de couloir" },
          { label: "Officialisations", path: "/rubrique/actus/officialisations", description: "Les transferts confirmés" },
        ]
      },
      {
        title: "Championnats",
        icon: Trophy,
        links: [
          { label: "Ligue 1", path: "/rubrique/actus/ligue-1", description: "Actu du championnat français" },
          { label: "Premier League", path: "/rubrique/actus/premier-league", description: "Actu du championnat anglais" },
          { label: "La Liga", path: "/rubrique/actus/liga", description: "Actu du championnat espagnol" },
          { label: "Serie A", path: "/rubrique/actus/serie-a", description: "Actu du championnat italien" },
          { label: "Bundesliga", path: "/rubrique/actus/bundesliga", description: "Actu du championnat allemand" },
        ]
      },
      {
        title: "Contenus",
        icon: Laugh,
        links: [
          { label: "Mèmes", path: "/rubrique/memes", description: "Humour et viral" },
          { label: "Culture foot", path: "/rubrique/formats-octogoal/culture-foot", description: "Histoire et anecdotes" },
          { label: "Moments viraux", path: "/rubrique/formats-octogoal/moments-viraux", description: "Les buzz du moment" },
        ]
      }
    ]
  },
  matchs: {
    title: "Matchs",
    subtitle: "Analyses & Résultats",
    description: "Résultats en direct, analyses tactiques et notes des joueurs",
    icon: Target,
    color: "blue",
    subcategories: []
  },
  clubs: {
    title: "Clubs",
    subtitle: "L'univers des clubs",
    description: "Suivez l'actualité de vos clubs préférés",
    icon: Users,
    color: "purple",
    subcategories: []
  },
  joueurs: {
    title: "Joueurs",
    subtitle: "Stars & Talents",
    description: "Profils et performances des meilleurs joueurs",
    icon: Sparkles,
    color: "emerald",
    subcategories: []
  },
  "formats-octogoal": {
    title: "Formats Octogoal",
    subtitle: "Contenus exclusifs",
    description: "Tops, classements et débats made in Octogoal",
    icon: Brain,
    color: "orange",
    subcategories: []
  },
  memes: {
    title: "Mèmes",
    subtitle: "Humour & Viral",
    description: "Les meilleurs mèmes foot et moments viraux",
    icon: Laugh,
    color: "yellow",
    subcategories: []
  }
};

// Composant SubcategoryCard
const SubcategoryCard = ({
  title,
  icon: Icon,
  links
}: {
  title: string;
  icon: React.ElementType;
  links: Array<{ label: string; path: string; description?: string }>;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 overflow-hidden"
    style={{ clipPath: octagonClipCard }}
  >
    {/* Header */}
    <div className="p-5 border-b border-white/10 bg-gradient-to-r from-pink-500/10 to-blue-500/10">
      <div className="flex items-center gap-3">
        <div
          className="p-3 bg-gradient-to-br from-pink-500 to-blue-500"
          style={{ clipPath: octagonClipSubtle }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
    </div>

    {/* Links */}
    <div className="p-4 space-y-2">
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.path}
          className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-blue-500/20 border border-transparent hover:border-pink-500/30 transition-all duration-300"
        >
          <div>
            <p className="text-white font-medium group-hover:text-pink-400 transition-colors">
              {link.label}
            </p>
            {link.description && (
              <p className="text-gray-500 text-sm">{link.description}</p>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
        </Link>
      ))}
    </div>
  </motion.div>
);

// Composant ArticleCard compact
const ArticleCardCompact = ({ article, index }: { article: SanityArticle; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Link to={`/article/${article.slug?.current}`} className="group flex gap-4">
      {/* Image */}
      <div
        className="flex-shrink-0 w-24 h-24 overflow-hidden"
        style={{ clipPath: octagonClipSubtle }}
      >
        <SafeImage
          source={article.mainImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          fallbackText={article.title}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold line-clamp-2 group-hover:text-pink-400 transition-colors mb-1">
          {article.title}
        </h4>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            5 min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            2.3k
          </span>
        </div>
      </div>
    </Link>
  </motion.article>
);

// Composant ArticleCardFeatured
const ArticleCardFeatured = ({ article }: { article: SanityArticle }) => (
  <motion.article
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-full lg:col-span-2"
  >
    <Link to={`/article/${article.slug?.current}`} className="group block">
      <div
        className="relative aspect-[21/9] overflow-hidden bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-pink-500/30 transition-all"
        style={{ clipPath: octagonClipCard }}
      >
        <SafeImage
          source={article.mainImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          fallbackText={article.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-3 py-1 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-xs font-bold uppercase"
              style={{ clipPath: octagonClipSubtle }}
            >
              À la une
            </span>
            <span className="flex items-center gap-1 text-yellow-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-300 line-clamp-2 max-w-2xl">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Ligne accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </Link>
  </motion.article>
);

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = categoryConfig[categorySlug as keyof typeof categoryConfig] || categoryConfig.actus;
  const Icon = config.icon;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!categorySlug) {
          setError('Catégorie non spécifiée');
          return;
        }

        const sanityArticles = await getArticlesByCategory(categorySlug);

        if (sanityArticles && sanityArticles.length > 0) {
          setArticles(sanityArticles);
        } else {
          // Articles de démo
          setArticles(generateMockArticles());
        }
      } catch (err) {
        setError('Une erreur est survenue.');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [categorySlug]);

  const generateMockArticles = (): SanityArticle[] => {
    const titles = [
      "Mercato : Les 5 dossiers chauds de janvier",
      "PSG : Les dernières infos sur le prochain match",
      "Ligue 1 : Le calendrier infernal qui attend les clubs",
      "Real Madrid : Mbappé en feu cette saison",
      "Premier League : Le choc du weekend",
      "Messi vs Ronaldo : Le débat sans fin"
    ];

    return titles.map((title, i) => ({
      _id: `mock-${i}`,
      title,
      slug: { _type: "slug", current: `article-${i}` },
      mainImage: {
        _type: "image",
        asset: {
          _ref: `https://picsum.photos/800/600?random=${i + 10}`,
          _type: "reference"
        }
      },
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      categories: [{ _id: 'cat1', title: config.title, slug: { current: categorySlug || 'actus' } }],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const hasSubcategories = config.subcategories && config.subcategories.length > 0;

  return (
    <ErrorBoundary>
      <SEO
        title={`${config.title} - ${config.subtitle} | Octogoal Media`}
        description={config.description}
      />

      <div className="min-h-screen bg-black">
        {/* Hero Section compact */}
        <section className="relative overflow-hidden pt-28 pb-12">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 via-black to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6"
            >
              {/* Icon */}
              <div
                className="p-5 bg-gradient-to-br from-pink-500 to-blue-500 shadow-lg shadow-pink-500/30"
                style={{ clipPath: octagonClip }}
              >
                <Icon className="w-10 h-10 text-white" />
              </div>

              {/* Text */}
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-500">
                  {config.title}
                </h1>
                <p className="text-gray-400 text-lg mt-1">{config.description}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {hasSubcategories ? (
            <>
              {/* Sous-catégories */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-pink-500" />
                  Explorer par thème
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {config.subcategories.map((subcat, index) => (
                    <SubcategoryCard
                      key={index}
                      title={subcat.title}
                      icon={subcat.icon}
                      links={subcat.links}
                    />
                  ))}
                </div>
              </div>

              {/* Articles récents */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Newspaper className="w-6 h-6 text-pink-500" />
                    Articles récents
                  </h2>
                  <Link
                    to={`/rubrique/${categorySlug}/tous`}
                    className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    <span>Voir tout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {articles.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Article featured */}
                    <ArticleCardFeatured article={articles[0]} />

                    {/* Liste d'articles */}
                    <div className="space-y-4 lg:col-span-1">
                      {articles.slice(1, 5).map((article, index) => (
                        <ArticleCardCompact key={article._id} article={article} index={index} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Affichage classique pour les catégories sans sous-catégories */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Newspaper className="w-6 h-6 text-pink-500" />
                  Tous les articles
                </h2>
              </div>

              {articles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article, index) => (
                    <motion.article
                      key={article._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/article/${article.slug?.current}`} className="group block h-full">
                        <div
                          className="relative h-full bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-pink-500/30 overflow-hidden transition-all"
                          style={{ clipPath: octagonClipCard }}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <SafeImage
                              source={article.mainImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              fallbackText={article.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                          </div>
                          <div className="p-5">
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                5 min
                              </span>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
