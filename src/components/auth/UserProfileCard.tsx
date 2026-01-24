// src/components/auth/UserProfileCard.tsx
// Carte de profil utilisateur - Style Gaming

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  LogOut,
  User,
  Trophy,
  Flame,
  Star,
  Settings,
  Crown,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Badge definitions
const badgeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  early_adopter: { icon: <Star className="w-3 h-3" />, label: 'Early Adopter', color: 'text-yellow-400' },
  first_win: { icon: <Trophy className="w-3 h-3" />, label: 'First Win', color: 'text-green-400' },
  streak_5: { icon: <Flame className="w-3 h-3" />, label: 'Streak 5', color: 'text-orange-400' },
  high_roller: { icon: <Crown className="w-3 h-3" />, label: 'High Roller', color: 'text-purple-400' },
  legend: { icon: <Award className="w-3 h-3" />, label: 'Legend', color: 'text-fuchsia-400' }
};

// OctoCoin icon
const OctoCoinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
    <circle cx="12" cy="12" r="8" fill="currentColor" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0a0a0f">O</text>
  </svg>
);

interface UserProfileCardProps {
  variant?: 'header' | 'sidebar' | 'full';
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ variant = 'header' }) => {
  const { user, logout, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal('login')}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold rounded-xl hover:from-fuchsia-400 hover:to-purple-500 transition-all text-sm"
      >
        <User className="w-4 h-4" />
        <span>Connexion</span>
      </button>
    );
  }

  const xpProgress = (user.xp / user.xpToNextLevel) * 100;

  // Header variant - Compact dropdown
  if (variant === 'header') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
        >
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-8 h-8 rounded-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-fuchsia-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {user.level}
            </div>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1">
            <OctoCoinIcon className="w-5 h-5 text-fuchsia-400" />
            <span className="font-bold text-white">{user.octoCoins.toLocaleString()}</span>
          </div>

          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-72 z-50"
              >
                <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-fuchsia-500/50 to-transparent">
                  <div className="bg-[#0d0d15] rounded-2xl overflow-hidden shadow-2xl">
                    {/* User info */}
                    <div className="p-4 bg-gradient-to-b from-fuchsia-500/10 to-transparent">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-12 h-12 rounded-xl"
                        />
                        <div>
                          <p className="font-bold text-white">{user.username}</p>
                          <p className="text-white/50 text-sm">Rang #{user.rank}</p>
                        </div>
                      </div>

                      {/* Level progress */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-fuchsia-400 font-bold">Niveau {user.level}</span>
                          <span className="text-white/40">{user.xp} / {user.xpToNextLevel} XP</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${xpProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-1 flex-wrap">
                        {user.badges.slice(0, 4).map((badge) => {
                          const config = badgeConfig[badge];
                          if (!config) return null;
                          return (
                            <div
                              key={badge}
                              className={`flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs ${config.color}`}
                              title={config.label}
                            >
                              {config.icon}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="p-4 border-t border-white/5">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-lg font-black text-white">{user.stats.totalBets}</p>
                          <p className="text-xs text-white/40">Paris</p>
                        </div>
                        <div>
                          <p className="text-lg font-black text-green-400">{user.stats.winRate}%</p>
                          <p className="text-xs text-white/40">Win Rate</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <p className="text-lg font-black text-orange-400">{user.stats.currentStreak}</p>
                          </div>
                          <p className="text-xs text-white/40">Série</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2 border-t border-white/5">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Mon profil</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Paramètres</span>
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full variant - Full profile card
  if (variant === 'full') {
    return (
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-fuchsia-500/50 to-purple-500/30">
        <div className="bg-[#0d0d15] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-b from-fuchsia-500/20 to-transparent">
            {/* Rank badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-fuchsia-500/20 rounded text-fuchsia-400 text-sm font-bold">
              <Crown className="w-4 h-4" />
              #{user.rank}
            </div>

            <div className="flex items-center gap-4">
              {/* Avatar with level */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-fuchsia-500/50">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full text-xs font-bold text-white shadow-lg">
                  LVL {user.level}
                </div>
              </div>

              {/* User info */}
              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-1">{user.username}</h3>
                <p className="text-white/50 text-sm mb-2">Membre depuis {new Date(user.joinedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  {user.badges.map((badge) => {
                    const config = badgeConfig[badge];
                    if (!config) return null;
                    return (
                      <div
                        key={badge}
                        className={`flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg text-xs ${config.color}`}
                      >
                        {config.icon}
                        <span>{config.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white font-bold">Niveau {user.level}</span>
                <span className="text-white/50">{user.xp} / {user.xpToNextLevel} XP</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Coins */}
          <div className="p-6 border-t border-white/5">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 rounded-xl border border-fuchsia-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
                  <OctoCoinIcon className="w-8 h-8 text-fuchsia-400" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">Mes OctoCoins</p>
                  <p className="text-2xl font-black text-fuchsia-400">{user.octoCoins.toLocaleString()}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-fuchsia-500 text-white text-sm font-bold rounded-lg hover:bg-fuchsia-400 transition-colors">
                + Obtenir
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6 border-t border-white/5">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-fuchsia-400" />
              Statistiques
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-white/40" />
                  <span className="text-white/50 text-sm">Paris totaux</span>
                </div>
                <p className="text-2xl font-black text-white">{user.stats.totalBets}</p>
              </div>
              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-green-400" />
                  <span className="text-white/50 text-sm">Win Rate</span>
                </div>
                <p className="text-2xl font-black text-green-400">{user.stats.winRate}%</p>
              </div>
              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-white/50 text-sm">Série actuelle</span>
                </div>
                <p className="text-2xl font-black text-orange-400">{user.stats.currentStreak}</p>
              </div>
              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/50 text-sm">Meilleur gain</span>
                </div>
                <p className="text-2xl font-black text-yellow-400">+{user.stats.bestWin}</p>
              </div>
            </div>
          </div>

          {/* Win/Loss bar */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400 text-sm font-bold">{user.stats.wonBets} gagnés</span>
              <span className="text-white/30">•</span>
              <span className="text-red-400 text-sm font-bold">{user.stats.lostBets} perdus</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-green-500"
                style={{ width: `${(user.stats.wonBets / user.stats.totalBets) * 100}%` }}
              />
              <div
                className="h-full bg-red-500"
                style={{ width: `${(user.stats.lostBets / user.stats.totalBets) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar variant
  return (
    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-10 h-10 rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white truncate">{user.username}</p>
          <p className="text-fuchsia-400 text-sm">Niveau {user.level}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-2 bg-fuchsia-500/10 rounded-lg">
        <OctoCoinIcon className="w-5 h-5 text-fuchsia-400" />
        <span className="font-bold text-fuchsia-400">{user.octoCoins.toLocaleString()}</span>
        <span className="text-white/40 text-sm">OctoCoins</span>
      </div>
    </div>
  );
};

export default UserProfileCard;
