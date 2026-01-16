// src/components/article/ui/ArticleAuthor.tsx
// Composant auteur moderne style Octogoal
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ChevronRight, PenTool } from "lucide-react";
import { urlFor } from "../../../utils/sanityClient";
import { VerticalColors } from "../../../types/article.types";
import { SanityImage } from "../../../types/sanity";

interface ArticleAuthorProps {
  author: {
    name: string;
    image?: SanityImage;
    imageUrl?: string;
    bio?: string;
  };
  publishedAt?: string;
  colors: VerticalColors;
  variant?: 'desktop' | 'mobile';
}

// Clip-path octogonal
const octagonClip = 'polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)';

const ArticleAuthor: React.FC<ArticleAuthorProps> = ({
  author,
  publishedAt,
  colors,
  variant = 'desktop'
}) => {
  const avatarSize = variant === 'mobile'
    ? { width: 64, height: 64, iconSize: 24, className: "w-16 h-16" }
    : { width: 72, height: 72, iconSize: 28, className: "w-[72px] h-[72px]" };

  // Fonction pour obtenir l'URL de l'image
  const getAuthorImageUrl = React.useMemo(() => {
    try {
      if (author.imageUrl && typeof author.imageUrl === 'string' && author.imageUrl.startsWith('http')) {
        return author.imageUrl;
      }

      if (author.image) {
        if (typeof author.image === 'string' && author.image.startsWith('http')) {
          return author.image;
        }

        if (author.image.asset) {
          if (typeof author.image.asset === 'string' && author.image.asset.startsWith('http')) {
            return author.image.asset;
          }

          if (author.image.asset._ref && author.image.asset._ref.includes('image-')) {
            try {
              const url = urlFor(author.image)
                .width(avatarSize.width * 2)
                .height(avatarSize.height * 2)
                .url();

              if (url && !url.includes('undefined')) {
                return url;
              }
            } catch (e) {
              console.error('Error with urlFor:', e);
            }
          }
        }

        if (author.image.url && typeof author.image.url === 'string') {
          return author.image.url;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }, [author.image, author.imageUrl, avatarSize.width, avatarSize.height]);

  // Version mobile
  if (variant === 'mobile') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden mb-8"
      >
        <div
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors.bgLight} 0%, rgba(0,0,0,0.3) 100%)`,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {/* Avatar octogonal */}
          <div className="relative flex-shrink-0">
            {getAuthorImageUrl ? (
              <div
                className={`${avatarSize.className} overflow-hidden`}
                style={{ clipPath: octagonClip }}
              >
                <img
                  src={getAuthorImageUrl}
                  alt={author.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                className={`${avatarSize.className} flex items-center justify-center`}
                style={{
                  clipPath: octagonClip,
                  background: colors.bgGradient
                }}
              >
                <User size={avatarSize.iconSize} className="text-white" />
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Écrit par</p>
            <h3 className="text-base font-bold text-white">{author.name}</h3>
            {publishedAt && (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Calendar size={10} />
                {new Date(publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Version desktop
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Header avec icône */}
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: colors.bgGradient }}
        >
          <PenTool size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-white">L'auteur</span>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Avatar octogonal */}
          <div className="relative flex-shrink-0">
            {getAuthorImageUrl ? (
              <div
                className={`${avatarSize.className} overflow-hidden`}
                style={{ clipPath: octagonClip }}
              >
                <img
                  src={getAuthorImageUrl}
                  alt={author.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                className={`${avatarSize.className} flex items-center justify-center`}
                style={{
                  clipPath: octagonClip,
                  background: colors.bgGradient
                }}
              >
                <User size={avatarSize.iconSize} className="text-white" />
              </div>
            )}

            {/* Badge rédacteur */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: colors.primary }}
            >
              <PenTool size={10} className="text-white" />
            </div>
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white">{author.name}</h3>
            {publishedAt && (
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Calendar size={10} />
                {new Date(publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {author.bio && (
          <p className="text-sm text-gray-400 leading-relaxed mt-4 line-clamp-3">
            {author.bio}
          </p>
        )}

        {/* Lien vers profil */}
        <Link
          to={`/auteur/${author.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="group flex items-center justify-between mt-4 p-3 rounded-xl transition-all hover:bg-white/5"
          style={{ border: `1px solid ${colors.borderColor}` }}
        >
          <span className="text-sm font-medium" style={{ color: colors.textColor }}>
            Voir ses articles
          </span>
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
            style={{ color: colors.textColor }}
          />
        </Link>
      </div>
    </motion.div>
  );
};

export default ArticleAuthor;
