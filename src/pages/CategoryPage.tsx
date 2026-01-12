// src/pages/CategoryPage.tsx
// Page catégorie - Design Octogoal Premium avec style octogonal

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  Eye,
  ArrowRight,
  ChevronDown,
  Grid3X3,
  List,
  Sparkles,
  Zap,
  Target,
  Brain,
  Users,
  Newspaper,
  TrendingUp
} from "lucide-react";
import { SEO } from "../components/common/SEO";
import { Footer } from "../components/layout/Footer";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import ErrorBoundary from "../components/common/ErrorBoundary";
import SafeImage from "../components/common/SafeImage";
import { getArticlesByCategory, getCategoryBySlug } from "../utils/sanityAPI";
import { SanityArticle } from "../types/sanity";

// Clip-paths octogonaux - Style Octogoal
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';
const octagonClipCard = 'polygon(4% 0%, 96% 0%, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0% 96%, 0% 4%)';
const octagonClipSmall = 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)';

// Configuration des catégories Octogoal
const categoryConfig = {
  actus: {
    title: "Actus",
    subtitle: "L'actu foot en direct",
    description: "Toute l'actualité du football : transferts, résultats, analyses et infos exclusives",
    icon: Zap,
    stats: { articles: 324, authors: 12, reads: "45.2k" }
  },
  matchs: {
    title: "Matchs",
    subtitle: "Analyses & Résultats",
    description: "Résultats en direct, analyses tactiques, notes des joueurs et classements",
    icon: Target,
    stats: { articles: 256, authors: 8, reads: "38.7k" }
  },
  clubs: {
    title: "Clubs",
    subtitle: "L'univers des clubs",
    description: "Suivez l'actualité de vos clubs préférés : Ligue 1, Premier League, Liga et plus",
    icon: Users,
    stats: { articles: 198, authors: 10, reads: "28.3k" }
  },
  joueurs: {
    title: "Joueurs",
    subtitle: "Stars & Talents",
    description: "Profils, performances et parcours des meilleurs joueurs du monde",
    icon: Sparkles,
    stats: { articles: 175, authors: 9, reads: "32.1k" }
  },
  "formats-octogoal": {
    title: "Formats Octogoal",
    subtitle: "Contenus exclusifs",
    description: "Tops, classements, débats et formats originaux made in Octogoal",
    icon: Brain,
    stats: { articles: 89, authors: 6, reads: "18.5k" }
  },
  memes: {
    title: "Mèmes",
    subtitle: "Humour & Viral",
    description: "Les meilleurs mèmes foot, moments viraux et culture internet du ballon rond",
    icon: Sparkles,
    stats: { articles: 156, authors: 5, reads: "52.8k" }
  }
};

// Composant StatBadge octogonal
const StatBadge = ({ icon: Icon, value, label }: { icon: any; value: string | number; label: string }) => (
  <div
    className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 flex items-center gap-3"
    style={{ clipPath: octagonClipSmall }}
  >
    <div className="p-2 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg">
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div>
      <p className="text-white font-bold text-lg">{value}</p>
      <p className="text-gray-500 text-xs">{label}</p>
    </div>
  </div>
);

