// src/pages/JoueursPage.tsx
// Hub central pour tout ce qui concerne les joueurs
// Mélange données API-Football et contenus Sanity

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Target,
  Sparkles,
  Star,
  Search,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Crown,
  Loader2,
  X,
  Calendar,
  BookOpen,
  Flame,
} from 'lucide-react';
import {
  getTopScorersEurope,
  getTopAssistsEurope,
  getTopContributorsEurope,
  getTopRatingsEurope,
  getTopScorers,
  getTopAssists,
  TOP_5_LEAGUES,
  EuropeanPlayerStats,
} from '../services/apiFootball';
import { sanityClient, urlFor } from '../utils/sanityClient';
import { SanityImage } from '../types/sanity';

// ===========================================
// TYPES
// ===========================================

type TabType = 'scorers' | 'assists' | 'contributors' | 'ratings';

interface SanityArticle {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImage;
  excerpt?: string;
  publishedAt: string;
  categories?: { title: string; slug: { current: string } }[];
}

// ===========================================
// SECTION 1: HERO AVEC PODIUM
// ===========================================

interface HeroSectionProps {
  topPlayers: EuropeanPlayerStats[];
  isLoading: boolean;
  leagueInfo?: { id: number; name: string; flag: string } | null;
}

const HeroSection = ({ topPlayers, isLoading, leagueInfo }: HeroSectionProps) => {
  const [first, second, third] = topPlayers.slice(0, 3);

  return (
    <section className="relative min-h-[650px] overflow-hidden">
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
        {/* Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full border border-pink-500/30 mb-6">
            {leagueInfo ? (
              <>
                <span className="text-lg">{leagueInfo.flag}</span>
                <span className="text-sm font-medium text-pink-400">{leagueInfo.name}</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium text-pink-400">Le hub des joueurs</span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4">
            Les{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
              Meilleurs Buteurs
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {leagueInfo
              ? `Classement des buteurs en ${leagueInfo.name}`
              : 'Stars, pépites, légendes : tout sur les joueurs qui font vibrer le football'
            }
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
                    <img src={second.team.crest} alt="" className="w-4 h-4 object-contain" loading="lazy" />
                  )}
                  <span className="text-gray-500 text-xs truncate max-w-[80px]">{second?.team.name}</span>
                </div>
                <p className="text-2xl md:text-3xl font-black text-gray-300 mt-2">
                  {second?.goals}
                </p>
                <p className="text-xs text-gray-500">buts</p>
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
                    <img src={first.team.crest} alt="" className="w-5 h-5 object-contain" loading="lazy" />
                  )}
                  <span className="text-gray-400 text-sm">{first?.team.name}</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mt-2">
                  {first?.goals}
                </p>
                <p className="text-xs text-yellow-500/70">buts</p>
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
                    <img src={third.team.crest} alt="" className="w-4 h-4 object-contain" loading="lazy" />
                  )}
                  <span className="text-gray-500 text-xs truncate max-w-[80px]">{third?.team.name}</span>
                </div>
                <p className="text-2xl md:text-3xl font-black text-amber-500 mt-2">
                  {third?.goals}
                </p>
                <p className="text-xs text-amber-500/70">buts</p>
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

// ===========================================
// SECTION 2: CLASSEMENTS + SIDEBAR
// ===========================================

const TABS_CONFIG: Record<TabType, { label: string; icon: React.ElementType; statKey: string; statLabel: string }> = {
  scorers: { label: 'Buteurs', icon: Target, statKey: 'goals', statLabel: 'Buts' },
  assists: { label: 'Passeurs', icon: Sparkles, statKey: 'assists', statLabel: 'Passes' },
  contributors: { label: 'Contributeurs', icon: Trophy, statKey: 'total', statLabel: 'G+A' },
  ratings: { label: 'Notes', icon: Star, statKey: 'rating', statLabel: 'Note' },
};

// Sidebar avec articles et stars
const ContentSidebar = () => {
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [stars, setStars] = useState<EuropeanPlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger articles et stars en parallèle
        const [articlesData, scorers, assists] = await Promise.all([
          sanityClient.fetch(`*[_type == "article" && "joueurs" in categories[]->slug.current] | order(publishedAt desc)[0...3] {
            _id,
            title,
            slug,
            mainImage,
            publishedAt,
            categories[]->{ title, slug }
          }`),
          getTopScorersEurope(),
          getTopAssistsEurope(),
        ]);

        setArticles(articlesData || []);

        // Stars : top 1 buteur + top 1 passeur + un autre
        const starIds = new Set<number>();
        const allStars: EuropeanPlayerStats[] = [];
        [scorers[0], assists[0], scorers[1]].forEach((p) => {
          if (p && !starIds.has(p.player.id)) {
            starIds.add(p.player.id);
            allStars.push(p);
          }
        });
        setStars(allStars);
      } catch (error) {
        console.error('Erreur sidebar:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900/60 rounded-2xl border border-gray-800 p-6 animate-pulse">
          <div className="h-6 bg-gray-800 rounded w-1/2 mb-4" />
          <div className="space-y-3">
            <div className="h-20 bg-gray-800 rounded-xl" />
            <div className="h-20 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card Articles */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-2xl border border-gray-800 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            <h3 className="text-white font-bold">Articles Joueurs</h3>
          </div>
          <Link
            to="/rubrique/joueurs"
            className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
          >
            Voir tout <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-4 space-y-3">
          {articles.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Aucun article disponible</p>
          ) : (
            articles.map((article) => (
              <Link
                key={article._id}
                to={`/article/${article.slug?.current}`}
                className="group flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                  {article.mainImage && (
                    <img
                      src={urlFor(article.mainImage).width(128).height(128).url()}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {article.categories?.[0] && (
                    <span className="text-[10px] text-pink-400 uppercase font-medium">
                      {article.categories[0].title}
                    </span>
                  )}
                  <h4 className="text-white text-sm font-medium leading-tight line-clamp-2 group-hover:text-pink-400 transition-colors">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.div>

      {/* Card Stars du moment */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-pink-950/30 to-gray-900/40 rounded-2xl border border-pink-500/20 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-pink-500/10 flex items-center gap-2">
          <Flame className="w-5 h-5 text-pink-500" />
          <h3 className="text-white font-bold">Stars du moment</h3>
        </div>
        <div className="p-4 space-y-3">
          {stars.map((player, idx) => (
            <Link
              key={player.player.id}
              to={`/player/${player.player.id}`}
              className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-500/30">
                  {player.player.photo ? (
                    <img
                      src={player.player.photo}
                      alt={player.player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">?</span>
                    </div>
                  )}
                </div>
                {idx === 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate group-hover:text-pink-400 transition-colors">
                  {player.player.name}
                </p>
                <p className="text-gray-500 text-xs truncate">{player.team.name}</p>
              </div>
              <div className="text-right">
                <p className="text-pink-400 font-bold text-sm">{player.goals}</p>
                <p className="text-[10px] text-gray-500">buts</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* CTA Newsletter/Discord */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-2xl border border-pink-500/30 p-5 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center mx-auto mb-3">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-white font-bold mb-2">Reste informé</h3>
        <p className="text-gray-400 text-sm mb-4">
          Les dernières actus joueurs directement dans ta boîte mail
        </p>
        <Link
          to="/newsletter"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
        >
          S'abonner
        </Link>
      </motion.div>
    </div>
  );
};

// Liste des joueurs (version compacte)
const RankingsListCompact = () => {
  const [activeTab, setActiveTab] = useState<TabType>('scorers');
  const [players, setPlayers] = useState<EuropeanPlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const config = TABS_CONFIG[activeTab];
  // Afficher seulement 7 joueurs (top 3 dans le hero + 7 ici = top 10)
  const displayedPlayers = players.slice(3, 10);

  const getStatValue = (player: EuropeanPlayerStats) => {
    if (activeTab === 'ratings') return player.rating?.toFixed(2) || '-';
    return player[config.statKey as keyof EuropeanPlayerStats] || 0;
  };

  return (
    <div>
      {/* Header avec tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white">Classement Europe</h2>
            <p className="text-gray-500 text-xs">Toutes compétitions</p>
          </div>
        </div>

        {/* Tabs compacts */}
        <div className="flex gap-1 p-1 bg-gray-900/80 rounded-lg border border-gray-800">
          {(Object.keys(TABS_CONFIG) as TabType[]).map((tab) => {
            const tabConfig = TABS_CONFIG[tab];
            const Icon = tabConfig.icon;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-md font-medium text-xs transition-all
                  ${activeTab === tab
                    ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tabConfig.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Liste */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {displayedPlayers.map((player, index) => {
              const position = index + 4; // Commence à 4 (après le podium)

              return (
                <Link
                  key={`${activeTab}-${player.player.id}`}
                  to={`/player/${player.player.id}`}
                  className="flex items-center gap-3 p-3 transition-all hover:bg-white/5"
                >
                  {/* Position */}
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">{position}</span>
                  </div>

                  {/* Photo */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
                      {player.player.photo ? (
                        <img
                          src={player.player.photo}
                          alt={player.player.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">?</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 text-[10px]">
                      {player.league.flag}
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{player.player.name}</p>
                    <p className="text-gray-500 text-xs truncate">{player.team.name}</p>
                  </div>

                  {/* Stat principale */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{getStatValue(player)}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{config.statLabel}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Bouton voir classement complet */}
      <div className="flex justify-center mt-6">
        <Link
          to="/classements/europe"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500/10 to-blue-500/10 hover:from-pink-500/20 hover:to-blue-500/20 border border-pink-500/30 rounded-xl text-white text-sm font-medium transition-all"
        >
          Voir le classement complet
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

// Section principale avec layout 2 colonnes
const MainContentSection = () => {
  return (
    <section className="relative py-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950/50 to-black" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale - Classements */}
          <div className="lg:col-span-2">
            <RankingsListCompact />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ContentSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION 3: PAR CHAMPIONNAT
// ===========================================

interface LeagueRankingsSectionProps {
  selectedLeague: typeof TOP_5_LEAGUES[0];
  onSelectLeague: (league: typeof TOP_5_LEAGUES[0]) => void;
}

const LeagueRankingsSection = ({ selectedLeague, onSelectLeague }: LeagueRankingsSectionProps) => {
  const [scorers, setScorers] = useState<any[]>([]);
  const [assists, setAssists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [scorersData, assistsData] = await Promise.all([
          getTopScorers(String(selectedLeague.id)),
          getTopAssists(String(selectedLeague.id)),
        ]);
        setScorers(scorersData?.slice(0, 5) || []);
        setAssists(assistsData?.slice(0, 5) || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedLeague]);

  return (
    <section className="relative py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl font-black text-white mb-2">Par Championnat</h2>
          <p className="text-gray-500">Classements détaillés par ligue</p>
        </motion.div>

        {/* Sélecteur de championnat */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {TOP_5_LEAGUES.map((league) => (
            <button
              key={league.id}
              onClick={() => onSelectLeague(league)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                ${selectedLeague.id === league.id
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-900/80 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }
              `}
            >
              <span className="text-xl">{league.flag}</span>
              <span>{league.name}</span>
            </button>
          ))}
        </div>

        {/* Cards buteurs/passeurs */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Buteurs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/60 rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-pink-500" />
                <h3 className="text-white font-bold">Meilleurs Buteurs</h3>
              </div>
              <Link
                to={`/classements/scorers/${selectedLeague.id}`}
                className="text-sm text-pink-400 hover:text-pink-300"
              >
                Voir tout
              </Link>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {scorers.map((p, idx) => (
                    <Link
                      key={p.player?.id || idx}
                      to={`/player/${p.player?.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <span className={`
                        w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                        ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                          idx === 2 ? 'bg-amber-600/20 text-amber-500' :
                          'bg-gray-800 text-gray-500'
                        }
                      `}>
                        {idx + 1}
                      </span>
                      <img
                        src={p.player?.photo}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover bg-gray-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate text-sm">{p.player?.name}</p>
                        <p className="text-gray-500 text-xs truncate">{p.team?.name}</p>
                      </div>
                      <span className="text-pink-400 font-bold">{p.goals}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Passeurs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/60 rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h3 className="text-white font-bold">Meilleurs Passeurs</h3>
              </div>
              <Link
                to={`/classements/scorers/${selectedLeague.id}?tab=assists`}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Voir tout
              </Link>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {assists.map((p, idx) => (
                    <Link
                      key={p.player?.id || idx}
                      to={`/player/${p.player?.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <span className={`
                        w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                        ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                          idx === 2 ? 'bg-amber-600/20 text-amber-500' :
                          'bg-gray-800 text-gray-500'
                        }
                      `}>
                        {idx + 1}
                      </span>
                      <img
                        src={p.player?.photo}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover bg-gray-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate text-sm">{p.player?.name}</p>
                        <p className="text-gray-500 text-xs truncate">{p.team?.name}</p>
                      </div>
                      <span className="text-blue-400 font-bold">{p.assists}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION 4: STARS DU MOMENT
// ===========================================

const StarsSection = () => {
  const [stars, setStars] = useState<EuropeanPlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const [scorers, assists, contributors] = await Promise.all([
          getTopScorersEurope(),
          getTopAssistsEurope(),
          getTopContributorsEurope(),
        ]);

        // Prendre les top 2 de chaque catégorie sans doublons
        const starIds = new Set<number>();
        const allStars: EuropeanPlayerStats[] = [];

        [scorers, assists, contributors].forEach((list) => {
          list.slice(0, 2).forEach((p) => {
            if (!starIds.has(p.player.id)) {
              starIds.add(p.player.id);
              allStars.push(p);
            }
          });
        });

        setStars(allStars.slice(0, 6));
      } catch (error) {
        console.error('Erreur stars:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStars();
  }, []);

  if (isLoading) return null;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-950/10 to-black" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full border border-pink-500/20 mb-4">
            <Flame className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-pink-400">En feu cette saison</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Stars du Moment
          </h2>
        </motion.div>

        {/* Grille de cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stars.map((player, index) => (
            <motion.div
              key={player.player.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/player/${player.player.id}`}
                className="group block relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-800 hover:border-pink-500/50 transition-all hover:shadow-xl hover:shadow-pink-500/10"
              >
                {/* Image */}
                {player.player.photo ? (
                  <img
                    src={player.player.photo}
                    alt={player.player.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Contenu */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {player.team.crest && (
                      <img src={player.team.crest} alt="" className="w-4 h-4 object-contain" loading="lazy" />
                    )}
                    <span className="text-xs text-gray-400">{player.league.flag}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm leading-tight group-hover:text-pink-400 transition-colors">
                    {player.player.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-pink-400 font-semibold">{player.goals} buts</span>
                    <span className="text-blue-400 font-semibold">{player.assists} passes</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION 5: CONTENUS ÉDITORIAUX
// ===========================================

const EditorialSection = () => {
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'tops-joueurs', label: 'Tops joueurs' },
    { id: 'fiches-joueurs', label: 'Portraits' },
    { id: 'joueurs-sous-cotes', label: 'Sous-cotés' },
    { id: 'pepites', label: 'Pépites' },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const categoryFilter = filter === 'all'
          ? `"joueurs" in categories[]->slug.current`
          : `"${filter}" in categories[]->slug.current`;

        const query = `*[_type == "article" && ${categoryFilter}] | order(publishedAt desc)[0...9] {
          _id,
          title,
          slug,
          mainImage,
          excerpt,
          publishedAt,
          categories[]->{ title, slug }
        }`;

        const data = await sanityClient.fetch(query);
        setArticles(data || []);
      } catch (error) {
        console.error('Erreur Sanity:', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [filter]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Analyses & Portraits</h2>
              <p className="text-gray-500 text-sm">Articles sur les joueurs</p>
            </div>
          </div>
        </motion.div>

        {/* Filtres */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${filter === f.id
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                  : 'bg-gray-900/80 text-gray-400 hover:text-white border border-gray-800'
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grille d'articles */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun article trouvé pour cette catégorie</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.article
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/article/${article.slug?.current}`}
                  className="group block bg-gray-900/60 rounded-2xl overflow-hidden border border-gray-800 hover:border-pink-500/30 transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={urlFor(article.mainImage).width(600).height(340).url()}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Badge catégorie */}
                    {article.categories?.[0] && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full text-xs font-medium text-white">
                        {article.categories[0].title}
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-5">
                    <h3 className="text-white font-bold leading-tight line-clamp-2 group-hover:text-pink-400 transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* Bouton voir tous */}
        {articles.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link
              to="/rubrique/joueurs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/80 hover:bg-gray-800 border border-gray-700 rounded-xl text-white font-medium transition-all"
            >
              Voir tous les articles
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// ===========================================
// SECTION 6: LÉGENDES
// ===========================================

const LegendsSection = () => {
  const [legends, setLegends] = useState<SanityArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLegends = async () => {
      try {
        const query = `*[_type == "article" && (
          "joueurs-legendaires" in categories[]->slug.current ||
          "carrieres" in categories[]->slug.current ||
          "legendes" in categories[]->slug.current
        )] | order(publishedAt desc)[0...6] {
          _id,
          title,
          slug,
          mainImage,
          excerpt,
          publishedAt
        }`;

        const data = await sanityClient.fetch(query);
        setLegends(data || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLegends();
  }, []);

  if (isLoading || legends.length === 0) return null;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background spécial */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-amber-950/10 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.05),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20 mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Hall of Fame</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Légendes du Football
          </h2>
          <p className="text-gray-500 mt-2">Les joueurs qui ont marqué l'histoire</p>
        </motion.div>

        {/* Grille légendes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legends.map((legend, index) => (
            <motion.article
              key={legend._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/article/${legend.slug?.current}`}
                className="group block relative aspect-[4/3] rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all"
              >
                {/* Image avec effet vintage */}
                <img
                  src={urlFor(legend.mainImage).width(600).height(450).url()}
                  alt={legend.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                {/* Contenu */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-amber-400 transition-colors">
                    {legend.title}
                  </h3>
                  {legend.excerpt && (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                      {legend.excerpt}
                    </p>
                  )}
                </div>

                {/* Badge doré */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-black" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION 7: RECHERCHE JOUEUR
// ===========================================

const PlayerSearchSection = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/football/players?search=${encodeURIComponent(query)}&league=61`);
        if (response.ok) {
          const data = await response.json();
          setResults((data.response || []).slice(0, 8));
          setShowResults(true);
        }
      } catch (error) {
        console.error('Erreur recherche:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPlayer = (playerId: number) => {
    setShowResults(false);
    setQuery('');
    navigate(`/player/${playerId}`);
  };

  return (
    <section className="relative py-20">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Rechercher un joueur</h2>
          <p className="text-gray-500">Trouvez n'importe quel joueur du football mondial</p>
        </motion.div>

        {/* Barre de recherche */}
        <div ref={searchRef} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un joueur..."
              className="w-full pl-12 pr-12 py-4 bg-gray-900/80 border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors text-lg"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500 animate-spin" />
            )}
            {query && !isSearching && (
              <button
                onClick={() => { setQuery(''); setResults([]); setShowResults(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Résultats */}
          <AnimatePresence>
            {showResults && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-50"
              >
                {results.map((item) => (
                  <button
                    key={item.player?.id}
                    onClick={() => handleSelectPlayer(item.player?.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
                  >
                    <img
                      src={item.player?.photo}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover bg-gray-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{item.player?.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.statistics?.[0]?.team?.logo && (
                          <img src={item.statistics[0].team.logo} alt="" className="w-4 h-4 object-contain" loading="lazy" />
                        )}
                        <span className="text-gray-500 text-sm truncate">
                          {item.statistics?.[0]?.team?.name || 'Club inconnu'}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500 text-sm">{item.player?.nationality}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// ===========================================
// PAGE PRINCIPALE
// ===========================================

// Type pour les données brutes des joueurs
interface RawPlayerData {
  player?: {
    id?: number;
    name?: string;
    firstName?: string;
    lastName?: string;
    nationality?: string;
    photo?: string;
  };
  team?: {
    id?: number;
    name?: string;
    crest?: string;
  };
  goals?: number;
  assists?: number;
  playedMatches?: number;
}

// Helper pour convertir les données de ligue en format EuropeanPlayerStats
// Les données viennent de getTopScorers qui utilise: player.firstName, player.lastName, team.crest, playedMatches
function convertToEuropeanPlayerStats(players: RawPlayerData[], leagueInfo: { id: number; name: string; flag: string }): EuropeanPlayerStats[] {
  return players.map((p) => ({
    player: {
      id: p.player?.id || 0,
      name: p.player?.name || '',
      firstName: p.player?.firstName,  // camelCase comme retourné par getTopScorers
      lastName: p.player?.lastName,    // camelCase comme retourné par getTopScorers
      nationality: p.player?.nationality,
      photo: p.player?.photo,
    },
    team: {
      id: p.team?.id,
      name: p.team?.name || '',
      crest: p.team?.crest,  // getTopScorers utilise "crest" pas "logo"
    },
    league: {
      id: leagueInfo.id,
      name: leagueInfo.name,
      country: '',
      flag: leagueInfo.flag,
    },
    goals: p.goals || 0,
    assists: p.assists || 0,
    total: (p.goals || 0) + (p.assists || 0),
    playedMatches: p.playedMatches || 0,  // getTopScorers utilise "playedMatches" directement
    rating: undefined,  // Non disponible dans getTopScorers
  }));
}

export default function JoueursPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const leagueParam = searchParams.get('league');

  const [heroPlayers, setHeroPlayers] = useState<EuropeanPlayerStats[]>([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [selectedLeagueInfo, setSelectedLeagueInfo] = useState<{ id: number; name: string; flag: string } | null>(null);

  // Déterminer la ligue sélectionnée (pour les onglets en bas)
  const selectedLeague = leagueParam
    ? TOP_5_LEAGUES.find((l) => l.id === parseInt(leagueParam)) || TOP_5_LEAGUES[0]
    : TOP_5_LEAGUES[0];

  // Handler pour changer de ligue (met à jour l'URL ce qui met à jour le hero)
  const handleLeagueSelect = (league: typeof TOP_5_LEAGUES[0]) => {
    setSearchParams({ league: String(league.id) });
    // Scroll vers le haut pour voir le nouveau podium
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Charger les top buteurs pour le hero (par ligue si spécifiée, sinon Europe)
  useEffect(() => {
    const fetchHeroData = async () => {
      setIsHeroLoading(true);
      try {
        if (leagueParam) {
          // Trouver les infos de la ligue
          const leagueId = parseInt(leagueParam);
          const league = TOP_5_LEAGUES.find((l) => l.id === leagueId);

          if (league) {
            setSelectedLeagueInfo({ id: league.id, name: league.name, flag: league.flag });
            // Charger les buteurs de cette ligue spécifique
            const data = await getTopScorers(leagueParam);
            const convertedData = convertToEuropeanPlayerStats(data || [], {
              id: league.id,
              name: league.name,
              flag: league.flag,
            });
            setHeroPlayers(convertedData);
          } else {
            // Ligue non trouvée, fallback sur Europe
            setSelectedLeagueInfo(null);
            const data = await getTopScorersEurope();
            setHeroPlayers(data);
          }
        } else {
          // Pas de filtre, charger toute l'Europe
          setSelectedLeagueInfo(null);
          const data = await getTopScorersEurope();
          setHeroPlayers(data);
        }
      } catch (error) {
        console.error('Erreur chargement hero:', error);
      } finally {
        setIsHeroLoading(false);
      }
    };
    fetchHeroData();
  }, [leagueParam]);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero avec podium */}
      <HeroSection topPlayers={heroPlayers} isLoading={isHeroLoading} leagueInfo={selectedLeagueInfo} />

      {/* Section principale : Classements + Sidebar avec articles */}
      {!selectedLeagueInfo && <MainContentSection />}

      {/* Par championnat - Toujours afficher */}
      <LeagueRankingsSection
        selectedLeague={selectedLeague}
        onSelectLeague={handleLeagueSelect}
      />

      {/* Recherche */}
      <PlayerSearchSection />

      {/* Contenus éditoriaux (section complète) */}
      <EditorialSection />

      {/* Légendes */}
      <LegendsSection />
    </div>
  );
}
