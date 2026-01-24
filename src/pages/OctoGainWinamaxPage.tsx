// src/pages/OctoGainWinamaxPage.tsx
// Page Paris Sérieux - Style Gaming - Version Enrichie

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  TrendingUp,
  Clock,
  Zap,
  Target,
  Shield,
  Trophy,
  Percent,
  Flame,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Star,
  Users,
  BarChart3,
  Sparkles,
  Gift,
  Info,
  Copy,
  Check
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';

const WINAMAX_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/3/31/Logo_winamax_1080x1080px.png';

// ============================
// DONNÉES MOCKÉES
// ============================

// Stats de Momo
const momoStats = {
  winRate: 68,
  roi: 12.4,
  totalPicks: 247,
  currentStreak: 5,
  streakType: 'win' as const,
  monthlyProfit: '+342€',
  avgOdds: 2.15
};

// Pick principal du jour
const pariDuJour = {
  videoId: 'dQw4w9WgXcQ',
  match: {
    home: { name: 'PSG', logo: 'https://media.api-sports.io/football/teams/85.png' },
    away: { name: 'Marseille', logo: 'https://media.api-sports.io/football/teams/81.png' },
    competition: 'Ligue 1',
    competitionLogo: 'https://media.api-sports.io/football/leagues/61.png',
    date: 'DIM 26 JAN',
    time: '21:00',
    stadium: 'Parc des Princes'
  },
  prediction: 'Victoire PSG + Les deux équipes marquent',
  analysis: 'Le PSG reste sur 8 victoires consécutives à domicile. L\'OM a marqué lors de ses 6 derniers déplacements mais concède beaucoup. Combiné idéal.',
  odds: 2.85,
  confidence: 4,
  stake: 2, // Sur 5
  tags: ['Classique', 'Ligue 1', 'Top Pick']
};

// Picks secondaires
const secondaryPicks = [
  {
    id: 1,
    match: { home: 'Real Madrid', away: 'Atlético' },
    competition: 'Liga',
    time: 'SAM 21:00',
    prediction: 'Real Madrid gagne',
    odds: 1.75,
    confidence: 4,
    status: 'upcoming'
  },
  {
    id: 2,
    match: { home: 'Liverpool', away: 'Man City' },
    competition: 'Premier League',
    time: 'DIM 17:30',
    prediction: 'Plus de 2.5 buts',
    odds: 1.55,
    confidence: 5,
    status: 'upcoming'
  },
  {
    id: 3,
    match: { home: 'Bayern', away: 'Dortmund' },
    competition: 'Bundesliga',
    time: 'SAM 18:30',
    prediction: 'Les deux marquent',
    odds: 1.65,
    confidence: 4,
    status: 'upcoming'
  }
];

// Historique des picks
const pickHistory = [
  { id: 1, match: 'Arsenal vs Chelsea', prediction: 'Arsenal gagne', odds: 2.10, result: 'win', date: '20 Jan' },
  { id: 2, match: 'Juventus vs Inter', prediction: '+2.5 buts', odds: 1.85, result: 'win', date: '19 Jan' },
  { id: 3, match: 'Barça vs Séville', prediction: 'Barça -1.5', odds: 2.20, result: 'win', date: '18 Jan' },
  { id: 4, match: 'PSG vs Lens', prediction: 'Les deux marquent', odds: 1.90, result: 'loss', date: '17 Jan' },
  { id: 5, match: 'Man United vs Wolves', prediction: 'United gagne', odds: 1.60, result: 'win', date: '16 Jan' },
  { id: 6, match: 'Napoli vs Milan', prediction: 'Napoli gagne', odds: 2.05, result: 'win', date: '15 Jan' }
];

