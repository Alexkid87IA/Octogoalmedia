// src/components/article/sections/RelatedArticles.tsx
// Section articles recommandés avec glassmorphism
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { SanityArticle, VerticalColors } from "../../../types/article.types";

interface RelatedArticlesProps {
  articles: SanityArticle[];
  colors: VerticalColors;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, colors }) => {
  if (articles.length === 0) return null;

  // Fonction pour obtenir l'URL de l'image depuis Sanity
  const getImageUrl = (mainImage: any) => {
    if (mainImage?.asset?.url) {
      return mainImage.asset.url;
    }

    if (mainImage?.asset?._ref) {
      const ref = mainImage.asset._ref;
      const cleanRef = ref
        .replace('image-', '')
        .replace('-jpg', '.jpg')
        .replace('-jpeg', '.jpeg')
        .replace('-png', '.png')
        .replace('-webp', '.webp');

      return `https://cdn.sanity.io/images/5rn8u6ed/production/${cleanRef}?w=400&h=300&fit=crop&auto=format`;
    }

    return null;
  };

  return (
    <section className="py-16 sm:py-20 bg-black relative overflow-hidden">
      {/* Fond avec subtils dégradés */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-transparent to-gray-900/30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header avec glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 animate-pulse" />
            <span className="text-sm text-gray-400 font-medium">Recommandés</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Continuez votre lecture
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Découvrez d'autres articles qui pourraient vous intéresser
          </p>
        </motion.div>

        {/* Grille d'articles avec glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles.slice(0, 6).map((related, index) => {
            const imageUrl = getImageUrl(related.mainImage);

            return (
              <motion.article
                key={related._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group"
              >
                <Link to={`/article/${related.slug.current}`}>
                  <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-pink-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
                    {/* Reflet glassmorphism */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none rounded-2xl" />

                    {/* Section Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt={related.title || 'Article image'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-blue-500/20">
                          <div className="absolute inset-0 bg-black/60" />
                        </div>
                      )}

                      {/* Badge de catégorie - Glassmorphism */}
                      {related.categories && related.categories[0] && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                            {related.categories[0].title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Section Contenu */}
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors leading-tight">
                        {related.title}
                      </h3>

                      {related.excerpt && (
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                          {related.excerpt}
                        </p>
                      )}

                      {/* Meta : Auteur et date */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        {related.author?.name && (
                          <span className="text-xs text-gray-500 truncate max-w-[55%]">
                            Par {related.author.name}
                          </span>
                        )}
                        {related.publishedAt && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar size={12} />
                            <span>
                              {new Date(related.publishedAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ligne d'accent au survol */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* CTA - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-14"
        >
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:scale-105"
          >
            Voir tous les articles
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RelatedArticles;