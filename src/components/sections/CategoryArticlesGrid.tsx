import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import SafeImage from '../common/SafeImage';

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: string;
  excerpt: string;
  publishedAt: string;
  categories: Array<{ title: string; slug: { current: string } }>;
}

interface CategoryArticlesGridProps {
  articles: Article[];
  onLoadMore: () => void;
  hasMore: boolean;
}

export const CategoryArticlesGrid = ({ articles, onLoadMore, hasMore }: CategoryArticlesGridProps) => {
  return (
    <section className="container mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <motion.div
            key={article._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link 
              to={`/article/${article.slug.current}`}
              className="block h-full"
            >
              <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-accent-blue/30 hover:shadow-xl">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <SafeImage
                    source={article.mainImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Categories */}
                  {article.categories && article.categories.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {article.categories.map((category, idx) => (
                        <span
                          key={idx}
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            ["bg-purple-600", "bg-pink-600", "bg-blue-500", "bg-green-500"][idx % 4]
                          } text-white`}
                        >
                          {category.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent-blue transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-6 flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="mt-auto">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-accent-blue" />
                        <time dateTime={article.publishedAt}>
                          {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-accent-blue" />
                        <span>5 min de lecture</span>
                      </div>
                    </div>

                    {/* Border & CTA */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Par Octogoal
                      </span>
                      <span className="inline-flex items-center gap-2 text-accent-blue group-hover:text-accent-turquoise transition-colors">
                        <span className="text-sm">Lire</span>
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-12">
          <motion.button
            onClick={onLoadMore}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center gap-2 group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-blue via-accent-turquoise to-accent-blue rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center gap-2 bg-black px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300">
              <span>Voir plus d'articles</span>
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>
      )}
    </section>
  );
};