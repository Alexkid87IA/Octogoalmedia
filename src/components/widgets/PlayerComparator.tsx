// src/components/widgets/PlayerComparator.tsx
// Widget Comparateur de Joueurs - Compare les stats de deux joueurs

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, Trophy, Target, Footprints, Shield, Zap, ChevronDown, BarChart3, AlertTriangle, Flame, Crown, Swords } from 'lucide-react';
import { getTopScorersEurope, getTopAssistsEurope, getPlayerInfo, TOP_5_LEAGUES } from '../../services/apiFootball';

interface PlayerBasic {
  id: number;
  name: string;
  photo?: string;
  team?: {
    id: number;
    name: string;
    crest?: string;
  };
  league?: {
    id: number;
    name: string;
    flag: string;
  };
  goals: number;
  assists: number;
}

interface PlayerStats {
  id: number;
  name: string;
  photo?: string;
  nationality?: string;
  age?: number;
  height?: string;
  position?: string;
  team?: {
    id: number;
    name: string;
    logo?: string;
  };
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    rating: number | null;
    minutes: number;
    shotsTotal: number;
    shotsOnTarget: number;
    passesTotal: number;
    passesKey: number;
    passAccuracy: number | null;
    dribblesAttempts: number;
    dribblesSuccess: number;
    tacklesTotal: number;
    interceptions: number;
    duelsWon: number;
    duelsTotal: number;
    foulsDrawn: number;
    foulsCommitted: number;
    yellowCards: number;
    redCards: number;
  };
}

interface StatBarProps {
  label: string;
  value1: number;
  value2: number;
  max?: number;
  icon?: React.ReactNode;
  format?: (v: number) => string;
}

const StatBar: React.FC<StatBarProps> = ({ label, value1, value2, max, icon, format }) => {
  const maxVal = max || Math.max(value1, value2, 1);
  const pct1 = (value1 / maxVal) * 100;
  const pct2 = (value2 / maxVal) * 100;
  const formatFn = format || ((v: number) => v.toString());

  // Déterminer le gagnant
  const winner = value1 > value2 ? 1 : value2 > value1 ? 2 : 0;

  return (
    <div className="mb-2.5">
      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
        <span className={`font-black text-xs flex items-center gap-1 ${winner === 1 ? 'text-pink-400' : 'text-white/70'}`}>
          {winner === 1 && <Flame size={10} className="text-orange-400" />}
          {formatFn(value1)}
        </span>
        <span className="flex items-center gap-1 text-gray-500 text-[9px] uppercase tracking-wider">
          {icon}
          {label}
        </span>
        <span className={`font-black text-xs flex items-center gap-1 ${winner === 2 ? 'text-blue-400' : 'text-white/70'}`}>
          {formatFn(value2)}
          {winner === 2 && <Flame size={10} className="text-orange-400" />}
        </span>
      </div>
      <div className="flex gap-0.5 h-2 relative">
        <div className="flex-1 bg-gray-800/50 rounded-l-full overflow-hidden flex justify-end">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct1}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-l-full ${winner === 1 ? 'bg-gradient-to-l from-pink-500 via-pink-400 to-orange-400 shadow-lg shadow-pink-500/50' : 'bg-gradient-to-l from-pink-500/50 to-pink-600/50'}`}
          />
        </div>
        <div className="flex-1 bg-gray-800/50 rounded-r-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct2}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-r-full ${winner === 2 ? 'bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 shadow-lg shadow-blue-500/50' : 'bg-gradient-to-r from-blue-500/50 to-blue-600/50'}`}
          />
        </div>
      </div>
    </div>
  );
};

