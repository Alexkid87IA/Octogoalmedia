// src/pages/MatchsPage.tsx
// Match Center - Toutes les compétitions organisées par catégorie

import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Calendar, Clock, ChevronDown, RefreshCw, Trophy } from 'lucide-react';
import { getLiveMatches, getFixturesByDate } from '../services/apiFootball';
import OddsBadge from '../components/football/OddsBadge';
import {
  COMPETITIONS,
  getAllActiveCompetitions,
  getMatchesDisplayOrder,
} from '../config/competitions';

// =============================================
// TYPES
// =============================================

interface Match {
  id: number;
  utcDate: string;
  status: string;
  minute?: number;
  homeTeam: { id: number; name: string; crest: string };
  awayTeam: { id: number; name: string; crest: string };
  score: { fullTime: { home: number | null; away: number | null } };
  competition: { id: number; name: string; emblem: string };
  venue?: string;
}

// =============================================
// HELPERS
// =============================================

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDayLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (getDateString(date) === getDateString(today)) return 'Aujourd\'hui';
  if (getDateString(date) === getDateString(yesterday)) return 'Hier';
  if (getDateString(date) === getDateString(tomorrow)) return 'Demain';

  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
}

// Génère les jours navigables: 7 jours passés + aujourd'hui + 7 jours futurs
function getNavigableDays(): { date: Date; label: string; dateStr: string; isPast: boolean }[] {
  const days = [];

  // 7 jours passés
  for (let i = 7; i >= 1; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date,
      label: getDayLabel(date),
      dateStr: getDateString(date),
      isPast: true,
    });
  }

  // Aujourd'hui + 7 jours futurs
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      date,
      label: getDayLabel(date),
      dateStr: getDateString(date),
      isPast: false,
    });
  }

  return days;
}

function formatMatchTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// =============================================
// COMPOSANTS
// =============================================

// Badge Live animé
const LiveBadge = ({ minute }: { minute?: number }) => (
  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 border border-red-500/50 rounded-full">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
    </span>
    <span className="text-red-400 text-xs font-bold">
      {minute ? `${minute}'` : 'LIVE'}
    </span>
  </div>
);

// Skeleton loader
const MatchSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-800/50 rounded-lg mb-3" />
    {[1, 2, 3].map(i => (
      <div key={i} className="h-20 bg-gray-800/30 rounded-xl mb-2" />
    ))}
  </div>
);