// Composant ArticleCard octogonal
const ArticleCard = ({ article, index, categoryTitle }: { article: SanityArticle; index: number; categoryTitle: string }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Link to={`/article/${article.slug?.current}`} className="group block h-full">
      <div
        className="relative h-full bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
        style={{ clipPath: octagonClipCard }}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <SafeImage
            source={article.mainImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            fallbackText={article.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Category badge octogonal */}
          <div className="absolute top-4 left-4">
            <div
              className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-xs font-bold uppercase tracking-wider"
              style={{ clipPath: octagonClipSubtle }}
            >
              {categoryTitle}
            </div>
          </div>

          {/* Trending indicator */}
          {index < 3 && (
            <div className="absolute top-4 right-4">
              <div className="p-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-500/30">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 transition-all">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">
              {article.excerpt}
            </p>
          )}

          {/* Meta footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
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
            <div className="flex items-center gap-1 text-pink-400 text-xs font-medium group-hover:text-pink-300">
              <span>Lire</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Ligne accent au hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </Link>
  </motion.article>
);

// Composant ArticleListItem octogonal
const ArticleListItem = ({ article, index, categoryTitle }: { article: SanityArticle; index: number; categoryTitle: string }) => (
  <motion.article
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Link to={`/article/${article.slug?.current}`} className="group block">
      <div
        className="relative bg-gradient-to-r from-white/[0.05] to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-pink-500/30 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
        style={{ clipPath: octagonClipCard }}
      >
        <div className="flex gap-5">
          {/* Image */}
          <div
            className="flex-shrink-0 w-40 h-28 overflow-hidden"
            style={{ clipPath: octagonClipSubtle }}
          >
            <SafeImage
              source={article.mainImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              fallbackText={article.title}
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-2 py-1 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-[10px] font-bold uppercase tracking-wider"
                  style={{ clipPath: octagonClipSubtle }}
                >
                  {categoryTitle}
                </span>
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

              <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 transition-all">
                {article.title}
              </h3>

              {article.excerpt && (
                <p className="text-gray-400 text-sm line-clamp-1">
                  {article.excerpt}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-pink-400 text-sm font-medium group-hover:text-pink-300">
              <span>Lire l'article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Ligne accent verticale */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
      </div>
    </Link>
  </motion.article>
);

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<SanityArticle[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const articlesPerPage = 9;

  const config = categoryConfig[categorySlug as keyof typeof categoryConfig] || categoryConfig.actus;
  const Icon = config.icon;

  useEffect(() => {
    const fetchCategoryAndArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!categorySlug) {
          setError('Catégorie non spécifiée');
          return;
        }

        const categoryData = await getCategoryBySlug(categorySlug);
        if (categoryData) {
          setCategory(categoryData);
        }

        const sanityArticles = await getArticlesByCategory(categorySlug);

        if (sanityArticles && sanityArticles.length > 0) {
          setArticles(sanityArticles);
          setDisplayedArticles(sanityArticles.slice(0, articlesPerPage));
        } else {
          setArticles(generateMockArticles(categorySlug));
          setDisplayedArticles(generateMockArticles(categorySlug).slice(0, articlesPerPage));
        }
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des articles.');
        console.error('Error fetching articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndArticles();
  }, [categorySlug]);

  const generateMockArticles = (category: string): SanityArticle[] => {
    const mockTitles = {
      actus: [
        "Mercato : Les 5 dossiers chauds de janvier",
        "PSG : Mbappé bientôt prolongé ? Les dernières infos",
        "Ligue 1 : Le calendrier infernal qui attend les clubs français"
      ],
      matchs: [
        "PSG 3-1 OM : Les notes du Classico",
        "Real Madrid vs Barcelone : Analyse tactique du Clasico",
        "Liverpool s'impose dans le derby : Résumé et stats"
      ],
      clubs: [
        "PSG : Les coulisses du projet QSI révélées",
        "Manchester City : Comment Guardiola a révolutionné le club",
        "Real Madrid : Les secrets de la Maison Blanche"
      ],
      joueurs: [
        "Mbappé : Portrait du prodige français",
        "Haaland : La machine à buts norvégienne décryptée",
        "Bellingham : La nouvelle pépite du Real Madrid"
      ],
      "formats-octogoal": [
        "Top 10 : Les plus beaux buts de la saison",
        "Débat : Qui est le GOAT ? Messi vs Ronaldo",
        "Classement : Les 50 meilleurs joueurs de 2024"
      ],
      memes: [
        "Les réactions Twitter après le Classico",
        "Quand Mbappé découvre son transfert sur TikTok",
        "Les meilleures tête de Momo de la semaine"
      ]
    };

    return (mockTitles[category as keyof typeof mockTitles] || mockTitles.actus).map((title, i) => ({
      _id: `mock-${i}`,
      title,
      slug: { _type: "slug", current: `article-${i}` },
      mainImage: {
        _type: "image",
        asset: {
          _ref: `https://picsum.photos/800/600?random=${i}`,
          _type: "reference"
        }
      },
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      categories: [{
        _id: 'cat1',
        title: config.title,
        slug: { current: category }
      }],
      author: {
        _id: 'author1',
        name: `Auteur ${i + 1}`,
        slug: { current: `author-${i}` }
      }
    }));
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const loadMoreArticles = () => {
    const nextPage = page + 1;
    const endIndex = nextPage * articlesPerPage;
    setDisplayedArticles(filteredArticles.slice(0, endIndex));
    setPage(nextPage);
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

  return (
    <ErrorBoundary>
      <SEO
        title={`${config.title} - ${config.subtitle} | Octogoal Media`}
        description={config.description}
      />

      <div className="min-h-screen bg-black">
        {/* Hero Section - Style Octogoal */}
        <section className="relative overflow-hidden pt-28 pb-16">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 via-black to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />

            {/* Grille de fond */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}
            />

            {/* Floating elements */}
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-blue-500/20 blur-3xl"
              animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-pink-500/20 blur-3xl"
              animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Badge icône octogonal */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div
                  className="p-4 bg-gradient-to-br from-pink-500 to-blue-500 shadow-lg shadow-pink-500/30"
                  style={{ clipPath: octagonClip }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Titre principal */}
              <h1 className="text-5xl md:text-7xl font-black mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-blue-500">
                  {config.title}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-400 font-medium mb-4">
                {config.subtitle}
              </p>

              {/* Description */}
              <p className="text-gray-500 max-w-2xl mx-auto mb-8">
                {config.description}
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <StatBadge icon={Newspaper} value={config.stats.articles} label="Articles" />
                <StatBadge icon={Users} value={config.stats.authors} label="Auteurs" />
                <StatBadge icon={Eye} value={config.stats.reads} label="Lectures" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section - Style Octogoal */}
        <section className="sticky top-20 z-30 bg-black/90 backdrop-blur-xl border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search octogonal */}
              <div className="relative flex-1 w-full">
                <div
                  className="relative bg-white/5 border border-white/10 overflow-hidden"
                  style={{ clipPath: octagonClipCard }}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un article..."
                    className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sort dropdown */}
              <div
                className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3"
                style={{ clipPath: octagonClipCard }}
              >
                <Filter className="w-4 h-4 text-pink-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer text-sm"
                >
                  <option value="recent" className="bg-gray-900">Plus récents</option>
                  <option value="popular" className="bg-gray-900">Plus populaires</option>
                  <option value="trending" className="bg-gray-900">Tendances</option>
                </select>
              </div>

              {/* View Mode toggle */}
              <div
                className="flex items-center gap-1 bg-white/5 border border-white/10 p-1"
                style={{ clipPath: octagonClipCard }}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-all ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  style={{ clipPath: octagonClipSubtle }}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-all ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  style={{ clipPath: octagonClipSubtle }}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid/List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode="wait">
            {filteredArticles.length > 0 ? (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                }
              >
                {displayedArticles.map((article, index) => (
                  viewMode === "grid" ? (
                    <ArticleCard
                      key={article._id}
                      article={article}
                      index={index}
                      categoryTitle={config.title}
                    />
                  ) : (
                    <ArticleListItem
                      key={article._id}
                      article={article}
                      index={index}
                      categoryTitle={config.title}
                    />
                  )
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div
                  className="inline-block p-6 bg-white/5 border border-white/10 mb-4"
                  style={{ clipPath: octagonClip }}
                >
                  <Search className="w-12 h-12 text-gray-600" />
                </div>
                <p className="text-gray-400 text-lg">
                  Aucun article trouvé pour votre recherche.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load More Button - Style Octogoal */}
          {displayedArticles.length < filteredArticles.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadMoreArticles}
                className="relative group"
              >
                <div
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all flex items-center gap-3"
                  style={{ clipPath: octagonClipCard }}
                >
                  <span>Charger plus d'articles</span>
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </div>
              </motion.button>
            </motion.div>
          )}
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
