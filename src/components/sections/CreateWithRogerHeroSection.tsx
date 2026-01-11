import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const CreateWithRogerHeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-40">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,164,249,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,253,253,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,164,249,0.15),transparent_50%)]" />
      </div>
      
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="container relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-medium mb-6"
            >
              Production de contenu premium
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-montserrat font-bold leading-tight mb-6">
              Créez du contenu qui<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-turquoise to-accent-turquoise">
                convertit et inspire
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-tertiary max-w-2xl mb-8">
              Une expérience de création unique avec Roger pour transformer votre expertise en contenu professionnel qui attire, engage et convertit votre audience idéale.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#offers"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-blue to-accent-turquoise hover:from-accent-turquoise hover:to-accent-blue text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                <span>Découvrir l'offre</span>
                <ArrowRight size={20} />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#showreel"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                <Play size={20} />
                <span>Voir le showreel</span>
              </motion.a>
            </div>
          </div>

          {/* Right Column - Featured Video */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 via-accent-turquoise/20 to-accent-turquoise/20 opacity-50" />
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80"
                alt="Studio Octogoal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-accent-blue rounded-full flex items-center justify-center shadow-lg hover:bg-accent-turquoise transition-colors group"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-accent-blue rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <Play size={32} className="text-white relative z-10 ml-1" />
                </div>
              </motion.button>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent">
                <h3 className="text-xl font-bold mb-2">Créez votre histoire</h3>
                <p className="text-sm text-tertiary">
                  Découvrez comment nous transformons votre expertise en contenu premium qui vous démarque
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};