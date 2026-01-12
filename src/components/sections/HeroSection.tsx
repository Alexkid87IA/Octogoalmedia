// src/components/sections/HeroSection.tsx
// VERSION OCTOGOAL - Design avec formes octogonales

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Sparkles, ChevronUp, ChevronDown, Zap, Flame, TrendingUp } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import ErrorBoundary from '../common/ErrorBoundary';
import { useData } from '../../context/DataContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SanityArticle } from '../../types/sanity';

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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Principal - Article à la une */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">

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

                    {/* Badge À LA UNE octogonal */}
                    <div className="absolute top-6 left-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 shadow-lg shadow-pink-500/30"
                        style={{ clipPath: octagonClipSubtle }}
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">À la une</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Zone texte EN DESSOUS de l'image */}
                  <div className="p-6 md:p-8 bg-gray-900/80">
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

                    {/* Titre avec effet gradient au hover */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 transition-all duration-300"
                    >
                      {featuredArticle.title}
                    </motion.h1>

                    {/* Excerpt */}
                    {featuredArticle.excerpt && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-base text-gray-300 mb-5 max-w-2xl line-clamp-2"
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
                        {featuredArticle.readingTime && (
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {featuredArticle.readingTime}
                          </span>
                        )}
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

            {/* Widget Flash - Sidebar - Hauteur auto qui s'aligne */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-4 self-stretch"
            >
              <div
                className="h-full bg-gray-900/50 backdrop-blur-xl border border-gray-800 overflow-hidden flex flex-col"
                style={{ clipPath: octagonClipCard }}
              >
                {/* Header */}
                <div className="border-b border-gray-800 px-5 py-4 bg-gradient-to-r from-pink-500/10 to-blue-500/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 bg-gradient-to-r from-pink-500 to-blue-500"
                      style={{ clipPath: octagonClip }}
                    >
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Flash Infos</h3>
                      <p className="text-xs text-gray-500">En temps réel</p>
                    </div>
                  </div>
                </div>

                {/* Liste des articles */}
                <div className="flex-1 overflow-y-auto">
                  <div className="divide-y divide-gray-800/50">
                    {flashArticles.map((article, index) => {
                      const catTitle = article.categories?.[0]?.title || '';
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
                            className="flex items-start gap-3 px-5 py-3 hover:bg-white/5 transition-colors group"
                          >
                            {/* Heure */}
                            <span className="text-xs text-gray-500 font-mono min-w-[45px] pt-0.5">
                              {formatPublishTime(article.publishedAt)}
                            </span>

                            {/* Titre avec catégorie colorée */}
                            <div className="flex-1">
                              {catTitle && (
                                <span className={`text-xs font-bold ${catStyle.text} uppercase tracking-wider`}>
                                  {catTitle}
                                </span>
                              )}
                              <p className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-tight mt-0.5">
                                {article.title}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer avec navigation */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 bg-black/30">
                  <Link
                    to="/articles"
                    className="text-sm text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    Voir tout
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => canScrollUp && setScrollPosition(p => p - 1)}
                      disabled={!canScrollUp}
                      className={`p-1.5 rounded-lg transition-all ${
                        canScrollUp
                          ? 'text-gray-400 hover:text-white hover:bg-white/10'
                          : 'text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => canScrollDown && setScrollPosition(p => p + 1)}
                      disabled={!canScrollDown}
                      className={`p-1.5 rounded-lg transition-all ${
                        canScrollDown
                          ? 'text-gray-400 hover:text-white hover:bg-white/10'
                          : 'text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section Articles Tendances */}
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

          {/* Grille d'articles avec tailles variées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedArticles.slice(0, 6).map((article, index) => {
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
                          <div className="absolute top-4 left-4">
                            <div
                              className={`px-3 py-1.5 bg-gradient-to-r ${catStyle.gradient} shadow-lg`}
                              style={{ clipPath: octagonClipSubtle }}
                            >
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                {article.categories[0].title}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Badge temps de lecture */}
                        <div className="absolute bottom-4 right-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium"
                            style={{ clipPath: octagonClipSubtle }}
                          >
                            <Clock className="w-3 h-3" />
                            {article.readingTime || '5 min'}
                          </span>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <time className="text-xs text-gray-500">
                            {new Date(article.publishedAt || '').toLocaleDateString('fr-FR')}
                          </time>

                          <span className="flex items-center gap-1 text-pink-400 text-sm font-medium group-hover:gap-2 transition-all">
                            Lire
                            <ArrowRight className="w-4 h-4" />
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
