import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Sparkles, ChevronRight, Filter, Globe2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getTopScorersEurope,
  getTopAssistsEurope,
  getTopContributorsEurope,
  getTopRatingsEurope,
  TOP_5_LEAGUES,
  EuropeanPlayerStats,
} from '../../services/apiFootball';

// Clip-path octogonal
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';

type TabType = 'scorers' | 'assists' | 'contributors' | 'ratings';

interface EuropeanRankingsProps {
  defaultTab?: TabType;
  limit?: number;
  showFilters?: boolean;
}

// Composant pour les médailles/positions
const PositionBadge = ({ position }: { position: number }) => {
  if (position === 1) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
        <Trophy className="w-4 h-4 text-white" />
      </div>
    );
  }
  if (position === 2) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg shadow-gray-400/30">
        <span className="text-white font-bold text-sm">2</span>
      </div>
    );
  }
  if (position === 3) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg shadow-amber-600/30">
        <span className="text-white font-bold text-sm">3</span>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <span className="text-gray-400 font-semibold">{position}</span>
    </div>
  );
};

// Composant ligne de joueur
const PlayerRow = ({
  player,
  position,
  type,
  isHovered,
  onHover,
}: {
  player: EuropeanPlayerStats;
  position: number;
  type: TabType;
  isHovered: boolean;
  onHover: (id: number | null) => void;
}) => {
  const isTop3 = position <= 3;

  const getStatValue = () => {
    switch (type) {
      case 'scorers':
        return player.goals;
      case 'assists':
        return player.assists;
      case 'contributors':
        return player.total;
      case 'ratings':
        return player.rating?.toFixed(2) || '-';
    }
  };

  const getStatLabel = () => {
    switch (type) {
      case 'scorers':
        return 'buts';
      case 'assists':
        return 'passes';
      case 'contributors':
        return 'G+A';
      case 'ratings':
        return 'note';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, delay: position * 0.02 }}
      onMouseEnter={() => onHover(player.player.id)}
      onMouseLeave={() => onHover(null)}
      className={`
        group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer
        ${isTop3 ? 'bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/20' : ''}
        ${position % 2 === 0 && !isTop3 ? 'bg-white/[0.02]' : ''}
        ${isHovered ? 'bg-white/10 scale-[1.01]' : 'hover:bg-white/5'}
      `}
    >
      {/* Position */}
      <PositionBadge position={position} />

      {/* Photo joueur */}
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
            isTop3 ? 'border-pink-500/50' : 'border-gray-700'
          }`}
        >
          {player.player.photo ? (
            <img
              src={player.player.photo}
              alt={player.player.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/default-player.png';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 text-lg">?</span>
            </div>
          )}
        </div>
        {/* Drapeau championnat overlay */}
        <div className="absolute -bottom-1 -right-1 text-sm" title={player.league.name}>
          {player.league.flag}
        </div>
      </div>

      {/* Infos joueur */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/joueur/${player.player.id}`}
          className="font-semibold text-white hover:text-pink-400 transition-colors truncate block"
        >
          {player.player.name}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          {player.team.crest && (
            <img src={player.team.crest} alt={player.team.name} className="w-4 h-4 object-contain" />
          )}
          <span className="text-sm text-gray-400 truncate">{player.team.name}</span>
        </div>
      </div>

      {/* Stats secondaires (visible au hover) */}
      <div className={`hidden sm:flex items-center gap-4 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
        {type !== 'scorers' && (
          <div className="text-center">
            <div className="text-sm font-medium text-white">{player.goals}</div>
            <div className="text-[10px] text-gray-500 uppercase">Buts</div>
          </div>
        )}
        {type !== 'assists' && (
          <div className="text-center">
            <div className="text-sm font-medium text-white">{player.assists}</div>
            <div className="text-[10px] text-gray-500 uppercase">Passes</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-sm font-medium text-white">{player.playedMatches}</div>
          <div className="text-[10px] text-gray-500 uppercase">Matchs</div>
        </div>
      </div>

      {/* Stat principale */}
      <div
        className={`
          flex flex-col items-center justify-center min-w-[60px] py-2 px-4 rounded-xl
          ${isTop3
            ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
            : 'bg-gray-800 text-white'
          }
        `}
      >
        <span className="text-xl font-bold">{getStatValue()}</span>
        <span className="text-[10px] uppercase opacity-75">{getStatLabel()}</span>
      </div>

      {/* Flèche */}
      <ChevronRight
        className={`w-5 h-5 text-gray-500 transition-all ${
          isHovered ? 'opacity-100 translate-x-1 text-pink-400' : 'opacity-0'
        }`}
      />
    </motion.div>
  );
};

export const EuropeanRankings: React.FC<EuropeanRankingsProps> = ({
  defaultTab = 'scorers',
  limit = 20,
  showFilters = true,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
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

  // Filtrer par ligue si sélectionnée
  const filteredPlayers = selectedLeague
    ? players.filter((p) => p.league.id === selectedLeague)
    : players;

  const displayedPlayers = filteredPlayers.slice(0, limit);

  const tabs = [
    { id: 'scorers' as TabType, label: 'Buteurs', icon: Target },
    { id: 'assists' as TabType, label: 'Passeurs', icon: Sparkles },
    { id: 'contributors' as TabType, label: 'Contributeurs', icon: Trophy },
    { id: 'ratings' as TabType, label: 'Notes', icon: Star },
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="p-3 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl shadow-lg shadow-pink-500/25"
              style={{ clipPath: octagonClip }}
            >
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Classements Européens
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Toutes compétitions : Championnats + Coupes Européennes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex gap-2 p-1 bg-gray-900/50 rounded-xl border border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Filtre par ligue */}
          {showFilters && (
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
                      px-3 py-1.5 rounded-lg text-lg transition-all
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
          )}
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                <span className="text-gray-400">Chargement des classements...</span>
              </div>
            </div>
          ) : displayedPlayers.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Aucun joueur trouvé</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              <AnimatePresence mode="wait">
                {displayedPlayers.map((player, index) => (
                  <PlayerRow
                    key={`${activeTab}-${player.player.id}`}
                    player={player}
                    position={index + 1}
                    type={activeTab}
                    isHovered={hoveredPlayer === player.player.id}
                    onHover={setHoveredPlayer}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer / CTA */}
        {!isLoading && displayedPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <Link
              to="/classements/europe"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 rounded-xl text-white font-medium transition-all"
            >
              <span>Voir le classement complet</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" />
            <span>Or</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full" />
            <span>Argent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full" />
            <span>Bronze</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EuropeanRankings;
