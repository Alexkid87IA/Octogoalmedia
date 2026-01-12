// src/components/article/sections/ArticleHero.tsx
// Hero avec aspect-ratio pour montrer plus de l'image
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar, Clock } from "lucide-react";
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
    <section className="relative">
      {/* Container avec aspect-ratio - montre plus de l'image */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] md:aspect-[21/9] lg:aspect-[2.5/1]">
        {/* Background Image */}
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

        {/* Overlay gradient en bas pour le texte */}
        <div
          className="absolute inset-x-0 bottom-0 h-[60%]"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)'
          }}
        />

        {/* Léger assombrissement pour le header/navigation */}
        <div
          className="absolute inset-x-0 top-0 h-20"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)'
          }}
        />

        {/* Ligne d'accent colorée en bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: colors.bgGradient }}
        />

        {/* Contenu Hero - Positionné en bas */}
        <div className="absolute inset-x-0 bottom-0 pb-6 md:pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              {/* Breadcrumb compact */}
              <nav className="flex items-center gap-2 text-xs md:text-sm mb-3">
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Accueil
                </Link>

                {article.categories && article.categories[0] && (
                  <>
                    <ChevronRight size={12} className="text-gray-600" />
                    <Link
                      to={`/rubrique/${article.categories[0].slug.current}`}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105"
                      style={{
                        background: colors.primary,
                        color: 'white'
                      }}
                    >
                      {article.categories[0].title}
                    </Link>

                    {article.subcategories && article.subcategories[0] && (
                      <>
                        <ChevronRight size={12} className="text-gray-400" />
                        <span className="text-gray-300 text-xs">
                          {article.subcategories[0].title}
                        </span>
                      </>
                    )}
                  </>
                )}
              </nav>

              {/* Titre principal */}
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight tracking-tight"
                style={{
                  textShadow: '0 2px 20px rgba(0,0,0,0.5)'
                }}
              >
                {article.title}
              </h1>

              {/* Meta informations - Ligne compacte */}
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400">
                {/* Date */}
                {article.publishedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
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
                <span className="text-gray-600">|</span>

                {/* Temps de lecture */}
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{readingTime} de lecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleHero;
