// src/components/article/blocks/QuickPollBlock.tsx
// Sondage rapide avec stockage localStorage

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Users } from 'lucide-react';
import { urlFor } from '../../../utils/sanityClient';
import { SanityImage } from '../../../types/sanity';

interface QuickPollProps {
  value: {
    _key: string;
    question: string;
    pollType: 'text' | 'match' | 'players' | 'yesno' | 'rating';
    options?: PollOption[];
    matchTeam1?: MatchTeam;
    matchTeam2?: MatchTeam;
    matchDrawOption?: boolean;
    allowMultiple: boolean;
    showResults: 'after_vote' | 'always' | 'never';
    expiresAt?: string;
    style: 'bars' | 'pie' | 'cards' | 'versus';
    accentColor: string;
  };
}

interface PollOption {
  _key: string;
  text: string;
  image?: SanityImage;
  imageUrl?: string;
  color?: string;
}

interface MatchTeam {
  clubName?: string;
  color: string;
}

const QuickPollBlock: React.FC<QuickPollProps> = ({ value }) => {
  const {
    _key,
    question,
    pollType,
    options,
    matchTeam1,
    matchTeam2,
    matchDrawOption,
    showResults,
    style,
    accentColor,
  } = value;

  const STORAGE_KEY = `poll_${_key}`;

  // Generate poll options based on type
  const pollOptions = useMemo(() => {
    if (pollType === 'match' && matchTeam1 && matchTeam2) {
      const matchOptions = [
        { _key: 'team1', text: matchTeam1.clubName || 'Équipe 1', color: matchTeam1.color },
        { _key: 'team2', text: matchTeam2.clubName || 'Équipe 2', color: matchTeam2.color },
      ];
      if (matchDrawOption) {
        matchOptions.splice(1, 0, { _key: 'draw', text: 'Match nul', color: '#6b7280' });
      }
      return matchOptions;
    }
    if (pollType === 'yesno') {
      return [
        { _key: 'yes', text: 'Oui', color: '#22c55e' },
        { _key: 'no', text: 'Non', color: '#ef4444' },
      ];
    }
    if (pollType === 'rating') {
      return [1, 2, 3, 4, 5].map((n) => ({
        _key: `rating_${n}`,
        text: '⭐'.repeat(n),
        color: accentColor || '#ec4899',
      }));
    }
    return options || [];
  }, [pollType, options, matchTeam1, matchTeam2, matchDrawOption, accentColor]);

  // State
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setHasVoted(true);
      setSelectedOptions(data.selected || []);
    }

    // Initialize mock votes (in real app, fetch from API)
    const mockVotes: Record<string, number> = {};
    let total = 0;
    pollOptions.forEach((opt) => {
      const randomVotes = Math.floor(Math.random() * 100) + 10;
      mockVotes[opt._key] = randomVotes;
      total += randomVotes;
    });
    setVotes(mockVotes);
    setTotalVotes(total);
  }, [STORAGE_KEY, pollOptions]);

  const handleVote = (optionKey: string) => {
    if (hasVoted) return;

    const newSelected = [optionKey];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ selected: newSelected, timestamp: Date.now() }));
    setSelectedOptions(newSelected);
    setHasVoted(true);

    // Update votes
    setVotes((prev) => ({ ...prev, [optionKey]: (prev[optionKey] || 0) + 1 }));
    setTotalVotes((prev) => prev + 1);
  };

  const getPercentage = (optionKey: string) => {
    if (totalVotes === 0) return 0;
    return Math.round(((votes[optionKey] || 0) / totalVotes) * 100);
  };

  const shouldShowResults = () => {
    if (showResults === 'always') return true;
    if (showResults === 'never') return false;
    return hasVoted;
  };

  const accent = accentColor || '#ec4899';

  // Match/Versus style
  if (style === 'versus' && pollType === 'match' && matchTeam1 && matchTeam2) {
    return (
      <div className="my-10 md:my-14">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden p-6">
          <h3 className="text-xl font-bold text-white text-center mb-6">{question}</h3>

          <div className="flex items-center justify-center gap-4">
            {/* Team 1 */}
            <motion.button
              whileHover={{ scale: hasVoted ? 1 : 1.05 }}
              whileTap={{ scale: hasVoted ? 1 : 0.95 }}
              onClick={() => handleVote('team1')}
              disabled={hasVoted}
              className={`flex-1 max-w-[180px] p-6 rounded-xl text-center transition-all ${
                selectedOptions.includes('team1')
                  ? 'ring-2 ring-white'
                  : hasVoted
                  ? 'opacity-60'
                  : 'hover:opacity-80'
              }`}
              style={{ backgroundColor: matchTeam1.color }}
            >
              <div className="text-white font-bold text-lg mb-2">{matchTeam1.clubName}</div>
              {shouldShowResults() && (
                <div className="text-white/80 text-2xl font-black">{getPercentage('team1')}%</div>
              )}
            </motion.button>

            {/* Draw option */}
            {matchDrawOption && (
              <motion.button
                whileHover={{ scale: hasVoted ? 1 : 1.05 }}
                whileTap={{ scale: hasVoted ? 1 : 0.95 }}
                onClick={() => handleVote('draw')}
                disabled={hasVoted}
                className={`px-6 py-4 rounded-xl text-center bg-gray-700 ${
                  selectedOptions.includes('draw')
                    ? 'ring-2 ring-white'
                    : hasVoted
                    ? 'opacity-60'
                    : 'hover:bg-gray-600'
                }`}
              >
                <div className="text-white font-bold text-sm mb-1">Nul</div>
                {shouldShowResults() && (
                  <div className="text-white/80 text-xl font-black">{getPercentage('draw')}%</div>
                )}
              </motion.button>
            )}

            {/* Team 2 */}
            <motion.button
              whileHover={{ scale: hasVoted ? 1 : 1.05 }}
              whileTap={{ scale: hasVoted ? 1 : 0.95 }}
              onClick={() => handleVote('team2')}
              disabled={hasVoted}
              className={`flex-1 max-w-[180px] p-6 rounded-xl text-center transition-all ${
                selectedOptions.includes('team2')
                  ? 'ring-2 ring-white'
                  : hasVoted
                  ? 'opacity-60'
                  : 'hover:opacity-80'
              }`}
              style={{ backgroundColor: matchTeam2.color }}
            >
              <div className="text-white font-bold text-lg mb-2">{matchTeam2.clubName}</div>
              {shouldShowResults() && (
                <div className="text-white/80 text-2xl font-black">{getPercentage('team2')}%</div>
              )}
            </motion.button>
          </div>

          {/* Vote count */}
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
            <Users size={14} />
            <span>{totalVotes} votes</span>
          </div>
        </div>
      </div>
    );
  }

  // Cards style
  if (style === 'cards') {
    return (
      <div className="my-10 md:my-14">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden p-6">
          <h3 className="text-xl font-bold text-white text-center mb-6">{question}</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {pollOptions.map((option) => {
              const isSelected = selectedOptions.includes(option._key);
              const percentage = getPercentage(option._key);
              const imageUrl = option.image ? urlFor(option.image).width(200).url() : option.imageUrl;

              return (
                <motion.button
                  key={option._key}
                  whileHover={{ scale: hasVoted ? 1 : 1.02 }}
                  whileTap={{ scale: hasVoted ? 1 : 0.98 }}
                  onClick={() => handleVote(option._key)}
                  disabled={hasVoted}
                  className={`relative p-4 rounded-xl text-center transition-all overflow-hidden ${
                    isSelected
                      ? 'ring-2'
                      : hasVoted
                      ? 'opacity-70'
                      : 'hover:bg-gray-700'
                  } bg-gray-800`}
                  style={{ borderColor: isSelected ? accent : 'transparent' }}
                >
                  {imageUrl && (
                    <img src={imageUrl} alt="Image" className="w-16 h-16 mx-auto mb-2 rounded-lg object-cover" />
                  )}
                  <div className="text-white font-medium text-sm">{option.text}</div>
                  {shouldShowResults() && (
                    <div className="text-lg font-bold mt-1" style={{ color: accent }}>
                      {percentage}%
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check size={16} style={{ color: accent }} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
            <Users size={14} />
            <span>{totalVotes} votes</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Bars style - Design premium
  // Find the single highest percentage (only first one if tied)
  const maxPercentage = Math.max(...pollOptions.map(o => getPercentage(o._key)));
  const winnerKey = pollOptions.find(o => getPercentage(o._key) === maxPercentage)?._key;

  return (
    <div className="my-10 md:my-14">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🗳️</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Sondage</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-8">{question}</h3>

          <div className="space-y-3">
            {pollOptions.map((option, index) => {
              const isSelected = selectedOptions.includes(option._key);
              const percentage = getPercentage(option._key);
              const isWinner = shouldShowResults() && option._key === winnerKey;

              return (
                <motion.button
                  key={option._key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: hasVoted ? 1 : 1.02 }}
                  whileTap={{ scale: hasVoted ? 1 : 0.98 }}
                  onClick={() => handleVote(option._key)}
                  disabled={hasVoted}
                  className={`w-full p-4 rounded-xl text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'ring-2 bg-slate-800/80'
                      : 'bg-slate-800/50 hover:bg-slate-800/80'
                  }`}
                  style={{
                    borderColor: isSelected ? accent : 'transparent',
                    boxShadow: isSelected ? `0 0 15px ${accent}20` : 'none'
                  }}
                >
                  {/* Background bar with gradient */}
                  {shouldShowResults() && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 rounded-l-xl"
                      style={{
                        background: isSelected
                          ? `linear-gradient(90deg, ${accent}50 0%, ${accent}20 100%)`
                          : 'linear-gradient(90deg, rgba(100,116,139,0.25) 0%, rgba(100,116,139,0.08) 100%)'
                      }}
                    />
                  )}

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Radio/Check indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          isSelected
                            ? 'border-transparent'
                            : 'border-slate-600 group-hover:border-slate-500'
                        }`}
                        style={{ backgroundColor: isSelected ? accent : 'transparent' }}
                      >
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {option.text}
                      </span>
                    </div>
                    {shouldShowResults() && (
                      <span
                        className="font-bold text-lg flex-shrink-0"
                        style={{ color: isSelected ? accent : '#64748b' }}
                      >
                        {percentage}%
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-700/50">
            <Users size={14} className="text-slate-500" />
            <span className="text-slate-500 text-sm">{totalVotes.toLocaleString()} participants</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPollBlock;
