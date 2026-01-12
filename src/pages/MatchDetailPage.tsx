// src/pages/MatchDetailPage.tsx
// Page de détail match enrichie avec sidebar

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Users,
  BarChart3,
  History,
  TrendingUp,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  getMatchDetails,
  getMatchEvents,
  getMatchStats,
  getMatchLineups,
  getHeadToHead,
  getStandings,
  getTopScorers,
  getTeamLastResults,
  getMatchesByMatchday,
  getMatchesByRound,
  formatDateFR,
} from '../services/apiFootball';
import { getCompetition } from '../config/competitions';
import OddsWidget from '../components/football/OddsWidget';

// =============================================
// TYPES
// =============================================

interface Match {
  id: number;
  matchday: number;
  round?: string; // Tour complet pour les coupes (ex: "Round of 32")
  utcDate: string;
  status: string;
  minute?: number;
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
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  venue?: string;
  referee?: string;
}

interface TeamStanding {
  position: number;
  team: { id: number; name: string; crest: string };
  points: number;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

interface Scorer {
  player: { id: number; name: string };
  team: { id: number; name: string; crest: string };
  goals: number;
  assists: number;
}

type TabType = 'events' | 'stats' | 'lineups' | 'h2h';

// =============================================
// COMPOSANTS UTILITAIRES
// =============================================

// Barre de stat comparative
const StatBar = ({ label, homeValue, awayValue, isPercentage = false }: {
  label: string;
  homeValue: number;
  awayValue: number;
  isPercentage?: boolean;
}) => {
  const total = homeValue + awayValue || 1;
  const homePercent = (homeValue / total) * 100;
  const awayPercent = (awayValue / total) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white font-bold">{homeValue}{isPercentage ? '%' : ''}</span>
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">{awayValue}{isPercentage ? '%' : ''}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${homePercent}%` }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-pink-500 to-pink-400"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${awayPercent}%` }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-l from-blue-500 to-blue-400"
        />
      </div>
    </div>
  );
};

// Icône d'événement
const EventIcon = ({ type, detail }: { type: string; detail: string }) => {
  switch (type) {
    case 'Goal':
      return <span className="text-2xl">⚽</span>;
    case 'Card':
      if (detail === 'Red Card') return <span className="text-2xl">🟥</span>;
      if (detail === 'Second Yellow card') return <span className="text-2xl">🟨🟥</span>;
      return <span className="text-2xl">🟨</span>;
    case 'subst':
      return <span className="text-2xl">🔄</span>;
    case 'Var':
      return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">VAR</span>;
    default:
      return <span className="text-2xl">📋</span>;
  }
};

// Indicateur de forme (W/D/L)
const FormBadge = ({ result }: { result: 'W' | 'D' | 'L' }) => {
  const styles = {
    W: 'bg-green-500 text-white',
    D: 'bg-gray-500 text-white',
    L: 'bg-red-500 text-white',
  };
  const labels = { W: 'V', D: 'N', L: 'D' };

  return (
    <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${styles[result]}`}>
      {labels[result]}
    </span>
  );
};

// =============================================
// COMPOSANTS SIDEBAR
// =============================================

