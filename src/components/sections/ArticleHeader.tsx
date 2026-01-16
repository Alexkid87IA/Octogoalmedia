import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import SafeImage from '../common/SafeImage';
import ErrorBoundary from '../common/ErrorBoundary';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronDown } from 'lucide-react';
import { SanityImage } from '../../types/sanity';

interface ArticleHeaderProps {
  article: {
    title?: string;
    mainImage?: SanityImage;
    publishedAt?: string;
    author?: {
      name?: string;
      image?: SanityImage;
    };
    categories?: Array<{
      _id: string;
      title: string;
      slug?: {
        current: string;
      };
    }>;
    description?: string;
    readingTime?: string;
    category?: string;
    image?: SanityImage;
  };
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  if (!article) return null;

  return (
    <ErrorBoundary>
      <header className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-16 md:pt-40 md:pb-20 lg:pt-48 lg:pb-24">
        {/* Image de fond en hero avec overlay amélioré */}
        {article.image && (
          <div className="absolute inset-0 z-[-1] overflow-hidden">
            <SafeImage
              source={article.image}
              alt={article.title || "Image de l'article"}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient sophistiqué */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-background-dark"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
            {/* Effet de vignette pour améliorer la lisibilité */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            {/* Catégorie avec design amélioré */}
            {article.category && (
              <div className="flex justify-center mb-10">
                <Link 
                  to={`/rubrique/${article.category.toLowerCase()}`}
                  className="px-5 py-2 bg-accent-blue/20 text-accent-blue rounded-full font-medium hover:bg-accent-blue/30 transition-colors border border-accent-blue/30 backdrop-blur-sm shadow-lg"
                >
                  {article.category}
                </Link>
              </div>
            )}

            {/* Titre principal avec animation et style amélioré */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-10 leading-tight text-white shadow-text tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              {article.title || "Article sans titre"}
            </motion.h1>
            
            {/* Description / Extrait avec style amélioré */}
            {article.description && (
              <motion.p 
                className="text-xl md:text-2xl text-white/90 text-center max-w-3xl mx-auto mb-12 leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                {article.description}
              </motion.p>
            )}
            
            {/* Métadonnées de l'article (date, temps de lecture) */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-8 mb-12 text-base text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-accent-blue" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-accent-blue" />
                <span>{article.readingTime || "5 min de lecture"}</span>
              </div>
            </motion.div>
            
            {/* Informations sur l'auteur avec design amélioré */}
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <div className="flex items-center bg-black/40 px-6 py-4 rounded-full backdrop-blur-md border border-white/10 shadow-xl hover:border-accent-blue/30 transition-all duration-300 group">
                {article.author?.image ? (
                  <div className="mr-4 w-14 h-14 rounded-full overflow-hidden border-2 border-accent-blue/50 shadow-glow">
                    <SafeImage
                      source={article.author.image}
                      alt={article.author.name || "Auteur"}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mr-4 w-14 h-14 rounded-full bg-accent-blue/20 flex items-center justify-center border-2 border-accent-blue/50 shadow-glow">
                    <span className="text-accent-blue font-bold text-xl">
                      {article.author?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                )}
                <div>
                  <span className="block text-lg font-medium text-white group-hover:text-accent-blue transition-colors">
                    {article.author?.name || "Auteur inconnu"}
                  </span>
                  <span className="text-base text-white/60">
                    Rédacteur
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Indicateur de défilement */}
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <span className="text-white/60 text-sm mb-3 font-light">Défiler pour lire</span>
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <ChevronDown size={24} className="text-accent-blue" />
          </motion.div>
        </motion.div>
      </header>
    </ErrorBoundary>
  );
};

export default ArticleHeader;
