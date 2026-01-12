import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getStandings, LEAGUES } from '../../services/apiFootball';

interface TeamStanding {
  position: number;
  team: {
    id: number;
    name: string;
    crest: string;
  };
  points: number;
  goalDifference: number;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
}

// Configuration des ligues avec couleurs et drapeaux
const leagueConfig = [
  { 
    key: 'LIGUE_1', 
    name: 'Ligue 1', 
    flag: '🇫🇷',
    gradient: 'from-blue-600 to-blue-800',
    accent: 'blue'
  },
  { 
    key: 'PREMIER_LEAGUE', 
    name: 'Premier League', 
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    gradient: 'from-purple-600 to-purple-800',
    accent: 'purple'
  },
  { 
    key: 'LA_LIGA', 
    name: 'La Liga', 
    flag: '🇪🇸',
    gradient: 'from-orange-500 to-red-600',
    accent: 'orange'
  },
  { 
    key: 'SERIE_A', 
    name: 'Serie A', 
    flag: '🇮🇹',
    gradient: 'from-green-600 to-emerald-700',
    accent: 'green'
  },
  { 
    key: 'BUNDESLIGA', 
    name: 'Bundesliga', 
    flag: '🇩🇪',
    gradient: 'from-red-600 to-red-800',
    accent: 'red'
  },
];

export default function LiveStandingsSection() {
  const [activeLeague, setActiveLeague] = useState(0);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const currentLeague = leagueConfig[activeLeague];

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true);
        const leagueKey = currentLeague.key as keyof typeof LEAGUES;
        const data = await getStandings(LEAGUES[leagueKey]);
        setStandings(data.slice(0, 6)); // Top 6 pour la homepage
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        setError('Impossible de charger le classement');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, [activeLeague]);

  // Indicateur de forme (basé sur les derniers résultats)
  const getFormIndicator = (won: number, draw: number, lost: number) => {
    const total = won + draw + lost;
    if (total === 0) return null;
    const winRate = won / total;
    if (winRate >= 0.6) return { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' };
    if (winRate <= 0.3) return { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/10' };
    return { icon: Minus, color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
                En direct
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Classements <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">Live</span>
            </h2>
            {lastUpdate && (
              <p className="text-gray-500 text-sm mt-2">
                Mis à jour à {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* Lien vers page complète */}
          <Link 
            to="/football"
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-sm">Voir tous les classements</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tabs des ligues */}
        <div className="flex flex-wrap gap-2 mb-8">
          {leagueConfig.map((league, index) => (
            <button
              key={league.key}
              onClick={() => setActiveLeague(index)}
              className={`relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeLeague === index
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {activeLeague === index && (
                <motion.div
                  layoutId="activeLeagueTab"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${league.gradient}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <span className="text-lg">{league.flag}</span>
                <span className="hidden sm:inline">{league.name}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8"
              >
                <div className="flex items-center justify-center gap-3 text-gray-400">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Chargement du classement...</span>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center"
              >
                <p className="text-red-400">{error}</p>
                <button 
                  onClick={() => setActiveLeague(activeLeague)}
                  className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 text-sm transition-colors"
                >
                  Réessayer
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentLeague.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5"
              >
                {/* Header du tableau avec gradient */}
                <div className={`bg-gradient-to-r ${currentLeague.gradient} px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currentLeague.flag}</span>
                      <h3 className="text-white font-bold text-xl">{currentLeague.name}</h3>
                    </div>
                    <span className="text-white/60 text-sm">Saison {new Date().getMonth() < 7 ? `${new Date().getFullYear() - 1}-${String(new Date().getFullYear()).slice(-2)}` : `${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}`}</span>
                  </div>
                </div>

                {/* Tableau des équipes */}
                <div className="p-4 md:p-6">
                  {/* Header du tableau */}
                  <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 uppercase tracking-wider pb-3 border-b border-white/5">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-5 md:col-span-4">Équipe</div>
                    <div className="col-span-1 text-center hidden md:block">MJ</div>
                    <div className="col-span-1 text-center">G</div>
                    <div className="col-span-1 text-center">N</div>
                    <div className="col-span-1 text-center">P</div>
                    <div className="col-span-1 text-center hidden md:block">Diff</div>
                    <div className="col-span-2 md:col-span-1 text-center font-bold">Pts</div>
                  </div>

                  {/* Lignes des équipes */}
                  <div className="divide-y divide-white/5">
                    {standings.map((team, index) => {
                      const form = getFormIndicator(team.won, team.draw, team.lost);
                      const FormIcon = form?.icon;
                      
                      return (
                        <motion.div
                          key={team.team.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="grid grid-cols-12 gap-2 items-center py-3 hover:bg-white/5 rounded-lg transition-colors group cursor-pointer"
                        >
                          {/* Position */}
                          <div className="col-span-1 text-center">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                              index === 1 ? 'bg-gray-400/20 text-gray-300' :
                              index === 2 ? 'bg-amber-600/20 text-amber-500' :
                              index < 4 ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-800 text-gray-400'
                            }`}>
                              {team.position}
                            </span>
                          </div>

                          {/* Équipe */}
                          <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                            <img 
                              src={team.team.crest} 
                              alt={team.team.name}
                              className="w-8 h-8 object-contain"
                            />
                            <span className="text-white font-medium text-sm truncate group-hover:text-pink-400 transition-colors">
                              {team.team.name}
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="col-span-1 text-center text-gray-400 text-sm hidden md:block">
                            {team.playedGames}
                          </div>
                          <div className="col-span-1 text-center text-green-400 text-sm font-medium">
                            {team.won}
                          </div>
                          <div className="col-span-1 text-center text-gray-400 text-sm">
                            {team.draw}
                          </div>
                          <div className="col-span-1 text-center text-red-400 text-sm">
                            {team.lost}
                          </div>
                          <div className="col-span-1 text-center text-gray-300 text-sm hidden md:block">
                            <span className={team.goalDifference > 0 ? 'text-green-400' : team.goalDifference < 0 ? 'text-red-400' : ''}>
                              {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                            </span>
                          </div>

                          {/* Points avec indicateur de forme */}
                          <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2">
                            <span className="text-white font-bold text-lg">{team.points}</span>
                            {FormIcon && (
                              <span className={`p-1 rounded ${form.bg}`}>
                                <FormIcon className={`w-3 h-3 ${form.color}`} />
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer avec CTA */}
                <div className="px-6 py-4 bg-white/5 border-t border-white/5">
                  <Link 
                    to="/football"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    <span>Voir le classement complet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info supplémentaire */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-500/30"></span>
            <span>Qualification Ligue des Champions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-yellow-500/30"></span>
            <span>Leader</span>
          </div>
        </div>
      </div>
    </section>
  );
}