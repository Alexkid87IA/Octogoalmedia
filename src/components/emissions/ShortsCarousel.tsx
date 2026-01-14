import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Extrait {
  _id: string;
  title: string;
  youtubeShortUrl?: string;
  thumbnail?: string;
  duration?: string;
  publishedAt?: string;
  emission?: {
    _id: string;
    title: string;
    episodeNumber?: number;
  };
}

interface ShortsCarouselProps {
  extraits: Extrait[];
  title?: string;
  showSeeAll?: boolean;
}

// Helper pour extraire l'ID YouTube Shorts
const getYoutubeShortId = (url: string): string | null => {
  if (!url) return null;
  // Format: https://youtube.com/shorts/VIDEO_ID ou https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  // Format classique YouTube
  const classicMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return classicMatch ? classicMatch[1] : null;
};

// Composant ShortCard
const ShortCard: React.FC<{ extrait: Extrait; index: number }> = ({ extrait, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoId = getYoutubeShortId(extrait.youtubeShortUrl || '');

  const handleClick = () => {
    if (extrait.youtubeShortUrl) {
      window.open(extrait.youtubeShortUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex-shrink-0 snap-start"
      style={{ width: 'calc(25% - 12px)' }} // 4 cards visibles avec gap
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={handleClick}
        className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300"
      >
        {/* Thumbnail */}
        {extrait.thumbnail ? (
          <img
            src={extrait.thumbnail}
            alt={extrait.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : videoId ? (
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={extrait.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/50 to-blue-900/50" />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Bouton Play */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: isHovered ? 1 : 0.8, scale: isHovered ? 1.1 : 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 group-hover:bg-pink-500/80 group-hover:border-pink-400 transition-all">
              <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Durée */}
        {extrait.duration && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded">
            {extrait.duration}
          </div>
        )}

        {/* Titre en bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {extrait.title}
          </h4>
          {extrait.emission && (
            <p className="text-gray-400 text-xs">
              Ep. #{extrait.emission.episodeNumber}
            </p>
          )}
        </div>

        {/* Hover effect border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500/50 rounded-2xl transition-colors" />
      </div>
    </motion.div>
  );
};

export const ShortsCarousel: React.FC<ShortsCarouselProps> = ({
  extraits,
  title = "Les meilleurs moments",
  showSeeAll = true
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Calculer le nombre de pages
  const itemsPerPage = 4;
  const totalPages = Math.ceil(extraits.length / itemsPerPage);

  // Vérifier les possibilités de scroll
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Calculer la page actuelle
      const pageWidth = clientWidth;
      const newPage = Math.round(scrollLeft / pageWidth);
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [extraits]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!extraits || extraits.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>

          <div className="flex items-center gap-4">
            {/* Boutons de navigation - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full transition-all ${
                  canScrollLeft
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-2 rounded-full transition-all ${
                  canScrollRight
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Lien "Voir tout" */}
            {showSeeAll && (
              <Link
                to="/extraits"
                className="text-sm text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1"
              >
                Voir tout
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {extraits.map((extrait, index) => (
            <ShortCard key={extrait._id} extrait={extrait} index={index} />
          ))}
        </div>

        {/* Indicateurs de pagination (dots) */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const scrollAmount = scrollContainerRef.current.clientWidth * index;
                    scrollContainerRef.current.scrollTo({
                      left: scrollAmount,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentPage === index
                    ? 'bg-pink-500 w-6'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CSS pour masquer la scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ShortsCarousel;