// Cotes boostées
const cotesBoostees = [
  { id: 1, match: 'PSG vs OM', bet: 'Mbappé & Barcola buteurs', oldOdds: 6.50, newOdds: 8.00, endsIn: 5, category: 'Ligue 1' },
  { id: 2, match: 'Real vs Barça', bet: 'Real gagne 3-1', oldOdds: 12.00, newOdds: 15.00, endsIn: 8, category: 'Liga' },
  { id: 3, match: 'Liverpool vs City', bet: 'Les 2 marquent en 1ère MT', oldOdds: 4.20, newOdds: 5.50, endsIn: 2, category: 'Premier League' },
  { id: 4, match: 'Bayern vs BVB', bet: 'Musiala buteur + Bayern gagne', oldOdds: 3.80, newOdds: 4.50, endsIn: 12, category: 'Bundesliga' },
  { id: 5, match: 'Juve vs Inter', bet: 'Match nul et -2.5 buts', oldOdds: 5.00, newOdds: 6.50, endsIn: 6, category: 'Serie A' },
  { id: 6, match: 'Ajax vs PSV', bet: 'Les 2 marquent + +3.5 buts', oldOdds: 3.20, newOdds: 4.00, endsIn: 4, category: 'Eredivisie' }
];

// Matchs à venir
const upcomingMatches = [
  { id: 1, home: 'PSG', away: 'OM', competition: 'Ligue 1', date: 'DIM', time: '21:00', hasAnalysis: true },
  { id: 2, home: 'Real Madrid', away: 'Atlético', competition: 'Liga', date: 'SAM', time: '21:00', hasAnalysis: true },
  { id: 3, home: 'Liverpool', away: 'Man City', competition: 'Premier League', date: 'DIM', time: '17:30', hasAnalysis: true },
  { id: 4, home: 'Bayern', away: 'Dortmund', competition: 'Bundesliga', date: 'SAM', time: '18:30', hasAnalysis: false },
  { id: 5, home: 'Juventus', away: 'Inter', competition: 'Serie A', date: 'DIM', time: '20:45', hasAnalysis: false }
];

// FAQ
const faqItems = [
  {
    question: 'Comment fonctionnent les picks de Momo ?',
    answer: 'Chaque jour, Momo analyse les matchs et sélectionne les meilleures opportunités. Il publie une vidéo explicative avec son analyse complète et sa prédiction. Tu peux suivre ses picks et parier sur Winamax.'
  },
  {
    question: 'Le code promo OCTOGAIN donne quoi ?',
    answer: 'Avec le code OCTOGAIN, tu reçois jusqu\'à 100€ de bonus sur ton premier dépôt. C\'est le meilleur bonus disponible chez Winamax.'
  },
  {
    question: 'Les cotes boostées durent combien de temps ?',
    answer: 'Les cotes boostées sont limitées dans le temps. Chaque offre affiche un compte à rebours. Une fois le temps écoulé, la cote revient à la normale.'
  },
  {
    question: 'Quelle est la stratégie de mise recommandée ?',
    answer: 'Momo recommande une gestion de bankroll stricte : 1-2% de ta bankroll par pari. Ne jamais chasser ses pertes et rester discipliné.'
  }
];

// ============================
// COMPOSANT
// ============================

