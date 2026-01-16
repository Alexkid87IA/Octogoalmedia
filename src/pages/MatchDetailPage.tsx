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
  AlertCircle,
  Swords,
  Target,
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
  getMatchPlayerStats,
  formatDateFR,
} from '../services/apiFootball';
import OddsWidget from '../components/football/OddsWidget';
import { findMatchOdds } from '../services/oddsService';
import Footer from '../components/layout/Footer';
import { MatchOdds, formatOdds } from '../types/odds.types';
import { getAllArticles } from '../utils/sanityAPI';
import { SanityArticle } from '../types/sanity';
import {
  StatBar,
  EventIcon,
  FormBadge,
  FeaturedArticleSidebar,
  FlashInfoSidebar,
  MiniStandings,
  TopScorersWithToggle,
  TeamFormSidebar,
  MatchPreview,
  OtherMatchesSidebar,
  type TeamStanding,
  type Scorer,
  type Match,
} from '../components/match';

type TabType = 'events' | 'stats' | 'lineups' | 'h2h';

// =============================================
// COMPOSANT PRINCIPAL
// =============================================

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();

  // États données principales
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<Array<{
    type: string;
    detail?: string;
    team?: { id: number };
    player?: { id?: number; name?: string };
    assist?: { name?: string };
    time?: { elapsed?: number; extra?: number };
  }>>([]);
  const [stats, setStats] = useState<{
    home?: { possession?: number; shots?: number; shotsOnTarget?: number; corners?: number; fouls?: number; offsides?: number };
    away?: { possession?: number; shots?: number; shotsOnTarget?: number; corners?: number; fouls?: number; offsides?: number };
  } | null>(null);
  const [lineups, setLineups] = useState<{
    home?: { formation?: string; startXI?: Array<{ id?: number; name: string; number?: number; pos?: string }>; substitutes?: Array<{ id?: number; name: string }> };
    away?: { formation?: string; startXI?: Array<{ id?: number; name: string; number?: number; pos?: string }>; substitutes?: Array<{ id?: number; name: string }> };
  } | null>(null);
  const [h2h, setH2H] = useState<Match[]>([]);
  const [playerStats, setPlayerStats] = useState<Array<{
    team?: { id?: number; logo?: string };
    players?: Array<{
      name: string;
      teamId?: number;
      teamLogo?: string;
      rating?: number;
      goals?: number;
      assists?: number;
      keyPasses?: number;
      dribblesSuccess?: number;
    }>;
  }> | null>(null);

  // États sidebar
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [homeForm, setHomeForm] = useState<('W' | 'D' | 'L')[]>([]);
  const [awayForm, setAwayForm] = useState<('W' | 'D' | 'L')[]>([]);
  const [matchdayMatches, setMatchdayMatches] = useState<Match[]>([]);
  const [headerOdds, setHeaderOdds] = useState<MatchOdds | null>(null);
  const [flashArticles, setFlashArticles] = useState<SanityArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<SanityArticle | null>(null);

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
        const matchData = await getMatchDetails(fixtureId);

        if (!matchData) {
          setError('Match non trouvé');
          setLoading(false);
          return;
        }

        const liveStatuses = ['IN_PLAY', 'PAUSED', 'HALFTIME', '1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'];
        const isLive = liveStatuses.includes(matchData.status);

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

        // Appels sidebar en arrière-plan
        const competitionId = matchData.competition?.id;
        const homeTeamId = matchData.homeTeam?.id;
        const awayTeamId = matchData.awayTeam?.id;

        if (homeTeamId && awayTeamId) {
          getHeadToHead(homeTeamId, awayTeamId)
            .then((data) => setH2H(data || []))
            .catch(() => {});
        }

        if (matchData.status === 'FINISHED' || isLive) {
          getMatchPlayerStats(fixtureId, isLive)
            .then((data) => setPlayerStats(data))
            .catch(() => {});
        }

        if (matchData.status !== 'FINISHED' && competitionId) {
          findMatchOdds(matchData.homeTeam.name, matchData.awayTeam.name, competitionId)
            .then((odds) => setHeaderOdds(odds))
            .catch(() => {});
        }

        if (competitionId) {
          const round = matchData.round || '';
          const isRegularLeague = round.includes('Regular Season');
          const isLeaguePhase = round.includes('League Phase') || round.includes('League Stage');
          const isCupKnockout = !isRegularLeague && !isLeaguePhase && round.length > 0;

          let otherMatchesPromise: Promise<Match[]>;

          if (isCupKnockout && round) {
            otherMatchesPromise = getMatchesByRound(String(competitionId), round).catch(() => []);
          } else if (isLeaguePhase && round) {
            otherMatchesPromise = getMatchesByRound(String(competitionId), round).catch(() => []);
          } else {
            otherMatchesPromise = getMatchesByMatchday(String(competitionId), matchData.matchday).catch(() => []);
          }

          Promise.all([
            getStandings(String(competitionId)).catch(() => []),
            getTopScorers(String(competitionId)).catch(() => []),
            otherMatchesPromise,
          ]).then(([standingsData, scorersData, matchdayData]) => {
            setStandings(standingsData || []);
            setScorers(scorersData || []);
            setMatchdayMatches(matchdayData || []);
          });
        }

        if (homeTeamId) {
          getTeamLastResults(homeTeamId, 5)
            .then((results) => {
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
            .then((results) => {
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

  useEffect(() => {
    getAllArticles()
      .then((articles) => {
        if (articles && articles.length > 0) {
          const featured = articles.find((a) => a.isFeatured) || articles[0];
          setFeaturedArticle(featured);
          const flash = articles.filter((a) => a._id !== featured?._id).slice(0, 5);
          setFlashArticles(flash);
        }
      })
      .catch(() => {});
  }, []);

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
                <img src={match.competition.emblem} alt="" className="w-6 h-6 object-contain" loading="lazy" />
              )}
              <span className="text-gray-400 text-sm">{match.competition?.name}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 text-sm">
                {match.round && !match.round.includes('Regular Season') ? match.round : `J${match.matchday}`}
              </span>
            </div>
          </div>

          {/* Match Card */}
          <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            <div
              className={`h-1 bg-gradient-to-r ${
                isLive
                  ? 'from-red-500 via-pink-500 to-red-500'
                  : isFinished
                    ? 'from-gray-500 to-gray-600'
                    : 'from-blue-500 via-purple-500 to-pink-500'
              }`}
            />

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
              <div className="flex items-center justify-between gap-4 md:gap-8 max-w-2xl mx-auto">
                {/* Home Team */}
                <Link to={`/classements/club/${match.homeTeam.id}`} className="group text-center flex-1">
                  <img
                    src={match.homeTeam.crest}
                    alt={match.homeTeam.name}
                    className="w-16 h-16 md:w-24 md:h-24 object-contain mx-auto mb-2 group-hover:scale-110 transition-transform"
                  />
                  <h2 className="text-sm md:text-xl font-bold text-white group-hover:text-pink-400 transition-colors">
                    {match.homeTeam.name}
                  </h2>
                </Link>

                {/* Score */}
                <div className="text-center flex-shrink-0">
                  {isUpcoming ? (
                    <div>
                      <div className="text-4xl md:text-6xl font-black text-white">VS</div>
                      <div className="mt-2 text-gray-400 text-sm">{formatDateFR(match.utcDate)}</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-3 md:gap-4">
                        <span className="text-4xl md:text-6xl font-black text-white">
                          {match.score.fullTime.home ?? 0}
                        </span>
                        <span className="text-2xl md:text-4xl text-gray-600">-</span>
                        <span className="text-4xl md:text-6xl font-black text-white">
                          {match.score.fullTime.away ?? 0}
                        </span>
                      </div>
                      {match.score.halfTime.home !== null && (
                        <div className="mt-1 text-gray-500 text-xs md:text-sm">
                          MT: {match.score.halfTime.home} - {match.score.halfTime.away}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Away Team */}
                <Link to={`/classements/club/${match.awayTeam.id}`} className="group text-center flex-1">
                  <img
                    src={match.awayTeam.crest}
                    alt={match.awayTeam.name}
                    className="w-16 h-16 md:w-24 md:h-24 object-contain mx-auto mb-2 group-hover:scale-110 transition-transform"
                  />
                  <h2 className="text-sm md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {match.awayTeam.name}
                  </h2>
                </Link>
              </div>

              {/* Scorers Section */}
              {!isUpcoming &&
                events.filter((e) => e.type === 'Goal').length > 0 &&
                (() => {
                  const homeGoals = events.filter((e) => e.type === 'Goal' && e.team?.id === match.homeTeam.id);
                  const awayGoals = events.filter((e) => e.type === 'Goal' && e.team?.id === match.awayTeam.id);
                  const maxVisible = 7;

                  const scrollToEvents = () => {
                    setActiveTab('events');
                    const eventsSection = document.getElementById('match-tabs');
                    if (eventsSection) {
                      eventsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  };

                  return (
                    <div className="mt-3 flex items-start justify-between gap-4 md:gap-8 max-w-2xl mx-auto">
                      <div className="flex-1 flex flex-col items-end">
                        {homeGoals.slice(0, maxVisible).map((goal, idx) => (
                          <div key={idx} className="text-xs text-gray-400 flex items-center gap-1">
                            <span>
                              {goal.player?.name?.split(' ').pop()} {goal.time?.elapsed}'
                              {goal.time?.extra ? `+${goal.time.extra}` : ''}
                              {goal.detail?.includes('Penalty') ? ' (P)' : ''}
                            </span>
                            <span className="text-pink-400">⚽</span>
                          </div>
                        ))}
                        {homeGoals.length > maxVisible && (
                          <button
                            type="button"
                            onClick={scrollToEvents}
                            className="text-[10px] text-pink-400 hover:text-pink-300 mt-1 cursor-pointer"
                          >
                            +{homeGoals.length - maxVisible} autres →
                          </button>
                        )}
                      </div>
                      <div className="flex-shrink-0 w-8" />
                      <div className="flex-1 flex flex-col items-start">
                        {awayGoals.slice(0, maxVisible).map((goal, idx) => (
                          <div key={idx} className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="text-blue-400">⚽</span>
                            <span>
                              {goal.player?.name?.split(' ').pop()} {goal.time?.elapsed}'
                              {goal.time?.extra ? `+${goal.time.extra}` : ''}
                              {goal.detail?.includes('Penalty') ? ' (P)' : ''}
                            </span>
                          </div>
                        ))}
                        {awayGoals.length > maxVisible && (
                          <button
                            type="button"
                            onClick={scrollToEvents}
                            className="text-[10px] text-blue-400 hover:text-blue-300 mt-1 cursor-pointer"
                          >
                            +{awayGoals.length - maxVisible} autres →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* Cards Section */}
              {!isUpcoming &&
                events.filter((e) => e.type === 'Card').length > 0 &&
                (() => {
                  const homeCards = events.filter((e) => e.type === 'Card' && e.team?.id === match.homeTeam.id);
                  const awayCards = events.filter((e) => e.type === 'Card' && e.team?.id === match.awayTeam.id);

                  const getCardEmoji = (detail: string) => {
                    if (detail?.includes('Red') || detail?.includes('Second Yellow')) return '🟥';
                    return '🟨';
                  };

                  if (homeCards.length === 0 && awayCards.length === 0) return null;

                  return (
                    <div className="mt-2 flex items-start justify-between gap-4 md:gap-8 max-w-2xl mx-auto opacity-70">
                      <div className="flex-1 flex flex-col items-end">
                        {homeCards.slice(0, 4).map((card, idx) => (
                          <div key={idx} className="text-[10px] text-gray-500 flex items-center gap-1">
                            <span>
                              {card.player?.name?.split(' ').pop()} {card.time?.elapsed}'
                            </span>
                            <span>{getCardEmoji(card.detail || '')}</span>
                          </div>
                        ))}
                        {homeCards.length > 4 && <span className="text-[9px] text-gray-600">+{homeCards.length - 4}</span>}
                      </div>
                      <div className="flex-shrink-0 w-8" />
                      <div className="flex-1 flex flex-col items-start">
                        {awayCards.slice(0, 4).map((card, idx) => (
                          <div key={idx} className="text-[10px] text-gray-500 flex items-center gap-1">
                            <span>{getCardEmoji(card.detail || '')}</span>
                            <span>
                              {card.player?.name?.split(' ').pop()} {card.time?.elapsed}'
                            </span>
                          </div>
                        ))}
                        {awayCards.length > 4 && <span className="text-[9px] text-gray-600">+{awayCards.length - 4}</span>}
                      </div>
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
                    <img src="/images/winamax-logo.png" alt="Winamax" className="w-6 h-6 rounded object-contain" />
                    <span className="text-sm text-gray-400">Cotes Winamax</span>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">1</span>
                      <span
                        className={`text-xl font-bold ${
                          headerOdds.odds.winamax.home ===
                          Math.min(headerOdds.odds.winamax.home, headerOdds.odds.winamax.draw, headerOdds.odds.winamax.away)
                            ? 'text-green-400'
                            : 'text-white'
                        }`}
                      >
                        {formatOdds(headerOdds.odds.winamax.home)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">N</span>
                      <span
                        className={`text-xl font-bold ${
                          headerOdds.odds.winamax.draw ===
                          Math.min(headerOdds.odds.winamax.home, headerOdds.odds.winamax.draw, headerOdds.odds.winamax.away)
                            ? 'text-green-400'
                            : 'text-white'
                        }`}
                      >
                        {formatOdds(headerOdds.odds.winamax.draw)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">2</span>
                      <span
                        className={`text-xl font-bold ${
                          headerOdds.odds.winamax.away ===
                          Math.min(headerOdds.odds.winamax.home, headerOdds.odds.winamax.draw, headerOdds.odds.winamax.away)
                            ? 'text-green-400'
                            : 'text-white'
                        }`}
                      >
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

      {/* Tabs */}
      {!isUpcoming && (
        <section id="match-tabs" className="sticky top-20 z-30 bg-black/90 backdrop-blur-xl border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
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
            {isUpcoming ? (
              <MatchPreview
                match={match}
                h2h={h2h}
                homeForm={homeForm}
                awayForm={awayForm}
                standings={standings}
                headerOdds={headerOdds}
                formatDateFR={formatDateFR}
              />
            ) : (
              <AnimatePresence mode="wait">
                {/* Events Tab */}
                {activeTab === 'events' && (
                  <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-4 md:p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-pink-500" />
                        Temps forts
                      </h3>

                      {events.length === 0 ? (
                        <div className="text-center py-8">
                          <Clock className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">Aucun événement</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {(() => {
                            const sortedEvents = [...events].sort((a, b) => {
                              const timeA = (a.time?.elapsed || 0) + (a.time?.extra || 0) / 100;
                              const timeB = (b.time?.elapsed || 0) + (b.time?.extra || 0) / 100;
                              return timeB - timeA;
                            });

                            const goalsChronological = events
                              .filter((e) => e.type === 'Goal')
                              .sort((a, b) => {
                                const timeA = (a.time?.elapsed || 0) + (a.time?.extra || 0) / 100;
                                const timeB = (b.time?.elapsed || 0) + (b.time?.extra || 0) / 100;
                                return timeA - timeB;
                              });

                            let homeScore = 0;
                            let awayScore = 0;
                            const scoreAtGoal = new Map<typeof goalsChronological[number], { home: number; away: number }>();

                            goalsChronological.forEach((goal) => {
                              if (goal.team?.id === match.homeTeam.id) homeScore++;
                              else awayScore++;
                              scoreAtGoal.set(goal, { home: homeScore, away: awayScore });
                            });

                            const hasHalfTime = sortedEvents.some((e) => (e.time?.elapsed || 0) > 45);

                            return sortedEvents.map((event, idx) => {
                              const isHome = event.team?.id === match.homeTeam.id;
                              const isGoal = event.type === 'Goal';
                              const currentScore = isGoal ? scoreAtGoal.get(event) : null;
                              const showHalfTime =
                                hasHalfTime &&
                                idx > 0 &&
                                (sortedEvents[idx - 1].time?.elapsed || 0) > 45 &&
                                (event.time?.elapsed || 0) <= 45;

                              return (
                                <div key={idx}>
                                  {showHalfTime && (
                                    <div className="flex items-center gap-4 py-3 my-2">
                                      <div className="flex-1 h-px bg-white/20" />
                                      <span className="text-gray-500 text-xs font-medium px-3 py-1 bg-white/5 rounded">
                                        MI-TEMPS{' '}
                                        {match.score.halfTime.home !== null
                                          ? `${match.score.halfTime.home} - ${match.score.halfTime.away}`
                                          : ''}
                                      </span>
                                      <div className="flex-1 h-px bg-white/20" />
                                    </div>
                                  )}

                                  <div
                                    className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-colors ${
                                      isGoal ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5 hover:bg-white/10'
                                    } ${isHome ? '' : 'flex-row-reverse'}`}
                                  >
                                    <div className="w-10 md:w-12 text-center flex-shrink-0">
                                      <span className={`font-bold text-sm ${isGoal ? 'text-green-400' : 'text-pink-400'}`}>
                                        {event.time?.elapsed}'
                                      </span>
                                      {(event.time?.extra ?? 0) > 0 && (
                                        <span className="text-gray-500 text-xs">+{event.time?.extra}</span>
                                      )}
                                    </div>
                                    <EventIcon type={event.type} detail={event.detail || ''} />
                                    <div className={`flex-1 min-w-0 ${isHome ? '' : 'text-right'}`}>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {event.assist?.name && event.type === 'Goal' && (
                                          <span className={`text-gray-500 text-xs ${isHome ? '' : 'order-last'}`}>
                                            (P. {event.assist.name.split(' ').pop()})
                                          </span>
                                        )}
                                        {event.player?.id ? (
                                          <Link
                                            to={`/player/${event.player.id}`}
                                            className={`text-white font-medium text-sm hover:text-pink-400 truncate ${isHome ? '' : 'ml-auto'}`}
                                          >
                                            {event.player.name}
                                          </Link>
                                        ) : (
                                          <span className="text-white font-medium text-sm truncate">
                                            {event.player?.name || 'Événement'}
                                          </span>
                                        )}
                                      </div>
                                      {event.type === 'subst' && event.assist?.name && (
                                        <p className="text-red-400 text-xs">↓ {event.assist.name}</p>
                                      )}
                                    </div>
                                    {isGoal && currentScore && (
                                      <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded text-sm font-bold flex-shrink-0">
                                        <span className="text-white">{currentScore.home}</span>
                                        <span className="text-gray-500">-</span>
                                        <span className="text-white">{currentScore.away}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Stats Joueurs */}
                    {playerStats && playerStats.length > 0 && (
                      <div className="mt-6 bg-gray-900/50 rounded-2xl border border-white/10 p-4 md:p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          Stats Joueurs
                        </h3>

                        {(() => {
                          const allPlayers = playerStats.flatMap((team) =>
                            (team.players || []).map((p) => ({ ...p, teamId: team.team?.id, teamLogo: team.team?.logo }))
                          );

                          const topRated = allPlayers
                            .filter((p) => p.rating && p.rating > 0)
                            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                            .slice(0, 3);

                          const topScorers = allPlayers
                            .filter((p) => (p.goals ?? 0) > 0)
                            .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))
                            .slice(0, 3);

                          const topAssisters = allPlayers
                            .filter((p) => (p.assists ?? 0) > 0)
                            .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))
                            .slice(0, 3);

                          const topKeyPasses = allPlayers
                            .filter((p) => (p.keyPasses ?? 0) > 0)
                            .sort((a, b) => (b.keyPasses ?? 0) - (a.keyPasses ?? 0))
                            .slice(0, 3);

                          const topDribblers = allPlayers
                            .filter((p) => (p.dribblesSuccess ?? 0) > 0)
                            .sort((a, b) => (b.dribblesSuccess ?? 0) - (a.dribblesSuccess ?? 0))
                            .slice(0, 3);

                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {topRated.length > 0 && (
                                <div className="bg-white/5 rounded-xl p-4">
                                  <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    Meilleures notes
                                  </h4>
                                  <div className="space-y-2">
                                    {topRated.map((p, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs w-4">#{idx + 1}</span>
                                        <img src={p.teamLogo} alt="" className="w-4 h-4" loading="lazy" />
                                        <span className="text-white text-sm flex-1 truncate">{p.name}</span>
                                        <span className="text-yellow-400 font-bold text-sm">{p.rating?.toFixed(1)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {topScorers.length > 0 && (
                                <div className="bg-white/5 rounded-xl p-4">
                                  <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-500" />
                                    Buteurs
                                  </h4>
                                  <div className="space-y-2">
                                    {topScorers.map((p, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs w-4">#{idx + 1}</span>
                                        <img src={p.teamLogo} alt="" className="w-4 h-4" loading="lazy" />
                                        <span className="text-white text-sm flex-1 truncate">{p.name}</span>
                                        <span className="text-green-400 font-bold text-sm">{p.goals}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {topAssisters.length > 0 && (
                                <div className="bg-white/5 rounded-xl p-4">
                                  <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-blue-500" />
                                    Passeurs décisifs
                                  </h4>
                                  <div className="space-y-2">
                                    {topAssisters.map((p, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs w-4">#{idx + 1}</span>
                                        <img src={p.teamLogo} alt="" className="w-4 h-4" loading="lazy" />
                                        <span className="text-white text-sm flex-1 truncate">{p.name}</span>
                                        <span className="text-blue-400 font-bold text-sm">{p.assists}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {topKeyPasses.length > 0 && (
                                <div className="bg-white/5 rounded-xl p-4">
                                  <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                    Passes clés
                                  </h4>
                                  <div className="space-y-2">
                                    {topKeyPasses.map((p, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs w-4">#{idx + 1}</span>
                                        <img src={p.teamLogo} alt="" className="w-4 h-4" loading="lazy" />
                                        <span className="text-white text-sm flex-1 truncate">{p.name}</span>
                                        <span className="text-purple-400 font-bold text-sm">{p.keyPasses}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {topDribblers.length > 0 && (
                                <div className="bg-white/5 rounded-xl p-4">
                                  <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                    <Swords className="w-4 h-4 text-pink-500" />
                                    Dribbles réussis
                                  </h4>
                                  <div className="space-y-2">
                                    {topDribblers.map((p, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs w-4">#{idx + 1}</span>
                                        <img src={p.teamLogo} alt="" className="w-4 h-4" loading="lazy" />
                                        <span className="text-white text-sm flex-1 truncate">{p.name}</span>
                                        <span className="text-pink-400 font-bold text-sm">{p.dribblesSuccess}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
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
                              <img src={match.homeTeam.crest} alt="" className="w-8 h-8" loading="lazy" />
                              <span className="text-white font-bold text-sm hidden md:inline">{match.homeTeam.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm hidden md:inline">{match.awayTeam.name}</span>
                              <img src={match.awayTeam.crest} alt="" className="w-8 h-8" loading="lazy" />
                            </div>
                          </div>
                          <StatBar
                            label="Possession"
                            homeValue={stats.home?.possession || 0}
                            awayValue={stats.away?.possession || 0}
                            isPercentage
                          />
                          <StatBar label="Tirs" homeValue={stats.home?.shots || 0} awayValue={stats.away?.shots || 0} />
                          <StatBar
                            label="Tirs cadrés"
                            homeValue={stats.home?.shotsOnTarget || 0}
                            awayValue={stats.away?.shotsOnTarget || 0}
                          />
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
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <img src={match.homeTeam.crest} alt="" className="w-8 h-8" loading="lazy" />
                              <div>
                                <h4 className="text-white font-bold text-sm">{match.homeTeam.name}</h4>
                                <p className="text-pink-400 text-xs">{lineups.home?.formation}</p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {(lineups.home?.startXI || []).map((p, i) => (
                                <Link
                                  key={i}
                                  to={p.id ? `/player/${p.id}` : '#'}
                                  className="flex items-center gap-2 p-2 rounded hover:bg-white/5 text-sm"
                                >
                                  <span className="w-6 h-6 flex items-center justify-center bg-pink-500/30 text-pink-400 rounded text-xs font-bold">
                                    {p.number || i + 1}
                                  </span>
                                  <span className="text-white flex-1">{p.name}</span>
                                  <span className="text-gray-500 text-xs">{p.pos}</span>
                                </Link>
                              ))}
                            </div>
                            {lineups.home?.substitutes && lineups.home.substitutes.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-gray-500 text-xs mb-2">Remplaçants</p>
                                <div className="flex flex-wrap gap-1">
                                  {lineups.home.substitutes.map((p, i) => (
                                    <Link
                                      key={i}
                                      to={p.id ? `/player/${p.id}` : '#'}
                                      className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 hover:bg-white/10"
                                    >
                                      {p.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <img src={match.awayTeam.crest} alt="" className="w-8 h-8" loading="lazy" />
                              <div>
                                <h4 className="text-white font-bold text-sm">{match.awayTeam.name}</h4>
                                <p className="text-blue-400 text-xs">{lineups.away?.formation}</p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {(lineups.away?.startXI || []).map((p, i) => (
                                <Link
                                  key={i}
                                  to={p.id ? `/player/${p.id}` : '#'}
                                  className="flex items-center gap-2 p-2 rounded hover:bg-white/5 text-sm"
                                >
                                  <span className="w-6 h-6 flex items-center justify-center bg-blue-500/30 text-blue-400 rounded text-xs font-bold">
                                    {p.number || i + 1}
                                  </span>
                                  <span className="text-white flex-1">{p.name}</span>
                                  <span className="text-gray-500 text-xs">{p.pos}</span>
                                </Link>
                              ))}
                            </div>
                            {lineups.away?.substitutes && lineups.away.substitutes.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-gray-500 text-xs mb-2">Remplaçants</p>
                                <div className="flex flex-wrap gap-1">
                                  {lineups.away.substitutes.map((p, i) => (
                                    <Link
                                      key={i}
                                      to={p.id ? `/player/${p.id}` : '#'}
                                      className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 hover:bg-white/10"
                                    >
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
                          {h2h
                            .filter((m) => m.id !== match.id)
                            .slice(0, 8)
                            .map((m) => (
                              <Link
                                key={m.id}
                                to={`/match/${m.id}`}
                                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <span className="text-gray-500 text-xs w-20">{formatDateFR(m.utcDate)}</span>
                                <img src={m.homeTeam.crest} alt="" className="w-5 h-5" loading="lazy" />
                                <span className="text-gray-300 text-sm flex-1 truncate">{m.homeTeam.name}</span>
                                <span className="text-white font-bold">
                                  {m.score.fullTime.home} - {m.score.fullTime.away}
                                </span>
                                <span className="text-gray-300 text-sm flex-1 truncate text-right">{m.awayTeam.name}</span>
                                <img src={m.awayTeam.crest} alt="" className="w-5 h-5" loading="lazy" />
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
            <FeaturedArticleSidebar article={featuredArticle} />
            <FlashInfoSidebar articles={flashArticles} />

            {(() => {
              const round = match.round || '';
              const isKnockout =
                round.includes('Final') ||
                round.includes('Quarter') ||
                round.includes('Semi') ||
                round.includes('Round of') ||
                round.includes('8th') ||
                round.includes('16th') ||
                round.includes('Knockout') ||
                round.includes('Play-off');
              const isGroupStage = round.includes('Group');

              if (isKnockout && !isGroupStage) {
                return (
                  <>
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
                    <TeamFormSidebar homeForm={homeForm} awayForm={awayForm} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
                    <OddsWidget
                      homeTeam={match.homeTeam.name}
                      awayTeam={match.awayTeam.name}
                      competitionId={match.competition?.id || 0}
                      matchStatus={match.status}
                    />
                    <TopScorersWithToggle scorers={scorers} competitionId={match.competition?.id || 0} />
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

              return (
                <>
                  <MiniStandings
                    standings={standings}
                    homeTeamId={match.homeTeam.id}
                    awayTeamId={match.awayTeam.id}
                    competitionId={match.competition?.id || 0}
                  />
                  <TeamFormSidebar homeForm={homeForm} awayForm={awayForm} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
                  <OddsWidget
                    homeTeam={match.homeTeam.name}
                    awayTeam={match.awayTeam.name}
                    competitionId={match.competition?.id || 0}
                    matchStatus={match.status}
                  />
                  <TopScorersWithToggle scorers={scorers} competitionId={match.competition?.id || 0} />
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

      <Footer />
    </div>
  );
}
