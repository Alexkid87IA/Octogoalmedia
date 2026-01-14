import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Calendar, Hash } from 'lucide-react';

interface Emission {
  _id: string;
  title: string;
  slug?: string;
  episodeNumber?: number;
  youtubeUrl?: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
  publishedAt?: string;
  themes?: string[];
}

interface EmissionCardProps {
  emission: Emission;
  index?: number;
  onPlay?: (emission: Emission) => void;
}

// Helper pour extraire l'ID YouTube
const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

// Helper pour formater la date
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const EmissionCard: React.FC<EmissionCardProps> = ({ emission, index = 0, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const youtubeId = getYoutubeId(emission.youtubeUrl || '');

  const handleClick = () => {
    if (onPlay) {
      onPlay(emission);
    } else if (emission.youtubeUrl) {
      window.open(emission.youtubeUrl, '_blank');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
      onClick={handleClick}
    >
      {/* Card Container */}
      <div className="relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-pink-500/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/10">
        {/* Thumbnail 16:9 */}
        <div className="relative aspect-video overflow-hidden">
          {emission.thumbnail ? (
            <img
              src={emission.thumbnail}
              alt={emission.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : youtubeId ? (
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
              alt={emission.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-900/30 to-blue-900/30 flex items-center justify-center">
              <Play className="w-12 h-12 text-white/30" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Badge numéro d'épisode */}
          {emission.episodeNumber && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 px-2.5 py-1 bg-pink-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-pink-500/30">
                <Hash className="w-3 h-3" />
                {emission.episodeNumber}
              </span>
            </div>
          )}

          {/* Durée */}
          {emission.duration && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded">
              {emission.duration}
            </div>
          )}

          {/* Bouton Play au hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 bg-pink-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/30">
                  <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Titre */}
          <h3 className="text-white font-bold text-lg line-clamp-2 mb-2 group-hover:text-pink-400 transition-colors">
            {emission.title}
          </h3>

          {/* Métadonnées */}
          <div className="flex items-center gap-3 text-sm text-gray-400">
            {emission.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(emission.publishedAt)}
              </span>
            )}
            {emission.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {emission.duration}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default EmissionCard;
