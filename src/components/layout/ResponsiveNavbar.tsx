import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, ChevronRight, X, Menu, Play, Circle, Zap, Search, Home, Trophy, Users, Newspaper, Radio, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { mainNavItems, highlightedItems, ctaConfig, socialLinks } from '../../config/navigation';
import { getLiveMatches } from '../../services/apiFootball';
import { getMajorCompetitionIds } from '../../config/competitions';

// IDs des compétitions majeures pour filtrer les matchs LIVE
const MAJOR_COMPETITION_IDS = getMajorCompetitionIds();

// Vérifier si un match est réellement en cours
function isActuallyLive(status: string): boolean {
  const liveStatuses = ['IN_PLAY', 'PAUSED', 'HALFTIME', 'LIVE', '1H', '2H', 'HT', 'ET', 'BT', 'P'];
  return liveStatuses.includes(status);
}

import logoMedia from '../../assets/logos/LOGO_OCTOGOAL.png';

// Social Icons Components
const SocialIcons = {
  discord: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
  tiktok: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  x: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  facebook: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  youtube: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  instagram: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
};

// Mobile menu icons mapping
const getMobileIcon = (label: string) => {
  const icons: Record<string, React.ReactNode> = {
    'Accueil': <Home className="w-5 h-5" />,
    'Classements': <Trophy className="w-5 h-5" />,
    'Joueurs': <Users className="w-5 h-5" />,
    'Actualités': <Newspaper className="w-5 h-5" />,
  };
  return icons[label] || <ChevronRight className="w-5 h-5" />;
};