// Mini classement
const MiniStandings = ({ standings, homeTeamId, awayTeamId, competitionId }: {
  standings: TeamStanding[];
  homeTeamId: number;
  awayTeamId: number;
  competitionId: number;
}) => {
  if (standings.length === 0) return null;

  // Trouver les positions des 2 équipes
  const homePos = standings.findIndex(s => s.team.id === homeTeamId);
  const awayPos = standings.findIndex(s => s.team.id === awayTeamId);

  // Afficher un extrait autour des équipes (5 équipes)
  const minPos = Math.max(0, Math.min(homePos, awayPos) - 2);
  const displayStandings = standings.slice(minPos, minPos + 7);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-white font-bold text-sm">Classement</span>
        </div>
        <Link to={`/classements?league=${competitionId}`} className="text-xs text-pink-400 hover:text-pink-300">
          Voir tout →
        </Link>
      </div>
      <div className="p-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500">
              <th className="py-1 px-2 text-left">#</th>
              <th className="py-1 px-2 text-left">Équipe</th>
              <th className="py-1 px-2 text-center">MJ</th>
              <th className="py-1 px-2 text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {displayStandings.map((team) => {
              const isHighlighted = team.team.id === homeTeamId || team.team.id === awayTeamId;
              const isHome = team.team.id === homeTeamId;
              const isAway = team.team.id === awayTeamId;

              return (
                <tr
                  key={team.team.id}
                  className={`border-t border-white/5 ${
                    isHighlighted ? (isHome ? 'bg-pink-500/10' : 'bg-blue-500/10') : ''
                  }`}
                >
                  <td className="py-2 px-2">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold ${
                      team.position <= 4 ? 'bg-blue-500/30 text-blue-400' :
                      team.position >= standings.length - 2 ? 'bg-red-500/30 text-red-400' :
                      'text-gray-400'
                    }`}>
                      {team.position}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <Link to={`/classements/club/${team.team.id}`} className="flex items-center gap-2 hover:text-pink-400">
                      <img src={team.team.crest} alt="" className="w-4 h-4 object-contain" />
                      <span className={`truncate max-w-[80px] ${isHighlighted ? 'text-white font-bold' : 'text-gray-300'}`}>
                        {team.team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-2 text-center text-gray-400">{team.playedGames}</td>
                  <td className="py-2 px-2 text-center text-white font-bold">{team.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Top buteurs et passeurs
const TopScorersSidebar = ({ scorers, competitionId }: { scorers: Scorer[]; competitionId: number }) => {
  const [showAssists, setShowAssists] = useState(false);

  if (scorers.length === 0) return null;

  // Trier par passes décisives pour l'onglet passeurs
  const topAssisters = [...scorers]
    .filter(s => s.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 5);

  const displayList = showAssists ? topAssisters : scorers.slice(0, 5);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{showAssists ? '🎯' : '⚽'}</span>
          <span className="text-white font-bold text-sm">{showAssists ? 'Meilleurs passeurs' : 'Meilleurs buteurs'}</span>
        </div>
        <Link to={`/classements?league=${competitionId}`} className="text-xs text-pink-400 hover:text-pink-300">
          Voir tout →
        </Link>
      </div>

      {/* Toggle buteurs/passeurs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setShowAssists(false)}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            !showAssists ? 'text-pink-400 bg-pink-500/10 border-b-2 border-pink-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          ⚽ Buteurs
        </button>
        <button
          onClick={() => setShowAssists(true)}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            showAssists ? 'text-blue-400 bg-blue-500/10 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          🎯 Passeurs
        </button>
      </div>

      <div className="p-3 space-y-2">
        {displayList.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">Aucune donnée disponible</p>
        ) : (
          displayList.map((scorer, idx) => (
            <Link
              key={scorer.player.id}
              to={`/player/${scorer.player.id}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                idx === 0 ? 'bg-yellow-500/30 text-yellow-400' :
                idx === 1 ? 'bg-gray-400/30 text-gray-300' :
                idx === 2 ? 'bg-amber-600/30 text-amber-500' :
                'bg-gray-800 text-gray-500'
              }`}>
                {idx + 1}
              </span>
              <img src={scorer.team.crest} alt="" className="w-4 h-4 object-contain" />
              <span className="text-gray-300 text-sm flex-1 truncate">{scorer.player.name}</span>
              <span className={`font-bold text-sm ${showAssists ? 'text-blue-400' : 'text-pink-400'}`}>
                {showAssists ? scorer.assists : scorer.goals}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

// Forme des équipes
const TeamFormSidebar = ({ homeForm, awayForm, homeTeam, awayTeam }: {
  homeForm: ('W' | 'D' | 'L')[];
  awayForm: ('W' | 'D' | 'L')[];
  homeTeam: Match['homeTeam'];
  awayTeam: Match['awayTeam'];
}) => {
  if (homeForm.length === 0 && awayForm.length === 0) return null;

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span className="text-white font-bold text-sm">Forme récente</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Home team form */}
        <div className="flex items-center gap-3">
          <img src={homeTeam.crest} alt="" className="w-6 h-6 object-contain" />
          <div className="flex gap-1">
            {homeForm.slice(0, 5).map((result, idx) => (
              <FormBadge key={idx} result={result} />
            ))}
          </div>
        </div>
        {/* Away team form */}
        <div className="flex items-center gap-3">
          <img src={awayTeam.crest} alt="" className="w-6 h-6 object-contain" />
          <div className="flex gap-1">
            {awayForm.slice(0, 5).map((result, idx) => (
              <FormBadge key={idx} result={result} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Autres matchs de la journée/du tour
const OtherMatchesSidebar = ({ matches, currentMatchId, round, competitionId, matchday }: {
  matches: Match[];
  currentMatchId: number;
  round?: string;
  competitionId?: number;
  matchday?: number;
}) => {
  const otherMatches = matches.filter(m => m.id !== currentMatchId).slice(0, 6);
  const totalOtherMatches = matches.filter(m => m.id !== currentMatchId).length;

  if (otherMatches.length === 0) return null;

  // Déterminer le type de compétition
  const isRegularLeague = round?.includes('Regular Season');
  const isLeaguePhase = round?.includes('League Phase') || round?.includes('League Stage');
  const isCupKnockout = round && !isRegularLeague && !isLeaguePhase;

  // Titre adapté
  let title = 'Autres matchs';
  if (isCupKnockout) {
    title = round || 'Tour de coupe';
  } else if (isLeaguePhase) {
    // Extraire le numéro de la journée de "League Phase - 3"
    const matchNum = round?.match(/\d+/)?.[0];
    title = matchNum ? `Journée ${matchNum} - Phase de Ligue` : round || 'Phase de Ligue';
  } else if (isRegularLeague) {
    title = `Journée ${matchday}`;
  }

  // Construire le lien vers la page complète de la journée
  const matchdayLink = competitionId
    ? (isCupKnockout || isLeaguePhase) && round
      ? `/classements/matchday/${competitionId}?round=${encodeURIComponent(round)}`
      : `/classements/matchday/${competitionId}?matchday=${matchday}`
    : null;

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCupKnockout ? (
            <Trophy className="w-4 h-4 text-yellow-500" />
          ) : (
            <Calendar className="w-4 h-4 text-blue-500" />
          )}
          <span className="text-white font-bold text-sm truncate">{title}</span>
        </div>
        {totalOtherMatches > 6 && (
          <span className="text-xs text-gray-500">+{totalOtherMatches - 6}</span>
        )}
      </div>
      <div className="p-2 space-y-1">
        {otherMatches.map((m) => (
          <Link
            key={m.id}
            to={`/match/${m.id}`}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-xs"
          >
            <img src={m.homeTeam.crest} alt="" className="w-4 h-4 object-contain" />
            <span className="text-gray-400 flex-1 truncate">{m.homeTeam.shortName || m.homeTeam.name.substring(0, 3)}</span>
            <span className={`font-bold ${
              m.status === 'IN_PLAY' ? 'text-red-400' :
              m.status === 'FINISHED' ? 'text-white' : 'text-gray-500'
            }`}>
              {m.status === 'FINISHED' || m.status === 'IN_PLAY'
                ? `${m.score.fullTime.home ?? 0}-${m.score.fullTime.away ?? 0}`
                : 'vs'}
            </span>
            <span className="text-gray-400 flex-1 truncate text-right">{m.awayTeam.shortName || m.awayTeam.name.substring(0, 3)}</span>
            <img src={m.awayTeam.crest} alt="" className="w-4 h-4 object-contain" />
          </Link>
        ))}

        {/* Lien vers la page complète */}
        {matchdayLink && (
          <Link
            to={matchdayLink}
            className="block text-center py-2 mt-2 text-xs text-pink-400 hover:text-pink-300 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isCupKnockout ? 'Voir tous les matchs du tour →' : 'Voir la journée complète →'}
          </Link>
        )}
      </div>
    </div>
  );
};

// =============================================
// COMPOSANT PRINCIPAL
// =============================================

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();

  // États données principales
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [lineups, setLineups] = useState<any>(null);
  const [h2h, setH2H] = useState<Match[]>([]);

  // États sidebar
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [homeForm, setHomeForm] = useState<('W' | 'D' | 'L')[]>([]);
  const [awayForm, setAwayForm] = useState<('W' | 'D' | 'L')[]>([]);
  const [matchdayMatches, setMatchdayMatches] = useState<Match[]>([]);

  // États UI
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatchData() {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const fixtureId = parseInt(id);

        // Appels principaux en parallèle
        const [matchData, eventsData, statsData, lineupsData] = await Promise.all([
          getMatchDetails(fixtureId),
          getMatchEvents(fixtureId),
          getMatchStats(fixtureId),
          getMatchLineups(fixtureId),
        ]);

        if (!matchData) {
          setError('Match non trouvé');
          setLoading(false);
          return;
        }

        setMatch(matchData);
        setEvents(eventsData || []);
        setStats(statsData);
        setLineups(lineupsData);
        setLoading(false);

        // Appels sidebar en arrière-plan (non bloquants)
        const competitionId = matchData.competition?.id;
        const homeTeamId = matchData.homeTeam?.id;
        const awayTeamId = matchData.awayTeam?.id;

        // H2H
        if (homeTeamId && awayTeamId) {
          getHeadToHead(homeTeamId, awayTeamId)
            .then(data => setH2H(data || []))
            .catch(() => {});
        }

        // Classement + Buteurs + Autres matchs (si compétition connue)
        if (competitionId) {
          // Détecter si c'est une coupe ou phase de groupes spéciale
          // "Regular Season" = championnat classique
          // "League Phase" = phase de ligue CL (traiter comme une journée)
          // Autres = phase à élimination directe (coupe)
          const round = matchData.round || '';
          const isRegularLeague = round.includes('Regular Season');
          const isLeaguePhase = round.includes('League Phase') || round.includes('League Stage');
          const isCupKnockout = !isRegularLeague && !isLeaguePhase && round.length > 0;

          console.log('[MatchDetail] Round detection:', {
            round,
            isRegularLeague,
            isLeaguePhase,
            isCupKnockout,
            matchday: matchData.matchday
          });

          // Récupérer les autres matchs du même tour
          let otherMatchesPromise: Promise<any[]>;

          if (isCupKnockout && round) {
            // Pour les phases à élimination directe, chercher par round exact
            console.log('[MatchDetail] Fetching cup knockout matches for round:', round);
            otherMatchesPromise = getMatchesByRound(String(competitionId), round)
              .then(matches => {
                console.log('[MatchDetail] Cup matches found:', matches.length);
                return matches;
              })
              .catch((err) => {
                console.error('[MatchDetail] Error fetching cup matches:', err);
                return [];
              });
          } else if (isLeaguePhase && round) {
            // Pour la phase de ligue CL, chercher par round complet
            console.log('[MatchDetail] Fetching league phase matches for round:', round);
            otherMatchesPromise = getMatchesByRound(String(competitionId), round)
              .then(matches => {
                console.log('[MatchDetail] League phase matches found:', matches.length);
                return matches;
              })
              .catch((err) => {
                console.error('[MatchDetail] Error fetching league phase matches:', err);
                return [];
              });
          } else {
            // Pour les championnats classiques, chercher par journée
            console.log('[MatchDetail] Fetching matchday matches:', matchData.matchday);
            otherMatchesPromise = getMatchesByMatchday(String(competitionId), matchData.matchday)
              .catch(() => []);
          }

          Promise.all([
            getStandings(String(competitionId)).catch(() => []),
            getTopScorers(String(competitionId)).catch(() => []),
            otherMatchesPromise,
          ]).then(([standingsData, scorersData, matchdayData]) => {
            setStandings(standingsData || []);
            setScorers(scorersData || []);
            setMatchdayMatches(matchdayData || []);
            console.log('[MatchDetail] Other matches loaded:', matchdayData?.length || 0);
          });
        }

        // Forme des équipes
        if (homeTeamId) {
          getTeamLastResults(homeTeamId, 5)
            .then(results => {
              const form = results.map((m: Match) => {
                const isHome = m.homeTeam.id === homeTeamId;
                const goalsFor = isHome ? m.score.fullTime.home : m.score.fullTime.away;
                const goalsAgainst = isHome ? m.score.fullTime.away : m.score.fullTime.home;
                if (goalsFor === null || goalsAgainst === null) return 'D';
                if (goalsFor > goalsAgainst) return 'W';
                if (goalsFor < goalsAgainst) return 'L';
                return 'D';
              }) as ('W' | 'D' | 'L')[];
              setHomeForm(form);
            })
            .catch(() => {});
        }

        if (awayTeamId) {
          getTeamLastResults(awayTeamId, 5)
            .then(results => {
              const form = results.map((m: Match) => {
                const isHome = m.homeTeam.id === awayTeamId;
                const goalsFor = isHome ? m.score.fullTime.home : m.score.fullTime.away;
                const goalsAgainst = isHome ? m.score.fullTime.away : m.score.fullTime.home;
                if (goalsFor === null || goalsAgainst === null) return 'D';
                if (goalsFor > goalsAgainst) return 'W';
                if (goalsFor < goalsAgainst) return 'L';
                return 'D';
              }) as ('W' | 'D' | 'L')[];
              setAwayForm(form);
            })
            .catch(() => {});
        }

      } catch (err) {
        console.error('Error fetching match data:', err);
        setError('Erreur lors du chargement du match');
        setLoading(false);
      }
    }

    fetchMatchData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Chargement du match...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !match) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">{error || 'Match non trouvé'}</h2>
          <Link to="/matchs" className="text-pink-400 hover:underline">
            Retour aux matchs
          </Link>
        </div>
      </div>
    );
  }

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const isUpcoming = match.status === 'SCHEDULED' || match.status === 'TIMED';

  const tabs = [
    { id: 'events' as TabType, label: 'Temps forts', icon: Clock, count: events.length },
    { id: 'stats' as TabType, label: 'Statistiques', icon: BarChart3, available: !!stats },
    { id: 'lineups' as TabType, label: 'Compositions', icon: Users, available: !!lineups },
    { id: 'h2h' as TabType, label: 'Face à face', icon: History, count: h2h.length },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />
      </div>

      {/* Header avec Match Card */}
      <header className="relative pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back + Competition */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/matchs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux matchs</span>
            </Link>
            <div className="flex items-center gap-3">
              {match.competition?.emblem && (
                <img src={match.competition.emblem} alt="" className="w-6 h-6 object-contain" />
              )}
              <span className="text-gray-400 text-sm">{match.competition?.name}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 text-sm">
                {match.round && !match.round.includes('Regular Season')
                  ? match.round
                  : `J${match.matchday}`}
              </span>
            </div>
          </div>

          {/* Match Card */}
          <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            <div className={`h-1 bg-gradient-to-r ${
              isLive ? 'from-red-500 via-pink-500 to-red-500' :
              isFinished ? 'from-gray-500 to-gray-600' :
              'from-blue-500 via-purple-500 to-pink-500'
            }`} />

            <div className="p-6 md:p-8">
              {/* Live badge */}
              {isLive && (
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full">
                    <div className="relative">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    </div>
                    <span className="text-red-400 font-bold text-sm uppercase">
                      {match.minute ? `${match.minute}'` : 'Live'}
                    </span>
                  </div>
                </div>
              )}

              {/* Teams and Score */}
              <div className="flex items-center justify-center gap-4 md:gap-12">
                {/* Home Team */}
                <Link to={`/classements/club/${match.homeTeam.id}`} className="flex-1 text-center group">
                  <img
                    src={match.homeTeam.crest}
                    alt={match.homeTeam.name}
                    className="w-16 h-16 md:w-24 md:h-24 object-contain mx-auto mb-3 group-hover:scale-110 transition-transform"
                  />
                  <h2 className="text-base md:text-xl font-bold text-white group-hover:text-pink-400 transition-colors">
                    {match.homeTeam.name}
                  </h2>
                </Link>

                {/* Score */}
                <div className="text-center min-w-[120px]">
                  {isUpcoming ? (
                    <div>
                      <div className="text-4xl md:text-6xl font-black text-white">VS</div>
                      <div className="mt-2 text-gray-400 text-sm">{formatDateFR(match.utcDate)}</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl md:text-6xl font-black text-white">
                          {match.score.fullTime.home ?? 0}
                        </span>
                        <span className="text-2xl md:text-4xl text-gray-600">:</span>
                        <span className="text-4xl md:text-6xl font-black text-white">
                          {match.score.fullTime.away ?? 0}
                        </span>
                      </div>
                      {match.score.halfTime.home !== null && (
                        <div className="mt-1 text-gray-500 text-sm">
                          MT: {match.score.halfTime.home} - {match.score.halfTime.away}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Away Team */}
                <Link to={`/classements/club/${match.awayTeam.id}`} className="flex-1 text-center group">
                  <img
                    src={match.awayTeam.crest}
                    alt={match.awayTeam.name}
                    className="w-16 h-16 md:w-24 md:h-24 object-contain mx-auto mb-3 group-hover:scale-110 transition-transform"
                  />
                  <h2 className="text-base md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {match.awayTeam.name}
                  </h2>
                </Link>
              </div>

              {/* Match info badges */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDateFR(match.utcDate)}</span>
                </div>
                {match.venue && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span>{match.venue}</span>
                  </div>
                )}
                {match.referee && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 text-xs">
                    <Users className="w-3 h-3" />
                    <span>{match.referee}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <section className="sticky top-20 z-30 bg-black/90 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content avec Sidebar */}
      <main className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal (2/3) */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Events Tab */}
              {activeTab === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-4 md:p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-pink-500" />
                      Temps forts
                    </h3>

                    {events.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Aucun événement</p>
                        {isUpcoming && <p className="text-gray-500 text-sm mt-1">Match pas encore commencé</p>}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {events
                          .sort((a, b) => (b.time?.elapsed || 0) - (a.time?.elapsed || 0))
                          .map((event, idx) => {
                            const isHome = event.team?.id === match.homeTeam.id;
                            return (
                              <div
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-lg bg-white/5 ${
                                  isHome ? '' : 'flex-row-reverse'
                                }`}
                              >
                                <div className="w-12 text-center">
                                  <span className="text-pink-400 font-bold">{event.time?.elapsed}'</span>
                                  {event.time?.extra && <span className="text-gray-500 text-xs">+{event.time.extra}</span>}
                                </div>
                                <EventIcon type={event.type} detail={event.detail} />
                                <div className={`flex-1 ${isHome ? '' : 'text-right'}`}>
                                  {event.player?.id ? (
                                    <Link to={`/player/${event.player.id}`} className="text-white font-medium hover:text-pink-400">
                                      {event.player.name}
                                    </Link>
                                  ) : (
                                    <span className="text-white font-medium">{event.player?.name || 'Événement'}</span>
                                  )}
                                  {event.type === 'subst' && event.assist?.name && (
                                    <p className="text-gray-500 text-xs">↓ {event.assist.name}</p>
                                  )}
                                  {event.type === 'Goal' && event.assist?.name && (
                                    <p className="text-gray-500 text-xs">Passe: {event.assist.name}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-4 md:p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-pink-500" />
                      Statistiques
                    </h3>
                    {!stats ? (
                      <div className="text-center py-8">
                        <BarChart3 className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Stats non disponibles</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-2">
                            <img src={match.homeTeam.crest} alt="" className="w-8 h-8" />
                            <span className="text-white font-bold text-sm hidden md:inline">{match.homeTeam.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm hidden md:inline">{match.awayTeam.name}</span>
                            <img src={match.awayTeam.crest} alt="" className="w-8 h-8" />
                          </div>
                        </div>
                        <StatBar label="Possession" homeValue={stats.home?.possession || 0} awayValue={stats.away?.possession || 0} isPercentage />
                        <StatBar label="Tirs" homeValue={stats.home?.shots || 0} awayValue={stats.away?.shots || 0} />
                        <StatBar label="Tirs cadrés" homeValue={stats.home?.shotsOnTarget || 0} awayValue={stats.away?.shotsOnTarget || 0} />
                        <StatBar label="Corners" homeValue={stats.home?.corners || 0} awayValue={stats.away?.corners || 0} />
                        <StatBar label="Fautes" homeValue={stats.home?.fouls || 0} awayValue={stats.away?.fouls || 0} />
                        <StatBar label="Hors-jeu" homeValue={stats.home?.offsides || 0} awayValue={stats.away?.offsides || 0} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Lineups Tab */}
              {activeTab === 'lineups' && (
                <motion.div key="lineups" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
                    <h3 className="text-lg font-bold text-white p-4 md:p-6 border-b border-white/10 flex items-center gap-2">
                      <Users className="w-5 h-5 text-pink-500" />
                      Compositions
                    </h3>
                    {!lineups ? (
                      <div className="text-center py-8">
                        <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Compositions non disponibles</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                        {/* Home */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <img src={match.homeTeam.crest} alt="" className="w-8 h-8" />
                            <div>
                              <h4 className="text-white font-bold text-sm">{match.homeTeam.name}</h4>
                              <p className="text-pink-400 text-xs">{lineups.home?.formation}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {(lineups.home?.startXI || []).map((p: any, i: number) => (
                              <Link key={i} to={p.id ? `/player/${p.id}` : '#'} className="flex items-center gap-2 p-2 rounded hover:bg-white/5 text-sm">
                                <span className="w-6 h-6 flex items-center justify-center bg-pink-500/30 text-pink-400 rounded text-xs font-bold">{p.number || i + 1}</span>
                                <span className="text-white flex-1">{p.name}</span>
                                <span className="text-gray-500 text-xs">{p.pos}</span>
                              </Link>
                            ))}
                          </div>
                          {lineups.home?.substitutes?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-gray-500 text-xs mb-2">Remplaçants</p>
                              <div className="flex flex-wrap gap-1">
                                {lineups.home.substitutes.map((p: any, i: number) => (
                                  <Link key={i} to={p.id ? `/player/${p.id}` : '#'} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 hover:bg-white/10">
                                    {p.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Away */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <img src={match.awayTeam.crest} alt="" className="w-8 h-8" />
                            <div>
                              <h4 className="text-white font-bold text-sm">{match.awayTeam.name}</h4>
                              <p className="text-blue-400 text-xs">{lineups.away?.formation}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {(lineups.away?.startXI || []).map((p: any, i: number) => (
                              <Link key={i} to={p.id ? `/player/${p.id}` : '#'} className="flex items-center gap-2 p-2 rounded hover:bg-white/5 text-sm">
                                <span className="w-6 h-6 flex items-center justify-center bg-blue-500/30 text-blue-400 rounded text-xs font-bold">{p.number || i + 1}</span>
                                <span className="text-white flex-1">{p.name}</span>
                                <span className="text-gray-500 text-xs">{p.pos}</span>
                              </Link>
                            ))}
                          </div>
                          {lineups.away?.substitutes?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-gray-500 text-xs mb-2">Remplaçants</p>
                              <div className="flex flex-wrap gap-1">
                                {lineups.away.substitutes.map((p: any, i: number) => (
                                  <Link key={i} to={p.id ? `/player/${p.id}` : '#'} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 hover:bg-white/10">
                                    {p.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* H2H Tab */}
              {activeTab === 'h2h' && (
                <motion.div key="h2h" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-4 md:p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <History className="w-5 h-5 text-pink-500" />
                      Confrontations
                    </h3>
                    {h2h.length === 0 ? (
                      <div className="text-center py-8">
                        <History className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Aucune confrontation trouvée</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {h2h.filter(m => m.id !== match.id).slice(0, 8).map((m) => (
                          <Link key={m.id} to={`/match/${m.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-gray-500 text-xs w-20">{formatDateFR(m.utcDate)}</span>
                            <img src={m.homeTeam.crest} alt="" className="w-5 h-5" />
                            <span className="text-gray-300 text-sm flex-1 truncate">{m.homeTeam.name}</span>
                            <span className="text-white font-bold">{m.score.fullTime.home} - {m.score.fullTime.away}</span>
                            <span className="text-gray-300 text-sm flex-1 truncate text-right">{m.awayTeam.name}</span>
                            <img src={m.awayTeam.crest} alt="" className="w-5 h-5" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-4">
            {/* Détection des matchs à élimination directe (pas de classement pour ces matchs) */}
            {(() => {
              const round = match.round || '';
              const isKnockout = round.includes('Final') ||
                round.includes('Quarter') ||
                round.includes('Semi') ||
                round.includes('Round of') ||
                round.includes('8th') ||
                round.includes('16th') ||
                round.includes('Knockout') ||
                round.includes('Play-off');
              const isGroupStage = round.includes('Group');

              // Pour les matchs knockout, on ne montre pas le classement
              if (isKnockout && !isGroupStage) {
                return (
                  <>
                    {/* Info phase finale */}
                    <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl border border-yellow-500/30 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <div>
                          <h3 className="text-white font-bold">Phase finale</h3>
                          <p className="text-yellow-400/80 text-sm">{round}</p>
                        </div>
                      </div>
                      <Link
                        to={`/classements/matchday/${match.competition?.id}`}
                        className="block text-center py-2 px-4 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium transition-colors"
                      >
                        Voir le tableau complet →
                      </Link>
                    </div>

                    {/* Forme des équipes */}
                    <TeamFormSidebar
                      homeForm={homeForm}
                      awayForm={awayForm}
                      homeTeam={match.homeTeam}
                      awayTeam={match.awayTeam}
                    />

                    {/* Cotes Winamax */}
                    <OddsWidget
                      homeTeam={match.homeTeam.name}
                      awayTeam={match.awayTeam.name}
                      competitionId={match.competition?.id || 0}
                      matchStatus={match.status}
                    />

                    {/* Top buteurs */}
                    <TopScorersSidebar scorers={scorers} competitionId={match.competition?.id} />

                    {/* Autres matchs du même tour */}
                    <OtherMatchesSidebar
                      matches={matchdayMatches}
                      currentMatchId={match.id}
                      round={match.round}
                      competitionId={match.competition?.id}
                      matchday={match.matchday}
                    />
                  </>
                );
              }

              // Pour les matchs de championnat ou phase de groupes
              return (
                <>
                  {/* Classement */}
                  <MiniStandings
                    standings={standings}
                    homeTeamId={match.homeTeam.id}
                    awayTeamId={match.awayTeam.id}
                    competitionId={match.competition?.id}
                  />

                  {/* Forme des équipes */}
                  <TeamFormSidebar
                    homeForm={homeForm}
                    awayForm={awayForm}
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                  />

                  {/* Cotes Winamax */}
                  <OddsWidget
                    homeTeam={match.homeTeam.name}
                    awayTeam={match.awayTeam.name}
                    competitionId={match.competition?.id || 0}
                    matchStatus={match.status}
                  />

                  {/* Top buteurs */}
                  <TopScorersSidebar scorers={scorers} competitionId={match.competition?.id} />

                  {/* Autres matchs de la journée/du tour */}
                  <OtherMatchesSidebar
                    matches={matchdayMatches}
                    currentMatchId={match.id}
                    round={match.round}
                    competitionId={match.competition?.id}
                    matchday={match.matchday}
                  />
                </>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