// Card Match
const MatchCard = ({ match }: { match: Match }) => {
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';

  return (
    <Link
      to={`/match/${match.id}`}
      className={`block p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${
        isLive
          ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
          : 'bg-gray-900/50 border-gray-800 hover:border-pink-500/30'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Équipe domicile */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={match.homeTeam.crest}
            alt=""
            className="w-8 h-8 object-contain flex-shrink-0"
          />
          <span className={`font-medium truncate ${isLive ? 'text-white' : 'text-gray-200'}`}>
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score / Heure */}
        <div className="flex flex-col items-center mx-4 min-w-[80px]">
          {isLive || isFinished ? (
            <>
              <div className="flex items-center gap-2 text-xl font-bold">
                <span className="text-white">{match.score.fullTime.home ?? 0}</span>
                <span className="text-gray-600">-</span>
                <span className="text-white">{match.score.fullTime.away ?? 0}</span>
              </div>
              {isLive && <LiveBadge minute={match.minute} />}
              {isFinished && (
                <span className="text-xs text-gray-500 mt-1">Terminé</span>
              )}
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-pink-400">
                {formatMatchTime(match.utcDate)}
              </span>
              {match.venue && (
                <span className="text-xs text-gray-500 truncate max-w-[100px]">
                  {match.venue}
                </span>
              )}
            </>
          )}
        </div>

        {/* Équipe extérieur */}
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span className={`font-medium truncate text-right ${isLive ? 'text-white' : 'text-gray-200'}`}>
            {match.awayTeam.name}
          </span>
          <img
            src={match.awayTeam.crest}
            alt=""
            className="w-8 h-8 object-contain flex-shrink-0"
          />
        </div>
      </div>

      {/* Cotes - seulement pour matchs non terminés */}
      {!isFinished && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <OddsBadge
            homeTeam={match.homeTeam.name}
            awayTeam={match.awayTeam.name}
            competitionId={match.competition.id}
            matchStatus={match.status}
            variant="row"
          />
        </div>
      )}
    </Link>
  );
};

// Section de compétition
const CompetitionSection = ({
  competition,
  matches,
  isCollapsed,
  onToggle,
}: {
  competition: { id: number; name: string; emblem: string };
  matches: Match[];
  isCollapsed: boolean;
  onToggle: () => void;
}) => {
  const compInfo = COMPETITIONS[competition.id];
  const liveCount = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED').length;

  return (
    <div className="mb-4">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/50 rounded-t-xl border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          {competition.emblem ? (
            <img src={competition.emblem} alt="" className="w-6 h-6 object-contain" />
          ) : (
            <span className="text-xl">{compInfo?.flag || '⚽'}</span>
          )}
          <span className="text-white font-semibold">{competition.name}</span>
          {liveCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
              {liveCount} live
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm">{matches.length}</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
          />
        </div>
      </button>

      {/* Matchs */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 p-3 bg-gray-900/30 rounded-b-xl border-x border-b border-gray-700/50">
              {matches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================
// PAGE PRINCIPALE
// =============================================

export default function MatchsPage() {
  // Toutes les compétitions actives
  const allCompetitions = getAllActiveCompetitions();
  const allCompetitionIds = allCompetitions.map(c => c.id);

  // États
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [selectedDay, setSelectedDay] = useState(getDateString(new Date()));
  const [selectedCompetitions, setSelectedCompetitions] = useState<number[]>(allCompetitionIds);
  const [collapsedCompetitions, setCollapsedCompetitions] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const refreshTimerRef = useRef<number | null>(null);
  const days = getNavigableDays();
  const todayIndex = days.findIndex(d => d.dateStr === getDateString(new Date()));

  // Fetch des matchs
  const fetchMatches = useCallback(async () => {
    try {
      setError(null);

      // Récupérer matchs live
      const liveData = await getLiveMatches();
      const filteredLive = liveData.filter((m: Match) =>
        selectedCompetitions.includes(m.competition?.id)
      );
      setLiveMatches(filteredLive);
      // console.log('[MatchCenter] Live matches:', filteredLive.length);

      // Récupérer matchs du jour sélectionné
      const dayMatches = await getFixturesByDate(selectedDay, selectedCompetitions);
      setMatches(dayMatches);

      // Debug: afficher les matchs par statut
      const finishedCount = dayMatches.filter((m: Match) => m.status === 'FINISHED').length;
      const scheduledCount = dayMatches.filter((m: Match) => m.status === 'SCHEDULED' || m.status === 'TIMED').length;
      const liveCount = dayMatches.filter((m: Match) => m.status === 'IN_PLAY' || m.status === 'PAUSED').length;
      // console.log(`[MatchCenter] Matchs du ${selectedDay}: ${dayMatches.length} total (${finishedCount} terminés, ${liveCount} live, ${scheduledCount} à venir)`);

      // Debug: afficher les statuts uniques
      const statuses = [...new Set(dayMatches.map((m: Match) => m.status))];
      // console.log('[MatchCenter] Statuts présents:', statuses);

      setLoading(false);
    } catch (err) {
      console.error('Erreur chargement matchs:', err);
      setError('Impossible de charger les matchs');
      setLoading(false);
    }
  }, [selectedDay, selectedCompetitions]);

  // Fetch initial + auto-refresh
  useEffect(() => {
    setLoading(true);
    fetchMatches();

    // Auto-refresh toutes les 30 secondes
    refreshTimerRef.current = window.setInterval(fetchMatches, 30000);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [fetchMatches]);

  // Scroll vers "Aujourd'hui" au chargement
  useEffect(() => {
    const daysNav = document.getElementById('days-nav');
    if (daysNav && todayIndex >= 0) {
      // Calculer la position pour centrer "Aujourd'hui"
      const buttons = daysNav.querySelectorAll('button');
      if (buttons[todayIndex]) {
        const button = buttons[todayIndex] as HTMLButtonElement;
        const scrollPos = button.offsetLeft - (daysNav.clientWidth / 2) + (button.clientWidth / 2);
        daysNav.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }
  }, [todayIndex]);

  // Sélectionner/désélectionner une compétition
  const toggleCompetition = (compId: number) => {
    setSelectedCompetitions(prev => {
      if (prev.includes(compId)) {
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== compId);
      }
      return [...prev, compId];
    });
  };

  // Sélectionner toutes les compétitions
  const selectAllCompetitions = () => {
    setSelectedCompetitions(allCompetitionIds);
  };

  // Toggle collapse
  const toggleCollapse = (compId: number) => {
    setCollapsedCompetitions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(compId)) {
        newSet.delete(compId);
      } else {
        newSet.add(compId);
      }
      return newSet;
    });
  };

  // Grouper les matchs par compétition
  const groupMatchesByCompetition = (matchList: Match[]) => {
    const groups: Record<number, { competition: Match['competition']; matches: Match[] }> = {};

    matchList.forEach(match => {
      const compId = match.competition?.id;
      if (!compId) return;

      if (!groups[compId]) {
        groups[compId] = {
          competition: match.competition,
          matches: [],
        };
      }
      groups[compId].matches.push(match);
    });

    // Trier selon l'ordre défini
    const order = getMatchesDisplayOrder();
    return Object.entries(groups)
      .sort(([aId], [bId]) => {
        const aOrder = order.indexOf(Number(aId));
        const bOrder = order.indexOf(Number(bId));
        if (aOrder === -1 && bOrder === -1) return 0;
        if (aOrder === -1) return 1;
        if (bOrder === -1) return -1;
        return aOrder - bOrder;
      })
      .map(([, value]) => value);
  };

  // Filtrer les matchs
  const getFilteredMatches = () => {
    if (filter === 'live') {
      return liveMatches;
    }
    if (filter === 'upcoming') {
      return matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');
    }
    return matches;
  };

  // Compteurs
  const liveCount = liveMatches.length;
  const todayCount = matches.length;
  const upcomingCount = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED').length;
  const finishedCount = matches.filter(m => m.status === 'FINISHED').length;
  const isViewingPastDay = days.find(d => d.dateStr === selectedDay)?.isPast || false;

  const filteredMatches = getFilteredMatches();
  const groupedMatches = groupMatchesByCompetition(filteredMatches);
  const groupedLiveMatches = groupMatchesByCompetition(liveMatches);

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative pt-24 pb-6">
        <div className="max-w-5xl mx-auto px-4">
          {/* Titre */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Match Center
            </h1>
            <p className="text-gray-400">Tous les matchs en temps réel</p>
          </div>

          {/* Compteurs cliquables */}
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {/* Live - seulement pour aujourd'hui ou jours futurs */}
            {!isViewingPastDay && (
              <button
                onClick={() => setFilter(filter === 'live' ? 'all' : 'live')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'live'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>{liveCount} Live</span>
              </button>
            )}

            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                filter === 'all'
                  ? isViewingPastDay ? 'bg-violet-500 text-white' : 'bg-pink-500 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{todayCount} {isViewingPastDay ? 'Résultats' : 'Matchs'}</span>
            </button>

            {/* Terminé - pour les jours passés */}
            {isViewingPastDay ? (
              <button
                onClick={() => setFilter('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>{finishedCount} Terminés</span>
              </button>
            ) : (
              <button
                onClick={() => setFilter(filter === 'upcoming' ? 'all' : 'upcoming')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'upcoming'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{upcomingCount} À venir</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation par jour */}
      <div className="sticky top-20 z-40 bg-black/90 backdrop-blur-sm border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide" id="days-nav">
            {/* Label Résultats */}
            <div className="flex-shrink-0 flex items-center pr-3 mr-2 border-r border-gray-700">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Résultats</span>
            </div>

            {days.map((day, index) => {
              const isToday = day.dateStr === getDateString(new Date());
              const isSelected = selectedDay === day.dateStr;

              return (
                <button
                  key={day.dateStr}
                  onClick={() => {
                    setSelectedDay(day.dateStr);
                    setFilter('all');
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isSelected
                      ? day.isPast
                        ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white'
                        : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                      : isToday
                        ? 'text-pink-400 bg-pink-500/10 hover:bg-pink-500/20'
                        : day.isPast
                          ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {day.label}
                </button>
              );
            })}

            {/* Label À venir (après aujourd'hui) */}
            <div className="flex-shrink-0 flex items-center pl-3 ml-2 border-l border-gray-700">
              <span className="text-xs text-gray-500 uppercase tracking-wider">À venir</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtre compétitions - Premium Design */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          {/* Bouton ALL - reste sur cette page avec tous les matchs */}
          <button
            onClick={selectAllCompetitions}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              selectedCompetitions.length === allCompetitionIds.length
                ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/25'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            All
          </button>

          {/* Séparateur */}
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-700 to-transparent" />

          {/* Compétitions - liens vers la page des journées */}
          {allCompetitions.map(comp => {
            const isSelected = selectedCompetitions.length === 1 && selectedCompetitions.includes(comp.id);
            return (
              <Link
                key={comp.id}
                to={`/classements/matchday/${comp.id}`}
                className={`group relative flex-shrink-0 px-3 py-2 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-white/15 to-white/5 shadow-lg'
                    : 'hover:bg-white/5'
                }`}
                title={`Voir les journées - ${comp.name}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-base transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {comp.flag}
                  </span>
                  <span className={`text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                    isSelected ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                  }`}>
                    {comp.shortName}
                  </span>
                </div>
                {/* Barre de sélection en bas */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full transition-all duration-300 ${
                  isSelected ? 'w-6 opacity-100' : 'w-0 opacity-0'
                }`} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Contenu principal */}
      <main className="relative max-w-5xl mx-auto px-4 py-8">
        {/* Loading */}
        {loading && (
          <div className="space-y-6">
            <MatchSkeleton />
            <MatchSkeleton />
          </div>
        )}

        {/* Erreur */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
            <button
              onClick={fetchMatches}
              className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        )}

        {/* Contenu */}
        {!loading && !error && (
          <>
            {/* Matchs Live (toujours en haut si filter !== 'live') */}
            {filter !== 'live' && liveMatches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <h2 className="text-xl font-bold text-white">Matchs en direct</h2>
                </div>
                {groupedLiveMatches.map(group => (
                  <CompetitionSection
                    key={`live-${group.competition.id}`}
                    competition={group.competition}
                    matches={group.matches}
                    isCollapsed={collapsedCompetitions.has(group.competition.id)}
                    onToggle={() => toggleCollapse(group.competition.id)}
                  />
                ))}
              </div>
            )}

            {/* Message si aucun match */}
            {filter === 'live' && liveMatches.length === 0 && (
              <div className="text-center py-16">
                <Radio className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Aucun match en direct</h3>
                <p className="text-gray-500">Il n'y a pas de match en cours actuellement</p>
              </div>
            )}

            {filter !== 'live' && groupedMatches.length === 0 && (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Aucun match</h3>
                <p className="text-gray-500">Pas de match prévu pour cette date dans les compétitions sélectionnées</p>
              </div>
            )}

            {/* Liste des matchs Live uniquement */}
            {filter === 'live' && liveMatches.length > 0 && (
              <>
                {groupedLiveMatches.map(group => (
                  <CompetitionSection
                    key={group.competition.id}
                    competition={group.competition}
                    matches={group.matches}
                    isCollapsed={collapsedCompetitions.has(group.competition.id)}
                    onToggle={() => toggleCollapse(group.competition.id)}
                  />
                ))}
              </>
            )}

            {/* Liste des matchs (non-live) */}
            {filter !== 'live' && groupedMatches.length > 0 && (
              <>
                {filter === 'upcoming' && (
                  <h2 className="text-lg font-semibold text-gray-400 mb-4">
                    Matchs à venir
                  </h2>
                )}
                {groupedMatches.map(group => {
                  const displayMatches = filter === 'all'
                    ? group.matches.filter(m => m.status !== 'IN_PLAY' && m.status !== 'PAUSED')
                    : group.matches;

                  if (displayMatches.length === 0) return null;

                  return (
                    <CompetitionSection
                      key={group.competition.id}
                      competition={group.competition}
                      matches={displayMatches}
                      isCollapsed={collapsedCompetitions.has(group.competition.id)}
                      onToggle={() => toggleCollapse(group.competition.id)}
                    />
                  );
                })}
              </>
            )}
          </>
        )}

        {/* Indicateur auto-refresh */}
        {liveCount > 0 && (
          <div className="fixed bottom-4 right-4 px-3 py-2 bg-gray-900/90 backdrop-blur-sm rounded-full border border-gray-700 flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Auto-refresh actif
          </div>
        )}
      </main>
    </div>
  );
}
