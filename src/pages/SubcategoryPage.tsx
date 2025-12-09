// Créer ce nouveau fichier : src/pages/SubcategoryPage.tsx

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
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { SEO } from "../components/common/SEO";
import { Footer } from "../components/layout/Footer";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import ErrorBoundary from "../components/common/ErrorBoundary";
import SafeImage from "../components/common/SafeImage";
import SubcategoryBadges from "../components/common/SubcategoryBadges";
import { getArticlesBySubcategory, getSubcategoryBySlug, getCategoryBySlug } from "../utils/sanityAPI";
import { SanityArticle } from "../types/sanity";

// Configuration des couleurs par catégorie
const categoryConfig = {
  story: {
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-900/20 to-orange-900/20"
  },
  business: {
    gradient: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-900/20 to-cyan-900/20"
  },
  mental: {
    gradient: "from-purple-400 to-violet-500",
    bgGradient: "from-purple-900/20 to-violet-900/20"
  },
  society: {
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-900/20 to-teal-900/20"
  }
};

export function SubcategoryPage() {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug: string }>();
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<SanityArticle[]>([]);
  const [subcategory, setSubcategory] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const articlesPerPage = 9;

  const config = categoryConfig[categorySlug as keyof typeof categoryConfig] || categoryConfig.story;

  useEffect(() => {
    const fetchSubcategoryAndArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!subcategorySlug || !categorySlug) {
          setError('Sous-catégorie non spécifiée');
          return;
        }

        // Récupérer les informations de la catégorie parente
        const categoryData = await getCategoryBySlug(categorySlug);
        if (categoryData) {
          setCategory(categoryData);
        }

        // Récupérer les informations de la sous-catégorie
        const subcategoryData = await getSubcategoryBySlug(subcategorySlug);
        if (subcategoryData) {
          setSubcategory(subcategoryData);
        }

        // Récupérer les articles de cette sous-catégorie
        const sanityArticles = await getArticlesBySubcategory(subcategorySlug);
        
        if (sanityArticles && sanityArticles.length > 0) {
          setArticles(sanityArticles);
          setDisplayedArticles(sanityArticles.slice(0, articlesPerPage));
        } else {
          setArticles([]);
          setDisplayedArticles([]);
        }
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des articles.');
        console.error('Error fetching articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategoryAndArticles();
  }, [categorySlug, subcategorySlug]);

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
        title={`${subcategory?.title || 'Articles'} - ${category?.title || 'Catégorie'} | Octogoal Media`}
        description={subcategory?.description || 'Découvrez nos articles'}
      />
      
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-16">
          {/* Background avec effets */}
          <div className="absolute inset-0">
            <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_50%)]" />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <Link 
                to={`/rubrique/${categorySlug}`} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                {category?.title || categorySlug}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                {subcategory?.title || subcategorySlug}
              </span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Titre principal */}
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                  {subcategory?.title || 'Articles'}
                </span>
              </h1>

              {/* Description */}
              {subcategory?.description && (
                <p className="text-xl text-gray-300 max-w-3xl mb-8">
                  {subcategory.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-400">{filteredArticles.length} articles</span>
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
            {displayedArticles.length > 0 ? (
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
                            
                            {/* Sous-catégories en overlay */}
                            {article.subcategories && article.subcategories.length > 0 && (
                              <div className="absolute bottom-4 left-4 right-4">
                                <SubcategoryBadges 
                                  subcategories={article.subcategories} 
                                  variant="compact"
                                  maxVisible={2}
                                />
                              </div>
                            )}
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
                                  {article.readingTime || '5 min'}
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
                              {/* Sous-catégories */}
                              {article.subcategories && article.subcategories.length > 0 && (
                                <SubcategoryBadges 
                                  subcategories={article.subcategories} 
                                  variant="compact"
                                  maxVisible={3}
                                  className="mb-2"
                                />
                              )}

                              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${config.gradient} transition-all">
                                {article.title}
                              </h3>
                              
                              {article.excerpt && (
                                <p className="text-gray-400 line-clamp-2 mb-4">
                                  {article.excerpt}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {article.readingTime || '5 min'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    2.3k
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                  <span>Lire l'article</span>
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
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
                <p className="text-gray-400 text-lg mb-8">
                  Aucun article trouvé dans cette sous-catégorie.
                </p>
                <Link
                  to={`/rubrique/${categorySlug}`}
                  className="inline-flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour à {category?.title}</span>
                </Link>
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