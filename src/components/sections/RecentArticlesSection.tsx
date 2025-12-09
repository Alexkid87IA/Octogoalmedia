import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, RefreshCw } from 'lucide-react';
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
        // Requête directe pour récupérer les DERNIERS articles publiés
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
          // Fallback sur les articles passés en props s'il n'y a pas de données
          const sortedArticles = [...articles].sort((a, b) => {
            const dateA = new Date(a.publishedAt);
            const dateB = new Date(b.publishedAt);
            return dateB.getTime() - dateA.getTime();
          });
          setRecentArticles(sortedArticles.slice(0, 10));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des derniers articles:', error);
        // En cas d'erreur, utiliser les articles passés en props
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

  const categoryColors = {
    'Story': { bg: 'bg-amber-500', text: 'text-white' },
    'Business': { bg: 'bg-blue-500', text: 'text-white' },
    'Mental': { bg: 'bg-purple-500', text: 'text-white' },
    'Society': { bg: 'bg-emerald-500', text: 'text-white' },
    'Mindset': { bg: 'bg-purple-500', text: 'text-white' },
    'default': { bg: 'bg-gray-500', text: 'text-white' }
  };

  const getCategoryStyle = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  const formatTimeAgo = (date) => {
    const publishDate = new Date(date);
    
    // Toujours afficher au format JJ/MM/AAAA
    const day = publishDate.getDate().toString().padStart(2, '0');
    const month = (publishDate.getMonth() + 1).toString().padStart(2, '0');
    const year = publishDate.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  // Fonction pour obtenir l'URL de l'image depuis Sanity
  const getImageUrl = (article) => {
    // Fonction helper pour construire l'URL Sanity
    const buildSanityImageUrl = (imageRef) => {
      if (!imageRef || !imageRef.asset || !imageRef.asset._ref) return null;
      
      // Extraire les parties de la référence d'image
      // Format typique: image-{id}-{dimensions}-{format}
      const refParts = imageRef.asset._ref.split('-');
      if (refParts.length < 4) return null;
      
      const id = refParts[1];
      const dimensions = refParts[2];
      const format = refParts[3];
      
      // Construire l'URL CDN de Sanity avec votre Project ID
      const projectId = '5rn8u6ed'; // Votre ID de projet Sanity
      const dataset = 'production'; // Ou 'development' selon votre configuration
      
      return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=200&h=200&fit=crop`;
    };
    
    // Vérifier si l'article a une image principale (mainImage)
    if (article.mainImage) {
      const url = buildSanityImageUrl(article.mainImage);
      if (url) return url;
    }
    
    // Si pas d'image principale, vérifier s'il y a une image de couverture (coverImage)
    if (article.coverImage) {
      const url = buildSanityImageUrl(article.coverImage);
      if (url) return url;
    }
    
    // Alternative: si l'image a déjà une URL directe
    if (article.mainImage?.url) {
      return article.mainImage.url;
    }
    
    if (article.coverImage?.url) {
      return article.coverImage.url;
    }
    
    // Si pas d'image, retourner une image par défaut
    return '/images/default-article.jpg'; // Assurez-vous d'avoir cette image dans votre dossier public
  };

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden bg-black">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Mobile First */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Left: Live Badge + Title */}
          <div className="flex items-start sm:items-center gap-3">
            {/* Live Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500 rounded-full flex-shrink-0">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase">Live</span>
            </div>
            
            {/* Title + Subtitle */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Dernières publications
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Mis à jour il y a 2 min
              </p>
            </div>
          </div>

          {/* Refresh Button - Hidden on mobile */}
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="hidden sm:block p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Rafraîchir"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="relative mb-6">
          <div className="flex gap-6 border-b border-gray-800 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('flash')}
              className={`pb-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'flash' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Flash
            </button>
            <button 
              onClick={() => setActiveTab('plus-lus')}
              className={`pb-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'plus-lus' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Les + lus
            </button>
            <button 
              onClick={() => setActiveTab('plus-commentes')}
              className={`pb-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'plus-commentes' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Les + commentés
            </button>
          </div>
        </div>

        {/* Articles List - Mobile Optimized */}
        <div className="relative">
          {/* Timeline - Desktop only */}
          <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-0.5 bg-gray-800" />
          
          <div className="space-y-0">
            {recentArticles.map((article, index) => {
              const categoryStyle = getCategoryStyle(article.categories?.[0]?.title);
              const isFirst = index === 0;
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
                    ${index !== recentArticles.length - 1 ? 'border-b border-gray-900' : ''}
                    hover:bg-white/[0.02] transition-all duration-200
                  `}
                  onClick={() => window.location.href = `/article/${article.slug?.current}`}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Timeline Point - Desktop only */}
                  <div className="hidden lg:block absolute left-[29px] top-8 w-3 h-3 bg-gray-800 rounded-full border-2 border-black z-10" />
                  
                  {/* Mobile Layout: Stack vertically */}
                  <div className="p-4 lg:pl-16">
                    {/* Top Row: Time + Category */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-gray-500 min-w-[85px]">
                        {formatTimeAgo(article.publishedAt)}
                      </span>
                      
                      {article.categories?.[0] && (
                        <span className={`
                          px-2 py-0.5 text-[10px] font-bold uppercase rounded
                          ${categoryStyle.bg} ${categoryStyle.text}
                        `}>
                          {article.categories[0].title}
                        </span>
                      )}
                    </div>

                    {/* Main Content Row */}
                    <div className="flex gap-3">
                      {/* Thumbnail - Utilisation de l'image Sanity */}
                      <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-900">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              // Si l'image ne charge pas, utiliser une image par défaut
                              e.currentTarget.src = '/images/default-article.jpg';
                            }}
                          />
                        ) : (
                          // Placeholder si pas d'image
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-600 text-xs">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Title + Excerpt */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-white font-medium text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            {article.title}
                          </h3>
                          {/* Ajout de l'extrait court */}
                          {article.excerpt && (
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {article.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bouton Lire plus aligné à droite */}
                    <div className="flex justify-end mt-3">
                      <a 
                        href={`/article/${article.slug?.current}`}
                        className="inline-flex items-center gap-1 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-full text-white text-xs font-medium transition-colors"
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

        {/* Footer - Mobile Optimized */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Live Status */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{recentArticles.length} nouveaux articles aujourd'hui</span>
            </div>

            {/* View All Link */}
            <a 
              href="/articles" 
              className="group inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white font-medium text-sm transition-all"
            >
              <span>Voir tous les articles</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style jsx>{`
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