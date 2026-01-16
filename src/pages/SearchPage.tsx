// src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';
import { getAllArticles } from '../utils/sanityAPI';
import { urlFor } from '../utils/sanityClient';

interface SearchResult {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt?: string;
  categories?: { title: string; slug: { current: string } }[];
}

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [allArticles, setAllArticles] = useState<SearchResult[]>([]);

  // Charger tous les articles au montage
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const articles = await getAllArticles();
        setAllArticles(articles || []);
      } catch (error) {
        // Erreur silencieuse
      }
    };
    loadArticles();
  }, []);

  // Rechercher quand la query change
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, allArticles]);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    const normalizedQuery = searchQuery.toLowerCase().trim();

    const filtered = allArticles.filter(article => {
      const titleMatch = article.title?.toLowerCase().includes(normalizedQuery);
      const excerptMatch = article.excerpt?.toLowerCase().includes(normalizedQuery);
      const categoryMatch = article.categories?.some(
        cat => cat.title?.toLowerCase().includes(normalizedQuery)
      );
      return titleMatch || excerptMatch || categoryMatch;
    });

    setResults(filtered);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

  const getImageUrl = (article: SearchResult) => {
    if (!article.mainImage?.asset) return null;
    try {
      return urlFor(article.mainImage).width(400).height(250).url();
    } catch {
      return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <SEO
        title={query ? `Recherche: ${query}` : 'Recherche'}
        description="Recherchez parmi tous les articles d'Octogoal"
      />

      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Recherche</h1>
            <p className="text-gray-400">Trouvez des articles sur le football</p>
          </div>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="mb-10">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article, un joueur, un club..."
                className="w-full px-6 py-4 pl-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all text-lg"
                autoFocus
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={22} />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
              >
                Rechercher
              </button>
            </div>
          </form>

          {/* Résultats */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : hasSearched ? (
            <>
              {/* Nombre de résultats */}
              <div className="mb-6 text-gray-400">
                {results.length === 0 ? (
                  <p>Aucun résultat pour "<span className="text-white">{initialQuery}</span>"</p>
                ) : (
                  <p>{results.length} résultat{results.length > 1 ? 's' : ''} pour "<span className="text-white">{initialQuery}</span>"</p>
                )}
              </div>

              {/* Liste des résultats */}
              <div className="space-y-4">
                {results.map((article, index) => {
                  const imageUrl = getImageUrl(article);
                  return (
                    <motion.article
                      key={article._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/article/${article.slug.current}`}
                        className="group flex gap-4 p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-pink-500/30 rounded-xl transition-all"
                      >
                        {/* Image */}
                        {imageUrl && (
                          <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                            <img
                              src={imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          {/* Catégorie */}
                          {article.categories?.[0] && (
                            <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase bg-pink-500/20 text-pink-400 rounded">
                              {article.categories[0].title}
                            </span>
                          )}

                          {/* Titre */}
                          <h2 className="text-base sm:text-lg font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-2 mb-1">
                            {article.title}
                          </h2>

                          {/* Excerpt */}
                          {article.excerpt && (
                            <p className="text-sm text-gray-400 line-clamp-2 hidden sm:block">
                              {article.excerpt}
                            </p>
                          )}

                          {/* Date */}
                          {article.publishedAt && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                              <Clock size={12} />
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          )}
                        </div>

                        {/* Flèche */}
                        <ArrowRight className="hidden sm:block w-5 h-5 text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                      </Link>
                    </motion.article>
                  );
                })}
              </div>

              {/* Pas de résultats */}
              {results.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                    <Search size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
                  <p className="text-gray-400 mb-6">Essayez avec d'autres mots-clés</p>
                  <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Voir tous les articles
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </>
          ) : (
            /* État initial - suggestions */
            <div className="text-center py-10">
              <p className="text-gray-400 mb-8">Recherchez un article, un joueur, un club...</p>

              {/* Suggestions populaires */}
              <div className="flex flex-wrap justify-center gap-2">
                {['Mbappé', 'PSG', 'Real Madrid', 'Ligue 1', 'Champions League', 'Mercato'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      setSearchParams({ q: suggestion });
                      performSearch(suggestion);
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchPage;
