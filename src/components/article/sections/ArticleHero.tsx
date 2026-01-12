// src/components/article/sections/ArticleHero.tsx
// Hero premium style éditorial - Design immersif et élégant
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar, Clock, User } from "lucide-react";
import { SanityArticle, VerticalColors } from "../../../types/article.types";
import { urlFor } from "../../../utils/sanityClient";

interface ArticleHeroProps {
  article: SanityArticle;
  colors: VerticalColors;
}

// Fonction pour calculer la position de l'image basée sur le hotspot
const getHotspotPosition = (hotspot: any) => {
  if (!hotspot) return 'center center';
  const x = Math.round(hotspot.x * 100);
  const y = Math.round(hotspot.y * 100);
  return `${x}% ${y}%`;
};

const ArticleHero: React.FC<ArticleHeroProps> = ({ article, colors }) => {
  const hotspot = article.mainImage?.hotspot;
  const imagePosition = getHotspotPosition(hotspot);

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = () => {
    if (!article.mainImage || !article.mainImage.asset) return null;

    if (article.mainImage.asset.url) {
      return article.mainImage.asset.url;
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
  const readingTime = article.readingTime || "5 min";

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
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

        {/* Overlay UNIQUEMENT sur le tiers inférieur - pour le texte */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 70%, transparent 100%)'
          }}
        />

        {/* Léger assombrissement des bords pour le header */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)'
          }}
        />

        {/* Ligne d'accent colorée en bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: colors.bgGradient }}
        />
      </div>

      {/* Contenu Hero - Poussé vers le bas */}
      <div className="relative container mx-auto px-4 pb-12 md:pb-16">
        <div className="max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Accueil
            </Link>
            <ChevronRight size={14} className="text-gray-600" />

            {article.categories && article.categories[0] && (
              <>
                <Link
                  to={`/rubrique/${article.categories[0].slug.current}`}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: colors.primary,
                    color: 'white'
                  }}
                >
                  {article.categories[0].title}
                </Link>

                {article.subcategories && article.subcategories[0] && (
                  <>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/15 backdrop-blur-sm text-white border border-white/10">
                      {article.subcategories[0].title}
                    </span>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Titre principal */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tight"
            style={{
              textShadow: '0 4px 40px rgba(0,0,0,0.5)'
            }}
          >
            {article.title}
          </h1>

          {/* Extrait */}
          {article.excerpt && (
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Meta informations - Design carte */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Auteur avec photo */}
            {article.author && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full pl-1.5 pr-5 py-1.5 border border-white/10">
                {article.author.image ? (
                  <img
                    src={
                      article.author.image.asset?.url ||
                      (article.author.image.asset?._ref
                        ? urlFor(article.author.image).width(80).height(80).url()
                        : null)
                    }
                    alt={article.author.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: colors.bgGradient }}
                  >
                    <User size={16} className="text-white" />
                  </div>
                )}
                <span className="text-white font-medium">
                  {article.author.name}
                </span>
              </div>
            )}

            {/* Séparateur */}
            <div className="w-px h-6 bg-white/20 hidden sm:block" />

            {/* Date */}
            {article.publishedAt && (
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Calendar size={15} className="text-gray-400" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}

            {/* Séparateur */}
            <div className="w-px h-6 bg-white/20 hidden sm:block" />

            {/* Temps de lecture */}
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Clock size={15} className="text-gray-400" />
              <span>{readingTime} de lecture</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleHero;
