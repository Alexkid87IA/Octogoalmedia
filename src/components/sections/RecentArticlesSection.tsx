import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, RefreshCw, Flame } from 'lucide-react';
import { sanityClient } from '../../utils/sanityClient';

export const RecentArticlesSection = ({ articles = [] }) => {
  const [recentArticles, setRecentArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('flash');
  
  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        setIsLoading(true);
        const query = `*[_type == "article"] | order(publishedAt desc)[0...10] {
          _id,
          title,
          slug,
          mainImage,
          excerpt,
          publishedAt,
          categories[]->{
            _id,
            title,
            slug
          }
        }`;
        
        const data = await sanityClient.fetch(query);
        
        if (data && data.length > 0) {
          setRecentArticles(data);
        } else {
          const sortedArticles = [...articles].sort((a, b) => {
            const dateA = new Date(a.publishedAt);
            const dateB = new Date(b.publishedAt);
            return dateB.getTime() - dateA.getTime();
          });
          setRecentArticles(sortedArticles.slice(0, 10));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des derniers articles:', error);
        const sortedArticles = [...articles].sort((a, b) => {
          const dateA = new Date(a.publishedAt);
          const dateB = new Date(b.publishedAt);
          return dateB.getTime() - dateA.getTime();
        });
        setRecentArticles(sortedArticles.slice(0, 10));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentArticles();
  }, [articles]);

  // Style unifié OCTOGOAL - Pink gradient pour toutes les catégories
  const unifiedStyle = { bg: 'bg-gradient-to-r from-pink-500 to-blue-500', text: 'text-white' };
  const categoryColors = {
    'Actus': unifiedStyle,
    'Matchs': unifiedStyle,
    'Clubs': unifiedStyle,
    'Joueurs': unifiedStyle,
    'Formats Octogoal': unifiedStyle,
    'Vidéos': unifiedStyle,
    'Carrousels': unifiedStyle,
    'Mèmes': unifiedStyle,
    'Sponsors': unifiedStyle,
    'default': unifiedStyle
  };

  const getCategoryStyle = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  const formatTimeAgo = (date) => {
    const publishDate = new Date(date);
    const day = publishDate.getDate().toString().padStart(2, '0');
    const month = (publishDate.getMonth() + 1).toString().padStart(2, '0');
    const year = publishDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getImageUrl = (article) => {
    const buildSanityImageUrl = (imageRef) => {
      if (!imageRef || !imageRef.asset || !imageRef.asset._ref) return null;
      
      const refParts = imageRef.asset._ref.split('-');
      if (refParts.length < 4) return null;
      
      const id = refParts[1];
      const dimensions = refParts[2];
      const format = refParts[3];
      
      const projectId = '5rn8u6ed';
      const dataset = 'production';
      
      return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=200&h=200&fit=crop`;
    };
    
    if (article.mainImage) {
      const url = buildSanityImageUrl(article.mainImage);
      if (url) return url;
    }
    
    if (article.coverImage) {
      const url = buildSanityImageUrl(article.coverImage);
      if (url) return url;
    }
    
    if (article.mainImage?.url) {
      return article.mainImage.url;
    }
    
    if (article.coverImage?.url) {
      return article.coverImage.url;
    }
    
    return '/images/default-article.jpg';
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-black">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-start sm:items-center gap-3">
            {/* Live Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-blue-500 flex-shrink-0"
              style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)' }}
            >
              <Flame className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white uppercase">Hot</span>
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                Dernières actus
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Mis à jour il y a 2 min
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="hidden sm:block p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all"
            aria-label="Rafraîchir"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>

        {/* Tabs avec glassmorphism */}
        <div className="relative mb-6">
          <div
            className="flex gap-2 p-1.5 bg-white/[0.02] backdrop-blur-sm border border-white/10 overflow-x-auto no-scrollbar"
            style={{ clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)' }}
          >
            <button
              onClick={() => setActiveTab('flash')}
              className={`px-4 py-2 font-medium transition-all whitespace-nowrap text-sm ${
                activeTab === 'flash'
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg shadow-pink-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
              }`}
              style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)' }}
            >
              Flash
            </button>
            <button
              onClick={() => setActiveTab('plus-lus')}
              className={`px-4 py-2 font-medium transition-all whitespace-nowrap text-sm ${
                activeTab === 'plus-lus'
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg shadow-pink-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
              }`}
              style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)' }}
            >
              Les + lus
            </button>
            <button
              onClick={() => setActiveTab('plus-commentes')}
              className={`px-4 py-2 font-medium transition-all whitespace-nowrap text-sm ${
                activeTab === 'plus-commentes'
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg shadow-pink-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
              }`}
              style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)' }}
            >
              Les + commentés
            </button>
          </div>
        </div>

        {/* Articles List avec glassmorphism container */}
        <div
          className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 p-2 sm:p-4"
          style={{ clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)' }}
        >
          {/* Reflet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
          <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500/50 to-blue-500/50" />
          
          <div className="space-y-0">
            {recentArticles.map((article, index) => {
              const categoryStyle = getCategoryStyle(article.categories?.[0]?.title);
              const imageUrl = getImageUrl(article);
              
              return (
                <motion.article
                  key={article._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    group relative
                    ${index !== recentArticles.length - 1 ? 'border-b border-white/5' : ''}
                    hover:bg-white/[0.04] backdrop-blur-sm rounded-xl mx-2 transition-all duration-300
                  `}
                  onClick={() => window.location.href = `/article/${article.slug?.current}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="hidden lg:block absolute left-[29px] top-8 w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full border-2 border-black z-10" />
                  
                  <div className="p-4 lg:pl-16">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-gray-500 min-w-[85px]">
                        {formatTimeAgo(article.publishedAt)}
                      </span>
                      
                      {article.categories?.[0] && (
                        <span
                          className={`
                            px-2.5 py-1 text-[10px] font-bold uppercase
                            ${categoryStyle.bg} ${categoryStyle.text}
                          `}
                          style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)' }}
                        >
                          {article.categories[0].title}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white/[0.05] border border-white/10">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = '/images/default-article.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                            <span className="text-gray-500 text-xs">⚽</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-white font-medium text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-pink-400 transition-colors">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {article.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <a
                        href={`/article/${article.slug?.current}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white text-xs font-semibold transition-all hover:shadow-lg hover:shadow-pink-500/20"
                        style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Lire plus</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              <span>{recentArticles.length} actus chaudes aujourd'hui</span>
            </div>

            <a
              href="/articles"
              className="group inline-flex items-center justify-center sm:justify-start gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 hover:shadow-lg hover:shadow-pink-500/30 text-white font-semibold text-sm transition-all"
              style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)' }}
            >
              <span>Voir toutes les actus</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default RecentArticlesSection;