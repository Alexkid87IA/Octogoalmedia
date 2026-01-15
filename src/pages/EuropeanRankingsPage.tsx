// src/pages/EuropeanRankingsPage.tsx
// Page dédiée aux classements européens agrégés (Top 5 championnats)
// Design sophistiqué avec hero, podium et cartes joueurs premium

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Globe2,
  Trophy,
  Target,
  Sparkles,
  Star,
  Filter,
  ChevronRight,
  TrendingUp,
  Crown,
  Medal,
} from 'lucide-react';
import {
  getTopScorersEurope,
  getTopAssistsEurope,
  getTopContributorsEurope,
  getTopRatingsEurope,
  TOP_5_LEAGUES,
  EuropeanPlayerStats,
} from '../services/apiFootball';

type TabType = 'scorers' | 'assists' | 'contributors' | 'ratings';

// Configuration des onglets
const TABS_CONFIG: Record<TabType, { label: string; icon: React.ElementType; statKey: keyof EuropeanPlayerStats | 'rating'; statLabel: string }> = {
  scorers: { label: 'Buteurs', icon: Target, statKey: 'goals', statLabel: 'Buts' },
  assists: { label: 'Passeurs', icon: Sparkles, statKey: 'assists', statLabel: 'Passes' },
  contributors: { label: 'Contributeurs', icon: Trophy, statKey: 'total', statLabel: 'G+A' },
  ratings: { label: 'Notes', icon: Star, statKey: 'rating', statLabel: 'Note' },
};

