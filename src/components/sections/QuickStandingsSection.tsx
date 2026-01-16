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
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const currentLeague = LEAGUE_CONFIG[currentLeagueIndex];

  // Charger le classement de la ligue actuelle
  useEffect(() => {
    const fetchStandings = async () => {
      const leagueKey = currentLeague.key as keyof typeof LEAGUES;

      // Si déjà en cache, ne pas recharger
      if (standings[leagueKey]) {
        console.log(`[QuickStandings] Cache hit for ${leagueKey}`);
        setIsLoading(false);
        setHasError(false);
        return;
      }

      try {
        setLoadingLeague(leagueKey);
        setHasError(false);
        const leagueId = LEAGUES[leagueKey];
        console.log(`[QuickStandings] Fetching ${leagueKey} (ID: ${leagueId})...`);

        if (!leagueId) {
          console.error(`[QuickStandings] No league ID for ${leagueKey}`);
          setHasError(true);
          return;
        }

        const data = await getStandings(String(leagueId));
        console.log(`[QuickStandings] Got ${data?.length || 0} teams for ${leagueKey}`);

        if (data && data.length > 0) {
          setStandings(prev => ({
            ...prev,
            [leagueKey]: data.slice(0, 5)
          }));
          console.log(`[QuickStandings] Stored ${data.slice(0, 5).length} teams in state`);
          setHasError(false);
        } else {
          console.warn(`[QuickStandings] No data received for ${leagueKey}`);
          setHasError(true);
        }
      } catch (error) {
        console.error('[QuickStandings] Error fetching:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
        setLoadingLeague(null);
      }
    };

    fetchStandings();
  }, [currentLeagueIndex, retryCount]);

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
                  className="p-2 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                {/* League Pills - Design badge octogonal */}
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
                        flex items-center gap-2 px-4 py-2 whitespace-nowrap transition-all border backdrop-blur-sm
                        ${index === currentLeagueIndex
                          ? `bg-gradient-to-r ${league.color}/20 border-pink-500/50 text-white shadow-lg shadow-pink-500/20`
                          : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.08] hover:text-white hover:border-white/20'
                        }
                      `}
                      style={{ clipPath: octagonClipSubtle }}
                    >
                      <span className="text-lg">{league.flag}</span>
                      <span className="text-sm font-medium hidden sm:inline">{league.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  className="p-2 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all"
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
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4">
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

            {/* Card principale avec glassmorphism */}
            <div
              className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/30"
              style={{ clipPath: octagonClipSubtle }}
            >
              {/* Reflet glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              {/* Header du tableau */}
              <div className={`relative px-4 py-3 border-b border-white/10 bg-gradient-to-r ${currentLeague.color}/10`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 bg-gradient-to-br ${currentLeague.color} flex items-center justify-center`}
                      style={{ clipPath: octagonClip }}
                    >
                      <span className="text-sm">{currentLeague.flag}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{currentLeague.name}</h3>
                      <p className="text-xs text-gray-400">Saison 2025-26</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500">Top 5</span>
                </div>
              </div>

              {/* Liste des équipes */}
              <div className="relative divide-y divide-white/5 min-h-[240px]">
                {isCurrentLoading ? (
                  <div className="flex items-center justify-center h-[240px]">
                    <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : currentStandings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[240px] text-gray-500 gap-3">
                    <span className="text-sm">{hasError ? 'Erreur de chargement' : 'Aucune donnée disponible'}</span>
                    <button
                      onClick={() => setRetryCount(c => c + 1)}
                      className="px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-xs transition-colors"
                    >
                      Réessayer
                    </button>
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
                            className="group px-4 py-2.5 hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {/* Position */}
                              <div className={`
                                w-7 h-7 flex items-center justify-center font-bold text-xs
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
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  // Fallback si le logo ne charge pas
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><circle cx="12" cy="12" r="10"/></svg>';
                                }}
                              />

                              {/* Nom équipe */}
                              <span className="flex-1 font-medium text-sm text-white group-hover:text-pink-400 transition-colors truncate">
                                {team.team.name}
                              </span>

                              {/* Tendance */}
                              {trend && (
                                <div className={`
                                  p-0.5 rounded-full
                                  ${trend === 'up' ? 'bg-green-500/20 text-green-400' : ''}
                                  ${trend === 'down' ? 'bg-red-500/20 text-red-400' : ''}
                                  ${trend === 'stable' ? 'bg-gray-500/20 text-gray-400' : ''}
                                `}>
                                  {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                                  {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                                  {trend === 'stable' && <Minus className="w-3.5 h-3.5" />}
                                </div>
                              )}

                              {/* Points */}
                              <div className="text-right">
                                <span className="text-lg font-black text-white">{team.points}</span>
                                <span className="text-[10px] text-gray-500 ml-1">pts</span>
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
              <div className="relative px-4 py-2 border-t border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between text-[10px] text-gray-500">
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
