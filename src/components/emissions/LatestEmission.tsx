import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Calendar, Hash, MessageCircle, Users, Share2, Heart, Volume2, Pause, ExternalLink } from 'lucide-react';

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

interface LatestEmissionProps {
  emission: Emission | null;
  isNew?: boolean;
}

// Clip-path octogonal
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)';

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
    month: 'long',
    year: 'numeric'
  });
};

// Helper pour le temps relatif
const getRelativeTime = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
  return formatDate(dateString);
};

// Vérifier si l'émission est récente (moins de 7 jours)
const isRecent = (dateString?: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

// Composant Waveform animée
const AnimatedWaveform = ({ isPlaying, className = '' }: { isPlaying: boolean; className?: string }) => {
  return (
    <div className={`flex items-center gap-[2px] ${className}`}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-pink-500 to-blue-500 rounded-full"
          animate={isPlaying ? {
            height: [4, 16 + Math.random() * 16, 4],
          } : { height: 4 }}
          transition={{
            duration: 0.6 + Math.random() * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.03,
          }}
        />
      ))}
    </div>
  );
};

// Composant Stats Card
const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
    <div className="p-2 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-lg">
      <Icon className="w-4 h-4 text-pink-400" />
    </div>
    <div>
      <div className="text-white font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  </div>
);

export const LatestEmission: React.FC<LatestEmissionProps> = ({ emission, isNew }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!emission) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 bg-gray-900/50 rounded-2xl border border-gray-800">
            <Volume2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune émission disponible pour le moment.</p>
            <p className="text-gray-500 text-sm mt-2">Reviens bientôt pour le prochain épisode !</p>
          </div>
        </div>
      </section>
    );
  }

  const youtubeId = getYoutubeId(emission.youtubeUrl || '');
  const showNewBadge = isNew ?? isRecent(emission.publishedAt);

  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl shadow-lg shadow-pink-500/25">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Dernier épisode</h2>
                {showNewBadge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold uppercase rounded-full shadow-lg shadow-pink-500/30"
                  >
                    Nouveau
                  </motion.span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {getRelativeTime(emission.publishedAt)} • Épisode #{emission.episodeNumber || '??'}
              </p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-400 hover:text-pink-400 transition-colors" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" />
            </motion.button>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Video Player - 3 colonnes */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="relative rounded-2xl overflow-hidden border-2 border-pink-500/20 shadow-2xl shadow-pink-500/10 group"
              style={{ clipPath: octagonClipSubtle }}
            >
              {/* Aspect ratio 16:9 */}
              <div className="relative aspect-video bg-gray-900">
                <AnimatePresence mode="wait">
                  {isPlaying && youtubeId ? (
                    <motion.div
                      key="player"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                        title={emission.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="thumbnail"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      {/* Thumbnail */}
                      {emission.thumbnail ? (
                        <img
                          src={emission.thumbnail}
                          alt={emission.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : youtubeId ? (
                        <img
                          src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                          alt={emission.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 to-blue-900/30 flex items-center justify-center">
                          <Play className="w-20 h-20 text-white/30" />
                        </div>
                      )}

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                      {/* Top badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {emission.episodeNumber && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                              <Hash className="w-4 h-4 text-pink-400" />
                              <span className="text-white font-bold">{emission.episodeNumber}</span>
                            </div>
                          )}
                        </div>
                        {emission.duration && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-white font-medium">{emission.duration}</span>
                          </div>
                        )}
                      </div>

                      {/* Bouton Play central */}
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ scale: isHovered ? 1.1 : 1 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative"
                        >
                          {/* Cercle externe animé */}
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 bg-pink-500/30 rounded-full"
                          />
                          {/* Bouton principal */}
                          <div
                            className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/40"
                            style={{ clipPath: octagonClip }}
                          >
                            <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1" fill="currentColor" />
                          </div>
                        </motion.div>
                      </button>

                      {/* Bottom info bar */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center justify-between">
                          <AnimatedWaveform isPlaying={isHovered} className="opacity-60" />
                          <span className="text-white/60 text-sm font-medium">Cliquer pour regarder</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bordure gradient animée */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-pink-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ clipPath: octagonClipSubtle, WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor' }} />
              </div>
            </div>

            {/* Barre de contrôle sous le player */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="p-2 bg-pink-500/20 rounded-lg hover:bg-pink-500/30 transition-colors"
                  >
                    <Pause className="w-5 h-5 text-pink-400" />
                  </button>
                  <AnimatedWaveform isPlaying={true} className="hidden sm:flex" />
                </div>
                <a
                  href={emission.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  <span className="text-sm">Ouvrir sur YouTube</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            )}
          </motion.div>

          {/* Info Panel - 2 colonnes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Titre */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
                {emission.title}
              </h3>

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(emission.publishedAt)}</span>
              </div>
            </div>

            {/* Description */}
            {emission.description && (
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <p className="text-gray-300 leading-relaxed">
                  {emission.description}
                </p>
              </div>
            )}

            {/* Thèmes/Tags */}
            {emission.themes && emission.themes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Sujets abordés
                </h4>
                <div className="flex flex-wrap gap-2">
                  {emission.themes.map((theme, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/20 text-white text-sm font-medium rounded-xl hover:border-pink-500/40 transition-colors cursor-pointer"
                    >
                      {theme}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Users} value="500K+" label="Vues" />
              <StatCard icon={MessageCircle} value="2.5K" label="Commentaires" />
            </div>

            {/* CTA */}
            <motion.a
              href={emission.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              <span>Regarder sur YouTube</span>
            </motion.a>

            {/* Info supplémentaire */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Nouvelle émission chaque semaine
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LatestEmission;
