import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  CheckCircle,
  Twitter,
  Instagram,
  Youtube,
  X,
  Trophy,
  Newspaper,
  Users,
  Laugh,
  Play,
  MessageCircle
} from 'lucide-react';

// Logo Octogoal
import logoOctogoal from '../../assets/logos/LOGO_OCTOGOAL.png';

// Clip-paths octogonaux
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';

// TikTok icon (not in lucide)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const socialLinks = [
    { icon: Twitter, url: 'https://twitter.com/octogoal', label: 'Twitter' },
    { icon: Instagram, url: 'https://instagram.com/octogoal', label: 'Instagram' },
    { icon: Youtube, url: 'https://youtube.com/@octogoal', label: 'YouTube' },
    { icon: TikTokIcon, url: 'https://tiktok.com/@octogoal', label: 'TikTok' }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="relative bg-black border-t border-white/5">
      {/* Background avec effet dégradé */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-black" />
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent blur-3xl" />
        </div>
        {/* Forme octogonale décorative */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          className="absolute top-10 right-10 w-[200px] h-[200px] border border-pink-500/20"
          style={{ clipPath: octagonClip }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SECTION PRINCIPALE : Newsletter + Navigation */}
        <div className="py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* GAUCHE : Newsletter */}
            <div id="newsletter-form">
              {/* Header newsletter avec badge octogonal */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 bg-gradient-to-br from-pink-500 to-blue-500"
                  style={{ clipPath: octagonClip }}
                >
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 uppercase tracking-wider">
                  Newsletter Octogoal
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Toute l'actu foot dans ta boîte mail
              </h3>

              <p className="text-gray-400 text-sm mb-6">
                Rejoins la communauté Octogoal et reçois chaque semaine les meilleurs moments, mèmes et analyses.
              </p>

              {/* Formulaire avec style octogonal */}
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ton meilleur email"
                    required
                    className="flex-1 px-4 py-2.5 bg-white/[0.02] border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.03] transition-all text-sm"
                    style={{ clipPath: octagonClipSubtle }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubscribed}
                    className="relative px-5 py-2.5 text-white font-medium text-sm disabled:opacity-50 overflow-hidden bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-400 hover:to-blue-400 transition-all"
                    style={{ clipPath: octagonClipSubtle }}
                  >
                    <span className="relative flex items-center gap-2">
                      {isSubscribed ? <CheckCircle className="w-4 h-4" /> : 'Go !'}
                    </span>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {isSubscribed ? (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-green-400 text-xs"
                    >
                      Bienvenue dans l'équipe !
                    </motion.p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Zéro spam. Que du foot.
                    </p>
                  )}
                </AnimatePresence>
              </form>

              {/* Points clés */}
              <div className="flex flex-wrap gap-4 mt-6">
                {['Actus exclusives', 'Best of mèmes', 'Réactions Momo'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-pink-400" />
                    <span className="text-xs text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DROITE : Navigation structurée */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6">
              {/* Rubriques */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-pink-400" />
                  Rubriques
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: 'Actus', path: '/rubrique/actus', icon: Newspaper },
                    { label: 'Matchs', path: '/rubrique/matchs', icon: Trophy },
                    { label: 'Joueurs', path: '/joueurs', icon: Users },
                    { label: 'Mèmes', path: '/rubrique/memes', icon: Laugh }
                  ].map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="text-sm text-gray-400 hover:text-pink-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contenus */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-400" />
                  Contenus
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/articles"
                      className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Tous les articles
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/emissions"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <span>Émissions Octogoal</span>
                      <span
                        className="px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-pink-500 to-blue-500 text-white"
                        style={{ clipPath: octagonClipSubtle }}
                      >
                        HOT
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/classements"
                      className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Classements
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/calendrier"
                      className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Calendrier
                    </Link>
                  </li>
                </ul>
              </div>

              {/* À propos */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  À propos
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: 'Qui sommes-nous', path: '/a-propos' },
                    { label: 'Contact', path: '/contact' },
                    { label: 'Participer', path: '/participer' }
                  ].map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION BOTTOM : Logo, Stats, Socials et Legal */}
        <div className="py-8 border-t border-white/5">
          <div className="grid lg:grid-cols-3 gap-8 items-center">

            {/* Logo avec cadre octogonal */}
            <div className="flex items-center gap-6">
              <Link to="/" className="inline-block group">
                <div
                  className="p-1 bg-gradient-to-br from-pink-500/20 to-blue-500/20 group-hover:from-pink-500/30 group-hover:to-blue-500/30 transition-all"
                  style={{ clipPath: octagonClipSubtle }}
                >
                  <img
                    src={logoOctogoal}
                    alt="Octogoal"
                    className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </Link>

              {/* Social links */}
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 text-gray-500 hover:text-pink-400 transition-colors bg-white/5 hover:bg-white/10"
                    style={{ clipPath: octagonClipSubtle }}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Stats centrées */}
            <div className="flex justify-center gap-8">
              {[
                { value: '100K+', label: 'SUPPORTERS' },
                { value: '500+', label: 'ARTICLES' },
                { value: '50+', label: 'ÉMISSIONS' }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-pink-400">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Copyright et legal */}
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-2">
                © {new Date().getFullYear()} Octogoal Media
              </div>
              <div className="flex justify-end gap-4">
                {[
                  { label: 'Mentions légales', path: '/mentions-legales' },
                  { label: 'Confidentialité', path: '/confidentialite' },
                  { label: 'CGU', path: '/cgu' }
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
