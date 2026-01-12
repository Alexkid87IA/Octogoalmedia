// src/pages/PlayerPage.tsx
// Fiche détaillée d'un joueur - Version enrichie

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Ruler,
  Scale,
  Trophy,
  Target,
  Shield,
  Activity,
  TrendingUp,
  Star,
  AlertTriangle,
  Zap,
  Award,
  Clock,
  Percent,
  Flag,
  Users,
  ArrowRight,
  ChevronRight,
  Footprints,
  Hand,
  CircleDot,
} from 'lucide-react';
import {
  getPlayerInfo,
  getPlayerTransfers,
  getPlayerTrophies,
} from '../services/apiFootball';

// Types
interface PlayerInfo {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: {
    date: string;
    place: string;
    country: string;
  };
  nationality: string;
  height: string;
  weight: string;
  photo: string;
  injured: boolean;
  statistics: PlayerStats[];
}

interface PlayerStats {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
  };
  games: {
    appearences: number;
    lineups: number;
    minutes: number;
    position: string;
    rating: number | null;
    captain: boolean;
  };
  goals: {
    total: number;
    assists: number;
    conceded: number;
    saves: number;
  };
  passes: {
    total: number;
    key: number;
    accuracy: number | null; // Peut être null si l'API ne fournit pas cette donnée
  };
  tackles: {
    total: number;
    blocks: number;
    interceptions: number;
  };
  duels: {
    total: number;
    won: number;
  };
  dribbles: {
    attempts: number;
    success: number;
  };
  fouls: {
    drawn: number;
    committed: number;
  };
  cards: {
    yellow: number;
    yellowred: number;
    red: number;
  };
  penalty: {
    won: number;
    scored: number;
    missed: number;
    saved: number;
  };
}

interface Transfer {
  date: string;
  type: string;
  teams: {
    in: { id: number; name: string; logo: string };
    out: { id: number; name: string; logo: string };
  };
}

interface PlayerTrophy {
  league: string;
  country: string;
  season: string;
  place: string;
}

// Clip-path octogonal
const octagonClipCard = 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)';
const octagonClipLarge = 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)';

