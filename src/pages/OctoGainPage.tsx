// src/pages/OctoGainPage.tsx
// Page OctoGain - Style Gaming/Esport

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Gamepad2, Target, ChevronRight, Sparkles } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';

const WINAMAX_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/3/31/Logo_winamax_1080x1080px.png';

const OctoGainPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <SEO
        title="OctoGain | Les paris qui rapportent"
        description="Paris sérieux Winamax ou paris fun avec OctoCoins. Choisis ton camp."
      />

      <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">

        {/* Animated background */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />

          {/* Glow follow cursor */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[150px] transition-all duration-1000 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%)',
              left: mousePos.x - 300,
              top: mousePos.y - 300,
            }}
          />

          {/* Static glows */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[150px]" />
        </div>

        {/* Main Content */}
        <section className="relative min-h-screen flex flex-col pt-24">

          {/* Header */}
          <div className="relative z-10 text-center py-12 px-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Glitch title */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6">
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400 bg-clip-text text-transparent">
                    LES PARIS
                  </span>
                </span>
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-white">QUI RAPPORTENT</span>
                  {/* Underline glow */}
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500" />
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 blur-sm" />
                </span>
              </h1>

              {/* avec Winamax */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-white/40 text-lg">avec</span>
                <img src={WINAMAX_LOGO} alt="Winamax" className="h-10 object-contain" />
              </div>
            </motion.div>
          </div>

          {/* Two choices - Cards */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-20">
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl w-full">

              {/* Paris Sérieux */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/octogain/winamax" className="group block h-full">
                  <div className="relative h-full p-[2px] rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-500/50 to-transparent overflow-hidden">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    <div className="relative h-full bg-[#0d0d15] rounded-2xl p-8 overflow-hidden">
                      {/* Corner accent */}
                      <div className="absolute top-0 right-0 w-32 h-32">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-500/20 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <Target className="w-8 h-8 text-cyan-400" />
                        </div>
                      </div>

                      {/* Scan line effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan" />
                      </div>

                      {/* Content */}
                      <div className="relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                          <Zap className="w-3 h-3" />
                          Winamax
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-black mb-4 group-hover:text-cyan-400 transition-colors">
                          PARIS SÉRIEUX
                        </h2>

                        <p className="text-white/50 mb-8 leading-relaxed">
                          Le pari du jour par Momo, cotes boostées et code promo exclusif. Du vrai betting.
                        </p>

                        <ul className="space-y-3 mb-8">
                          {['Pick de Momo en vidéo', 'Cotes boostées', '100€ offerts'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/70">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rotate-45" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center gap-2 text-cyan-400 font-bold group-hover:gap-4 transition-all">
                          <span>PARIER</span>
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Bottom line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Paris Fun */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link to="/octogain/octobets" className="group block h-full">
                  <div className="relative h-full p-[2px] rounded-2xl bg-gradient-to-br from-fuchsia-500 via-fuchsia-500/50 to-transparent overflow-hidden">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    <div className="relative h-full bg-[#0d0d15] rounded-2xl p-8 overflow-hidden">
                      {/* Corner accent */}
                      <div className="absolute top-0 right-0 w-32 h-32">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-fuchsia-500/20 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <Gamepad2 className="w-8 h-8 text-fuchsia-400" />
                        </div>
                      </div>

                      {/* Scan line effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-500/5 to-transparent animate-scan" />
                      </div>

                      {/* Content */}
                      <div className="relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded text-fuchsia-400 text-xs font-bold uppercase tracking-wider mb-6">
                          <Sparkles className="w-3 h-3" />
                          OctoBets
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-black mb-4 group-hover:text-fuchsia-400 transition-colors">
                          PARIS FUN
                        </h2>

                        <p className="text-white/50 mb-8 leading-relaxed">
                          Parie avec des OctoCoins sur des situations délirantes. Gagne de vrais cadeaux.
                        </p>

                        <ul className="space-y-3 mb-8">
                          {['Paris décalés', 'Classement mensuel', 'TV, maillots, crédits'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/70">
                              <div className="w-1.5 h-1.5 bg-fuchsia-400 rotate-45" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center gap-2 text-fuchsia-400 font-bold group-hover:gap-4 transition-all">
                          <span>JOUER</span>
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Bottom line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </motion.div>

            </div>
          </div>

          {/* Bottom text */}
          <div className="relative z-10 text-center pb-8 px-6">
            <p className="text-white/20 text-xs uppercase tracking-widest">
              18+ • Joue responsable
            </p>
          </div>
        </section>

        <Footer />
      </div>

      {/* Custom styles for scan animation */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default OctoGainPage;
