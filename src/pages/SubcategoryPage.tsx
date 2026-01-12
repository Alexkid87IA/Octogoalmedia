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
  ArrowLeft,
  Sparkles
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

// Clip-path octogonal Octogoal
const octagonClip = "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)";

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

  useEffect(() => {
    const fetchSubcategoryAndArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!subcategorySlug || !categorySlug) {
          setError('Sous-catégorie non spécifiée');
          return;
        }

        const categoryData = await getCategoryBySlug(categorySlug);
        if (categoryData) {
          setCategory(categoryData);
        }

        const subcategoryData = await getSubcategoryBySlug(subcategorySlug);
        if (subcategoryData) {
          setSubcategory(subcategoryData);
        }

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
        {/* Hero Section avec thème Octogoal */}
        <section className="relative overflow-hidden pt-32 pb-16">
          {/* Background avec gradient rose/bleu */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-blue-900/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />

            {/* Formes octogonales décoratives */}
            <div
              className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-blue-500/10 blur-3xl"
              style={{ clipPath: octagonClip }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-blue-500/10 to-pink-500/10 blur-3xl"
              style={{ clipPath: octagonClip }}
            />
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
                {subcategory?.title || subcategorySlug}
              </span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge décoratif */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-pink-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-white/80">{category?.title || 'Rubrique'}</span>
              </div>

              {/* Titre principal avec gradient Octogoal */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                  {subcategory?.title || 'Articles'}
                </span>
              </h1>

              {/* Description */}
              {subcategory?.description && (
                <p className="text-xl text-gray-300 max-w-3xl mb-8">
                  {subcategory.description}
                </p>
              )}

              {/* Stats avec design octogonal */}
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-white/10"
                  style={{ clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)" }}
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-pulse" />
                  <span className="text-white font-medium">{filteredArticles.length} articles</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-20 z-30 bg-black/90 backdrop-blur-xl border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search avec style Octogoal */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un article..."
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-pink-500/5 to-blue-500/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 focus:bg-white/5 transition-all"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-gradient-to-r from-pink-500/5 to-blue-500/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 appearance-none cursor-pointer"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="trending">Tendances</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white"
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
                      // Card View avec design octogonal
                      <Link to={`/article/${article.slug?.current}`} className="group block">
                        <div
                          className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 overflow-hidden hover:border-pink-500/30 transition-all duration-500"
                          style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
                        >
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-blue-500/0 group-hover:from-pink-500/10 group-hover:to-blue-500/10 transition-all duration-500" />

                          {/* Image */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                            <SafeImage
                              source={article.mainImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              fallbackText={article.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

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
                          <div className="relative p-6">
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 transition-all duration-300">
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
                                  <Clock className="w-3 h-3 text-pink-400" />
                                  {article.readingTime || '5 min'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-blue-400" />
                                  2.3k
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>

                          {/* Corner accent */}
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-br from-pink-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ) : (
                      // List View avec design Octogoal
                      <Link to={`/article/${article.slug?.current}`} className="group block">
                        <div
                          className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 overflow-hidden hover:border-pink-500/30 transition-all duration-500 p-6"
                          style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
                        >
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-blue-500/0 group-hover:from-pink-500/5 group-hover:to-blue-500/5 transition-all duration-500" />

                          <div className="relative flex gap-6">
                            {/* Image */}
                            <div
                              className="flex-shrink-0 w-48 h-32 overflow-hidden bg-gradient-to-br from-gray-900 to-black"
                              style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}
                            >
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

                              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 transition-all duration-300">
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
                                    <Clock className="w-3 h-3 text-pink-400" />
                                    {article.readingTime || '5 min'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-blue-400" />
                                    2.3k
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 font-medium">
                                  <span>Lire l'article</span>
                                  <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Corner accent */}
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-br from-pink-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
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
                <div
                  className="inline-flex flex-col items-center justify-center w-32 h-32 bg-gradient-to-br from-pink-500/10 to-blue-500/10 border border-white/10 mb-6"
                  style={{ clipPath: octagonClip }}
                >
                  <Search className="w-10 h-10 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg mb-8">
                  Aucun article trouvé dans cette sous-catégorie.
                </p>
                <Link
                  to={`/rubrique/${categorySlug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour à {category?.title}</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load More Button avec style Octogoal */}
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
                className="relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden group"
                style={{ clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)" }}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500" />

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Content */}
                <span className="relative text-white font-bold">Charger plus d'articles</span>
                <ChevronDown className="relative w-5 h-5 text-white" />
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
