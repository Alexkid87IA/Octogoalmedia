// src/components/match/MatchComponents.tsx
// Composants réutilisables pour les pages de match

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Star,
  ChevronRight,
  Trophy,
  Flame,
  TrendingUp,
  History,
  Calendar,
  Swords,
  Target,
  Shield,
  Zap,
} from 'lucide-react';
import { SanityArticle } from '../../types/sanity';
import { urlFor } from '../../utils/sanityClient';

// =============================================
// TYPES
// =============================================

export interface Scorer {
  player: { id: number; name: string };
  team: { id: number; name: string; crest: string };
  goals: number;
  assists?: number;
}

export interface TeamStanding {
  position: number;
  team: { id: number; name: string; crest: string };
  points: number;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

// =============================================
// COMPOSANTS UTILITAIRES
// =============================================

/** Barre de stat comparative */
export const StatBar = ({
  label,
  homeValue,
  awayValue,
  isPercentage = false,
}: {
  label: string;
  homeValue: number;
  awayValue: number;
  isPercentage?: boolean;
}) => {
  const total = homeValue + awayValue || 1;
  const homePercent = (homeValue / total) * 100;
  const awayPercent = (awayValue / total) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white font-bold">
          {homeValue}
          {isPercentage ? '%' : ''}
        </span>
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">
          {awayValue}
          {isPercentage ? '%' : ''}
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${homePercent}%` }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-pink-500 to-pink-400"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${awayPercent}%` }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-l from-blue-500 to-blue-400"
        />
      </div>
    </div>
  );
};

/** Icône d'événement de match */
export const EventIcon = ({ type, detail }: { type: string; detail: string }) => {
  switch (type) {
    case 'Goal':
      return <span className="text-2xl">⚽</span>;
    case 'Card':
      if (detail === 'Red Card') return <span className="text-2xl">🟥</span>;
      if (detail === 'Second Yellow card') return <span className="text-2xl">🟨🟥</span>;
      return <span className="text-2xl">🟨</span>;
    case 'subst':
      return <span className="text-2xl">🔄</span>;
    case 'Var':
      return (
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">VAR</span>
      );
    default:
      return <span className="text-2xl">📋</span>;
  }
};