const PlayerComparator: React.FC = () => {
  const [players, setPlayers] = useState<PlayerBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [selectedPlayer1, setSelectedPlayer1] = useState<PlayerBasic | null>(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState<PlayerBasic | null>(null);
  const [player1Stats, setPlayer1Stats] = useState<PlayerStats | null>(null);
  const [player2Stats, setPlayer2Stats] = useState<PlayerStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // Charger la liste des joueurs (top scorers + assists)
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const [scorers, assists] = await Promise.all([
          getTopScorersEurope(),
          getTopAssistsEurope()
        ]);

        // Fusionner et dédupliquer
        const allPlayers = new Map<number, PlayerBasic>();
        [...scorers, ...assists].forEach(p => {
          if (!allPlayers.has(p.player.id)) {
            allPlayers.set(p.player.id, {
              id: p.player.id,
              name: p.player.name,
              photo: p.player.photo,
              team: p.team,
              league: p.league,
              goals: p.goals,
              assists: p.assists,
            });
          }
        });

        // Filtrer pour ne garder que les joueurs avec des stats significatives
        // (au moins quelques buts ou passes pour éviter les joueurs sans données)
        const playerList = Array.from(allPlayers.values()).filter(p =>
          (p.goals > 0 || p.assists > 0)
        );

        setPlayers(playerList);

        // Auto-sélectionner les 2 premiers joueurs par défaut
        if (playerList.length >= 2 && !hasAutoSelected) {
          // Prendre des joueurs différents (1er et 3ème pour plus de variété)
          setSelectedPlayer1(playerList[0]);
          setSelectedPlayer2(playerList[2] || playerList[1]);
          setHasAutoSelected(true);
        }
      } catch (error) {
        console.error('Erreur chargement joueurs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [hasAutoSelected]);

  // Charger les stats détaillées quand un joueur est sélectionné
  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedPlayer1 && !selectedPlayer2) return;

      setLoadingStats(true);
      try {
        const [stats1, stats2] = await Promise.all([
          selectedPlayer1 ? getPlayerInfo(selectedPlayer1.id) : null,
          selectedPlayer2 ? getPlayerInfo(selectedPlayer2.id) : null,
        ]);

        // Fonction pour agréger les stats de toutes les compétitions
        const aggregateStats = (statistics: any[]) => {
          const aggregated = {
            appearances: 0,
            goals: 0,
            assists: 0,
            minutes: 0,
            passesTotal: 0,
            passesKey: 0,
            dribblesAttempts: 0,
            dribblesSuccess: 0,
            tacklesTotal: 0,
            interceptions: 0,
            duelsWon: 0,
            duelsTotal: 0,
            foulsDrawn: 0,
            foulsCommitted: 0,
            yellowCards: 0,
            redCards: 0,
            ratingSum: 0,
            ratingCount: 0,
          };

          statistics.forEach((stat: any) => {
            aggregated.appearances += stat.games?.appearences || 0;
            aggregated.goals += stat.goals?.total || 0;
            aggregated.assists += stat.goals?.assists || 0;
            aggregated.minutes += stat.games?.minutes || 0;
            aggregated.passesTotal += stat.passes?.total || 0;
            aggregated.passesKey += stat.passes?.key || 0;
            aggregated.dribblesAttempts += stat.dribbles?.attempts || 0;
            aggregated.dribblesSuccess += stat.dribbles?.success || 0;
            aggregated.tacklesTotal += stat.tackles?.total || 0;
            aggregated.interceptions += stat.tackles?.interceptions || 0;
            aggregated.duelsWon += stat.duels?.won || 0;
            aggregated.duelsTotal += stat.duels?.total || 0;
            aggregated.foulsDrawn += stat.fouls?.drawn || 0;
            aggregated.foulsCommitted += stat.fouls?.committed || 0;
            aggregated.yellowCards += stat.cards?.yellow || 0;
            aggregated.redCards += stat.cards?.red || 0;
            if (stat.games?.rating) {
              aggregated.ratingSum += parseFloat(stat.games.rating);
              aggregated.ratingCount += 1;
            }
          });

          return {
            ...aggregated,
            rating: aggregated.ratingCount > 0 ? aggregated.ratingSum / aggregated.ratingCount : null,
          };
        };

        if (stats1) {
          const allStats = stats1.statistics || [];
          const mainStats = allStats[0]; // Pour position et team
          const agg = aggregateStats(allStats);

          setPlayer1Stats({
            id: stats1.id,
            name: stats1.name,
            photo: stats1.photo,
            nationality: stats1.nationality,
            age: stats1.age,
            height: stats1.height,
            position: mainStats?.games?.position,
            team: mainStats?.team,
            stats: {
              appearances: agg.appearances,
              goals: agg.goals,
              assists: agg.assists,
              rating: agg.rating,
              minutes: agg.minutes,
              shotsTotal: 0,
              shotsOnTarget: 0,
              passesTotal: agg.passesTotal,
              passesKey: agg.passesKey,
              passAccuracy: null,
              dribblesAttempts: agg.dribblesAttempts,
              dribblesSuccess: agg.dribblesSuccess,
              tacklesTotal: agg.tacklesTotal,
              interceptions: agg.interceptions,
              duelsWon: agg.duelsWon,
              duelsTotal: agg.duelsTotal,
              foulsDrawn: agg.foulsDrawn,
              foulsCommitted: agg.foulsCommitted,
              yellowCards: agg.yellowCards,
              redCards: agg.redCards,
            }
          });
        }

        if (stats2) {
          const allStats = stats2.statistics || [];
          const mainStats = allStats[0];
          const agg = aggregateStats(allStats);

          setPlayer2Stats({
            id: stats2.id,
            name: stats2.name,
            photo: stats2.photo,
            nationality: stats2.nationality,
            age: stats2.age,
            height: stats2.height,
            position: mainStats?.games?.position,
            team: mainStats?.team,
            stats: {
              appearances: agg.appearances,
              goals: agg.goals,
              assists: agg.assists,
              rating: agg.rating,
              minutes: agg.minutes,
              shotsTotal: 0,
              shotsOnTarget: 0,
              passesTotal: agg.passesTotal,
              passesKey: agg.passesKey,
              passAccuracy: null,
              dribblesAttempts: agg.dribblesAttempts,
              dribblesSuccess: agg.dribblesSuccess,
              tacklesTotal: agg.tacklesTotal,
              interceptions: agg.interceptions,
              duelsWon: agg.duelsWon,
              duelsTotal: agg.duelsTotal,
              foulsDrawn: agg.foulsDrawn,
              foulsCommitted: agg.foulsCommitted,
              yellowCards: agg.yellowCards,
              redCards: agg.redCards,
            }
          });
        }
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [selectedPlayer1, selectedPlayer2]);

  // Filtrer les joueurs selon la recherche
  const filteredPlayers1 = useMemo(() => {
    if (!searchQuery1.trim()) return players.slice(0, 20);
    const query = searchQuery1.toLowerCase();
    return players.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.team?.name.toLowerCase().includes(query)
    ).slice(0, 20);
  }, [players, searchQuery1]);

  const filteredPlayers2 = useMemo(() => {
    if (!searchQuery2.trim()) return players.slice(0, 20);
    const query = searchQuery2.toLowerCase();
    return players.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.team?.name.toLowerCase().includes(query)
    ).slice(0, 20);
  }, [players, searchQuery2]);

  const handleSelectPlayer1 = (player: PlayerBasic) => {
    setSelectedPlayer1(player);
    setSearchQuery1('');
    setShowDropdown1(false);
  };

  const handleSelectPlayer2 = (player: PlayerBasic) => {
    setSelectedPlayer2(player);
    setSearchQuery2('');
    setShowDropdown2(false);
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden shadow-xl shadow-black/20">
      {/* Reflet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none rounded-2xl" />
      {/* Header Clash Style */}
      <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-pink-900/30 via-purple-900/20 to-blue-900/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Swords className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Face à Face</span>
            <h3 className="text-sm font-black text-white leading-tight">Qui est le GOAT ?</h3>
          </div>
        </div>
      </div>

      {/* Sélection des joueurs - Compact */}
      <div className="p-3 grid grid-cols-2 gap-2">
        {/* Player 1 Selector */}
        <div className="relative">
          {selectedPlayer1 ? (
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-pink-500/20 to-pink-500/5 rounded-lg border border-pink-500/30">
              <img
                src={selectedPlayer1.photo || '/placeholder-player.png'}
                alt={selectedPlayer1.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-pink-500/50"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-xs truncate">{selectedPlayer1.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{selectedPlayer1.team?.name}</p>
              </div>
              <button
                onClick={() => { setSelectedPlayer1(null); setPlayer1Stats(null); }}
                className="p-0.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={12} className="text-gray-400" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-2 px-2.5 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <Search size={14} className="text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Joueur 1..."
                  value={searchQuery1}
                  onChange={(e) => setSearchQuery1(e.target.value)}
                  onFocus={() => setShowDropdown1(true)}
                  className="flex-1 bg-transparent text-white text-xs placeholder-gray-500 outline-none min-w-0"
                />
              </div>
              <AnimatePresence>
                {showDropdown1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 left-0 right-0 mt-2 bg-black/80 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                  >
                    {loading ? (
                      <div className="p-4 text-center text-gray-500 text-sm">Chargement...</div>
                    ) : filteredPlayers1.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">Aucun joueur trouvé</div>
                    ) : (
                      filteredPlayers1.map(player => (
                        <button
                          key={player.id}
                          onClick={() => handleSelectPlayer1(player)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <img
                            src={player.photo || '/placeholder-player.png'}
                            alt={player.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{player.name}</p>
                            <p className="text-xs text-gray-500 truncate">{player.team?.name} · {player.league?.flag}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-pink-400 font-bold">{player.goals} buts</p>
                            <p className="text-xs text-blue-400">{player.assists} passes</p>
                          </div>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Player 2 Selector */}
        <div className="relative">
          {selectedPlayer2 ? (
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-500/5 to-blue-500/20 rounded-lg border border-blue-500/30">
              <img
                src={selectedPlayer2.photo || '/placeholder-player.png'}
                alt={selectedPlayer2.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/50"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-xs truncate">{selectedPlayer2.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{selectedPlayer2.team?.name}</p>
              </div>
              <button
                onClick={() => { setSelectedPlayer2(null); setPlayer2Stats(null); }}
                className="p-0.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={12} className="text-gray-400" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-2 px-2.5 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <Search size={14} className="text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Joueur 2..."
                  value={searchQuery2}
                  onChange={(e) => setSearchQuery2(e.target.value)}
                  onFocus={() => setShowDropdown2(true)}
                  className="flex-1 bg-transparent text-white text-xs placeholder-gray-500 outline-none min-w-0"
                />
              </div>
              <AnimatePresence>
                {showDropdown2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 left-0 right-0 mt-2 bg-black/80 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                  >
                    {loading ? (
                      <div className="p-4 text-center text-gray-500 text-sm">Chargement...</div>
                    ) : filteredPlayers2.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">Aucun joueur trouvé</div>
                    ) : (
                      filteredPlayers2.map(player => (
                        <button
                          key={player.id}
                          onClick={() => handleSelectPlayer2(player)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <img
                            src={player.photo || '/placeholder-player.png'}
                            alt={player.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{player.name}</p>
                            <p className="text-xs text-gray-500 truncate">{player.team?.name} · {player.league?.flag}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-pink-400 font-bold">{player.goals} buts</p>
                            <p className="text-xs text-blue-400">{player.assists} passes</p>
                          </div>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Stats Comparison */}
      {loadingStats ? (
        <div className="p-4 text-center">
          <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-500 text-xs">Chargement...</p>
        </div>
      ) : player1Stats && player2Stats ? (
        <div className="p-3 border-t border-white/10">
          {/* Alerte données limitées */}
          {(player1Stats.stats.appearances < 5 || player2Stats.stats.appearances < 5) && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 mb-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertTriangle size={12} className="text-yellow-500 flex-shrink-0" />
              <p className="text-[10px] text-yellow-400">
                {player1Stats.stats.appearances < 5 && player2Stats.stats.appearances < 5
                  ? 'Peu de matchs pour les deux joueurs'
                  : player1Stats.stats.appearances < 5
                    ? `${player1Stats.name} : peu de matchs (${player1Stats.stats.appearances})`
                    : `${player2Stats.name} : peu de matchs (${player2Stats.stats.appearances})`
                }
              </p>
            </div>
          )}

          {/* Photos et noms - Clash Style */}
          <div className="flex justify-between items-center mb-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-md" />
                <img
                  src={player1Stats.photo || '/placeholder-player.png'}
                  alt={player1Stats.name}
                  className="relative w-12 h-12 rounded-full object-cover border-2 border-pink-400 shadow-lg shadow-pink-500/30"
                />
                {player1Stats.stats.appearances < 5 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <AlertTriangle size={8} className="text-black" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-black text-white text-xs">{player1Stats.name}</p>
                <p className="text-[10px] text-pink-400/70">{player1Stats.team?.name}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
              transition={{ delay: 0.3, rotate: { repeat: Infinity, duration: 2 } }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/40 rotate-12"
            >
              <span className="text-white font-black text-[10px] -rotate-12">VS</span>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 text-right"
            >
              <div>
                <p className="font-black text-white text-xs">{player2Stats.name}</p>
                <p className="text-[10px] text-blue-400/70">{player2Stats.team?.name}</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md" />
                <img
                  src={player2Stats.photo || '/placeholder-player.png'}
                  alt={player2Stats.name}
                  className="relative w-12 h-12 rounded-full object-cover border-2 border-blue-400 shadow-lg shadow-blue-500/30"
                />
                {player2Stats.stats.appearances < 5 && (
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <AlertTriangle size={8} className="text-black" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Stats Bars - Compact: show only key stats */}
          <div className="space-y-0">
            <StatBar
              label="Buts"
              value1={player1Stats.stats.goals}
              value2={player2Stats.stats.goals}
              icon={<Target size={10} />}
            />
            <StatBar
              label="Passes D."
              value1={player1Stats.stats.assists}
              value2={player2Stats.stats.assists}
              icon={<Footprints size={10} />}
            />
            <StatBar
              label="Matchs"
              value1={player1Stats.stats.appearances}
              value2={player2Stats.stats.appearances}
              icon={<Users size={10} />}
            />
            {player1Stats.stats.rating && player2Stats.stats.rating && (
              <StatBar
                label="Note"
                value1={player1Stats.stats.rating}
                value2={player2Stats.stats.rating}
                max={10}
                format={(v) => v.toFixed(1)}
                icon={<Trophy size={10} />}
              />
            )}
            <StatBar
              label="Dribbles"
              value1={player1Stats.stats.dribblesSuccess}
              value2={player2Stats.stats.dribblesSuccess}
              icon={<Zap size={10} />}
            />
          </div>

          {/* Verdict Final */}
          {(() => {
            // Calculer le score
            const stats = [
              { v1: player1Stats.stats.goals, v2: player2Stats.stats.goals },
              { v1: player1Stats.stats.assists, v2: player2Stats.stats.assists },
              { v1: player1Stats.stats.appearances, v2: player2Stats.stats.appearances },
              { v1: player1Stats.stats.rating || 0, v2: player2Stats.stats.rating || 0 },
              { v1: player1Stats.stats.dribblesSuccess, v2: player2Stats.stats.dribblesSuccess },
            ];
            const score1 = stats.filter(s => s.v1 > s.v2).length;
            const score2 = stats.filter(s => s.v2 > s.v1).length;
            const winner = score1 > score2 ? 1 : score2 > score1 ? 2 : 0;

            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 pt-3 border-t border-white/10"
              >
                {/* Score */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <motion.span
                    animate={{ scale: winner === 1 ? [1, 1.1, 1] : 1 }}
                    transition={{ repeat: winner === 1 ? Infinity : 0, duration: 1.5 }}
                    className={`text-2xl font-black ${winner === 1 ? 'text-pink-400' : 'text-white/50'}`}
                  >
                    {score1}
                  </motion.span>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest">Verdict</span>
                    <span className="text-xs font-bold text-gray-400">-</span>
                  </div>
                  <motion.span
                    animate={{ scale: winner === 2 ? [1, 1.1, 1] : 1 }}
                    transition={{ repeat: winner === 2 ? Infinity : 0, duration: 1.5 }}
                    className={`text-2xl font-black ${winner === 2 ? 'text-blue-400' : 'text-white/50'}`}
                  >
                    {score2}
                  </motion.span>
                </div>

                {/* Winner Banner */}
                {winner !== 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg ${
                      winner === 1
                        ? 'bg-gradient-to-r from-pink-500/20 to-pink-500/5 border border-pink-500/30'
                        : 'bg-gradient-to-r from-blue-500/5 to-blue-500/20 border border-blue-500/30'
                    }`}
                  >
                    <Crown size={14} className={winner === 1 ? 'text-pink-400' : 'text-blue-400'} />
                    <span className={`text-xs font-bold ${winner === 1 ? 'text-pink-400' : 'text-blue-400'}`}>
                      {winner === 1 ? player1Stats.name : player2Stats.name} domine !
                    </span>
                    <Flame size={14} className="text-orange-400" />
                  </motion.div>
                )}

                {winner === 0 && (
                  <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/10 border border-purple-500/30">
                    <Swords size={14} className="text-purple-400" />
                    <span className="text-xs font-bold text-purple-400">Égalité parfaite !</span>
                  </div>
                )}
              </motion.div>
            );
          })()}
        </div>
      ) : (
        <div className="p-6 text-center border-t border-white/10">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Swords size={28} className="mx-auto mb-2 text-orange-500/50" />
          </motion.div>
          <p className="text-gray-400 text-xs font-medium">Choisis tes combattants !</p>
          <p className="text-gray-600 text-[10px] mt-1">Sélectionne 2 joueurs pour le clash</p>
        </div>
      )}

      {/* Close dropdown on outside click */}
      {(showDropdown1 || showDropdown2) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowDropdown1(false); setShowDropdown2(false); }}
        />
      )}
    </div>
  );
};

export default PlayerComparator;
