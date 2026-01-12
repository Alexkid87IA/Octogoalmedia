import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, TrendingDown, Minus, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
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
  form?: string;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
}

// Configuration des ligues pour le carousel
const LEAGUE_CONFIG = [
  { key: 'LIGUE_1', name: 'Ligue 1', country: 'France', flag: '🇫🇷', color: 'from-blue-500 to-blue-700' },
  { key: 'PREMIER_LEAGUE', name: 'Premier League', country: 'Angleterre', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: 'from-purple-500 to-purple-700' },
  { key: 'LA_LIGA', name: 'La Liga', country: 'Espagne', flag: '🇪🇸', color: 'from-red-500 to-orange-600' },
  { key: 'SERIE_A', name: 'Serie A', country: 'Italie', flag: '🇮🇹', color: 'from-green-500 to-green-700' },
  { key: 'BUNDESLIGA', name: 'Bundesliga', country: 'Allemagne', flag: '🇩🇪', color: 'from-red-600 to-yellow-500' },
];

// Clip-path octogonal
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';

export const QuickStandingsSection = () => {
  const [currentLeagueIndex, setCurrentLeagueIndex] = useState(0);
  const [standings, setStandings] = useState<Record<string, TeamStanding[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingLeague, setLoadingLeague] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const currentLeague = LEAGUE_CONFIG[currentLeagueIndex];

  // Charger le classement de la ligue actuelle
  useEffect(() => {
    const fetchStandings = async () => {
      const leagueKey = currentLeague.key as keyof typeof LEAGUES;

      // Si déjà en cache, ne pas recharger
      if (standings[leagueKey]) {
        setIsLoading(false);
        return;
      }

      try {
        setLoadingLeague(leagueKey);
        const leagueId = LEAGUES[leagueKey];
        const data = await getStandings(String(leagueId));

        if (data && data.length > 0) {
          setStandings(prev => ({
            ...prev,
            [leagueKey]: data.slice(0, 5)
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du classement:', error);
      } finally {
        setIsLoading(false);
        setLoadingLeague(null);
      }
    };

    fetchStandings();
  }, [currentLeagueIndex]);

  // Tendance basée sur la forme (5 derniers matchs)
  const getTrend = (form?: string) => {
    if (!form) return null;
    const lastThree = form.slice(-3);
    const wins = (lastThree.match(/W/g) || []).length;
    const losses = (lastThree.match(/L/g) || []).length;

    if (wins >= 2) return 'up';
    if (losses >= 2) return 'down';
    return 'stable';
  };

  const goToPrevious = () => {
    setCurrentLeagueIndex(prev => prev === 0 ? LEAGUE_CONFIG.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setCurrentLeagueIndex(prev => prev === LEAGUE_CONFIG.length - 1 ? 0 : prev + 1);
  };

  const currentStandings = standings[currentLeague.key as keyof typeof LEAGUES] || [];
  const isCurrentLoading = loadingLeague === currentLeague.key || (isLoading && currentStandings.length === 0);

  return (
    <section className="py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Colonne gauche : Titre, carousel et description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Carousel des ligues */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={goToPrevious}
                  className="p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                {/* League Pills */}
                <div
                  ref={carouselRef}
                  className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide py-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {LEAGUE_CONFIG.map((league, index) => (
                    <button
                      key={league.key}
                      onClick={() => setCurrentLeagueIndex(index)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all
                        ${index === currentLeagueIndex
                          ? `bg-gradient-to-r ${league.color} text-white shadow-lg`
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-lg">{league.flag}</span>
                      <span className="text-sm font-medium hidden sm:inline">{league.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  className="p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Titre dynamique */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLeague.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Badge octogonal */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${currentLeague.color}/20 border border-pink-500/30 rounded-lg mb-4`}
                  style={{ clipPath: octagonClipSubtle }}
                >
                  <Trophy className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-medium text-white">{currentLeague.name}</span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                  <span className="text-white">Classement </span>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentLeague.color}`}>
                    {currentLeague.name}
                  </span>
                </h2>

                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  Le top 5 du championnat {currentLeague.country === 'France' ? 'de France' : currentLeague.country === 'Angleterre' ? "d'Angleterre" : currentLeague.country === 'Espagne' ? "d'Espagne" : currentLeague.country === 'Italie' ? "d'Italie" : "d'Allemagne"} en temps réel.
                </p>
              </motion.div>
            </AnimatePresence>

            <Link
              to="/classements"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all group"
              style={{ clipPath: octagonClipSubtle }}
            >
              <span>Voir tous les classements</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Colonne droite : Tableau classement */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Forme octogonale décorative en arrière-plan */}
            <div
              className={`absolute -inset-4 bg-gradient-to-br ${currentLeague.color}/10 blur-xl transition-colors duration-500`}
              style={{ clipPath: octagonClip }}
            />

            {/* Card principale */}
            <div
              className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 overflow-hidden"
              style={{ clipPath: octagonClipSubtle }}
            >
              {/* Header du tableau */}
              <div className={`px-6 py-4 border-b border-gray-800 bg-gradient-to-r ${currentLeague.color}/10`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${currentLeague.color} flex items-center justify-center`}
                      style={{ clipPath: octagonClip }}
                    >
                      <span className="text-lg">{currentLeague.flag}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{currentLeague.name}</h3>
                      <p className="text-xs text-gray-500">Saison 2024-25</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Top 5</span>
                </div>
              </div>

              {/* Liste des équipes */}
              <div className="divide-y divide-gray-800/50 min-h-[280px]">
                {isCurrentLoading ? (
                  <div className="flex items-center justify-center h-[280px]">
                    <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : currentStandings.length === 0 ? (
                  <div className="flex items-center justify-center h-[280px] text-gray-500">
                    Aucune donnée disponible
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentLeague.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentStandings.map((team, index) => {
                        const trend = getTrend(team.form);

                        return (
                          <motion.div
                            key={team.team.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group px-6 py-4 hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              {/* Position */}
                              <div className={`
                                w-8 h-8 flex items-center justify-center font-bold text-sm
                                ${index === 0
                                  ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black'
                                  : index < 3
                                    ? `bg-gradient-to-br ${currentLeague.color} text-white`
                                    : 'bg-gray-800 text-gray-400'
                                }
                              `}
                              style={{ clipPath: octagonClip }}
                              >
                                {team.position}
                              </div>

                              {/* Logo équipe */}
                              <img
                                src={team.team.crest}
                                alt={team.team.name}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  // Fallback si le logo ne charge pas
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><circle cx="12" cy="12" r="10"/></svg>';
                                }}
                              />

                              {/* Nom équipe */}
                              <span className="flex-1 font-medium text-white group-hover:text-pink-400 transition-colors truncate">
                                {team.team.name}
                              </span>

                              {/* Tendance */}
                              {trend && (
                                <div className={`
                                  p-1 rounded-full
                                  ${trend === 'up' ? 'bg-green-500/20 text-green-400' : ''}
                                  ${trend === 'down' ? 'bg-red-500/20 text-red-400' : ''}
                                  ${trend === 'stable' ? 'bg-gray-500/20 text-gray-400' : ''}
                                `}>
                                  {trend === 'up' && <TrendingUp className="w-4 h-4" />}
                                  {trend === 'down' && <TrendingDown className="w-4 h-4" />}
                                  {trend === 'stable' && <Minus className="w-4 h-4" />}
                                </div>
                              )}

                              {/* Points */}
                              <div className="text-right">
                                <span className="text-xl font-black text-white">{team.points}</span>
                                <span className="text-xs text-gray-500 ml-1">pts</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-gray-800 bg-black/30">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Mise à jour en temps réel</span>
                  <Link to="/classements" className="text-pink-400 hover:text-pink-300 transition-colors">
                    Classement complet →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuickStandingsSection;
