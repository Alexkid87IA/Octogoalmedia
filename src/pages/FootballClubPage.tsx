import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Users, Calendar, TrendingUp, TrendingDown, Minus,
  MapPin, Globe, Award, Target, Shield, Zap, ChevronRight,
  Home, Plane, BarChart3, Clock, Star, ArrowRight
} from 'lucide-react';
import {
  getTeamDetails,
  getTeamLastResults,
  getTeamNextMatches,
  getTeamStatistics,
  getTeamLeaguePosition,
  formatDateFR,
  getMatchResult,
  LEAGUES,
} from '../services/apiFootball';

// Types
interface TeamDetails {
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
  venueCapacity?: number;
  coach: { id: number; name: string; nationality: string; } | null;
  squad: Player[];
  runningCompetitions: Competition[];
}

interface Player {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
  photo?: string;
  number?: number;
}

interface Competition {
  id: number;
  name: string;
  code: string;
  emblem: string;
}

interface Match {
  id: number;
  utcDate: string;
  status: string;
  competition: { name: string; emblem: string; };
  homeTeam: { id: number; name: string; crest: string; };
  awayTeam: { id: number; name: string; crest: string; };
  score: { fullTime: { home: number | null; away: number | null; }; };
}

interface TeamStats {
  form: string;
  fixtures: {
    played: { home: number; away: number; total: number; };
    wins: { home: number; away: number; total: number; };
    draws: { home: number; away: number; total: number; };
    loses: { home: number; away: number; total: number; };
  };
  goals: {
    for: { total: { home: number; away: number; total: number; }; average: { total: string; }; };
    against: { total: { home: number; away: number; total: number; }; average: { total: string; }; };
  };
  cleanSheets: { total: number; };
  biggestStreak: { wins: number; };
  biggestWin: { home: string; away: string; };
}

interface TeamStanding {
  position: number;
  points: number;
  goalDifference: number;
  playedGames: number;
}

// Clip-paths octogonaux
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';
const octagonClipCard = 'polygon(4% 0%, 96% 0%, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0% 96%, 0% 4%)';

// Mapping des ligues par équipe (approximatif basé sur les IDs connus)
const TEAM_LEAGUE_MAP: Record<number, number> = {
  // Ligue 1
  85: 61, 81: 61, 80: 61, 79: 61, 91: 61, 77: 61, 84: 61, 93: 61, 94: 61, 95: 61,
  96: 61, 97: 61, 98: 61, 99: 61, 100: 61, 101: 61, 102: 61, 103: 61,
  // Premier League
  50: 39, 40: 39, 33: 39, 34: 39, 42: 39, 47: 39, 49: 39, 66: 39, 39: 39, 45: 39,
  46: 39, 48: 39, 51: 39, 52: 39, 55: 39, 63: 39, 65: 39, 35: 39, 36: 39, 38: 39,
  // La Liga
  541: 140, 529: 140, 530: 140, 531: 140, 532: 140, 533: 140, 536: 140, 538: 140,
  540: 140, 543: 140, 546: 140, 548: 140, 715: 140, 720: 140, 723: 140, 727: 140,
  // Serie A
  489: 135, 496: 135, 505: 135, 487: 135, 492: 135, 497: 135, 499: 135, 500: 135,
  502: 135, 503: 135, 504: 135, 488: 135, 494: 135, 498: 135, 511: 135,
  // Bundesliga
  157: 78, 165: 78, 168: 78, 169: 78, 172: 78, 173: 78, 174: 78, 176: 78,
  180: 78, 182: 78, 184: 78, 185: 78, 186: 78, 188: 78, 191: 78, 192: 78,
};

// Grouper les joueurs par position
const positionGroups: Record<string, string[]> = {
  'Gardiens': ['Goalkeeper', 'Gardien', 'GK', 'G'],
  'Défenseurs': ['Defender', 'Defence', 'Center-Back', 'Left-Back', 'Right-Back', 'CB', 'LB', 'RB'],
  'Milieux': ['Midfielder', 'Midfield', 'Central Midfield', 'Defensive Midfield', 'Attacking Midfield', 'CM', 'CDM', 'CAM'],
  'Attaquants': ['Attacker', 'Forward', 'Striker', 'Left Winger', 'Right Winger', 'CF', 'ST', 'LW', 'RW'],
};

