import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import SafeImage from '../common/SafeImage';
import ErrorBoundary from '../common/ErrorBoundary';
import { getFeaturedDebate } from '../../utils/sanityAPI';
import { SanityDebate } from '../../types/sanity';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const DebateSection = () => {
  const [debate, setDebate] = useState<SanityDebate | null>(null);
  const [userVote, setUserVote] = useState<"pour" | "contre" | null>(null);
  const [votes, setVotes] = useState({
    pour: 0,
    contre: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getFeaturedDebate();
        
        if (result) {
          setDebate(result);
          setVotes({
            pour: result.opinions.find((o) => o.position === "Pour")?.votes || 0,
            contre: result.opinions.find((o) => o.position === "Contre")?.votes || 0
          });
          // console.log("Débat récupéré depuis Sanity CMS");
        } else {
          // console.log("Aucun débat trouvé dans Sanity");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du débat:", err);
        setError("Impossible de charger le débat");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDebate();
  }, []);

  const handleVote = (position: "pour" | "contre") => {
    if (userVote === position) {
      setVotes(prev => ({
        ...prev,
        [position]: prev[position] - 1
      }));
      setUserVote(null);
    } else {
      if (userVote) {
        setVotes(prev => ({
          ...prev,
          [userVote]: prev[userVote] - 1,
          [position]: prev[position] + 1
        }));
      } else {
        setVotes(prev => ({
          ...prev,
          [position]: prev[position] + 1
        }));
      }
      setUserVote(position);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (!debate && !isLoading) {
    return null; // Ne rien afficher s'il n'y a pas de débat
  }

  if (error && !debate) {
    return (
      <section className="py-20">
        <div className="container">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <p className="mt-2">Veuillez réessayer ultérieurement.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!debate) return null;

  const totalVotes = votes.pour + votes.contre;
  const pourPercentage = totalVotes > 0 ? Math.round((votes.pour / totalVotes) * 100) : 50;
  const contrePercentage = totalVotes > 0 ? Math.round((votes.contre / totalVotes) * 100) : 50;

  return (
    <ErrorBoundary>
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-black rounded-3xl border border-white/10"
          >
            {/* Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,164,249,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,253,253,0.15),transparent_50%)]" />
            </div>

            {/* Content */}
            <div className="relative p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-medium mb-6">
                  <MessageSquare size={18} />
                  <span>Débat de la semaine</span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  {debate.title}
                </h2>

                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  {debate.description}
                </p>

                {/* Moderator */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <SafeImage
                      source={debate.moderator.image}
                      alt={debate.moderator.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {debate.moderator.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      Modérateur · {debate.moderator.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Opinions Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-12" role="group" aria-label="Opinions du débat">
                {debate.opinions.map((opinion, index) => (
                  <motion.div
                    key={opinion.position}
                    initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    {/* Author */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <SafeImage
                          source={opinion.author.image}
                          alt={opinion.author.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {opinion.author.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {opinion.author.role}
                        </div>
                      </div>
                    </div>

                    {/* Position */}
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                      opinion.position === "Pour" 
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {opinion.position}
                    </div>

                    {/* Arguments */}
                    <ul className="space-y-4 mb-6" aria-label={`Arguments ${opinion.position}`}>
                      {opinion.arguments.map((argument, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 mt-2 rounded-full bg-accent-blue flex-shrink-0" aria-hidden="true" />
                          <span className="text-gray-300">{argument}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Vote Button */}
                    <button
                      onClick={() => handleVote(opinion.position.toLowerCase() as "pour" | "contre")}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                        userVote === opinion.position.toLowerCase()
                          ? "bg-accent-blue text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                      aria-pressed={userVote === opinion.position.toLowerCase()}
                      aria-label={`Voter ${opinion.position}`}
                    >
                      {opinion.position === "Pour" ? (
                        <ThumbsUp size={18} aria-hidden="true" />
                      ) : (
                        <ThumbsDown size={18} aria-hidden="true" />
                      )}
                      <span>Voter {opinion.position}</span>
                    </button>

                    {/* Vote Count */}
                    <div className="mt-4 text-center text-sm text-gray-400">
                      {opinion.position === "Pour" ? pourPercentage : contrePercentage}% 
                      ({opinion.position === "Pour" ? votes.pour : votes.contre} votes)
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer Stats & CTA */}
              <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
                <div className="flex gap-6 text-sm text-gray-400">
                  <span>{totalVotes} votes</span>
                  <span>{debate.stats.comments} commentaires</span>
                  <span>{debate.stats.shares} partages</span>
                </div>
                <Link
                  to={`/debat/${debate.slug?.current || 'ia-entrepreneurs'}`}
                  className="inline-flex items-center gap-2 text-accent-blue hover:text-accent-turquoise transition-colors"
                  aria-label={`Voir le débat complet sur ${debate.title}`}
                >
                  <span>Voir le débat complet</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default DebateSection;