import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Zap, 
  Newspaper, 
  Trophy, 
  Users, 
  Laugh,
  TrendingUp,
  Star,
  Calendar,
  BarChart3,
  FileText,
  Crown,
  Flame,
  Camera,
  MessageCircle,
  Globe,
  Award
} from 'lucide-react';
import { getUniverses, getSubcategoriesGrouped } from '../../utils/sanityAPI';
import { LoadingSpinner } from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

// Configuration des univers OCTOGOAL
const universeConfig = [
  {
    _id: '1',
    title: 'Actus',
    subtitle: 'Toute l\'actu foot',
    description: 'Les dernières news du foot français et européen. Transferts, résultats, déclarations.',
    slug: { current: 'actus' },
    stats: '200+ actus',
    icon: Newspaper,
    subcategories: [
      { title: 'Ligue 1', slug: 'ligue-1', icon: Globe },
      { title: 'Premier League', slug: 'premier-league', icon: Globe },
      { title: 'Liga', slug: 'liga', icon: Globe },
      { title: 'Champions League', slug: 'champions-league', icon: Trophy },
      { title: 'Mercato', slug: 'mercato', icon: TrendingUp }
    ]
  },
  {
    _id: '2',
    title: 'Matchs',
    subtitle: 'Les compétitions',
    description: 'Notes, analyses, avant-matchs, résultats. Tout pour suivre les matchs comme un vrai.',
    slug: { current: 'matchs' },
    stats: '150+ matchs',
    icon: Trophy,
    subcategories: [
      { title: 'Résultats', slug: 'resultats', icon: BarChart3 },
      { title: 'Notes du match', slug: 'notes', icon: Star },
      { title: 'Avant-match', slug: 'avant-match', icon: Calendar },
      { title: 'Après-match', slug: 'apres-match', icon: FileText },
      { title: 'Compos', slug: 'compos', icon: Users }
    ]
  },
  {
    _id: '3',
    title: 'Joueurs',
    subtitle: 'Les stars du ballon',
    description: 'Portraits, tops, stats. Découvre les joueurs qui font vibrer le foot mondial.',
    slug: { current: 'joueurs' },
    stats: '100+ profils',
    icon: Users,
    subcategories: [
      { title: 'Tops joueurs', slug: 'tops-joueurs', icon: Award },
      { title: 'Joueurs en forme', slug: 'en-forme', icon: Flame },
      { title: 'Fiches joueurs', slug: 'fiches', icon: FileText },
      { title: 'Légendes', slug: 'legendes', icon: Crown },
      { title: 'Pépites', slug: 'pepites', icon: Star }
    ]
  },
  {
    _id: '4',
    title: 'Mèmes',
    subtitle: 'Le meilleur du LOL',
    description: 'Les mèmes, les réactions, les moments viraux. La culture Internet du foot.',
    slug: { current: 'memes' },
    stats: '300+ mèmes',
    icon: Laugh,
    subcategories: [
      { title: 'Réactions', slug: 'reactions', icon: MessageCircle },
      { title: 'Captures virales', slug: 'captures', icon: Camera },
      { title: 'Best of Octogoal', slug: 'best-of', icon: Award },
      { title: 'Culture foot', slug: 'culture-foot', icon: Globe },
      { title: 'La tête de Momo', slug: 'tete-momo', icon: Laugh }
    ]
  }
];

// Styles par univers
const universeStyles = {
  actus: {
    gradient: 'from-rose-500 to-pink-600',
    lightGradient: 'from-rose-500/20 to-pink-600/20',
    glow: 'shadow-rose-500/20',
    border: 'border-rose-500/30',
    hoverBorder: 'hover:border-rose-400/50',
    text: 'text-rose-400',
    bg: 'bg-rose-500/10'
  },
  matchs: {
    gradient: 'from-blue-500 to-indigo-600',
    lightGradient: 'from-blue-500/20 to-indigo-600/20',
    glow: 'shadow-blue-500/20',
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-400/50',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  joueurs: {
    gradient: 'from-emerald-500 to-teal-600',
    lightGradient: 'from-emerald-500/20 to-teal-600/20',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-400/50',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  memes: {
    gradient: 'from-amber-500 to-orange-600',
    lightGradient: 'from-amber-500/20 to-orange-600/20',
    glow: 'shadow-amber-500/20',
    border: 'border-amber-500/30',
    hoverBorder: 'hover:border-amber-400/50',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10'
  }
};

