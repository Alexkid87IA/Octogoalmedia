// src/components/auth/AuthModal.tsx
// Modal d'authentification - Style Gaming

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  Gift,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Discord icon component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    authModalView,
    closeAuthModal,
    openAuthModal,
    login,
    loginWithDiscord,
    register,
    isLoading
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Remplis tous les champs');
      return;
    }
    try {
      await login(email, password);
    } catch {
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) {
      setError('Remplis tous les champs');
      return;
    }
    if (!acceptTerms) {
      setError('Accepte les conditions d\'utilisation');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères');
      return;
    }
    try {
      await register(username, email, password);
    } catch {
      setError('Une erreur est survenue');
    }
  };

  const handleDiscordLogin = async () => {
    try {
      await loginWithDiscord();
    } catch {
      setError('Erreur de connexion Discord');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
    setAcceptTerms(false);
  };

  const switchView = (view: 'login' | 'register' | 'forgot') => {
    resetForm();
    openAuthModal(view);
  };

  if (!showAuthModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeAuthModal}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-500 rounded-3xl blur-lg opacity-50" />

          {/* Content */}
          <div className="relative bg-[#0a0a0f] rounded-2xl border border-fuchsia-500/30 overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>

            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 text-center bg-gradient-to-b from-fuchsia-500/10 to-transparent">
              {authModalView !== 'login' && (
                <button
                  onClick={() => switchView('login')}
                  className="absolute top-4 left-4 flex items-center gap-1 text-white/40 hover:text-white transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Retour
                </button>
              )}

              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-black text-white mb-2">
                {authModalView === 'login' && 'Connexion'}
                {authModalView === 'register' && 'Créer un compte'}
                {authModalView === 'forgot' && 'Mot de passe oublié'}
              </h2>
              <p className="text-white/50 text-sm">
                {authModalView === 'login' && 'Connecte-toi pour parier avec tes OctoCoins'}
                {authModalView === 'register' && 'Rejoins la communauté et gagne des cadeaux'}
                {authModalView === 'forgot' && 'On t\'envoie un lien de réinitialisation'}
              </p>
            </div>

            {/* Body */}
            <div className="px-8 pb-8">
              {/* Welcome bonus for register */}
              {authModalView === 'register' && (
                <div className="mb-6 p-4 bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 rounded-xl border border-fuchsia-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-fuchsia-500/20 rounded-lg flex items-center justify-center">
                      <Gift className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold">500 OctoCoins offerts</p>
                      <p className="text-white/50 text-sm">Pour ton inscription</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Discord login */}
              {authModalView !== 'forgot' && (
                <>
                  <button
                    onClick={handleDiscordLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <DiscordIcon className="w-6 h-6" />
                        <span>Continuer avec Discord</span>
                      </>
                    )}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-[#0a0a0f] text-white/40 text-sm">ou</span>
                    </div>
                  </div>
                </>
              )}

              {/* Form */}
              <form onSubmit={authModalView === 'register' ? handleRegister : handleLogin}>
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Username (register only) */}
                {authModalView === 'register' && (
                  <div className="mb-4">
                    <label className="block text-white/60 text-sm mb-2">Pseudo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ton pseudo"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-white/60 text-sm mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                {authModalView !== 'forgot' && (
                  <div className="mb-4">
                    <label className="block text-white/60 text-sm mb-2">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Accept terms (register only) */}
                {authModalView === 'register' && (
                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-colors ${
                          acceptTerms
                            ? 'bg-fuchsia-500 border-fuchsia-500'
                            : 'border-white/30 hover:border-white/50'
                        }`}>
                          {acceptTerms && (
                            <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-white/50 text-sm">
                        J'accepte les{' '}
                        <a href="#" className="text-fuchsia-400 hover:underline">conditions d'utilisation</a>
                        {' '}et la{' '}
                        <a href="#" className="text-fuchsia-400 hover:underline">politique de confidentialité</a>
                      </span>
                    </label>
                  </div>
                )}

                {/* Forgot password link */}
                {authModalView === 'login' && (
                  <div className="mb-6 text-right">
                    <button
                      type="button"
                      onClick={() => switchView('forgot')}
                      className="text-fuchsia-400 text-sm hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold rounded-xl hover:from-fuchsia-400 hover:to-purple-500 transition-all shadow-lg shadow-fuchsia-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>
                        {authModalView === 'login' && 'Se connecter'}
                        {authModalView === 'register' && 'Créer mon compte'}
                        {authModalView === 'forgot' && 'Envoyer le lien'}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Switch view */}
              {authModalView === 'login' && (
                <p className="mt-6 text-center text-white/50 text-sm">
                  Pas encore de compte ?{' '}
                  <button
                    onClick={() => switchView('register')}
                    className="text-fuchsia-400 font-bold hover:underline"
                  >
                    Inscris-toi
                  </button>
                </p>
              )}
              {authModalView === 'register' && (
                <p className="mt-6 text-center text-white/50 text-sm">
                  Déjà un compte ?{' '}
                  <button
                    onClick={() => switchView('login')}
                    className="text-fuchsia-400 font-bold hover:underline"
                  >
                    Connecte-toi
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
