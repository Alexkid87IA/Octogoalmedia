import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Headphones,
  Mic,
  Radio,
  Clock,
  Calendar,
  TrendingUp,
  Star,
  Share2,
  ChevronRight,
  Filter,
  Search,
  Volume2,
  BarChart3,
  Users,
  Sparkles,
  Hash,
  X,
  ArrowRight,
  Eye,
  Heart,
  Zap,
  Activity,
  Wifi,
  Award,
  Download,
  Bell
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { getAllEmissions } from '../utils/sanityAPI';

// Types
interface Episode {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  date: string;
  category: string;
  guest?: string;
  guestTitle?: string;
  listens: number;
  likes: number;
  audioUrl?: string;
  videoUrl?: string;
  featured?: boolean;
}

// Catégories avec leurs styles
const categoryConfig = {
  entrepreneuriat: {
    label: 'Entrepreneuriat',
    gradient: 'from-blue-400 to-cyan-500',
    icon: TrendingUp,
    glow: 'shadow-blue-500/25'
  },
  leadership: {
    label: 'Leadership',
    gradient: 'from-purple-400 to-violet-500',
    icon: Users,
    glow: 'shadow-purple-500/25'
  },
  innovation: {
    label: 'Innovation',
    gradient: 'from-green-400 to-emerald-500',
    icon: Sparkles,
    glow: 'shadow-emerald-500/25'
  },
  mindset: {
    label: 'Mindset',
    gradient: 'from-orange-400 to-red-500',
    icon: Hash,
    glow: 'shadow-orange-500/25'
  },
  general: {
    label: 'Général',
    gradient: 'from-gray-400 to-gray-500',
    icon: Radio,
    glow: 'shadow-gray-500/25'
  }
};

