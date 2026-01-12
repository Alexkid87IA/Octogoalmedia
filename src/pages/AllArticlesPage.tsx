// src/pages/AllArticlesPage.tsx
// Page Articles - Design moderne Octogoal
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Clock, Bookmark, BookmarkCheck, Grid3X3, LayoutList,
  X, ArrowRight, FileText, Flame, Filter, ChevronDown, Calendar
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ArticleGridSkeleton } from '../components/common/Skeleton';
import { Footer } from '../components/layout/Footer';
import SafeImage from '../components/common/SafeImage';
import { getAllArticles } from '../utils/sanityAPI';
import { SanityArticle } from '../types/sanity';

// Clip-path octogonal
const octagonClip = 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)';

// Catégories avec couleurs
const categories = [
  { id: 'all', label: 'Tout', color: 'from-pink-500 to-rose-600' },
  { id: 'actus', label: 'Actus', color: 'from-orange-500 to-red-500' },
  { id: 'joueurs', label: 'Joueurs', color: 'from-green-500 to-emerald-600' },
  { id: 'formats-octogoal', label: 'Formats', color: 'from-purple-500 to-pink-500' },
  { id: 'memes', label: 'Mèmes', color: 'from-yellow-500 to-orange-500' },
];

export const AllArticlesPage = () => {
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);

  // Charger les articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const sanityArticles = await getAllArticles();
        if (sanityArticles && sanityArticles.length > 0) {
          setArticles(sanityArticles);
        }
      } catch (err) {
        console.error('Erreur chargement articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();

    // Charger les favoris (avec try/catch pour mode incognito/SSR)
    try {
      const saved = localStorage.getItem('bookmarkedArticles');
      if (saved) setBookmarkedArticles(JSON.parse(saved));
    } catch {
      // localStorage indisponible (mode incognito, SSR, etc.)
    }
  }, []);

  // Sauvegarder les favoris (avec try/catch pour mode incognito/SSR)
  useEffect(() => {
    try {
      localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
    } catch {
      // localStorage indisponible
    }
  }, [bookmarkedArticles]);

  const toggleBookmark = (slug: string) => {
    setBookmarkedArticles(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Filtrage et tri
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article =>
        article.categories?.some(cat =>
          cat.slug?.current?.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    // Filtre par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(search) ||
        article.excerpt?.toLowerCase().includes(search)
      );
    }

    // Tri
    return filtered.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [articles, selectedCategory, searchTerm, sortBy]);

  // Formater la date
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;

    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Stats
  const stats = {
    total: articles.length,
    thisWeek: articles.filter(a =>
      new Date(a.publishedAt) > new Date(Date.now() - 7 * 86400000)
    ).length
  };

  return (
    <>
      <SEO
        title="Tous les articles | Octogoal"
        description="Toute l'actu foot : actus, joueurs, formats originaux, mèmes. Le meilleur du football."
      />

      <div className="min-h-screen bg-black">
        {/* Hero Section - Compact et moderne */}
        <section className="relative pt-28 pb-8 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-pink-950/30 via-black to-black" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                  Tous les <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">articles</span>
                </h1>
                <p className="text-gray-400 text-lg">
                  {stats.total} articles • {stats.thisWeek} cette semaine
                </p>
              </div>

              {/* Barre de recherche */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtres par catégorie */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    flex-shrink-0 px-5 py-2.5 rounded-xl font-medium text-sm transition-all
                    ${selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}

              {/* Séparateur */}
              <div className="w-px h-8 bg-white/10 mx-2" />

              {/* Toggle vue */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {isLoading ? (
            <ArticleGridSkeleton count={9} />
          ) : filteredArticles.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredArticles.map((article, index) => {
                const isBookmarked = bookmarkedArticles.includes(article.slug?.current || '');
                const categoryColor = categories.find(c =>
                  article.categories?.some(ac => ac.slug?.current === c.id)
                )?.color || 'from-pink-500 to-rose-600';

                return viewMode === 'grid' ? (
                  // Vue Grille
                  <motion.article
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.3) }}
                    className="group"
                  >
                    <div className="relative bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all duration-300">
                      {/* Image */}
                      <Link to={`/article/${article.slug?.current}`}>
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <SafeImage
                            source={article.mainImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            fallbackText={article.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />

                          {/* Badge catégorie */}
                          {article.categories?.[0] && (
                            <div className="absolute top-4 left-4">
                              <span
                                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${categoryColor} rounded-lg`}
                              >
                                {article.categories[0].title}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Bookmark */}
                      <button
                        onClick={() => toggleBookmark(article.slug?.current || '')}
                        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-pink-400" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-white/70" />
                        )}
                      </button>

                      {/* Contenu */}
                      <Link to={`/article/${article.slug?.current}`} className="block p-5">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                          {article.title}
                        </h3>

                        {article.excerpt && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(article.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readingTime || '5'} min
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>

                      {/* Ligne d'accent en bas */}
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${categoryColor} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                    </div>
                  </motion.article>
                ) : (
                  // Vue Liste
                  <motion.article
                    key={article._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.2) }}
                    className="group"
                  >
                    <Link
                      to={`/article/${article.slug?.current}`}
                      className="flex gap-4 p-4 bg-gray-900/50 border border-white/10 rounded-xl hover:border-pink-500/30 transition-all"
                    >
                      {/* Image */}
                      <div
                        className="flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden"
                        style={{ clipPath: octagonClip }}
                      >
                        <SafeImage
                          source={article.mainImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          fallbackText={article.title}
                        />
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Badge catégorie */}
                          {article.categories?.[0] && (
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase text-white bg-gradient-to-r ${categoryColor} rounded mb-2`}>
                              {article.categories[0].title}
                            </span>
                          )}

                          <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-pink-400 transition-colors">
                            {article.title}
                          </h3>

                          {article.excerpt && (
                            <p className="text-gray-400 text-sm line-clamp-1 mt-1">
                              {article.excerpt}
                            </p>
                          )}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{formatDate(article.publishedAt)}</span>
                            <span>•</span>
                            <span>{article.readingTime || '5'} min</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Bookmark */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleBookmark(article.slug?.current || '');
                        }}
                        className="flex-shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-5 h-5 text-pink-400" />
                        ) : (
                          <Bookmark className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            // État vide
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-6">
                <FileText className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Aucun article trouvé</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm
                  ? `Aucun résultat pour "${searchTerm}"`
                  : 'Aucun article dans cette catégorie'
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </section>

        <Footer />
      </div>

      {/* Style pour cacher la scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default AllArticlesPage;
