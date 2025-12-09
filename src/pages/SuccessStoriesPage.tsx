import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Trophy, 
  ArrowRight,
  Star,
  Award,
  Loader2,
  X,
  Hash
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';
import { sanityClient } from '../utils/sanityClient';

export const SuccessStoriesPage = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Faire défiler vers le haut lors du chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Récupérer les articles depuis Sanity
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const query = `*[_type == "article" && (
          contentType == "success-story" || 
          category->slug.current == "success" ||
          category->slug.current == "story" ||
          "success" in tags[] ||
          "story" in tags[] ||
          "parcours" in tags[] ||
          "entrepreneur" in tags[]
        )] | order(publishedAt desc) {
          _id,
          title,
          excerpt,
          "slug": slug.current,
          "mainImage": mainImage.asset->url,
          publishedAt,
          "category": category->title,
          tags,
          "author": author->{
            name,
            "image": image.asset->url
          }
        }`;
        
        const result = await sanityClient.fetch(query);
        setArticles(result || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Extraire tous les tags uniques des articles
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    articles.forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag: string) => {
          if (tag) tagsSet.add(tag.toLowerCase());
        });
      }
    });
    return Array.from(tagsSet).sort();
  }, [articles]);

  // Fonction pour gérer la sélection/désélection des tags
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Fonction pour effacer tous les filtres
  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
  };

  // Filtrer les articles
  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = 
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Si aucun tag n'est sélectionné, afficher tous les articles
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(selectedTag => 
          article.tags?.some((tag: string) => tag.toLowerCase() === selectedTag)
        );
      
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return 0;
    });

  // Compter le nombre d'articles par tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTags.forEach(tag => {
      counts[tag] = articles.filter(article =>
        article.tags?.some((t: string) => t.toLowerCase() === tag)
      ).length;
    });
    return counts;
  }, [allTags, articles]);

  return (
    <>
      <SEO
        title="Success Stories | Octogoal Media"
        description="Découvrez des parcours inspirants d'entrepreneurs et d'innovateurs qui ont transformé leur vision en réalité."
      />
      
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.3),transparent_50%)]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 backdrop-blur-sm rounded-full mb-6 border border-purple-500/20"
              >
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">
                  Parcours inspirants
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                  Success Stories
                </span>
              </h1>

              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Des histoires authentiques d'entrepreneurs et d'innovateurs 
                qui ont osé transformer leur vision en réalité.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Controls */}
        <section className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-4">
              {/* Search and Sort Row */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une success story..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                </select>
              </div>

              {/* Tags Cloud */}
              {allTags.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Filtrer par mots-clés ({selectedTags.length} sélectionné{selectedTags.length > 1 ? 's' : ''})
                      </span>
                    </div>
                    {selectedTags.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Effacer les filtres
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      const count = tagCounts[tag] || 0;
                      
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all
                            ${isSelected
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                            }
                          `}
                        >
                          <span className="capitalize">{tag}</span>
                          <span className={`text-xs ${isSelected ? 'text-purple-400/70' : 'text-gray-500'}`}>
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : filteredArticles.length > 0 ? (
            <>
              <div className="mb-6 text-sm text-gray-400">
                {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, index) => (
                  <motion.article
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <a 
                      href={`/article/${article.slug}`}
                      className="block h-full"
                    >
                      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 h-full flex flex-col">
                        {/* Image */}
                        {article.mainImage && (
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                              src={article.mainImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            
                            {/* Badge Success Story */}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-xs font-medium text-purple-400">
                                Success Story
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                            {article.title}
                          </h3>
                          
                          {article.excerpt && (
                            <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                              {article.excerpt}
                            </p>
                          )}

                          {/* Author & Date */}
                          <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                            {article.author && (
                              <div className="flex items-center gap-2">
                                {article.author.image && (
                                  <img 
                                    src={article.author.image} 
                                    alt={article.author.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                )}
                                <span>{article.author.name}</span>
                              </div>
                            )}
                            {article.publishedAt && (
                              <span>
                                {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {article.tags.slice(0, 3).map((tag: string) => (
                                <span 
                                  key={tag} 
                                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                                    selectedTags.includes(tag.toLowerCase())
                                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                      : 'bg-white/5 text-gray-400'
                                  }`}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action */}
                          <div className="mt-4">
                            <span className="inline-flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:gap-3 transition-all">
                              Découvrir le parcours
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.article>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {selectedTags.length > 0 || searchTerm 
                  ? 'Aucune success story ne correspond à vos critères'
                  : 'Aucune success story trouvée'
                }
              </p>
              {(selectedTags.length > 0 || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </>
  );
};

export default SuccessStoriesPage;