// src/components/sections/VSPollSection.tsx
// Section VS Poll - Sondage interactif style arène pour voter entre deux options
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Check, Users, Timer, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeImage from '../common/SafeImage';
import { getFeaturedVSPoll } from '../../utils/sanityAPI';
import { SanityVSPoll } from '../../types/sanity';

export const VSPollSection: React.FC = () => {
  const [poll, setPoll] = useState<SanityVSPoll | null>(null);
  const [userVote, setUserVote] = useState<'option1' | 'option2' | null>(null);
  const [votes, setVotes] = useState({ option1: 0, option2: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setIsLoading(true);
        const result = await getFeaturedVSPoll();
        if (result) {
          setPoll(result);
          setVotes({
            option1: result.option1.votes || 0,
            option2: result.option2.votes || 0
          });
          // Vérifier si l'utilisateur a déjà voté (localStorage)
          const savedVote = localStorage.getItem(`vs-poll-${result._id}`);
          if (savedVote) {
            setUserVote(savedVote as 'option1' | 'option2');
            setHasVoted(true);
          }
        }
      } catch (error) {
        console.error('Erreur chargement VS Poll:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPoll();
  }, []);

  const handleVote = (option: 'option1' | 'option2') => {
    if (hasVoted || !poll) return;

    // Mettre à jour les votes localement
    setVotes(prev => ({
      ...prev,
      [option]: prev[option] + 1
    }));
    setUserVote(option);
    setHasVoted(true);

    // Sauvegarder le vote
    localStorage.setItem(`vs-poll-${poll._id}`, option);

    // TODO: Envoyer le vote au serveur (Sanity ou autre backend)
    console.log(`Vote enregistré pour ${option}`);
  };

  // Ne rien afficher si pas de poll
  if (!isLoading && !poll) return null;

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="h-[500px] rounded-3xl bg-gray-900/50 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!poll) return null;

  const totalVotes = votes.option1 + votes.option2;
  const percentage1 = totalVotes > 0 ? Math.round((votes.option1 / totalVotes) * 100) : 50;
  const percentage2 = totalVotes > 0 ? Math.round((votes.option2 / totalVotes) * 100) : 50;

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-pink-500/30 rounded-full text-sm font-medium text-white mb-4">
            <Swords size={16} className="text-pink-400" />
            <span>Le VS de la semaine</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3">
            {poll.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            {poll.question}
          </p>
        </motion.div>

        {/* VS Arena */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden border border-white/10"
        >
          {/* Background avec gradients des deux côtés */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-y-0 left-0 w-1/2"
              style={{
                background: `linear-gradient(135deg, ${poll.option1.color || '#ec4899'}33 0%, transparent 70%)`
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2"
              style={{
                background: `linear-gradient(225deg, ${poll.option2.color || '#3b82f6'}33 0%, transparent 70%)`
              }}
            />
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />
          </div>

          {/* Ligne de séparation centrale avec VS */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent z-10" />

          {/* Badge VS central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full blur-xl opacity-50" />

              {/* Octogone VS */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl rotate-45 flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-2xl md:text-3xl -rotate-45 tracking-tighter">
                  VS
                </span>
              </div>
            </motion.div>
          </div>

          {/* Content Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[500px]">
            {/* Option 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative p-6 md:p-10 flex flex-col items-center justify-center"
            >
              {/* Image */}
              <div className="relative mb-6">
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-40"
                  style={{ backgroundColor: poll.option1.color || '#ec4899' }}
                />
                <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <SafeImage
                    source={poll.option1.image}
                    alt={poll.option1.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                  />
                </div>
                {userVote === 'option1' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check size={20} className="text-white" />
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center">
                {poll.option1.name}
              </h3>
              {poll.option1.subtitle && (
                <p className="text-gray-400 text-sm mb-6">{poll.option1.subtitle}</p>
              )}

              {/* Vote Button */}
              <motion.button
                whileHover={{ scale: hasVoted ? 1 : 1.05 }}
                whileTap={{ scale: hasVoted ? 1 : 0.95 }}
                onClick={() => handleVote('option1')}
                disabled={hasVoted}
                className={`
                  relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
                  ${hasVoted
                    ? userVote === 'option1'
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white cursor-default'
                      : 'bg-gray-800 text-gray-500 cursor-default'
                    : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50'
                  }
                `}
                style={!hasVoted ? { backgroundColor: poll.option1.color } : undefined}
              >
                {hasVoted ? (
                  <span className="flex items-center gap-2">
                    {userVote === 'option1' && <Check size={20} />}
                    {percentage1}%
                  </span>
                ) : (
                  'Voter'
                )}
              </motion.button>

              {/* Vote count */}
              {hasVoted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 text-sm mt-3"
                >
                  {votes.option1.toLocaleString()} votes
                </motion.p>
              )}
            </motion.div>

            {/* Option 2 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative p-6 md:p-10 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10"
            >
              {/* Image */}
              <div className="relative mb-6">
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-40"
                  style={{ backgroundColor: poll.option2.color || '#3b82f6' }}
                />
                <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <SafeImage
                    source={poll.option2.image}
                    alt={poll.option2.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                  />
                </div>
                {userVote === 'option2' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check size={20} className="text-white" />
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center">
                {poll.option2.name}
              </h3>
              {poll.option2.subtitle && (
                <p className="text-gray-400 text-sm mb-6">{poll.option2.subtitle}</p>
              )}

              {/* Vote Button */}
              <motion.button
                whileHover={{ scale: hasVoted ? 1 : 1.05 }}
                whileTap={{ scale: hasVoted ? 1 : 0.95 }}
                onClick={() => handleVote('option2')}
                disabled={hasVoted}
                className={`
                  relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
                  ${hasVoted
                    ? userVote === 'option2'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-default'
                      : 'bg-gray-800 text-gray-500 cursor-default'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                  }
                `}
                style={!hasVoted ? { backgroundColor: poll.option2.color } : undefined}
              >
                {hasVoted ? (
                  <span className="flex items-center gap-2">
                    {userVote === 'option2' && <Check size={20} />}
                    {percentage2}%
                  </span>
                ) : (
                  'Voter'
                )}
              </motion.button>

              {/* Vote count */}
              {hasVoted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 text-sm mt-3"
                >
                  {votes.option2.toLocaleString()} votes
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Progress Bar (visible après vote) */}
          <AnimatePresence>
            {hasVoted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative border-t border-white/10"
              >
                <div className="h-3 flex overflow-hidden">
                  <motion.div
                    initial={{ width: '50%' }}
                    animate={{ width: `${percentage1}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full"
                    style={{
                      background: `linear-gradient(90deg, ${poll.option1.color || '#ec4899'}, ${poll.option1.color || '#ec4899'}99)`
                    }}
                  />
                  <motion.div
                    initial={{ width: '50%' }}
                    animate={{ width: `${percentage2}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full"
                    style={{
                      background: `linear-gradient(90deg, ${poll.option2.color || '#3b82f6'}99, ${poll.option2.color || '#3b82f6'})`
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Stats */}
          <div className="relative px-6 md:px-10 py-5 border-t border-white/10 bg-black/30 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-pink-400" />
                  {totalVotes.toLocaleString()} participants
                </span>
                {poll.endsAt && (
                  <span className="flex items-center gap-2">
                    <Timer size={16} className="text-blue-400" />
                    Vote en cours
                  </span>
                )}
              </div>

              {poll.context && (
                <p className="text-sm text-gray-500 max-w-md hidden lg:block">
                  {poll.context}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VSPollSection;
