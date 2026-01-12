// src/components/football/UpcomingOddsTicker.tsx
// Ticker compact des prochains matchs avec cotes Winamax

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getNextFixtures } from '../../services/apiFootball';
import { getOddsBySport } from '../../services/oddsService';
import { MatchOdds, formatOdds, COMPETITION_TO_SPORT, SportKey } from '../../types/odds.types';

// Seulement les 5 grands championnats pour éviter le rate limiting API-Football
const TOP_5_LEAGUE_IDS = [61, 39, 140, 135, 78]; // L1, PL, Liga, Serie A, Bundesliga

interface Match {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
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

export default function UpcomingOddsTicker() {
  const [matches, setMatches] = useState<MatchWithOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMatchesWithOdds() {
      try {
        setLoading(true);

        // Récupérer les prochains matchs des 5 grands championnats SÉQUENTIELLEMENT
        const allMatches: Match[] = [];
        for (const id of TOP_5_LEAGUE_IDS) {
          try {
            const matches = await getNextFixtures(String(id), 5);
            allMatches.push(...matches);
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (err) {
            console.log(`[UpcomingOddsTicker] Skipping league ${id}:`, err);
          }
        }

        // Filtrer pour garder seulement les matchs programmés
        const upcomingMatches = allMatches.filter(m =>
          m.status === 'SCHEDULED' || m.status === 'TIMED'
        );

        // Récupérer les cotes
        const sportsToFetch = new Set<SportKey>();
        upcomingMatches.forEach(m => {
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
        const matchesWithOdds: MatchWithOdds[] = upcomingMatches.map(match => {
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

        // Garder seulement les matchs avec cotes, triés par date
        const matchesWithValidOdds = matchesWithOdds
          .filter(m => m.odds)
          .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
          .slice(0, 20);

        setMatches(matchesWithValidOdds);
      } catch (error) {
        console.error('[UpcomingOddsTicker] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatchesWithOdds();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading || matches.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-black/90 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center">
        {/* Header avec branding Winamax visible */}
        <div className="flex items-center gap-2 pl-4 pr-3 py-2 border-r border-white/10 flex-shrink-0 bg-black/50">
          <img
            src="/images/winamax-logo.png"
            alt="Winamax"
            className="w-5 h-5 rounded object-contain"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#ED1C24' }}>
              Cotes Winamax
            </span>
            <span className="text-[8px] text-gray-500">Matchs à venir</span>
          </div>
        </div>

        {/* Navigation gauche */}
        <button
          onClick={() => scroll('left')}
          className="p-1.5 hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
        </button>

        {/* Carousel des matchs */}
        <div
          ref={scrollRef}
          className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1.5 flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {matches.map((match) => (
            <CompactMatchCard key={match.id} match={match} />
          ))}
        </div>

        {/* Navigation droite */}
        <button
          onClick={() => scroll('right')}
          className="p-1.5 hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
        </button>

        {/* CTA discret vers page des paris */}
        <Link
          to="/paris"
          className="flex items-center gap-1 px-3 py-1.5 text-[10px] text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <span className="hidden sm:block">Tous les paris</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        {/* Mention légale discrète avec tooltip */}
        <div className="relative group pr-3 flex-shrink-0">
          <span className="text-[9px] text-gray-600 cursor-help border-b border-dotted border-gray-600">
            (i)
          </span>
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 border border-white/10 rounded text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Cotes à titre indicatif. Jouer comporte des risques : endettement, isolement, dépendance.
            <br />
            <span className="text-gray-500">Appelez le 09 74 75 13 13</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Carte de match ultra-compacte
function CompactMatchCard({ match }: { match: MatchWithOdds }) {
  const matchDate = new Date(match.utcDate);
  const isToday = new Date().toDateString() === matchDate.toDateString();
  const isTomorrow = new Date(Date.now() + 86400000).toDateString() === matchDate.toDateString();

  const timeStr = matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const dateLabel = isToday ? `Auj. ${timeStr}` : isTomorrow ? `Dem. ${timeStr}` :
    matchDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  // Trouver le favori (cote la plus basse)
  const minOdds = match.odds ? Math.min(match.odds.home, match.odds.draw, match.odds.away) : 0;

  return (
    <Link to={`/match/${match.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
        className="flex-shrink-0 w-[140px] bg-white/[0.03] hover:bg-white/[0.06] rounded px-2 py-1.5 transition-all border border-transparent hover:border-white/10"
      >
        {/* Date */}
        <div className="text-[8px] text-gray-500 text-center mb-1">{dateLabel}</div>

        {/* Équipes avec logos et Winamax au centre */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          {/* Équipe domicile */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <img src={match.homeTeam.crest} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
            <span className="text-[9px] text-white truncate">{getShortName(match.homeTeam.name)}</span>
          </div>

          {/* Logo Winamax central */}
          <div className="flex flex-col items-center flex-shrink-0 px-1">
            <img
              src="/images/winamax-logo.png"
              alt="Winamax"
              className="w-3 h-3 object-contain opacity-70"
            />
            <span className="text-[7px] text-gray-600">vs</span>
          </div>

          {/* Équipe extérieur */}
          <div className="flex items-center gap-1 flex-1 min-w-0 justify-end">
            <span className="text-[9px] text-white truncate">{getShortName(match.awayTeam.name)}</span>
            <img src={match.awayTeam.crest} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
          </div>
        </div>

        {/* Cotes - version compacte */}
        {match.odds && (
          <div className="flex items-center justify-between gap-0.5">
            <OddsPill value={match.odds.home} isMin={match.odds.home === minOdds} />
            <OddsPill value={match.odds.draw} isMin={match.odds.draw === minOdds} />
            <OddsPill value={match.odds.away} isMin={match.odds.away === minOdds} />
          </div>
        )}
      </motion.div>
    </Link>
  );
}

// Pilule de cote compacte
function OddsPill({ value, isMin }: { value: number; isMin: boolean }) {
  return (
    <div className={`flex-1 text-center py-0.5 rounded-sm text-[9px] font-bold ${
      isMin
        ? 'bg-green-500/20 text-green-400'
        : 'bg-white/5 text-gray-400'
    }`}>
      {formatOdds(value)}
    </div>
  );
}

// Obtenir le nom court d'une équipe (3-4 lettres max)
function getShortName(name: string): string {
  // Cas spéciaux connus
  const shortcuts: Record<string, string> = {
    'Paris Saint Germain': 'PSG',
    'Paris Saint-Germain': 'PSG',
    'Olympique Marseille': 'OM',
    'Olympique de Marseille': 'OM',
    'Olympique Lyon': 'OL',
    'Olympique Lyonnais': 'OL',
    'Manchester United': 'MUN',
    'Manchester City': 'MCI',
    'Real Madrid': 'RMA',
    'FC Barcelona': 'BAR',
    'Barcelona': 'BAR',
    'Atletico Madrid': 'ATM',
    'Bayern Munich': 'BAY',
    'Bayern München': 'BAY',
    'Borussia Dortmund': 'BVB',
    'Juventus': 'JUV',
    'Inter Milan': 'INT',
    'AC Milan': 'MIL',
    'AS Monaco': 'ASM',
    'AS Roma': 'ROM',
    'Napoli': 'NAP',
    'Liverpool': 'LIV',
    'Chelsea': 'CHE',
    'Arsenal': 'ARS',
    'Tottenham': 'TOT',
  };

  if (shortcuts[name]) return shortcuts[name];

  // Sinon, prendre les 3 premières lettres
  return name.slice(0, 3).toUpperCase();
}

// Normaliser les noms d'équipe pour le matching
function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}
