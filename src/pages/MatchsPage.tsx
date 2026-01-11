import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  getTodayFixtures,
  getMatchesByMatchday,
  getNextFixtures,
  getLastResults,
  getCurrentMatchday,
  getStandings,
  LEAGUES,
  LEAGUE_INFO,
  formatDateFR,
} from '../services/apiFootball';
import {
  Play,
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  Users,
  Filter,
  X,
  Maximize2,
  RefreshCw,
  Bell,
  Star
} from 'lucide-react';

// Types
interface Match {
  id: number;
  matchday: number;
  utcDate: string;
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
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
    code: string;
    emblem: string;
  };
}

type LeagueKey = keyof typeof LEAGUES;
type ViewMode = 'live' | 'today' | 'upcoming' | 'results' | 'matchday';

// Particle component for background effects
const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-pink-500/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, Math.random() * -500],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Live Score Ticker Component
const LiveScoreTicker = ({ matches }: { matches: Match[] }) => {
  const liveMatches = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  const tickerRef = useRef<HTMLDivElement>(null);

  if (liveMatches.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-3 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-gray-500 rounded-full" />
          <span className="text-gray-400 text-sm">Aucun match en direct actuellement</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-red-900/50 via-pink-900/50 to-red-900/50 py-3 border-b border-red-500/30 overflow-hidden">
      {/* Pulsing background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="flex items-center gap-2 pr-4 border-r border-red-500/30">
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
            <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Live</span>
          </div>

          {/* Scrolling matches */}
          <div ref={tickerRef} className="flex-1 overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ x: [0, -50 * liveMatches.length] }}
              transition={{ duration: liveMatches.length * 5, repeat: Infinity, ease: "linear" }}
            >
              {[...liveMatches, ...liveMatches].map((match, idx) => (
                <Link
                  key={`${match.id}-${idx}`}
                  to={`/football/club/${match.homeTeam.id}`}
                  className="flex items-center gap-3 whitespace-nowrap group"
                >
                  <img src={match.homeTeam.crest} alt="" className="w-5 h-5 object-contain" />
                  <span className="text-white font-medium group-hover:text-pink-400 transition-colors">
                    {match.homeTeam.shortName || match.homeTeam.name}
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {match.score.fullTime.home ?? 0} - {match.score.fullTime.away ?? 0}
                  </span>
                  <span className="text-white font-medium group-hover:text-pink-400 transition-colors">
                    {match.awayTeam.shortName || match.awayTeam.name}
                  </span>
                  <img src={match.awayTeam.crest} alt="" className="w-5 h-5 object-contain" />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Match Card Component with Glassmorphism
const MatchCard = ({
  match,
  onFocus,
  featured = false
}: {
  match: Match;
  onFocus: () => void;
  featured?: boolean;
}) => {
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const isUpcoming = match.status === 'SCHEDULED' || match.status === 'TIMED';

  const getStatusColor = () => {
    if (isLive) return 'from-red-500 to-pink-500';
    if (isFinished) return 'from-gray-500 to-gray-600';
    return 'from-blue-500 to-cyan-500';
  };

  const getStatusText = () => {
    if (isLive) return 'EN DIRECT';
    if (isFinished) return 'TERMINÉ';
    return formatDateFR(match.utcDate);
  };

  // Calculate countdown for upcoming matches
  const getCountdown = () => {
    if (!isUpcoming) return null;
    const now = new Date();
    const matchDate = new Date(match.utcDate);
    const diff = matchDate.getTime() - now.getTime();

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative group ${featured ? 'col-span-2 row-span-2' : ''}`}
    >
      {/* Glassmorphism card */}
      <div className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-xl border border-white/10
        hover:border-white/20 transition-all duration-500
        ${isLive ? 'ring-2 ring-red-500/50 shadow-lg shadow-red-500/20' : ''}
        ${featured ? 'p-8' : 'p-5'}
      `}>
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor()} opacity-5 group-hover:opacity-10 transition-opacity`} />

        {/* Competition badge */}
        {match.competition && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {match.competition.emblem && (
              <img src={match.competition.emblem} alt="" className="w-5 h-5 object-contain opacity-50" />
            )}
          </div>
        )}

        {/* Focus button */}
        <button
          onClick={onFocus}
          className="absolute top-3 left-3 p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
        >
          <Maximize2 className="w-4 h-4 text-white" />
        </button>

        {/* Status badge */}
        <div className="flex justify-center mb-4">
          <div className={`
            inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            bg-gradient-to-r ${getStatusColor()} text-white
          `}>
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            )}
            {getStatusText()}
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <Link
            to={`/football/club/${match.homeTeam.id}`}
            className="flex-1 text-center group/team"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto mb-3"
              style={{ width: featured ? 80 : 56, height: featured ? 80 : 56 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-xl opacity-0 group-hover/team:opacity-30 transition-opacity" />
              <img
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                className="relative w-full h-full object-contain drop-shadow-lg"
              />
            </motion.div>
            <h3 className={`font-bold text-white group-hover/team:text-pink-400 transition-colors line-clamp-1 ${featured ? 'text-lg' : 'text-sm'}`}>
              {match.homeTeam.shortName || match.homeTeam.name}
            </h3>
          </Link>

          {/* Score */}
          <div className="flex flex-col items-center px-4">
            {isUpcoming ? (
              <div className="text-center">
                <div className={`font-bold text-white ${featured ? 'text-4xl' : 'text-2xl'}`}>VS</div>
                {getCountdown() && (
                  <div className="mt-2 px-3 py-1 bg-blue-500/20 rounded-full">
                    <span className="text-blue-400 text-xs font-medium">{getCountdown()}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.span
                  key={match.score.fullTime.home}
                  initial={{ scale: 1.5, color: '#ec4899' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className={`font-black ${featured ? 'text-5xl' : 'text-3xl'}`}
                >
                  {match.score.fullTime.home ?? 0}
                </motion.span>
                <span className={`text-gray-500 ${featured ? 'text-3xl' : 'text-xl'}`}>-</span>
                <motion.span
                  key={match.score.fullTime.away}
                  initial={{ scale: 1.5, color: '#ec4899' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className={`font-black ${featured ? 'text-5xl' : 'text-3xl'}`}
                >
                  {match.score.fullTime.away ?? 0}
                </motion.span>
              </div>
            )}

            {/* Half-time score */}
            {isFinished && match.score.halfTime.home !== null && (
              <div className="mt-1 text-xs text-gray-500">
                MT: {match.score.halfTime.home} - {match.score.halfTime.away}
              </div>
            )}
          </div>

          {/* Away Team */}
          <Link
            to={`/football/club/${match.awayTeam.id}`}
            className="flex-1 text-center group/team"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto mb-3"
              style={{ width: featured ? 80 : 56, height: featured ? 80 : 56 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-xl opacity-0 group-hover/team:opacity-30 transition-opacity" />
              <img
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                className="relative w-full h-full object-contain drop-shadow-lg"
              />
            </motion.div>
            <h3 className={`font-bold text-white group-hover/team:text-pink-400 transition-colors line-clamp-1 ${featured ? 'text-lg' : 'text-sm'}`}>
              {match.awayTeam.shortName || match.awayTeam.name}
            </h3>
          </Link>
        </div>

        {/* Matchday info */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs text-gray-400">
          <span>Journée {match.matchday}</span>
          {match.competition && (
            <>
              <span>•</span>
              <span>{match.competition.name}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Focus Match Modal
const FocusMatchModal = ({ match, onClose }: { match: Match | null; onClose: () => void }) => {
  if (!match) return null;

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Header gradient */}
          <div className={`h-2 bg-gradient-to-r ${isLive ? 'from-red-500 via-pink-500 to-red-500' : 'from-blue-500 via-purple-500 to-pink-500'}`} />

          <div className="p-8 md:p-12">
            {/* Live badge */}
            {isLive && (
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-full">
                  <div className="relative">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  </div>
                  <span className="text-red-400 font-bold uppercase tracking-wider">Match en direct</span>
                </div>
              </div>
            )}

            {/* Teams and Score */}
            <div className="flex items-center justify-center gap-8 md:gap-16">
              {/* Home Team */}
              <div className="text-center">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  src={match.homeTeam.crest}
                  alt={match.homeTeam.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto mb-4"
                />
                <h2 className="text-xl md:text-2xl font-bold text-white">{match.homeTeam.name}</h2>
              </div>

              {/* Score */}
              <div className="text-center">
                <div className="flex items-center gap-4">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl md:text-8xl font-black text-white"
                  >
                    {match.score.fullTime.home ?? 0}
                  </motion.span>
                  <span className="text-4xl md:text-6xl text-gray-600">:</span>
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl md:text-8xl font-black text-white"
                  >
                    {match.score.fullTime.away ?? 0}
                  </motion.span>
                </div>
                {match.score.halfTime.home !== null && (
                  <div className="mt-2 text-gray-500">
                    Mi-temps: {match.score.halfTime.home} - {match.score.halfTime.away}
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="text-center">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  src={match.awayTeam.crest}
                  alt={match.awayTeam.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto mb-4"
                />
                <h2 className="text-xl md:text-2xl font-bold text-white">{match.awayTeam.name}</h2>
              </div>
            </div>

            {/* Match Info */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-white/5 rounded-xl text-gray-400 text-sm">
                <Calendar className="w-4 h-4 inline mr-2" />
                {formatDateFR(match.utcDate)}
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-xl text-gray-400 text-sm">
                <Trophy className="w-4 h-4 inline mr-2" />
                {match.competition?.name}
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-xl text-gray-400 text-sm">
                Journée {match.matchday}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to={`/football/club/${match.homeTeam.id}`}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Voir {match.homeTeam.shortName || match.homeTeam.name}
              </Link>
              <Link
                to={`/football/club/${match.awayTeam.id}`}
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
              >
                Voir {match.awayTeam.shortName || match.awayTeam.name}
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Page Component
export default function MatchsPage() {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [selectedLeague, setSelectedLeague] = useState<LeagueKey | 'ALL'>('ALL');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusMatch, setFocusMatch] = useState<Match | null>(null);
  const [currentMatchday, setCurrentMatchday] = useState(1);
  const [selectedMatchday, setSelectedMatchday] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Fetch matches based on view mode
  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        let data: Match[] = [];

        if (viewMode === 'today' || viewMode === 'live') {
          data = await getTodayFixtures();
        } else if (viewMode === 'upcoming') {
          if (selectedLeague === 'ALL') {
            // Fetch from all leagues
            const promises = Object.values(LEAGUES).map(code => getNextFixtures(code, 5));
            const results = await Promise.all(promises);
            data = results.flat().sort((a, b) =>
              new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
            );
          } else {
            data = await getNextFixtures(LEAGUES[selectedLeague], 20);
          }
        } else if (viewMode === 'results') {
          if (selectedLeague === 'ALL') {
            const promises = Object.values(LEAGUES).map(code => getLastResults(code, 5));
            const results = await Promise.all(promises);
            data = results.flat().sort((a, b) =>
              new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
            );
          } else {
            data = await getLastResults(LEAGUES[selectedLeague], 20);
          }
        } else if (viewMode === 'matchday' && selectedLeague !== 'ALL') {
          const md = await getCurrentMatchday(LEAGUES[selectedLeague]);
          setCurrentMatchday(md);
          setSelectedMatchday(md);
          data = await getMatchesByMatchday(LEAGUES[selectedLeague], md);
        }

        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [viewMode, selectedLeague]);

  // Fetch matchday when it changes
  useEffect(() => {
    async function fetchMatchday() {
      if (viewMode !== 'matchday' || selectedLeague === 'ALL') return;

      setLoading(true);
      try {
        const data = await getMatchesByMatchday(LEAGUES[selectedLeague], selectedMatchday);
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matchday:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatchday();
  }, [selectedMatchday, viewMode, selectedLeague]);

  // Refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Re-fetch current view
    const event = new Event('refresh');
    window.dispatchEvent(event);
    setRefreshing(false);
  };

  // Filter matches by league if needed
  const filteredMatches = selectedLeague === 'ALL'
    ? matches
    : matches.filter(m => m.competition?.code === LEAGUES[selectedLeague]);

  // Separate live, upcoming and finished
  const liveMatches = filteredMatches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  const upcomingMatches = filteredMatches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');
  const finishedMatches = filteredMatches.filter(m => m.status === 'FINISHED');

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <Particles />
      </div>

      {/* Live Score Ticker */}
      <div className="fixed top-20 left-0 right-0 z-40">
        <LiveScoreTicker matches={matches} />
      </div>

      {/* Main Content */}
      <div className="relative pt-36 pb-20">
        {/* Hero Section */}
        <motion.section
          style={{ opacity: headerOpacity }}
          className="relative py-16 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-pink-500" />
              <span className="text-pink-400 font-medium text-sm">Match Center Live</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6"
            >
              <span className="text-white">Tous les </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                Matchs
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8"
            >
              Scores en direct, calendriers, résultats et analyses. Tout le football en temps réel.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 md:gap-12"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{liveMatches.length}</div>
                <div className="text-gray-500 text-sm">En direct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{upcomingMatches.length}</div>
                <div className="text-gray-500 text-sm">À venir</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{finishedMatches.length}</div>
                <div className="text-gray-500 text-sm">Terminés</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Filters Section */}
        <section className="sticky top-32 z-30 py-4 bg-black/80 backdrop-blur-xl border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* View Mode Tabs */}
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl">
                {[
                  { id: 'today', label: 'Aujourd\'hui', icon: Calendar },
                  { id: 'live', label: 'En direct', icon: Play },
                  { id: 'upcoming', label: 'À venir', icon: Clock },
                  { id: 'results', label: 'Résultats', icon: Trophy },
                  { id: 'matchday', label: 'Journée', icon: Target },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setViewMode(tab.id as ViewMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      viewMode === tab.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* League Filter */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setSelectedLeague('ALL')}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                    selectedLeague === 'ALL'
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Toutes
                </button>
                {(Object.keys(LEAGUES) as LeagueKey[]).map((league) => {
                  const info = LEAGUE_INFO[LEAGUES[league]];
                  return (
                    <button
                      key={league}
                      onClick={() => setSelectedLeague(league)}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                        selectedLeague === league
                          ? `bg-gradient-to-r ${info.color} text-white`
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {info.flag}
                    </button>
                  );
                })}
              </div>

              {/* Refresh button */}
              <motion.button
                onClick={handleRefresh}
                animate={{ rotate: refreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}
                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all ml-auto"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Matchday Navigation (only for matchday view) */}
            {viewMode === 'matchday' && selectedLeague !== 'ALL' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 flex items-center justify-center gap-4"
              >
                <button
                  onClick={() => setSelectedMatchday(Math.max(1, selectedMatchday - 1))}
                  disabled={selectedMatchday <= 1}
                  className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg">Journée {selectedMatchday}</span>
                  {selectedMatchday === currentMatchday && (
                    <span className="px-2 py-0.5 bg-pink-500 text-white text-xs font-bold rounded-full">
                      Actuelle
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedMatchday(selectedMatchday + 1)}
                  disabled={selectedMatchday >= LEAGUE_INFO[LEAGUES[selectedLeague]].totalMatchdays}
                  className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {selectedMatchday !== currentMatchday && (
                  <button
                    onClick={() => setSelectedMatchday(currentMatchday)}
                    className="text-pink-400 text-sm hover:underline ml-4"
                  >
                    Retour à J{currentMatchday}
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* Matches Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-400">Chargement des matchs...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Aucun match trouvé</h3>
              <p className="text-gray-400">Essayez de changer les filtres ou la date</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {/* Live Matches Section */}
              {viewMode !== 'results' && liveMatches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">En direct</h2>
                    <span className="text-gray-500">({liveMatches.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveMatches.map((match, idx) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onFocus={() => setFocusMatch(match)}
                        featured={idx === 0 && liveMatches.length > 2}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Upcoming Matches Section */}
              {viewMode !== 'results' && upcomingMatches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h2 className="text-2xl font-bold text-white">À venir</h2>
                    <span className="text-gray-500">({upcomingMatches.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onFocus={() => setFocusMatch(match)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Finished Matches Section */}
              {(viewMode === 'results' || viewMode === 'today' || viewMode === 'matchday') && finishedMatches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-white">Résultats</h2>
                    <span className="text-gray-500">({finishedMatches.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {finishedMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onFocus={() => setFocusMatch(match)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>
      </div>

      {/* Focus Match Modal */}
      {focusMatch && (
        <FocusMatchModal match={focusMatch} onClose={() => setFocusMatch(null)} />
      )}
    </div>
  );
}
