import React from 'react';
import { motion } from 'framer-motion';
import { VideoEmbed } from '../common/VideoEmbed';

const latestEpisode = {
  id: '6mD_n_H88Zk',
  title: "L'innovation au service de l'humain",
  guest: "Octogoal",
  duration: "55 min",
  date: "2024-03-21",
  summary: "Dans cet épisode spécial, nous explorons comment l'innovation peut être mise au service de l'humain. Une réflexion profonde sur les enjeux et les opportunités de la transformation digitale.",
  embedUrl: "https://www.youtube.com/embed/6mD_n_H88Zk"
};

export const EmissionsLatestSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mb-20"
    >
      <div className="bg-neutral-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5">
        <div className="aspect-video">
          <VideoEmbed url={latestEpisode.embedUrl} title={latestEpisode.title} />
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2">
            {latestEpisode.title}
          </h2>
          <p className="text-accent-fuchsia font-inter mb-4">
            {latestEpisode.guest}
          </p>
          <p className="text-tertiary mb-6">
            {latestEpisode.summary}
          </p>
          <div className="flex gap-4 text-sm text-tertiary">
            <span>{latestEpisode.duration}</span>
            <time dateTime={latestEpisode.date}>
              {new Date(latestEpisode.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>
      </div>
    </motion.section>
  );
};