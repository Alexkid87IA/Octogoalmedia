import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Clock, Calendar } from 'lucide-react';
import SafeImage from './SafeImage';

interface PodcastCardProps {
  title: string;
  guest: string;
  duration: string;
  date: string;
  summary: string;
  audioUrl: string;
  image: string;
}

export const PodcastCard = ({
  title,
  guest,
  duration,
  date,
  summary,
  audioUrl,
  image,
}: PodcastCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-neutral-900 rounded-lg overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-48">
          <SafeImage
            source={image}
            alt={`${guest} - Podcast Octogoal`}
            width={192}
            height={192}
            className="w-full h-full object-cover"
            fallbackText="Podcast"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-accent-fuchsia font-inter mb-4">{guest}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="bg-accent-violet hover:bg-accent-fuchsia text-white p-3 rounded-full transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>
          </div>
          <p className="text-tertiary mb-4 line-clamp-2">{summary}</p>
          <div className="flex gap-4 text-sm text-tertiary">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <time dateTime={date}>{new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</time>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