const OctoGainWinamaxPage = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [countdowns, setCountdowns] = useState<Record<number, string>>({});
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [activeBoostCategory, setActiveBoostCategory] = useState<string>('all');

  // Countdown effect
  useEffect(() => {
    const update = () => {
      const newCountdowns: Record<number, string> = {};
      cotesBoostees.forEach(o => {
        const hours = o.endsIn;
        const mins = Math.floor(Math.random() * 60);
        const secs = Math.floor(Math.random() * 60);
        newCountdowns[o.id] = `${hours}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
      });
      setCountdowns(newCountdowns);
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText('OCTOGAIN');
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Filter boosted odds
  const boostCategories = ['all', ...new Set(cotesBoostees.map(c => c.category))];
  const filteredBoosts = activeBoostCategory === 'all'
    ? cotesBoostees
    : cotesBoostees.filter(c => c.category === activeBoostCategory);

  // Visible history
  const visibleHistory = showAllHistory ? pickHistory : pickHistory.slice(0, 4);

  return (
    <>
      <SEO
        title="Paris Sérieux | OctoGain x Winamax"
        description="Le pari du jour par Momo, cotes boostées et code promo Winamax. 68% de winrate, +12% ROI."
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
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[200px]" />
          <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[180px]" />
        </div>

        {/* Header */}
        <header className="relative z-10 pt-28 pb-8 px-6">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/octogain"
              className="inline-flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-colors mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETOUR</span>
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight">PARIS SÉRIEUX</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/40 text-sm">avec</span>
                    <img src={WINAMAX_LOGO} alt="Winamax" className="h-6" />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-2xl font-black text-cyan-400">{momoStats.winRate}%</p>
                  <p className="text-xs text-white/40 uppercase">Win Rate</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-black text-green-400">+{momoStats.roi}%</p>
                  <p className="text-xs text-white/40 uppercase">ROI</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <p className="text-2xl font-black text-orange-400">{momoStats.currentStreak}</p>
                  </div>
                  <p className="text-xs text-white/40 uppercase">Série</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <section className="relative z-10 py-4 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-cyan-400" />
                <span className="text-white/60">{momoStats.totalPicks} picks analysés</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-white/60">Cote moyenne : {momoStats.avgOdds}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white/60">Ce mois : <span className="text-green-400 font-bold">{momoStats.monthlyProfit}</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* Le Pari de Momo - Principal */}
        <section className="relative z-10 py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-wide">Le Pick du Jour</h2>
                    <p className="text-white/40 text-sm">Par Momo</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {pariDuJour.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 text-xs font-bold uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-500/30 to-transparent">
                <div className="bg-[#0d0d15] rounded-2xl overflow-hidden">
                  <div className="grid lg:grid-cols-2">
                    {/* Video */}
                    <div className="relative aspect-video lg:aspect-auto lg:min-h-[450px] bg-black">
                      {showVideo ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${pariDuJour.videoId}?autoplay=1`}
                          className="absolute inset-0 w-full h-full"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <div className="absolute inset-0 group cursor-pointer" onClick={() => setShowVideo(true)}>
                          <img
                            src={`https://img.youtube.com/vi/${pariDuJour.videoId}/maxresdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              className="w-20 h-20 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/40"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Play className="w-8 h-8 text-black ml-1" fill="black" />
                            </motion.div>
                          </div>
                          <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-white font-bold text-lg mb-1">VOIR L'ANALYSE COMPLÈTE</p>
                            <p className="text-white/50 text-sm">Momo t'explique son pick en détail</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-6 lg:p-8 flex flex-col">
                      {/* Competition Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <img src={pariDuJour.match.competitionLogo} alt="" className="w-5 h-5" />
                        <span className="text-cyan-400 text-sm font-bold">{pariDuJour.match.competition}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white/50 text-sm">{pariDuJour.match.stadium}</span>
                      </div>

                      {/* Match */}
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <img src={pariDuJour.match.home.logo} alt="" className="w-12 h-12" />
                          <span className="text-xl font-bold">{pariDuJour.match.home.name}</span>
                        </div>
                        <div className="text-center px-4">
                          <p className="text-white/30 text-xs uppercase mb-1">VS</p>
                          <p className="text-white/60 text-sm font-medium">{pariDuJour.match.date}</p>
                          <p className="text-cyan-400 font-bold">{pariDuJour.match.time}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold">{pariDuJour.match.away.name}</span>
                          <img src={pariDuJour.match.away.logo} alt="" className="w-12 h-12" />
                        </div>
                      </div>

                      {/* Prediction */}
                      <div className="mb-4">
                        <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">PRÉDICTION</p>
                        <p className="text-2xl font-black">{pariDuJour.prediction}</p>
                      </div>

                      {/* Analysis */}
                      <div className="mb-6 p-4 bg-white/[0.03] rounded-xl border border-white/5">
                        <p className="text-white/70 text-sm leading-relaxed">{pariDuJour.analysis}</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
                          <p className="text-3xl font-black text-cyan-400">{pariDuJour.odds}</p>
                          <p className="text-xs text-white/40 uppercase mt-1">Cote</p>
                        </div>
                        <div className="text-center p-3 bg-white/[0.03] rounded-xl border border-white/5">
                          <div className="flex justify-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className={`w-4 h-1.5 rounded-full ${i < pariDuJour.confidence ? 'bg-cyan-400' : 'bg-white/10'}`} />
                            ))}
                          </div>
                          <p className="text-xs text-white/40 uppercase">Confiance</p>
                        </div>
                        <div className="text-center p-3 bg-white/[0.03] rounded-xl border border-white/5">
                          <div className="flex justify-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className={`w-4 h-1.5 rounded-full ${i < pariDuJour.stake ? 'bg-yellow-400' : 'bg-white/10'}`} />
                            ))}
                          </div>
                          <p className="text-xs text-white/40 uppercase">Mise</p>
                        </div>
                      </div>

                      {/* CTA */}
                      <a
                        href="https://www.winamax.fr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold rounded-xl hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-lg shadow-cyan-500/25 mt-auto"
                      >
                        <span>PARIER SUR WINAMAX</span>
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Picks Secondaires */}
        <section className="relative z-10 py-8">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-black uppercase tracking-wide">Autres Picks</h2>
                <span className="text-white/40 text-sm ml-2">({secondaryPicks.length})</span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {secondaryPicks.map((pick) => (
                  <motion.div
                    key={pick.id}
                    className="relative p-[1px] rounded-xl bg-gradient-to-br from-white/20 to-transparent hover:from-cyan-500/50 transition-all"
                    whileHover={{ y: -2 }}
                  >
                    <div className="bg-[#0d0d15] rounded-xl p-5 h-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-cyan-400 font-bold uppercase">{pick.competition}</span>
                        <span className="text-xs text-white/40">{pick.time}</span>
                      </div>

                      <p className="font-bold mb-2">{pick.match.home} vs {pick.match.away}</p>
                      <p className="text-white/60 text-sm mb-4">{pick.prediction}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-cyan-400">{pick.odds}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${i < pick.confidence ? 'bg-cyan-400' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </div>
                        <a
                          href="https://www.winamax.fr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Historique des Picks */}
        <section className="relative z-10 py-8">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-black uppercase tracking-wide">Historique</h2>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {pickHistory.filter(p => p.result === 'win').length} gagnés
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <XCircle className="w-4 h-4" />
                    {pickHistory.filter(p => p.result === 'loss').length} perdus
                  </span>
                </div>
              </div>

              <div className="relative p-[1px] rounded-xl bg-gradient-to-br from-white/10 to-transparent">
                <div className="bg-[#0d0d15] rounded-xl overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {visibleHistory.map((pick) => (
                      <div key={pick.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            pick.result === 'win' ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {pick.result === 'win' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold">{pick.match}</p>
                            <p className="text-white/50 text-sm">{pick.prediction}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${pick.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                            {pick.odds}
                          </p>
                          <p className="text-white/40 text-xs">{pick.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {pickHistory.length > 4 && (
                    <button
                      onClick={() => setShowAllHistory(!showAllHistory)}
                      className="w-full py-3 flex items-center justify-center gap-2 text-cyan-400 hover:bg-white/[0.02] transition-colors border-t border-white/5"
                    >
                      <span className="text-sm font-bold">{showAllHistory ? 'Voir moins' : 'Voir tout l\'historique'}</span>
                      {showAllHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cotes Boostées */}
        <section className="relative z-10 py-10">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-black uppercase tracking-wide">Cotes Boostées</h2>
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded animate-pulse">LIVE</span>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {boostCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveBoostCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase whitespace-nowrap transition-all ${
                      activeBoostCategory === cat
                        ? 'bg-cyan-500 text-black'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {cat === 'all' ? 'Tous' : cat}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredBoosts.map((offer) => (
                    <motion.div
                      key={offer.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative p-[1px] rounded-xl bg-gradient-to-br from-cyan-500/50 to-transparent"
                    >
                      <div className="bg-[#0d0d15] rounded-xl p-5 h-full">
                        {/* Timer */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs text-white/40 uppercase font-bold">{offer.category}</span>
                          <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 rounded">
                            <Clock className="w-3 h-3 text-red-400" />
                            <span className="text-red-400 font-mono font-bold text-xs">{countdowns[offer.id]}</span>
                          </div>
                        </div>

                        {/* Match & Bet */}
                        <p className="text-white/60 text-sm mb-1">{offer.match}</p>
                        <p className="font-bold mb-4">{offer.bet}</p>

                        {/* Odds */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-white/30 line-through text-lg">{offer.oldOdds}</span>
                          <TrendingUp className="w-5 h-5 text-cyan-400" />
                          <span className="text-3xl font-black text-cyan-400">{offer.newOdds}</span>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                            +{Math.round((offer.newOdds - offer.oldOdds) / offer.oldOdds * 100)}%
                          </span>
                        </div>

                        {/* CTA */}
                        <a
                          href="https://www.winamax.fr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/20 transition-colors"
                        >
                          <span>PROFITER</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Matchs à Venir */}
        <section className="relative z-10 py-8">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-black uppercase tracking-wide">Matchs à Venir</h2>
              </div>

              <div className="relative p-[1px] rounded-xl bg-gradient-to-br from-white/10 to-transparent">
                <div className="bg-[#0d0d15] rounded-xl overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {upcomingMatches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-center w-16">
                            <p className="text-white/40 text-xs uppercase">{match.date}</p>
                            <p className="text-cyan-400 font-bold">{match.time}</p>
                          </div>
                          <div>
                            <p className="font-bold">{match.home} vs {match.away}</p>
                            <p className="text-white/50 text-sm">{match.competition}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {match.hasAnalysis && (
                            <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 text-xs font-bold">
                              ANALYSE DISPO
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 text-white/30" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Code Promo - Hero */}
        <section className="relative z-10 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 overflow-hidden">
                {/* Animated border */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-500 animate-gradient-x" />

                <div className="relative bg-[#0a0a0f] rounded-3xl p-8 sm:p-12">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Gift className="w-6 h-6 text-cyan-400" />
                        <span className="text-cyan-400 font-bold uppercase text-sm">Offre Exclusive</span>
                      </div>

                      <h2 className="text-4xl sm:text-5xl font-black mb-4">
                        100€ <span className="text-cyan-400">OFFERTS</span>
                      </h2>

                      <p className="text-white/60 mb-6 text-lg">
                        Inscris-toi sur Winamax avec notre code et reçois jusqu'à 100€ de bonus sur ton premier dépôt.
                      </p>

                      {/* Steps */}
                      <div className="space-y-3">
                        {[
                          'Clique sur le bouton ci-dessous',
                          'Crée ton compte Winamax',
                          'Entre le code OCTOGAIN',
                          'Dépose et reçois ton bonus'
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">
                              {i + 1}
                            </div>
                            <span className="text-white/80">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-center">
                      <img src={WINAMAX_LOGO} alt="Winamax" className="h-16 mx-auto mb-6" />

                      {/* Code Box */}
                      <div
                        className="inline-flex items-center gap-4 px-8 py-5 bg-black border-2 border-cyan-500/50 rounded-2xl mb-6 cursor-pointer hover:border-cyan-400 transition-colors group"
                        onClick={copyCode}
                      >
                        <div>
                          <span className="text-white/40 text-sm block mb-1">Code promo</span>
                          <span className="text-3xl font-mono font-black text-cyan-400 tracking-widest">OCTOGAIN</span>
                        </div>
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                          {codeCopied ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5 text-cyan-400" />
                          )}
                        </div>
                      </div>
                      {codeCopied && (
                        <p className="text-green-400 text-sm mb-4">Code copié !</p>
                      )}

                      <a
                        href="https://www.winamax.fr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold rounded-xl hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-lg shadow-cyan-500/30"
                      >
                        <span className="text-lg">S'INSCRIRE MAINTENANT</span>
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Discord CTA */}
        <section className="relative z-10 py-8">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-indigo-500/50">
                <div className="bg-[#0d0d15] rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-black mb-2">REJOINS LA COMMUNAUTÉ</h3>
                      <p className="text-white/60">Alertes picks, discussions, conseils... Rejoins +10 000 parieurs sur Discord.</p>
                    </div>
                    <a
                      href="https://discord.gg/octogoal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-colors"
                    >
                      <Users className="w-5 h-5" />
                      <span>REJOINDRE</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative z-10 py-10">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-8">
                <Info className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-black uppercase tracking-wide">Questions Fréquentes</h2>
              </div>

              <div className="space-y-3">
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative p-[1px] rounded-xl bg-gradient-to-br from-white/10 to-transparent"
                  >
                    <div className="bg-[#0d0d15] rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="font-bold pr-4">{item.question}</span>
                        {expandedFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-5 text-white/60 leading-relaxed border-t border-white/5 pt-4">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="relative z-10 py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-xl">
              <Shield className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/60 mb-2">
                  <span className="text-white font-bold">18+ | Joue responsable</span>
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  Les jeux d'argent sont interdits aux mineurs. Jouer comporte des risques : endettement, isolement, dépendance.
                  Appelez le <span className="text-white">09 74 75 13 13</span> (appel non surtaxé).
                  Site agréé par l'ANJ. Les paris sportifs comportent des risques de perte.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Custom styles */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default OctoGainWinamaxPage;
