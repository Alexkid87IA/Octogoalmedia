// src/pages/FootballPage.tsx
// Page Football - Classements par catégorie

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  RefreshCw,
  BarChart3,
  Users,
  Calendar,
} from 'lucide-react';
import {
  getStandings,
  getTopScorers,
  getNextFixtures,
  getLastResults,
} from '../services/apiFootball';
import {
  COMPETITIONS,
  Competition,
  getCompetition,
  getStandingsCompetitions,
  getFranceCompetitions,
  getTopCompetitionIds,
} from '../config/competitions';
import ResultsTicker from '../components/football/ResultsTicker';

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

interface Scorer {
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
  homeTeam: { id: number; name: string; crest: string };
  awayTeam: { id: number; name: string; crest: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

type CategoryTab = 'top5' | 'france' | 'europe' | 'international';

// =============================================
// COMPOSANTS
// =============================================

// Indicateur de forme
const FormIndicator = ({ won, draw, lost }: { won: number; draw: number; lost: number }) => {
  const total = won + draw + lost;
  if (total === 0) return null;
  const winRate = won / total;

  if (winRate >= 0.6) {
    return (
      <span className="p-1 rounded bg-green-500/20">
        <TrendingUp className="w-3 h-3 text-green-400" />
      </span>
    );
  }
  if (winRate <= 0.3) {
    return (
      <span className="p-1 rounded bg-red-500/20">
        <TrendingDown className="w-3 h-3 text-red-400" />
      </span>
    );
  }
  return (
    <span className="p-1 rounded bg-yellow-500/20">
      <Minus className="w-3 h-3 text-yellow-400" />
    </span>
  );
};

// Tableau de classement compact
const StandingsTable = ({
  standings,
  competition,
  compact = false,
}: {
  standings: TeamStanding[];
  competition: Competition;
  compact?: boolean;
}) => {
  const displayStandings = compact ? standings.slice(0, 6) : standings;

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${competition.color} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{competition.flag}</span>
            <h3 className="text-white font-bold">{competition.name}</h3>
          </div>
          <span className="text-white/60 text-sm">{competition.country}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
              <th className="py-2 px-3 text-left">#</th>
              <th className="py-2 px-3 text-left">Équipe</th>
              <th className="py-2 px-3 text-center hidden sm:table-cell">MJ</th>
              <th className="py-2 px-3 text-center text-green-400">V</th>
              <th className="py-2 px-3 text-center">N</th>
              <th className="py-2 px-3 text-center text-red-400">D</th>
              <th className="py-2 px-3 text-center hidden sm:table-cell">Diff</th>
              <th className="py-2 px-3 text-center font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {displayStandings.map((team, idx) => (
              <tr
                key={team.team.id}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  idx < 4 ? 'bg-blue-500/5' : idx >= standings.length - 3 && !compact ? 'bg-red-500/5' : ''
                }`}
              >
                <td className="py-2 px-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                    idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                    idx === 2 ? 'bg-amber-600/20 text-amber-500' :
                    idx < 4 ? 'bg-blue-500/20 text-blue-400' :
                    'text-gray-500'
                  }`}>
                    {team.position}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <Link
                    to={`/football/club/${team.team.id}`}
                    className="flex items-center gap-2 hover:text-pink-400 transition-colors"
                  >
                    <img src={team.team.crest} alt="" className="w-6 h-6 object-contain" />
                    <span className="text-white font-medium truncate max-w-[120px] sm:max-w-none">
                      {team.team.name}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-center text-gray-400 hidden sm:table-cell">{team.playedGames}</td>
                <td className="py-2 px-3 text-center text-green-400">{team.won}</td>
                <td className="py-2 px-3 text-center text-gray-400">{team.draw}</td>
                <td className="py-2 px-3 text-center text-red-400">{team.lost}</td>
                <td className="py-2 px-3 text-center hidden sm:table-cell">
                  <span className={team.goalDifference > 0 ? 'text-green-400' : team.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-white font-bold">{team.points}</span>
                    <FormIndicator won={team.won} draw={team.draw} lost={team.lost} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {compact && standings.length > 6 && (
        <div className="px-4 py-3 border-t border-white/5">
          <Link
            to={`/football?league=${competition.id}`}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Voir le classement complet
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

// Liste des buteurs
const TopScorersList = ({
  scorers,
  competition,
}: {
  scorers: Scorer[];
  competition: Competition;
}) => {
  if (scorers.length === 0) return null;

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <h4 className="text-white font-medium">Meilleurs buteurs</h4>
        </div>
        <Link
          to={`/football/scorers/${competition.id}`}
          className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
        >
          Voir tout →
        </Link>
      </div>
      <div className="p-4 space-y-2">
        {scorers.slice(0, 5).map((scorer, idx) => (
          <Link
            key={scorer.player.id}
            to={`/player/${scorer.player.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
              idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
              idx === 1 ? 'bg-gray-400/20 text-gray-300' :
              idx === 2 ? 'bg-amber-600/20 text-amber-500' :
              'bg-gray-800 text-gray-400'
            }`}>
              {idx + 1}
            </span>
            <img src={scorer.team.crest} alt="" className="w-5 h-5 object-contain" />
            <span className="text-white flex-1 truncate">{scorer.player.name}</span>
            <span className="text-pink-400 font-bold">{scorer.goals}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Liste des passeurs
const TopAssistersList = ({
  scorers,
  competition,
}: {
  scorers: Scorer[];
  competition: Competition;
}) => {
  // Trier par passes et filtrer ceux qui ont des passes
  const assisters = [...scorers]
    .filter(s => s.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 5);

  if (assisters.length === 0) return null;

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h4 className="text-white font-medium">Meilleurs passeurs</h4>
        </div>
        <Link
          to={`/football/scorers/${competition.id}?tab=assists`}
          className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
        >
          Voir tout →
        </Link>
      </div>
      <div className="p-4 space-y-2">
        {assisters.map((scorer, idx) => (
          <Link
            key={scorer.player.id}
            to={`/player/${scorer.player.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
              idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
              idx === 1 ? 'bg-gray-400/20 text-gray-300' :
              idx === 2 ? 'bg-amber-600/20 text-amber-500' :
              'bg-gray-800 text-gray-400'
            }`}>
              {idx + 1}
            </span>
            <img src={scorer.team.crest} alt="" className="w-5 h-5 object-contain" />
            <span className="text-white flex-1 truncate">{scorer.player.name}</span>
            <span className="text-blue-400 font-bold">{scorer.assists}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// =============================================
// PAGE PRINCIPALE
// =============================================

export default function FootballPage() {
  // États
  const [categoryTab, setCategoryTab] = useState<CategoryTab>('top5');
  const [selectedLeague, setSelectedLeague] = useState<number>(61); // Ligue 1 par défaut
  const [standings, setStandings] = useState<Record<number, TeamStanding[]>>({});
  const [scorers, setScorers] = useState<Record<number, Scorer[]>>({});
  const [loading, setLoading] = useState(true);

  // Compétitions par catégorie
  const categoryCompetitions: Record<CategoryTab, number[]> = {
    top5: [61, 39, 140, 135, 78], // L1, PL, Liga, SA, BL
    france: [61, 62], // L1, L2
    europe: [2, 3, 848], // UCL, UEL, UECL
    international: [5], // Ligue des Nations
  };

  // Charger les données de la catégorie
  useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true);
      const leagueIds = categoryCompetitions[categoryTab];

      try {
        const standingsPromises = leagueIds.map(id =>
          getStandings(String(id)).then(data => ({ id, data }))
        );
        const scorersPromises = leagueIds.map(id =>
          getTopScorers(String(id)).then(data => ({ id, data }))
        );

        const [standingsResults, scorersResults] = await Promise.all([
          Promise.all(standingsPromises),
          Promise.all(scorersPromises),
        ]);

        const newStandings: Record<number, TeamStanding[]> = {};
        const newScorers: Record<number, Scorer[]> = {};

        standingsResults.forEach(({ id, data }) => {
          newStandings[id] = data;
        });
        scorersResults.forEach(({ id, data }) => {
          newScorers[id] = data;
        });

        setStandings(newStandings);
        setScorers(newScorers);

        // Sélectionner la première ligue de la catégorie
        if (leagueIds.length > 0) {
          setSelectedLeague(leagueIds[0]);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [categoryTab]);

  const currentCompetitions = categoryCompetitions[categoryTab];

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />
      </div>

      {/* Ticker des derniers résultats */}
      <section className="relative pt-24 pb-4">
        <div className="max-w-7xl mx-auto">
          <ResultsTicker title="Derniers résultats" showTitle={true} maxResults={15} />
        </div>
      </section>

      {/* Header */}
      <header className="relative pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Classements
                  </h1>
                  <p className="text-gray-400">Tous les championnats en direct</p>
                </div>
              </div>
            </div>

            <Link
              to="/matchs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-pink-500/30 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Voir les matchs
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tabs par catégorie */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'top5' as CategoryTab, label: 'Top 5', icon: '⭐' },
              { id: 'france' as CategoryTab, label: 'France', icon: '🇫🇷' },
              { id: 'europe' as CategoryTab, label: 'Coupes d\'Europe', icon: '🏆' },
              { id: 'international' as CategoryTab, label: 'Internationales', icon: '🌍' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategoryTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  categoryTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Sélecteur de ligue dans la catégorie */}
          <div className="flex flex-wrap gap-2">
            {currentCompetitions.map(id => {
              const comp = getCompetition(id);
              if (!comp) return null;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedLeague(id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedLeague === id
                      ? `bg-gradient-to-r ${comp.color} text-white shadow-lg`
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {comp.flag} {comp.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="relative max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Chargement des classements...</p>
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
              {/* Affichage de la ligue sélectionnée */}
              {(() => {
                const comp = getCompetition(selectedLeague);
                if (!comp) return null;
                const leagueStandings = standings[selectedLeague] || [];
                const leagueScorers = scorers[selectedLeague] || [];

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Classement complet */}
                    <div className="lg:col-span-2">
                      <StandingsTable
                        standings={leagueStandings}
                        competition={comp}
                        compact={false}
                      />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Buteurs */}
                      <TopScorersList scorers={leagueScorers} competition={comp} />

                      {/* Passeurs */}
                      <TopAssistersList scorers={leagueScorers} competition={comp} />

                      {/* Légende */}
                      <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
                        <h4 className="text-white font-medium mb-3">Légende</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded bg-blue-500/30" />
                            <span className="text-gray-400">Qualification Ligue des Champions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded bg-yellow-500/30" />
                            <span className="text-gray-400">Leader</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded bg-red-500/30" />
                            <span className="text-gray-400">Zone de relégation</span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation rapide */}
                      <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/5">
                          <h4 className="text-white font-medium">Explorer</h4>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            to={`/football/matchday/${selectedLeague}?matchday=${leagueStandings[0]?.playedGames || 1}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium group-hover:text-pink-400 transition-colors">Journées</p>
                              <p className="text-xs text-gray-500">Voir tous les matchs par journée</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400" />
                          </Link>
                          <Link
                            to={`/football/scorers/${selectedLeague}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                              <Trophy className="w-5 h-5 text-pink-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium group-hover:text-pink-400 transition-colors">Buteurs & Passeurs</p>
                              <p className="text-xs text-gray-500">Classement complet des buteurs</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400" />
                          </Link>
                          <Link
                            to="/matchs"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium group-hover:text-pink-400 transition-colors">Match Center</p>
                              <p className="text-xs text-gray-500">Tous les matchs en direct</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400" />
                          </Link>
                        </div>
                      </div>

                      {/* Stats rapides */}
                      <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
                        <h4 className="text-white font-medium mb-3">Stats de la saison</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <p className="text-2xl font-bold text-white">
                              {leagueStandings.reduce((sum, t) => sum + t.goalsFor, 0)}
                            </p>
                            <p className="text-xs text-gray-500">Buts marqués</p>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <p className="text-2xl font-bold text-white">
                              {leagueStandings[0]?.playedGames || 0}
                            </p>
                            <p className="text-xs text-gray-500">Journées jouées</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Autres classements de la catégorie (aperçu) */}
              {currentCompetitions.length > 1 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Autres classements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentCompetitions
                      .filter(id => id !== selectedLeague)
                      .map(id => {
                        const comp = getCompetition(id);
                        if (!comp) return null;
                        const leagueStandings = standings[id] || [];

                        return (
                          <div key={id} onClick={() => setSelectedLeague(id)} className="cursor-pointer">
                            <StandingsTable
                              standings={leagueStandings}
                              competition={comp}
                              compact={true}
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
