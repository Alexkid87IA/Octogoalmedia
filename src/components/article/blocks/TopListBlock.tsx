// src/components/article/blocks/TopListBlock.tsx
// Top liste avec podium et tendances

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { urlFor } from '../../../utils/sanityClient';

interface TopListProps {
  value: {
    title: string;
    description?: string;
    listType: 'players' | 'clubs' | 'goals' | 'trophies' | 'general';
    items: TopListItem[];
    style: 'list' | 'cards' | 'podium' | 'bars' | 'reveal';
    showRankChange: boolean;
    interactive: boolean;
    interactiveTitle?: string;
    accentColor: string;
    numberedList: boolean;
    reverseOrder: boolean;
  };
}

interface TopListItem {
  _key: string;
  rank: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: any;
  imageUrl?: string;
  stat?: string;
  trend?: 'up' | 'stable' | 'down' | 'new';
  previousRank?: number;
  highlight?: boolean;
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

const TopListBlock: React.FC<TopListProps> = ({ value }) => {
  const {
    title,
    description,
    items,
    style,
    showRankChange,
    interactive,
    interactiveTitle,
    accentColor,
    numberedList,
    reverseOrder,
  } = value;

  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [isAllRevealed, setIsAllRevealed] = useState(false);

  const accent = accentColor || '#ec4899';
  const sortedItems = reverseOrder ? [...items].reverse() : items;

  const getTrendIcon = (item: TopListItem) => {
    if (item.trend === 'new') return <Sparkles size={14} className="text-yellow-400" />;
    if (item.trend === 'up') return <TrendingUp size={14} className="text-green-400" />;
    if (item.trend === 'down') return <TrendingDown size={14} className="text-red-400" />;
    return <Minus size={14} className="text-gray-500" />;
  };

  const getRankChange = (item: TopListItem) => {
    if (!showRankChange || !item.previousRank) return null;
    const diff = item.previousRank - item.rank;
    if (diff > 0) return <span className="text-green-400 text-xs">+{diff}</span>;
    if (diff < 0) return <span className="text-red-400 text-xs">{diff}</span>;
    return <span className="text-gray-500 text-xs">=</span>;
  };

  const toggleReveal = (key: string) => {
    setRevealedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const revealAll = () => {
    if (isAllRevealed) {
      setRevealedItems(new Set());
    } else {
      setRevealedItems(new Set(items.map((i) => i._key)));
    }
    setIsAllRevealed(!isAllRevealed);
  };

  // Podium style (for top 3)
  if (style === 'podium') {
    const top3 = sortedItems.slice(0, 3);
    const rest = sortedItems.slice(3);
    // Reorder for podium: 2nd, 1st, 3rd
    const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

    return (
      <div className="my-10 md:my-14">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden p-6">
          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-2">{title}</h3>
          {description && <p className="text-gray-400 text-center text-sm mb-8">{description}</p>}

          {/* Podium */}
          <div className="flex items-end justify-center gap-4 mb-8">
            {podiumOrder.map((item, index) => {
              const actualRank = index === 0 ? 2 : index === 1 ? 1 : 3;
              const height = actualRank === 1 ? 'h-32' : actualRank === 2 ? 'h-24' : 'h-20';
              const imageUrl = item.image ? urlFor(item.image).width(100).url() : item.imageUrl;

              return (
                <motion.div
                  key={item._key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="flex flex-col items-center"
                >
                  {/* Avatar/Image */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className={`${actualRank === 1 ? 'w-20 h-20' : 'w-16 h-16'} rounded-full object-cover border-2 mb-2`}
                      style={{ borderColor: accent }}
                    />
                  ) : (
                    <div
                      className={`${actualRank === 1 ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl'} rounded-full bg-gray-700 flex items-center justify-center mb-2`}
                    >
                      {RANK_MEDALS[actualRank - 1]}
                    </div>
                  )}

                  <div className="text-center mb-2">
                    <div className="text-white font-bold text-sm">{item.title}</div>
                    {item.stat && <div className="text-xs" style={{ color: accent }}>{item.stat}</div>}
                  </div>

                  {/* Podium block */}
                  <div
                    className={`${height} w-24 rounded-t-lg flex items-start justify-center pt-2`}
                    style={{ backgroundColor: `${accent}${actualRank === 1 ? 'cc' : actualRank === 2 ? '99' : '66'}` }}
                  >
                    <span className="text-2xl">{RANK_MEDALS[actualRank - 1]}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Rest of list */}
          {rest.length > 0 && (
            <div className="space-y-2 border-t border-gray-700 pt-4">
              {rest.map((item, index) => {
                const imageUrl = item.image ? urlFor(item.image).width(50).url() : item.imageUrl;
                return (
                  <div
                    key={item._key}
                    className={`flex items-center gap-3 p-3 rounded-lg ${item.highlight ? 'bg-gray-800' : ''}`}
                  >
                    <span className="w-8 text-center text-gray-500 font-bold">{item.rank}</span>
                    {imageUrl && (
                      <img src={imageUrl} alt="Image" className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.title}</div>
                      {item.subtitle && <div className="text-gray-500 text-xs">{item.subtitle}</div>}
                    </div>
                    {item.stat && <div className="font-bold" style={{ color: accent }}>{item.stat}</div>}
                    {showRankChange && getTrendIcon(item)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Reveal style (click to reveal)
  if (style === 'reveal') {
    return (
      <div className="my-10 md:my-14">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
              {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
            </div>
            <button
              onClick={revealAll}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ backgroundColor: `${accent}20`, color: accent }}
            >
              {isAllRevealed ? 'Masquer tout' : 'Révéler tout'}
            </button>
          </div>

          <div className="space-y-3">
            {sortedItems.map((item) => {
              const isRevealed = revealedItems.has(item._key);
              const imageUrl = item.image ? urlFor(item.image).width(80).url() : item.imageUrl;

              return (
                <motion.div
                  key={item._key}
                  className={`rounded-xl overflow-hidden ${item.highlight ? 'ring-1' : ''}`}
                  style={{ borderColor: item.highlight ? accent : 'transparent' }}
                >
                  <button
                    onClick={() => toggleReveal(item._key)}
                    className="w-full p-4 bg-gray-800 hover:bg-gray-750 transition-colors flex items-center gap-4"
                  >
                    {/* Rank */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: `${accent}30`, color: accent }}
                    >
                      {numberedList ? item.rank : RANK_MEDALS[item.rank - 1] || item.rank}
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                      {isRevealed ? (
                        <motion.div
                          key="revealed"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex-1 flex items-center gap-3"
                        >
                          {imageUrl && (
                            <img src={imageUrl} alt="Image" className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1 text-left">
                            <div className="text-white font-bold">{item.title}</div>
                            {item.subtitle && <div className="text-gray-500 text-sm">{item.subtitle}</div>}
                          </div>
                          {item.stat && (
                            <div className="font-bold text-lg" style={{ color: accent }}>{item.stat}</div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 text-left"
                        >
                          <div className="text-gray-500">Cliquez pour révéler</div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isRevealed ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </button>

                  {/* Description */}
                  <AnimatePresence>
                    {isRevealed && item.description && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 text-gray-400 text-sm border-t border-gray-700 mt-0 pt-3">
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Cards style
  if (style === 'cards') {
    return (
      <div className="my-10 md:my-14">
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
          {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {sortedItems.map((item, index) => {
            const imageUrl = item.image ? urlFor(item.image).width(150).url() : item.imageUrl;

            return (
              <motion.div
                key={item._key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gray-800 rounded-xl p-4 text-center relative ${item.highlight ? 'ring-2' : ''}`}
                style={{ borderColor: item.highlight ? accent : 'transparent' }}
              >
                {/* Rank badge */}
                <div
                  className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: accent }}
                >
                  {item.rank <= 3 ? RANK_MEDALS[item.rank - 1] : item.rank}
                </div>

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-16 h-16 mx-auto rounded-full object-cover mb-3"
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center text-2xl mb-3">
                    {item.rank <= 3 ? RANK_MEDALS[item.rank - 1] : '⚽'}
                  </div>
                )}

                <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                {item.subtitle && <div className="text-gray-500 text-xs mb-2">{item.subtitle}</div>}
                {item.stat && (
                  <div className="font-bold" style={{ color: accent }}>{item.stat}</div>
                )}

                {showRankChange && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    {getTrendIcon(item)}
                    {getRankChange(item)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: List style
  return (
    <div className="my-10 md:my-14">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden p-6">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h3>
        {description && <p className="text-gray-400 text-sm mb-6">{description}</p>}

        <div className="space-y-2">
          {sortedItems.map((item, index) => {
            const imageUrl = item.image ? urlFor(item.image).width(60).url() : item.imageUrl;

            return (
              <motion.div
                key={item._key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  item.highlight ? 'bg-gray-800 ring-1' : 'hover:bg-gray-800/50'
                }`}
                style={{ borderColor: item.highlight ? accent : 'transparent' }}
              >
                {/* Rank */}
                <div className="w-10 text-center">
                  {item.rank <= 3 ? (
                    <span className="text-2xl">{RANK_MEDALS[item.rank - 1]}</span>
                  ) : (
                    <span className="text-xl font-bold text-gray-500">{item.rank}</span>
                  )}
                </div>

                {/* Image */}
                {imageUrl && (
                  <img src={imageUrl} alt="Image" className="w-12 h-12 rounded-lg object-cover" />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold truncate">{item.title}</div>
                  {item.subtitle && <div className="text-gray-500 text-sm truncate">{item.subtitle}</div>}
                </div>

                {/* Stat */}
                {item.stat && (
                  <div className="text-lg font-bold" style={{ color: accent }}>
                    {item.stat}
                  </div>
                )}

                {/* Trend */}
                {showRankChange && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(item)}
                    {getRankChange(item)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopListBlock;
