import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import ErrorBoundary from '../common/ErrorBoundary';
import { SanityImage } from '../../types/sanity';

interface HomeArticlesSectionProps {
  title?: string;
  articles?: Array<{
    _id: string;
    title: string;
    slug?: {
      current: string;
    };
    mainImage?: SanityImage;
    excerpt?: string;
    publishedAt?: string;
    categories?: Array<{
      _id: string;
      title: string;
      slug?: {
        current: string;
      };
    }>;
  }>;
}

export const HomeArticlesSection: React.FC<HomeArticlesSectionProps> = ({
  title = "Articles récents",
  articles = []
}) => {
  if (!articles || articles.length === 0) return null;

  // Limiter à 3 articles récents
  const recentArticles = articles.slice(0, 3);

  return (
    <ErrorBoundary>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900/50 to-black" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <span className="inline-block px-4 py-2 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-medium mb-4">
                Derniers articles
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                {title}
              </h2>
            </div>
            
            <Link 
              to="/articles"
              className="group inline-flex items-center gap-2 text-accent-blue hover:text-accent-turquoise transition-colors"
            >
              <span>Voir tous les articles</span>
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article, index) => (
              <motion.article
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-xl overflow-hidden hover:border-accent-blue/30 transition-all duration-300"
              >
                <Link to={`/article/${article.slug?.current || '#'}`} className="block">
                  <div className="relative aspect-video overflow-hidden">
                    <SafeImage
                      source={article.mainImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      fallbackText={article.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    
                    {article.categories && article.categories.length > 0 && (
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {article.categories.map((category, idx) => (
                          category.slug?.current && (
                            <Link 
                              key={category._id} 
                              to={`/rubrique/${category.slug.current}`} 
                              className={`inline-block ${["bg-purple-600", "bg-pink-600", "bg-blue-500", "bg-green-500"][idx % 4]} px-3 py-1 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {category.title}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent-blue transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    {article.excerpt && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <time className="text-sm text-gray-500" dateTime={article.publishedAt}>
                        {new Date(article.publishedAt || '').toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      
                      <span className="inline-flex items-center gap-2 text-accent-blue group-hover:text-accent-turquoise transition-colors">
                        <span>Lire l'article</span>
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default HomeArticlesSection;