// Composant StatCard amélioré (comme FootballClubPage)
const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  gradient = 'from-pink-500 to-rose-600',
}: {
  icon: any;
  label: string;
  value: string | number;
  subValue?: string;
  gradient?: string;
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

// Composant Progress Bar stylisé
const ProgressBar = ({
  label,
  value,
  max = 100,
  showPercent = false,
  gradient = 'from-pink-500 to-blue-500',
}: {
  label: string;
  value: number;
  max?: number;
  showPercent?: boolean;
  gradient?: string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">
          {showPercent ? `${value}%` : value}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
        />
      </div>
    </div>
  );
};

// Interface pour les stats agrégées du radar
interface AggregatedStatsForRadar {
  goals: number;
  assists: number;
  keyPasses: number;
  tackles: number;
  interceptions: number;
  duelsWon: number;
  duelsTotal: number;
  dribblesSuccess: number;
  dribblesAttempts: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
}

// Composant Radar Chart avec valeurs normalisées (utilise stats agrégées)
const RadarChart = ({ stats }: { stats: AggregatedStatsForRadar }) => {
  // Calculer des pourcentages normalisés pour un affichage équilibré
  // Basé sur les stats AGREGEES de toutes les compétitions

  // Attaque: buts + assists par match (max ~1.5 G+A/match = 100%)
  const contributionPerMatch = stats.appearances > 0
    ? ((stats.goals + stats.assists) / stats.appearances)
    : 0;
  const attackNorm = Math.min(contributionPerMatch / 1.5 * 100, 100);

  // Création de jeu: passes clés par match (max ~3/match = 100%)
  const keyPassesPerMatch = stats.appearances > 0
    ? stats.keyPasses / stats.appearances
    : 0;
  const creativityNorm = Math.min(keyPassesPerMatch / 3 * 100, 100);

  // Dribbles: taux de réussite
  const dribbleSuccess = stats.dribblesAttempts > 0
    ? (stats.dribblesSuccess / stats.dribblesAttempts) * 100
    : 50; // Par défaut 50% si pas de données

  // Défense: tacles + interceptions par match (max ~5/match = 100%)
  const defensePerMatch = stats.appearances > 0
    ? ((stats.tackles + stats.interceptions) / stats.appearances)
    : 0;
  const defenseNorm = Math.min(defensePerMatch / 5 * 100, 100);

  // Duels: taux de victoire
  const duelSuccess = stats.duelsTotal > 0
    ? (stats.duelsWon / stats.duelsTotal) * 100
    : 50; // Par défaut 50% si pas de données

  // Discipline: pénalité pour les cartons
  const discipline = Math.max(0, 100 - (stats.yellowCards * 10 + stats.redCards * 30));

  const attributes = [
    { label: 'Attaque', value: attackNorm },
    { label: 'Création', value: creativityNorm },
    { label: 'Dribbles', value: dribbleSuccess },
    { label: 'Défense', value: defenseNorm },
    { label: 'Duels', value: duelSuccess },
    { label: 'Discipline', value: discipline },
  ];

  // Toutes les valeurs sont maintenant sur 100
  const maxValue = 100;

  // Dimensions du SVG
  const svgWidth = 300;
  const svgHeight = 280;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const maxRadius = 80;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / attributes.length - Math.PI / 2;
    const radius = (value / maxValue) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const polygonPoints = attributes
    .map((attr, i) => {
      const point = getPoint(i, attr.value);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  // Position des labels avec offset personnalisé
  const getLabelPosition = (index: number) => {
    const angle = (Math.PI * 2 * index) / attributes.length - Math.PI / 2;
    const labelRadius = maxRadius + 35;
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
      angle,
    };
  };

  return (
    <div className="flex justify-center items-center">
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {/* Cercles de fond */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <polygon
            key={i}
            points={attributes
              .map((_, idx) => {
                const angle = (Math.PI * 2 * idx) / attributes.length - Math.PI / 2;
                const radius = maxRadius * scale;
                return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
              })
              .join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Lignes radiales */}
        {attributes.map((_, i) => {
          const angle = (Math.PI * 2 * i) / attributes.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={centerX + maxRadius * Math.cos(angle)}
              y2={centerY + maxRadius * Math.sin(angle)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Zone de stats */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          points={polygonPoints}
          fill="url(#radarGradient)"
          stroke="url(#radarStroke)"
          strokeWidth="2"
          style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Labels avec valeurs */}
        {attributes.map((attr, i) => {
          const pos = getLabelPosition(i);

          // Ajuster l'ancrage selon la position horizontale
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (pos.x < centerX - 10) textAnchor = 'end';
          else if (pos.x > centerX + 10) textAnchor = 'start';

          return (
            <g key={i}>
              <text
                x={pos.x}
                y={pos.y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="fill-gray-300 text-xs font-medium"
              >
                {attr.label}
              </text>
              <text
                x={pos.x}
                y={pos.y + 14}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="fill-gray-500 text-[10px]"
              >
                {Math.round(attr.value)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Composant Jauge circulaire pour la note
const RatingGauge = ({ rating }: { rating: number }) => {
  const percentage = (rating / 10) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (r: number) => {
    if (r >= 8) return '#22c55e';
    if (r >= 7) return '#84cc16';
    if (r >= 6.5) return '#eab308';
    if (r >= 6) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="56"
          cy="56"
          r="45"
          stroke={getColor(rating)}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white">{rating.toFixed(1)}</span>
        <span className="text-[10px] text-gray-500 uppercase">Note</span>
      </div>
    </div>
  );
};

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [trophies, setTrophies] = useState<PlayerTrophy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'career' | 'trophies'>('overview');

  useEffect(() => {
    async function fetchPlayerData() {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const playerId = parseInt(id);
        const [playerData, transfersData, trophiesData] = await Promise.all([
          getPlayerInfo(playerId),
          getPlayerTransfers(playerId),
          getPlayerTrophies(playerId),
        ]);

        if (!playerData) {
          setError('Joueur non trouvé');
          return;
        }

        setPlayer(playerData);
        setTransfers(transfersData);
        setTrophies(trophiesData);
      } catch (err) {
        console.error('Error fetching player:', err);
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerData();
  }, [id]);

  // Stats principales (première compétition avec des matchs)
  const mainStats = player?.statistics?.find(s => s.games.appearences > 0) || player?.statistics?.[0];

  // Fonction pour gérer le retour intelligent
  const handleGoBack = () => {
    // Si on a un historique, on retourne en arrière
    if (window.history.length > 2) {
      navigate(-1);
    } else if (mainStats?.team?.id) {
      // Sinon on va sur la page du club
      navigate(`/classements/club/${mainStats.team.id}`);
    } else {
      // Fallback vers les classements
      navigate('/classements');
    }
  };

  // Calcul de la précision des passes pondérée par les minutes jouées
  // L'API peut retourner null pour accuracy sur certaines compétitions
  const calculateWeightedPassAccuracy = () => {
    if (!player?.statistics) return null;

    let totalWeightedAccuracy = 0;
    let totalMinutes = 0;

    for (const stat of player.statistics) {
      const accuracy = stat.passes?.accuracy;
      const minutes = stat.games?.minutes || 0;

      // On ne prend en compte que les compétitions avec accuracy non-null et minutes > 0
      if (accuracy !== null && accuracy !== undefined && accuracy > 0 && minutes > 0) {
        totalWeightedAccuracy += accuracy * minutes;
        totalMinutes += minutes;
      }
    }

    if (totalMinutes === 0) return null;
    return Math.round(totalWeightedAccuracy / totalMinutes);
  };

  const weightedPassAccuracy = calculateWeightedPassAccuracy();

  // Toutes les stats agrégées (TOUTES les compétitions cumulées)
  const aggregatedStats = player?.statistics?.reduce(
    (acc, stat) => ({
      appearances: acc.appearances + (stat.games.appearences || 0),
      minutes: acc.minutes + (stat.games.minutes || 0),
      goals: acc.goals + (stat.goals.total || 0),
      assists: acc.assists + (stat.goals.assists || 0),
      yellowCards: acc.yellowCards + (stat.cards.yellow || 0),
      yellowRedCards: acc.yellowRedCards + (stat.cards.yellowred || 0),
      redCards: acc.redCards + (stat.cards.red || 0),
      passes: acc.passes + (stat.passes.total || 0),
      keyPasses: acc.keyPasses + (stat.passes.key || 0),
      tackles: acc.tackles + (stat.tackles.total || 0),
      interceptions: acc.interceptions + (stat.tackles.interceptions || 0),
      blocks: acc.blocks + (stat.tackles.blocks || 0),
      duelsWon: acc.duelsWon + (stat.duels.won || 0),
      duelsTotal: acc.duelsTotal + (stat.duels.total || 0),
      dribblesSuccess: acc.dribblesSuccess + (stat.dribbles.success || 0),
      dribblesAttempts: acc.dribblesAttempts + (stat.dribbles.attempts || 0),
      foulsDrawn: acc.foulsDrawn + (stat.fouls.drawn || 0),
      foulsCommitted: acc.foulsCommitted + (stat.fouls.committed || 0),
      penaltyScored: acc.penaltyScored + (stat.penalty.scored || 0),
      penaltyMissed: acc.penaltyMissed + (stat.penalty.missed || 0),
      penaltyWon: acc.penaltyWon + (stat.penalty.won || 0),
      penaltySaved: acc.penaltySaved + (stat.penalty.saved || 0),
      saves: acc.saves + (stat.goals.saves || 0),
      conceded: acc.conceded + (stat.goals.conceded || 0),
    }),
    {
      appearances: 0,
      minutes: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      yellowRedCards: 0,
      redCards: 0,
      passes: 0,
      keyPasses: 0,
      tackles: 0,
      interceptions: 0,
      blocks: 0,
      duelsWon: 0,
      duelsTotal: 0,
      dribblesSuccess: 0,
      dribblesAttempts: 0,
      foulsDrawn: 0,
      foulsCommitted: 0,
      penaltyScored: 0,
      penaltyMissed: 0,
      penaltyWon: 0,
      penaltySaved: 0,
      saves: 0,
      conceded: 0,
    }
  );

  // Position traduite
  const getPositionFR = (position: string) => {
    const positions: Record<string, string> = {
      Goalkeeper: 'Gardien',
      Defender: 'Défenseur',
      Midfielder: 'Milieu',
      Attacker: 'Attaquant',
    };
    return positions[position] || position;
  };

  // Couleur de la position
  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      Goalkeeper: 'from-yellow-500 to-orange-500',
      Defender: 'from-blue-500 to-indigo-600',
      Midfielder: 'from-green-500 to-emerald-600',
      Attacker: 'from-pink-500 to-rose-600',
    };
    return colors[position] || 'from-gray-500 to-gray-600';
  };

  // Nombre de trophées gagnés
  const trophiesWon = trophies.filter(t => t.place === 'Winner').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement du joueur...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <User className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{error || 'Joueur non trouvé'}</h2>
          <p className="text-gray-500 mb-6">Impossible de charger les informations du joueur</p>
          <Link
            to="/classements"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux classements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />
      </div>

      {/* Hero Section */}
      <header className="relative pt-24 pb-8 overflow-hidden">
        {/* Background blur effect */}
        {player.photo && (
          <div
            className="absolute inset-0 opacity-20 blur-3xl"
            style={{
              backgroundImage: `url(${player.photo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Bouton retour intelligent */}
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
          </button>

          {/* Hero content */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Photo du joueur */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex-shrink-0"
            >
              <div
                className="w-48 h-48 lg:w-56 lg:h-56 overflow-hidden bg-gradient-to-br from-pink-500/20 to-blue-500/20 border-2 border-white/10"
                style={{ clipPath: octagonClipLarge }}
              >
                {player.photo ? (
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-24 h-24 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Badge blessé */}
              {player.injured && (
                <div className="absolute -top-2 -right-2 p-3 bg-red-500 rounded-xl shadow-lg shadow-red-500/30">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Badge position */}
              {mainStats?.games.position && (
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r ${getPositionColor(mainStats.games.position)} rounded-full text-white text-sm font-bold shadow-lg`}>
                  {getPositionFR(mainStats.games.position)}
                </div>
              )}
            </motion.div>

            {/* Infos joueur */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Nom */}
                <h1 className="text-4xl lg:text-5xl font-black text-white mb-3">
                  {player.firstname && (
                    <span className="text-gray-400 font-medium">{player.firstname} </span>
                  )}
                  <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                    {player.lastname || player.name}
                  </span>
                </h1>

                {/* Équipe actuelle */}
                {mainStats?.team && (
                  <Link
                    to={`/classements/club/${mainStats.team.id}`}
                    className="inline-flex items-center gap-3 text-lg text-gray-300 hover:text-white mb-6 transition-colors group"
                  >
                    <img src={mainStats.team.logo} alt="" className="w-8 h-8 object-contain" />
                    <span className="font-medium">{mainStats.team.name}</span>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {mainStats?.games.rating && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-300 font-bold text-lg">{mainStats.games.rating.toFixed(2)}</span>
                    </div>
                  )}
                  {mainStats?.games.captain && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                      <Award className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-300 font-medium">Capitaine</span>
                    </div>
                  )}
                  {trophiesWon > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span className="text-amber-300 font-medium">{trophiesWon} titre{trophiesWon > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Infos personnelles */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {player.age && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <Calendar className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Âge</p>
                        <p className="text-white font-semibold">{player.age} ans</p>
                      </div>
                    </div>
                  )}
                  {player.nationality && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <Flag className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Nationalité</p>
                        <p className="text-white font-semibold">{player.nationality}</p>
                      </div>
                    </div>
                  )}
                  {player.height && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <Ruler className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Taille</p>
                        <p className="text-white font-semibold">{player.height}</p>
                      </div>
                    </div>
                  )}
                  {player.weight && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <Scale className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Poids</p>
                        <p className="text-white font-semibold">{player.weight}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Note circulaire (desktop) */}
            {mainStats?.games.rating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block"
              >
                <RatingGauge rating={mainStats.games.rating} />
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Stats Row */}
      {aggregatedStats && (
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard
              icon={Users}
              label="Matchs"
              value={aggregatedStats.appearances}
              subValue={`${Math.floor(aggregatedStats.minutes / 60)}h jouées`}
              gradient="from-blue-500 to-indigo-600"
            />
            <StatCard
              icon={Target}
              label="Buts"
              value={aggregatedStats.goals}
              subValue={aggregatedStats.appearances > 0 ? `${(aggregatedStats.goals / aggregatedStats.appearances).toFixed(2)}/match` : undefined}
              gradient="from-green-500 to-emerald-600"
            />
            <StatCard
              icon={Zap}
              label="Passes D."
              value={aggregatedStats.assists}
              subValue={aggregatedStats.appearances > 0 ? `${(aggregatedStats.assists / aggregatedStats.appearances).toFixed(2)}/match` : undefined}
              gradient="from-purple-500 to-violet-600"
            />
            <StatCard
              icon={Activity}
              label="G+A"
              value={aggregatedStats.goals + aggregatedStats.assists}
              subValue="Contributions"
              gradient="from-pink-500 to-rose-600"
            />
            <StatCard
              icon={Hand}
              label="Passes clés"
              value={aggregatedStats.keyPasses}
              gradient="from-cyan-500 to-blue-600"
            />
            <StatCard
              icon={Shield}
              label="Tacles"
              value={aggregatedStats.tackles}
              subValue={`${aggregatedStats.interceptions} intercept.`}
              gradient="from-orange-500 to-red-600"
            />
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="sticky top-20 z-30 bg-black/90 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
              { id: 'stats', label: 'Stats détaillées', icon: TrendingUp },
              { id: 'career', label: 'Carrière', icon: Clock },
              { id: 'trophies', label: 'Palmarès', icon: Trophy },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu des tabs */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Tab Vue d'ensemble */}
          {activeTab === 'overview' && mainStats && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-pink-400" />
                    Profil du joueur
                  </h3>
                  {aggregatedStats && (
                    <RadarChart stats={aggregatedStats} />
                  )}
                </div>

                {/* Stats clés - utilise aggregatedStats pour cohérence */}
                {aggregatedStats && (
                  <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Statistiques clés
                    </h3>
                    <div className="space-y-5">
                      <ProgressBar
                        label="Précision des passes"
                        value={weightedPassAccuracy || 0}
                        max={100}
                        showPercent
                        gradient="from-blue-500 to-cyan-500"
                      />
                      <ProgressBar
                        label="Réussite dribbles"
                        value={aggregatedStats.dribblesAttempts > 0 ? Math.round((aggregatedStats.dribblesSuccess / aggregatedStats.dribblesAttempts) * 100) : 0}
                        max={100}
                        showPercent
                        gradient="from-purple-500 to-pink-500"
                      />
                      <ProgressBar
                        label="Duels gagnés"
                        value={aggregatedStats.duelsTotal > 0 ? Math.round((aggregatedStats.duelsWon / aggregatedStats.duelsTotal) * 100) : 0}
                        max={100}
                        showPercent
                        gradient="from-green-500 to-emerald-500"
                      />
                      <ProgressBar
                        label="Penaltys convertis"
                        value={(aggregatedStats.penaltyScored + aggregatedStats.penaltyMissed) > 0 ? Math.round((aggregatedStats.penaltyScored / (aggregatedStats.penaltyScored + aggregatedStats.penaltyMissed)) * 100) : 0}
                        max={100}
                        showPercent
                        gradient="from-orange-500 to-yellow-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Stats rapides en grille - utilise aggregatedStats */}
              {aggregatedStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4 text-center">
                    <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{aggregatedStats.goals}</p>
                    <p className="text-xs text-gray-500">Buts</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4 text-center">
                    <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{aggregatedStats.assists}</p>
                    <p className="text-xs text-gray-500">Passes D.</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4 text-center">
                    <CircleDot className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{aggregatedStats.keyPasses}</p>
                    <p className="text-xs text-gray-500">Passes clés</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4 text-center">
                    <Footprints className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{aggregatedStats.dribblesSuccess}</p>
                    <p className="text-xs text-gray-500">Dribbles</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4 text-center">
                    <Shield className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{aggregatedStats.tackles}</p>
                    <p className="text-xs text-gray-500">Tacles</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4 text-center">
                    <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{aggregatedStats.duelsWon}</p>
                    <p className="text-xs text-gray-500">Duels gagnés</p>
                  </div>
                </div>
              )}

              {/* Discipline - utilise aggregatedStats */}
              {aggregatedStats && (
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Discipline
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-xl">
                      <div className="w-8 h-10 bg-yellow-400 rounded-sm" />
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">{aggregatedStats.yellowCards}</p>
                        <p className="text-xs text-gray-500">Cartons jaunes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-xl">
                      <div className="w-8 h-10 bg-red-500 rounded-sm" />
                      <div>
                        <p className="text-2xl font-bold text-red-400">{aggregatedStats.redCards}</p>
                        <p className="text-xs text-gray-500">Cartons rouges</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-2xl font-bold text-white">{aggregatedStats.foulsCommitted}</p>
                      <p className="text-xs text-gray-500">Fautes commises</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-2xl font-bold text-white">{aggregatedStats.foulsDrawn}</p>
                      <p className="text-xs text-gray-500">Fautes subies</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab Stats détaillées - utilise aggregatedStats */}
          {activeTab === 'stats' && aggregatedStats && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attaque */}
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Attaque
                  </h3>
                  <div className="space-y-5">
                    <ProgressBar label="Buts marqués" value={aggregatedStats.goals} max={30} gradient="from-green-500 to-emerald-500" />
                    <ProgressBar label="Passes décisives" value={aggregatedStats.assists} max={20} gradient="from-blue-500 to-cyan-500" />
                    <ProgressBar label="Dribbles réussis" value={aggregatedStats.dribblesSuccess} max={100} gradient="from-purple-500 to-pink-500" />
                    <ProgressBar label="Tentatives de dribbles" value={aggregatedStats.dribblesAttempts} max={150} gradient="from-violet-500 to-purple-500" />
                    <div className="pt-4 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Penaltys marqués</p>
                          <p className="text-white font-bold text-lg">{aggregatedStats.penaltyScored}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Penaltys ratés</p>
                          <p className="text-white font-bold text-lg">{aggregatedStats.penaltyMissed}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passes */}
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Passes
                  </h3>
                  <div className="space-y-5">
                    <ProgressBar label="Passes totales" value={aggregatedStats.passes} max={2500} gradient="from-blue-500 to-indigo-500" />
                    <ProgressBar label="Passes clés" value={aggregatedStats.keyPasses} max={100} gradient="from-pink-500 to-rose-500" />
                    <ProgressBar label="Précision (%)" value={weightedPassAccuracy || 0} max={100} showPercent gradient="from-green-500 to-teal-500" />
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-center">
                        <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {weightedPassAccuracy !== null ? `${weightedPassAccuracy}%` : 'N/A'}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">Taux de réussite des passes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Défense */}
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Défense
                  </h3>
                  <div className="space-y-5">
                    <ProgressBar label="Tacles réussis" value={aggregatedStats.tackles} max={100} gradient="from-purple-500 to-indigo-500" />
                    <ProgressBar label="Interceptions" value={aggregatedStats.interceptions} max={80} gradient="from-indigo-500 to-blue-500" />
                    <ProgressBar label="Blocs" value={aggregatedStats.blocks} max={50} gradient="from-blue-500 to-cyan-500" />
                    <div className="pt-4 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Duels gagnés</p>
                          <p className="text-white font-bold text-lg">{aggregatedStats.duelsWon}/{aggregatedStats.duelsTotal}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">% Duels</p>
                          <p className="text-white font-bold text-lg">
                            {aggregatedStats.duelsTotal > 0 ? Math.round((aggregatedStats.duelsWon / aggregatedStats.duelsTotal) * 100) : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discipline étendue */}
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Discipline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-8 bg-yellow-400 rounded-sm" />
                        <span className="text-gray-300">Cartons jaunes</span>
                      </div>
                      <span className="text-yellow-400 font-bold text-2xl">{aggregatedStats.yellowCards}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-orange-500/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-8 bg-gradient-to-b from-yellow-400 to-red-500 rounded-sm" />
                        <span className="text-gray-300">Double jaune</span>
                      </div>
                      <span className="text-orange-400 font-bold text-2xl">{aggregatedStats.yellowRedCards}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-8 bg-red-500 rounded-sm" />
                        <span className="text-gray-300">Cartons rouges</span>
                      </div>
                      <span className="text-red-400 font-bold text-2xl">{aggregatedStats.redCards}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="p-3 bg-white/5 rounded-xl text-center">
                        <p className="text-xl font-bold text-white">{aggregatedStats.foulsCommitted}</p>
                        <p className="text-xs text-gray-500">Fautes commises</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl text-center">
                        <p className="text-xl font-bold text-white">{aggregatedStats.foulsDrawn}</p>
                        <p className="text-xs text-gray-500">Fautes subies</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats gardien si applicable */}
              {mainStats?.games.position === 'Goalkeeper' && (
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Hand className="w-5 h-5 text-orange-500" />
                    Statistiques gardien
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <p className="text-3xl font-bold text-green-400">{aggregatedStats.saves}</p>
                      <p className="text-sm text-gray-500">Arrêts</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <p className="text-3xl font-bold text-red-400">{aggregatedStats.conceded}</p>
                      <p className="text-sm text-gray-500">Buts encaissés</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <p className="text-3xl font-bold text-blue-400">{aggregatedStats.penaltySaved}</p>
                      <p className="text-sm text-gray-500">Penaltys arrêtés</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <p className="text-3xl font-bold text-white">
                        {aggregatedStats.saves > 0 && aggregatedStats.conceded >= 0
                          ? Math.round((aggregatedStats.saves / (aggregatedStats.saves + aggregatedStats.conceded)) * 100)
                          : 0}%
                      </p>
                      <p className="text-sm text-gray-500">Taux d'arrêt</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab Carrière */}
          {activeTab === 'career' && (
            <motion.div
              key="career"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Tableau par compétition */}
              <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Statistiques par compétition
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                        <th className="py-4 px-4 text-left">Compétition</th>
                        <th className="py-4 px-4 text-left">Équipe</th>
                        <th className="py-4 px-4 text-center">MJ</th>
                        <th className="py-4 px-4 text-center">Min</th>
                        <th className="py-4 px-4 text-center">Buts</th>
                        <th className="py-4 px-4 text-center">PD</th>
                        <th className="py-4 px-4 text-center">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {player.statistics.map((stat, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {stat.league.logo && (
                                <img src={stat.league.logo} alt="" className="w-6 h-6 object-contain" />
                              )}
                              <div>
                                <span className="text-white font-medium">{stat.league.name}</span>
                                <p className="text-gray-500 text-xs">{stat.league.country}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Link
                              to={`/classements/club/${stat.team.id}`}
                              className="flex items-center gap-2 hover:text-pink-400 transition-colors"
                            >
                              {stat.team.logo && (
                                <img src={stat.team.logo} alt="" className="w-5 h-5 object-contain" />
                              )}
                              <span className="text-gray-300">{stat.team.name}</span>
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-center text-white font-medium">{stat.games.appearences}</td>
                          <td className="py-4 px-4 text-center text-gray-400">{stat.games.minutes}</td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-green-400 font-bold">{stat.goals.total}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-blue-400 font-medium">{stat.goals.assists}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {stat.games.rating ? (
                              <span className={`font-bold ${
                                stat.games.rating >= 7.5 ? 'text-green-400' :
                                stat.games.rating >= 7 ? 'text-lime-400' :
                                stat.games.rating >= 6.5 ? 'text-yellow-400' :
                                'text-orange-400'
                              }`}>
                                {stat.games.rating.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-600">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline des transferts */}
              {transfers.length > 0 && (
                <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Historique des transferts
                  </h3>
                  <div className="relative">
                    {/* Ligne verticale */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500" />

                    <div className="space-y-6">
                      {transfers.slice(0, 15).map((transfer, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative pl-16"
                        >
                          {/* Point sur la timeline */}
                          <div className="absolute left-4 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 border-4 border-black" />

                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-gray-500 text-sm">
                                {new Date(transfer.date).toLocaleDateString('fr-FR', {
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                transfer.type === 'Free' ? 'bg-green-500/20 text-green-400' :
                                transfer.type === 'Loan' ? 'bg-blue-500/20 text-blue-400' :
                                transfer.type === 'N/A' ? 'bg-gray-500/20 text-gray-400' :
                                'bg-pink-500/20 text-pink-400'
                              }`}>
                                {transfer.type === 'Free' ? 'Libre' :
                                 transfer.type === 'Loan' ? 'Prêt' :
                                 transfer.type === 'N/A' ? 'Transfert' :
                                 transfer.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 flex-1">
                                {transfer.teams.out.logo && (
                                  <img src={transfer.teams.out.logo} alt="" className="w-8 h-8 object-contain" />
                                )}
                                <span className="text-gray-400 truncate">{transfer.teams.out.name}</span>
                              </div>
                              <ArrowRight className="w-5 h-5 text-pink-400 flex-shrink-0" />
                              <div className="flex items-center gap-2 flex-1 justify-end">
                                <span className="text-white font-medium truncate">{transfer.teams.in.name}</span>
                                {transfer.teams.in.logo && (
                                  <img src={transfer.teams.in.logo} alt="" className="w-8 h-8 object-contain" />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab Palmarès */}
          {activeTab === 'trophies' && (
            <motion.div
              key="trophies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {trophies.length > 0 ? (
                <div className="space-y-6">
                  {/* Résumé */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-2xl border border-yellow-500/30 p-6 text-center">
                      <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                      <p className="text-4xl font-black text-yellow-400">{trophiesWon}</p>
                      <p className="text-gray-400 text-sm mt-1">Titres</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 rounded-2xl border border-gray-400/30 p-6 text-center">
                      <Award className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-4xl font-black text-gray-300">{trophies.filter(t => t.place === '2nd').length}</p>
                      <p className="text-gray-500 text-sm mt-1">Finaliste</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl border border-orange-500/30 p-6 text-center">
                      <Star className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                      <p className="text-4xl font-black text-orange-400">{trophies.filter(t => t.place === '3rd').length}</p>
                      <p className="text-gray-500 text-sm mt-1">3ème place</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-blue-500/30 p-6 text-center">
                      <Users className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                      <p className="text-4xl font-black text-blue-400">{trophies.length}</p>
                      <p className="text-gray-500 text-sm mt-1">Total</p>
                    </div>
                  </div>

                  {/* Liste des trophées */}
                  <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Tous les trophées
                      </h3>
                    </div>
                    <div className="p-4 grid gap-3">
                      {trophies.map((trophy, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-xl ${
                            trophy.place === 'Winner'
                              ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20'
                              : trophy.place === '2nd'
                              ? 'bg-gradient-to-r from-gray-500/10 to-gray-400/10 border border-gray-500/20'
                              : trophy.place === '3rd'
                              ? 'bg-gradient-to-r from-orange-500/10 to-orange-400/10 border border-orange-500/20'
                              : 'bg-white/5 border border-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {trophy.place === 'Winner' ? (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-white" />
                              </div>
                            ) : trophy.place === '2nd' ? (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">2</span>
                              </div>
                            ) : trophy.place === '3rd' ? (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">3</span>
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <Star className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className={`font-bold ${trophy.place === 'Winner' ? 'text-yellow-400' : 'text-white'}`}>
                                {trophy.league}
                              </p>
                              <p className="text-gray-500 text-sm">{trophy.country}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">{trophy.season}</p>
                            <p className={`text-sm ${
                              trophy.place === 'Winner' ? 'text-yellow-400' :
                              trophy.place === '2nd' ? 'text-gray-400' :
                              trophy.place === '3rd' ? 'text-orange-400' :
                              'text-gray-500'
                            }`}>
                              {trophy.place === 'Winner' ? 'Champion' :
                               trophy.place === '2nd' ? 'Finaliste' :
                               trophy.place === '3rd' ? '3ème' :
                               trophy.place}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Aucun trophée enregistré</h3>
                  <p className="text-gray-500">Les données de palmarès ne sont pas disponibles pour ce joueur</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
