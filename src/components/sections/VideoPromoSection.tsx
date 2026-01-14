// src/components/sections/VideoPromoSection.tsx
// Encart pour promouvoir les émissions et extraits YouTube - Style Octogoal

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight, Tv, Film, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOctogoalEmissions, getOctogoalExtraits } from '../../utils/sanityAPI';

// Clip-paths octogonaux (même que HeroSection)
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';
const octagonClipCard = 'polygon(4% 0%, 96% 0%, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0% 96%, 0% 4%)';

// Extraire l'ID YouTube d'une URL
const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return shortsMatch[1];
  const standardMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (standardMatch) return standardMatch[1];
  return null;
};

// Obtenir la miniature YouTube (haute qualité)
const getYoutubeThumbnail = (url: string, quality: 'hq' | 'maxres' = 'hq'): string => {
  const videoId = getYoutubeId(url);
  if (!videoId) return 'https://via.placeholder.com/480x360?text=Video';
  return quality === 'maxres'
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

interface Emission {
  _id: string;
  title: string;
  slug?: string;
  episodeNumber?: number;
  youtubeUrl?: string;
  description?: string;
  publishedAt?: string;
}

interface Extrait {
  _id: string;
  title: string;
  youtubeShortUrl?: string;
  publishedAt?: string;
}

// Données de démo avec les vraies URLs YouTube
const mockEmissions: Emission[] = [
  {
    _id: 'demo-1',
    title: 'Émission Octogoal #1 - Dernière émission',
    episodeNumber: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=m85LBJ75Lwk',
    description: 'La dernière émission Octogoal avec toute l\'équipe pour débattre de l\'actu foot !',
    publishedAt: new Date().toISOString()
  },
  {
    _id: 'demo-2',
    title: 'Émission Octogoal #2',
    episodeNumber: 2,
    youtubeUrl: 'https://www.youtube.com/watch?v=qip4oKBARak',
    description: 'Émission Octogoal',
    publishedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'demo-3',
    title: 'Émission Octogoal #3',
    episodeNumber: 3,
    youtubeUrl: 'https://www.youtube.com/watch?v=aIStLalPrSg',
    description: 'Émission Octogoal',
    publishedAt: new Date(Date.now() - 172800000).toISOString()
  }
];

const mockExtraits: Extrait[] = [
  { _id: 'ext-1', title: 'Extrait #1', youtubeShortUrl: 'https://www.youtube.com/shorts/C1tAxrJ4yQ8' },
  { _id: 'ext-2', title: 'Extrait #2', youtubeShortUrl: 'https://www.youtube.com/shorts/UG37HFn-8ow' },
  { _id: 'ext-3', title: 'Extrait #3', youtubeShortUrl: 'https://www.youtube.com/shorts/7tJ0X_PVScg' },
  { _id: 'ext-4', title: 'Extrait #4', youtubeShortUrl: 'https://www.youtube.com/shorts/MluTyAdV-G0' },
  { _id: 'ext-5', title: 'Extrait #5', youtubeShortUrl: 'https://www.youtube.com/shorts/PeMgOyOBnDE' },
  { _id: 'ext-6', title: 'Extrait #6', youtubeShortUrl: 'https://www.youtube.com/shorts/Vt6Lj4ZJP1U' }
];

export const VideoPromoSection: React.FC = () => {
  const [emissions, setEmissions] = useState<Emission[]>(mockEmissions);
  const [extraits, setExtraits] = useState<Extrait[]>(mockExtraits);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emissionsData, extraitsData] = await Promise.all([
          getOctogoalEmissions(3),
          getOctogoalExtraits(6)
        ]);
        if (emissionsData && emissionsData.length > 0) {
          setEmissions(emissionsData);
        }
        if (extraitsData && extraitsData.length > 0) {
          setExtraits(extraitsData);
        }
      } catch (error) {
        console.error('Erreur chargement vidéos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mb-12">
        <div className="h-[400px] bg-gray-900/50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const latestEmission = emissions[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      {/* Header - Style identique aux "Articles populaires" */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-pink-500/30 mb-4"
          style={{ clipPath: octagonClipSubtle }}
        >
          <Tv className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-medium text-white">Vidéos</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-black mb-4">
          <span className="text-white">Émissions </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
            Octogoal
          </span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Retrouve nos dernières émissions et les meilleurs extraits
        </p>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Émission principale - Grande carte */}
        {latestEmission && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8"
          >
            <a
              href={latestEmission.youtubeUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10"
                style={{ clipPath: octagonClipCard }}
              >
                {/* Image 16:9 */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={getYoutubeThumbnail(latestEmission.youtubeUrl || '', 'maxres')}
                    alt={latestEmission.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />

                  {/* Play button central */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-pink-500/30 group-hover:shadow-pink-500/50 transition-shadow"
                      style={{ clipPath: octagonClipSubtle }}
                    >
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </motion.div>
                  </div>

                  {/* Badge ÉMISSION */}
                  <div className="absolute top-4 left-4">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-blue-500 shadow-lg"
                      style={{ clipPath: octagonClipSubtle }}
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Émission</span>
                    </div>
                  </div>

                  {/* Numéro d'épisode */}
                  {latestEmission.episodeNumber && (
                    <div className="absolute top-4 right-4">
                      <div
                        className="px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-white/10"
                        style={{ clipPath: octagonClipSubtle }}
                      >
                        <span className="text-sm font-bold text-white">#{latestEmission.episodeNumber}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu texte */}
                <div className="p-5 bg-gray-900/80">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 transition-all duration-300">
                    {latestEmission.title}
                  </h3>
                  {latestEmission.description && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {latestEmission.description}
                    </p>
                  )}
                  <span
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold text-sm"
                    style={{ clipPath: octagonClipSubtle }}
                  >
                    <Play className="w-4 h-4" />
                    Regarder sur YouTube
                  </span>
                </div>

                {/* Bordure animée au hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </a>
          </motion.div>
        )}

        {/* Colonne droite: Extraits */}
        <div className="lg:col-span-4 flex flex-col">
          {/* Header extraits */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Extraits</h3>
                <p className="text-[10px] text-gray-500">Shorts YouTube</p>
              </div>
            </div>
            <Link
              to="/emissions#extraits"
              className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
            >
              Tout voir
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Grille de shorts */}
          <div className="grid grid-cols-3 gap-2 flex-1">
            {extraits.slice(0, 6).map((extrait, index) => (
              <motion.a
                key={extrait._id}
                href={extrait.youtubeShortUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-[9/16] overflow-hidden bg-gray-900/50 border border-gray-800 hover:border-pink-500/50 transition-all duration-300"
                style={{ clipPath: octagonClipCard }}
              >
                <img
                  src={getYoutubeThumbnail(extrait.youtubeShortUrl || '')}
                  alt={extrait.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play icon au hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="w-10 h-10 bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center shadow-lg"
                    style={{ clipPath: octagonClipSubtle }}
                  >
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bordure gradient au hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Autres émissions */}
      {emissions.length > 1 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {emissions.slice(1, 3).map((emission, index) => (
            <motion.a
              key={emission._id}
              href={emission.youtubeUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <div
                className="flex gap-4 p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
                style={{ clipPath: octagonClipCard }}
              >
                {/* Thumbnail */}
                <div
                  className="relative w-36 aspect-video overflow-hidden flex-shrink-0"
                  style={{ clipPath: octagonClipSubtle }}
                >
                  <img
                    src={getYoutubeThumbnail(emission.youtubeUrl || '')}
                    alt={emission.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <div
                      className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center"
                      style={{ clipPath: octagonClipSubtle }}
                    >
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    {emission.episodeNumber && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 bg-gradient-to-r from-pink-500/20 to-blue-500/20 text-pink-400"
                        style={{ clipPath: octagonClipSubtle }}
                      >
                        #{emission.episodeNumber}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Émission</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 transition-all line-clamp-2">
                    {emission.title}
                  </h4>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {/* CTA vers page émissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <Link
          to="/emissions"
          className="group inline-flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-pink-500/50 text-gray-400 hover:text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
          style={{ clipPath: octagonClipSubtle }}
        >
          <Tv className="w-4 h-4" />
          <span>Voir toutes les émissions</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default VideoPromoSection;
