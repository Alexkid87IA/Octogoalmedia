import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  getTeams,
  getStandings,
  LEAGUES,
  LEAGUE_INFO,
} from '../services/apiFootball';
import {
  Search,
  Trophy,
  Users,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Grid3X3,
  LayoutList,
  Heart,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  X
} from 'lucide-react';

// Types
interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  coach?: {
    id: number;
    name: string;
    nationality: string;
  };
}

interface Standing {
  position: number;
  team: {
    id: number;
    name: string;
    crest: string;
  };
  points: number;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

type LeagueKey = keyof typeof LEAGUES;
type ViewMode = 'grid' | 'list' | 'standings';
type SortMode = 'name' | 'position' | 'points' | 'founded';

// Animated Background
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.15),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.1),transparent_50%)]" />

    {/* Floating orbs */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: `radial-gradient(circle, ${
            ['rgba(147,51,234,0.1)', 'rgba(59,130,246,0.1)', 'rgba(236,72,153,0.1)'][i % 3]
          }, transparent)`,
          left: `${20 * i}%`,
          top: `${15 * i}%`,
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Club Card Component
const ClubCard = ({
  team,
  standing,
  index,
  isFavorite,
  onToggleFavorite,
  viewMode
}: {
  team: Team;
  standing?: Standing;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  viewMode: ViewMode;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Parse club colors for gradient
  const getClubGradient = () => {
    if (!team.clubColors) return 'from-gray-700 to-gray-900';
    const colors = team.clubColors.split('/').map(c => c.trim().toLowerCase());
    const colorMap: Record<string, string> = {
      'red': 'red-600',
      'blue': 'blue-600',
      'white': 'gray-100',
      'black': 'gray-900',
      'yellow': 'yellow-500',
      'green': 'green-600',
      'orange': 'orange-500',
      'purple': 'purple-600',
      'gold': 'yellow-600',
      'navy': 'blue-900',
      'sky': 'sky-500',
      'claret': 'red-800',
      'royal blue': 'blue-700',
    };
    const color1 = colorMap[colors[0]] || 'gray-700';
    const color2 = colorMap[colors[1]] || colorMap[colors[0]] || 'gray-900';
    return `from-${color1} to-${color2}`;
  };

  // Position indicator
  const getPositionStyle = () => {
    if (!standing) return null;
    if (standing.position <= 4) return { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400' };
    if (standing.position <= 6) return { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' };
    if (standing.position >= 18) return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' };
    return { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400' };
  };

  const positionStyle = getPositionStyle();

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group"
      >
        <Link to={`/classements/club/${team.id}`}>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              {/* Position */}
              {standing && (
                <div className={`w-10 h-10 rounded-lg ${positionStyle?.bg} ${positionStyle?.border} border flex items-center justify-center`}>
                  <span className={`text-lg font-bold ${positionStyle?.text}`}>{standing.position}</span>
                </div>
              )}

              {/* Crest */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={team.crest}
                  alt={team.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                  {team.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  {team.venue && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {team.venue}
                    </span>
                  )}
                  {team.founded && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {team.founded}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              {standing && (
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-white font-bold">{standing.points}</div>
                    <div className="text-gray-500 text-xs">Pts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold">{standing.won}</div>
                    <div className="text-gray-500 text-xs">V</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 font-bold">{standing.draw}</div>
                    <div className="text-gray-500 text-xs">N</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 font-bold">{standing.lost}</div>
                    <div className="text-gray-500 text-xs">D</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold ${standing.goalDifference > 0 ? 'text-green-400' : standing.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                    </div>
                    <div className="text-gray-500 text-xs">Diff</div>
                  </div>
                </div>
              )}

              {/* Favorite */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite();
                }}
                className={`p-2 rounded-lg transition-all ${
                  isFavorite
                    ? 'bg-pink-500/20 text-pink-500'
                    : 'bg-white/5 text-gray-400 hover:text-pink-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link to={`/classements/club/${team.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500">
          {/* Gradient overlay based on club colors */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getClubGradient()} opacity-10 group-hover:opacity-20 transition-opacity`} />

          {/* Position badge */}
          {standing && (
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full ${positionStyle?.bg} ${positionStyle?.border} border`}>
              <span className={`text-sm font-bold ${positionStyle?.text}`}>#{standing.position}</span>
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
              isFavorite
                ? 'bg-pink-500 text-white'
                : 'bg-black/50 text-gray-400 hover:text-pink-500 opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Club crest */}
          <div className="relative pt-8 pb-4 px-6">
            <motion.div
              animate={{
                rotateY: isHovered ? [0, 10, -10, 0] : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
              className="relative w-24 h-24 mx-auto"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity" />
              <img
                src={team.crest}
                alt={team.name}
                className="relative w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Club info */}
          <div className="px-6 pb-6 text-center">
            <h3 className="font-bold text-lg text-white mb-1 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
              {team.name}
            </h3>
            <p className="text-sm text-gray-400 truncate">{team.tla}</p>

            {/* Stats bar */}
            {standing && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{standing.points}</div>
                    <div className="text-xs text-gray-500">Points</div>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <span className="text-green-400 font-bold">{standing.won}</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-gray-400 font-bold">{standing.draw}</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-red-400 font-bold">{standing.lost}</span>
                    </div>
                    <div className="text-xs text-gray-500">V/N/D</div>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="text-center">
                    <div className={`text-lg font-bold ${standing.goalDifference > 0 ? 'text-green-400' : standing.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                    </div>
                    <div className="text-xs text-gray-500">Diff</div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional info */}
            <div className="mt-3 flex items-center justify-center gap-3 text-xs text-gray-500">
              {team.founded && (
                <span>Fondé en {team.founded}</span>
              )}
            </div>
          </div>

          {/* Hover reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent"
          >
            <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
              <span>Voir le club</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

// Search Modal Component
const SearchModal = ({
  isOpen,
  onClose,
  teams,
  standings
}: {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  standings: Record<number, Standing>;
}) => {
  const [query, setQuery] = useState('');

  const filteredTeams = useMemo(() => {
    if (!query) return teams.slice(0, 10);
    return teams.filter(t =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.shortName?.toLowerCase().includes(query.toLowerCase()) ||
      t.tla?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  }, [teams, query]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {/* Search input */}
        <div className="relative p-4 border-b border-white/10">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un club..."
            autoFocus
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={onClose}
            className="absolute right-7 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredTeams.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Aucun club trouvé
            </div>
          ) : (
            filteredTeams.map((team) => {
              const standing = standings[team.id];
              return (
                <Link
                  key={team.id}
                  to={`/classements/club/${team.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <img src={team.crest} alt="" className="w-12 h-12 object-contain" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{team.name}</h4>
                    <p className="text-sm text-gray-400">{team.tla}</p>
                  </div>
                  {standing && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">#{standing.position}</div>
                      <div className="text-sm text-gray-400">{standing.points} pts</div>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </Link>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Page Component
export default function ClubsPage() {
  // State
  const [selectedLeague, setSelectedLeague] = useState<LeagueKey>('LIGUE_1');
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('position');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favoriteClubs');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const leagueInfo = LEAGUE_INFO[LEAGUES[selectedLeague]];

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [teamsData, standingsData] = await Promise.all([
          getTeams(LEAGUES[selectedLeague]),
          getStandings(LEAGUES[selectedLeague])
        ]);
        setTeams(teamsData);
        setStandings(standingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedLeague]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteClubs', JSON.stringify(favorites));
  }, [favorites]);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('openClubSearch'));
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Create standings map for quick lookup
  const standingsMap = useMemo(() => {
    const map: Record<number, Standing> = {};
    standings.forEach(s => {
      map[s.team.id] = s;
    });
    return map;
  }, [standings]);

  // Filter and sort teams
  const displayTeams = useMemo(() => {
    let filtered = [...teams];

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(t => favorites.includes(t.id));
    }

    // Sort
    filtered.sort((a, b) => {
      const standingA = standingsMap[a.id];
      const standingB = standingsMap[b.id];

      switch (sortMode) {
        case 'position':
          return (standingA?.position || 99) - (standingB?.position || 99);
        case 'points':
          return (standingB?.points || 0) - (standingA?.points || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'founded':
          return (b.founded || 0) - (a.founded || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [teams, searchQuery, showFavoritesOnly, favorites, sortMode, standingsMap]);

  // Toggle favorite
  const toggleFavorite = (teamId: number) => {
    setFavorites(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6"
            >
              <Shield className="w-4 h-4 text-purple-500" />
              <span className="text-purple-400 font-medium text-sm">Club Universe</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6"
            >
              <span className="text-white">Tous les </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
                Clubs
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8"
            >
              Explorez les clubs des plus grands championnats. Classements, effectifs et statistiques.
            </motion.p>

            {/* Quick search button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowSearch(true)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
            >
              <Search className="w-5 h-5" />
              <span>Rechercher un club...</span>
              <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">⌘K</kbd>
            </motion.button>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              <div className="text-center">
                <div className="text-4xl font-black text-white">{teams.length}</div>
                <div className="text-gray-500">Clubs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white">6</div>
                <div className="text-gray-500">Ligues</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-purple-400">{favorites.length}</div>
                <div className="text-gray-500">Favoris</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* League Selector */}
        <section className="sticky top-20 z-30 py-4 bg-black/80 backdrop-blur-xl border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* League tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                {(Object.keys(LEAGUES) as LeagueKey[]).map((league) => {
                  const info = LEAGUE_INFO[LEAGUES[league]];
                  return (
                    <button
                      key={league}
                      onClick={() => setSelectedLeague(league)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                        selectedLeague === league
                          ? `bg-gradient-to-r ${info.color} text-white shadow-lg`
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{info.flag}</span>
                      <span className="hidden sm:inline">{info.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {/* Favorites filter */}
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    showFavoritesOnly
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">Favoris</span>
                  {favorites.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                      {favorites.length}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="position">Par classement</option>
                  <option value="points">Par points</option>
                  <option value="name">Par nom</option>
                  <option value="founded">Par ancienneté</option>
                </select>

                {/* View mode */}
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-full">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-full transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* League Header */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            key={selectedLeague}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${leagueInfo.color} p-8`}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative flex items-center gap-6">
              <div className="text-6xl">{leagueInfo.flag}</div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{leagueInfo.name}</h2>
                <p className="text-white/70">
                  {teams.length} clubs • Saison {new Date().getMonth() < 7 ? `${new Date().getFullYear() - 1}/${String(new Date().getFullYear()).slice(-2)}` : `${new Date().getFullYear()}/${String(new Date().getFullYear() + 1).slice(-2)}`}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Clubs Grid/List */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-400">Chargement des clubs...</p>
            </div>
          ) : displayTeams.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Aucun club trouvé</h3>
              <p className="text-gray-400">
                {showFavoritesOnly
                  ? 'Vous n\'avez pas encore de clubs favoris'
                  : 'Essayez de modifier vos filtres'
                }
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${viewMode}-${selectedLeague}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-3'
                }
              >
                {displayTeams.map((team, index) => (
                  <ClubCard
                    key={team.id}
                    team={team}
                    standing={standingsMap[team.id]}
                    index={index}
                    isFavorite={favorites.includes(team.id)}
                    onToggleFavorite={() => toggleFavorite(team.id)}
                    viewMode={viewMode}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </section>

        {/* Legend */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Légende</h3>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50" />
                <span className="text-gray-400">Qualification Champions League</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500/50" />
                <span className="text-gray-400">Qualification Europa League</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500/50" />
                <span className="text-gray-400">Zone de relégation</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <SearchModal
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
            teams={teams}
            standings={standingsMap}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