export const ResponsiveNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hasLiveMatches, setHasLiveMatches] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check for live matches - filtré par statut réel et compétitions majeures
  // Avec timeout pour éviter de bloquer l'app au démarrage
  const checkLiveMatches = useCallback(async () => {
    try {
      // Timeout de 5 secondes pour ne pas bloquer l'app
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      const matches = await Promise.race([
        getLiveMatches(),
        timeoutPromise
      ]);

      // Filtrer uniquement les matchs réellement en cours dans les compétitions majeures
      const actualLiveMatches = (matches || []).filter((m: { status: string; competition?: { id: number } }) =>
        isActuallyLive(m.status) && MAJOR_COMPETITION_IDS.includes(m.competition?.id || 0)
      );
      setLiveCount(actualLiveMatches.length);
      setHasLiveMatches(actualLiveMatches.length > 0);
    } catch {
      // Silencieusement ignorer les erreurs - l'app doit continuer
      setHasLiveMatches(false);
      setLiveCount(0);
    }
  }, []);

  useEffect(() => {
    checkLiveMatches();
    const interval = setInterval(checkLiveMatches, 60000);
    return () => clearInterval(interval);
  }, [checkLiveMatches]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setHoveredItem(null);
    setMobileExpandedSection(null);
    setMobileSearchQuery('');
  }, [location.pathname]);

  // Handle mobile search
  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      setIsOpen(false);
      navigate(`/recherche?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
    }
  };

  // Toggle mobile accordion
  const toggleMobileSection = (label: string) => {
    setMobileExpandedSection(prev => prev === label ? null : label);
  };

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleMouseEnter = (label: string) => {
    setActiveDropdown(label);
    setHoveredItem(label);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
    setHoveredItem(null);
  };

  return (
    <>
      {/* ========== NAVBAR ========== */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-700 ${
          scrolled
            ? 'lg:bg-black/80 lg:backdrop-blur-3xl'
            : 'lg:bg-black/60 lg:backdrop-blur-xl'
        }`}
      >
        {/* MOBILE - Gradient Premium Background (noir profond vers rose subtil) */}
        <div className="absolute inset-0 lg:hidden">
          {/* Base noire solide */}
          <div className="absolute inset-0 bg-black" />
          {/* Gradient subtil qui part du noir vers le rose */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            scrolled
              ? 'bg-gradient-to-r from-transparent from-35% via-purple-950/50 via-65% to-pink-950/60'
              : 'bg-gradient-to-r from-transparent from-30% via-purple-950/40 via-60% to-pink-900/50'
          }`} />
          {/* Overlay lumineux très subtil à droite */}
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-pink-500/10 to-transparent" />
        </div>

        {/* DESKTOP - Classic glassmorphism */}
        <div className={`absolute inset-0 hidden lg:block transition-all duration-700 ${
          scrolled ? 'bg-black/80 backdrop-blur-3xl' : 'bg-black/60 backdrop-blur-xl'
        }`} />

        {/* Bottom border gradient - suit le gradient principal */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-pink-500/60 lg:from-transparent lg:via-pink-500/40 lg:to-transparent" />

        <div className="relative h-full max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="h-16 flex items-center justify-between">

            {/* LEFT - Logo + Nav */}
            <div className="flex items-center gap-8">
              {/* Logo - MOBILE: avec halo lumineux */}
              <Link to="/" className="group relative flex items-center gap-3">
                {/* Logo avec style icône d'app */}
                <div className="relative">
                  {/* Glow subtil derrière - desktop only */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 via-purple-500/15 to-pink-500/20 rounded-2xl blur-xl opacity-0 lg:group-hover:opacity-100 transition-all duration-1000" />

                  {/* Logo container - fond transparent sur mobile pour voir le logo */}
                  <div className="relative flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 bg-black/40 lg:bg-gradient-to-br lg:from-white/[0.08] lg:to-white/[0.02] border border-white/30 lg:border-white/10 rounded-xl group-hover:border-pink-500/30 transition-all duration-700 overflow-hidden">
                    <img src={logoMedia} alt="Octogoal" className="w-9 h-9 sm:w-8 sm:h-8 object-contain" />
                  </div>
                </div>

                {/* Texte Octogoal - MOBILE: grand et stylisé */}
                <div className="relative flex flex-col leading-tight">
                  {/* Texte OCTOGOAL en majuscules */}
                  <span className="text-xl sm:text-lg font-black tracking-wider lg:tracking-tight bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent drop-shadow-sm lg:font-bold lg:group-hover:from-pink-200 lg:group-hover:via-white lg:group-hover:to-purple-200 transition-all duration-700 uppercase">
                    Octogoal
                  </span>
                  {/* Tagline - mobile only */}
                  <span className="text-[9px] text-pink-300/70 font-normal italic tracking-wide lg:hidden -mt-0.5">
                    Le média du peuple, par Mohamed Henni
                  </span>
                  {/* Sous-ligne décorative - desktop only */}
                  <div className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-700 hidden lg:block" />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {mainNavItems.map((item) => {
                  const isActive = hoveredItem === item.label;

                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        to={item.path}
                        className="group/item relative flex items-center gap-2 px-4 py-2 text-[11px] font-bold tracking-wide transition-all duration-700 rounded-xl overflow-hidden"
                      >
                        {/* Background - toujours visible */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-white/[0.04] to-white/[0.02] group-hover/item:from-white/[0.12] group-hover/item:via-white/[0.08] group-hover/item:to-white/[0.04] transition-all duration-700" />

                        {/* Border - toujours visible */}
                        <div className={`absolute inset-0 border rounded-xl transition-all duration-700 ${
                          isActive
                            ? 'border-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                            : 'border-pink-500/20 group-hover/item:border-pink-400/40 group-hover/item:shadow-[0_0_12px_rgba(236,72,153,0.2)]'
                        }`} />

                        <span className={`relative z-10 transition-all duration-700 ${
                          isActive
                            ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]'
                            : 'text-neutral-300 group-hover/item:text-white'
                        }`}>
                          {item.label}
                        </span>

                        {item.hasDropdown && (
                          <ChevronDown className={`w-3.5 h-3.5 relative z-10 transition-all duration-700 ${
                            activeDropdown === item.label
                              ? 'rotate-180 text-pink-300 drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]'
                              : 'text-neutral-500 group-hover/item:text-pink-400'
                          }`} strokeWidth={2.5} />
                        )}
                      </Link>

                      {/* Dropdown */}
                      <AnimatePresence>
                        {item.hasDropdown && activeDropdown === item.label && item.columns && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-3 z-50"
                            style={{ width: `${Math.min(item.columns.length * 200, 600)}px` }}
                          >
                            <div className="relative">
                              {/* Glow effect */}
                              <div className="absolute -inset-1 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl opacity-60" />

                              {/* Main container - FOND SOLIDE */}
                              <div className="relative bg-[#0c0c14] rounded-2xl border border-white/15 shadow-2xl shadow-black/80 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.05] via-transparent to-purple-500/[0.05]" />

                                <div className="relative p-3">
                                  {/* Grid layout for columns */}
                                  <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${item.columns.length}, 1fr)` }}>
                                    {item.columns.map((col) => (
                                      <div key={col.title} className="space-y-1">
                                        {/* Column title */}
                                        <div className="px-4 py-2">
                                          <span className="text-[10px] font-bold text-pink-400/80 uppercase tracking-widest">
                                            {col.title}
                                          </span>
                                        </div>

                                        {/* Links */}
                                        {col.links.map((link, idx) => (
                                          <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setActiveDropdown(null)}
                                            className="group/drop relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 hover:bg-gradient-to-br hover:from-white/[0.08] hover:to-white/[0.03]"
                                            style={{ animationDelay: `${idx * 40}ms` }}
                                          >
                                            {/* Hover glow */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent rounded-xl opacity-0 group-hover/drop:opacity-100 transition-all duration-700 blur-xl" />

                                            {/* Icon container */}
                                            <div className="relative flex-shrink-0">
                                              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-lg blur-lg opacity-0 group-hover/drop:opacity-100 transition-all duration-700" />
                                              <div className="relative w-9 h-9 bg-gradient-to-br from-white/[0.08] to-white/[0.03] rounded-lg flex items-center justify-center border border-white/[0.08] group-hover/drop:border-pink-500/30 transition-all duration-500">
                                                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover/drop:text-pink-400 transition-all duration-500 group-hover/drop:scale-110" strokeWidth={1.5} />
                                              </div>
                                            </div>

                                            {/* Text content */}
                                            <div className="flex-1 relative min-w-0">
                                              <span className="text-[13px] font-semibold text-neutral-300 group-hover/drop:text-white transition-colors duration-500">
                                                {link.label}
                                              </span>
                                            </div>

                                            {/* Hover indicator dot */}
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/drop:opacity-100 translate-x-0 group-hover/drop:translate-x-1 transition-all duration-500">
                                              <div className="w-1.5 h-1.5 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full shadow-lg shadow-pink-400/50" />
                                            </div>
                                          </Link>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CENTER - Social Icons */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center gap-1">
                <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-lg hover:bg-white/[0.08] transition-all" aria-label="Discord">
                  <SocialIcons.discord className="w-5 h-5 text-neutral-500 group-hover:text-[#5865F2] transition-colors" />
                </a>
                <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-lg hover:bg-white/[0.08] transition-all" aria-label="TikTok">
                  <SocialIcons.tiktok className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                </a>
                <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-lg hover:bg-white/[0.08] transition-all" aria-label="X">
                  <SocialIcons.x className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                </a>
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-lg hover:bg-white/[0.08] transition-all" aria-label="Facebook">
                  <SocialIcons.facebook className="w-5 h-5 text-neutral-500 group-hover:text-[#1877F2] transition-colors" />
                </a>
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-lg hover:bg-white/[0.08] transition-all" aria-label="YouTube">
                  <SocialIcons.youtube className="w-5 h-5 text-neutral-500 group-hover:text-[#FF0000] transition-colors" />
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-lg hover:bg-white/[0.08] transition-all" aria-label="Instagram">
                  <SocialIcons.instagram className="w-5 h-5 text-neutral-500 group-hover:text-[#E4405F] transition-colors" />
                </a>
              </div>
            </div>

            {/* RIGHT - CTAs Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Émissions */}
              <Link
                to={highlightedItems.emissions.path}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-purple-500/20 to-fuchsia-500/30 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100" />

                <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-white/[0.10] to-white/[0.05] border border-white/20 rounded-lg backdrop-blur-xl group-hover:border-violet-400/50 transition-all duration-500 shadow-lg group-hover:shadow-violet-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <Play className="relative z-10 w-3 h-3 text-violet-400 transition-all duration-500 group-hover:scale-110 group-hover:text-violet-300" strokeWidth={2.5} fill="currentColor" />
                  <span className="relative z-10 text-[11px] font-bold text-white group-hover:text-violet-100 transition-all duration-500">Émissions</span>
                </div>
              </Link>

              {/* Pépites - Jeunes talents */}
              <Link
                to={highlightedItems.pepites.path}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-yellow-500/30 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100" />

                <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-white/[0.10] to-white/[0.05] border border-white/20 rounded-lg backdrop-blur-xl group-hover:border-amber-400/50 transition-all duration-500 shadow-lg group-hover:shadow-amber-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <span className="relative z-10 text-sm transition-all duration-500 group-hover:scale-110">✨</span>
                  <span className="relative z-10 text-[11px] font-bold text-white group-hover:text-amber-100 transition-all duration-500">Pépites</span>
                </div>
              </Link>

              {/* Match Center */}
              <Link
                to={highlightedItems.matchCenter.path}
                className="group relative overflow-hidden"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/40 via-rose-500/30 to-red-500/40 rounded-lg blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse" />

                <div className="relative flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-pink-500/20 via-rose-500/15 to-red-500/20 border border-pink-400/40 rounded-lg backdrop-blur-xl group-hover:border-pink-300/60 transition-all duration-500 shadow-lg shadow-pink-500/20 group-hover:shadow-pink-400/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-rose-500/20 to-transparent opacity-50 group-hover:opacity-100 transition-all duration-500" />

                  {hasLiveMatches && liveCount > 0 ? (
                    <div className="relative flex items-center gap-1">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-400 rounded-full blur-sm animate-pulse" />
                        <Circle className="relative w-1.5 h-1.5 text-red-300 fill-red-300" />
                      </div>
                      <span className="text-[9px] font-black text-red-200 tracking-wider">{liveCount}</span>
                    </div>
                  ) : (
                    <Zap className="relative z-10 w-3 h-3 text-pink-300" />
                  )}

                  {hasLiveMatches && liveCount > 0 && (
                    <div className="w-px h-3 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
                  )}

                  <span className="relative z-10 text-[11px] font-bold text-white">
                    Match Center
                  </span>
                </div>
              </Link>
            </div>

            {/* MOBILE - Right section - Premium Design */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Live indicator mobile - style premium intégré */}
              {hasLiveMatches && liveCount > 0 && (
                <Link
                  to={highlightedItems.matchCenter.path}
                  className="relative group"
                >
                  {/* Glow effect subtil */}
                  <div className="absolute -inset-1 bg-red-500/30 rounded-full blur-lg animate-pulse" />

                  <div className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-red-400/50 transition-all">
                    {/* Animated dot */}
                    <div className="relative flex items-center justify-center">
                      <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-50 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-red-400 to-red-500 shadow-lg shadow-red-500/50" />
                    </div>
                    <span className="text-sm font-black text-white tracking-wide drop-shadow-lg">{liveCount} LIVE</span>
                  </div>
                </Link>
              )}

              {/* Hamburger - Premium design intégré au gradient */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative group p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {/* Subtle inner glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex flex-col gap-[5px] w-5 h-5 justify-center items-center">
                  <motion.span
                    animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    className="block w-5 h-[2.5px] bg-white rounded-full origin-center"
                  />
                  <motion.span
                    animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                    className="block w-5 h-[2.5px] bg-white rounded-full"
                  />
                  <motion.span
                    animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    className="block w-5 h-[2.5px] bg-white rounded-full origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ========== MOBILE DRAWER - REDESIGNED ========== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with blur and gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10" />
            </motion.div>

            {/* Full-screen Drawer */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-[9999] lg:hidden flex flex-col"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent" />

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative flex items-center justify-between px-5 py-4 border-b border-white/10"
              >
                {/* Logo */}
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl blur-lg" />
                    <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-white/[0.1] to-white/[0.02] border border-white/20 rounded-xl shadow-xl overflow-hidden">
                      <img src={logoMedia} alt="Octogoal" className="w-8 h-8 object-contain" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                      Octogoal
                    </span>
                    <p className="text-[10px] text-neutral-500 font-medium">L'actu foot premium</p>
                  </div>
                </Link>

                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="relative group flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 hover:border-pink-500/30 transition-all"
                  aria-label="Fermer le menu"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <X className="relative w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </button>
              </motion.div>

              {/* Scrollable content */}
              <div className="relative flex-1 overflow-y-auto pb-32">
                <div className="px-5 py-6">

                  {/* Search bar */}
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    onSubmit={handleMobileSearch}
                    className="relative mb-8"
                  >
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 rounded-2xl blur-lg opacity-50" />
                      <div className="relative flex items-center bg-white/[0.05] border border-white/10 rounded-xl overflow-hidden focus-within:border-pink-500/40 transition-all">
                        <Search className="w-5 h-5 text-neutral-500 ml-4" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={mobileSearchQuery}
                          onChange={(e) => setMobileSearchQuery(e.target.value)}
                          placeholder="Rechercher un joueur, une équipe..."
                          className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-neutral-500 text-sm focus:outline-none"
                        />
                        {mobileSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setMobileSearchQuery('')}
                            className="p-2 mr-2 text-neutral-500 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.form>

                  {/* Featured CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 gap-3 mb-8"
                  >
                    {/* Match Center CTA */}
                    <Link
                      to={highlightedItems.matchCenter.path}
                      onClick={() => setIsOpen(false)}
                      className="group relative overflow-hidden rounded-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-rose-500/20 to-red-500/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {hasLiveMatches && liveCount > 0 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-red-500/80 rounded-full">
                          <div className="relative">
                            <div className="absolute inset-0 bg-white rounded-full animate-ping" />
                            <Circle className="relative w-1.5 h-1.5 text-white fill-white" />
                          </div>
                          <span className="text-[10px] font-black text-white">{liveCount}</span>
                        </div>
                      )}
                      <div className="relative p-4 pt-12">
                        <Zap className="w-6 h-6 text-pink-300 mb-2" strokeWidth={2} />
                        <span className="block text-base font-bold text-white">Match Center</span>
                        <span className="text-xs text-neutral-300">Scores en direct</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>

                    {/* Émissions CTA */}
                    <Link
                      to={highlightedItems.emissions.path}
                      onClick={() => setIsOpen(false)}
                      className="group relative overflow-hidden rounded-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-fuchsia-500/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="relative p-4 pt-12">
                        <Radio className="w-6 h-6 text-violet-300 mb-2" strokeWidth={2} />
                        <span className="block text-base font-bold text-white">Émissions</span>
                        <span className="text-xs text-neutral-300">Vidéos & Podcasts</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>

                    {/* Pépites CTA */}
                    <Link
                      to={highlightedItems.pepites.path}
                      onClick={() => setIsOpen(false)}
                      className="group relative overflow-hidden rounded-2xl col-span-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-yellow-500/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="relative p-4 flex items-center gap-4">
                        <span className="text-3xl">✨</span>
                        <div>
                          <span className="block text-base font-bold text-white">Pépites</span>
                          <span className="text-xs text-neutral-300">Jeunes talents à suivre</span>
                        </div>
                        <ArrowRight className="ml-auto w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>
                  </motion.div>

                  {/* Navigation Accordion */}
                  <motion.nav
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 px-1">Navigation</p>

                    {mainNavItems.map((item, idx) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                      >
                        {item.hasDropdown && item.columns ? (
                          // Accordion item with dropdown
                          <div className="rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5">
                            <button
                              onClick={() => toggleMobileSection(item.label)}
                              className="w-full flex items-center justify-between px-4 py-4 text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                                  mobileExpandedSection === item.label
                                    ? 'bg-gradient-to-br from-pink-500/30 to-purple-500/30 border border-pink-500/30'
                                    : 'bg-white/[0.05] border border-white/10'
                                }`}>
                                  {getMobileIcon(item.label)}
                                </div>
                                <span className={`text-base font-semibold transition-colors ${
                                  mobileExpandedSection === item.label ? 'text-white' : 'text-neutral-300'
                                }`}>
                                  {item.label}
                                </span>
                              </div>
                              <motion.div
                                animate={{ rotate: mobileExpandedSection === item.label ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className={`w-5 h-5 transition-colors ${
                                  mobileExpandedSection === item.label ? 'text-pink-400' : 'text-neutral-600'
                                }`} />
                              </motion.div>
                            </button>

                            <AnimatePresence>
                              {mobileExpandedSection === item.label && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 space-y-4">
                                    {item.columns.map((col) => (
                                      <div key={col.title}>
                                        <span className="block text-[10px] font-bold text-pink-400/60 uppercase tracking-wider mb-2 px-2">
                                          {col.title}
                                        </span>
                                        <div className="grid grid-cols-2 gap-2">
                                          {col.links.map((link) => (
                                            <Link
                                              key={link.path}
                                              to={link.path}
                                              onClick={() => setIsOpen(false)}
                                              className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] rounded-xl transition-all"
                                            >
                                              <ArrowRight className="w-3 h-3 text-pink-500/50" />
                                              <span>{link.label}</span>
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                    <Link
                                      to={item.path}
                                      onClick={() => setIsOpen(false)}
                                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-xl transition-all"
                                    >
                                      <span>Tout voir</span>
                                      <ArrowRight className="w-4 h-4" />
                                    </Link>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          // Simple link item
                          <Link
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-pink-500/20 transition-all"
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10">
                              {getMobileIcon(item.label)}
                            </div>
                            <span className="text-base font-semibold text-neutral-300 hover:text-white transition-colors">
                              {item.label}
                            </span>
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </motion.nav>
                </div>
              </div>

              {/* Fixed bottom social bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-neutral-950/95 to-transparent pt-8 pb-safe"
              >
                <div className="px-5 pb-6">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 text-center">Nous suivre</p>
                  <div className="flex items-center justify-center gap-3">
                    {[
                      { icon: SocialIcons.discord, href: socialLinks.discord, label: 'Discord', color: '#5865F2' },
                      { icon: SocialIcons.tiktok, href: socialLinks.tiktok, label: 'TikTok', color: '#ffffff' },
                      { icon: SocialIcons.x, href: socialLinks.x, label: 'X', color: '#ffffff' },
                      { icon: SocialIcons.facebook, href: socialLinks.facebook, label: 'Facebook', color: '#1877F2' },
                      { icon: SocialIcons.youtube, href: socialLinks.youtube, label: 'YouTube', color: '#FF0000' },
                      { icon: SocialIcons.instagram, href: socialLinks.instagram, label: 'Instagram', color: '#DD2A7B' },
                    ].map(({ icon: Icon, href, label, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/30 transition-all duration-300"
                        style={{ '--hover-color': color } as React.CSSProperties}
                        aria-label={label}
                      >
                        <Icon className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdowns */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] hidden lg:block"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ResponsiveNavbar;
