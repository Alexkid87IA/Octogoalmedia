// src/components/match/MatchComponents.tsx
// Composants réutilisables pour les pages de match

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Trophy, Flame } from 'lucide-react';
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
