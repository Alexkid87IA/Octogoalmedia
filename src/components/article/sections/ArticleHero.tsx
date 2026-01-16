// src/components/article/sections/ArticleHero.tsx
// Hero immersif mobile-first avec glassmorphism
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar, ArrowLeft, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { SanityArticle, VerticalColors } from "../../../types/article.types";
import { urlFor } from "../../../utils/sanityClient";

interface ArticleHeroProps {
  article: SanityArticle;
  colors: VerticalColors;
  onShareClick?: () => void;
}

// Type pour le hotspot Sanity
interface SanityHotspot {
  x: number;
  y: number;
  height?: number;
  width?: number;
}

// Fonction pour calculer la position de l'image basée sur le hotspot
const getHotspotPosition = (hotspot: SanityHotspot | undefined) => {
  if (!hotspot) return 'center center';
  const x = Math.round(hotspot.x * 100);
  const y = Math.round(hotspot.y * 100);
  return `${x}% ${y}%`;
};

const ArticleHero: React.FC<ArticleHeroProps> = ({ article, colors, onShareClick }) => {
  const hotspot = article.mainImage?.hotspot;
  const imagePosition = getHotspotPosition(hotspot);

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = () => {
    if (!article.mainImage || !article.mainImage.asset) return null;

    if ((article.mainImage.asset as any).url) {
      return (article.mainImage.asset as any).url;
    }

    if (article.mainImage.asset._ref) {
      try {
        return urlFor(article.mainImage).width(1920).height(1080).quality(90).url();
      } catch (error) {
        console.error('Error generating URL from ref:', error);
      }
    }

    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <section className="relative">
      {/* Header sticky transparent - Mobile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 lg:hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-xl border-b border-white/5">
          <Link
            to="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Retour</span>
          </Link>

          <button
            onClick={onShareClick}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            <Share2 size={18} className="text-white" />
          </button>
        </div>
      </motion.div>

      {/* Container Hero - Plus grand sur mobile pour effet immersif */}
      <div className="relative w-full min-h-[70vh] sm:min-h-[60vh] md:min-h-[65vh] lg:aspect-[21/9]">
        {/* Background Image */}
        {imageUrl ? (
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={imageUrl}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: imagePosition }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80";
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        )}

        {/* Overlay gradient - Plus prononcé en bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Overlay latéral subtil */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

        {/* Ligne d'accent colorée en bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: colors.bgGradient }}
        />

        {/* Contenu Hero - Positionné en bas avec padding généreux */}
        <div className="absolute inset-x-0 bottom-0 pb-8 md:pb-12 pt-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl">

              {/* Badge catégorie - Glassmorphism */}
              {article.categories && article.categories[0] && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <Link
                    to={`/rubrique/${article.categories[0].slug.current}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:scale-105 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                  >
                    {article.categories[0].title}
                  </Link>
                </motion.div>
              )}

              {/* Titre principal - Grande typo */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-[1.1] tracking-tight"
                style={{
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)'
                }}
              >
                {article.title}
              </motion.h1>

              {/* Excerpt / Chapô - Si disponible */}
              {article.excerpt && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-base sm:text-lg text-gray-300 mb-6 max-w-2xl leading-relaxed line-clamp-3"
                >
                  {article.excerpt}
                </motion.p>
              )}

              {/* Meta informations - Card glassmorphism */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-4"
              >
                {/* Auteur */}
                {article.author && (
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                    {article.author.image && (
                      <img
                        src={urlFor(article.author.image).width(40).height(40).url()}
                        alt={article.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                      />
                    )}
                    <span className="text-sm font-medium text-white">
                      {article.author.name}
                    </span>
                  </div>
                )}

                {/* Date */}
                {article.publishedAt && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300">
                    <Calendar size={14} />
                    <span className="text-sm">
                      {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleHero;
