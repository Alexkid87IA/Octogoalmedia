// src/components/football/ResultsTicker.tsx
// Ticker des derniers résultats - Design OCTOGOAL Premium

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRecentResults, getLiveMatches } from '../../services/apiFootball';
import { getMajorCompetitionIds } from '../../config/competitions';

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

// Helper : vérifier si un match est en cours
function isLiveMatch(status: string): boolean {
  const liveStatuses = ['IN_PLAY', 'PAUSED', 'HALFTIME', 'LIVE', '1H', '2H', 'HT', 'ET', 'BT', 'P'];
  return liveStatuses.includes(status) || status.includes('LIVE');
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
        const majorIds = getMajorCompetitionIds();

        // Récupérer les matchs EN COURS et les résultats TERMINÉS
        // 5 résultats par ligue pour avoir plus de matchs passés
        const [liveData, recentData] = await Promise.all([
          getLiveMatches().catch(() => []),
          getRecentResults(majorIds, 5),
        ]);

        // Combiner : LIVE en premier, puis TERMINÉS
        const combined = [...liveData, ...recentData].slice(0, maxResults);
        setResults(combined);
      } catch (err) {
        console.error('Erreur chargement résultats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();

    // Refresh pour les matchs live (toutes les 60 secondes)
    const interval = setInterval(fetchResults, 60000);
    return () => clearInterval(interval);
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

  // Compter les matchs live
  const liveCount = results.filter(m => isLiveMatch(m.status)).length;

  return (
    <div className={`relative ${className}`}>
      {/* Structure inline : Header | Flèche | Carousel | Flèche | CTA */}
      <div className="flex items-center">
        {/* Header avec indicateur LIVE - aligné avec les flèches */}
        <div className="flex items-center gap-2 pl-4 pr-3 py-2 border-r border-white/10 flex-shrink-0 bg-black/50">
          {/* Indicateur LIVE si matchs en cours */}
          {liveCount > 0 && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-300">
              {liveCount > 0 ? 'En direct & Résultats' : 'Résultats'}
            </span>
            {liveCount > 0 && (
              <span className="text-[8px] text-red-400">{liveCount} match{liveCount > 1 ? 's' : ''} en cours</span>
            )}
          </div>
        </div>

        {/* Bouton gauche */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="p-1.5 hover:bg-white/5 transition-colors flex-shrink-0 disabled:opacity-30"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
        </button>

        {/* Carousel des matchs */}
        <div
          ref={containerRef}
          onScroll={checkScrollState}
          className="flex gap-2 overflow-x-auto py-2 flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {results.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Link to={`/match/${match.id}`} className="block flex-shrink-0 group">
                <div
                  className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] hover:from-white/[0.12] hover:to-white/[0.06] backdrop-blur-sm border border-white/10 hover:border-pink-500/30 p-2.5 transition-all duration-300"
                  style={{ clipPath: octagonClipCard }}
                >
                  <div className="flex items-center gap-2">
                    {/* Équipe domicile */}
                    <div className="flex flex-col items-center w-9">
                      <img src={match.homeTeam.crest} alt="" className="w-5 h-5 object-contain" />
                      <span className="text-[8px] text-gray-500 mt-0.5">{getTeamCode(match.homeTeam)}</span>
                    </div>
                    {/* Score */}
                    <div className="flex flex-col items-center px-1">
                      <div className="flex items-center gap-1 text-white font-bold text-sm">
                        <span className="w-3 text-center">{match.score.fullTime.home ?? 0}</span>
                        <span className="text-pink-500/50">-</span>
                        <span className="w-3 text-center">{match.score.fullTime.away ?? 0}</span>
                      </div>
                      {isLiveMatch(match.status) ? (
                        <span className="flex items-center gap-0.5 text-[7px] px-1 py-0.5 bg-red-500/20 rounded mt-0.5">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                          </span>
                          <span className="text-red-400 font-semibold">LIVE</span>
                        </span>
                      ) : (
                        <span className="text-[7px] text-gray-500 uppercase px-1 py-0.5 bg-white/5 mt-0.5 rounded">FT</span>
                      )}
                    </div>
                    {/* Équipe extérieur */}
                    <div className="flex flex-col items-center w-9">
                      <img src={match.awayTeam.crest} alt="" className="w-5 h-5 object-contain" />
                      <span className="text-[8px] text-gray-500 mt-0.5">{getTeamCode(match.awayTeam)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bouton droite */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="p-1.5 hover:bg-white/5 transition-colors flex-shrink-0 disabled:opacity-30"
        >
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
        </button>

        {/* CTA discret */}
        <Link
          to="/matchs"
          className="flex items-center gap-1 px-3 py-1.5 mr-3 text-[10px] text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <span className="hidden sm:block">Tous les matchs</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
}
