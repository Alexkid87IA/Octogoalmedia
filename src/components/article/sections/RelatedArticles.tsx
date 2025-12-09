// src/components/article/sections/RelatedArticles.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SanityArticle, VerticalColors } from "../../../types/article.types";
import { getVerticalColors } from "../../../utils/articleUtils";

interface RelatedArticlesProps {
  articles: SanityArticle[];
  colors: VerticalColors;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, colors }) => {
  if (articles.length === 0) return null;

  // Fonction pour obtenir l'URL de l'image depuis Sanity
  const getImageUrl = (mainImage: any) => {
    // D'abord vérifier si on a directement l'URL
    if (mainImage?.asset?.url) {
      return mainImage.asset.url;
    }
    
    // Sinon, construire l'URL depuis la référence _ref
    if (mainImage?.asset?._ref) {
      const ref = mainImage.asset._ref;
      const cleanRef = ref
        .replace('image-', '')
        .replace('-jpg', '.jpg')
        .replace('-jpeg', '.jpeg')
        .replace('-png', '.png')
        .replace('-webp', '.webp');
      
      return `https://cdn.sanity.io/images/5rn8u6ed/production/${cleanRef}?w=400&h=250&fit=crop&auto=format`;
    }
    
    return null;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Continuez votre lecture
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez d'autres articles qui pourraient vous intéresser
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((related, index) => {
            // Déterminer les couleurs pour chaque article selon SA catégorie
            const getCardColors = () => {
              const cardCategory = related.categories?.[0]?.slug?.current?.toLowerCase();
              
              switch(cardCategory) {
                case 'story':
                case 'recits':
                  return {
                    gradient: 'from-amber-500 to-orange-500',
                    primary: '#f59e0b',
                    textColor: '#fbbf24',
                    borderColor: 'rgba(245, 158, 11, 0.3)'
                  };
                case 'business':
                  return {
                    gradient: 'from-blue-500 to-cyan-500',
                    primary: '#3b82f6',
                    textColor: '#60a5fa',
                    borderColor: 'rgba(59, 130, 246, 0.3)'
                  };
                case 'mental':
                case 'psycho':
                  return {
                    gradient: 'from-purple-500 to-violet-500',
                    primary: '#a855f7',
                    textColor: '#c084fc',
                    borderColor: 'rgba(168, 85, 247, 0.3)'
                  };
                case 'society':
                  return {
                    gradient: 'from-emerald-500 to-teal-500',
                    primary: '#10b981',
                    textColor: '#34d399',
                    borderColor: 'rgba(16, 185, 129, 0.3)'
                  };
                default:
                  return {
                    gradient: 'from-gray-500 to-gray-600',
                    primary: '#6b7280',
                    textColor: '#9ca3af',
                    borderColor: 'rgba(107, 114, 128, 0.3)'
                  };
              }
            };
            
            const cardColors = getCardColors();
            const imageUrl = getImageUrl(related.mainImage);
            
            return (
              <motion.article 
                key={related._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/article/${related.slug.current}`}>
                  <div 
                    className="relative overflow-hidden rounded-xl bg-white/5 border transition-all hover:transform hover:scale-105"
                    style={{
                      borderColor: cardColors.borderColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = cardColors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = cardColors.borderColor;
                    }}
                  >
                    {/* Section Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-900">
                      {imageUrl ? (
                        <>
                          <img 
                            src={imageUrl}
                            alt={related.title || 'Article image'}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              // Si erreur, masquer l'image et afficher un fond coloré
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </>
                      ) : (
                        // Fallback gradient si pas d'image
                        <div className={`w-full h-full bg-gradient-to-br ${cardColors.gradient} opacity-50`}>
                          <div className="absolute inset-0 bg-black/40" />
                        </div>
                      )}
                      
                      {/* Badge de catégorie avec gradient */}
                      {related.categories && related.categories[0] && (
                        <div className="absolute top-4 left-4 z-10">
                          <span 
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${cardColors.gradient} shadow-lg`}
                          >
                            {related.categories[0].title}
                          </span>
                        </div>
                      )}
                      
                      {/* Temps de lecture si disponible */}
                      {related.readingTime && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white bg-black/60 backdrop-blur">
                            {related.readingTime} min
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Section Contenu */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-opacity-90 transition-colors">
                        {related.title}
                      </h3>
                      
                      {related.excerpt && (
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                          {related.excerpt}
                        </p>
                      )}
                      
                      {/* Auteur et date */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        {related.author?.name && (
                          <span className="truncate max-w-[60%]">
                            Par {related.author.name}
                          </span>
                        )}
                        {related.publishedAt && (
                          <span>
                            {new Date(related.publishedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Ligne de progression colorée au survol */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(to right, ${cardColors.primary}, ${cardColors.textColor})`
                      }}
                    />
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/articles"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white rounded-lg font-medium transition-all transform hover:scale-105`}
          >
            Voir tous les articles
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;