import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Bell, Search, ArrowRight, Clock, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useData } from '../../context/DataContext';

// Import du logo Octogoal
import logoMedia from '../../assets/logos/LOGO_OCTOGOAL.png';

export const ResponsiveNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewArticles, setHasNewArticles] = useState(false);
  const location = useLocation();
  const { visible } = useScrollDirection();
  const { scrollY } = useScroll();
  
  // Récupération des vrais articles depuis le contexte
  const { recentArticles, featuredArticles } = useData();
  
  // Effet de transparence basé sur le scroll
  const navbarBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.95)']
  );

  // Vérifier s'il y a de nouveaux articles (moins de 24h)
  useEffect(() => {
    const allArticles = [...(recentArticles || []), ...(featuredArticles || [])];
    
    if (allArticles.length > 0) {
      const hasNew = allArticles.some(article => {
        if (!article.publishedAt) return false;
        const publishDate = new Date(article.publishedAt);
        const now = new Date();
        const diffHours = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60);
        return diffHours < 24;
      });
      setHasNewArticles(hasNew);
    }
  }, [recentArticles, featuredArticles]);

  // Fonction pour formater le temps
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const publishDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return publishDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Couleurs des catégories OCTOGOAL
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Actus': 'bg-pink-500',
      'Matchs': 'bg-blue-500',
      'Clubs': 'bg-purple-500',
      'Joueurs': 'bg-emerald-500',
      'Formats Octogoal': 'bg-orange-500',
      'Vidéos': 'bg-red-500',
      'Mèmes': 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  // Obtenir les 3 articles les plus récents pour les notifications
  const getNotificationArticles = () => {
    const allArticles = [...(recentArticles || []), ...(featuredArticles || [])];
    
    const sortedArticles = allArticles
      .filter(article => article.publishedAt)
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
    
    // Données mockées football si pas d'articles
    if (sortedArticles.length === 0) {
      return [
        {
          _id: '1',
          title: "PSG-OM : Les notes du Classico",
          slug: { current: 'psg-om-notes' },
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          categories: [{ title: 'Matchs' }]
        },
        {
          _id: '2',
          title: "Mbappé : Ses stats folles au Real Madrid",
          slug: { current: 'mbappe-stats-real' },
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          categories: [{ title: 'Joueurs' }]
        },
        {
          _id: '3',
          title: "Mercato : Les pistes chaudes de janvier",
          slug: { current: 'mercato-janvier' },
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          categories: [{ title: 'Actus' }]
        }
      ];
    }
    
    return sortedArticles;
  };

  // Navigation OCTOGOAL avec sous-catégories
  const menuItems = [
    { 
      label: 'Actus', 
      path: '/rubrique/actus', 
      slug: 'actus',
      color: 'pink',
      subcategories: [
        { label: 'Ligue 1', path: '/rubrique/actus/ligue-1' },
        { label: 'Premier League', path: '/rubrique/actus/premier-league' },
        { label: 'Liga', path: '/rubrique/actus/liga' },
        { label: 'Champions League', path: '/rubrique/actus/champions-league' },
        { label: 'Mercato', path: '/rubrique/actus/mercato' }
      ]
    },
    { 
      label: 'Matchs', 
      path: '/rubrique/matchs', 
      slug: 'matchs',
      color: 'blue',
      subcategories: [
        { label: 'Résultats', path: '/rubrique/matchs/resultats' },
        { label: 'Classements', path: '/rubrique/matchs/classements' },
        { label: 'Avant-match', path: '/rubrique/matchs/avant-match' },
        { label: 'Après-match', path: '/rubrique/matchs/apres-match' },
        { label: 'Notes du match', path: '/rubrique/matchs/notes-match' }
      ]
    },
    { 
      label: 'Clubs', 
      path: '/rubrique/clubs', 
      slug: 'clubs',
      color: 'purple',
      subcategories: [
        { label: 'Clubs Ligue 1', path: '/rubrique/clubs/clubs-ligue-1' },
        { label: 'Clubs Premier League', path: '/rubrique/clubs/clubs-pl' },
        { label: 'Clubs Liga', path: '/rubrique/clubs/clubs-liga' },
        { label: 'Clubs Serie A', path: '/rubrique/clubs/clubs-serie-a' },
        { label: 'Clubs Bundesliga', path: '/rubrique/clubs/clubs-bundesliga' }
      ]
    },
    { 
      label: 'Joueurs', 
      path: '/rubrique/joueurs', 
      slug: 'joueurs',
      color: 'emerald',
      subcategories: [
        { label: 'Tops joueurs', path: '/rubrique/joueurs/tops-joueurs' },
        { label: 'Joueurs en forme', path: '/rubrique/joueurs/joueurs-en-forme' },
        { label: 'Joueurs légendaires', path: '/rubrique/joueurs/joueurs-legendaires' },
        { label: 'Fiches joueurs', path: '/rubrique/joueurs/fiches-joueurs' },
        { label: 'Joueurs sous-cotés', path: '/rubrique/joueurs/joueurs-sous-cotes' }
      ]
    },
    { 
      label: 'Formats', 
      path: '/rubrique/formats-octogoal', 
      slug: 'formats-octogoal',
      color: 'orange',
      subcategories: [
        { label: 'Tops & listes', path: '/rubrique/formats-octogoal/tops-listes' },
        { label: 'Moments viraux', path: '/rubrique/formats-octogoal/moments-viraux' },
        { label: 'Le joueur du jour', path: '/rubrique/formats-octogoal/joueur-du-jour' },
        { label: 'Débats', path: '/rubrique/formats-octogoal/debats-reactions' },
        { label: 'Humour', path: '/rubrique/formats-octogoal/humour-punchlines' }
      ]
    },
    { 
      label: 'Mèmes', 
      path: '/rubrique/memes', 
      slug: 'memes',
      color: 'yellow',
      subcategories: [
        { label: 'Réactions', path: '/rubrique/memes/reactions' },
        { label: 'Captures virales', path: '/rubrique/memes/captures-virales' },
        { label: 'Mèmes Octogoal', path: '/rubrique/memes/memes-octogoal' },
        { label: 'La tête de Momo', path: '/rubrique/memes/tete-de-momo' },
        { label: 'Culture foot', path: '/rubrique/memes/culture-foot-internet' }
      ]
    }
  ];

  // MODIFIÉ : Football remplace Vidéos (même nombre d'éléments = centrage préservé)
  const specialItems = [
    { 
      label: 'Football', 
      path: '/football',
      isLive: true  // Nouveau flag pour identifier le lien actif
    },
    { 
      label: 'Émissions', 
      path: '/emissions'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getGradientByColor = (color: string) => {
    const gradients: { [key: string]: string } = {
      pink: 'from-pink-500 to-rose-500',
      blue: 'from-blue-400 to-cyan-500',
      purple: 'from-purple-400 to-violet-500',
      emerald: 'from-emerald-400 to-teal-500',
      orange: 'from-orange-400 to-amber-500',
      yellow: 'from-yellow-400 to-orange-500'
    };
    return gradients[color] || gradients.pink;
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const notificationArticles = getNotificationArticles();

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: (!isMobile && !visible && !isOpen) ? -120 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0"
        style={{ 
          backgroundColor: navbarBackground as any,
          zIndex: 9999,
          position: 'fixed',
          width: '100%',
          top: 0,
          left: 0,
          right: 0
        }}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        {/* Effet de blur premium */}
        <div className="absolute inset-0 backdrop-blur-2xl" />
        
        {/* Ligne de gradient en haut - couleurs Octogoal */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
        
        {/* Contenu principal */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-20" style={{ width: '100%' }}>
              {/* Logo */}
              <Link 
                to="/" 
                className="relative group z-20 flex-shrink-0 flex items-center"
                style={{ minWidth: 'auto', maxWidth: '200px' }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-pink-500/20 blur-2xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={logoMedia}
                    alt="Octogoal Media"
                    className="h-10 md:h-12 w-auto relative z-10 filter group-hover:brightness-125 transition-all duration-300" 
                  />
                </motion.div>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center flex-1 justify-center px-8">
                <div className="flex items-center space-x-1 relative">
                  {/* Menu principal */}
                  {menuItems.map((item) => {
                    const isActive = location.pathname.includes(item.slug);
                    const gradient = getGradientByColor(item.color);

                    return (
                      <div
                        key={item.slug}
                        className="relative"
                        onMouseEnter={() => setActiveDropdown(item.slug)}
                      >
                        <Link
                          to={item.path}
                          className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-1 group ${
                            isActive
                              ? 'text-white'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                            activeDropdown === item.slug ? 'rotate-180' : ''
                          }`} />

                          {isActive && (
                            <motion.div
                              layoutId="navbar-active"
                              className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient}`}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </Link>
                      </div>
                    );
                  })}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {activeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full mt-8 w-[480px] left-0"
                      >
                        {(() => {
                          const item = menuItems.find(m => m.slug === activeDropdown);
                          if (!item) return null;
                          const gradient = getGradientByColor(item.color);
                          
                          return (
                            <div className="relative">
                              <div className={`absolute -top-2 left-12 w-4 h-4 bg-gradient-to-br ${gradient} rotate-45 rounded-sm`} />
                              <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-white/20 to-white/5">
                                <div className="bg-black/95 backdrop-blur-2xl rounded-2xl p-6">
                                  <div className="mb-5">
                                    <div className={`text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${gradient} mb-2`}>
                                      Explorer {item.label}
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2">
                                    {item.subcategories.slice(0, 4).map((sub, idx) => (
                                      <Link
                                        key={sub.path}
                                        to={sub.path}
                                        className="group relative"
                                        onClick={() => setActiveDropdown(null)}
                                      >
                                        <motion.div
                                          whileHover={{ scale: 1.02, x: 3 }}
                                          className="relative p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
                                        >
                                          <div className={`absolute top-3 right-3 text-3xl font-black bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
                                            {(idx + 1).toString().padStart(2, '0')}
                                          </div>
                                          <div className="relative z-10">
                                            <h4 className="text-white font-medium text-sm mb-1">
                                              {sub.label}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                              Voir les articles
                                            </p>
                                          </div>
                                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
                                        </motion.div>
                                      </Link>
                                    ))}

                                    {item.subcategories.length === 5 && (
                                      <Link
                                        to={item.subcategories[4].path}
                                        className="group relative col-span-2"
                                        onClick={() => setActiveDropdown(null)}
                                      >
                                        <motion.div
                                          whileHover={{ scale: 1.02, x: 3 }}
                                          className="relative p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
                                        >
                                          <div className={`absolute top-3 right-3 text-3xl font-black bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
                                            05
                                          </div>
                                          <div className="relative z-10">
                                            <h4 className="text-white font-medium text-sm mb-1">
                                              {item.subcategories[4].label}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                              Voir les articles
                                            </p>
                                          </div>
                                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
                                        </motion.div>
                                      </Link>
                                    )}
                                  </div>
                                  
                                  <div className="mt-5 pt-5 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-6">
                                        <div className="text-xs">
                                          <span className="text-gray-500">Articles</span>
                                          <span className="ml-2 font-bold text-white">247</span>
                                        </div>
                                        <div className="text-xs">
                                          <span className="text-gray-500">Cette semaine</span>
                                          <span className="ml-2 font-bold text-pink-400">+18</span>
                                        </div>
                                      </div>
                                      <Link
                                        to={item.path}
                                        onClick={() => setActiveDropdown(null)}
                                        className={`text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r ${gradient} hover:opacity-80 transition-opacity`}
                                      >
                                        Voir tout →
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Séparateur */}
                  <div className="w-px h-6 bg-white/10 mx-2" />

                  {/* Items spéciaux - Football et Émissions */}
                  {specialItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                        location.pathname === item.path
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.isLive && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full">
                          LIVE
                        </span>
                      )}
                      {location.pathname === item.path && (
                        <motion.div
                          layoutId="navbar-special-active"
                          className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r ${item.isLive ? 'from-emerald-500 to-green-500' : 'from-pink-500 to-rose-500'}`}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Actions à droite - Desktop */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                >
                  <Search className="w-4 h-4 text-gray-300" />
                </motion.button>

                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <Bell className="w-4 h-4 text-gray-300" />
                    {hasNewArticles && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse" />
                    )}
                  </motion.button>

                  {/* Dropdown notifications */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-96 z-50"
                      >
                        <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-pink-500/20 to-blue-500/20">
                          <div className="bg-black/95 backdrop-blur-2xl rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-white/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                      Actus chaudes
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    Live
                                  </span>
                                </div>
                                <Zap className="w-4 h-4 text-pink-500" />
                              </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                              {notificationArticles.map((article, index) => (
                                <Link
                                  key={article._id}
                                  to={`/article/${article.slug?.current || article.slug}`}
                                  onClick={() => setShowNotifications(false)}
                                  className="block p-4 hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 text-xs text-gray-500 min-w-[60px]">
                                      {formatTimeAgo(article.publishedAt)}
                                    </div>
                                    
                                    <div className="flex-grow">
                                      {article.categories?.[0] && (
                                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded ${getCategoryColor(article.categories[0].title)} text-white mb-2`}>
                                          {article.categories[0].title}
                                        </span>
                                      )}
                                      
                                      <h4 className="text-sm font-medium text-white hover:text-pink-400 transition-colors line-clamp-2">
                                        {article.title}
                                      </h4>
                                    </div>

                                    {index === 0 && hasNewArticles && (
                                      <span className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded">
                                        NEW
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>

                            <div className="p-4 border-t border-white/10">
                              <Link
                                to="/articles"
                                onClick={() => setShowNotifications(false)}
                                className="flex items-center justify-between text-xs group"
                              >
                                <span className="text-gray-400 group-hover:text-white transition-colors">
                                  Voir toutes les actus
                                </span>
                                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-all group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CTA Principal - REJOINS LA TEAM */}
                <motion.div className="relative">
                  <Link
                    to="/newsletter"
                    className="relative block group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <div className="relative px-6 py-2.5 overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-blue-500 shadow-lg shadow-pink-500/20 whitespace-nowrap min-w-max">
                        {/* Shine effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div 
                            className="absolute inset-0"
                            style={{
                              background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                              transform: 'translateX(-100%)',
                              animation: 'shine 1.5s ease-out forwards'
                            }}
                          />
                        </div>
                        
                        <div className="relative flex items-center gap-2">
                          <Zap className="w-4 h-4 text-white" />
                          <span className="text-sm font-semibold text-white tracking-wide whitespace-nowrap">
                            Rejoins la team
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  aria-label="Menu"
                >
                  <div className="w-5 h-4 flex flex-col justify-between">
                    <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                    <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : ''}`} />
                    <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar Overlay - Desktop only */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/10 overflow-hidden hidden lg:block"
              >
                <div className="max-w-3xl mx-auto p-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un article, un joueur, un match..."
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all"
                      autoFocus
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative h-full pt-24 pb-8 px-6 overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Navigation principale */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname.includes(item.slug);

                  return (
                    <Link
                      key={item.slug}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-4 rounded-xl transition-all ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-lg font-medium">{item.label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  );
                })}
              </nav>

              {/* Séparateur */}
              <div className="my-6 h-px bg-white/10" />

              {/* Liens spéciaux - Football et Émissions */}
              <div className="space-y-1">
                {specialItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-4 rounded-xl transition-all ${
                      location.pathname === item.path
                        ? item.isLive
                          ? 'bg-emerald-500/20 text-white border border-emerald-500/30'
                          : 'bg-pink-500/20 text-white border border-pink-500/30'
                        : 'text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg font-medium">{item.label}</span>
                    {item.isLive ? (
                      <span className="px-2 py-1 text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full">
                        LIVE
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </Link>
                ))}
              </div>

              {/* CTA Mobile - REJOINS LA TEAM */}
              <div className="mt-8">
                <Link
                  to="/newsletter"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl text-white font-semibold shadow-lg shadow-pink-500/20"
                >
                  <Zap className="w-5 h-5" />
                  <span>Rejoins la team</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background overlay when dropdown is open */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 hidden lg:block"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </>
  );
};

export default ResponsiveNavbar;