export const EditorialSection = () => {
  const [activeUniverse, setActiveUniverse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStyle = (slug: string) => {
    return universeStyles[slug as keyof typeof universeStyles] || universeStyles.actus;
  };

  return (
    <ErrorBoundary>
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-500/5 to-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8"
            >
              <Zap className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-gray-300 font-medium">Explore nos univers</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="text-white">Tout le </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                foot
              </span>
              <br />
              <span className="text-white">en un clic</span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Actus, matchs, joueurs, mèmes... Choisis ton univers et plonge dans le meilleur du foot
            </p>
          </motion.div>

          {/* Grille des univers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {universeConfig.map((universe, index) => {
              const style = getStyle(universe.slug.current);
              const Icon = universe.icon;
              const isActive = activeUniverse === universe.slug.current;

              return (
                <motion.div
                  key={universe._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setActiveUniverse(universe.slug.current)}
                  onMouseLeave={() => setActiveUniverse(null)}
                >
                  <Link
                    to={`/rubrique/${universe.slug.current}`}
                    className="block h-full"
                  >
                    <div className={`
                      relative h-full p-6 rounded-2xl
                      bg-gradient-to-b from-white/[0.08] to-white/[0.02]
                      backdrop-blur-xl
                      border ${style.border} ${style.hoverBorder}
                      transition-all duration-500
                      hover:shadow-2xl ${style.glow}
                      hover:-translate-y-2
                      group
                    `}>
                      {/* Glow effect on hover */}
                      <div className={`
                        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                        bg-gradient-to-b ${style.lightGradient}
                      `} />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className={`
                            p-3 rounded-xl bg-gradient-to-br ${style.gradient}
                            shadow-lg group-hover:scale-110 transition-transform duration-300
                          `}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          
                          <span className={`
                            text-xs font-medium px-3 py-1 rounded-full
                            bg-white/5 border border-white/10
                            ${style.text}
                          `}>
                            {universe.stats}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="mb-4">
                          <h3 className={`
                            text-2xl font-bold mb-1
                            text-transparent bg-clip-text bg-gradient-to-r ${style.gradient}
                          `}>
                            {universe.title}
                          </h3>
                          <p className="text-sm text-gray-500">{universe.subtitle}</p>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-2">
                          {universe.description}
                        </p>

                        {/* Subcategories */}
                        <div className="space-y-2 mb-6">
                          {universe.subcategories.slice(0, 5).map((subcat, idx) => {
                            const SubIcon = subcat.icon;
                            return (
                              <Link
                                key={subcat.slug}
                                to={`/rubrique/${universe.slug.current}/${subcat.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="block group/sub"
                              >
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className={`
                                    flex items-center gap-3 p-2.5 rounded-xl
                                    bg-white/[0.03] border border-white/5
                                    hover:bg-white/[0.08] hover:border-white/10
                                    transition-all duration-300
                                    group-hover/sub:translate-x-1
                                  `}
                                >
                                  <div className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center
                                    bg-gradient-to-br ${style.lightGradient}
                                  `}>
                                    <SubIcon className={`w-4 h-4 ${style.text}`} />
                                  </div>
                                  <span className="text-sm text-gray-300 flex-1 font-medium">
                                    {subcat.title}
                                  </span>
                                  <ArrowUpRight className={`
                                    w-4 h-4 ${style.text} opacity-0 
                                    group-hover/sub:opacity-100 transition-opacity
                                  `} />
                                </motion.div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* CTA */}
                        <div className={`
                          flex items-center gap-2 text-sm font-semibold
                          ${style.text} group-hover:gap-3 transition-all
                        `}>
                          <span>Explorer</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className={`
                        absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl
                        bg-gradient-to-r ${style.gradient}
                        transform scale-x-0 group-hover:scale-x-100
                        transition-transform duration-500 origin-left
                      `} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {universeConfig.map((universe) => {
              const style = getStyle(universe.slug.current);
              const Icon = universe.icon;
              const isActive = activeUniverse === universe.slug.current;
              
              return (
                <Link
                  key={universe._id}
                  to={`/rubrique/${universe.slug.current}`}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                    font-medium text-sm transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${style.gradient} text-white shadow-lg ${style.glow}` 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }
                  `}
                  onMouseEnter={() => setActiveUniverse(universe.slug.current)}
                  onMouseLeave={() => setActiveUniverse(null)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{universe.title}</span>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default EditorialSection;