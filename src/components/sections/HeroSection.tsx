// src/components/sections/HeroSection.tsx
// VERSION OCTOGOAL - Design avec formes octogonales

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Sparkles, ChevronUp, ChevronDown, Zap, Flame, TrendingUp, Swords, Check, Users } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import ErrorBoundary from '../common/ErrorBoundary';
import { useData } from '../../context/DataContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SanityArticle, SanityVSPoll } from '../../types/sanity';
import { getFeaturedVSPoll } from '../../utils/sanityAPI';
import PlayerComparator from '../widgets/PlayerComparator';
import VideoPromoSection from './VideoPromoSection';

// Clip-paths octogonaux
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';
const octagonClipCard = 'polygon(4% 0%, 96% 0%, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0% 96%, 0% 4%)';

// Données mockées pour fallback
const mockFeaturedArticle: SanityArticle = {
  _id: '1',
  title: "Comment développer un mindset d'exception",
  slug: { _type: "slug", current: 'mindset-exception' },
  mainImage: {
    _type: "image",
    asset: {
      _ref: 'https://picsum.photos/1200/800?random=1',
      _type: "reference"
    }
  },
  excerpt: "Découvre les secrets des entrepreneurs qui réussissent et transforme ta vision du possible.",
  publishedAt: "2024-03-20",
  categories: [
    {
      _id: 'cat1',
      title: 'Actus',
      slug: { _type: "slug", current: 'actus' }
    }
  ],
  readingTime: '12 min'
};

const mockRecentArticles: SanityArticle[] = Array.from({ length: 12 }, (_, i) => ({
  _id: `${i + 2}`,
  title: `Article récent ${i + 1}`,
  slug: { _type: "slug", current: `article-${i + 1}` },
  mainImage: { _type: "image", asset: { _ref: `https://picsum.photos/600/400?random=${i + 2}`, _type: "reference" } },
  excerpt: "Description de l'article",
  publishedAt: new Date(Date.now() - 1000 * 60 * 30 * (i + 1)).toISOString(),
  categories: [{ _id: 'cat1', title: 'Actus', slug: { _type: "slug", current: 'actus' } }],
  readingTime: `${5 + i} min`
}));

// Fonction pour formater l'heure de publication
const formatPublishTime = (dateString: string | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
};

// Style unifié OCTOGOAL - Pink to Blue pour toutes les catégories
const unifiedCategoryStyle = { gradient: 'from-pink-500 to-blue-500', text: 'text-pink-400' };
const categoryColors: Record<string, { gradient: string; text: string }> = {
  'Actus': unifiedCategoryStyle,
  'Matchs': unifiedCategoryStyle,
  'Clubs': unifiedCategoryStyle,
  'Joueurs': unifiedCategoryStyle,
  'Formats Octogoal': unifiedCategoryStyle,
  'Mèmes': unifiedCategoryStyle,
  'Vidéos': unifiedCategoryStyle
};

