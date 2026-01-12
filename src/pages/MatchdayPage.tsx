// src/pages/MatchdayPage.tsx
// Page complète d'une journée/tour de compétition avec tous les matchs

import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Trophy,
  MapPin,
} from 'lucide-react';
import {
  getMatchesByMatchday,
  getMatchesByRound,
  getStandings,
  getAllRounds,
} from '../services/apiFootball';
import { getCompetition } from '../config/competitions';

interface Match {
  id: number;
  utcDate: string;
  status: string;
  minute?: number;
  matchday: number;
  round?: string;
  homeTeam: {
    id: number;
    name: string;
    shortName?: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName?: string;
    crest: string;
  };
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
  venue?: string;
}

interface TeamStanding {
  position: number;
  team: { id: number; name: string; crest: string };
  points: number;
  playedGames: number;
}

// Calculer la saison actuelle dynamiquement
function getCurrentSeasonDisplay(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  // Si entre janvier et juillet, c'est la saison année-1 / année
  // Sinon (août-décembre), c'est la saison année / année+1
  if (month < 7) {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
  return `${year}-${String(year + 1).slice(-2)}`;
}

export default function MatchdayPage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const matchdayParam = searchParams.get('matchday');
  const roundParam = searchParams.get('round');

  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMatchday, setCurrentMatchday] = useState<number>(
    matchdayParam ? parseInt(matchdayParam) : 1
  );
  const [currentRound, setCurrentRound] = useState<string | null>(roundParam);

  const competition = leagueId ? getCompetition(parseInt(leagueId)) : null;
  const leagueIdNum = leagueId ? parseInt(leagueId) : 0;

  // Types de compétitions
  const EUROPEAN_CUPS = [2, 3, 848]; // CL, EL, ECL
  const INTERNATIONAL_TOURNAMENTS = [1, 4, 6, 9]; // World Cup, Euro, CAN, Copa America
  const isEuropeanCup = EUROPEAN_CUPS.includes(leagueIdNum);
  const isInternationalTournament = INTERNATIONAL_TOURNAMENTS.includes(leagueIdNum);

  const isCup = currentRound && !currentRound.includes('Regular Season');
  const currentSeason = getCurrentSeasonDisplay();

  // État pour les rounds disponibles (pour les tournois)
  const [availableRounds, setAvailableRounds] = useState<string[]>([]);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
  const [loadingRounds, setLoadingRounds] = useState(false);

  // Charger les rounds disponibles pour les tournois internationaux
  useEffect(() => {
    async function fetchRounds() {
      if (!leagueId || !isInternationalTournament) return;

      setLoadingRounds(true);
      try {
        const rounds = await getAllRounds(leagueId);
        console.log('[MatchdayPage] Available rounds for tournament:', rounds);
        if (rounds && rounds.length > 0) {
          setAvailableRounds(rounds);
          // Si un round est spécifié dans l'URL, le sélectionner
          if (roundParam) {
            const idx = rounds.indexOf(roundParam);
            if (idx >= 0) setSelectedRoundIndex(idx);
          }
        } else {
          console.warn('[MatchdayPage] No rounds found for tournament', leagueId);
        }
      } catch (error) {
        console.error('Error fetching rounds:', error);
      } finally {
        setLoadingRounds(false);
      }
    }

    fetchRounds();
  }, [leagueId, isInternationalTournament, roundParam]);

  useEffect(() => {
    async function fetchData() {
      if (!leagueId) return;

      setLoading(true);
      try {
        let matchesData: Match[] = [];

        if (currentRound && isCup) {
          // Round spécifique fourni via URL
          console.log('[MatchdayPage] Fetching specific round:', currentRound);
          matchesData = await getMatchesByRound(leagueId, currentRound);
        } else if (isInternationalTournament && availableRounds.length > 0) {
          // Pour les tournois internationaux, utiliser le round sélectionné
          const selectedRound = availableRounds[selectedRoundIndex];
          console.log('[MatchdayPage] Fetching international tournament round:', selectedRound);
          matchesData = await getMatchesByRound(leagueId, selectedRound);
        } else if (isEuropeanCup) {
          // Pour CL/EL/ECL, utiliser "League Phase - X"
          const europeRound = `League Phase - ${currentMatchday}`;
          console.log('[MatchdayPage] Fetching European cup round:', europeRound);
          matchesData = await getMatchesByRound(leagueId, europeRound);
        } else {
          // Pour les championnats classiques
          matchesData = await getMatchesByMatchday(leagueId, currentMatchday);
        }

        // Trier par date
        matchesData.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
        setMatches(matchesData);

        // Récupérer classement pour contexte
        const standingsData = await getStandings(leagueId).catch(() => []);
        setStandings(standingsData || []);
      } catch (error) {
        console.error('Error fetching matchday:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [leagueId, currentMatchday, currentRound, isCup, isEuropeanCup, isInternationalTournament, availableRounds, selectedRoundIndex]);

  const navigateMatchday = (direction: 'prev' | 'next') => {
    const newMatchday = direction === 'prev' ? currentMatchday - 1 : currentMatchday + 1;
    if (newMatchday >= 1 && newMatchday <= (competition?.totalMatchdays || 38)) {
      setCurrentMatchday(newMatchday);
      setSearchParams({ matchday: String(newMatchday) });
    }
  };

  // Navigation pour les tournois internationaux
  const navigateRound = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? selectedRoundIndex - 1 : selectedRoundIndex + 1;
    if (newIndex >= 0 && newIndex < availableRounds.length) {
      setSelectedRoundIndex(newIndex);
      setSearchParams({ round: availableRounds[newIndex] });
    }
  };

  // Obtenir le nom du round actuel pour l'affichage
  const getCurrentRoundName = () => {
    if (isInternationalTournament && availableRounds.length > 0) {
      return availableRounds[selectedRoundIndex] || 'Phase de groupes';
    }
    return currentRound;
  };

  // Grouper les matchs par date
  const matchesByDate = matches.reduce((acc, match) => {
    const date = new Date(match.utcDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  // Obtenir la position d'une équipe
  const getTeamPosition = (teamId: number) => {
    const standing = standings.find(s => s.team.id === teamId);
    return standing?.position;
  };

  const formatMatchTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMatchStatusDisplay = (match: Match) => {
    switch (match.status) {
      case 'FINISHED':
        return { text: 'Terminé', class: 'bg-gray-600' };
      case 'IN_PLAY':
        return { text: match.minute ? `${match.minute}'` : 'En cours', class: 'bg-red-500 animate-pulse' };
      case 'PAUSED':
        return { text: 'Mi-temps', class: 'bg-yellow-500' };
      case 'SCHEDULED':
      case 'TIMED':
        return { text: formatMatchTime(match.utcDate), class: 'bg-blue-500' };
      default:
        return { text: match.status, class: 'bg-gray-600' };
    }
  };

  if (!competition) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Compétition non trouvée</h2>
          <Link to="/classements" className="text-pink-400 hover:underline">
            Retour au football
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative pt-24 pb-6">
        <div className="max-w-5xl mx-auto px-4">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to={`/classements?league=${leagueId}`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{competition.name}</span>
            </Link>

            {/* Links to other pages */}
            <div className="flex items-center gap-3">
              <Link
                to={`/classements/scorers/${leagueId}`}
                className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
              >
                Buteurs
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                to={`/classements?league=${leagueId}`}
                className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
              >
                Classement
              </Link>
            </div>
          </div>

          {/* Title with competition badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${competition.color} flex items-center justify-center`}>
              <span className="text-2xl">{competition.flag}</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {isInternationalTournament && availableRounds.length > 0
                  ? getCurrentRoundName()
                  : isCup
                    ? currentRound
                    : isEuropeanCup
                      ? `Journée ${currentMatchday} - Phase de Ligue`
                      : `Journée ${currentMatchday}`}
              </h1>
              <p className="text-gray-400">{competition.name} {currentSeason}</p>
            </div>
          </div>

          {/* Round Navigator for International Tournaments */}
          {isInternationalTournament && (
            <div className="flex items-center justify-center gap-4 bg-gray-900/50 rounded-xl p-2 w-fit mx-auto">
              {loadingRounds ? (
                <div className="text-gray-400 px-4 py-2">
                  Chargement des tours...
                </div>
              ) : availableRounds.length > 0 ? (
                <>
                  <button
                    onClick={() => navigateRound('prev')}
                    disabled={selectedRoundIndex <= 0}
                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>

                  {/* Round selector dropdown */}
                  <select
                    value={selectedRoundIndex}
                    onChange={(e) => {
                      const idx = parseInt(e.target.value);
                      setSelectedRoundIndex(idx);
                      setSearchParams({ round: availableRounds[idx] });
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-white/10 focus:border-pink-500 focus:outline-none min-w-[200px] text-center"
                  >
                    {availableRounds.map((round, idx) => (
                      <option key={round} value={idx}>
                        {round}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => navigateRound('next')}
                    disabled={selectedRoundIndex >= availableRounds.length - 1}
                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              ) : (
                <div className="text-gray-400 px-4 py-2">
                  Aucun tour disponible pour cette compétition
                </div>
              )}
            </div>
          )}

          {/* Matchday Navigator (for leagues and European cups) */}
          {!isCup && !isInternationalTournament && (
            <div className="flex items-center justify-center gap-4 bg-gray-900/50 rounded-xl p-2 w-fit mx-auto">
              <button
                onClick={() => navigateMatchday('prev')}
                disabled={currentMatchday <= 1}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              {/* Quick matchday selector */}
              <div className="flex gap-1 overflow-x-auto scrollbar-hide px-2">
                {Array.from({ length: Math.min(competition.totalMatchdays, 15) }, (_, i) => {
                  const md = Math.max(1, currentMatchday - 7) + i;
                  if (md > competition.totalMatchdays) return null;
                  return (
                    <button
                      key={md}
                      onClick={() => {
                        setCurrentMatchday(md);
                        setSearchParams({ matchday: String(md) });
                      }}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                        md === currentMatchday
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {md}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => navigateMatchday('next')}
                disabled={currentMatchday >= competition.totalMatchdays}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-5xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-900/50 rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Aucun match trouvé</h2>
            <p className="text-gray-400">
              Les matchs de cette journée ne sont pas encore programmés.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(matchesByDate).map(([date, dateMatches]) => (
              <div key={date}>
                {/* Date header */}
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  <h2 className="text-lg font-bold text-white capitalize">{date}</h2>
                  <span className="text-gray-500 text-sm">({dateMatches.length} matchs)</span>
                </div>

                {/* Matches */}
                <div className="space-y-2">
                  {dateMatches.map((match, idx) => {
                    const status = getMatchStatusDisplay(match);
                    const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
                    const isFinished = match.status === 'FINISHED';
                    const homePos = getTeamPosition(match.homeTeam.id);
                    const awayPos = getTeamPosition(match.awayTeam.id);

                    return (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          to={`/match/${match.id}`}
                          className={`block bg-gray-900/50 hover:bg-gray-900/70 rounded-xl p-4 transition-all border ${
                            isLive
                              ? 'border-red-500/50 ring-1 ring-red-500/20'
                              : 'border-transparent hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Home Team */}
                            <div className="flex-1 flex items-center gap-3 justify-end">
                              {homePos && !isCup && (
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  homePos <= 4 ? 'bg-blue-500/20 text-blue-400' :
                                  homePos >= 18 ? 'bg-red-500/20 text-red-400' :
                                  'bg-gray-700 text-gray-400'
                                }`}>
                                  {homePos}e
                                </span>
                              )}
                              <span className="text-white font-semibold text-right truncate max-w-[150px] md:max-w-none">
                                {match.homeTeam.name}
                              </span>
                              <img
                                src={match.homeTeam.crest}
                                alt=""
                                className="w-10 h-10 object-contain flex-shrink-0"
                              />
                            </div>

                            {/* Score / Time */}
                            <div className="flex flex-col items-center min-w-[100px]">
                              {isFinished || isLive ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-white">
                                      {match.score.fullTime.home ?? 0}
                                    </span>
                                    <span className="text-gray-600">-</span>
                                    <span className="text-2xl font-black text-white">
                                      {match.score.fullTime.away ?? 0}
                                    </span>
                                  </div>
                                  <span className={`text-xs px-2 py-0.5 rounded mt-1 ${status.class} text-white`}>
                                    {status.text}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className={`text-lg font-bold px-3 py-1 rounded ${status.class} text-white`}>
                                    {status.text}
                                  </span>
                                  <span className="text-gray-500 text-xs mt-1">
                                    {new Date(match.utcDate).toLocaleDateString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                    })}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Away Team */}
                            <div className="flex-1 flex items-center gap-3">
                              <img
                                src={match.awayTeam.crest}
                                alt=""
                                className="w-10 h-10 object-contain flex-shrink-0"
                              />
                              <span className="text-white font-semibold truncate max-w-[150px] md:max-w-none">
                                {match.awayTeam.name}
                              </span>
                              {awayPos && !isCup && (
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  awayPos <= 4 ? 'bg-blue-500/20 text-blue-400' :
                                  awayPos >= 18 ? 'bg-red-500/20 text-red-400' :
                                  'bg-gray-700 text-gray-400'
                                }`}>
                                  {awayPos}e
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Match venue */}
                          {match.venue && (
                            <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-white/5">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-500 text-xs">{match.venue}</span>
                            </div>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats summary */}
        {matches.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">
                {matches.filter(m => m.status === 'FINISHED').length}
              </div>
              <div className="text-gray-400 text-sm">Terminés</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">
                {matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED').length}
              </div>
              <div className="text-gray-400 text-sm">À venir</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-pink-400">
                {matches.reduce((acc, m) => acc + (m.score.fullTime.home || 0) + (m.score.fullTime.away || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">Buts</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-blue-400">
                {(matches.reduce((acc, m) => {
                  const goals = (m.score.fullTime.home || 0) + (m.score.fullTime.away || 0);
                  return m.status === 'FINISHED' ? acc + goals : acc;
                }, 0) / Math.max(1, matches.filter(m => m.status === 'FINISHED').length)).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Buts/match</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
