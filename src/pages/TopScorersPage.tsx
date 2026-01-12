// src/pages/TopScorersPage.tsx
// Page dédiée aux meilleurs buteurs et passeurs d'une compétition

import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Target, TrendingUp } from 'lucide-react';
import { getTopScorers } from '../services/apiFootball';
import { getCompetition, COMPETITIONS } from '../config/competitions';

interface Scorer {
  player: {
    id: number;
    name: string;
    photo?: string;
    nationality?: string;
  };
  team: {
    id: number;
    name: string;
    crest: string;
  };
  goals: number;
  assists: number;
  penalties?: number;
  playedGames?: number;
}

type TabType = 'scorers' | 'assists';

// Calculer la saison actuelle dynamiquement
function getCurrentSeasonDisplay(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  if (month < 7) {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
  return `${year}-${String(year + 1).slice(-2)}`;
}

export default function TopScorersPage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get('tab') as TabType) || 'scorers'
  );

  const competition = leagueId ? getCompetition(parseInt(leagueId)) : null;

  useEffect(() => {
    async function fetchScorers() {
      if (!leagueId) return;

      setLoading(true);
      try {
        const data = await getTopScorers(leagueId);
        setScorers(data || []);
      } catch (error) {
        console.error('Error fetching scorers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchScorers();
  }, [leagueId]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Trier par buts ou passes selon l'onglet
  const sortedData = activeTab === 'scorers'
    ? [...scorers].sort((a, b) => b.goals - a.goals)
    : [...scorers].filter(s => s.assists > 0).sort((a, b) => b.assists - a.assists);

  if (!competition) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Compétition non trouvée</h2>
          <Link to="/classements" className="text-pink-400 hover:underline">
            Retour au football
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative pt-24 pb-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back link */}
          <Link
            to={`/classements?league=${leagueId}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à {competition.name}</span>
          </Link>

          {/* Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${competition.color} flex items-center justify-center`}>
              <span className="text-3xl">{competition.flag}</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {activeTab === 'scorers' ? 'Meilleurs Buteurs' : 'Meilleurs Passeurs'}
              </h1>
              <p className="text-gray-400">{competition.name} {getCurrentSeasonDisplay()}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-900/50 p-1 rounded-xl w-fit">
            <button
              onClick={() => handleTabChange('scorers')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'scorers'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Target className="w-5 h-5" />
              <span>Buteurs</span>
            </button>
            <button
              onClick={() => handleTabChange('assists')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'assists'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Passeurs</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative max-w-5xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-900/50 rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Aucune donnée disponible</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedData.map((scorer, idx) => {
              const value = activeTab === 'scorers' ? scorer.goals : scorer.assists;
              const isTop3 = idx < 3;

              return (
                <motion.div
                  key={scorer.player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Link
                    to={`/player/${scorer.player.id}`}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01] ${
                      isTop3
                        ? 'bg-gradient-to-r from-gray-900/80 to-gray-800/50 border border-white/10'
                        : 'bg-gray-900/30 hover:bg-gray-900/50'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                      idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black' :
                      idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' :
                      idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {idx + 1}
                    </div>

                    {/* Player photo */}
                    <div className="relative">
                      {scorer.player.photo ? (
                        <img
                          src={scorer.player.photo}
                          alt={scorer.player.name}
                          className="w-14 h-14 rounded-full object-cover bg-gray-800"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-400">
                            {scorer.player.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Team badge */}
                      <img
                        src={scorer.team.crest}
                        alt={scorer.team.name}
                        className="absolute -bottom-1 -right-1 w-6 h-6 object-contain bg-black rounded-full p-0.5"
                      />
                    </div>

                    {/* Player info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg truncate">
                        {scorer.player.name}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">{scorer.team.name}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      {activeTab === 'scorers' && scorer.assists > 0 && (
                        <div className="text-center hidden sm:block">
                          <div className="text-blue-400 font-bold">{scorer.assists}</div>
                          <div className="text-gray-500 text-xs">Passes</div>
                        </div>
                      )}
                      {activeTab === 'assists' && scorer.goals > 0 && (
                        <div className="text-center hidden sm:block">
                          <div className="text-pink-400 font-bold">{scorer.goals}</div>
                          <div className="text-gray-500 text-xs">Buts</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className={`text-3xl font-black ${
                          activeTab === 'scorers' ? 'text-pink-400' : 'text-blue-400'
                        }`}>
                          {value}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {activeTab === 'scorers' ? 'Buts' : 'Passes'}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
