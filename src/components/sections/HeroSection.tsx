// src/components/sections/HeroSection.tsx
// VERSION AVEC WIDGET FLASH - Design sombre intégré

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Sparkles, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import ErrorBoundary from '../common/ErrorBoundary';
import { useData } from '../../context/DataContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SanityArticle } from '../../types/sanity';

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
      title: 'Mindset',
      slug: { _type: "slug", current: 'mindset' }
    }
  ],
  readingTime: '12 min'
};

const mockRecentArticles: SanityArticle[] = [
  {
    _id: '2',
    title: "L'art de la résilience entrepreneuriale face aux défis",
    slug: { _type: "slug", current: 'resilience-entrepreneuriale' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=2', _type: "reference" } },
    excerpt: "Découvrez comment transformer les obstacles en opportunités",
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    categories: [{ _id: 'cat2', title: 'Mental', slug: { _type: "slug", current: 'mental' } }],
    readingTime: '8 min'
  },
  {
    _id: '3',
    title: "Comment développer son leadership authentique",
    slug: { _type: "slug", current: 'developper-leadership' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=3', _type: "reference" } },
    excerpt: "Les qualités essentielles d'un leader moderne",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    categories: [{ _id: 'cat3', title: 'Business', slug: { _type: "slug", current: 'business' } }],
    readingTime: '10 min'
  },
  {
    _id: '4',
    title: "Les clés d'une communication impactante",
    slug: { _type: "slug", current: 'communication-impactante' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=4', _type: "reference" } },
    excerpt: "Techniques pour captiver votre audience",
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    categories: [{ _id: 'cat4', title: 'Story', slug: { _type: "slug", current: 'story' } }],
    readingTime: '6 min'
  },
  {
    _id: '5',
    title: "Innovation et développement durable",
    slug: { _type: "slug", current: 'innovation-durable' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=5', _type: "reference" } },
    excerpt: "Concilier croissance et responsabilité",
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    categories: [{ _id: 'cat5', title: 'Business', slug: { _type: "slug", current: 'business' } }],
    readingTime: '9 min'
  },
  {
    _id: '6',
    title: "Le pouvoir du storytelling dans le business",
    slug: { _type: "slug", current: 'pouvoir-storytelling' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=6', _type: "reference" } },
    excerpt: "L'art de raconter des histoires qui marquent",
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    categories: [{ _id: 'cat6', title: 'Story', slug: { _type: "slug", current: 'story' } }],
    readingTime: '7 min'
  },
  {
    _id: '7',
    title: "Les secrets des entrepreneurs à succès",
    slug: { _type: "slug", current: 'secrets-entrepreneurs' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=7', _type: "reference" } },
    excerpt: "Ce qui différencie les leaders",
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    categories: [{ _id: 'cat7', title: 'Mental', slug: { _type: "slug", current: 'mental' } }],
    readingTime: '8 min'
  },
  {
    _id: '8',
    title: "Transformer sa passion en business rentable",
    slug: { _type: "slug", current: 'passion-business' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=8', _type: "reference" } },
    excerpt: "Guide pratique pour entrepreneurs",
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    categories: [{ _id: 'cat8', title: 'Business', slug: { _type: "slug", current: 'business' } }],
    readingTime: '12 min'
  },
  {
    _id: '9',
    title: "L'intelligence émotionnelle au service du leadership",
    slug: { _type: "slug", current: 'intelligence-emotionnelle' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=9', _type: "reference" } },
    excerpt: "Développer son QE pour mieux diriger",
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    categories: [{ _id: 'cat9', title: 'Mental', slug: { _type: "slug", current: 'mental' } }],
    readingTime: '10 min'
  },
  {
    _id: '10',
    title: "Créer une culture d'entreprise forte",
    slug: { _type: "slug", current: 'culture-entreprise' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=10', _type: "reference" } },
    excerpt: "Les fondements d'une équipe soudée",
    publishedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    categories: [{ _id: 'cat10', title: 'Business', slug: { _type: "slug", current: 'business' } }],
    readingTime: '9 min'
  },
  {
    _id: '11',
    title: "Maîtriser l'art de la négociation",
    slug: { _type: "slug", current: 'art-negociation' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=11', _type: "reference" } },
    excerpt: "Techniques avancées pour conclure",
    publishedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    categories: [{ _id: 'cat11', title: 'Business', slug: { _type: "slug", current: 'business' } }],
    readingTime: '11 min'
  },
  {
    _id: '12',
    title: "La productivité des top performers",
    slug: { _type: "slug", current: 'productivite-performers' },
    mainImage: { _type: "image", asset: { _ref: 'https://picsum.photos/600/400?random=12', _type: "reference" } },
    excerpt: "Habitudes et routines gagnantes",
    publishedAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    categories: [{ _id: 'cat12', title: 'Mental', slug: { _type: "slug", current: 'mental' } }],
    readingTime: '8 min'
  }
];

// Fonction pour formater l'heure de publication
const formatPublishTime = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Si c'est aujourd'hui, afficher l'heure
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Sinon afficher la date courte
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
};

// Couleurs par catégorie
const categoryColors: Record<string, { text: string; gradient: string }> = {
  'Story': { text: 'text-amber-400', gradient: 'from-amber-500 to-orange-500' },
  'Business': { text: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
  'Mental': { text: 'text-purple-400', gradient: 'from-purple-500 to-violet-500' },
  'Society': { text: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-500' },
  'Skills': { text: 'text-cyan-400', gradient: 'from-cyan-500 to-blue-500' },
  'Leadership': { text: 'text-orange-400', gradient: 'from-orange-500 to-red-500' },
  'Marketing': { text: 'text-pink-400', gradient: 'from-pink-500 to-rose-500' },
  'Mindset': { text: 'text-violet-400', gradient: 'from-violet-500 to-purple-500' }
};

export const HeroSection = () => {
  const { featuredArticles, recentArticles, latestArticles, isLoading: contextLoading } = useData();
  
  const [featuredArticle, setFeaturedArticle] = useState<SanityArticle>(mockFeaturedArticle);
  const [displayedArticles, setDisplayedArticles] = useState<SanityArticle[]>(mockRecentArticles);
  const [flashWidgetArticles, setFlashWidgetArticles] = useState<SanityArticle[]>(mockRecentArticles);
  
  // États pour le widget Flash
  const [scrollPosition, setScrollPosition] = useState(0);
  const maxVisibleItems = 8;

  useEffect(() => {
    if (!contextLoading) {
      if (featuredArticles && featuredArticles.length > 0) {
        setFeaturedArticle(featuredArticles[0]);
      }
      if (recentArticles && recentArticles.length > 0) {
        // Articles trending pour la grille en bas
        setDisplayedArticles(recentArticles.slice(0, 6));
      }
      if (latestArticles && latestArticles.length > 0) {
        // Derniers articles publiés pour le widget Flash (déjà triés par date)
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

  return (
    <ErrorBoundary>
      <section className="relative min-h-screen flex items-center py-12">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black" />
          
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
                }}
                animate={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
                }}
                transition={{ duration: 20 + Math.random() * 20, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </div>

          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse animation-delay-2000" />
          </div>
        </div>

        <div className="container relative z-10">
          {/* Hero Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
            
            {/* Article Principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8"
            >
              <Link to={`/article/${featuredArticle.slug?.current}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden bg-neutral-900">
                  {/* Image avec ratio 16:9 */}
                  <div className="relative aspect-[16/9]">
                    <SafeImage
                      source={featuredArticle.mainImage}
                      alt={featuredArticle.title}
                      width={1200}
                      height={675}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    {/* Badge À LA UNE */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-medium text-white uppercase tracking-wider">À la une</span>
                      </div>
                    </div>
                    
                    {/* Contenu en bas */}
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      {featuredArticle.categories?.[0] && (
                        <span className={`inline-flex items-center px-3 py-1 mb-3 bg-gradient-to-r ${categoryColors[featuredArticle.categories[0].title]?.gradient || 'from-gray-500 to-gray-600'} rounded-full`}>
                          <span className="text-xs font-semibold text-white">
                            {featuredArticle.categories[0].title}
                          </span>
                        </span>
                      )}
                      
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-cyan-400 transition-colors">
                        {featuredArticle.title}
                      </h2>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(featuredArticle.publishedAt || '').toLocaleDateString('fr-FR')}</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-white font-medium group-hover:text-cyan-400 transition-colors">
                          Lire l'article
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* ===== WIDGET FLASH ===== */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-4"
            >
              {/* Le widget prend la même hauteur que le 16:9 de l'article (ratio calculé: 8:9) */}
              <div className="lg:aspect-[8/9] bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Flash</span>
                  </div>
                </div>

                {/* Liste des articles - espacement réduit */}
                <div className="flex-1 overflow-y-auto">
                  <div className="divide-y divide-white/5 h-full">
                    {flashArticles.map((article, index) => {
                      const catTitle = article.categories?.[0]?.title || '';
                      const catColor = categoryColors[catTitle]?.text || 'text-gray-400';
                      
                      return (
                        <motion.div
                          key={article._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <Link 
                            to={`/article/${article.slug?.current}`}
                            className="flex items-start gap-3 px-4 py-2 hover:bg-white/[0.03] transition-colors group"
                          >
                            {/* Heure */}
                            <span className="text-xs text-gray-500 font-mono min-w-[42px] pt-0.5">
                              {formatPublishTime(article.publishedAt)}
                            </span>
                            
                            {/* Titre avec catégorie colorée */}
                            <p className="flex-1 text-sm leading-tight">
                              {catTitle && (
                                <span className={`font-bold ${catColor}`}>
                                  {catTitle} : 
                                </span>
                              )}
                              <span className="text-gray-300 group-hover:text-white transition-colors ml-1">
                                {article.title}
                              </span>
                            </p>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-white/[0.02]">
                  <Link 
                    to="/articles"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Voir tous
                  </Link>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => canScrollUp && setScrollPosition(p => p - 1)}
                      disabled={!canScrollUp}
                      className={`p-1 rounded transition-all ${
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
                      className={`p-1 rounded transition-all ${
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

          {/* Section Articles tendances */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Articles </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                tendances
              </span>
            </h2>
            <p className="text-gray-400">Les contenus qui font parler la communauté</p>
          </motion.div>

          {/* Grille d'articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedArticles.slice(0, 6).map((article, index) => (
              <motion.article
                key={article._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/article/${article.slug?.current}`} className="block h-full">
                  <div className="relative h-full bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <SafeImage
                        source={article.mainImage}
                        alt={article.title}
                        width={600}
                        height={338}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {article.categories?.[0] && (
                        <div className="absolute top-4 left-4">
                          <div className={`px-3 py-1.5 bg-gradient-to-r ${categoryColors[article.categories[0].title]?.gradient || 'from-gray-500 to-gray-600'} rounded-full shadow-lg`}>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              {article.categories[0].title}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-4 right-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                          <Clock className="w-3 h-3 text-white" />
                          <span className="text-xs font-medium text-white">
                            {article.readingTime || '5 min'}
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <time className="text-xs text-gray-500">
                          {new Date(article.publishedAt || '').toLocaleDateString('fr-FR')}
                        </time>
                        
                        <span className="flex items-center gap-1 text-blue-400 text-sm group-hover:translate-x-1 transition-transform">
                          Lire
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
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
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              <span>Découvrir tous les articles</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="mt-4 text-gray-500 text-sm">
              Plus de 500 articles pour nourrir votre ambition
            </p>
          </motion.div>
        </div>

        <style>{`
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </section>
    </ErrorBoundary>
  );
};

export default HeroSection;