export const EmissionsPage = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'duration'>('recent');
  const [likedEpisodes, setLikedEpisodes] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [hoveredEpisode, setHoveredEpisode] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const episodesPerPage = 9;

  // Générer des épisodes de démonstration
  const generateMockEpisodes = (): Episode[] => {
    const allEpisodes = [
      {
        id: '1',
        slug: 'de-0-a-10m-en-2-ans',
        title: "De 0 à 10M€ en 2 ans : L'histoire incroyable de TechCorp",
        description: "Dans cet épisode exceptionnel, découvrez comment Jean Dupont a transformé une simple idée en empire tech valorisé à plusieurs millions. Une conversation sans filtre sur les défis, les échecs et les victoires.",
        thumbnail: 'https://picsum.photos/800/600?random=1',
        duration: '48:32',
        date: '2024-03-15',
        category: 'entrepreneuriat',
        guest: 'Jean Dupont',
        guestTitle: 'CEO & Fondateur de TechCorp',
        listens: 15420,
        likes: 892,
        featured: true
      },
      {
        id: '2',
        slug: 'leadership-2-0',
        title: "Leadership 2.0 : Comment diriger dans l'ère de l'IA",
        description: "Marie Laurent partage ses insights sur le leadership moderne et comment adapter son style de management à l'ère de l'intelligence artificielle.",
        thumbnail: 'https://picsum.photos/800/600?random=2',
        duration: '35:18',
        date: '2024-03-12',
        category: 'leadership',
        guest: 'Marie Laurent',
        guestTitle: 'VP Engineering chez Google',
        listens: 8932,
        likes: 445
      },
      {
        id: '3',
        slug: 'mindset-de-champion',
        title: "Mindset de champion : Les secrets des entrepreneurs qui réussissent",
        description: "Une plongée profonde dans la psychologie du succès avec le coach mental des plus grands entrepreneurs français.",
        thumbnail: 'https://picsum.photos/800/600?random=3',
        duration: '42:15',
        date: '2024-03-10',
        category: 'mindset',
        guest: 'Paul Martin',
        guestTitle: 'Coach mental & Auteur bestseller',
        listens: 12543,
        likes: 723
      }
    ];

    // Ajouter plus d'épisodes pour la démo
    for (let i = 4; i <= 20; i++) {
      allEpisodes.push({
        id: i.toString(),
        slug: `episode-${i}`,
        title: `Episode ${i} : ${['Stratégie de croissance', 'Innovation tech', 'Leadership inspirant', 'Mindset gagnant'][i % 4]}`,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        thumbnail: `https://picsum.photos/800/600?random=${i}`,
        duration: `${30 + (i % 30)}:${String((i * 7) % 60).padStart(2, '0')}`,
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        category: ['entrepreneuriat', 'leadership', 'innovation', 'mindset'][i % 4],
        guest: `Invité ${i}`,
        guestTitle: `Expert en ${['Business', 'Tech', 'Management', 'Growth'][i % 4]}`,
        listens: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 1000) + 100
      });
    }

    return allEpisodes;
  };

  useEffect(() => {
    const fetchEmissions = async () => {
      try {
        setIsLoading(true);
        const emissions = await getAllEmissions();
        
        if (emissions && Array.isArray(emissions) && emissions.length > 0) {
          const formattedEpisodes = emissions.map((emission: any, index: number) => ({
            id: emission._id,
            slug: emission.slug || emission._id,
            title: emission.title || 'Sans titre',
            description: emission.description || '',
            thumbnail: emission.thumbnail || `https://picsum.photos/800/600?random=${index}`,
            duration: emission.duration || '00:00',
            date: emission.publishedAt || new Date().toISOString(),
            category: emission.category || 'general',
            guest: emission.guest?.name || emission.guest || null,
            guestTitle: emission.guest?.title || null,
            listens: typeof emission.listens === 'number' ? emission.listens : 0,
            likes: typeof emission.likes === 'number' ? emission.likes : 0,
            audioUrl: emission.audioUrl || null,
            videoUrl: emission.videoUrl || emission.videoUrlExternal || null,
            featured: Boolean(emission.featured)
          }));
          setEpisodes(formattedEpisodes);
        } else {
          setEpisodes(generateMockEpisodes());
        }
      } catch (error) {
        console.error('Erreur:', error);
        setEpisodes(generateMockEpisodes());
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmissions();
    
    const saved = localStorage.getItem('likedEpisodes');
    if (saved) {
      try {
        setLikedEpisodes(JSON.parse(saved));
      } catch (e) {
        setLikedEpisodes([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('likedEpisodes', JSON.stringify(likedEpisodes));
  }, [likedEpisodes]);

  const handleLike = (episodeId: string) => {
    setLikedEpisodes(prev =>
      prev.includes(episodeId)
        ? prev.filter(id => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  const handlePlay = (episodeId: string) => {
    setIsPlaying(isPlaying === episodeId ? null : episodeId);
  };

  // Episode featured
  const featuredEpisode = episodes.find(e => e.featured) || episodes[0] || null;

  // Filtrage et tri
  const filteredEpisodes = episodes
    .filter(episode => {
      const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           episode.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (episode.guest && episode.guest.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || episode.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'popular':
          return b.listens - a.listens;
        case 'duration':
          const aDuration = parseInt(a.duration.split(':')[0]) * 60 + parseInt(a.duration.split(':')[1]);
          const bDuration = parseInt(b.duration.split(':')[0]) * 60 + parseInt(b.duration.split(':')[1]);
          return bDuration - aDuration;
        default:
          return 0;
      }
    });

  // Episodes paginés (sans le featured)
  const nonFeaturedEpisodes = filteredEpisodes.filter(e => !e.featured);
  const paginatedEpisodes = nonFeaturedEpisodes.slice(0, page * episodesPerPage);
  const hasMoreEpisodes = paginatedEpisodes.length < nonFeaturedEpisodes.length;

  const loadMoreEpisodes = () => {
    setPage(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Podcasts | Octogoal Media"
        description="Écoutez les conversations les plus inspirantes avec les entrepreneurs et leaders qui façonnent le monde de demain."
      />

      <div className="min-h-screen bg-black">
        {/* Hero Section Premium avec Waveform */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background avec effets sonores */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
            
            {/* Gradient mesh audio-themed */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-[150px] animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/20 via-cyan-600/20 to-blue-600/20 rounded-full blur-[150px] animate-pulse" />
            </div>

            {/* Waveform animé */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="flex items-center gap-1">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full"
                    animate={{
                      height: [20, 60 + Math.random() * 40, 20],
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.02,
                      ease: "easeInOut"
                    }}
                    style={{ height: 20 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              {/* Badge animé */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full mb-8 border border-blue-500/30"
              >
                <Wifi className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                  On Air • Nouveaux épisodes chaque semaine
                </span>
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              </motion.div>

              {/* Titre avec animation */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6">
                <span className="text-white">Les voix qui </span>
                <br />
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  transforment le game
                </motion.span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                Conversations sans filtre avec les entrepreneurs et visionnaires qui redéfinissent les règles
              </p>
            </motion.div>

            {/* Stats animées */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '50+', label: 'Épisodes', icon: Mic, color: 'from-blue-400 to-cyan-500' },
                { value: '100K+', label: 'Écoutes', icon: Headphones, color: 'from-purple-400 to-violet-500' },
                { value: '4.9', label: 'Note moyenne', icon: Star, color: 'from-yellow-400 to-orange-500' },
                { value: '2x/sem', label: 'Nouveautés', icon: Bell, color: 'from-green-400 to-emerald-500' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`} />
                    <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Episode avec design premium */}
        {featuredEpisode && (
          <section className="relative py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-3xl blur-3xl" />
                
                {/* Content */}
                <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/10 rounded-3xl overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Visual */}
                    <div className="relative h-[400px] lg:h-auto">
                      <Link to={`/emission/${featuredEpisode.slug}`}>
                        <div className="absolute inset-0 group cursor-pointer">
                          {featuredEpisode.thumbnail ? (
                            <img
                              src={featuredEpisode.thumbnail}
                              alt={featuredEpisode.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
                              <Radio className="w-20 h-20 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                          
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 group-hover:bg-white/20 transition-all"
                            >
                              <Play className="w-8 h-8 text-white ml-1" />
                            </motion.div>
                          </div>
                          
                          {/* Badge "À la une" */}
                          <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              À la une
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Content */}
                    <div className="p-12">
                      <div className="mb-6">
                        <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${categoryConfig[featuredEpisode.category as keyof typeof categoryConfig]?.gradient || categoryConfig.general.gradient} rounded-full mb-4`}>
                          {categoryConfig[featuredEpisode.category as keyof typeof categoryConfig]?.label || 'Général'}
                        </span>
                        
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                          {featuredEpisode.title}
                        </h2>
                        
                        <p className="text-gray-300 text-lg mb-6">
                          {featuredEpisode.description}
                        </p>
                      </div>

                      {/* Guest info avec style premium */}
                      {featuredEpisode.guest && (
                        <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <Mic className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{featuredEpisode.guest}</h3>
                            {featuredEpisode.guestTitle && (
                              <p className="text-gray-400">{featuredEpisode.guestTitle}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Meta info avec icônes */}
                      <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
                        <span className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4 text-blue-400" />
                          {featuredEpisode.duration}
                        </span>
                        <span className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          {new Date(featuredEpisode.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-2 text-gray-400">
                          <Headphones className="w-4 h-4 text-cyan-400" />
                          {featuredEpisode.listens.toLocaleString()} écoutes
                        </span>
                        <span className="flex items-center gap-2 text-gray-400">
                          <Heart className="w-4 h-4 text-red-400" />
                          {featuredEpisode.likes} likes
                        </span>
                      </div>

                      {/* CTA buttons */}
                      <div className="flex flex-wrap gap-4">
                        <Link
                          to={`/emission/${featuredEpisode.slug}`}
                          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
                        >
                          <Headphones className="w-5 h-5" />
                          Écouter maintenant
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLike(featuredEpisode.id)}
                          className={`p-4 rounded-full transition-all ${
                            likedEpisodes.includes(featuredEpisode.id)
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-white/10 text-gray-400 border border-white/20 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${likedEpisodes.includes(featuredEpisode.id) ? 'fill-current' : ''}`} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-4 bg-white/10 rounded-full text-gray-400 border border-white/20 hover:text-white transition-all"
                        >
                          <Share2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Filters avec design glassmorphism */}
        <section className="sticky top-20 z-30 bg-black/60 backdrop-blur-2xl border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search avec effet glow */}
              <div className="relative flex-1 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un épisode, un invité..."
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-black/80 transition-all"
                  />
                </div>
              </div>

              {/* Category Filter avec style premium */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-6 py-4 rounded-xl font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Tous
                </button>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-6 py-4 rounded-xl font-medium transition-all ${
                      selectedCategory === key
                        ? `bg-gradient-to-r ${config.gradient} text-white`
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>

              {/* Sort avec icônes */}
              <div className="flex gap-2">
                {[
                  { value: 'recent', icon: Clock, label: 'Récents' },
                  { value: 'popular', icon: TrendingUp, label: 'Populaires' },
                  { value: 'duration', icon: BarChart3, label: 'Durée' }
                ].map(sort => (
                  <button
                    key={sort.value}
                    onClick={() => setSortBy(sort.value as any)}
                    className={`px-6 py-4 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      sortBy === sort.value
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <sort.icon className="w-4 h-4" />
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Episodes Grid avec cards premium */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tous les épisodes
            </h2>
            <p className="text-xl text-gray-400">
              {nonFeaturedEpisodes.length} conversations disponibles
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {paginatedEpisodes.map((episode, index) => {
                const isLiked = likedEpisodes.includes(episode.id);
                const categoryStyle = categoryConfig[episode.category as keyof typeof categoryConfig] || categoryConfig.general;
                const isCurrentlyPlaying = isPlaying === episode.id;
                
                return (
                  <motion.article
                    key={episode.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredEpisode(episode.id)}
                    onMouseLeave={() => setHoveredEpisode(null)}
                    className="group relative"
                  >
                    {/* Glow effect on hover */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${categoryStyle.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity`} />
                    
                    <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all">
                      {/* Thumbnail avec overlay */}
                      <Link to={`/emission/${episode.slug}`}>
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                          {episode.thumbnail ? (
                            <img
                              src={episode.thumbnail}
                              alt={episode.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Radio className="w-12 h-12 text-white/20" />
                            </div>
                          )}
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
                          
                          {/* Play button on hover */}
                          <AnimatePresence>
                            {hoveredEpisode === episode.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                                  <Play className="w-6 h-6 text-white ml-1" />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Duration badge */}
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                              {episode.duration}
                            </span>
                          </div>
                          
                          {/* Category badge */}
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${categoryStyle.gradient} rounded-full`}>
                              {categoryStyle.label}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6">
                        <Link to={`/emission/${episode.slug}`}>
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                            {episode.title}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {episode.description}
                        </p>

                        {/* Guest */}
                        {episode.guest && (
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                              <Mic className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-medium truncate">{episode.guest}</div>
                              {episode.guestTitle && (
                                <div className="text-xs text-gray-500 truncate">{episode.guestTitle}</div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Footer avec stats et actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {episode.listens.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {episode.likes}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePlay(episode.id);
                              }}
                              className={`p-2 rounded-lg transition-all ${
                                isCurrentlyPlaying
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                  : 'bg-white/10 text-gray-400 hover:text-white'
                              }`}
                            >
                              {isCurrentlyPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleLike(episode.id);
                              }}
                              className={`p-2 rounded-lg transition-all ${
                                isLiked
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-white/10 text-gray-400 hover:text-white'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {paginatedEpisodes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Volume2 className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <p className="text-2xl text-gray-400 font-medium mb-2">
                Aucun épisode trouvé
              </p>
              <p className="text-gray-500">
                Essayez de modifier vos filtres de recherche
              </p>
            </motion.div>
          )}

          {/* Load more avec animation */}
          {hasMoreEpisodes && paginatedEpisodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMoreEpisodes}
                className="group relative px-8 py-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative flex items-center gap-3 px-8 py-4 bg-black/80 backdrop-blur-sm text-white font-bold rounded-full border border-white/20">
                  <span>Charger plus d'épisodes</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  <span className="text-sm opacity-60">
                    ({nonFeaturedEpisodes.length - paginatedEpisodes.length} restants)
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Animated border */}
              <div className="absolute -inset-[2px] rounded-3xl opacity-80">
                <div 
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradient-x 3s ease infinite'
                  }}
                />
              </div>
              
              <div className="relative bg-black/90 backdrop-blur-2xl rounded-3xl p-12 text-center">
                <Bell className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ne manquez aucun épisode
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Recevez les nouveaux épisodes directement dans votre boîte mail et accédez à du contenu exclusif
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="flex-1 px-6 py-4 bg-white/5 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
                  >
                    S'abonner
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Styles pour animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </>
  );
};

export default EmissionsPage;