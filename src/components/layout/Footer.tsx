import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

// Import des liens sociaux depuis la config
import { socialLinksList } from '../../config/navigation';

// Icônes pour les réseaux sociaux
const SocialIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'discord':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      );
    default:
      return null;
  }
};

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

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
    <footer className="relative bg-[#0a0a0f] border-t border-white/5">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION PRINCIPALE */}
        <div className="py-12 lg:py-14">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">

            {/* Newsletter - prend 2 colonnes */}
            <div className="lg:col-span-2" id="newsletter-form">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
                  Newsletter
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                L'actu foot dans ta boîte mail
              </h3>

              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Rejoins la communauté et reçois chaque semaine les meilleurs moments.
              </p>

              <form onSubmit={handleSubscribe}>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubscribed}
                    className="px-4 py-2.5 rounded-xl text-white font-medium text-sm bg-pink-500 hover:bg-pink-400 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {isSubscribed ? <CheckCircle className="w-4 h-4" /> : (
                      <>
                        <span>Go</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {isSubscribed ? (
                    <motion.p
                      key="success"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-green-400 text-xs mt-2"
                    >
                      Bienvenue dans l'équipe !
                    </motion.p>
                  ) : (
                    <motion.p key="hint" className="text-xs text-gray-600 mt-2">
                      Zéro spam. Que du foot.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Navigation - 3 colonnes */}
            <div className="lg:col-span-3 grid grid-cols-3 gap-6">
              {/* Rubriques */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Rubriques</h4>
                <ul className="space-y-2">
                  {[
                    { label: 'Actus', path: '/rubrique/actus' },
                    { label: 'Matchs', path: '/matchs' },
                    { label: 'Joueurs', path: '/joueurs' },
                    { label: 'Mèmes', path: '/rubrique/memes' }
                  ].map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contenus */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Contenus</h4>
                <ul className="space-y-2">
                  {[
                    { label: 'Articles', path: '/articles' },
                    { label: 'Émissions', path: '/emissions' },
                    { label: 'Classements', path: '/classements' },
                    { label: 'Calendrier', path: '/calendrier' }
                  ].map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Octogoal */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Octogoal</h4>
                <ul className="space-y-2">
                  {[
                    { label: 'À propos', path: '/a-propos' },
                    { label: 'Contact', path: '/contact' },
                    { label: 'Participer', path: '/participer' }
                  ].map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
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

        {/* SECTION BOTTOM */}
        <div className="py-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinksList.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>

            {/* Copyright + Legal */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>© {new Date().getFullYear()} Octogoal</span>
              <span className="text-gray-700">•</span>
              <Link to="/mentions-legales" className="hover:text-gray-400 transition-colors">
                Mentions légales
              </Link>
              <Link to="/confidentialite" className="hover:text-gray-400 transition-colors">
                Confidentialité
              </Link>
              <Link to="/cgu" className="hover:text-gray-400 transition-colors">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