function getPositionGroup(position: string): string {
  if (!position) return 'Autres';
  const posLower = position.toLowerCase();
  if (posLower.includes('goal') || posLower.includes('keeper')) return 'Gardiens';
  if (posLower.includes('defend') || posLower.includes('back')) return 'Défenseurs';
  if (posLower.includes('attack') || posLower.includes('forward') || posLower.includes('wing') || posLower.includes('strik')) return 'Attaquants';
  if (posLower.includes('midfield')) return 'Milieux';
  return 'Autres';
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// Stat Card Component - Design uniforme
const StatCard = ({ icon: Icon, label, value, subValue, gradient }: {
  icon: any; label: string; value: string | number; subValue?: string; gradient: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 p-4 h-24 flex items-center gap-4"
    style={{ clipPath: octagonClipCard }}
  >
    <div className={`w-12 h-12 flex-shrink-0 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-400 text-xs truncate">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
      {subValue && <p className="text-gray-500 text-[10px] truncate">{subValue}</p>}
    </div>
  </motion.div>
);

export default function FootballClubPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [lastResults, setLastResults] = useState<Match[]>([]);
  const [nextMatches, setNextMatches] = useState<Match[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [standing, setStanding] = useState<TeamStanding | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'matches' | 'stats'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamData() {
      if (!teamId) return;
      setLoading(true);
      setError(null);

      try {
        const id = parseInt(teamId);
        const leagueId = TEAM_LEAGUE_MAP[id] || 61; // Default to Ligue 1

        // Fetch all data in parallel
        const [teamData, results, upcoming, stats, position] = await Promise.all([
          getTeamDetails(id),
          getTeamLastResults(id, 10),
          getTeamNextMatches(id, 5),
          getTeamStatistics(id, leagueId),
          getTeamLeaguePosition(id, leagueId),
        ]);

        if (!teamData) {
          setError('Club non trouvé');
          return;
        }

        setTeam(teamData);
        setLastResults(results);
        setNextMatches(upcoming);
        setTeamStats(stats);
        setStanding(position);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamData();
  }, [teamId]);

  // Group squad by position
  const squadByPosition = team?.squad.reduce((acc, player) => {
    const group = getPositionGroup(player.position);
    if (!acc[group]) acc[group] = [];
    acc[group].push(player);
    return acc;
  }, {} as Record<string, Player[]>) || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Chargement du club...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Club non trouvé'}</p>
          <Link to="/classements" className="text-pink-400 hover:text-pink-300 underline">
            ← Retour aux classements
          </Link>
        </div>
      </div>
    );
  }

  // Calculer la forme récente à partir de TOUS les matchs (toutes compétitions)
  // plutôt que d'utiliser teamStats.form qui est limité au championnat
  const formArray = lastResults
    .filter(m => m.status === 'FINISHED')
    .slice(0, 10)
    .map(match => getMatchResult(match, team.id))
    .filter(r => r !== null) as string[];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-black to-blue-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />

        {/* Decorative shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 right-10 w-96 h-96 border-2 border-pink-500/30"
          style={{ clipPath: octagonClip }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            to="/classements"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors text-sm"
          >
            ← Retour aux classements
          </Link>

          {/* Club header */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-44 md:h-44 bg-white/10 backdrop-blur-xl p-4 flex items-center justify-center"
                style={{ clipPath: octagonClipSubtle }}
              >
                <img src={team.crest} alt={team.name} className="max-w-full max-h-full object-contain" />
              </div>
              {standing && (
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center font-black text-white text-xl"
                  style={{ clipPath: octagonClip }}
                >
                  {standing.position}
                </div>
              )}
            </motion.div>

            {/* Club info */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {team.tla && (
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-pink-500/30 text-pink-400 rounded-full text-xs font-bold mb-3"
                    style={{ clipPath: octagonClipSubtle }}
                  >
                    {team.tla}
                  </span>
                )}
                <h1 className="text-4xl md:text-6xl font-black text-white mb-2">{team.name}</h1>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-400 mt-4">
                  {team.venue && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {team.venue}
                    </span>
                  )}
                  {team.founded && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Fondé en {team.founded}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Form streak */}
              {formArray.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">Forme récente</p>
                  <div className="flex justify-center lg:justify-start gap-1.5">
                    {formArray.map((result, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm rounded-lg ${
                          result === 'W' ? 'bg-green-500 text-white' :
                          result === 'L' ? 'bg-red-500 text-white' :
                          'bg-gray-600 text-white'
                        }`}
                      >
                        {result === 'W' ? 'V' : result === 'L' ? 'D' : 'N'}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick stats */}
            {standing && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:grid grid-cols-2 gap-3"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-4 text-center" style={{ clipPath: octagonClipCard }}>
                  <p className="text-3xl font-black text-white">{standing.points}</p>
                  <p className="text-gray-500 text-xs">Points</p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-4 text-center" style={{ clipPath: octagonClipCard }}>
                  <p className={`text-3xl font-black ${standing.goalDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                  </p>
                  <p className="text-gray-500 text-xs">Diff. buts</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      {teamStats && (
        <section className="py-6 border-y border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard icon={Trophy} label="Position" value={standing?.position || '-'} gradient="from-yellow-500 to-amber-600" />
              <StatCard icon={Target} label="Matchs" value={teamStats.fixtures.played.total} subValue={`${teamStats.fixtures.wins.total}V ${teamStats.fixtures.draws.total}N ${teamStats.fixtures.loses.total}D`} gradient="from-pink-500 to-rose-600" />
              <StatCard icon={Zap} label="Buts +" value={teamStats.goals.for.total.total} subValue={`${teamStats.goals.for.average.total}/match`} gradient="from-green-500 to-emerald-600" />
              <StatCard icon={Shield} label="Buts -" value={teamStats.goals.against.total.total} subValue={`${teamStats.goals.against.average.total}/match`} gradient="from-red-500 to-rose-600" />
              <StatCard icon={Award} label="Clean sheets" value={teamStats.cleanSheets.total} gradient="from-blue-500 to-indigo-600" />
              <StatCard icon={TrendingUp} label="Série V" value={teamStats.biggestStreak.wins} subValue="record" gradient="from-purple-500 to-violet-600" />
            </div>
          </div>
        </section>
      )}

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-30 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'squad', label: 'Effectif', icon: Users },
              { id: 'matches', label: 'Matchs', icon: Calendar },
              { id: 'stats', label: 'Statistiques', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Prochain match */}
              <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  Prochain match
                </h3>
                {nextMatches[0] ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={team.crest} alt={team.name} className="w-16 h-16 object-contain" />
                      <div className="text-center">
                        <p className="text-gray-500 text-sm">{formatDateFR(nextMatches[0].utcDate)}</p>
                        <p className="text-2xl font-bold text-white my-2">VS</p>
                        <p className="text-xs text-gray-400">{nextMatches[0].homeTeam.id === team.id ? 'Domicile' : 'Extérieur'}</p>
                      </div>
                      <Link to={`/classements/club/${nextMatches[0].homeTeam.id === team.id ? nextMatches[0].awayTeam.id : nextMatches[0].homeTeam.id}`}>
                        <img
                          src={nextMatches[0].homeTeam.id === team.id ? nextMatches[0].awayTeam.crest : nextMatches[0].homeTeam.crest}
                          alt="Adversaire"
                          className="w-16 h-16 object-contain hover:scale-110 transition-transform"
                        />
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {nextMatches[0].homeTeam.id === team.id ? nextMatches[0].awayTeam.name : nextMatches[0].homeTeam.name}
                      </p>
                      {nextMatches[0].competition && (
                        <p className="text-gray-500 text-sm flex items-center gap-1 justify-end mt-1">
                          {nextMatches[0].competition.emblem && <img src={nextMatches[0].competition.emblem} alt="" className="w-4 h-4" />}
                          {nextMatches[0].competition.name}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun match à venir</p>
                )}
              </div>

              {/* Infos rapides */}
              <div className="bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-pink-400" />
                  Informations
                </h3>
                <div className="space-y-3">
                  {team.venue && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Stade</span>
                      <span className="text-white font-medium">{team.venue}</span>
                    </div>
                  )}
                  {team.founded && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Fondé en</span>
                      <span className="text-white font-medium">{team.founded}</span>
                    </div>
                  )}
                  {team.address && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Ville</span>
                      <span className="text-white font-medium text-right">{team.address.split(',')[0]}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Effectif</span>
                    <span className="text-white font-medium">{team.squad.length} joueurs</span>
                  </div>
                </div>
              </div>

              {/* Derniers résultats */}
              <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-pink-400" />
                  Derniers résultats
                </h3>
                <div className="space-y-2">
                  {lastResults.slice(0, 5).map((match) => {
                    const isHome = match.homeTeam.id === team.id;
                    const opponent = isHome ? match.awayTeam : match.homeTeam;
                    const teamScore = isHome ? match.score.fullTime.home : match.score.fullTime.away;
                    const opponentScore = isHome ? match.score.fullTime.away : match.score.fullTime.home;
                    const result = getMatchResult(match, team.id);

                    return (
                      <div
                        key={match.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${
                          result === 'win' ? 'bg-green-900/20 border-green-500' :
                          result === 'loss' ? 'bg-red-900/20 border-red-500' :
                          'bg-gray-800/50 border-gray-500'
                        }`}
                      >
                        <Link to={`/classements/club/${opponent.id}`}>
                          <img src={opponent.crest} alt={opponent.name} className="w-8 h-8 object-contain" />
                        </Link>
                        <div className="flex-1">
                          <Link to={`/classements/club/${opponent.id}`} className="text-white text-sm font-medium hover:text-pink-400">
                            {isHome ? 'vs' : '@'} {opponent.name}
                          </Link>
                        </div>
                        <span className={`text-lg font-bold ${
                          result === 'win' ? 'text-green-400' : result === 'loss' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {teamScore} - {opponentScore}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats Home vs Away */}
              {teamStats && (
                <div className="bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-pink-400" />
                    Dom. vs Ext.
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400 flex items-center gap-1"><Home className="w-3 h-3" /> Domicile</span>
                        <span className="text-white">{teamStats.fixtures.wins.home}V - {teamStats.fixtures.draws.home}N - {teamStats.fixtures.loses.home}D</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400"
                          style={{ width: `${(teamStats.fixtures.wins.home / teamStats.fixtures.played.home) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400 flex items-center gap-1"><Plane className="w-3 h-3" /> Extérieur</span>
                        <span className="text-white">{teamStats.fixtures.wins.away}V - {teamStats.fixtures.draws.away}N - {teamStats.fixtures.loses.away}D</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                          style={{ width: `${(teamStats.fixtures.wins.away / teamStats.fixtures.played.away) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Buts à domicile</span>
                        <span className="text-green-400 font-bold">{teamStats.goals.for.total.home}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Buts à l'extérieur</span>
                        <span className="text-blue-400 font-bold">{teamStats.goals.for.total.away}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SQUAD TAB */}
          {activeTab === 'squad' && (
            <motion.div
              key="squad"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {['Gardiens', 'Défenseurs', 'Milieux', 'Attaquants', 'Autres'].map((group) => {
                const players = squadByPosition[group];
                if (!players || players.length === 0) return null;

                return (
                  <div key={group}>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      {group === 'Gardiens' && <span className="text-2xl">🧤</span>}
                      {group === 'Défenseurs' && <span className="text-2xl">🛡️</span>}
                      {group === 'Milieux' && <span className="text-2xl">⚙️</span>}
                      {group === 'Attaquants' && <span className="text-2xl">⚡</span>}
                      {group} <span className="text-gray-500 font-normal">({players.length})</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {players.map((player) => (
                        <Link
                          key={player.id}
                          to={`/player/${player.id}`}
                          className="group bg-gray-900/50 border border-gray-800 overflow-hidden hover:border-pink-500/50 transition-all hover:-translate-y-1"
                          style={{ clipPath: octagonClipCard }}
                        >
                          {/* Player photo */}
                          <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                            {player.photo ? (
                              <img
                                src={player.photo}
                                alt={player.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Users className="w-12 h-12 text-gray-700" />
                              </div>
                            )}
                            {player.number && (
                              <div className="absolute top-2 right-2 w-8 h-8 bg-black/70 flex items-center justify-center font-bold text-white text-sm rounded-lg">
                                {player.number}
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-white font-medium text-sm truncate group-hover:text-pink-400 transition-colors">
                              {player.name}
                            </p>
                            <p className="text-gray-500 text-xs truncate">{player.position}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              {Object.keys(squadByPosition).length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400">Effectif non disponible</p>
                </div>
              )}
            </motion.div>
          )}

          {/* MATCHES TAB */}
          {activeTab === 'matches' && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Prochains matchs */}
              <div className="bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  Prochains matchs
                </h3>
                {nextMatches.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun match à venir</p>
                ) : (
                  <div className="space-y-3">
                    {nextMatches.map((match) => {
                      const isHome = match.homeTeam.id === team.id;
                      const opponent = isHome ? match.awayTeam : match.homeTeam;

                      return (
                        <div key={match.id} className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">{formatDateFR(match.utcDate)}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${isHome ? 'bg-green-900/50 text-green-400' : 'bg-blue-900/50 text-blue-400'}`}>
                              {isHome ? 'DOM' : 'EXT'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Link to={`/classements/club/${opponent.id}`}>
                              <img src={opponent.crest} alt={opponent.name} className="w-10 h-10 object-contain hover:scale-110 transition-transform" />
                            </Link>
                            <div className="flex-1">
                              <Link to={`/classements/club/${opponent.id}`} className="text-white font-medium hover:text-pink-400">
                                {opponent.name}
                              </Link>
                              {match.competition && (
                                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                  {match.competition.emblem && <img src={match.competition.emblem} alt="" className="w-3 h-3" />}
                                  {match.competition.name}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Derniers résultats */}
              <div className="bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-pink-400" />
                  Derniers résultats
                </h3>
                {lastResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun résultat récent</p>
                ) : (
                  <div className="space-y-3">
                    {lastResults.map((match) => {
                      const isHome = match.homeTeam.id === team.id;
                      const opponent = isHome ? match.awayTeam : match.homeTeam;
                      const teamScore = isHome ? match.score.fullTime.home : match.score.fullTime.away;
                      const opponentScore = isHome ? match.score.fullTime.away : match.score.fullTime.home;
                      const result = getMatchResult(match, team.id);

                      return (
                        <div
                          key={match.id}
                          className={`bg-gray-800/50 rounded-xl p-4 border-l-4 ${
                            result === 'win' ? 'border-green-500' :
                            result === 'loss' ? 'border-red-500' :
                            'border-gray-500'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Link to={`/classements/club/${opponent.id}`}>
                              <img src={opponent.crest} alt={opponent.name} className="w-10 h-10 object-contain hover:scale-110 transition-transform" />
                            </Link>
                            <div className="flex-1">
                              <Link to={`/classements/club/${opponent.id}`} className="text-white font-medium hover:text-pink-400">
                                {isHome ? 'vs' : '@'} {opponent.name}
                              </Link>
                              {match.competition && (
                                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                  {match.competition.emblem && <img src={match.competition.emblem} alt="" className="w-3 h-3" />}
                                  {match.competition.name}
                                </p>
                              )}
                            </div>
                            <div className={`text-xl font-black ${
                              result === 'win' ? 'text-green-400' :
                              result === 'loss' ? 'text-red-400' :
                              'text-gray-400'
                            }`}>
                              {teamScore} - {opponentScore}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && teamStats && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Bilan des matchs */}
              <div className="bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                <h3 className="text-lg font-bold text-white mb-4">Bilan des matchs</h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-3xl font-black text-green-400">{teamStats.fixtures.wins.total}</p>
                    <p className="text-gray-500 text-xs">Victoires</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-gray-400">{teamStats.fixtures.draws.total}</p>
                    <p className="text-gray-500 text-xs">Nuls</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-red-400">{teamStats.fixtures.loses.total}</p>
                    <p className="text-gray-500 text-xs">Défaites</p>
                  </div>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden flex">
                  <div className="bg-green-500 h-full" style={{ width: `${(teamStats.fixtures.wins.total / teamStats.fixtures.played.total) * 100}%` }} />
                  <div className="bg-gray-500 h-full" style={{ width: `${(teamStats.fixtures.draws.total / teamStats.fixtures.played.total) * 100}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${(teamStats.fixtures.loses.total / teamStats.fixtures.played.total) * 100}%` }} />
                </div>
              </div>

              {/* Buts */}
              <div className="bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                <h3 className="text-lg font-bold text-white mb-4">Buts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-900/20 rounded-xl">
                    <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-3xl font-black text-green-400">{teamStats.goals.for.total.total}</p>
                    <p className="text-gray-500 text-xs">Marqués</p>
                  </div>
                  <div className="text-center p-4 bg-red-900/20 rounded-xl">
                    <Shield className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <p className="text-3xl font-black text-red-400">{teamStats.goals.against.total.total}</p>
                    <p className="text-gray-500 text-xs">Encaissés</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Différence</span>
                    <span className={`font-bold ${teamStats.goals.for.total.total - teamStats.goals.against.total.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {teamStats.goals.for.total.total - teamStats.goals.against.total.total > 0 ? '+' : ''}
                      {teamStats.goals.for.total.total - teamStats.goals.against.total.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Records */}
              <div className="bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                <h3 className="text-lg font-bold text-white mb-4">Records</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Plus grande victoire (dom)</span>
                    <span className="text-green-400 font-bold">{teamStats.biggestWin.home || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Plus grande victoire (ext)</span>
                    <span className="text-blue-400 font-bold">{teamStats.biggestWin.away || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Clean sheets</span>
                    <span className="text-white font-bold">{teamStats.cleanSheets.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Série de victoires</span>
                    <span className="text-pink-400 font-bold">{teamStats.biggestStreak.wins}</span>
                  </div>
                </div>
              </div>

              {/* Domicile vs Extérieur */}
              <div className="md:col-span-2 lg:col-span-3 bg-gray-900/50 border border-gray-800 p-6" style={{ clipPath: octagonClipCard }}>
                <h3 className="text-lg font-bold text-white mb-6">Comparaison Domicile / Extérieur</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Domicile */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Home className="w-5 h-5 text-green-400" />
                      <span className="text-white font-bold">Domicile</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-2xl font-black text-green-400">{teamStats.fixtures.wins.home}</p>
                        <p className="text-gray-500 text-xs">Victoires</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-2xl font-black text-white">{teamStats.fixtures.draws.home}</p>
                        <p className="text-gray-500 text-xs">Nuls</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-2xl font-black text-red-400">{teamStats.fixtures.loses.home}</p>
                        <p className="text-gray-500 text-xs">Défaites</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between text-sm">
                      <span className="text-gray-400">Buts marqués</span>
                      <span className="text-green-400 font-bold">{teamStats.goals.for.total.home}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">Buts encaissés</span>
                      <span className="text-red-400 font-bold">{teamStats.goals.against.total.home}</span>
                    </div>
                  </div>

                  {/* Extérieur */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Plane className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-bold">Extérieur</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-2xl font-black text-green-400">{teamStats.fixtures.wins.away}</p>
                        <p className="text-gray-500 text-xs">Victoires</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-2xl font-black text-white">{teamStats.fixtures.draws.away}</p>
                        <p className="text-gray-500 text-xs">Nuls</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-2xl font-black text-red-400">{teamStats.fixtures.loses.away}</p>
                        <p className="text-gray-500 text-xs">Défaites</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between text-sm">
                      <span className="text-gray-400">Buts marqués</span>
                      <span className="text-blue-400 font-bold">{teamStats.goals.for.total.away}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">Buts encaissés</span>
                      <span className="text-red-400 font-bold">{teamStats.goals.against.total.away}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
