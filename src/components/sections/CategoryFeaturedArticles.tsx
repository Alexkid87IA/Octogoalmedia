import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
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

interface CategoryFeaturedArticlesProps {
  articles: Article[];
}

export const CategoryFeaturedArticles = ({ articles }: CategoryFeaturedArticlesProps) => {
  if (articles.length === 0) return null;

  return (
    <section className="container mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.slice(0, 2).map((article, index) => (
            <Link 
              key={article._id}
              to={`/article/${article.slug.current}`}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-accent-blue/30"
              >
                {/* Image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <SafeImage
                    source={article.mainImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Categories */}
                  {article.categories && article.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
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

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-accent-blue transition-colors">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-300 mb-6 line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-400">
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
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-accent-blue" />
                      <span>Octogoal</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <motion.span
                      className="inline-flex items-center gap-2 text-accent-blue group-hover:text-accent-turquoise transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span>Lire l'article</span>
                      <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
};