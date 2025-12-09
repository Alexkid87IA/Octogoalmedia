import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Eye,
  Bookmark,
  BookmarkCheck,
  Grid3X3,
  List,
  Calendar,
  User,
  Hash,
  Sparkles,
  X,
  ChevronDown,
  ArrowRight,
  BarChart3,
  Users,
  FileText,
  Award
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Footer } from '../components/layout/Footer';
import SafeImage from '../components/common/SafeImage';
import { getAllArticles } from '../utils/sanityAPI'; // Import direct
import { SanityArticle } from '../types/sanity';
import { Link } from 'react-router-dom';

// Configuration des catégories avec leurs couleurs
const categoryStyles = {
  story: { gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  business: { gradient: 'from-blue-400 to-cyan-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  mental: { gradient: 'from-purple-400 to-violet-500', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  society: { gradient: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  all: { gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-500/10', text: 'text-gray-400' }
};

// Topics populaires - Extraits automatiquement des titres et contenus
const generateTopicsFromArticles = (articles: SanityArticle[]) => {
  // Mots-clés à rechercher dans les articles
  const topicKeywords = {
    'Entrepreneuriat': ['entrepreneur', 'startup', 'créer', 'fonder', 'business', 'entreprise'],
    'Leadership': ['leader', 'diriger', 'management', 'équipe', 'manager', 'CEO'],
    'Innovation': ['innov', 'tech', 'IA', 'digital', 'transform', 'futur'],
    'Mindset': ['mindset', 'mental', 'pensée', 'motivation', 'confiance', 'développement personnel'],
    'Stratégie': ['stratég', 'plan', 'méthode', 'tactique', 'approche', 'process'],
    'Growth': ['growth', 'croissance', 'scale', 'développ', 'expansion', 'lever']
  };

  const topicCounts: Record<string, number> = {};

  // Compter les occurrences de chaque topic dans les articles
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    let count = 0;
    articles.forEach(article => {
      const searchText = `${article.title} ${article.excerpt || ''}`.toLowerCase();
      const hasKeyword = keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
      if (hasKeyword) count++;
    });
    topicCounts[topic] = count;
  });

  // Convertir en array et trier par popularité
  return Object.entries(topicCounts)
    .map(([name, count]) => ({
      name,
      count,
      icon: {
        'Entrepreneuriat': TrendingUp,
        'Leadership': Users,
        'Innovation': Sparkles,
        'Mindset': Hash,
        'Stratégie': BarChart3,
        'Growth': TrendingUp
      }[name] || Hash
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Garder les 6 plus populaires
};

// Fonction pour générer des articles mock
const generateMockArticles = (): SanityArticle[] => {
  const titles = [
    "Comment j'ai transformé mon échec en opportunité millionnaire",
    "Les 5 stratégies pour lever 1M€ en 2024",
    "De 0 à 100k followers : ma méthode en 30 jours",
    "Pourquoi j'ai quitté Google pour créer ma startup",
    "Le mindset qui m'a permis de x10 mon chiffre d'affaires",
    "L'IA au service de votre croissance : guide complet"
  ];

  return titles.map((title, i) => ({
    _id: `mock-${i}`,
    title,
    slug: { _type: "slug", current: `article-${i}` },
    mainImage: {
      _type: "image",
      asset: {
        _ref: `https://picsum.photos/800/600?random=${i}`,
        _type: "reference"
      }
    },
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
    categories: [{
      _id: 'cat1',
      title: ['Story', 'Business', 'Mental', 'Society'][i % 4],
      slug: { current: ['story', 'business', 'mental', 'society'][i % 4] }
    }],
    author: {
      _id: 'author1',
      name: `Auteur ${i + 1}`,
      slug: { current: `author-${i}` }
    },
    readingTime: Math.floor(Math.random() * 10) + 3
  }));
};

export const AllArticlesPage = () => {
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'popular' | 'reading-time'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [popularTopics, setPopularTopics] = useState<Array<{name: string, count: number, icon: any}>>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Récupérer les articles depuis Sanity
        const sanityArticles = await getAllArticles();
        
        if (sanityArticles && sanityArticles.length > 0) {
          console.log(`✅ ${sanityArticles.length} articles récupérés depuis Sanity`);
          setArticles(sanityArticles);
          // Générer les topics à partir des articles récupérés
          setPopularTopics(generateTopicsFromArticles(sanityArticles));
        } else {
          console.log('⚠️ Aucun article depuis Sanity, utilisation des données de démonstration');
          // Articles de démonstration
          const mockArticles = generateMockArticles();
          setArticles(mockArticles);
          // Générer les topics à partir des articles mock
          setPopularTopics(generateTopicsFromArticles(mockArticles));
        }
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des articles.');
        console.error('❌ Erreur:', err);
        // En cas d'erreur, utiliser les données de démonstration
        const mockArticles = generateMockArticles();
        setArticles(mockArticles);
        setPopularTopics(generateTopicsFromArticles(mockArticles));
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
    
    // Charger les bookmarks depuis localStorage
    const saved = localStorage.getItem('bookmarkedArticles');
    if (saved) {
      setBookmarkedArticles(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder les bookmarks dans localStorage
  useEffect(() => {
    localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
  }, [bookmarkedArticles]);

  const handleBookmark = (slug: string) => {
    setBookmarkedArticles(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  // Filtrage et tri des articles
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // Filtrer par bookmarks
    if (showBookmarksOnly) {
      filtered = filtered.filter(article => 
        bookmarkedArticles.includes(article.slug?.current || '')
      );
    }

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article =>
        article.categories?.some(cat => cat.slug?.current === selectedCategory)
      );
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(article => {
        const search = searchTerm.toLowerCase();
        return article.title.toLowerCase().includes(search) ||
               article.excerpt?.toLowerCase().includes(search) ||
               article.author?.name?.toLowerCase().includes(search);
      });
    }

    // Filtrer par topic
    if (selectedTopic) {
      // Chercher le topic dans le titre ET l'excerpt avec les mots-clés associés
      const topicKeywords = {
        'Entrepreneuriat': ['entrepreneur', 'startup', 'créer', 'fonder', 'business', 'entreprise'],
        'Leadership': ['leader', 'diriger', 'management', 'équipe', 'manager', 'CEO'],
        'Innovation': ['innov', 'tech', 'IA', 'digital', 'transform', 'futur'],
        'Mindset': ['mindset', 'mental', 'pensée', 'motivation', 'confiance', 'développement personnel'],
        'Stratégie': ['stratég', 'plan', 'méthode', 'tactique', 'approche', 'process'],
        'Growth': ['growth', 'croissance', 'scale', 'développ', 'expansion', 'lever']
      };
      
      const keywords = topicKeywords[selectedTopic as keyof typeof topicKeywords] || [selectedTopic.toLowerCase()];
      filtered = filtered.filter(article => {
        const searchText = `${article.title} ${article.excerpt || ''}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
      });
    }

    // Trier
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'popular':
          // Simulé - en production, utiliser les vraies stats
          return Math.random() - 0.5;
        case 'reading-time':
          return (a.readingTime || 5) - (b.readingTime || 5);
        default:
          return 0;
      }
    });
  }, [articles, selectedCategory, searchTerm, sortBy, showBookmarksOnly, bookmarkedArticles, selectedTopic]);

  // Stats
  const stats = {
    total: articles.length,
    thisWeek: articles.filter(a => 
      new Date(a.publishedAt) > new Date(Date.now() - 7 * 86400000)
    ).length,
    authors: new Set(articles.map(a => a.author?._id)).size,
    categories: new Set(articles.flatMap(a => a.categories?.map(c => c._id) || [])).size
  };

  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Tous les articles | Octogoal Media"
        description="Explorez notre collection complète d'articles sur l'entrepreneuriat, l'innovation et le développement personnel."
      />
      
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent_50%)]" />
            
            {/* Animated orbs */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-96 h-96 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${['rgba(59,130,246,0.3)', 'rgba(168,85,247,0.3)', 'rgba(236,72,153,0.3)'][i]}, transparent)`,
                  filter: 'blur(40px)',
                  left: `${i * 30}%`,
                  top: `${i * 20}%`,
                }}
                animate={{
                  x: [0, 50, 0],
                  y: [0, -50, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  {stats.total} articles disponibles
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Explorez nos articles
                </span>
              </h1>

              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                Découvrez des insights exclusifs, des stratégies actionnables et des histoires inspirantes 
                pour transformer votre vision du possible.
              </p>

              {/* Stats rapides */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <FileText className="w-6 h-6 text-blue-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-xs text-gray-400">Articles totaux</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.thisWeek}</div>
                  <div className="text-xs text-gray-400">Cette semaine</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <Users className="w-6 h-6 text-purple-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.authors}</div>
                  <div className="text-xs text-gray-400">Auteurs</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <Award className="w-6 h-6 text-yellow-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.categories}</div>
                  <div className="text-xs text-gray-400">Catégories</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Topics populaires */}
        <section className="py-12 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Topics populaires</h2>
              {selectedTopic && (
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  Réinitialiser
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {popularTopics.map((topic, index) => {
                const Icon = topic.icon;
                const isSelected = selectedTopic === topic.name;
                
                return (
                  <motion.button
                    key={topic.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTopic(isSelected ? null : topic.name)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full border transition-all
                      ${isSelected 
                        ? 'bg-white/10 border-white/30 text-white' 
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-xs opacity-60">({topic.count})</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filters & Controls - Non sticky */}
        <section className="bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un article, un auteur..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20 appearance-none cursor-pointer"
                >
                  <option value="all">Toutes catégories</option>
                  <option value="story">Story</option>
                  <option value="business">Business</option>
                  <option value="mental">Mental</option>
                  <option value="society">Society</option>
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20 appearance-none cursor-pointer"
              >
                <option value="date">Plus récents</option>
                <option value="popular">Plus populaires</option>
                <option value="reading-time">Temps de lecture</option>
              </select>

              {/* Bookmarks Toggle */}
              <button
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl border transition-all
                  ${showBookmarksOnly 
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                  }
                `}
              >
                <BookmarkCheck className="w-5 h-5" />
                <span className="hidden sm:inline">Favoris ({bookmarkedArticles.length})</span>
              </button>

              {/* View Mode */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid" 
                      ? "bg-white/10 text-white" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list" 
                      ? "bg-white/10 text-white" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid/List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredAndSortedArticles.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                    : "space-y-6"
                }
              >
                {filteredAndSortedArticles.map((article, index) => {
                  const categorySlug = article.categories?.[0]?.slug?.current || 'all';
                  const style = categoryStyles[categorySlug as keyof typeof categoryStyles] || categoryStyles.all;
                  const isBookmarked = bookmarkedArticles.includes(article.slug?.current || '');

                  return (
                    <motion.article
                      key={article._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      {viewMode === "grid" ? (
                        // Card View
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                          {/* Bookmark Button */}
                          <button
                            onClick={() => handleBookmark(article.slug?.current || '')}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all"
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-5 h-5 text-yellow-400" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-white" />
                            )}
                          </button>

                          <Link to={`/article/${article.slug?.current}`}>
                            {/* Image */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <SafeImage
                                source={article.mainImage}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                fallbackText={article.title}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                              
                              {/* Category badge */}
                              {article.categories?.[0] && (
                                <div className="absolute bottom-4 left-4">
                                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${style.gradient} rounded-full`}>
                                    {article.categories[0].title}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                                {article.title}
                              </h3>
                              
                              {article.excerpt && (
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                  {article.excerpt}
                                </p>
                              )}

                              {/* Meta */}
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-3">
                                  {article.author && (
                                    <span className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      {article.author.name}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {article.readingTime || 5} min
                                  </span>
                                </div>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      ) : (
                        // List View
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 p-6">
                          <Link to={`/article/${article.slug?.current}`}>
                            <div className="flex gap-6">
                              {/* Image */}
                              <div className="flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden">
                                <SafeImage
                                  source={article.mainImage}
                                  alt={article.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  fallbackText={article.title}
                                />
                              </div>

                              {/* Content */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    {article.categories?.[0] && (
                                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${style.gradient} rounded-full`}>
                                        {article.categories[0].title}
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-500">
                                      {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                  
                                  {/* Bookmark */}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleBookmark(article.slug?.current || '');
                                    }}
                                    className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all"
                                  >
                                    {isBookmarked ? (
                                      <BookmarkCheck className="w-5 h-5 text-yellow-400" />
                                    ) : (
                                      <Bookmark className="w-5 h-5 text-white" />
                                    )}
                                  </button>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                                  {article.title}
                                </h3>
                                
                                {article.excerpt && (
                                  <p className="text-gray-400 mb-4 line-clamp-2">
                                    {article.excerpt}
                                  </p>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    {article.author && (
                                      <span className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {article.author.name}
                                      </span>
                                    )}
                                    <span className="flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      {article.readingTime || 5} min de lecture
                                    </span>
                                    <span className="flex items-center gap-2">
                                      <Eye className="w-4 h-4" />
                                      {Math.floor(Math.random() * 5000) + 1000} vues
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-white">
                                    <span>Lire l'article</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </motion.article>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">
                {searchTerm || selectedCategory !== 'all' || showBookmarksOnly || selectedTopic
                  ? "Aucun article ne correspond à vos critères"
                  : "Aucun article disponible"}
              </p>
              {(searchTerm || selectedCategory !== 'all' || showBookmarksOnly || selectedTopic) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setShowBookmarksOnly(false);
                    setSelectedTopic(null);
                  }}
                  className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </motion.div>
          )}
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default AllArticlesPage;