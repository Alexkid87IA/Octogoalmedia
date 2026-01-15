import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, X, Menu, Zap, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { mainNavItems, highlightedItems, ctaConfig, NavItem } from '../../config/navigation';
import { getLiveMatches } from '../../services/apiFootball';

import logoMedia from '../../assets/logos/LOGO_OCTOGOAL.png';

export const ResponsiveNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [hasLiveMatches, setHasLiveMatches] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const location = useLocation();
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Check for live matches
  const checkLiveMatches = useCallback(async () => {
    try {
      const matches = await getLiveMatches();
      setLiveCount(matches?.length || 0);
      setHasLiveMatches((matches?.length || 0) > 0);
    } catch {
      setHasLiveMatches(false);
      setLiveCount(0);
    }
  }, []);

  useEffect(() => {
    checkLiveMatches();
    const interval = setInterval(checkLiveMatches, 60000);
    return () => clearInterval(interval);
  }, [checkLiveMatches]);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setExpandedMobile(null);
  }, [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Dropdown component
  const Dropdown = ({ item }: { item: NavItem }) => {
    if (!item.columns) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[580px] z-50"
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-pink-500/30" />
        <div className="relative bg-gray-900 border border-pink-500/20 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-pink-500/10 bg-gradient-to-r from-pink-500/5 to-blue-500/5">
            <span className="text-white font-semibold">{item.label}</span>
            <Link to={item.path} onClick={() => setActiveDropdown(null)} className="text-sm text-pink-400 hover:text-pink-300">
              Tout voir →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-0 p-6">
            {item.columns.map((col, i) => (
              <div key={col.title} className={i > 0 ? 'pl-6 border-l border-gray-800/30' : ''}>
                <h4 className="text-[11px] font-semibold text-pink-400/70 uppercase tracking-wider mb-4">{col.title}</h4>
                <div className="space-y-1">
                  {col.links.map((link) => (
                    <Link key={link.path} to={link.path} onClick={() => setActiveDropdown(null)} className="block py-2 text-sm text-gray-400 hover:text-white hover:pl-2 transition-all">
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
      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 z-[9999]">
        <div className="max-w-[1600px] mx-auto px-4 h-full">

          {/* DESKTOP */}
          <div className="hidden lg:flex items-center h-full">

            {/* Left zone - fixed width */}
            <div className="w-[200px] flex-shrink-0">
              <Link to="/">
                <img src={logoMedia} alt="Octogoal" className="h-10 w-auto" />
              </Link>
            </div>

            {/* Center zone - navigation */}
            <div className="flex-1 flex justify-center">
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => {
                  if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                  setActiveDropdown(null);
                }}
              >
                {mainNavItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                      if (item.hasDropdown) {
                        hoverTimeout.current = setTimeout(() => setActiveDropdown(item.label), 150);
                      }
                    }}
                    onMouseLeave={() => {
                      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                    }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                        location.pathname.includes(item.path.split('/')[2] || item.path)
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      )}
                    </Link>
                    <AnimatePresence>
                      {activeDropdown === item.label && item.hasDropdown && <Dropdown item={item} />}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Right zone - fixed width, same as left */}
            <div className="w-[200px] flex-shrink-0 flex justify-end items-center gap-3">
              {/* Émissions - secondary */}
              <Link
                to={highlightedItems.emissions.path}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
              >
                <Play className="w-4 h-4 text-gray-400" />
                <span>Émissions</span>
              </Link>

              {/* Match Center - primary */}
              <Link
                to={highlightedItems.matchCenter.path}
                className="group relative flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                {hasLiveMatches ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span className="relative z-10">Match Center</span>
                {hasLiveMatches && liveCount > 0 && (
                  <span className="relative z-10 px-1.5 py-0.5 bg-red-500 text-[10px] font-bold rounded-full">{liveCount}</span>
                )}
              </Link>
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex lg:hidden items-center justify-between h-full">
            <Link to="/">
              <img src={logoMedia} alt="Octogoal" className="h-8 w-auto" />
            </Link>

            <div className="flex items-center gap-2">
              <Link to={highlightedItems.matchCenter.path} className="flex items-center gap-1 px-2 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                {hasLiveMatches && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                )}
                <Zap className="w-3 h-3 text-pink-400" />
                <span className="text-[10px] font-semibold text-white">Matchs</span>
              </Link>

              <Link to={highlightedItems.emissions.path} className="flex items-center gap-1 px-2 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                <Play className="w-3 h-3 text-pink-400" />
                <span className="text-[10px] font-semibold text-white hidden sm:inline">Émissions</span>
              </Link>
            </div>

            <button onClick={() => setIsOpen(true)} className="p-2 text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ========== MOBILE DRAWER ========== */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-gray-950 border-l border-pink-500/20 z-[10001] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-pink-500/10">
                <img src={logoMedia} alt="Octogoal" className="h-8" />
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Featured links */}
              <div className="p-4 space-y-3 border-b border-gray-800/50">
                <Link to={highlightedItems.matchCenter.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{highlightedItems.matchCenter.label}</span>
                      {hasLiveMatches && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">LIVE</span>}
                    </div>
                    <span className="text-xs text-gray-400">{highlightedItems.matchCenter.description}</span>
                  </div>
                </Link>

                <Link to={highlightedItems.emissions.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">{highlightedItems.emissions.label}</span>
                    <span className="block text-xs text-gray-400">{highlightedItems.emissions.description}</span>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <div className="p-4 space-y-1">
                {mainNavItems.map((item) => (
                  <div key={item.label} className="border-b border-gray-800/50 last:border-0">
                    {item.hasDropdown ? (
                      <>
                        <button onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)} className="w-full flex items-center justify-between py-3">
                          <span className={`font-medium ${expandedMobile === item.label ? 'text-pink-400' : 'text-gray-300'}`}>{item.label}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedMobile === item.label ? 'rotate-180 text-pink-400' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {expandedMobile === item.label && item.columns && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="pb-4 space-y-4">
                                {item.columns.map((col) => (
                                  <div key={col.title}>
                                    <h4 className="text-[10px] font-semibold text-pink-400/70 uppercase tracking-wider mb-2 px-2">{col.title}</h4>
                                    {col.links.map((link) => (
                                      <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-pink-500/10 rounded-lg">
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>
                                ))}
                                <Link to={item.path} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm text-pink-400">
                                  Tout voir {item.label} →
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link to={item.path} onClick={() => setIsOpen(false)} className="block py-3 font-medium text-gray-300 hover:text-white">
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="p-4 border-t border-gray-800">
                {(ctaConfig as any).external ? (
                  <a href={ctaConfig.path} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block w-full py-3 text-center bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-xl">
                    {ctaConfig.label}
                  </a>
                ) : (
                  <Link to={ctaConfig.path} onClick={() => setIsOpen(false)} className="block w-full py-3 text-center bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-xl">
                    {ctaConfig.label}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdowns */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998]" onClick={() => setActiveDropdown(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ResponsiveNavbar;
