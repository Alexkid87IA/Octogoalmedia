// src/pages/OctoGainOctoBetsPage.tsx
// Page Paris Fun - Style Gaming avec Auth

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Coins,
  Trophy,
  Gift,
  Crown,
  Medal,
  Users,
  Flame,
  Clock,
  Plus,
  Check,
  Gamepad2,
  Lock,
  Sparkles,
  LogIn,
  X,
  Minus
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import UserProfileCard from '../components/auth/UserProfileCard';

// ============================
// DONNÉES MOCKÉES
// ============================

const octoBets = [
  { id: 1, description: "Momo casse sa télé pendant PSG-OM", odds: 2.50, voters: 342, endsAt: "DIM 21:00", category: "MOMO", isHot: true, minBet: 50 },
  { id: 2, description: "Un joueur enlève son maillot pour célébrer", odds: 3.80, voters: 189, endsAt: "DIM 21:00", category: "MATCH", isHot: false, minBet: 25 },
  { id: 3, description: "L'arbitre sort un rouge avant la 30ème", odds: 4.20, voters: 256, endsAt: "DIM 21:00", category: "MATCH", isHot: true, minBet: 25 },
  { id: 4, description: "Momo insulte l'arbitre dans les 10 premières minutes", odds: 1.40, voters: 521, endsAt: "DIM 21:00", category: "MOMO", isHot: false, minBet: 100 },
  { id: 5, description: "Score final 0-0 (les parieurs en PLS)", odds: 8.00, voters: 87, endsAt: "DIM 21:00", category: "MATCH", isHot: false, minBet: 10 },
  { id: 6, description: "Momo dit 'Wallah c'est honteux' au moins 5 fois", odds: 1.15, voters: 678, endsAt: "DIM 21:00", category: "MOMO", isHot: true, minBet: 200 }
];

