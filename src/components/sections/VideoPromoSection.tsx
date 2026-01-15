// src/components/sections/VideoPromoSection.tsx
// Section Émissions - Design épuré, émission à gauche, shorts à droite

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Tv, Mic2 } from 'lucide-react';
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

      {/* Layout principal : Émission à gauche (60%), Shorts à droite (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Colonne gauche : Dernière émission (3/5 de la largeur) */}
        {latestEmission && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group lg:col-span-3"
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

              {/* Réseaux sociaux */}
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Suivez-nous</p>
                <div className="flex items-center gap-3">
                  {/* YouTube */}
                  <a href="https://youtube.com/@octogoal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800/50 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  {/* TikTok */}
                  <a href="https://tiktok.com/@octogoal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800/50 hover:bg-black rounded-xl flex items-center justify-center transition-colors group border border-transparent hover:border-white/20">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://instagram.com/octogoal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800/50 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 rounded-xl flex items-center justify-center transition-all group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a href="https://facebook.com/octogoal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800/50 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  {/* Discord */}
                  <a href="https://discord.gg/octogoal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800/50 hover:bg-[#5865F2] rounded-xl flex items-center justify-center transition-colors group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </a>
                  {/* Twitter/X */}
                  <a href="https://twitter.com/octogoal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800/50 hover:bg-black rounded-xl flex items-center justify-center transition-colors group border border-transparent hover:border-white/20">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* CTA Participer */}
              <a
                href="https://forms.gle/octogoal-emission"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3 bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-pink-500/30 hover:border-pink-500/50 rounded-xl transition-all group"
              >
                <Mic2 className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-semibold">Tu veux passer à l'antenne ?</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* Colonne droite : 6 Shorts en grille 2x3 (2/5 de la largeur) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 grid grid-cols-2 gap-2"
        >
          {extraits.slice(0, 4).map((extrait, index) => {
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
