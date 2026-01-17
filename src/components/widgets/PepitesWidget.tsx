import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { getPepites, getFeaturedPepite } from '../../utils/sanityAPI';
import { SanityPlayer } from '../../types/sanity';
import SafeImage from '../common/SafeImage';

interface PepitesWidgetProps {
  limit?: number;
  showFeatured?: boolean;
  className?: string;
}

export const PepitesWidget: React.FC<PepitesWidgetProps> = ({
  limit = 5,
  showFeatured = true,
  className = ''
}) => {
  const [pepites, setPepites] = useState<SanityPlayer[]>([]);
  const [featuredPepite, setFeaturedPepite] = useState<SanityPlayer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPepites = async () => {
      try {
        const [pepitesData, featuredData] = await Promise.all([
          getPepites(limit),
          showFeatured ? getFeaturedPepite() : Promise.resolve(null)
        ]);
        setPepites(pepitesData);
        setFeaturedPepite(featuredData);
      } catch (error) {
        console.error('Erreur lors du chargement des pépites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPepites();
  }, [limit, showFeatured]);

  if (loading) {
    return (
      <div className={`bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/2"></div>
          <div className="h-20 bg-white/10 rounded"></div>
          <div className="h-20 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (pepites.length === 0 && !featuredPepite) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`bg-gradient-to-br from-amber-500/10 to-orange-500/5 backdrop-blur-md p-6 rounded-xl border border-amber-500/20 shadow-xl ${className}`}
    >
      {/* Header */}
      <h3 className="text-lg font-semibold mb-4 pb-3 border-b border-amber-500/20 text-white flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-amber-400" />
        Pépites à suivre
      </h3>

      {/* Featured Pepite */}
      {featuredPepite && showFeatured && (
        <Link
          to={`/joueur/${featuredPepite.apiFootballId}`}
          className="block mb-4 group"
        >
          <div className="relative bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-lg p-4 border border-amber-500/30 hover:border-amber-500/50 transition-all">
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs font-bold bg-amber-500 text-black rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Star
              </span>
            </div>

            <div className="flex items-center">
              {featuredPepite.photo ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/50 mr-4 flex-shrink-0">
                  <SafeImage
                    source={featuredPepite.photo}
                    alt={featuredPepite.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center border-2 border-amber-500/50 mr-4 flex-shrink-0">
                  <span className="text-2xl font-bold text-amber-400">
                    {featuredPepite.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                  {featuredPepite.name}
                </h4>
                {featuredPepite.playingStyle && (
                  <p className="text-sm text-white/70 line-clamp-2 mt-1">
                    {featuredPepite.playingStyle}
                  </p>
                )}
              </div>
            </div>

            {featuredPepite.strengths && featuredPepite.strengths.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {featuredPepite.strengths.slice(0, 3).map((strength, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-full"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      )}

      {/* Liste des autres pépites */}
      {pepites.length > 0 && (
        <div className="space-y-3">
          {pepites
            .filter(p => !featuredPepite || p._id !== featuredPepite._id)
            .slice(0, showFeatured ? limit - 1 : limit)
            .map((pepite, index) => (
              <Link
                key={pepite._id}
                to={`/joueur/${pepite.apiFootballId}`}
                className="flex items-center p-3 rounded-lg bg-black/20 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 transition-all group"
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400 mr-3 flex-shrink-0">
                  {index + 1}
                </span>

                {pepite.photo ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/30 mr-3 flex-shrink-0">
                    <SafeImage
                      source={pepite.photo}
                      alt={pepite.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 mr-3 flex-shrink-0">
                    <span className="text-sm font-bold text-amber-400">
                      {pepite.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-white group-hover:text-amber-400 transition-colors truncate text-sm">
                    {pepite.name}
                  </h5>
                  {pepite.octogoalVerdict && (
                    <p className="text-xs text-white/50 truncate">
                      {pepite.octogoalVerdict}
                    </p>
                  )}
                </div>

                <TrendingUp className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400 transition-colors flex-shrink-0 ml-2" />
              </Link>
            ))}
        </div>
      )}

      {/* Lien vers toutes les pépites */}
      <Link
        to="/joueurs?filter=pepites"
        className="mt-4 pt-3 border-t border-amber-500/20 text-amber-400 hover:text-amber-300 transition-colors flex items-center justify-center w-full text-sm font-medium group"
      >
        Voir toutes les pépites
        <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

export default PepitesWidget;
