// src/components/sections/VideoPromoSection.tsx
// Section Émissions - Design épuré, émission à gauche, shorts à droite

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOctogoalEmissions, getOctogoalExtraits } from '../../utils/sanityAPI';

// Extraire l'ID YouTube d'une URL
const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return shortsMatch[1];
  const standardMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (standardMatch) return standardMatch[1];
  return null;
};

// Obtenir la miniature YouTube
const getYoutubeThumbnail = (url: string): string => {
  const videoId = getYoutubeId(url);
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

// Obtenir l'URL embed YouTube
const getYoutubeEmbedUrl = (url: string): string => {
  const videoId = getYoutubeId(url);
  if (!videoId) return '';
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
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

// Données de démo
const mockEmissions: Emission[] = [
  { _id: 'demo-6', title: 'Émission Octogoal #6', episodeNumber: 6, youtubeUrl: 'https://www.youtube.com/watch?v=m85LBJ75Lwk', description: 'Débats et analyses foot' },
];

const mockExtraits: Extrait[] = [
  { _id: 'ext-1', title: 'Extrait #1', youtubeShortUrl: 'https://www.youtube.com/shorts/C1tAxrJ4yQ8' },
  { _id: 'ext-2', title: 'Extrait #2', youtubeShortUrl: 'https://www.youtube.com/shorts/UG37HFn-8ow' },
  { _id: 'ext-3', title: 'Extrait #3', youtubeShortUrl: 'https://www.youtube.com/shorts/7tJ0X_PVScg' },
  { _id: 'ext-4', title: 'Extrait #4', youtubeShortUrl: 'https://www.youtube.com/shorts/MluTyAdV-G0' },
  { _id: 'ext-5', title: 'Extrait #5', youtubeShortUrl: 'https://www.youtube.com/shorts/PeMgOyOBnDE' },
  { _id: 'ext-6', title: 'Extrait #6', youtubeShortUrl: 'https://www.youtube.com/shorts/Vt6Lj4ZJP1U' },
];

export const VideoPromoSection: React.FC = () => {
  const [emissions, setEmissions] = useState<Emission[]>(mockEmissions);
  const [extraits, setExtraits] = useState<Extrait[]>(mockExtraits);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emissionsData, extraitsData] = await Promise.all([
          getOctogoalEmissions(1),
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

  // Trier par numéro d'épisode décroissant
  const sortedEmissions = [...emissions].sort((a, b) => (b.episodeNumber || 0) - (a.episodeNumber || 0));
  const latestEmission = sortedEmissions[0];

  if (loading) {
    return (
      <div className="py-12">
        <div className="h-[400px] bg-gray-900/30 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Composant Play Button
  const PlayButton = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = {
      sm: 'w-10 h-10',
      md: 'w-16 h-16',
      lg: 'w-20 h-20'
    };
    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-7 h-7',
      lg: 'w-8 h-8'
    };
    return (
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-pink-500/40 group-hover:scale-110 transition-transform duration-300`}>
        <Play className={`${iconSizes[size]} text-white fill-white ml-0.5`} />
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12"
    >
      {/* Header simple et élégant */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">L'émission du peuple</h2>
            <p className="text-sm text-gray-500">Vidéos & extraits</p>
          </div>
        </div>
        <Link
          to="/emissions"
          className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
        >
          Voir tout →
        </Link>
      </div>

      {/* Layout principal : Émission à gauche, Shorts à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Colonne gauche : Dernière émission */}
        {latestEmission && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group"
          >
            {/* Container vidéo avec bordure gradient */}
            <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
              <div className="relative bg-black rounded-2xl overflow-hidden">
                <div className="aspect-video relative">
                  {playingVideo === latestEmission._id ? (
                    <iframe
                      src={getYoutubeEmbedUrl(latestEmission.youtubeUrl || '')}
                      title={latestEmission.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      onClick={() => setPlayingVideo(latestEmission._id)}
                      className="group w-full h-full relative"
                    >
                      <img
                        src={getYoutubeThumbnail(latestEmission.youtubeUrl || '')}
                        alt={latestEmission.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayButton size="lg" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Info émission - Zone enrichie */}
            <div className="mt-5 space-y-4">
              {/* Titre principal */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold">
                    <span className="text-white">Octogoal</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500"> #{latestEmission.episodeNumber || 6}</span>
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded">
                    New
                  </span>
                </div>
                <p className="text-gray-400 text-sm">Dernière émission Octogoal</p>
              </div>

              {/* Description avec icônes */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  Ça part en live
                </span>
                <span className="text-gray-600">•</span>
                <span>Débat enflammé</span>
                <span className="text-gray-600">•</span>
                <span>Analyse tactique</span>
              </div>

              {/* Stats en ligne */}
              <div className="flex items-center gap-6 pt-3 border-t border-gray-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">6</span>
                  <span className="text-xs text-gray-500 leading-tight">épisodes<br/>disponibles</span>
                </div>
                <div className="w-px h-8 bg-gray-800"></div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-pink-400">Live</span>
                  <span className="text-xs text-gray-500 leading-tight">chaque<br/>semaine</span>
                </div>
                <div className="w-px h-8 bg-gray-800"></div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">100%</span>
                  <span className="text-xs text-gray-500 leading-tight">sans<br/>filtre</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Colonne droite : 6 Shorts en grille 2x3 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-3"
        >
          {extraits.slice(0, 6).map((extrait, index) => {
            const isPlaying = playingVideo === extrait._id;
            const thumbnail = getYoutubeThumbnail(extrait.youtubeShortUrl || '');

            return (
              <motion.div
                key={extrait._id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 group"
              >
                {isPlaying ? (
                  <iframe
                    src={getYoutubeEmbedUrl(extrait.youtubeShortUrl || '')}
                    title={extrait.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    onClick={() => setPlayingVideo(extrait._id)}
                    className="w-full h-full relative"
                  >
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt={extrait.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayButton size="sm" />
                    </div>
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Link
          to="/emissions"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
        >
          Voir toutes les émissions
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default VideoPromoSection;
