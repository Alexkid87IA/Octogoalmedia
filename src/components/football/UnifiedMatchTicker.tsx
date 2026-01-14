// src/components/football/UnifiedMatchTicker.tsx
// Ticker unifié : LIVE (compétitions majeures) ou À venir avec cotes Winamax

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLiveMatches, getNextFixtures } from '../../services/apiFootball';
import { getOddsBySport } from '../../services/oddsService';
import { MatchOdds, formatOdds, COMPETITION_TO_SPORT, SportKey } from '../../types/odds.types';
import { getMajorCompetitionIds } from '../../config/competitions';

// IDs des compétitions majeures pour filtrer les LIVE
const MAJOR_COMPETITION_IDS = getMajorCompetitionIds();

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

interface MatchWithOdds extends Match {
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
}

// Vérifier si un match est en cours
function isLiveMatch(status: string): boolean {
  const liveStatuses = ['IN_PLAY', 'PAUSED', 'HALFTIME', 'LIVE', '1H', '2H', 'HT', 'ET', 'BT', 'P'];
  return liveStatuses.includes(status) || status.includes('LIVE');
}

// Vérifier si un match est à venir
function isUpcomingMatch(status: string): boolean {
  return status === 'SCHEDULED' || status === 'TIMED';
}

// Normaliser les noms d'équipe pour le matching des cotes
function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export default function UnifiedMatchTicker() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchWithOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);

        // 1. Récupérer les matchs LIVE et filtrer par compétitions majeures
        const liveData = await getLiveMatches().catch(() => []);
        const majorLiveMatches = liveData.filter((m: Match) =>
          isLiveMatch(m.status) && MAJOR_COMPETITION_IDS.includes(m.competition?.id)
        );
        setLiveMatches(majorLiveMatches.slice(0, 10));

        // 2. Récupérer les matchs à venir avec cotes Winamax
        const TOP_5_LEAGUES = [61, 39, 140, 135, 78]; // L1, PL, Liga, Serie A, Bundesliga
        const allUpcoming: Match[] = [];

        for (const leagueId of TOP_5_LEAGUES) {
          try {
            const fixtures = await getNextFixtures(String(leagueId), 3);
            allUpcoming.push(...fixtures);
            await new Promise(resolve => setTimeout(resolve, 100)); // Délai anti rate-limit
          } catch (err) {
            console.log(`[UnifiedTicker] Skipping league ${leagueId}`);
          }
        }

        const upcoming = allUpcoming.filter((m: Match) => isUpcomingMatch(m.status));

        // Récupérer les cotes Winamax
        const sportsToFetch = new Set<SportKey>();
        upcoming.forEach((m: Match) => {
          const sport = COMPETITION_TO_SPORT[m.competition?.id];
          if (sport) sportsToFetch.add(sport);
        });

        const oddsMap = new Map<string, MatchOdds>();
        await Promise.all(
          Array.from(sportsToFetch).map(async (sport) => {
            const odds = await getOddsBySport(sport);
            odds.forEach(o => {
              const key = normalizeTeamName(o.homeTeam) + '_' + normalizeTeamName(o.awayTeam);
              oddsMap.set(key, o);
            });
          })
        );

        // Associer les cotes aux matchs
        const matchesWithOdds: MatchWithOdds[] = upcoming.map((match: Match) => {
          const key = normalizeTeamName(match.homeTeam.name) + '_' + normalizeTeamName(match.awayTeam.name);
          const oddsData = oddsMap.get(key);

          let foundOdds = oddsData?.odds.winamax;
          if (!foundOdds) {
            for (const [k, v] of oddsMap.entries()) {
              if (k.includes(normalizeTeamName(match.homeTeam.name)) &&
                  k.includes(normalizeTeamName(match.awayTeam.name))) {
                foundOdds = v.odds.winamax;
                break;
              }
            }
          }

          return {
            ...match,
            odds: foundOdds ? {
              home: foundOdds.home,
              draw: foundOdds.draw,
              away: foundOdds.away,
            } : undefined,
          };
        });

        // Trier par date et prendre les 15 premiers
        const sortedMatches = matchesWithOdds
          .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
          .slice(0, 15);

        setUpcomingMatches(sortedMatches);
      } catch (err) {
        console.error('[UnifiedMatchTicker] Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
    const interval = setInterval(fetchMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  const hasLiveMatches = liveMatches.length > 0;
  const hasUpcomingMatches = upcomingMatches.length > 0;

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
  }, [liveMatches, upcomingMatches]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 300;
    const newPosition = direction === 'left'
      ? containerRef.current.scrollLeft - scrollAmount
      : containerRef.current.scrollLeft + scrollAmount;
    containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  const getTeamCode = (team: Match['homeTeam']) => {
    return team.tla || team.shortName?.substring(0, 3).toUpperCase() || team.name.substring(0, 3).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border-b border-white/5">
        <div className="flex gap-3 overflow-hidden py-3 px-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32 h-14 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasLiveMatches && !hasUpcomingMatches) return null;

  const totalMatches = liveMatches.length + upcomingMatches.length;

  return (
    <div className="relative bg-black/90 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center">
        {/* Bouton gauche */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="p-1 sm:p-2 hover:bg-white/5 transition-colors flex-shrink-0 disabled:opacity-30"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
        </button>

        {/* Carousel des matchs */}
        <div
          ref={containerRef}
          onScroll={checkScrollState}
          className="flex gap-2 overflow-x-auto py-2 flex-1 items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {/* Matchs LIVE */}
          {liveMatches.map((match, index) => (
            <LiveMatchCard key={match.id} match={match} index={index} getTeamCode={getTeamCode} />
          ))}

          {/* Matchs à venir avec cotes */}
          {upcomingMatches.map((match, index) => (
            <OddsMatchCard key={match.id} match={match} index={index} getTeamCode={getTeamCode} />
          ))}
        </div>

        {/* Bouton droite */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="p-1 sm:p-2 hover:bg-white/5 transition-colors flex-shrink-0 disabled:opacity-30"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
        </button>

        {/* CTA */}
        <Link
          to="/matchs"
          className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 sm:py-2 mr-1 sm:mr-2 hover:bg-white/5 rounded transition-colors flex-shrink-0"
        >
          <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-pink-500/20 text-pink-400 text-[9px] sm:text-[10px] font-bold rounded">
            {totalMatches}
          </span>
          <span className="text-[11px] text-gray-400 hidden sm:block">
            Voir tous les matchs
          </span>
          <ChevronRight className="w-3 h-3 text-gray-500 sm:hidden" />
        </Link>

        {/* Mention légale pour les cotes */}
        {hasUpcomingMatches && (
          <div className="relative group pr-3 flex-shrink-0 hidden sm:block">
            <span className="text-[9px] text-gray-600 cursor-help border-b border-dotted border-gray-600">
              (i)
            </span>
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 border border-white/10 rounded text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Cotes à titre indicatif. Jouer comporte des risques : endettement, isolement, dépendance.
              <br />
              <span className="text-gray-500">Appelez le 09 74 75 13 13</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Carte pour match LIVE
function LiveMatchCard({
  match,
  index,
  getTeamCode
}: {
  match: Match;
  index: number;
  getTeamCode: (team: Match['homeTeam']) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <Link to={`/match/${match.id}`} className="block flex-shrink-0 group">
        <div className="relative bg-white/[0.04] hover:bg-white/[0.08] rounded-lg px-3 py-2 transition-all duration-200 border border-red-500/30 hover:border-red-500/50 overflow-hidden w-[130px] sm:w-[160px]">
          {/* Score centré en haut */}
          <div className="flex items-center justify-center gap-2 text-white font-bold text-base sm:text-lg mb-1">
            <span>{match.score.fullTime.home ?? 0}</span>
            <span className="text-gray-500 text-sm">-</span>
            <span>{match.score.fullTime.away ?? 0}</span>
          </div>

          {/* Équipes en dessous */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <img src={match.homeTeam.crest} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
              <span className="text-[9px] text-white font-medium truncate">{getTeamCode(match.homeTeam)}</span>
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-0 justify-end">
              <span className="text-[9px] text-white font-medium truncate">{getTeamCode(match.awayTeam)}</span>
              <img src={match.awayTeam.crest} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
            </div>
          </div>

          {/* Badge LIVE */}
          <div className="flex justify-center mt-1.5">
            <span className="flex items-center gap-1 text-[7px] px-2 py-0.5 bg-red-500/20 rounded">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              <span className="text-red-400 font-semibold">LIVE</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Carte pour match à venir avec cotes Winamax
function OddsMatchCard({
  match,
  index,
  getTeamCode
}: {
  match: MatchWithOdds;
  index: number;
  getTeamCode: (team: Match['homeTeam']) => string;
}) {
  const matchDate = new Date(match.utcDate);
  const isToday = new Date().toDateString() === matchDate.toDateString();
  const isTomorrow = new Date(Date.now() + 86400000).toDateString() === matchDate.toDateString();
  const timeStr = matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const dateLabel = isToday ? `Auj. ${timeStr}` : isTomorrow ? `Dem. ${timeStr}` :
    matchDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ` ${timeStr}`;

  // Trouver le favori (cote la plus basse)
  const minOdds = match.odds ? Math.min(match.odds.home, match.odds.draw, match.odds.away) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <Link to={`/match/${match.id}`} className="block flex-shrink-0 group">
        <div className="relative bg-white/[0.04] hover:bg-white/[0.08] rounded-lg px-3 py-2 transition-all duration-200 border border-transparent hover:border-white/10 overflow-hidden w-[130px] sm:w-[160px]">
          {/* Date */}
          <div className="text-[8px] sm:text-[10px] text-gray-400 text-center mb-1">{dateLabel}</div>

          {/* Équipes */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
            {/* Équipe domicile */}
            <div className="flex items-center gap-1">
              <img src={match.homeTeam.crest} alt="" className="w-4 h-4 sm:w-6 sm:h-6 object-contain" />
              <span className="text-[9px] sm:text-[11px] text-white font-semibold">{getTeamCode(match.homeTeam)}</span>
            </div>

            {/* Séparateur */}
            <span className="text-[9px] sm:text-[10px] text-gray-500">-</span>

            {/* Équipe extérieur */}
            <div className="flex items-center gap-1">
              <span className="text-[9px] sm:text-[11px] text-white font-semibold">{getTeamCode(match.awayTeam)}</span>
              <img src={match.awayTeam.crest} alt="" className="w-4 h-4 sm:w-6 sm:h-6 object-contain" />
            </div>
          </div>

          {/* Cotes Winamax */}
          {match.odds ? (
            <div className="flex items-center justify-between gap-0.5">
              <OddsPill label="1" value={match.odds.home} isMin={match.odds.home === minOdds} />
              <OddsPill label="N" value={match.odds.draw} isMin={match.odds.draw === minOdds} />
              <OddsPill label="2" value={match.odds.away} isMin={match.odds.away === minOdds} />
            </div>
          ) : (
            <div className="text-[8px] sm:text-[10px] text-gray-500 text-center">Cotes bientôt</div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// Pilule de cote
function OddsPill({ label, value, isMin }: { label: string; value: number; isMin: boolean }) {
  return (
    <div className={`flex-1 text-center py-0.5 sm:py-1 rounded-sm transition-colors ${
      isMin
        ? 'bg-green-500/20 text-green-400'
        : 'bg-white/5 text-gray-400 hover:bg-white/10'
    }`}>
      <span className="text-[7px] sm:text-[9px] text-gray-500 block">{label}</span>
      <span className="text-[9px] sm:text-xs font-bold">{formatOdds(value)}</span>
    </div>
  );
}
