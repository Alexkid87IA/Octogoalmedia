import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, Users, Mic2, Zap, Play, Radio, MessageCircle, PhoneCall, Volume2 } from 'lucide-react';

// Configuration du lien de participation
export const PARTICIPATION_LINK = 'https://forms.gle/octogoal-emission-placeholder';

// Clip-path octogonal
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';

// Composant Waveform animée
const AnimatedWaveform = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-[3px] ${className}`}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-pink-500 to-blue-500 rounded-full"
          animate={{
            height: [8, 24 + Math.random() * 20, 8],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
};

// Composant Stats Ticker
const StatsTicker = () => {
  const stats = [
    { icon: Users, value: '500K+', label: 'Viewers par émission' },
    { icon: PhoneCall, value: '50+', label: 'Appels en direct' },
    { icon: Zap, value: '2h30', label: 'De débat intense' },
    { icon: MessageCircle, value: '10K+', label: 'Messages live' },
  ];

  return (
    <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + index * 0.1 }}
          className="group flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-500/30 transition-all duration-300"
        >
          <div className="p-2 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-lg group-hover:from-pink-500/30 group-hover:to-blue-500/30 transition-colors">
            <stat.icon className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <div className="text-white font-bold text-lg">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const EmissionHero = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const [isLive, setIsLive] = useState(false);

  // Simuler un état "live" aléatoire pour la démo
  useEffect(() => {
    const checkLive = () => setIsLive(Math.random() > 0.7);
    checkLive();
    const interval = setInterval(checkLive, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background avec parallax */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=2070')`,
          }}
        />
        {/* Overlays multiples pour profondeur */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

        {/* Glow effects */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[120px]" />
      </motion.div>

      {/* Grille décorative */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Formes octogonales animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] border border-pink-500/20"
          style={{ clipPath: octagonClip }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-60 -left-60 w-[700px] h-[700px] border border-blue-500/10"
          style={{ clipPath: octagonClip }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/5"
          style={{ clipPath: octagonClip }}
        />
      </div>


      {/* Contenu principal */}
      <motion.div style={{ y: contentY, opacity }} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Colonne gauche - Texte */}
          <div className="text-center lg:text-left">
            {/* Live indicator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              {isLive ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2.5 h-2.5 bg-red-500 rounded-full"
                  />
                  <span className="text-red-400 text-sm font-bold uppercase tracking-wider">En direct maintenant</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full">
                  <Radio className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-400 text-sm font-semibold">Chaque semaine en live</span>
                </div>
              )}
            </motion.div>

            {/* Titre */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-[0.9]">
                <span className="block text-white">L'ÉMISSION</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                  OCTOGOAL
                </span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-6"
            >
              Défends ton club. <span className="text-pink-400">Affronte les haters.</span>
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Mohamed Henni appelle <span className="text-white font-semibold">SA</span> communauté pour
              des débats enflammés. PSG, OM, OL, Monaco...
              <span className="text-pink-400 font-semibold"> Personne n'est épargné !</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <motion.a
                href={PARTICIPATION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 overflow-hidden"
                style={{ clipPath: octagonClipSubtle }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Mic2 className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Je veux participer</span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 hover:border-pink-500/50 text-white text-lg font-semibold rounded-2xl transition-all duration-300"
              >
                <Play className="w-5 h-5 text-pink-400" />
                <span>Regarder le dernier épisode</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <StatsTicker />
            </motion.div>
          </div>

          {/* Colonne droite - Visuel dynamique */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            {/* Container principal */}
            <div className="relative aspect-[4/5] max-w-md mx-auto">

              {/* Card visuelle principale */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-pink-500/30 shadow-2xl shadow-pink-500/20 overflow-hidden"
                style={{ clipPath: octagonClip }}
              >
                {/* Image de fond */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                {/* Contenu overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  {/* Badge émission */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 backdrop-blur-sm rounded-full border border-pink-500/30">
                      <Volume2 className="w-4 h-4 text-pink-400" />
                      <span className="text-sm font-bold text-white">Épisode #47</span>
                    </div>
                    {isLive && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full">
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                        <span className="text-xs font-bold text-white uppercase">Live</span>
                      </div>
                    )}
                  </div>

                  {/* Titre émission */}
                  <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2">
                    PSG vs OM : Le Classique de tous les dangers
                  </h3>

                  {/* Waveform */}
                  <div className="flex items-center gap-4 mb-4">
                    <AnimatedWaveform className="flex-1" />
                    <span className="text-gray-400 text-sm font-medium">2:15:43</span>
                  </div>

                  {/* Play button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl font-bold text-white shadow-lg"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>Regarder l'émission</span>
                  </motion.button>
                </div>
              </div>

              {/* Éléments flottants autour */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 p-4 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-pink-500/30 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-xs text-gray-400">Appels en direct</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -right-6 p-4 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-blue-500/30 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-xs text-gray-400">Messages live</div>
                  </div>
                </div>
              </motion.div>

              {/* Cercle décoratif animé */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -z-10 inset-[-20%] border border-dashed border-pink-500/20 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-xs uppercase tracking-wider">Découvrir</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-pink-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EmissionHero;
