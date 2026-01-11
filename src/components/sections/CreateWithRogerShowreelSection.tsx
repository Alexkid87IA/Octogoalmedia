import React from 'react';
import { motion } from 'framer-motion';
import { VideoEmbed } from '../common/VideoEmbed';

export const CreateWithRogerShowreelSection = () => {
  return (
    <section id="showreel" className="container py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="inline-block px-4 py-2 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-medium mb-6">
          Showreel
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Notre travail en action
        </h2>
        <p className="text-lg text-tertiary max-w-2xl mx-auto">
          Découvrez la qualité de nos productions à travers ce showreel
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-neutral-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5"
      >
        <div className="aspect-video">
          <VideoEmbed
            url="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Showreel Octogoal Production"
          />
        </div>
      </motion.div>
    </section>
  );
};