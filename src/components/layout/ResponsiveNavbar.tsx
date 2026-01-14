import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, X, Search, Menu, Zap, Play, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { mainNavItems, highlightedItems, ctaConfig, NavItem } from '../../config/navigation';
import { getLiveMatches } from '../../services/apiFootball';

// Import du logo Octogoal
import logoMedia from '../../assets/logos/LOGO_OCTOGOAL.png';

export const ResponsiveNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [hasLiveMatches, setHasLiveMatches] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const location = useLocation();

  // Ref pour le timeout d'intention de hover
  const hoverIntentTimeout = useRef<NodeJS.Timeout | null>(null);
  const HOVER_DELAY = 150; // ms avant d'ouvrir le dropdown

  // Vérifier s'il y a des matchs en direct
  const checkLiveMatches = useCallback(async () => {
    try {
      const liveMatches = await getLiveMatches();
      const count = liveMatches?.length || 0;
      setHasLiveMatches(count > 0);
      setLiveCount(count);
    } catch (error) {
      console.error('Error checking live matches:', error);
      setHasLiveMatches(false);
      setLiveCount(0);
    }
  }, []);

  // Vérifier les matchs en direct au montage et toutes les 60 secondes
  useEffect(() => {
    checkLiveMatches();
    const interval = setInterval(checkLiveMatches, 60000);
    return () => clearInterval(interval);
  }, [checkLiveMatches]);

  // Fermer le menu mobile et les dropdowns lors du changement de route
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setExpandedMobile(null);
  }, [location.pathname]);

  // Bloquer le scroll quand le menu mobile est ouvert
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

  // Composant Dropdown unifié
  const NavDropdown = ({ item }: { item: NavItem }) => {
    if (!item.columns) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="absolute top-full left-0 mt-2 w-[580px] z-50"
      >
        {/* Flèche */}
        <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-pink-500/30" />

        <div className="relative bg-gray-900 border border-pink-500/20 rounded-xl shadow-2xl shadow-pink-500/10 overflow-hidden">
          {/* Header avec gradient */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-pink-500/10 bg-gradient-to-r from-pink-500/5 to-blue-500/5">
            <span className="text-white font-semibold">{item.label}</span>
            <Link
              to={item.path}
              onClick={() => setActiveDropdown(null)}
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              Tout voir →
            </Link>
          </div>

          {/* Colonnes */}
          <div className="grid grid-cols-3 gap-0 p-6">
            {item.columns.map((column, idx) => (
              <div key={column.title} className={idx > 0 ? 'pl-6 border-l border-gray-800/30' : ''}>
                <h4 className="text-[11px] font-semibold text-pink-400/70 uppercase tracking-wider mb-4">
                  {column.title}
                </h4>
                <div className="space-y-1">
                  {column.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setActiveDropdown(null)}
                      className="block py-2 text-sm text-gray-400 hover:text-white hover:pl-2 transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // Composant pour les éléments mis en avant (Match Center et Émissions)
  const HighlightedNavItem = ({
    item,
    icon: Icon,
    hasLive = false,
    variant = 'default'
  }: {
    item: { label: string; path: string; description?: string };
    icon: React.ElementType;
    hasLive?: boolean;
    variant?: 'default' | 'emissions';
  }) => {
    const isActive = location.pathname === item.path;

    return (
      <Link
        to={item.path}
        className={`
          group relative flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1 xl:py-1.5 rounded-md xl:rounded-lg
          transition-all duration-300 overflow-hidden
          ${isActive
            ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg shadow-pink-500/25'
            : 'bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/20 hover:border-pink-500/40 text-white hover:shadow-lg hover:shadow-pink-500/20'
          }
        `}
      >
        {/* Glow effect au hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icône avec indicateur live optionnel */}
        <div className="relative z-10 flex items-center gap-1 xl:gap-1.5">
          {hasLive && hasLiveMatches && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
          )}
          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-pink-400 group-hover:text-white'} transition-colors`} />
        </div>

        {/* Label */}
        <span className="relative z-10 text-[10px] xl:text-[11px] font-semibold tracking-wide whitespace-nowrap">
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Navbar principale */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 z-[9999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src={logoMedia}
                alt="Octogoal"
                className="h-11 xl:h-12 w-auto"
              />
            </Link>

            {/* Navigation Desktop - Structure équilibrée */}
            <div
              className="hidden lg:flex items-center flex-1 justify-center"
              onMouseLeave={() => {
                if (hoverIntentTimeout.current) {
                  clearTimeout(hoverIntentTimeout.current);
                  hoverIntentTimeout.current = null;
                }
                setActiveDropdown(null);
              }}
            >
              <div className="flex items-center gap-1">
                {/* Match Center */}
                <HighlightedNavItem
                  item={highlightedItems.matchCenter}
                  icon={Zap}
                  hasLive={true}
                />

                {/* Séparateur */}
                <div className="w-px h-5 bg-gray-700/30 mx-3" />

                {/* Navigation classique - espacement uniforme */}
                {mainNavItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (hoverIntentTimeout.current) {
                        clearTimeout(hoverIntentTimeout.current);
                      }
                      if (item.hasDropdown) {
                        hoverIntentTimeout.current = setTimeout(() => {
                          setActiveDropdown(item.label);
                        }, HOVER_DELAY);
                      }
                    }}
                    onMouseLeave={() => {
                      if (hoverIntentTimeout.current) {
                        clearTimeout(hoverIntentTimeout.current);
                        hoverIntentTimeout.current = null;
                      }
                    }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-1 px-3 py-2 text-[11px] font-medium transition-colors ${
                        location.pathname.includes(item.path.split('/')[2] || item.path)
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      )}
                    </Link>

                    <AnimatePresence>
                      {activeDropdown === item.label && item.hasDropdown && (
                        <NavDropdown item={item} />
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Séparateur */}
                <div className="w-px h-5 bg-gray-700/30 mx-3" />

                {/* Émissions */}
                <HighlightedNavItem
                  item={highlightedItems.emissions}
                  icon={Play}
                  variant="emissions"
                />
              </div>
            </div>

            {/* Section droite : Réseaux sociaux + Search + CTA */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Réseaux sociaux */}
              <div className="flex items-center">
                <a href="https://youtube.com/@octogoal" target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-red-500 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://tiktok.com/@octogoal" target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
                <a href="https://instagram.com/octogoal" target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-pink-500 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://twitter.com/octogoal" target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>

              {/* Séparateur */}
              <div className="w-px h-4 bg-gray-700/30" />

              {/* Recherche */}
              <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>

              {/* CTA */}
              {(ctaConfig as any).external ? (
                <a
                  href={ctaConfig.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 xl:px-4 py-1.5 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-[10px] xl:text-xs font-semibold rounded-full shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  {ctaConfig.label}
                </a>
              ) : (
                <Link
                  to={ctaConfig.path}
                  className="px-2.5 xl:px-4 py-1.5 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-[10px] xl:text-xs font-semibold rounded-full shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  {ctaConfig.label}
                </Link>
              )}
            </div>

            {/* Mobile : Match Center + Émissions + Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Match Center Mobile */}
              <Link
                to={highlightedItems.matchCenter.path}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/30 rounded-lg"
              >
                {hasLiveMatches && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                <Zap className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs font-semibold text-white">Matchs</span>
              </Link>

              {/* Émissions Mobile */}
              <Link
                to={highlightedItems.emissions.path}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/30 rounded-lg"
              >
                <Play className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs font-semibold text-white sr-only sm:not-sr-only">Émissions</span>
              </Link>

              {/* Burger Menu */}
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (depuis la droite) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-gray-950 border-l border-pink-500/20 z-[10001] overflow-y-auto"
            >
              {/* Header du drawer */}
              <div className="flex items-center justify-between p-4 border-b border-pink-500/10 bg-gradient-to-r from-pink-500/5 to-blue-500/5">
                <img src={logoMedia} alt="Octogoal" className="h-8" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Éléments mis en avant en mobile */}
              <div className="p-4 space-y-3 border-b border-gray-800/50">
                <Link
                  to={highlightedItems.matchCenter.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/30 rounded-xl hover:border-pink-500/50 transition-colors"
                >
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{highlightedItems.matchCenter.label}</span>
                      {hasLiveMatches && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{highlightedItems.matchCenter.description}</span>
                  </div>
                </Link>

                <Link
                  to={highlightedItems.emissions.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/30 rounded-xl hover:border-pink-500/50 transition-colors"
                >
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">{highlightedItems.emissions.label}</span>
                    <span className="block text-xs text-gray-400">{highlightedItems.emissions.description}</span>
                  </div>
                </Link>
              </div>

              {/* Navigation mobile */}
              <div className="p-4 space-y-1">
                {mainNavItems.map((item) => (
                  <div key={item.label} className="border-b border-gray-800/50 last:border-0">
                    {item.hasDropdown ? (
                      <>
                        {/* Item avec dropdown */}
                        <button
                          onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                          className="w-full flex items-center justify-between py-3 text-left"
                        >
                          <span className={`font-medium ${expandedMobile === item.label ? 'text-pink-400' : 'text-gray-300'}`}>
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                              expandedMobile === item.label ? 'rotate-180 text-pink-400' : ''
                            }`}
                          />
                        </button>

                        {/* Sous-menu expandé */}
                        <AnimatePresence>
                          {expandedMobile === item.label && item.columns && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pb-4 space-y-4">
                                {item.columns.map((column) => (
                                  <div key={column.title}>
                                    <h4 className="text-[10px] font-semibold text-pink-400/70 uppercase tracking-wider mb-2 px-2">
                                      {column.title}
                                    </h4>
                                    <div className="space-y-0.5">
                                      {column.links.map((link) => (
                                        <Link
                                          key={link.path}
                                          to={link.path}
                                          onClick={() => setIsOpen(false)}
                                          className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-pink-500/10 rounded-lg transition-colors"
                                        >
                                          {link.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}

                                {/* Lien "Tout voir" */}
                                <Link
                                  to={item.path}
                                  onClick={() => setIsOpen(false)}
                                  className="block px-3 py-2 text-sm text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                  Tout voir {item.label} →
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      /* Item simple sans dropdown */
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="block py-3 font-medium text-gray-300 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA Mobile */}
              <div className="p-4 border-t border-gray-800">
                {(ctaConfig as any).external ? (
                  <a
                    href={ctaConfig.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 text-center bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25"
                  >
                    {ctaConfig.label}
                  </a>
                ) : (
                  <Link
                    to={ctaConfig.path}
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 text-center bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25"
                  >
                    {ctaConfig.label}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay pour fermer les dropdowns desktop */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ResponsiveNavbar;
