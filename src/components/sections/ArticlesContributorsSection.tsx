import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const contributors = [
  {
    name: "Équipe Octogoal",
    role: "Rédaction",
    image: "/LOGO_OCTOGOAL.png",
    articles: 45,
    bio: "L'équipe éditoriale Octogoal vous propose le meilleur du sport, clash et divertissement."
  },
  {
    name: "Marie Laurent",
    role: "Experte Business",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    articles: 28,
    bio: "Spécialiste en stratégie d'entreprise et innovation."
  },
  {
    name: "Thomas Dubois",
    role: "Expert Tech",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    articles: 32,
    bio: "Passionné de technologie et d'innovation."
  }
];

export const ArticlesContributorsSection = () => {
  return (
    <section className="container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">L'équipe éditoriale</h2>
          <p className="text-tertiary">Une équipe de rédacteurs passionnés qui partagent leur expertise</p>
        </div>
        <Link
          to="/about"
          className="flex items-center gap-2 text-accent-fuchsia hover:text-accent-cyan transition-colors"
        >
          <span>En savoir plus</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contributors.map((contributor, index) => (
          <motion.div
            key={contributor.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={contributor.image}
                  alt={contributor.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg">{contributor.name}</h3>
                  <p className="text-sm text-accent-violet">{contributor.role}</p>
                </div>
              </div>
              
              <p className="text-sm text-tertiary mb-4">{contributor.bio}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-tertiary">{contributor.articles} articles</span>
                <Link
                  to={`/author/${contributor.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-accent-fuchsia hover:text-accent-cyan transition-colors flex items-center gap-1"
                >
                  <span>Voir le profil</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ArticlesContributorsSection;