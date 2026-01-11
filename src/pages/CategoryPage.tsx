import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  TrendingUp, 
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
  Users
} from "lucide-react";
import { SEO } from "../components/common/SEO";
import { Footer } from "../components/layout/Footer";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import ErrorBoundary from "../components/common/ErrorBoundary";
import SafeImage from "../components/common/SafeImage";
import { getArticlesByCategory, getCategoryBySlug } from "../utils/sanityAPI";
import { SanityArticle } from "../types/sanity";

// Configuration des catégories Octogoal - Football & Divertissement
const categoryConfig = {
  actus: {
    title: "Actus",
    subtitle: "L'actu foot en direct",
    description: "Toute l'actualité du football : transferts, résultats, analyses et infos exclusives",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-900/20 to-rose-900/20",
    icon: Zap,
    stats: { articles: 324, authors: 12, reads: "45.2k" }
  },
  matchs: {
    title: "Matchs",
    subtitle: "Analyses & Résultats",
    description: "Résultats en direct, analyses tactiques, notes des joueurs et classements",
    gradient: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-900/20 to-cyan-900/20",
    icon: Target,
    stats: { articles: 256, authors: 8, reads: "38.7k" }
  },
  clubs: {
    title: "Clubs",
    subtitle: "L'univers des clubs",
    description: "Suivez l'actualité de vos clubs préférés : Ligue 1, Premier League, Liga et plus",
    gradient: "from-purple-400 to-violet-500",
    bgGradient: "from-purple-900/20 to-violet-900/20",
    icon: Users,
    stats: { articles: 198, authors: 10, reads: "28.3k" }
  },
  joueurs: {
    title: "Joueurs",
    subtitle: "Stars & Talents",
    description: "Profils, performances et parcours des meilleurs joueurs du monde",
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-900/20 to-teal-900/20",
    icon: Sparkles,
    stats: { articles: 175, authors: 9, reads: "32.1k" }
  },
  "formats-octogoal": {
    title: "Formats Octogoal",
    subtitle: "Contenus exclusifs",
    description: "Tops, classements, débats et formats originaux made in Octogoal",
    gradient: "from-orange-400 to-amber-500",
    bgGradient: "from-orange-900/20 to-amber-900/20",
    icon: Brain,
    stats: { articles: 89, authors: 6, reads: "18.5k" }
  },
  memes: {
    title: "Mèmes",
    subtitle: "Humour & Viral",
    description: "Les meilleurs mèmes foot, moments viraux et culture internet du ballon rond",
    gradient: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-900/20 to-orange-900/20",
    icon: Sparkles,
    stats: { articles: 156, authors: 5, reads: "52.8k" }
  }
};

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

        // Récupérer les informations de la catégorie
        const categoryData = await getCategoryBySlug(categorySlug);
        if (categoryData) {
          setCategory(categoryData);
        }

        // Récupérer les articles de cette catégorie depuis Sanity
        const sanityArticles = await getArticlesByCategory(categorySlug);
        
        if (sanityArticles && sanityArticles.length > 0) {
          setArticles(sanityArticles);
          setDisplayedArticles(sanityArticles.slice(0, articlesPerPage));
        } else {
          // Articles de démonstration si pas de données
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

  // Fonction pour générer des articles de démonstration - Football
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
    const startIndex = 0;
    const endIndex = nextPage * articlesPerPage;
    setDisplayedArticles(filteredArticles.slice(startIndex, endIndex));
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
        {/* Hero Section avec gradient dynamique */}
        <section className="relative overflow-hidden pt-32 pb-20">
          {/* Background avec effets */}
          <div className="absolute inset-0">
            <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_50%)]" />
            <div className="absolute inset-0 backdrop-blur-sm" />
            
            {/* Animated particles */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-64 h-64 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-20`}
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                  }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${20 * i}%`,
                    top: `${20 * i}%`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Badge animé */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                  {config.subtitle}
                </span>
              </motion.div>

              {/* Titre principal */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                  {config.title}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                {config.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-400">{config.stats.articles} articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-gray-400">{config.stats.authors} auteurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-gray-400">{config.stats.reads} lectures</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-20 z-30 bg-black/80 backdrop-blur-xl border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un article..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20 appearance-none cursor-pointer"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="trending">Tendances</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid" 
                      ? "bg-white/10 text-white" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list" 
                      ? "bg-white/10 text-white" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid/List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <AnimatePresence mode="wait">
            {filteredArticles.length > 0 ? (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                  : "space-y-6"
                }
              >
                {displayedArticles.map((article, index) => (
                  <motion.article
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={viewMode === "grid" ? "" : ""}
                  >
                    {viewMode === "grid" ? (
                      // Card View
                      <Link to={`/article/${article.slug?.current}`} className="group block">
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                          {/* Image */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                            <SafeImage
                              source={article.mainImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              fallbackText={article.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            
                            {/* Category badge */}
                            <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${config.gradient} rounded-full`}>
                                {config.title}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${config.gradient} transition-all">
                              {article.title}
                            </h3>
                            
                            {article.excerpt && (
                              <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                {article.excerpt}
                              </p>
                            )}

                            {/* Meta */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  5 min
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  2.3k
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      // List View
                      <Link to={`/article/${article.slug?.current}`} className="group block">
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 p-6">
                          <div className="flex gap-6">
                            {/* Image */}
                            <div className="flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                              <SafeImage
                                source={article.mainImage}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                fallbackText={article.title}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${config.gradient} rounded-full`}>
                                  {config.title}
                                </span>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
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

                              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${config.gradient} transition-all">
                                {article.title}
                              </h3>
                              
                              {article.excerpt && (
                                <p className="text-gray-400 line-clamp-2 mb-4">
                                  {article.excerpt}
                                </p>
                              )}

                              <div className="flex items-center gap-2 text-white">
                                <span>Lire l'article</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-gray-400 text-lg">
                  Aucun article trouvé pour votre recherche.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load More Button */}
          {displayedArticles.length < filteredArticles.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMoreArticles}
                className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${config.gradient} text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all`}
              >
                <span>Charger plus d'articles</span>
                <ChevronDown className="w-5 h-5" />
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