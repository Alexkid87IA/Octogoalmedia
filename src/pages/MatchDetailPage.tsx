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
  Swords,
  Target,
  Shield,
  Zap,
  Star,
  Flame,
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
import { findMatchOdds } from '../services/oddsService';
import { MatchOdds, formatOdds } from '../types/odds.types';

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

// =============================================
// COMPOSANT PREVIEW AVANT-MATCH
// =============================================

const MatchPreview = ({
  match,
  h2h,
  homeForm,
  awayForm,
  standings,
  headerOdds,
}: {
  match: Match;
  h2h: Match[];
  homeForm: ('W' | 'D' | 'L')[];
  awayForm: ('W' | 'D' | 'L')[];
  standings: TeamStanding[];
  headerOdds: MatchOdds | null;
}) => {
  // Calculer les stats H2H
  const h2hStats = (() => {
    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;
    let homeGoals = 0;
    let awayGoals = 0;

    h2h.forEach(m => {
      const hGoals = m.score.fullTime.home ?? 0;
      const aGoals = m.score.fullTime.away ?? 0;

      if (m.homeTeam.id === match.homeTeam.id) {
        homeGoals += hGoals;
        awayGoals += aGoals;
        if (hGoals > aGoals) homeWins++;
        else if (aGoals > hGoals) awayWins++;
        else draws++;
      } else {
        homeGoals += aGoals;
        awayGoals += hGoals;
        if (aGoals > hGoals) homeWins++;
        else if (hGoals > aGoals) awayWins++;
        else draws++;
      }
    });

    return { homeWins, awayWins, draws, homeGoals, awayGoals, total: h2h.length };
  })();

  // Calculer la forme (points sur les 5 derniers matchs)
  const calcFormPoints = (form: ('W' | 'D' | 'L')[]) => {
    return form.slice(0, 5).reduce((acc, r) => acc + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
  };

  const homeFormPoints = calcFormPoints(homeForm);
  const awayFormPoints = calcFormPoints(awayForm);

  // Positions au classement
  const homeStanding = standings.find(s => s.team.id === match.homeTeam.id);
  const awayStanding = standings.find(s => s.team.id === match.awayTeam.id);

  // Prédiction basée sur les cotes
  const prediction = (() => {
    if (!headerOdds?.odds.winamax) return null;
    const { home, draw, away } = headerOdds.odds.winamax;
    const minOdd = Math.min(home, draw, away);
    if (minOdd === home) return { winner: 'home', confidence: Math.round((1 / home) * 100) };
    if (minOdd === away) return { winner: 'away', confidence: Math.round((1 / away) * 100) };
    return { winner: 'draw', confidence: Math.round((1 / draw) * 100) };
  })();

  return (
    <div className="space-y-6">
      {/* En-tête Avant-Match */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-blue-900/30 rounded-2xl border border-purple-500/20 p-6"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <Swords className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Avant-Match</h2>
          <Flame className="w-5 h-5 text-orange-400" />
        </div>

        {/* Comparaison Forme + Position */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Home */}
          <div className="text-center">
            <img src={match.homeTeam.crest} alt="" className="w-16 h-16 mx-auto mb-2" />
            <p className="text-white font-bold text-sm mb-2">{match.homeTeam.shortName || match.homeTeam.name}</p>
            <div className="flex justify-center gap-1 mb-2">
              {homeForm.slice(0, 5).map((r, i) => (
                <FormBadge key={i} result={r} />
              ))}
            </div>
            {homeStanding && (
              <p className="text-gray-400 text-xs">
                <span className="text-pink-400 font-bold">{homeStanding.position}e</span> au classement
              </p>
            )}
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
              <span className="text-white font-black text-lg">VS</span>
            </div>
            <p className="text-gray-500 text-xs">{formatDateFR(match.utcDate)}</p>
          </div>

          {/* Away */}
          <div className="text-center">
            <img src={match.awayTeam.crest} alt="" className="w-16 h-16 mx-auto mb-2" />
            <p className="text-white font-bold text-sm mb-2">{match.awayTeam.shortName || match.awayTeam.name}</p>
            <div className="flex justify-center gap-1 mb-2">
              {awayForm.slice(0, 5).map((r, i) => (
                <FormBadge key={i} result={r} />
              ))}
            </div>
            {awayStanding && (
              <p className="text-gray-400 text-xs">
                <span className="text-blue-400 font-bold">{awayStanding.position}e</span> au classement
              </p>
            )}
          </div>
        </div>

        {/* Stats saison si dispo */}
        {homeStanding && awayStanding && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-black text-pink-400">{homeStanding.goalsFor}</p>
              <p className="text-xs text-gray-500">Buts marqués</p>
            </div>
            <div className="flex items-center justify-center">
              <Target className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-400">{awayStanding.goalsFor}</p>
              <p className="text-xs text-gray-500">Buts marqués</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-black text-pink-400">{homeStanding.goalsAgainst}</p>
              <p className="text-xs text-gray-500">Buts encaissés</p>
            </div>
            <div className="flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-400">{awayStanding.goalsAgainst}</p>
              <p className="text-xs text-gray-500">Buts encaissés</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Historique H2H */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-bold text-white">Confrontations directes</h3>
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">
              {h2hStats.total} matchs
            </span>
          </div>
        </div>

        {h2h.length > 0 ? (
          <>
            {/* Stats H2H */}
            <div className="p-6 grid grid-cols-3 gap-4 border-b border-white/10">
              <div className="text-center">
                <p className="text-3xl font-black text-pink-400">{h2hStats.homeWins}</p>
                <p className="text-xs text-gray-500 mt-1">Victoires {match.homeTeam.shortName || match.homeTeam.name.substring(0, 3)}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-gray-400">{h2hStats.draws}</p>
                <p className="text-xs text-gray-500 mt-1">Nuls</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-blue-400">{h2hStats.awayWins}</p>
                <p className="text-xs text-gray-500 mt-1">Victoires {match.awayTeam.shortName || match.awayTeam.name.substring(0, 3)}</p>
              </div>
            </div>

            {/* Barre visuelle */}
            <div className="px-6 py-3 border-b border-white/10">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-pink-400 transition-all"
                  style={{ width: `${(h2hStats.homeWins / h2hStats.total) * 100}%` }}
                />
                <div
                  className="bg-gray-600 transition-all"
                  style={{ width: `${(h2hStats.draws / h2hStats.total) * 100}%` }}
                />
                <div
                  className="bg-gradient-to-l from-blue-500 to-blue-400 transition-all"
                  style={{ width: `${(h2hStats.awayWins / h2hStats.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Liste derniers matchs */}
            <div className="p-4 space-y-2">
              {h2h.slice(0, 5).map((m) => {
                const isHomeTeamHome = m.homeTeam.id === match.homeTeam.id;
                const homeGoals = m.score.fullTime.home ?? 0;
                const awayGoals = m.score.fullTime.away ?? 0;
                const result = isHomeTeamHome
                  ? (homeGoals > awayGoals ? 'W' : homeGoals < awayGoals ? 'L' : 'D')
                  : (awayGoals > homeGoals ? 'W' : awayGoals < homeGoals ? 'L' : 'D');

                return (
                  <Link
                    key={m.id}
                    to={`/match/${m.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-gray-500 text-xs w-20">{formatDateFR(m.utcDate)}</span>
                    <img src={m.homeTeam.crest} alt="" className="w-5 h-5" />
                    <span className="text-gray-300 text-sm flex-1 truncate">{m.homeTeam.name}</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      result === 'W' ? 'bg-green-500/20 text-green-400' :
                      result === 'L' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {homeGoals} - {awayGoals}
                    </span>
                    <span className="text-gray-300 text-sm flex-1 truncate text-right">{m.awayTeam.name}</span>
                    <img src={m.awayTeam.crest} alt="" className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <History className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400">Première confrontation entre ces équipes</p>
          </div>
        )}
      </motion.div>

      {/* Pronostic */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl border border-orange-500/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">Pronostic</h3>
            <span className="text-xs text-gray-500">(basé sur les cotes)</span>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className={`flex-1 text-center p-4 rounded-xl border ${
              prediction.winner === 'home'
                ? 'bg-pink-500/20 border-pink-500/50'
                : 'bg-white/5 border-white/10'
            }`}>
              <img src={match.homeTeam.crest} alt="" className="w-12 h-12 mx-auto mb-2" />
              <p className={`font-bold ${prediction.winner === 'home' ? 'text-pink-400' : 'text-gray-500'}`}>
                {match.homeTeam.shortName || match.homeTeam.name.substring(0, 10)}
              </p>
              {prediction.winner === 'home' && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-sm font-bold">Favori</span>
                </div>
              )}
            </div>

            <div className={`text-center p-4 rounded-xl border ${
              prediction.winner === 'draw'
                ? 'bg-gray-500/20 border-gray-500/50'
                : 'bg-white/5 border-white/10'
            }`}>
              <p className={`text-2xl font-black ${prediction.winner === 'draw' ? 'text-gray-300' : 'text-gray-600'}`}>
                Nul
              </p>
            </div>

            <div className={`flex-1 text-center p-4 rounded-xl border ${
              prediction.winner === 'away'
                ? 'bg-blue-500/20 border-blue-500/50'
                : 'bg-white/5 border-white/10'
            }`}>
              <img src={match.awayTeam.crest} alt="" className="w-12 h-12 mx-auto mb-2" />
              <p className={`font-bold ${prediction.winner === 'away' ? 'text-blue-400' : 'text-gray-500'}`}>
                {match.awayTeam.shortName || match.awayTeam.name.substring(0, 10)}
              </p>
              {prediction.winner === 'away' && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-sm font-bold">Favori</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
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
  const [headerOdds, setHeaderOdds] = useState<MatchOdds | null>(null);

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

        // D'abord récupérer les détails du match pour savoir s'il est en cours
        const matchData = await getMatchDetails(fixtureId);

        if (!matchData) {
          setError('Match non trouvé');
          setLoading(false);
          return;
        }

        // Déterminer si le match est en cours (pour éviter le cache)
        const liveStatuses = ['IN_PLAY', 'PAUSED', 'HALFTIME', '1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'];
        const isLive = liveStatuses.includes(matchData.status);

        // Ensuite récupérer les autres données en parallèle avec le flag isLive
        const [eventsData, statsData, lineupsData] = await Promise.all([
          getMatchEvents(fixtureId, isLive),
          getMatchStats(fixtureId, isLive),
          getMatchLineups(fixtureId, isLive),
        ]);

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

        // Cotes Winamax pour le header (si match non terminé)
        if (matchData.status !== 'FINISHED' && competitionId) {
          findMatchOdds(matchData.homeTeam.name, matchData.awayTeam.name, competitionId)
            .then(odds => setHeaderOdds(odds))
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
              {(() => {
                // Filtrer les buts par équipe
                const homeGoals = events.filter(e => e.type === 'Goal' && e.team?.id === match.homeTeam.id);
                const awayGoals = events.filter(e => e.type === 'Goal' && e.team?.id === match.awayTeam.id);

                // Fonction pour afficher le nom du buteur (format court)
                const formatScorer = (event: any) => {
                  const name = event.player?.name || 'But';
                  const minute = event.time?.elapsed || '';
                  const extra = event.time?.extra ? `+${event.time.extra}` : '';
                  const isPenalty = event.detail?.includes('Penalty');
                  const isOwnGoal = event.detail?.includes('Own Goal');
                  return `${name.split(' ').pop()} ${minute}${extra}'${isPenalty ? ' (P)' : ''}${isOwnGoal ? ' (CSC)' : ''}`;
                };

                return (
                  <div className="flex items-center justify-center gap-2 md:gap-4">
                    {/* Home Team - Logo + Name */}
                    <Link to={`/classements/club/${match.homeTeam.id}`} className="group text-center flex-shrink-0">
                      <img
                        src={match.homeTeam.crest}
                        alt={match.homeTeam.name}
                        className="w-14 h-14 md:w-20 md:h-20 object-contain mx-auto mb-2 group-hover:scale-110 transition-transform"
                      />
                      <h2 className="text-sm md:text-lg font-bold text-white group-hover:text-pink-400 transition-colors max-w-[80px] md:max-w-[120px] truncate">
                        {match.homeTeam.name}
                      </h2>
                    </Link>

                    {/* Buteurs domicile (alignés à droite) */}
                    {!isUpcoming && homeGoals.length > 0 && (
                      <div className="hidden md:block text-right max-w-[140px]">
                        {homeGoals.slice(0, 6).map((goal, idx) => (
                          <div key={idx} className="text-[10px] text-gray-400 truncate">
                            {formatScorer(goal)}
                          </div>
                        ))}
                        {homeGoals.length > 6 && (
                          <div className="text-[10px] text-gray-500">+{homeGoals.length - 6} autres</div>
                        )}
                      </div>
                    )}

                    {/* Score */}
                    <div className="text-center px-2 md:px-4">
                      {isUpcoming ? (
                        <div>
                          <div className="text-3xl md:text-5xl font-black text-white">VS</div>
                          <div className="mt-1 text-gray-400 text-xs">{formatDateFR(match.utcDate)}</div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-center gap-2 md:gap-3">
                            <span className="text-3xl md:text-5xl font-black text-white">
                              {match.score.fullTime.home ?? 0}
                            </span>
                            <span className="text-xl md:text-3xl text-gray-600">-</span>
                            <span className="text-3xl md:text-5xl font-black text-white">
                              {match.score.fullTime.away ?? 0}
                            </span>
                          </div>
                          {match.score.halfTime.home !== null && (
                            <div className="mt-1 text-gray-500 text-[10px] md:text-xs">
                              MT: {match.score.halfTime.home} - {match.score.halfTime.away}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Buteurs extérieur (alignés à gauche) */}
                    {!isUpcoming && awayGoals.length > 0 && (
                      <div className="hidden md:block text-left max-w-[140px]">
                        {awayGoals.slice(0, 6).map((goal, idx) => (
                          <div key={idx} className="text-[10px] text-gray-400 truncate">
                            {formatScorer(goal)}
                          </div>
                        ))}
                        {awayGoals.length > 6 && (
                          <div className="text-[10px] text-gray-500">+{awayGoals.length - 6} autres</div>
                        )}
                      </div>
                    )}

                    {/* Away Team - Logo + Name */}
                    <Link to={`/classements/club/${match.awayTeam.id}`} className="group text-center flex-shrink-0">
                      <img
                        src={match.awayTeam.crest}
                        alt={match.awayTeam.name}
                        className="w-14 h-14 md:w-20 md:h-20 object-contain mx-auto mb-2 group-hover:scale-110 transition-transform"
                      />
                      <h2 className="text-sm md:text-lg font-bold text-white group-hover:text-blue-400 transition-colors max-w-[80px] md:max-w-[120px] truncate">
                        {match.awayTeam.name}
                      </h2>
                    </Link>
                  </div>
                );
              })()}

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

              {/* Cotes Winamax centrées */}
              {isUpcoming && headerOdds?.odds.winamax && (
                <div className="mt-6 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="/images/winamax-logo.png"
                      alt="Winamax"
                      className="w-6 h-6 rounded object-contain"
                    />
                    <span className="text-sm text-gray-400">Cotes Winamax</span>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">1</span>
                      <span className={`text-xl font-bold ${
                        headerOdds.odds.winamax.home === Math.min(headerOdds.odds.winamax.home, headerOdds.odds.winamax.draw, headerOdds.odds.winamax.away)
                          ? 'text-green-400'
                          : 'text-white'
                      }`}>
                        {formatOdds(headerOdds.odds.winamax.home)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">N</span>
                      <span className={`text-xl font-bold ${
                        headerOdds.odds.winamax.draw === Math.min(headerOdds.odds.winamax.home, headerOdds.odds.winamax.draw, headerOdds.odds.winamax.away)
                          ? 'text-green-400'
                          : 'text-white'
                      }`}>
                        {formatOdds(headerOdds.odds.winamax.draw)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">2</span>
                      <span className={`text-xl font-bold ${
                        headerOdds.odds.winamax.away === Math.min(headerOdds.odds.winamax.home, headerOdds.odds.winamax.draw, headerOdds.odds.winamax.away)
                          ? 'text-green-400'
                          : 'text-white'
                      }`}>
                        {formatOdds(headerOdds.odds.winamax.away)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs - seulement pour matchs en cours ou terminés */}
      {!isUpcoming && (
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
      )}

      {/* Main Content avec Sidebar */}
      <main className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal (2/3) */}
          <div className="lg:col-span-2">
            {/* Mode Avant-Match pour les matchs à venir */}
            {isUpcoming ? (
              <MatchPreview
                match={match}
                h2h={h2h}
                homeForm={homeForm}
                awayForm={awayForm}
                standings={standings}
                headerOdds={headerOdds}
              />
            ) : (
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
            )}
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
