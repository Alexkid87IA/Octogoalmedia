import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import ErrorBoundary from '../common/ErrorBoundary';
import { SanityImage } from '../../types/sanity';

interface ArticleSidebarProps {
  author?: {
    name?: string;
    image?: SanityImage;
    bio?: string;
    slug?: {
      current: string;
    };
  };
  relatedArticles?: Array<{
    _id: string;
    title: string;
    slug?: {
      current: string;
    };
    mainImage?: SanityImage;
    publishedAt?: string;
    categories?: Array<{
      title: string;
      slug?: {
        current: string;
      };
    }>;
  }>;
}

export const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ author, relatedArticles = [] }) => {
  return (
    <ErrorBoundary>
      <aside className="space-y-8 sticky top-32">
        {/* Section Auteur */}
        {author && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-4 pb-3 border-b border-white/10 text-white flex items-center">
              <span className="w-1 h-5 bg-accent-blue rounded-full mr-2"></span>
              À propos de l'auteur
            </h3>
            <div className="flex items-center mb-4">
              {author.image ? (
                <div className="mr-4 w-16 h-16 rounded-full overflow-hidden border-2 border-accent-blue/30">
                  <SafeImage
                    source={author.image}
                    alt={author.name || "Auteur"}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="mr-4 w-16 h-16 rounded-full bg-accent-blue/20 flex items-center justify-center border-2 border-accent-blue/30">
                  <span className="text-xl font-bold text-accent-blue">
                    {author.name?.charAt(0) || "A"}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-medium text-white">
                  {author.name || "Auteur inconnu"}
                </h4>
                {author.slug?.current && (
                  <Link 
                    to={`/auteur/${author.slug.current}`}
                    className="text-sm text-accent-blue hover:text-accent-turquoise transition-colors flex items-center mt-1 group"
                  >
                    Voir le profil
                    <ArrowRight className="ml-1 w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
            {author.bio && (
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                {typeof author.bio === 'string' 
                  ? author.bio 
                  : "Biographie non disponible"}
              </p>
            )}
            
            {/* Réseaux sociaux */}
            <div className="flex items-center justify-start space-x-3 mt-4 pt-4 border-t border-white/10">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-blue/20 hover:text-accent-blue transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-blue/20 hover:text-accent-blue transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-blue/20 hover:text-accent-blue transition-all">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-blue/20 hover:text-accent-blue transition-all">
                <Mail size={16} />
              </a>
            </div>
          </motion.div>
        )}

        {/* Section Articles similaires */}
        {relatedArticles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-6 pb-3 border-b border-white/10 text-white flex items-center">
              <span className="w-1 h-5 bg-accent-blue rounded-full mr-2"></span>
              Articles similaires
            </h3>
            <div className="space-y-6">
              {relatedArticles.map((article) => (
                <div key={article._id} className="group">
                  <Link to={`/article/${article.slug?.current || '#'}`} className="block">
                    {article.mainImage && (
                      <div className="w-full h-32 rounded-lg overflow-hidden mb-3 transform group-hover:scale-[1.02] transition-transform">
                        <SafeImage
                          source={article.mainImage}
                          alt={article.title || "Article similaire"}
                          width={300}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      {article.categories && article.categories[0] && (
                        <span className="text-xs font-medium text-accent-blue mb-1 block">
                          {article.categories[0].title}
                        </span>
                      )}
                      <h4 className="text-base font-medium text-white group-hover:text-accent-blue transition-colors line-clamp-2 mb-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">
                          {article.publishedAt 
                            ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'}) 
                            : "Date inconnue"}
                        </span>
                        <span className="text-xs text-accent-blue flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Lire l'article
                          <ArrowRight className="ml-1 w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            <Link 
              to="/articles" 
              className="mt-6 pt-4 border-t border-white/10 text-accent-blue hover:text-accent-turquoise transition-colors flex items-center justify-center w-full text-sm font-medium group"
            >
              Voir tous les articles
              <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
        
        {/* Section Newsletter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-accent-blue/20 to-accent-turquoise/10 p-6 rounded-xl border border-accent-blue/20 shadow-xl"
        >
          <h3 className="text-lg font-semibold mb-3 text-white">
            Restez informé
          </h3>
          <p className="text-sm text-white/80 mb-4">
            Recevez nos meilleurs articles et analyses directement dans votre boîte mail.
          </p>
          <form className="space-y-3">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-white placeholder-white/50"
            />
            <button 
              type="submit" 
              className="w-full py-3 bg-accent-blue hover:bg-accent-turquoise transition-colors rounded-lg text-white font-medium"
            >
              S'abonner
            </button>
          </form>
          <p className="text-xs text-white/60 mt-3">
            Nous respectons votre vie privée. Désabonnement possible à tout moment.
          </p>
        </motion.div>
      </aside>
    </ErrorBoundary>
  );
};

export default ArticleSidebar;
