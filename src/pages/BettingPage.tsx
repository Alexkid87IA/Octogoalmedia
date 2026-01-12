// src/pages/BettingPage.tsx
// Page dédiée aux paris et cotes Winamax

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Trophy, ArrowRight, ExternalLink, Clock, Star } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';
import { getNextFixtures } from '../services/apiFootball';
import { getOddsBySport } from '../services/oddsService';
import { MatchOdds, formatOdds, COMPETITION_TO_SPORT, SportKey } from '../types/odds.types';
import { COMPETITIONS } from '../config/competitions';

// Top 5 ligues européennes
const TOP_5_LEAGUE_IDS = [61, 39, 140, 135, 78];

interface Match {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { id: number; name: string; crest: string };
  awayTeam: { id: number; name: string; crest: string };
  competition: { id: number; name: string; emblem: string };
}

interface MatchWithOdds extends Match {
  odds?: { home: number; draw: number; away: number };
}

export default function BettingPage() {
  const [matches, setMatches] = useState<MatchWithOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const allMatches: Match[] = [];

        for (const id of TOP_5_LEAGUE_IDS) {
          try {
            const leagueMatches = await getNextFixtures(String(id), 10);
            allMatches.push(...leagueMatches);
            await new Promise(resolve => setTimeout(resolve, 150));
          } catch (err) {
            console.log(`[BettingPage] Skipping league ${id}`);
          }
        }

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

        const matchesWithOdds: MatchWithOdds[] = upcomingMatches.map(match => {
          const key = normalizeTeamName(match.homeTeam.name) + '_' + normalizeTeamName(match.awayTeam.name);
          let foundOdds = oddsMap.get(key)?.odds.winamax;

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
            odds: foundOdds ? { home: foundOdds.home, draw: foundOdds.draw, away: foundOdds.away } : undefined,
          };
        });

        const sorted = matchesWithOdds
          .filter(m => m.odds)
          .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

        setMatches(sorted);
      } catch (error) {
        console.error('[BettingPage] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredMatches = selectedLeague
    ? matches.filter(m => m.competition?.id === selectedLeague)
    : matches;

  // Grouper par jour
  const groupedByDay = filteredMatches.reduce((acc, match) => {
    const day = new Date(match.utcDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(match);
    return acc;
  }, {} as Record<string, MatchWithOdds[]>);

  return (
    <>
      <SEO
        title="Paris et Cotes Winamax | Octogoal"
        description="Retrouvez toutes les cotes Winamax pour les prochains matchs des grands championnats européens."
      />

      <div className="min-h-screen bg-black pt-24">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />
          <div className="relative container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/images/winamax-logo.png"
                alt="Winamax"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Paris & Cotes
                </h1>
                <p className="text-gray-400">Cotes fournies par Winamax</p>
              </div>
            </div>

            {/* Filtres par ligue */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLeague(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLeague === null
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Tous
              </button>
              {TOP_5_LEAGUE_IDS.map(id => {
                const comp = COMPETITIONS[id];
                if (!comp) return null;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedLeague(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedLeague === id
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span>{comp.flag}</span>
                    <span>{comp.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="container mx-auto px-4 pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent" />
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucun match avec cotes disponible pour le moment</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedByDay).map(([day, dayMatches]) => (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-white capitalize">{day}</h2>
                    <span className="text-sm text-gray-500">({dayMatches.length} matchs)</span>
                  </div>

                  <div className="grid gap-3">
                    {dayMatches.map((match) => (
                      <MatchOddsRow key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-16 p-6 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-start gap-4">
              <img
                src="/images/winamax-logo.png"
                alt="Winamax"
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-white mb-2">Partenariat Winamax</h3>
                <p className="text-sm text-gray-400">
                  Les cotes affichées sont fournies par Winamax et sont susceptibles de varier.
                  Jeu responsable : ne misez que ce que vous pouvez vous permettre de perdre.
                </p>
                <a
                  href="https://www.winamax.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <span>Parier sur Winamax</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

// Ligne de match avec cotes
function MatchOddsRow({ match }: { match: MatchWithOdds }) {
  const matchDate = new Date(match.utcDate);
  const timeStr = matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const comp = COMPETITIONS[match.competition?.id];

  const minOdds = match.odds ? Math.min(match.odds.home, match.odds.draw, match.odds.away) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] hover:bg-white/[0.06] rounded-lg p-4 transition-all border border-white/5 hover:border-white/10"
    >
      <div className="flex items-center gap-4">
        {/* Heure et compétition */}
        <div className="flex flex-col items-center w-16 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Clock className="w-3 h-3" />
            <span>{timeStr}</span>
          </div>
          {comp && (
            <span className="text-[10px] text-gray-600">{comp.shortName}</span>
          )}
        </div>

        {/* Équipes */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {/* Domicile */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img src={match.homeTeam.crest} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
              <span className="text-sm text-white truncate">{match.homeTeam.name}</span>
            </div>

            {/* VS avec logo Winamax */}
            <div className="flex flex-col items-center flex-shrink-0 px-2">
              <img
                src="/images/winamax-logo.png"
                alt="Winamax"
                className="w-4 h-4 object-contain opacity-60 mb-0.5"
              />
              <span className="text-[10px] text-gray-600">vs</span>
            </div>

            {/* Extérieur */}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span className="text-sm text-white truncate text-right">{match.awayTeam.name}</span>
              <img src={match.awayTeam.crest} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Cotes */}
        {match.odds && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <OddsButton label="1" value={match.odds.home} isMin={match.odds.home === minOdds} />
            <OddsButton label="N" value={match.odds.draw} isMin={match.odds.draw === minOdds} />
            <OddsButton label="2" value={match.odds.away} isMin={match.odds.away === minOdds} />
          </div>
        )}

        {/* Lien vers détails */}
        <Link
          to={`/match/${match.id}`}
          className="p-2 hover:bg-white/10 rounded transition-colors flex-shrink-0"
        >
          <ArrowRight className="w-4 h-4 text-gray-500" />
        </Link>
      </div>
    </motion.div>
  );
}

// Bouton de cote
function OddsButton({ label, value, isMin }: { label: string; value: number; isMin: boolean }) {
  return (
    <div className={`flex flex-col items-center px-3 py-2 rounded ${
      isMin ? 'bg-green-500/20' : 'bg-white/5'
    }`}>
      <span className="text-[9px] text-gray-500 mb-0.5">{label}</span>
      <span className={`text-sm font-bold ${isMin ? 'text-green-400' : 'text-white'}`}>
        {formatOdds(value)}
      </span>
    </div>
  );
}

function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}
