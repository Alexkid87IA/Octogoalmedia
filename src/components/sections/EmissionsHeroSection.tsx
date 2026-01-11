import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const EmissionsHeroSection = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center pt-40">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="container relative z-10"
      >
        <span className="inline-block px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-full mb-6">
          Émissions
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold leading-tight mb-6 max-w-3xl">
          L'émission Octogoal
        </h1>
        <p className="text-xl text-tertiary max-w-2xl mb-8">
          Des conversations profondes avec des personnalités incroyables. Des parcours, des idées, des vies à contre-courant.
        </p>
      </motion.div>
    </section>
  );
};