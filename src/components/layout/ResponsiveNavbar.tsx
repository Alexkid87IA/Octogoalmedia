import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, X, Menu, Zap, Play } from 'lucide-react';
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

  return (
    <>
      {/* Navbar principale */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 z-[9999]">
        <div className="max-w-[1600px] mx-auto px-4 h-full">
          {/* Desktop: Logo | Navigation centrée | 2 CTAs */}
          <div className="hidden lg:flex items-center justify-between h-full">

            {/* GAUCHE: Logo seul */}
            <Link to="/" className="flex-shrink-0">
              <img src={logoMedia} alt="Octogoal" className="h-10 w-auto" />
            </Link>

            {/* CENTRE: Navigation */}
            <div
              className="flex items-center gap-1"
              onMouseLeave={() => {
                if (hoverIntentTimeout.current) {
                  clearTimeout(hoverIntentTimeout.current);
                  hoverIntentTimeout.current = null;
                }
                setActiveDropdown(null);
              }}
            >
              {mainNavItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (hoverIntentTimeout.current) clearTimeout(hoverIntentTimeout.current);
                    if (item.hasDropdown) {
                      hoverIntentTimeout.current = setTimeout(() => setActiveDropdown(item.label), HOVER_DELAY);
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
                    className={`flex items-center gap-1 px-4 py-2 text-[13px] font-medium transition-colors ${
                      location.pathname.includes(item.path.split('/')[2] || item.path) ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                  <AnimatePresence>
                    {activeDropdown === item.label && item.hasDropdown && <NavDropdown item={item} />}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* DROITE: 2 CTAs */}
            <div className="flex items-center gap-3">

              {/* CTA Émissions - Style secondaire */}
              <Link
                to={highlightedItems.emissions.path}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-white text-sm font-medium rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-200"
              >
                <Play className="w-4 h-4 text-gray-400" />
                <span>Émissions</span>
              </Link>

              {/* CTA Match Center - Style principal avec indicateur LIVE */}
              <Link
                to={highlightedItems.matchCenter.path}
                className="group relative flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] transition-all duration-200 overflow-hidden"
              >
                {/* Effet shine au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />

                {/* Indicateur LIVE */}
                {hasLiveMatches ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                ) : (
                  <Zap className="w-4 h-4" />
                )}

                <span className="relative z-10">Match Center</span>

                {/* Badge nombre de matchs live */}
                {hasLiveMatches && liveCount > 0 && (
                  <span className="relative z-10 px-1.5 py-0.5 bg-red-500 text-[10px] font-bold rounded-full min-w-[18px] text-center">
                    {liveCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile : Logo + Boutons rapides + Menu Button */}
          <div className="flex lg:hidden items-center justify-between h-full">
            {/* Logo à gauche */}
            <Link to="/" className="flex-shrink-0">
              <img src={logoMedia} alt="Octogoal" className="h-8 w-auto" />
            </Link>

            {/* Boutons rapides au centre */}
            <div className="flex items-center gap-2">
              {/* Match Center Mobile */}
              <Link
                to={highlightedItems.matchCenter.path}
                className="flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/30 rounded-lg"
              >
                {hasLiveMatches && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                )}
                <Zap className="w-3 h-3 text-pink-400" />
                <span className="text-[10px] font-semibold text-white">Matchs</span>
              </Link>

              {/* Émissions Mobile */}
              <Link
                to={highlightedItems.emissions.path}
                className="flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/30 rounded-lg"
              >
                <Play className="w-3 h-3 text-pink-400" />
                <span className="text-[10px] font-semibold text-white hidden sm:inline">Émissions</span>
              </Link>
            </div>

            {/* Burger Menu à droite */}
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
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