/** Indicateur de forme (W/D/L) */
export const FormBadge = ({ result }: { result: 'W' | 'D' | 'L' }) => {
  const styles = {
    W: 'bg-green-500 text-white',
    D: 'bg-gray-500 text-white',
    L: 'bg-red-500 text-white',
  };
  const labels = { W: 'V', D: 'N', L: 'D' };

  return (
    <span
      className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${styles[result]}`}
    >
      {labels[result]}
    </span>
  );
};

// =============================================
// COMPOSANTS SIDEBAR
// =============================================

/** Article à la une Sidebar */
export const FeaturedArticleSidebar = ({ article }: { article: SanityArticle | null }) => {
  if (!article) return null;

  const getArticleImage = () => {
    try {
      if (article.mainImage?.asset?.url) return article.mainImage.asset.url;
      if (article.mainImage?.asset?._ref) return urlFor(article.mainImage).width(400).height(200).url();
      return null;
    } catch {
      return null;
    }
  };

  const imageUrl = getArticleImage();

  return (
    <Link
      to={`/article/${article.slug?.current}`}
      className="block group rounded-xl overflow-hidden bg-gray-900/50 border border-white/10"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-pink-500 rounded-md">
          <Star size={12} className="text-white" />
          <span className="text-xs font-bold text-white">À la une</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-2">{article.excerpt}</p>
        )}
      </div>
    </Link>
  );
};

/** Flash Info Sidebar */
export const FlashInfoSidebar = ({ articles }: { articles: SanityArticle[] }) => {
  if (!articles || articles.length === 0) return null;

  const displayArticles = articles.slice(0, 5);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Flame size={16} className="text-orange-500" />
        <span className="text-sm font-bold text-white">Flash Info</span>
      </div>

      <div className="divide-y divide-white/5">
        {displayArticles.map((article) => (
          <Link
            key={article._id}
            to={`/article/${article.slug?.current}`}
            className="block p-3 hover:bg-white/5 transition-colors group"
          >
            <h4 className="text-xs font-medium text-gray-300 group-hover:text-white line-clamp-2">
              {article.title}
            </h4>
          </Link>
        ))}
      </div>

      <Link
        to="/articles"
        className="flex items-center justify-center gap-1 p-3 text-xs text-pink-400 hover:text-pink-300 border-t border-white/10"
      >
        Voir tous les articles
        <ChevronRight size={14} />
      </Link>
    </div>
  );
};

/** Mini tableau des classements */
export const MiniStandings = ({
  standings,
  homeTeamId,
  awayTeamId,
  competitionId,
}: {
  standings: TeamStanding[];
  homeTeamId: number;
  awayTeamId: number;
  competitionId: number;
}) => {
  if (!standings || standings.length === 0) return null;

  const relevantStandings = standings.filter(
    (s) => s.team.id === homeTeamId || s.team.id === awayTeamId
  );

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-yellow-500" />
          <span className="text-sm font-bold text-white">Classement</span>
        </div>
        <Link
          to="/classements"
          className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
        >
          Voir tout
          <ChevronRight size={12} />
        </Link>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-[auto_1fr_repeat(3,minmax(0,2rem))_2.5rem] gap-2 text-[10px] text-gray-500 px-2 mb-2">
          <span>#</span>
          <span>Équipe</span>
          <span className="text-center">MJ</span>
          <span className="text-center">+/-</span>
          <span className="text-center">Pts</span>
        </div>

        <div className="space-y-1">
          {relevantStandings.map((team) => {
            const isHighlighted = team.team.id === homeTeamId || team.team.id === awayTeamId;
            return (
              <Link
                key={team.team.id}
                to={`/classements/club/${team.team.id}`}
                className={`grid grid-cols-[auto_1fr_repeat(3,minmax(0,2rem))_2.5rem] gap-2 items-center px-2 py-2 rounded-lg transition-colors ${
                  isHighlighted
                    ? 'bg-pink-500/10 border border-pink-500/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <span className="text-xs font-bold text-gray-400 w-5">{team.position}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={team.team.crest}
                    alt=""
                    className="w-5 h-5 object-contain"
                    loading="lazy"
                  />
                  <span className="text-xs text-white truncate">{team.team.name}</span>
                </div>
                <span className="text-xs text-gray-400 text-center">{team.playedGames}</span>
                <span
                  className={`text-xs text-center ${
                    team.goalDifference > 0
                      ? 'text-green-400'
                      : team.goalDifference < 0
                        ? 'text-red-400'
                        : 'text-gray-400'
                  }`}
                >
                  {team.goalDifference > 0 ? '+' : ''}
                  {team.goalDifference}
                </span>
                <span className="text-xs font-bold text-white text-center">{team.points}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Top buteurs sidebar */
export const TopScorersSidebar = ({
  scorers,
  competitionId,
}: {
  scorers: Scorer[];
  competitionId: number;
}) => {
  if (!scorers || scorers.length === 0) return null;

  const topScorers = scorers.slice(0, 5);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <span className="text-sm font-bold text-white">Meilleurs buteurs</span>
        </div>
        <Link
          to={`/classements/scorers/${competitionId}`}
          className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
        >
          Voir tout
          <ChevronRight size={12} />
        </Link>
      </div>

      <div className="p-3 space-y-2">
        {topScorers.map((scorer, index) => (
          <Link
            key={scorer.player.id}
            to={`/player/${scorer.player.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                index === 0
                  ? 'bg-yellow-500 text-black'
                  : index === 1
                    ? 'bg-gray-400 text-black'
                    : index === 2
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-700 text-gray-300'
              }`}
            >
              {index + 1}
            </span>
            <img
              src={scorer.team.crest}
              alt=""
              className="w-5 h-5 object-contain"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white group-hover:text-pink-400 truncate">
                {scorer.player.name}
              </p>
            </div>
            <span className="text-sm font-bold text-white">{scorer.goals}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

/** Forme des équipes */
export const TeamFormSidebar = ({
  homeForm,
  awayForm,
  homeTeam,
  awayTeam,
}: {
  homeForm: ('W' | 'D' | 'L')[];
  awayForm: ('W' | 'D' | 'L')[];
  homeTeam: { name: string; crest: string };
  awayTeam: { name: string; crest: string };
}) => {
  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <span className="text-sm font-bold text-white">Forme récente</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Home Team */}
        <div className="flex items-center gap-3">
          <img src={homeTeam.crest} alt="" className="w-6 h-6 object-contain" loading="lazy" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">{homeTeam.name}</p>
          </div>
          <div className="flex gap-1">
            {homeForm.slice(0, 5).map((result, i) => (
              <FormBadge key={i} result={result} />
            ))}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-3">
          <img src={awayTeam.crest} alt="" className="w-6 h-6 object-contain" loading="lazy" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">{awayTeam.name}</p>
          </div>
          <div className="flex gap-1">
            {awayForm.slice(0, 5).map((result, i) => (
              <FormBadge key={i} result={result} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================
// TYPES POUR MATCH
// =============================================

export interface Match {
  id: number;
  matchday: number;
  round?: string;
  utcDate: string;
  status: string;
  minute?: number;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  venue?: string;
  referee?: string;
}

export interface MatchOdds {
  odds: {
    winamax?: {
      home: number;
      draw: number;
      away: number;
    };
  };
}

// =============================================
// COMPOSANTS PREVIEW ET SIDEBAR ADDITIONNELS
// =============================================

/** Composant Preview avant-match */
export const MatchPreview = ({
  match,
  h2h,
  homeForm,
  awayForm,
  standings,
  headerOdds,
  formatDateFR,
}: {
  match: Match;
  h2h: Match[];
  homeForm: ('W' | 'D' | 'L')[];
  awayForm: ('W' | 'D' | 'L')[];
  standings: TeamStanding[];
  headerOdds: MatchOdds | null;
  formatDateFR: (date: string) => string;
}) => {
  // Calculer les stats H2H
  const h2hStats = (() => {
    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;
    let homeGoals = 0;
    let awayGoals = 0;

    h2h.forEach((m) => {
      const hGoals = m.score.fullTime.home ?? 0;
      const aGoals = m.score.fullTime.away ?? 0;

      if (m.homeTeam.id === match.homeTeam.id) {
        homeGoals += hGoals;
        awayGoals += aGoals;
        if (hGoals > aGoals) homeWins++;
        else if (aGoals > hGoals) awayWins++;
        else draws++;
      } else {
        homeGoals += aGoals;
        awayGoals += hGoals;
        if (aGoals > hGoals) homeWins++;
        else if (hGoals > aGoals) awayWins++;
        else draws++;
      }
    });

    return { homeWins, awayWins, draws, homeGoals, awayGoals, total: h2h.length };
  })();

  // Positions au classement
  const homeStanding = standings.find((s) => s.team.id === match.homeTeam.id);
  const awayStanding = standings.find((s) => s.team.id === match.awayTeam.id);

  // Prédiction basée sur les cotes
  const prediction = (() => {
    if (!headerOdds?.odds.winamax) return null;
    const { home, draw, away } = headerOdds.odds.winamax;
    const minOdd = Math.min(home, draw, away);
    if (minOdd === home) return { winner: 'home', confidence: Math.round((1 / home) * 100) };
    if (minOdd === away) return { winner: 'away', confidence: Math.round((1 / away) * 100) };
    return { winner: 'draw', confidence: Math.round((1 / draw) * 100) };
  })();

  return (
    <div className="space-y-6">
      {/* En-tête Avant-Match */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-blue-900/30 rounded-2xl border border-purple-500/20 p-6"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <Swords className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Avant-Match</h2>
          <Flame className="w-5 h-5 text-orange-400" />
        </div>

        {/* Comparaison Forme + Position */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Home */}
          <div className="text-center">
            <img src={match.homeTeam.crest} alt="" className="w-16 h-16 mx-auto mb-2" loading="lazy" />
            <p className="text-white font-bold text-sm mb-2">
              {match.homeTeam.shortName || match.homeTeam.name}
            </p>
            <div className="flex justify-center gap-1 mb-2">
              {homeForm.slice(0, 5).map((r, i) => (
                <FormBadge key={i} result={r} />
              ))}
            </div>
            {homeStanding && (
              <p className="text-gray-400 text-xs">
                <span className="text-pink-400 font-bold">{homeStanding.position}e</span> au classement
              </p>
            )}
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
              <span className="text-white font-black text-lg">VS</span>
            </div>
            <p className="text-gray-500 text-xs">{formatDateFR(match.utcDate)}</p>
          </div>

          {/* Away */}
          <div className="text-center">
            <img src={match.awayTeam.crest} alt="" className="w-16 h-16 mx-auto mb-2" loading="lazy" />
            <p className="text-white font-bold text-sm mb-2">
              {match.awayTeam.shortName || match.awayTeam.name}
            </p>
            <div className="flex justify-center gap-1 mb-2">
              {awayForm.slice(0, 5).map((r, i) => (
                <FormBadge key={i} result={r} />
              ))}
            </div>
            {awayStanding && (
              <p className="text-gray-400 text-xs">
                <span className="text-blue-400 font-bold">{awayStanding.position}e</span> au classement
              </p>
            )}
          </div>
        </div>

        {/* Stats saison si dispo */}
        {homeStanding && awayStanding && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-black text-pink-400">{homeStanding.goalsFor}</p>
              <p className="text-xs text-gray-500">Buts marqués</p>
            </div>
            <div className="flex items-center justify-center">
              <Target className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-400">{awayStanding.goalsFor}</p>
              <p className="text-xs text-gray-500">Buts marqués</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-black text-pink-400">{homeStanding.goalsAgainst}</p>
              <p className="text-xs text-gray-500">Buts encaissés</p>
            </div>
            <div className="flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-400">{awayStanding.goalsAgainst}</p>
              <p className="text-xs text-gray-500">Buts encaissés</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Historique H2H */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-bold text-white">Confrontations directes</h3>
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">
              {h2hStats.total} matchs
            </span>
          </div>
        </div>

        {h2h.length > 0 ? (
          <>
            {/* Stats H2H */}
            <div className="p-6 grid grid-cols-3 gap-4 border-b border-white/10">
              <div className="text-center">
                <p className="text-3xl font-black text-pink-400">{h2hStats.homeWins}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Victoires {match.homeTeam.shortName || match.homeTeam.name.substring(0, 3)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-gray-400">{h2hStats.draws}</p>
                <p className="text-xs text-gray-500 mt-1">Nuls</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-blue-400">{h2hStats.awayWins}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Victoires {match.awayTeam.shortName || match.awayTeam.name.substring(0, 3)}
                </p>
              </div>
            </div>

            {/* Barre visuelle */}
            <div className="px-6 py-3 border-b border-white/10">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-pink-400 transition-all"
                  style={{ width: `${(h2hStats.homeWins / h2hStats.total) * 100}%` }}
                />
                <div
                  className="bg-gray-600 transition-all"
                  style={{ width: `${(h2hStats.draws / h2hStats.total) * 100}%` }}
                />
                <div
                  className="bg-gradient-to-l from-blue-500 to-blue-400 transition-all"
                  style={{ width: `${(h2hStats.awayWins / h2hStats.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Liste derniers matchs */}
            <div className="p-4 space-y-2">
              {h2h.slice(0, 5).map((m) => {
                const isHomeTeamHome = m.homeTeam.id === match.homeTeam.id;
                const homeGoals = m.score.fullTime.home ?? 0;
                const awayGoals = m.score.fullTime.away ?? 0;
                const result = isHomeTeamHome
                  ? homeGoals > awayGoals
                    ? 'W'
                    : homeGoals < awayGoals
                      ? 'L'
                      : 'D'
                  : awayGoals > homeGoals
                    ? 'W'
                    : awayGoals < homeGoals
                      ? 'L'
                      : 'D';

                return (
                  <Link
                    key={m.id}
                    to={`/match/${m.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-gray-500 text-xs w-20">{formatDateFR(m.utcDate)}</span>
                    <img src={m.homeTeam.crest} alt="" className="w-5 h-5" loading="lazy" />
                    <span className="text-gray-300 text-sm flex-1 truncate">{m.homeTeam.name}</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        result === 'W'
                          ? 'bg-green-500/20 text-green-400'
                          : result === 'L'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {homeGoals} - {awayGoals}
                    </span>
                    <span className="text-gray-300 text-sm flex-1 truncate text-right">{m.awayTeam.name}</span>
                    <img src={m.awayTeam.crest} alt="" className="w-5 h-5" loading="lazy" />
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <History className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400">Première confrontation entre ces équipes</p>
          </div>
        )}
      </motion.div>

      {/* Pronostic */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl border border-orange-500/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">Pronostic</h3>
            <span className="text-xs text-gray-500">(basé sur les cotes)</span>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div
              className={`flex-1 text-center p-4 rounded-xl border ${
                prediction.winner === 'home'
                  ? 'bg-pink-500/20 border-pink-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <img src={match.homeTeam.crest} alt="" className="w-12 h-12 mx-auto mb-2" loading="lazy" />
              <p
                className={`font-bold ${prediction.winner === 'home' ? 'text-pink-400' : 'text-gray-500'}`}
              >
                {match.homeTeam.shortName || match.homeTeam.name.substring(0, 10)}
              </p>
              {prediction.winner === 'home' && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-sm font-bold">Favori</span>
                </div>
              )}
            </div>

            <div
              className={`text-center p-4 rounded-xl border ${
                prediction.winner === 'draw'
                  ? 'bg-gray-500/20 border-gray-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <p
                className={`text-2xl font-black ${prediction.winner === 'draw' ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Nul
              </p>
            </div>

            <div
              className={`flex-1 text-center p-4 rounded-xl border ${
                prediction.winner === 'away'
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <img src={match.awayTeam.crest} alt="" className="w-12 h-12 mx-auto mb-2" loading="lazy" />
              <p
                className={`font-bold ${prediction.winner === 'away' ? 'text-blue-400' : 'text-gray-500'}`}
              >
                {match.awayTeam.shortName || match.awayTeam.name.substring(0, 10)}
              </p>
              {prediction.winner === 'away' && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-sm font-bold">Favori</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/** Autres matchs de la journée/du tour */
export const OtherMatchesSidebar = ({
  matches,
  currentMatchId,
  round,
  competitionId,
  matchday,
}: {
  matches: Match[];
  currentMatchId: number;
  round?: string;
  competitionId?: number;
  matchday?: number;
}) => {
  const otherMatches = matches.filter((m) => m.id !== currentMatchId).slice(0, 6);
  const totalOtherMatches = matches.filter((m) => m.id !== currentMatchId).length;

  if (otherMatches.length === 0) return null;

  // Déterminer le type de compétition
  const isRegularLeague = round?.includes('Regular Season');
  const isLeaguePhase = round?.includes('League Phase') || round?.includes('League Stage');
  const isCupKnockout = round && !isRegularLeague && !isLeaguePhase;

  // Titre adapté
  let title = 'Autres matchs';
  if (isCupKnockout) {
    title = round || 'Tour de coupe';
  } else if (isLeaguePhase) {
    const matchNum = round?.match(/\d+/)?.[0];
    title = matchNum ? `Journée ${matchNum} - Phase de Ligue` : round || 'Phase de Ligue';
  } else if (isRegularLeague) {
    title = `Journée ${matchday}`;
  }

  // Construire le lien vers la page complète de la journée
  const matchdayLink = competitionId
    ? (isCupKnockout || isLeaguePhase) && round
      ? `/classements/matchday/${competitionId}?round=${encodeURIComponent(round)}`
      : `/classements/matchday/${competitionId}?matchday=${matchday}`
    : null;

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCupKnockout ? (
            <Trophy className="w-4 h-4 text-yellow-500" />
          ) : (
            <Calendar className="w-4 h-4 text-blue-500" />
          )}
          <span className="text-white font-bold text-sm truncate">{title}</span>
        </div>
        {totalOtherMatches > 6 && <span className="text-xs text-gray-500">+{totalOtherMatches - 6}</span>}
      </div>
      <div className="p-2 space-y-1">
        {otherMatches.map((m) => (
          <Link
            key={m.id}
            to={`/match/${m.id}`}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-xs"
          >
            <img src={m.homeTeam.crest} alt="" className="w-4 h-4 object-contain" loading="lazy" />
            <span className="text-gray-400 flex-1 truncate">
              {m.homeTeam.shortName || m.homeTeam.name.substring(0, 3)}
            </span>
            <span
              className={`font-bold ${
                m.status === 'IN_PLAY'
                  ? 'text-red-400'
                  : m.status === 'FINISHED'
                    ? 'text-white'
                    : 'text-gray-500'
              }`}
            >
              {m.status === 'FINISHED' || m.status === 'IN_PLAY'
                ? `${m.score.fullTime.home ?? 0}-${m.score.fullTime.away ?? 0}`
                : 'vs'}
            </span>
            <span className="text-gray-400 flex-1 truncate text-right">
              {m.awayTeam.shortName || m.awayTeam.name.substring(0, 3)}
            </span>
            <img src={m.awayTeam.crest} alt="" className="w-4 h-4 object-contain" loading="lazy" />
          </Link>
        ))}

        {/* Lien vers la page complète */}
        {matchdayLink && (
          <Link
            to={matchdayLink}
            className="block text-center py-2 mt-2 text-xs text-pink-400 hover:text-pink-300 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isCupKnockout ? 'Voir tous les matchs du tour →' : 'Voir la journée complète →'}
          </Link>
        )}
      </div>
    </div>
  );
};

/** Top buteurs avec toggle passeurs */
export const TopScorersWithToggle = ({
  scorers,
  competitionId,
}: {
  scorers: Scorer[];
  competitionId: number;
}) => {
  const [showAssists, setShowAssists] = useState(false);

  if (scorers.length === 0) return null;

  // Trier par passes décisives pour l'onglet passeurs
  const topAssisters = [...scorers]
    .filter((s) => (s.assists ?? 0) > 0)
    .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))
    .slice(0, 5);

  const displayList = showAssists ? topAssisters : scorers.slice(0, 5);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{showAssists ? '🎯' : '⚽'}</span>
          <span className="text-white font-bold text-sm">
            {showAssists ? 'Meilleurs passeurs' : 'Meilleurs buteurs'}
          </span>
        </div>
        <Link to={`/classements?league=${competitionId}`} className="text-xs text-pink-400 hover:text-pink-300">
          Voir tout →
        </Link>
      </div>

      {/* Toggle buteurs/passeurs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setShowAssists(false)}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            !showAssists
              ? 'text-pink-400 bg-pink-500/10 border-b-2 border-pink-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          ⚽ Buteurs
        </button>
        <button
          onClick={() => setShowAssists(true)}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            showAssists
              ? 'text-blue-400 bg-blue-500/10 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          🎯 Passeurs
        </button>
      </div>

      <div className="p-3 space-y-2">
        {displayList.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">Aucune donnée disponible</p>
        ) : (
          displayList.map((scorer, idx) => (
            <Link
              key={scorer.player.id}
              to={`/player/${scorer.player.id}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span
                className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                  idx === 0
                    ? 'bg-yellow-500/30 text-yellow-400'
                    : idx === 1
                      ? 'bg-gray-400/30 text-gray-300'
                      : idx === 2
                        ? 'bg-amber-600/30 text-amber-500'
                        : 'bg-gray-800 text-gray-500'
                }`}
              >
                {idx + 1}
              </span>
              <img src={scorer.team.crest} alt="" className="w-4 h-4 object-contain" loading="lazy" />
              <span className="text-gray-300 text-sm flex-1 truncate">{scorer.player.name}</span>
              <span className={`font-bold text-sm ${showAssists ? 'text-blue-400' : 'text-pink-400'}`}>
                {showAssists ? scorer.assists : scorer.goals}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