const leaderboard = [
  { rank: 1, pseudo: "LeBonParieur", coins: 48750, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeBonParieur", level: 12 },
  { rank: 2, pseudo: "MomoFan92", coins: 42300, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MomoFan92", level: 10 },
  { rank: 3, pseudo: "PronoKing", coins: 38900, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PronoKing", level: 9 },
  { rank: 4, pseudo: "LuckyBet", coins: 35200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LuckyBet", level: 8 },
  { rank: 5, pseudo: "FootAddict", coins: 31800, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FootAddict", level: 8 },
];

const rewards = [
  { rank: 1, prize: "TV 55 pouces", value: "500€", icon: "📺" },
  { rank: 2, prize: "200€ Winamax", value: "200€", icon: "💰" },
  { rank: 3, prize: "Maillot dédicacé", value: "150€", icon: "👕" },
];

// ============================
// COMPOSANT
// ============================

interface BetSelection {
  betId: number;
  amount: number;
}

const OctoGainOctoBetsPage = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [selectedBets, setSelectedBets] = useState<BetSelection[]>([]);
  const [showBetModal, setShowBetModal] = useState(false);
  const [currentBet, setCurrentBet] = useState<typeof octoBets[0] | null>(null);
  const [betAmount, setBetAmount] = useState(50);

  const userCoins = user?.octoCoins || 0;

  const handleBetClick = (bet: typeof octoBets[0]) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setCurrentBet(bet);
    setBetAmount(bet.minBet);
    setShowBetModal(true);
  };

  const confirmBet = () => {
    if (!currentBet) return;

    const existingIndex = selectedBets.findIndex(b => b.betId === currentBet.id);
    if (existingIndex >= 0) {
      // Update existing bet
      setSelectedBets(prev => prev.map((b, i) =>
        i === existingIndex ? { ...b, amount: betAmount } : b
      ));
    } else {
      // Add new bet
      setSelectedBets(prev => [...prev, { betId: currentBet.id, amount: betAmount }]);
    }
    setShowBetModal(false);
    setCurrentBet(null);
  };

  const removeBet = (betId: number) => {
    setSelectedBets(prev => prev.filter(b => b.betId !== betId));
  };

  const totalBetAmount = selectedBets.reduce((sum, b) => sum + b.amount, 0);
  const potentialWin = selectedBets.reduce((sum, b) => {
    const bet = octoBets.find(o => o.id === b.betId);
    return sum + (bet ? b.amount * bet.odds : 0);
  }, 0);

  const isBetSelected = (betId: number) => selectedBets.some(b => b.betId === betId);
  const getBetAmount = (betId: number) => selectedBets.find(b => b.betId === betId)?.amount || 0;

  return (
    <>
      <SEO
        title="Paris Fun | OctoGain - OctoBets"
        description="Parie avec des OctoCoins sur des situations délirantes. Gagne de vrais cadeaux."
      />

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[150px]" />
        </div>

        {/* Header */}
        <header className="relative z-10 pt-28 pb-8 px-6">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/octogain"
              className="inline-flex items-center gap-2 text-white/40 hover:text-fuchsia-400 transition-colors mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETOUR</span>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/25">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight">PARIS FUN</h1>
                  <p className="text-white/40 text-sm">OctoBets • Parie sur des trucs décalés</p>
                </div>
              </div>

              {/* User Coins or Login */}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {/* Coins display */}
                  <div className="flex items-center gap-3 px-5 py-3 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl">
                    <div className="w-8 h-8 bg-fuchsia-500/20 rounded-lg flex items-center justify-center">
                      <Coins className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40">Mes OctoCoins</p>
                      <p className="font-black text-xl text-fuchsia-400">{userCoins.toLocaleString()}</p>
                    </div>
                  </div>
                  {/* Profile */}
                  <UserProfileCard variant="header" />
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('register')}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold rounded-xl hover:from-fuchsia-400 hover:to-purple-500 transition-all shadow-lg shadow-fuchsia-500/25"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>500 coins offerts</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Not logged in banner */}
        {!isAuthenticated && (
          <section className="relative z-10 py-4">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30 rounded-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-fuchsia-400" />
                    <div>
                      <p className="font-bold text-white">Connecte-toi pour parier</p>
                      <p className="text-white/50 text-sm">Reçois 500 OctoCoins gratuits à l'inscription</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500 text-black font-bold rounded-lg hover:bg-fuchsia-400 transition-colors text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Connexion</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* OctoBets */}
        <section className="relative z-10 py-8">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <Flame className="w-5 h-5 text-fuchsia-400" />
                <h2 className="text-xl font-black uppercase tracking-wide">Les paris décalés</h2>
                <span className="px-2 py-0.5 bg-fuchsia-500 text-black text-xs font-bold rounded">
                  {octoBets.length} dispos
                </span>
              </div>

              {/* Bets Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {octoBets.map((bet, index) => {
                  const isSelected = isBetSelected(bet.id);
                  const selectedAmount = getBetAmount(bet.id);

                  return (
                    <motion.div
                      key={bet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div
                        onClick={() => handleBetClick(bet)}
                        className={`relative h-full p-[1px] rounded-xl cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-br from-fuchsia-500 to-purple-500'
                            : 'bg-gradient-to-br from-white/10 to-transparent hover:from-fuchsia-500/50 hover:to-transparent'
                        }`}
                      >
                        <div className="relative h-full bg-[#0d0d15] rounded-xl p-5">
                          {/* Hot badge */}
                          {bet.isHot && (
                            <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded text-[10px] font-bold shadow-lg">
                              <Flame className="w-3 h-3" />
                              HOT
                            </div>
                          )}

                          {/* Selected badge */}
                          {isSelected && (
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <div className="w-6 h-6 bg-fuchsia-500 rounded flex items-center justify-center">
                                <Check className="w-4 h-4 text-black" />
                              </div>
                              <span className="text-fuchsia-400 text-sm font-bold">{selectedAmount} coins</span>
                            </div>
                          )}

                          {/* Category + Time */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-fuchsia-400 text-[10px] font-bold uppercase tracking-wider">
                              {bet.category}
                            </span>
                            <div className="flex items-center gap-1 text-white/30 text-xs">
                              <Clock className="w-3 h-3" />
                              {bet.endsAt}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="font-bold mb-6 leading-snug">{bet.description}</p>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/30 text-[10px] uppercase">COTE</p>
                              <p className="text-2xl font-black text-fuchsia-400">{bet.odds}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white/30 text-[10px] uppercase">PARIEURS</p>
                              <div className="flex items-center gap-1 justify-end">
                                <Users className="w-3 h-3 text-white/40" />
                                <span className="font-bold">{bet.voters}</span>
                              </div>
                            </div>
                          </div>

                          {/* Min bet indicator */}
                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                            <span className="text-white/30 text-xs">Mise min.</span>
                            <span className="text-fuchsia-400 text-sm font-bold">{bet.minBet} coins</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Submit bet idea */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => isAuthenticated ? null : openAuthModal('login')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-fuchsia-400 hover:text-fuchsia-300 transition-colors text-sm border border-fuchsia-500/30 rounded-lg hover:border-fuchsia-500/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>PROPOSER UN PARI</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Floating action bar */}
        <AnimatePresence>
          {selectedBets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
            >
              <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-500">
                <div className="bg-[#0d0d15]/98 backdrop-blur-xl rounded-2xl p-4 shadow-2xl">
                  {/* Selected bets summary */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/50 text-xs uppercase">Tes paris</p>
                      <p className="font-bold">{selectedBets.length} sélectionné{selectedBets.length > 1 ? 's' : ''}</p>
                    </div>
                    <button
                      onClick={() => setSelectedBets([])}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Bet list */}
                  <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                    {selectedBets.map((selection) => {
                      const bet = octoBets.find(b => b.id === selection.betId);
                      if (!bet) return null;
                      return (
                        <div key={selection.betId} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm truncate">{bet.description}</p>
                            <p className="text-fuchsia-400 text-xs">Cote {bet.odds} • {selection.amount} coins</p>
                          </div>
                          <button
                            onClick={() => removeBet(selection.betId)}
                            className="text-white/40 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-fuchsia-500/10 rounded-xl">
                    <div>
                      <p className="text-white/50 text-xs">Total misé</p>
                      <p className="font-bold text-fuchsia-400">{totalBetAmount} coins</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/50 text-xs">Gain potentiel</p>
                      <p className="font-bold text-green-400">+{Math.round(potentialWin)} coins</p>
                    </div>
                  </div>

                  {/* Validate button */}
                  <button
                    disabled={totalBetAmount > userCoins}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold rounded-xl hover:from-fuchsia-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {totalBetAmount > userCoins ? (
                      <span>Solde insuffisant</span>
                    ) : (
                      <>
                        <span>VALIDER MES PARIS</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bet Modal */}
        <AnimatePresence>
          {showBetModal && currentBet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowBetModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md"
              >
                <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-500">
                  <div className="bg-[#0d0d15] rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-b from-fuchsia-500/10 to-transparent">
                      <button
                        onClick={() => setShowBetModal(false)}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5 text-white/60" />
                      </button>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-fuchsia-400 text-xs font-bold uppercase">{currentBet.category}</span>
                        {currentBet.isHot && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded text-[10px] font-bold">
                            <Flame className="w-3 h-3" />
                            HOT
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-bold">{currentBet.description}</p>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      {/* Odds display */}
                      <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="text-white/40 text-xs uppercase">Cote</p>
                          <p className="text-3xl font-black text-fuchsia-400">{currentBet.odds}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/40 text-xs uppercase">Parieurs</p>
                          <p className="font-bold">{currentBet.voters}</p>
                        </div>
                      </div>

                      {/* Amount selector */}
                      <div className="mb-6">
                        <label className="block text-white/60 text-sm mb-3">Combien tu mises ?</label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setBetAmount(Math.max(currentBet.minBet, betAmount - 50))}
                            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <div className="flex-1 relative">
                            <input
                              type="number"
                              value={betAmount}
                              onChange={(e) => setBetAmount(Math.max(currentBet.minBet, parseInt(e.target.value) || 0))}
                              className="w-full text-center text-2xl font-black py-3 bg-white/5 border border-white/10 rounded-xl text-fuchsia-400 focus:outline-none focus:border-fuchsia-500/50"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">coins</span>
                          </div>
                          <button
                            onClick={() => setBetAmount(Math.min(userCoins, betAmount + 50))}
                            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quick amounts */}
                        <div className="flex gap-2 mt-3">
                          {[50, 100, 250, 500].map((amount) => (
                            <button
                              key={amount}
                              onClick={() => setBetAmount(Math.min(userCoins, amount))}
                              disabled={amount > userCoins}
                              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                                betAmount === amount
                                  ? 'bg-fuchsia-500 text-black'
                                  : 'bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30'
                              }`}
                            >
                              {amount}
                            </button>
                          ))}
                        </div>

                        <p className="text-center text-white/30 text-xs mt-2">
                          Min. {currentBet.minBet} coins • Tu as {userCoins} coins
                        </p>
                      </div>

                      {/* Potential win */}
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Gain potentiel</span>
                          <span className="text-2xl font-black text-green-400">
                            +{Math.round(betAmount * currentBet.odds)} coins
                          </span>
                        </div>
                      </div>

                      {/* Confirm button */}
                      <button
                        onClick={confirmBet}
                        disabled={betAmount > userCoins || betAmount < currentBet.minBet}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold rounded-xl hover:from-fuchsia-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Coins className="w-5 h-5" />
                        <span>MISER {betAmount} COINS</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard + Rewards */}
        <section className="relative z-10 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Leaderboard */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-5 h-5 text-fuchsia-400" />
                  <h2 className="text-xl font-black uppercase tracking-wide">Classement</h2>
                  <span className="text-white/40 text-sm">Ce mois</span>
                </div>

                <div className="relative p-[1px] rounded-xl bg-gradient-to-br from-fuchsia-500/50 to-transparent">
                  <div className="bg-[#0d0d15] rounded-xl overflow-hidden">
                    {leaderboard.map((player, index) => (
                      <div
                        key={player.rank}
                        className={`flex items-center gap-4 p-4 ${
                          index !== leaderboard.length - 1 ? 'border-b border-white/5' : ''
                        } ${player.rank <= 3 ? 'bg-fuchsia-500/5' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                          player.rank === 1 ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white' :
                          player.rank === 2 ? 'bg-gray-400 text-black' :
                          player.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-white/10 text-white/60'
                        }`}>
                          {player.rank}
                        </div>
                        <img src={player.avatar} alt="" className="w-10 h-10 rounded-lg" />
                        <div className="flex-1">
                          <p className="font-bold">{player.pseudo}</p>
                          <p className="text-white/40 text-xs">Niveau {player.level}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-fuchsia-400" />
                          <span className="font-bold text-fuchsia-400">{player.coins.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}

                    {/* Current user rank */}
                    {isAuthenticated && user && (
                      <div className="p-4 border-t border-fuchsia-500/30 bg-fuchsia-500/10">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-sm text-white/60">
                            {user.rank}
                          </div>
                          <img src={user.avatar} alt="" className="w-10 h-10 rounded-lg" />
                          <div className="flex-1">
                            <p className="font-bold">{user.username}</p>
                            <p className="text-fuchsia-400 text-xs">C'est toi !</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-fuchsia-400" />
                            <span className="font-bold text-fuchsia-400">{user.octoCoins.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-center text-white/30 text-xs mt-3 uppercase tracking-wider">Reset chaque mois</p>
              </motion.div>

              {/* Rewards */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="w-5 h-5 text-fuchsia-400" />
                  <h2 className="text-xl font-black uppercase tracking-wide">Récompenses</h2>
                </div>

                <div className="space-y-4">
                  {rewards.map((reward) => (
                    <div
                      key={reward.rank}
                      className={`relative p-[1px] rounded-xl ${
                        reward.rank === 1 ? 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-500' : 'bg-gradient-to-br from-white/10 to-transparent'
                      }`}
                    >
                      <div className="bg-[#0d0d15] rounded-xl p-5">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{reward.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {reward.rank === 1 && <Crown className="w-4 h-4 text-fuchsia-400" />}
                              {reward.rank === 2 && <Medal className="w-4 h-4 text-gray-400" />}
                              {reward.rank === 3 && <Medal className="w-4 h-4 text-amber-600" />}
                              <span className="text-white/40 text-xs uppercase">
                                {reward.rank === 1 ? '1ER' : reward.rank === 2 ? '2ÈME' : '3ÈME'}
                              </span>
                            </div>
                            <p className="font-bold text-lg">{reward.prize}</p>
                          </div>
                          <p className="text-2xl font-black text-fuchsia-400">{reward.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* How to win */}
                <div className="mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-white/50 text-sm">
                    <span className="text-white font-bold">Comment gagner ?</span> Accumule le plus d'OctoCoins possibles en pariant sur les bons pronostics. Les 3 premiers du classement remportent des cadeaux à la fin de chaque mois.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative z-10 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-xl font-black uppercase tracking-wide text-center mb-10">Comment ça marche ?</h2>

              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { step: '01', title: 'INSCRIS-TOI', desc: '500 OctoCoins offerts', icon: <Sparkles className="w-6 h-6" /> },
                  { step: '02', title: 'PARIE', desc: 'Sur des trucs fous', icon: <Gamepad2 className="w-6 h-6" /> },
                  { step: '03', title: 'GAGNE', desc: 'De vrais cadeaux', icon: <Gift className="w-6 h-6" /> }
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/25">
                      {item.icon}
                    </div>
                    <div className="text-fuchsia-400 text-xs font-bold mb-2">{item.step}</div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              {!isAuthenticated && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => openAuthModal('register')}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold rounded-xl hover:from-fuchsia-400 hover:to-purple-500 transition-all shadow-lg shadow-fuchsia-500/25"
                  >
                    <span>CRÉER MON COMPTE</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-white/30 text-sm mt-3">500 OctoCoins offerts à l'inscription</p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default OctoGainOctoBetsPage;