export const HeroSection = () => {
  const { featuredArticles, recentArticles, latestArticles, isLoading: contextLoading } = useData();

  const [featuredArticle, setFeaturedArticle] = useState<SanityArticle>(mockFeaturedArticle);
  const [displayedArticles, setDisplayedArticles] = useState<SanityArticle[]>(mockRecentArticles);
  const [flashWidgetArticles, setFlashWidgetArticles] = useState<SanityArticle[]>(mockRecentArticles);

  const [scrollPosition, setScrollPosition] = useState(0);
  const maxVisibleItems = 8;

  // VS Poll state
  const [poll, setPoll] = useState<SanityVSPoll | null>(null);
  const [userVote, setUserVote] = useState<'option1' | 'option2' | null>(null);
  const [votes, setVotes] = useState({ option1: 0, option2: 0 });
  const [pollLoading, setPollLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!contextLoading) {
      if (featuredArticles && featuredArticles.length > 0) {
        setFeaturedArticle(featuredArticles[0]);
      }
      if (recentArticles && recentArticles.length > 0) {
        setDisplayedArticles(recentArticles.slice(0, 6));
      }
      if (latestArticles && latestArticles.length > 0) {
        setFlashWidgetArticles(latestArticles);
      }
    }
  }, [contextLoading, featuredArticles, recentArticles, latestArticles]);

  // Fetch VS Poll
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setPollLoading(true);
        const result = await getFeaturedVSPoll();
        if (result) {
          setPoll(result);
          setVotes({
            option1: result.option1.votes || 0,
            option2: result.option2.votes || 0
          });
          const savedVote = localStorage.getItem(`vs-poll-${result._id}`);
          if (savedVote) {
            setUserVote(savedVote as 'option1' | 'option2');
            setHasVoted(true);
          }
        }
      } catch (error) {
        console.error('Erreur chargement VS Poll:', error);
      } finally {
        setPollLoading(false);
      }
    };
    fetchPoll();
  }, []);

  const handleVote = (option: 'option1' | 'option2') => {
    if (hasVoted || !poll) return;
    setVotes(prev => ({ ...prev, [option]: prev[option] + 1 }));
    setUserVote(option);
    setHasVoted(true);
    localStorage.setItem(`vs-poll-${poll._id}`, option);
  };

  const totalVotes = votes.option1 + votes.option2;
  const percentage1 = totalVotes > 0 ? Math.round((votes.option1 / totalVotes) * 100) : 50;
  const percentage2 = totalVotes > 0 ? Math.round((votes.option2 / totalVotes) * 100) : 50;

  const flashArticles = flashWidgetArticles.slice(scrollPosition, scrollPosition + maxVisibleItems);
  const canScrollUp = scrollPosition > 0;
  const canScrollDown = scrollPosition + maxVisibleItems < flashWidgetArticles.length;

  if (contextLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </section>
    );
  }

  const getCategoryStyle = (catTitle: string) => {
    return categoryColors[catTitle] || { gradient: 'from-gray-500 to-gray-600', text: 'text-gray-400' };
  };

  return (
    <ErrorBoundary>
      <section className="relative min-h-screen">
        {/* Background avec formes octogonales décoratives */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          {/* Formes octogonales décoratives */}
          <motion.div
            initial={{ opacity: 0, rotate: -15 }}
            animate={{ opacity: 0.05, rotate: 0 }}
            transition={{ duration: 2 }}
            className="absolute -top-32 -right-32 w-[500px] h-[500px] border-2 border-pink-500/30"
            style={{ clipPath: octagonClip }}
          />
          <motion.div
            initial={{ opacity: 0, rotate: 15 }}
            animate={{ opacity: 0.03, rotate: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute -bottom-48 -left-48 w-[600px] h-[600px] border-2 border-blue-500/20"
            style={{ clipPath: octagonClip }}
          />

          {/* Gradient blobs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Hero Principal - Article à la une */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-12">

            {/* Article Principal - Image 16:9 + texte en dessous */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8"
            >
              <Link to={`/article/${featuredArticle.slug?.current}`} className="group block">
                <div
                  className="relative overflow-hidden bg-gray-900 shadow-2xl shadow-black/50"
                  style={{ clipPath: octagonClipCard }}
                >
                  {/* Image 16:9 SANS overlay ni texte */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <SafeImage
                      source={featuredArticle.mainImage}
                      alt={featuredArticle.title}
                      width={1200}
                      height={675}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                  </div>

                  {/* Zone texte EN DESSOUS de l'image - compact */}
                  <div className="p-4 md:p-6 bg-gray-900/80">
                    {/* Badge catégorie octogonal */}
                    {featuredArticle.categories?.[0] && (
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`inline-flex items-center px-4 py-2 mb-4 bg-gradient-to-r ${getCategoryStyle(featuredArticle.categories[0].title).gradient} shadow-lg`}
                        style={{ clipPath: octagonClipSubtle }}
                      >
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                          {featuredArticle.categories[0].title}
                        </span>
                      </motion.span>
                    )}

                    {/* Titre avec gradient par défaut */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-xl md:text-2xl lg:text-3xl font-black mb-3 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400"
                    >
                      {featuredArticle.title}
                    </motion.h1>

                    {/* Excerpt */}
                    {featuredArticle.excerpt && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-gray-300 mb-4 max-w-2xl line-clamp-2"
                      >
                        {featuredArticle.excerpt}
                      </motion.p>
                    )}

                    {/* Métas et CTA */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-wrap items-center gap-4"
                    >
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(featuredArticle.publishedAt || '').toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                      </div>

                      <span
                        className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold transition-all"
                        style={{ clipPath: octagonClipSubtle }}
                      >
                        Lire l'article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Widget Flash Infos - Sidebar compact */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-4 self-stretch"
            >
              <div
                className="h-full bg-gray-900/70 backdrop-blur-xl border border-gray-800/50 overflow-hidden flex flex-col rounded-xl"
              >
                {/* Header compact */}
                <div className="flex items-center justify-between px-4 py-3 sm:py-3 border-b border-gray-800/50 bg-black/30">
                  <div className="flex items-center gap-2.5 sm:gap-2">
                    <div className="w-9 h-9 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                      <Zap className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-sm font-bold text-white">Flash Infos</h3>
                      <p className="text-xs sm:text-[10px] text-gray-500">En temps réel</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-0.5">
                    <button
                      onClick={() => canScrollUp && setScrollPosition(p => p - 1)}
                      disabled={!canScrollUp}
                      className={`p-1.5 sm:p-1 rounded transition-all ${canScrollUp ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-700'}`}
                    >
                      <ChevronUp className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      onClick={() => canScrollDown && setScrollPosition(p => p + 1)}
                      disabled={!canScrollDown}
                      className={`p-1.5 sm:p-1 rounded transition-all ${canScrollDown ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-700'}`}
                    >
                      <ChevronDown className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Liste des articles avec miniatures - remplit l'espace */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-3 sm:p-2 space-y-1 sm:space-y-0.5">
                    {flashArticles.map((article, index) => {
                      const catTitle = article.categories?.[0]?.title || 'Actus';
                      const catStyle = getCategoryStyle(catTitle);

                      return (
                        <motion.div
                          key={article._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link
                            to={`/article/${article.slug?.current}`}
                            className="flex items-center gap-3 sm:gap-2.5 p-2 sm:p-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            {/* Miniature carrée */}
                            <div className="w-14 h-14 sm:w-11 sm:h-11 rounded-md overflow-hidden flex-shrink-0 bg-gray-800">
                              <SafeImage
                                source={article.mainImage}
                                alt=""
                                width={112}
                                height={112}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 sm:mb-0.5">
                                <span className={`text-[11px] sm:text-[9px] font-bold px-2 sm:px-1.5 py-0.5 rounded ${catStyle.text} bg-white/5`}>
                                  {catTitle.toUpperCase()}
                                </span>
                                <span className="text-xs sm:text-[10px] text-gray-600">
                                  {formatPublishTime(article.publishedAt)}
                                </span>
                              </div>
                              <p className="text-sm sm:text-xs text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                                {article.title}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <Link
                  to="/articles"
                  className="flex items-center justify-center gap-2 sm:gap-1.5 px-4 py-3 sm:py-2.5 border-t border-gray-800/50 text-sm sm:text-xs text-gray-400 hover:text-pink-400 hover:bg-white/5 transition-colors"
                >
                  <span>Voir tous les articles</span>
                  <ArrowRight className="w-4 h-4 sm:w-3 sm:h-3" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Section Vidéos Octogoal */}
          <VideoPromoSection />

          {/* Section Articles Tendances + VS Poll */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-pink-500/30 mb-4"
              style={{ clipPath: octagonClipSubtle }}
            >
              <Flame className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-medium text-white">Tendances</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-4">
              <span className="text-white">Articles </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                populaires
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Les contenus qui font parler la communauté cette semaine
            </p>
          </motion.div>

          {/* Layout: 4 Articles + VS Poll sur desktop */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {/* Grille de 4 articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:w-2/3">
              {displayedArticles.slice(0, 4).map((article, index) => {
                const catStyle = getCategoryStyle(article.categories?.[0]?.title || '');

                return (
                  <motion.article
                    key={article._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/article/${article.slug?.current}`} className="block h-full">
                      <div
                        className="relative h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1"
                        style={{ clipPath: octagonClipCard }}
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <SafeImage
                            source={article.mainImage}
                            alt={article.title}
                            width={600}
                            height={338}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Badge catégorie octogonal */}
                          {article.categories?.[0] && (
                            <div className="absolute top-3 left-3">
                              <div
                                className={`px-2 py-1 bg-gradient-to-r ${catStyle.gradient} shadow-lg`}
                                style={{ clipPath: octagonClipSubtle }}
                              >
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                  {article.categories[0].title}
                                </span>
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Contenu */}
                        <div className="p-4">
                          <h3 className="text-base font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                            {article.title}
                          </h3>

                          <p className="text-xs text-gray-400 line-clamp-3 mb-3">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between">
                            <time className="text-xs text-gray-500">
                              {new Date(article.publishedAt || '').toLocaleDateString('fr-FR')}
                            </time>

                            <span className="flex items-center gap-1 text-pink-400 text-xs font-medium group-hover:gap-2 transition-all">
                              Lire
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>

                        {/* Bordure animée au hover */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {/* Colonne droite: VS Poll + Comparateur */}
            <div className="lg:w-1/3 flex flex-col gap-4">
              {/* VS Poll Widget Compact */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {pollLoading ? (
                  <div className="h-[280px] rounded-2xl bg-gray-900/50 animate-pulse" />
                ) : poll ? (
                  <div
                    className="relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900/70 backdrop-blur-xl"
                  >
                  {/* Background gradients */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute top-0 left-0 right-0 h-1/2 opacity-20"
                      style={{
                        background: `linear-gradient(180deg, ${poll.option1.color || '#ec4899'}40 0%, transparent 100%)`
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
                      style={{
                        background: `linear-gradient(0deg, ${poll.option2.color || '#3b82f6'}40 0%, transparent 100%)`
                      }}
                    />
                  </div>

                  {/* Header compact */}
                  <div className="relative px-4 py-3 border-b border-white/10 bg-black/30">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
                        <Swords className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">VS de la semaine</span>
                        <h3 className="text-xs font-bold text-white leading-tight whitespace-nowrap">{poll.title}</h3>
                      </div>
                    </div>
                    {poll.question && (
                      <p className="text-sm font-semibold text-pink-400 mt-2">🎯 {poll.question}</p>
                    )}
                  </div>

                  {/* VS Arena Compact */}
                  <div className="relative flex flex-col">
                    {/* Option 1 */}
                    <div className="relative px-3 py-2.5 flex items-center gap-3 border-b border-white/10">
                      <div className="relative flex-shrink-0">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                          <SafeImage
                            source={poll.option1.image}
                            alt={poll.option1.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {userVote === 'option1' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <Check size={10} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{poll.option1.name}</h4>
                        {poll.option1.subtitle && (
                          <p className="text-[10px] text-gray-500 truncate">{poll.option1.subtitle}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleVote('option1')}
                        disabled={hasVoted}
                        className={`
                          px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex-shrink-0 active:scale-95
                          ${hasVoted
                            ? userVote === 'option1'
                              ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                              : 'bg-gray-800 text-gray-500'
                            : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30'
                          }
                        `}
                      >
                        {hasVoted ? `${percentage1}%` : 'Voter'}
                      </button>
                    </div>

                    {/* Badge VS central */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg rotate-45 flex items-center justify-center shadow-xl border border-white/20">
                        <span className="text-white font-black text-[10px] -rotate-45">VS</span>
                      </div>
                    </div>

                    {/* Option 2 */}
                    <div className="relative px-3 py-2.5 flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                          <SafeImage
                            source={poll.option2.image}
                            alt={poll.option2.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {userVote === 'option2' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <Check size={10} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{poll.option2.name}</h4>
                        {poll.option2.subtitle && (
                          <p className="text-[10px] text-gray-500 truncate">{poll.option2.subtitle}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleVote('option2')}
                        disabled={hasVoted}
                        className={`
                          px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex-shrink-0 active:scale-95
                          ${hasVoted
                            ? userVote === 'option2'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : 'bg-gray-800 text-gray-500'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                          }
                        `}
                      >
                        {hasVoted ? `${percentage2}%` : 'Voter'}
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <AnimatePresence>
                    {hasVoted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-white/10"
                      >
                        <div className="h-2 flex overflow-hidden">
                          <motion.div
                            initial={{ width: '50%' }}
                            animate={{ width: `${percentage1}%` }}
                            transition={{ duration: 0.8 }}
                            style={{ backgroundColor: poll.option1.color || '#ec4899' }}
                          />
                          <motion.div
                            initial={{ width: '50%' }}
                            animate={{ width: `${percentage2}%` }}
                            transition={{ duration: 0.8 }}
                            style={{ backgroundColor: poll.option2.color || '#3b82f6' }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-white/10 bg-black/30">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <Users size={16} className="text-pink-400" />
                      <span>{totalVotes.toLocaleString()} participants</span>
                    </div>
                  </div>
                </div>
                ) : (
                  <div className="h-[280px] rounded-2xl bg-gray-900/50 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Aucun sondage disponible</p>
                  </div>
                )}
              </motion.div>

              {/* Comparateur de Joueurs */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <PlayerComparator />
              </motion.div>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/articles"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105"
              style={{ clipPath: octagonClipSubtle }}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Découvrir tous les articles</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="mt-4 text-gray-500 text-sm">
              Plus de 500 articles pour les vrais passionnés de foot
            </p>
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default HeroSection;