// Composant Hero avec le Top 3 en podium
const HeroSection = ({
  topPlayers,
  activeTab,
  isLoading,
}: {
  topPlayers: EuropeanPlayerStats[];
  activeTab: TabType;
  isLoading: boolean;
}) => {
  const config = TABS_CONFIG[activeTab];
  const [first, second, third] = topPlayers.slice(0, 3);

  const getStatValue = (player: EuropeanPlayerStats) => {
    if (activeTab === 'ratings') return player.rating?.toFixed(2) || '-';
    return player[config.statKey as keyof EuropeanPlayerStats] || 0;
  };

  return (
    <section className="relative min-h-[600px] overflow-hidden">
      {/* Background avec gradient et motifs */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-950/50 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(236,72,153,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.2),transparent_50%)]" />
        {/* Grille subtile */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Navigation retour */}
        <Link
          to="/classements"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux classements</span>
        </Link>

        {/* Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full border border-pink-500/30 mb-6">
            <Globe2 className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-pink-400">Toutes Compétitions Confondues</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Les{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
              Meilleurs {config.label}
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stats cumulées : championnats, coupes nationales et compétitions européennes
          </p>
        </motion.div>

        {/* Podium Top 3 */}
        {!isLoading && topPlayers.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-end justify-center gap-4 md:gap-8 mt-8"
          >
            {/* 2ème place */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="relative mb-4"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-400 shadow-xl shadow-gray-500/20">
                  {second?.player.photo ? (
                    <img
                      src={second.player.photo}
                      alt={second.player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-2xl text-gray-500">?</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold text-lg">2</span>
                </div>
              </motion.div>
              <div className="text-center">
                <p className="text-white font-bold text-sm md:text-base truncate max-w-[120px]">
                  {second?.player.name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {second?.team.crest && (
                    <img src={second.team.crest} alt="" className="w-4 h-4 object-contain" />
                  )}
                  <span className="text-gray-500 text-xs truncate max-w-[80px]">{second?.team.name}</span>
                </div>
                <p className="text-2xl md:text-3xl font-black text-gray-300 mt-2">
                  {second && getStatValue(second)}
                </p>
              </div>
              <div className="w-24 md:w-32 h-24 bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-lg mt-4" />
            </div>

            {/* 1ère place */}
            <div className="flex flex-col items-center -mt-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="relative mb-4"
              >
                {/* Couronne animée */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
                >
                  <Crown className="w-10 h-10 text-yellow-400 fill-yellow-400/50" />
                </motion.div>
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl shadow-yellow-500/30 ring-4 ring-yellow-400/20">
                  {first?.player.photo ? (
                    <img
                      src={first.player.photo}
                      alt={first.player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-3xl text-gray-500">?</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div className="text-center">
                <p className="text-white font-bold text-base md:text-lg">
                  {first?.player.name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {first?.team.crest && (
                    <img src={first.team.crest} alt="" className="w-5 h-5 object-contain" />
                  )}
                  <span className="text-gray-400 text-sm">{first?.team.name}</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mt-2">
                  {first && getStatValue(first)}
                </p>
              </div>
              <div className="w-32 md:w-40 h-32 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-lg mt-4" />
            </div>

            {/* 3ème place */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="relative mb-4"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-amber-600 shadow-xl shadow-amber-600/20">
                  {third?.player.photo ? (
                    <img
                      src={third.player.photo}
                      alt={third.player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-2xl text-gray-500">?</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
              </motion.div>
              <div className="text-center">
                <p className="text-white font-bold text-sm md:text-base truncate max-w-[120px]">
                  {third?.player.name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {third?.team.crest && (
                    <img src={third.team.crest} alt="" className="w-4 h-4 object-contain" />
                  )}
                  <span className="text-gray-500 text-xs truncate max-w-[80px]">{third?.team.name}</span>
                </div>
                <p className="text-2xl md:text-3xl font-black text-amber-500 mt-2">
                  {third && getStatValue(third)}
                </p>
              </div>
              <div className="w-24 md:w-32 h-16 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg mt-4" />
            </div>
          </motion.div>
        )}

        {/* Loading state pour le podium */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
};

// Carte joueur premium
const PlayerCard = ({
  player,
  position,
  activeTab,
  isHovered,
  onHover,
}: {
  player: EuropeanPlayerStats;
  position: number;
  activeTab: TabType;
  isHovered: boolean;
  onHover: (id: number | null) => void;
}) => {
  const config = TABS_CONFIG[activeTab];

  const getMainStat = () => {
    if (activeTab === 'ratings') return player.rating?.toFixed(2) || '-';
    return player[config.statKey as keyof EuropeanPlayerStats] || 0;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.02 }}
      onMouseEnter={() => onHover(player.player.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link
        to={`/player/${player.player.id}`}
        className={`
          group relative flex items-center gap-4 p-4 md:p-5 rounded-2xl transition-all duration-300
          bg-gradient-to-r from-gray-900/80 to-gray-900/40 border border-gray-800/50
          hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10
          ${isHovered ? 'scale-[1.02] border-pink-500/50' : ''}
        `}
      >
        {/* Position */}
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-800/80 flex items-center justify-center">
          <span className="text-lg md:text-xl font-bold text-gray-400">{position}</span>
        </div>

        {/* Photo joueur - Plus grande */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-800 ring-2 ring-gray-700 group-hover:ring-pink-500/50 transition-all">
            {player.player.photo ? (
              <img
                src={player.player.photo}
                alt={player.player.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl text-gray-600">?</span>
              </div>
            )}
          </div>
          {/* Badge ligue */}
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-sm"
            title={player.league.name}
          >
            {player.league.flag}
          </div>
        </div>

        {/* Infos joueur */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base md:text-lg group-hover:text-pink-400 transition-colors truncate">
            {player.player.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {player.team.crest && (
              <img src={player.team.crest} alt="" className="w-5 h-5 object-contain" />
            )}
            <span className="text-gray-400 text-sm truncate">{player.team.name}</span>
          </div>
        </div>

        {/* Stats secondaires - Desktop */}
        <div className="hidden md:flex items-center gap-6 text-center">
          {activeTab !== 'scorers' && (
            <div>
              <p className="text-white font-semibold">{player.goals}</p>
              <p className="text-[10px] text-gray-500 uppercase">Buts</p>
            </div>
          )}
          {activeTab !== 'assists' && (
            <div>
              <p className="text-white font-semibold">{player.assists}</p>
              <p className="text-[10px] text-gray-500 uppercase">Passes</p>
            </div>
          )}
          <div>
            <p className="text-white font-semibold">{player.playedMatches}</p>
            <p className="text-[10px] text-gray-500 uppercase">Matchs</p>
          </div>
        </div>

        {/* Stat principale */}
        <div className="flex-shrink-0 min-w-[70px] md:min-w-[80px] py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-pink-500/30 text-center">
          <p className="text-xl md:text-2xl font-black text-white">{getMainStat()}</p>
          <p className="text-[10px] text-pink-400 uppercase font-medium">{config.statLabel}</p>
        </div>

        {/* Flèche */}
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
};

export default function EuropeanRankingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(
    tabParam && ['scorers', 'assists', 'contributors', 'ratings'].includes(tabParam)
      ? tabParam
      : 'scorers'
  );
  const [players, setPlayers] = useState<EuropeanPlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPlayer, setHoveredPlayer] = useState<number | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data: EuropeanPlayerStats[] = [];
        switch (activeTab) {
          case 'scorers':
            data = await getTopScorersEurope();
            break;
          case 'assists':
            data = await getTopAssistsEurope();
            break;
          case 'contributors':
            data = await getTopContributorsEurope();
            break;
          case 'ratings':
            data = await getTopRatingsEurope();
            break;
        }
        setPlayers(data);
      } catch (error) {
        console.error('Erreur chargement classement:', error);
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Filtrer par ligue
  const filteredPlayers = selectedLeague
    ? players.filter((p) => p.league.id === selectedLeague)
    : players;

  // Joueurs à afficher (sans le top 3 qui est dans le hero)
  const displayedPlayers = filteredPlayers.slice(3);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero avec Podium */}
      <HeroSection topPlayers={filteredPlayers} activeTab={activeTab} isLoading={isLoading} />

      {/* Section principale */}
      <section className="relative -mt-8 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          {/* Barre de contrôles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800 p-4 md:p-6 mb-8 shadow-xl"
          >
            {/* Tabs */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-2 p-1 bg-gray-800/50 rounded-xl overflow-x-auto">
                {(Object.keys(TABS_CONFIG) as TabType[]).map((tab) => {
                  const config = TABS_CONFIG[tab];
                  const Icon = config.icon;
                  return (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                        ${activeTab === tab
                          ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{config.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Filtres ligues */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedLeague(null)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${selectedLeague === null
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    Tous
                  </button>
                  {TOP_5_LEAGUES.map((league) => (
                    <button
                      key={league.id}
                      onClick={() => setSelectedLeague(league.id === selectedLeague ? null : league.id)}
                      title={league.name}
                      className={`
                        w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all
                        ${selectedLeague === league.id
                          ? 'bg-pink-500/20 border border-pink-500/30'
                          : 'hover:bg-white/5'
                        }
                      `}
                    >
                      {league.flag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Liste des joueurs (à partir du 4ème) */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Chargement des classements...</p>
                  </div>
                </div>
              ) : displayedPlayers.length === 0 && filteredPlayers.length <= 3 ? (
                <div className="text-center py-12 text-gray-500">
                  Pas d'autres joueurs à afficher pour cette sélection
                </div>
              ) : (
                displayedPlayers.map((player, index) => (
                  <PlayerCard
                    key={`${activeTab}-${player.player.id}`}
                    player={player}
                    position={index + 4}
                    activeTab={activeTab}
                    isHovered={hoveredPlayer === player.player.id}
                    onHover={setHoveredPlayer}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Stats footer */}
          {!isLoading && filteredPlayers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 p-6 bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-2xl border border-gray-800"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                    {filteredPlayers.length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Joueurs classés</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                    5
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Championnats</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">
                    {filteredPlayers.reduce((sum, p) => sum + p.goals, 0)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Buts totaux</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">
                    {filteredPlayers.reduce((sum, p) => sum + p.assists, 0)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Passes totales</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
