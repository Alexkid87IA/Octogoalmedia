// src/pages/StandingsPage.tsx
// Page Classements complète - Tableaux, buteurs, passeurs, journées

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Calendar,
  Target,
  Plus,
  X,
  Search,
  Globe2,
} from 'lucide-react';
import EuropeanRankings from '../components/football/EuropeanRankings';
import {
  getStandings,
  getAllGroupStandings,
  getTopScorers,
  getTopAssists,
  getMatchesByMatchday,
  getCurrentRound,
  formatDateFR,
} from '../services/apiFootball';
import {
  Competition,
  getCompetition,
} from '../config/competitions';

// =============================================
// TYPES
// =============================================

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
  goalsFor: number;
  goalsAgainst: number;
  form?: string;
}

interface GroupStanding {
  name: string;
  teams: TeamStanding[];
}

// IDs des tournois internationaux avec plusieurs groupes
const INTERNATIONAL_TOURNAMENTS = [1, 4, 6, 9]; // World Cup, Euro, CAN, Copa America

interface Player {
  player: {
    id: number;
    name: string;
    photo?: string;
  };
  team: {
    id: number;
    name: string;
    crest: string;
  };
  goals: number;
  assists: number;
}

interface Match {
  id: number;
  utcDate: string;
  status: string;
  minute?: number;
  matchday: number;
  homeTeam: { id: number; name: string; shortName?: string; crest: string };
  awayTeam: { id: number; name: string; shortName?: string; crest: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

// =============================================
// COMPETITIONS
// =============================================

const MAIN_COMPETITIONS = [
  { id: 61, name: 'Ligue 1', flag: '🇫🇷', color: 'from-blue-600 to-blue-800' },
  { id: 39, name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: 'from-purple-600 to-purple-800' },
  { id: 140, name: 'La Liga', flag: '🇪🇸', color: 'from-red-600 to-yellow-600' },
  { id: 135, name: 'Serie A', flag: '🇮🇹', color: 'from-green-600 to-green-800' },
  { id: 78, name: 'Bundesliga', flag: '🇩🇪', color: 'from-red-600 to-black' },
  { id: 2, name: 'Champions League', flag: '🏆', color: 'from-blue-900 to-indigo-900' },
  { id: 3, name: 'Europa League', flag: '🧡', color: 'from-orange-500 to-orange-700' },
  { id: 848, name: 'Conference League', flag: '💚', color: 'from-green-500 to-emerald-700' },
];

// ID spécial pour le mode classement européen agrégé
const EUROPE_AGGREGATE_ID = 0;

// Autres championnats accessibles via le bouton "+"
const OTHER_COMPETITIONS = [
  // === EUROPE ===
  // France
  { id: 62, name: 'Ligue 2', flag: '🇫🇷', country: 'France', color: 'from-blue-500 to-blue-700' },
  { id: 63, name: 'National 1', flag: '🇫🇷', country: 'France', color: 'from-blue-400 to-blue-600' },
  // Angleterre
  { id: 40, name: 'Championship', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'Angleterre', color: 'from-purple-500 to-purple-700' },
  { id: 41, name: 'League One', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'Angleterre', color: 'from-purple-400 to-purple-600' },
  { id: 42, name: 'League Two', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'Angleterre', color: 'from-purple-300 to-purple-500' },
  // Espagne
  { id: 141, name: 'La Liga 2', flag: '🇪🇸', country: 'Espagne', color: 'from-red-500 to-yellow-500' },
  // Italie
  { id: 136, name: 'Serie B', flag: '🇮🇹', country: 'Italie', color: 'from-green-500 to-green-700' },
  // Allemagne
  { id: 79, name: '2. Bundesliga', flag: '🇩🇪', country: 'Allemagne', color: 'from-red-500 to-gray-800' },
  { id: 80, name: '3. Liga', flag: '🇩🇪', country: 'Allemagne', color: 'from-red-400 to-gray-700' },
  // Portugal
  { id: 94, name: 'Primeira Liga', flag: '🇵🇹', country: 'Portugal', color: 'from-green-600 to-red-600' },
  { id: 95, name: 'Liga Portugal 2', flag: '🇵🇹', country: 'Portugal', color: 'from-green-500 to-red-500' },
  // Pays-Bas
  { id: 88, name: 'Eredivisie', flag: '🇳🇱', country: 'Pays-Bas', color: 'from-orange-500 to-orange-700' },
  { id: 89, name: 'Eerste Divisie', flag: '🇳🇱', country: 'Pays-Bas', color: 'from-orange-400 to-orange-600' },
  // Belgique
  { id: 144, name: 'Pro League', flag: '🇧🇪', country: 'Belgique', color: 'from-yellow-500 to-red-600' },
  // Turquie
  { id: 203, name: 'Süper Lig', flag: '🇹🇷', country: 'Turquie', color: 'from-red-500 to-red-700' },
  { id: 204, name: '1. Lig', flag: '🇹🇷', country: 'Turquie', color: 'from-red-400 to-red-600' },
  // Écosse
  { id: 179, name: 'Premiership', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', country: 'Écosse', color: 'from-blue-600 to-blue-800' },
  // Grèce
  { id: 197, name: 'Super League', flag: '🇬🇷', country: 'Grèce', color: 'from-blue-400 to-blue-600' },
  // Autriche
  { id: 218, name: 'Bundesliga', flag: '🇦🇹', country: 'Autriche', color: 'from-red-600 to-red-800' },
  // Suisse
  { id: 207, name: 'Super League', flag: '🇨🇭', country: 'Suisse', color: 'from-red-500 to-gray-600' },
  // Russie
  { id: 235, name: 'Premier League', flag: '🇷🇺', country: 'Russie', color: 'from-red-600 to-blue-600' },
  // Ukraine
  { id: 333, name: 'Premier League', flag: '🇺🇦', country: 'Ukraine', color: 'from-blue-500 to-yellow-500' },
  // Pologne
  { id: 106, name: 'Ekstraklasa', flag: '🇵🇱', country: 'Pologne', color: 'from-red-500 to-gray-100' },
  // République Tchèque
  { id: 345, name: 'First League', flag: '🇨🇿', country: 'Rép. Tchèque', color: 'from-blue-500 to-red-500' },
  // Danemark
  { id: 119, name: 'Superliga', flag: '🇩🇰', country: 'Danemark', color: 'from-red-600 to-gray-100' },
  // Suède
  { id: 113, name: 'Allsvenskan', flag: '🇸🇪', country: 'Suède', color: 'from-blue-500 to-yellow-500' },
  // Norvège
  { id: 103, name: 'Eliteserien', flag: '🇳🇴', country: 'Norvège', color: 'from-red-600 to-blue-600' },
  // Croatie
  { id: 210, name: 'HNL', flag: '🇭🇷', country: 'Croatie', color: 'from-red-500 to-blue-500' },
  // Serbie
  { id: 286, name: 'Super Liga', flag: '🇷🇸', country: 'Serbie', color: 'from-red-600 to-blue-600' },
  // Roumanie
  { id: 283, name: 'Liga 1', flag: '🇷🇴', country: 'Roumanie', color: 'from-blue-500 to-yellow-500' },
  // Hongrie
  { id: 271, name: 'NB I', flag: '🇭🇺', country: 'Hongrie', color: 'from-red-500 to-green-600' },
  // Bulgarie
  { id: 172, name: 'First League', flag: '🇧🇬', country: 'Bulgarie', color: 'from-green-500 to-red-500' },
  // Slovaquie
  { id: 332, name: 'Super Liga', flag: '🇸🇰', country: 'Slovaquie', color: 'from-blue-500 to-red-500' },
  // Slovénie
  { id: 373, name: 'PrvaLiga', flag: '🇸🇮', country: 'Slovénie', color: 'from-blue-500 to-red-500' },
  // Chypre
  { id: 318, name: 'First Division', flag: '🇨🇾', country: 'Chypre', color: 'from-blue-500 to-orange-500' },
  // Israël
  { id: 384, name: 'Ligat Ha\'al', flag: '🇮🇱', country: 'Israël', color: 'from-blue-500 to-gray-100' },

  // === AMÉRIQUE DU NORD ===
  // USA
  { id: 253, name: 'MLS', flag: '🇺🇸', country: 'USA', color: 'from-blue-500 to-red-500' },
  { id: 254, name: 'USL Championship', flag: '🇺🇸', country: 'USA', color: 'from-blue-400 to-red-400' },
  // Mexique
  { id: 262, name: 'Liga MX', flag: '🇲🇽', country: 'Mexique', color: 'from-green-600 to-red-600' },
  { id: 263, name: 'Liga Expansión MX', flag: '🇲🇽', country: 'Mexique', color: 'from-green-500 to-red-500' },
  // Canada
  { id: 253, name: 'Canadian PL', flag: '🇨🇦', country: 'Canada', color: 'from-red-500 to-gray-100' },
  // Costa Rica
  { id: 162, name: 'Primera División', flag: '🇨🇷', country: 'Costa Rica', color: 'from-blue-500 to-red-500' },
  // Honduras
  { id: 196, name: 'Liga Nacional', flag: '🇭🇳', country: 'Honduras', color: 'from-blue-500 to-gray-100' },
  // Guatemala
  { id: 340, name: 'Liga Nacional', flag: '🇬🇹', country: 'Guatemala', color: 'from-blue-400 to-gray-100' },
  // El Salvador
  { id: 360, name: 'Primera División', flag: '🇸🇻', country: 'El Salvador', color: 'from-blue-500 to-gray-100' },
  // Panama
  { id: 362, name: 'LPF', flag: '🇵🇦', country: 'Panama', color: 'from-red-500 to-blue-500' },
  // Jamaïque
  { id: 343, name: 'Premier League', flag: '🇯🇲', country: 'Jamaïque', color: 'from-green-500 to-yellow-500' },

  // === AMÉRIQUE DU SUD ===
  // Brésil
  { id: 71, name: 'Série A', flag: '🇧🇷', country: 'Brésil', color: 'from-green-500 to-yellow-500' },
  { id: 72, name: 'Série B', flag: '🇧🇷', country: 'Brésil', color: 'from-green-400 to-yellow-400' },
  // Argentine
  { id: 128, name: 'Liga Profesional', flag: '🇦🇷', country: 'Argentine', color: 'from-blue-400 to-gray-100' },
  { id: 129, name: 'Primera Nacional', flag: '🇦🇷', country: 'Argentine', color: 'from-blue-300 to-gray-100' },
  // Colombie
  { id: 239, name: 'Liga BetPlay', flag: '🇨🇴', country: 'Colombie', color: 'from-yellow-500 to-blue-500' },
  // Chili
  { id: 265, name: 'Primera División', flag: '🇨🇱', country: 'Chili', color: 'from-red-500 to-blue-500' },
  // Pérou
  { id: 281, name: 'Liga 1', flag: '🇵🇪', country: 'Pérou', color: 'from-red-500 to-gray-100' },
  // Uruguay
  { id: 268, name: 'Primera División', flag: '🇺🇾', country: 'Uruguay', color: 'from-blue-400 to-gray-100' },
  // Paraguay
  { id: 279, name: 'Primera División', flag: '🇵🇾', country: 'Paraguay', color: 'from-red-500 to-blue-500' },
  // Équateur
  { id: 242, name: 'LigaPro', flag: '🇪🇨', country: 'Équateur', color: 'from-yellow-500 to-blue-500' },
  // Venezuela
  { id: 299, name: 'Primera División', flag: '🇻🇪', country: 'Venezuela', color: 'from-yellow-500 to-red-500' },
  // Bolivie
  { id: 157, name: 'División Profesional', flag: '🇧🇴', country: 'Bolivie', color: 'from-green-500 to-yellow-500' },

  // === ASIE ===
  // Arabie Saoudite
  { id: 307, name: 'Saudi Pro League', flag: '🇸🇦', country: 'Arabie Saoudite', color: 'from-green-600 to-green-800' },
  // Japon
  { id: 98, name: 'J1 League', flag: '🇯🇵', country: 'Japon', color: 'from-red-500 to-gray-100' },
  { id: 99, name: 'J2 League', flag: '🇯🇵', country: 'Japon', color: 'from-red-400 to-gray-100' },
  // Corée du Sud
  { id: 292, name: 'K League 1', flag: '🇰🇷', country: 'Corée du Sud', color: 'from-red-500 to-blue-500' },
  // Chine
  { id: 169, name: 'Super League', flag: '🇨🇳', country: 'Chine', color: 'from-red-600 to-yellow-500' },
  // Inde
  { id: 323, name: 'ISL', flag: '🇮🇳', country: 'Inde', color: 'from-orange-500 to-green-500' },
  // Thaïlande
  { id: 296, name: 'Thai League 1', flag: '🇹🇭', country: 'Thaïlande', color: 'from-red-500 to-blue-500' },
  // Indonésie
  { id: 274, name: 'Liga 1', flag: '🇮🇩', country: 'Indonésie', color: 'from-red-500 to-gray-100' },
  // Malaisie
  { id: 302, name: 'Super League', flag: '🇲🇾', country: 'Malaisie', color: 'from-yellow-500 to-blue-500' },
  // Vietnam
  { id: 340, name: 'V.League 1', flag: '🇻🇳', country: 'Vietnam', color: 'from-red-500 to-yellow-500' },
  // EAU
  { id: 304, name: 'Pro League', flag: '🇦🇪', country: 'EAU', color: 'from-green-500 to-red-500' },
  // Qatar
  { id: 305, name: 'Stars League', flag: '🇶🇦', country: 'Qatar', color: 'from-purple-600 to-gray-100' },
  // Iran
  { id: 290, name: 'Persian Gulf Pro', flag: '🇮🇷', country: 'Iran', color: 'from-green-500 to-red-500' },
  // Ouzbékistan
  { id: 367, name: 'Super League', flag: '🇺🇿', country: 'Ouzbékistan', color: 'from-blue-500 to-green-500' },
  // Kazakhstan
  { id: 390, name: 'Premier League', flag: '🇰🇿', country: 'Kazakhstan', color: 'from-blue-400 to-yellow-500' },

  // === AFRIQUE ===
  // Égypte
  { id: 233, name: 'Premier League', flag: '🇪🇬', country: 'Égypte', color: 'from-red-600 to-gray-800' },
  // Maroc
  { id: 200, name: 'Botola Pro', flag: '🇲🇦', country: 'Maroc', color: 'from-red-600 to-green-600' },
  // Algérie
  { id: 186, name: 'Ligue 1', flag: '🇩🇿', country: 'Algérie', color: 'from-green-600 to-gray-100' },
  // Tunisie
  { id: 202, name: 'Ligue 1', flag: '🇹🇳', country: 'Tunisie', color: 'from-red-500 to-gray-100' },
  // Afrique du Sud
  { id: 288, name: 'Premier League', flag: '🇿🇦', country: 'Afrique du Sud', color: 'from-green-500 to-yellow-500' },
  // Nigeria
  { id: 301, name: 'NPFL', flag: '🇳🇬', country: 'Nigeria', color: 'from-green-600 to-gray-100' },
  // Ghana
  { id: 347, name: 'Premier League', flag: '🇬🇭', country: 'Ghana', color: 'from-red-500 to-yellow-500' },
  // Côte d\'Ivoire
  { id: 373, name: 'Ligue 1', flag: '🇨🇮', country: 'Côte d\'Ivoire', color: 'from-orange-500 to-green-500' },
  // Sénégal
  { id: 377, name: 'Ligue 1', flag: '🇸🇳', country: 'Sénégal', color: 'from-green-500 to-yellow-500' },
  // Cameroun
  { id: 356, name: 'Elite One', flag: '🇨🇲', country: 'Cameroun', color: 'from-green-500 to-red-500' },

  // === OCÉANIE ===
  // Australie
  { id: 188, name: 'A-League', flag: '🇦🇺', country: 'Australie', color: 'from-blue-500 to-yellow-500' },
  // Nouvelle-Zélande
  { id: 401, name: 'Premiership', flag: '🇳🇿', country: 'Nouvelle-Zélande', color: 'from-gray-800 to-gray-100' },
];

// =============================================
// HELPERS
// =============================================

// Calculer la saison actuelle dynamiquement
function getCurrentSeasonDisplay(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  // Si entre janvier et juillet, c'est la saison année-1 / année
  // Sinon (août-décembre), c'est la saison année / année+1
  if (month < 7) {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
  return `${year}-${String(year + 1).slice(-2)}`;
}

// =============================================
// COMPOSANTS
// =============================================

// Indicateur de forme (tendance)
const TrendIndicator = ({ position, previousPosition }: { position: number; previousPosition?: number }) => {
  if (!previousPosition || position === previousPosition) {
    return <Minus className="w-3 h-3 text-gray-500" />;
  }
  if (position < previousPosition) {
    return <TrendingUp className="w-3 h-3 text-green-400" />;
  }
  return <TrendingDown className="w-3 h-3 text-red-400" />;
};

// Tableau de classement
const StandingsTable = ({ standings, competition, selectedComp }: {
  standings: TeamStanding[];
  competition: Competition | null;
  selectedComp: { id: number; name: string; flag: string; color?: string } | undefined;
}) => {
  // Fallback si competition est null
  const displayName = competition?.name || selectedComp?.name || 'Classement';
  const displayFlag = competition?.flag || selectedComp?.flag || '⚽';
  const displayColor = competition?.color || selectedComp?.color || 'from-gray-600 to-gray-800';

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
      <div className={`bg-gradient-to-r ${displayColor} px-5 py-4`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{displayFlag}</span>
          <div>
            <h2 className="text-white font-bold text-lg">{displayName}</h2>
            <p className="text-white/60 text-sm">Saison {getCurrentSeasonDisplay()}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
              <th className="py-3 px-3 text-left w-12">#</th>
              <th className="py-3 px-3 text-left">Équipe</th>
              <th className="py-3 px-3 text-center">MJ</th>
              <th className="py-3 px-3 text-center text-green-400">V</th>
              <th className="py-3 px-3 text-center text-yellow-400">N</th>
              <th className="py-3 px-3 text-center text-red-400">D</th>
              <th className="py-3 px-3 text-center hidden sm:table-cell">BP</th>
              <th className="py-3 px-3 text-center hidden sm:table-cell">BC</th>
              <th className="py-3 px-3 text-center">Diff</th>
              <th className="py-3 px-3 text-center font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => {
              // Zones de qualification/relégation
              const isChampionsLeague = idx < 4;
              const isEuropaLeague = idx >= 4 && idx < 6;
              const isRelegation = idx >= standings.length - 3;

              return (
                <tr
                  key={team.team.id}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    isChampionsLeague ? 'bg-blue-500/5' :
                    isEuropaLeague ? 'bg-orange-500/5' :
                    isRelegation ? 'bg-red-500/5' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        isChampionsLeague ? 'bg-blue-500/20 text-blue-400' :
                        isEuropaLeague ? 'bg-orange-500/20 text-orange-400' :
                        isRelegation ? 'bg-red-500/20 text-red-400' :
                        'text-gray-500'
                      }`}>
                        {team.position}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      to={`/classements/club/${team.team.id}`}
                      className="flex items-center gap-3 hover:text-pink-400 transition-colors"
                    >
                      <img src={team.team.crest} alt="" className="w-7 h-7 object-contain" />
                      <span className="text-white font-medium truncate max-w-[150px] md:max-w-none">
                        {team.team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-center text-gray-400">{team.playedGames}</td>
                  <td className="py-3 px-3 text-center text-green-400 font-medium">{team.won}</td>
                  <td className="py-3 px-3 text-center text-yellow-400">{team.draw}</td>
                  <td className="py-3 px-3 text-center text-red-400">{team.lost}</td>
                  <td className="py-3 px-3 text-center text-gray-400 hidden sm:table-cell">{team.goalsFor}</td>
                  <td className="py-3 px-3 text-center text-gray-400 hidden sm:table-cell">{team.goalsAgainst}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`font-medium ${
                      team.goalDifference > 0 ? 'text-green-400' :
                      team.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-white font-bold text-lg">{team.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Légende */}
      <div className="px-5 py-4 border-t border-white/5 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-500/30" />
          <span className="text-gray-400">Champions League</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-orange-500/30" />
          <span className="text-gray-400">Europa League</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-500/30" />
          <span className="text-gray-400">Relégation</span>
        </div>
      </div>
    </div>
  );
};

// Tableau de classement pour un groupe de tournoi (compact)
const GroupTable = ({ group, leagueId }: { group: GroupStanding; leagueId: number }) => {
  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-yellow-600 px-4 py-3">
        <h3 className="text-white font-bold">{group.name}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
              <th className="py-2 px-2 text-left w-8">#</th>
              <th className="py-2 px-2 text-left">Équipe</th>
              <th className="py-2 px-2 text-center">MJ</th>
              <th className="py-2 px-2 text-center">Diff</th>
              <th className="py-2 px-2 text-center font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {group.teams.map((team, idx) => {
              // 2 premiers qualifiés pour le tournoi
              const isQualified = idx < 2;
              const isPotentialQualified = idx === 2; // 3ème peut se qualifier

              return (
                <tr
                  key={team.team.id}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    isQualified ? 'bg-green-500/10' : isPotentialQualified ? 'bg-yellow-500/5' : ''
                  }`}
                >
                  <td className="py-2 px-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                      isQualified ? 'bg-green-500/20 text-green-400' :
                      isPotentialQualified ? 'bg-yellow-500/20 text-yellow-400' :
                      'text-gray-500'
                    }`}>
                      {team.position}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <Link
                      to={`/classements/club/${team.team.id}`}
                      className="flex items-center gap-2 hover:text-pink-400 transition-colors"
                    >
                      <img src={team.team.crest} alt="" className="w-5 h-5 object-contain" />
                      <span className="text-white font-medium truncate max-w-[100px]">
                        {team.team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-2 text-center text-gray-400">{team.playedGames}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={`font-medium ${
                      team.goalDifference > 0 ? 'text-green-400' :
                      team.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="text-white font-bold">{team.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Affichage de tous les groupes d'un tournoi
const TournamentGroupsDisplay = ({
  groups,
  competition,
  selectedComp,
  leagueId,
}: {
  groups: GroupStanding[];
  competition: Competition | null;
  selectedComp: { id: number; name: string; flag: string; color?: string } | undefined;
  leagueId: number;
}) => {
  const displayName = competition?.name || selectedComp?.name || 'Tournoi';
  const displayFlag = competition?.flag || selectedComp?.flag || '🏆';
  const displayColor = competition?.color || selectedComp?.color || 'from-green-600 to-yellow-600';

  return (
    <div className="space-y-6">
      {/* Header du tournoi */}
      <div className={`bg-gradient-to-r ${displayColor} rounded-2xl p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{displayFlag}</span>
            <div>
              <h2 className="text-white font-bold text-2xl">{displayName}</h2>
              <p className="text-white/60">Saison {getCurrentSeasonDisplay()}</p>
            </div>
          </div>
          <Link
            to={`/classements/matchday/${leagueId}`}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Voir les matchs
          </Link>
        </div>
      </div>

      {/* Grille des groupes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.map((group) => (
          <GroupTable key={group.name} group={group} leagueId={leagueId} />
        ))}
      </div>

      {/* Légende */}
      <div className="bg-gray-900/50 rounded-xl p-4 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-500/30" />
          <span className="text-gray-400">Qualifié pour les 8èmes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-yellow-500/30" />
          <span className="text-gray-400">Potentiellement qualifié (meilleurs 3èmes)</span>
        </div>
      </div>

      {/* Lien vers le tableau final */}
      <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Phase finale</h3>
            <p className="text-gray-400 text-sm">8èmes de finale, quarts, demi-finales et finale</p>
          </div>
          <Link
            to={`/classements/matchday/${leagueId}`}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Voir le tableau final
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Liste des buteurs
const TopScorersList = ({ players, leagueId }: { players: Player[]; leagueId: number }) => {
  if (players.length === 0) return null;

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-500" />
          <h3 className="text-white font-bold">Meilleurs Buteurs</h3>
        </div>
        <Link
          to={`/classements/scorers/${leagueId}`}
          className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
        >
          Voir tout →
        </Link>
      </div>
      <div className="p-4 space-y-2">
        {players.slice(0, 5).map((p, idx) => (
          <Link
            key={p.player.id}
            to={`/player/${p.player.id}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${
              idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
              idx === 1 ? 'bg-gray-400/20 text-gray-300' :
              idx === 2 ? 'bg-amber-600/20 text-amber-500' :
              'bg-gray-800 text-gray-500'
            }`}>
              {idx + 1}
            </span>
            {p.player.photo ? (
              <img src={p.player.photo} alt="" className="w-9 h-9 rounded-full object-cover bg-gray-800" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-sm font-bold">
                {p.player.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{p.player.name}</p>
              <div className="flex items-center gap-1">
                <img src={p.team.crest} alt="" className="w-4 h-4 object-contain" />
                <span className="text-gray-500 text-xs truncate">{p.team.name}</span>
              </div>
            </div>
            <span className="text-pink-400 font-bold text-lg">{p.goals}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Liste des passeurs
const TopAssistsList = ({ players, leagueId }: { players: Player[]; leagueId: number }) => {
  if (players.length === 0) return null;

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h3 className="text-white font-bold">Meilleurs Passeurs</h3>
        </div>
        <Link
          to={`/classements/scorers/${leagueId}?tab=assists`}
          className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
        >
          Voir tout →
        </Link>
      </div>
      <div className="p-4 space-y-2">
        {players.slice(0, 5).map((p, idx) => (
          <Link
            key={p.player.id}
            to={`/player/${p.player.id}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${
              idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
              idx === 1 ? 'bg-gray-400/20 text-gray-300' :
              idx === 2 ? 'bg-amber-600/20 text-amber-500' :
              'bg-gray-800 text-gray-500'
            }`}>
              {idx + 1}
            </span>
            {p.player.photo ? (
              <img src={p.player.photo} alt="" className="w-9 h-9 rounded-full object-cover bg-gray-800" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-sm font-bold">
                {p.player.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{p.player.name}</p>
              <div className="flex items-center gap-1">
                <img src={p.team.crest} alt="" className="w-4 h-4 object-contain" />
                <span className="text-gray-500 text-xs truncate">{p.team.name}</span>
              </div>
            </div>
            <span className="text-blue-400 font-bold text-lg">{p.assists}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Section Journée avec matchs
const MatchdaySection = ({ leagueId, currentMatchday, totalMatchdays }: {
  leagueId: number;
  currentMatchday: number;
  totalMatchdays: number;
}) => {
  const [matchday, setMatchday] = useState(currentMatchday);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const data = await getMatchesByMatchday(String(leagueId), matchday);
        // Trier par date
        data.sort((a: Match, b: Match) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matchday:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [leagueId, matchday]);

  const navigate = (direction: 'prev' | 'next') => {
    const newMatchday = direction === 'prev' ? matchday - 1 : matchday + 1;
    if (newMatchday >= 1 && newMatchday <= totalMatchdays) {
      setMatchday(newMatchday);
    }
  };

  // Grouper par date
  const matchesByDate = matches.reduce((acc, match) => {
    const date = new Date(match.utcDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header avec navigation */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-white font-bold">Journée {matchday}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('prev')}
            disabled={matchday <= 1}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>

          {/* Dropdown rapide */}
          <select
            value={matchday}
            onChange={(e) => setMatchday(Number(e.target.value))}
            className="bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
          >
            {Array.from({ length: totalMatchdays }, (_, i) => (
              <option key={i + 1} value={i + 1}>J{i + 1}</option>
            ))}
          </select>

          <button
            onClick={() => navigate('next')}
            disabled={matchday >= totalMatchdays}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Matchs */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-pink-500 animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun match programmé</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(matchesByDate).map(([date, dateMatches]) => (
              <div key={date}>
                <p className="text-gray-500 text-xs uppercase mb-2 capitalize">{date}</p>
                <div className="space-y-2">
                  {dateMatches.map((match) => {
                    const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
                    const isFinished = match.status === 'FINISHED';

                    return (
                      <Link
                        key={match.id}
                        to={`/match/${match.id}`}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 ${
                          isLive ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5'
                        }`}
                      >
                        {/* Heure / Status */}
                        <div className="w-14 text-center flex-shrink-0">
                          {isLive ? (
                            <span className="text-red-400 font-bold text-sm animate-pulse">
                              {match.minute ? `${match.minute}'` : 'LIVE'}
                            </span>
                          ) : isFinished ? (
                            <span className="text-gray-500 text-xs">Terminé</span>
                          ) : (
                            <span className="text-gray-400 text-sm font-medium">{formatTime(match.utcDate)}</span>
                          )}
                        </div>

                        {/* Équipe domicile */}
                        <div className="flex-1 flex items-center gap-2 justify-end">
                          <span className="text-white text-sm truncate text-right max-w-[100px]">
                            {match.homeTeam.shortName || match.homeTeam.name}
                          </span>
                          <img src={match.homeTeam.crest} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
                        </div>

                        {/* Score */}
                        <div className="w-16 text-center flex-shrink-0">
                          {isFinished || isLive ? (
                            <span className="text-white font-bold">
                              {match.score.fullTime.home ?? 0} - {match.score.fullTime.away ?? 0}
                            </span>
                          ) : (
                            <span className="text-gray-600">vs</span>
                          )}
                        </div>

                        {/* Équipe extérieur */}
                        <div className="flex-1 flex items-center gap-2">
                          <img src={match.awayTeam.crest} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
                          <span className="text-white text-sm truncate max-w-[100px]">
                            {match.awayTeam.shortName || match.awayTeam.name}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5">
        <Link
          to={`/classements/matchday/${leagueId}?matchday=${matchday}`}
          className="flex items-center justify-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors"
        >
          Voir la journée complète
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

// =============================================
// PAGE PRINCIPALE
// =============================================

export default function StandingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLeague, setSelectedLeague] = useState<number>(
    Number(searchParams.get('league')) || 61
  );
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [groupStandings, setGroupStandings] = useState<GroupStanding[]>([]); // Pour les tournois multi-groupes
  const [scorers, setScorers] = useState<Player[]>([]);
  const [assists, setAssists] = useState<Player[]>([]);
  const [currentMatchday, setCurrentMatchday] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [showOtherLeagues, setShowOtherLeagues] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Détection des tournois internationaux
  const isInternationalTournament = INTERNATIONAL_TOURNAMENTS.includes(selectedLeague);

  const selectedComp = MAIN_COMPETITIONS.find(c => c.id === selectedLeague) ||
    OTHER_COMPETITIONS.find(c => c.id === selectedLeague);
  const competition = getCompetition(selectedLeague);

  // Filtrer les autres compétitions par recherche
  const filteredOtherCompetitions = OTHER_COMPETITIONS.filter(comp =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grouper par pays
  const competitionsByCountry = filteredOtherCompetitions.reduce((acc, comp) => {
    if (!acc[comp.country]) acc[comp.country] = [];
    acc[comp.country].push(comp);
    return acc;
  }, {} as Record<string, typeof OTHER_COMPETITIONS>);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // console.log('[StandingsPage] Fetching data for league:', selectedLeague, 'isInternationalTournament:', isInternationalTournament);

        // Pour les tournois internationaux, récupérer tous les groupes
        if (isInternationalTournament) {
          const [groupsData, scorersData, assistsData] = await Promise.all([
            getAllGroupStandings(String(selectedLeague)),
            getTopScorers(String(selectedLeague)),
            getTopAssists(String(selectedLeague)),
          ]);

          // console.log('[StandingsPage] Tournament data received:', {
            groups: groupsData?.length || 0,
            scorers: scorersData?.length || 0,
            assists: assistsData?.length || 0,
          });

          setGroupStandings(groupsData || []);
          setStandings([]); // Vider les standings simples
          setScorers(scorersData || []);
          setAssists(assistsData || []);
        } else {
          // Pour les championnats classiques
          const [standingsData, scorersData, assistsData, roundData] = await Promise.all([
            getStandings(String(selectedLeague)),
            getTopScorers(String(selectedLeague)),
            getTopAssists(String(selectedLeague)),
            getCurrentRound(String(selectedLeague)),
          ]);

          // console.log('[StandingsPage] League data received:', {
            standings: standingsData?.length || 0,
            scorers: scorersData?.length || 0,
            assists: assistsData?.length || 0,
            round: roundData
          });

          setStandings(standingsData || []);
          setGroupStandings([]); // Vider les groupes
          setScorers(scorersData || []);
          setAssists(assistsData || []);

          // Extraire le numéro de journée du round
          if (roundData) {
            const match = roundData.match(/\d+/);
            if (match) setCurrentMatchday(parseInt(match[0]));
          } else if (standingsData?.[0]?.playedGames) {
            setCurrentMatchday(standingsData[0].playedGames);
          }
        }
      } catch (error) {
        console.error('[StandingsPage] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedLeague, isInternationalTournament]);

  const handleLeagueChange = (leagueId: number) => {
    setSelectedLeague(leagueId);
    setSearchParams({ league: String(leagueId) });
    setShowOtherLeagues(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">Classements</h1>
              <p className="text-gray-400">Tous les championnats en direct</p>
            </div>
          </div>

          {/* Sélecteur de compétition */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Bouton spécial Europe - Classements agrégés */}
            <button
              onClick={() => handleLeagueChange(EUROPE_AGGREGATE_ID)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                selectedLeague === EUROPE_AGGREGATE_ID
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg shadow-pink-500/25'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-pink-500/30'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              Top Europe
            </button>

            {/* Séparateur */}
            <div className="w-px h-8 bg-gray-700 mx-1 hidden sm:block" />

            {MAIN_COMPETITIONS.map(comp => (
              <button
                key={comp.id}
                onClick={() => handleLeagueChange(comp.id)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  selectedLeague === comp.id
                    ? `bg-gradient-to-r ${comp.color} text-white shadow-lg`
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {comp.flag} {comp.name}
              </button>
            ))}

            {/* Bouton + pour autres championnats */}
            <button
              onClick={() => setShowOtherLeagues(true)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                OTHER_COMPETITIONS.some(c => c.id === selectedLeague)
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-dashed border-gray-600 hover:border-gray-500'
              }`}
            >
              <Plus className="w-4 h-4" />
              {OTHER_COMPETITIONS.some(c => c.id === selectedLeague)
                ? OTHER_COMPETITIONS.find(c => c.id === selectedLeague)?.name
                : 'Autres'}
            </button>
          </div>
        </div>
      </header>

      {/* Modal Autres Championnats */}
      <AnimatePresence>
        {showOtherLeagues && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowOtherLeagues(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gray-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">Autres championnats</h3>
                  <p className="text-gray-500 text-sm">Sélectionnez une compétition</p>
                </div>
                <button
                  onClick={() => setShowOtherLeagues(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Recherche */}
              <div className="px-6 py-3 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Rechercher un championnat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              {/* Liste des championnats */}
              <div className="p-4 overflow-y-auto max-h-[50vh]">
                {Object.entries(competitionsByCountry).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun résultat</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(competitionsByCountry).map(([country, comps]) => (
                      <div key={country}>
                        <p className="text-xs text-gray-500 uppercase font-medium mb-2 px-2">{country}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {comps.map(comp => (
                            <button
                              key={comp.id}
                              onClick={() => handleLeagueChange(comp.id)}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                                selectedLeague === comp.id
                                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white'
                              }`}
                            >
                              <span>{comp.flag}</span>
                              <span className="truncate">{comp.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <main className="relative max-w-7xl mx-auto px-4 pb-16">
        {/* Mode Classements Européens Agrégés */}
        {selectedLeague === EUROPE_AGGREGATE_ID ? (
          <motion.div
            key="europe-rankings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <EuropeanRankings limit={30} showFilters={true} />
          </motion.div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Chargement des données...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLeague}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {(competition || selectedComp) && (
                <>
                  {/* Affichage différent selon le type de compétition */}
                  {isInternationalTournament && groupStandings.length > 0 ? (
                    /* Tournois internationaux avec plusieurs groupes */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Groupes (2/3) */}
                      <div className="lg:col-span-2">
                        <TournamentGroupsDisplay
                          groups={groupStandings}
                          competition={competition}
                          selectedComp={selectedComp}
                          leagueId={selectedLeague}
                        />
                      </div>

                      {/* Sidebar (1/3) */}
                      <div className="space-y-6">
                        <TopScorersList players={scorers} leagueId={selectedLeague} />
                        <TopAssistsList players={assists} leagueId={selectedLeague} />

                        {/* Stats du tournoi */}
                        <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-5">
                          <h3 className="text-white font-bold mb-4">Stats du tournoi</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white/5 rounded-xl">
                              <p className="text-3xl font-black text-pink-400">
                                {groupStandings.reduce((sum, g) => sum + g.teams.reduce((s, t) => s + t.goalsFor, 0), 0)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Buts marqués</p>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl">
                              <p className="text-3xl font-black text-blue-400">
                                {groupStandings.length}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Groupes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Championnats classiques */
                    <>
                      {/* Layout principal */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Classement (2/3) */}
                        <div className="lg:col-span-2">
                          <StandingsTable standings={standings} competition={competition} selectedComp={selectedComp} />
                        </div>

                        {/* Sidebar (1/3) */}
                        <div className="space-y-6">
                          <TopScorersList players={scorers} leagueId={selectedLeague} />
                          <TopAssistsList players={assists} leagueId={selectedLeague} />

                          {/* Stats rapides */}
                          <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-5">
                            <h3 className="text-white font-bold mb-4">Stats de la saison</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-4 bg-white/5 rounded-xl">
                                <p className="text-3xl font-black text-pink-400">
                                  {standings.reduce((sum, t) => sum + t.goalsFor, 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Buts marqués</p>
                              </div>
                              <div className="text-center p-4 bg-white/5 rounded-xl">
                                <p className="text-3xl font-black text-blue-400">
                                  {currentMatchday}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Journées jouées</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section Journée (pleine largeur) - Seulement pour les championnats */}
                      {competition?.totalMatchdays && (
                        <MatchdaySection
                          leagueId={selectedLeague}
                          currentMatchday={currentMatchday}
                          totalMatchdays={competition.totalMatchdays || 38}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
