import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Trophy, Users, Laugh, Globe } from 'lucide-react';

// Clip-paths octogonaux
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';

interface CategoryHeroSectionProps {
  categorySlug?: string;
}

// Configuration unifiée avec couleurs pink-to-blue
const categoryDetails = {
  actus: {
    title: "Toute l'actu foot",
    description: "Les dernières news du football français et européen. Transferts, résultats, déclarations et buzz.",
    icon: Newspaper,
    stats: { articles: '200+', lecteurs: '100K+', updates: 'Live' }
  },
  matchs: {
    title: "Les matchs en direct",
    description: "Notes, analyses, avant-matchs, résultats. Tout pour suivre les matchs comme un vrai supporter.",
    icon: Trophy,
    stats: { articles: '150+', matchs: '500+', analyses: '100+' }
  },
  joueurs: {
    title: "Les stars du ballon",
    description: "Portraits, tops, stats. Découvre les joueurs qui font vibrer le foot mondial.",
    icon: Users,
    stats: { profils: '100+', tops: '50+', legendes: '25+' }
  },
  memes: {
    title: "Le meilleur du LOL",
    description: "Les mèmes, les réactions, les moments viraux. La culture Internet du foot avec Mohamed Henni.",
    icon: Laugh,
    stats: { memes: '300+', reactions: '500+', viraux: '100+' }
  },
  clubs: {
    title: "Tous les clubs",
    description: "Infos, actualités et analyses sur tous les clubs du football français et européen.",
    icon: Globe,
    stats: { clubs: '50+', ligues: '10+', pays: '15+' }
  }
};

export const CategoryHeroSection = ({ categorySlug }: CategoryHeroSectionProps) => {
  const category = categorySlug ? categoryDetails[categorySlug as keyof typeof categoryDetails] : null;

  if (!category) return null;

  const Icon = category.icon;
  const statsEntries = Object.entries(category.stats);

  return (
    <section className="relative min-h-[50vh] flex items-center pt-32 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-pink-500/10 via-blue-500/5 to-transparent blur-3xl" />

        {/* Formes octogonales décoratives */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 right-10 w-[300px] h-[300px] border-2 border-pink-500/30"
          style={{ clipPath: octagonClip }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-10 left-10 w-[200px] h-[200px] border border-blue-500/20"
          style={{ clipPath: octagonClip }}
        />
      </div>

      <div className="container relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          {/* Category Badge octogonal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div
              className="p-3 bg-gradient-to-br from-pink-500 to-blue-500 shadow-lg shadow-pink-500/30"
              style={{ clipPath: octagonClip }}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <span
              className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-pink-500/30 text-white font-bold uppercase tracking-wider text-sm"
              style={{ clipPath: octagonClipSubtle }}
            >
              {categorySlug?.charAt(0).toUpperCase()}{categorySlug?.slice(1)}
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-white">{category.title.split(' ').slice(0, -1).join(' ')} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
              {category.title.split(' ').slice(-1)}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-400 max-w-2xl mb-10">
            {category.description}
          </p>

          {/* Stats octogonaux */}
          <div className="flex flex-wrap gap-4">
            {statsEntries.map(([label, value], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-4 text-center"
                style={{ clipPath: octagonClipSubtle }}
              >
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                  {value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Icône flottante décorative */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2"
        >
          <div
            className="w-48 h-48 bg-gradient-to-br from-pink-500/20 to-blue-500/20 flex items-center justify-center"
            style={{ clipPath: octagonClip }}
          >
            <Icon className="w-24 h-24 text-white/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryHeroSection;
