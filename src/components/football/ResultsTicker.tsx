// src/components/football/ResultsTicker.tsx
// Ticker des derniers résultats - Design OCTOGOAL Premium

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRecentResults } from '../../services/apiFootball';
import { getAllActiveCompetitionIds } from '../../config/competitions';

// Clip-paths octogonaux
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';
const octagonClipCard = 'polygon(4% 0%, 96% 0%, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0% 96%, 0% 4%)';

interface Match {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
    shortName?: string;
    tla?: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName?: string;
    tla?: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
}

interface ResultsTickerProps {
  title?: string;
  showTitle?: boolean;
  maxResults?: number;
  className?: string;
}

export default function ResultsTicker({
  title = "Derniers résultats",
  showTitle = true,
  maxResults = 20,
  className = ""
}: ResultsTickerProps) {
  const [results, setResults] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const allIds = getAllActiveCompetitionIds();
        const data = await getRecentResults(allIds, 3);
        setResults(data.slice(0, maxResults));
      } catch (err) {
        console.error('Erreur chargement résultats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [maxResults]);

  // Check scroll state
  const checkScrollState = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, [results]);

  // Scroll handlers
  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 320;
    const newPosition = direction === 'left'
      ? containerRef.current.scrollLeft - scrollAmount
      : containerRef.current.scrollLeft + scrollAmount;

    containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  // Get team code
  const getTeamCode = (team: Match['homeTeam']) => {
    return team.tla || team.shortName?.substring(0, 3).toUpperCase() || team.name.substring(0, 3).toUpperCase();
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex gap-2 overflow-hidden py-3 px-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 h-16 bg-white/5 animate-pulse"
              style={{ clipPath: octagonClipCard }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Titre optionnel */}
      {showTitle && (
        <div className="flex items-center justify-between mb-3 px-4">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 bg-gradient-to-br from-pink-500 to-blue-500"
              style={{ clipPath: octagonClip }}
            >
              <Trophy className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-sm font-bold text-white">{title}</h2>
          </div>
          <Link
            to="/matchs"
            className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
          >
            Tous les matchs →
          </Link>
        </div>
      )}

      {/* Container principal */}
      <div className="relative">
        {/* Bouton gauche - toujours visible si scroll possible */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollLeft ? 1 : 0 }}
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all disabled:opacity-0 disabled:pointer-events-none"
          style={{ clipPath: octagonClip }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Gradient fade gauche */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, transparent 100%)'
          }}
        />

        {/* Ticker container - NO SCROLLBAR */}
        <div
          ref={containerRef}
          onScroll={checkScrollState}
          className="flex gap-2 px-10 py-2 overflow-x-auto"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE/Edge */
          }}
        >
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          {results.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                to={`/match/${match.id}`}
                className="block flex-shrink-0 group"
              >
                <div
                  className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] hover:from-white/[0.12] hover:to-white/[0.06] backdrop-blur-sm border border-white/10 hover:border-pink-500/30 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
                  style={{ clipPath: octagonClipCard }}
                >
                  {/* Contenu du match */}
                  <div className="flex items-center gap-2">
                    {/* Équipe domicile */}
                    <div className="flex flex-col items-center w-10">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <img
                          src={match.homeTeam.crest}
                          alt=""
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-[9px] text-gray-500 mt-0.5 font-medium tracking-wider">
                        {getTeamCode(match.homeTeam)}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center px-1.5">
                      <div className="flex items-center gap-1 text-white font-bold text-base">
                        <span className="w-4 text-center">{match.score.fullTime.home ?? 0}</span>
                        <span className="text-pink-500/50">-</span>
                        <span className="w-4 text-center">{match.score.fullTime.away ?? 0}</span>
                      </div>
                      <span
                        className="text-[8px] text-gray-500 uppercase tracking-wider px-1.5 py-0.5 bg-white/5 mt-0.5"
                        style={{ clipPath: octagonClipSubtle }}
                      >
                        terminé
                      </span>
                    </div>

                    {/* Équipe extérieur */}
                    <div className="flex flex-col items-center w-10">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <img
                          src={match.awayTeam.crest}
                          alt=""
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-[9px] text-gray-500 mt-0.5 font-medium tracking-wider">
                        {getTeamCode(match.awayTeam)}
                      </span>
                    </div>
                  </div>

                  {/* Ligne accent au hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </Link>
            </motion.div>
          ))}

          {/* CTA final */}
          <Link
            to="/matchs"
            className="flex-shrink-0 flex items-center"
          >
            <div
              className="relative bg-gradient-to-br from-pink-500/20 to-blue-500/20 hover:from-pink-500/30 hover:to-blue-500/30 border border-pink-500/20 hover:border-pink-500/40 p-3 transition-all duration-300 min-w-[100px] group"
              style={{ clipPath: octagonClipCard }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                  +{results.length}
                </span>
                <span className="text-[9px] text-gray-400 whitespace-nowrap group-hover:text-white transition-colors">
                  Voir tout
                </span>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: octagonClipCard }} />
            </div>
          </Link>
        </div>

        {/* Gradient fade droite */}
        <div
          className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, transparent 100%)'
          }}
        />

        {/* Bouton droite - toujours visible si scroll possible */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollRight ? 1 : 0 }}
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-0 disabled:pointer-events-none"
          style={{ clipPath: octagonClip }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
