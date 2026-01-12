// src/components/football/OddsBadge.tsx
// Badge compact des cotes pour les cartes de match

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { findMatchOdds } from '../../services/oddsService';
import { MatchOdds, formatOdds, getFavorite } from '../../types/odds.types';

interface OddsBadgeProps {
  homeTeam: string;
  awayTeam: string;
  competitionId: number;
  matchStatus?: string;
  variant?: 'inline' | 'row'; // inline = petit, row = ligne complète
}

const OddsBadge: React.FC<OddsBadgeProps> = ({
  homeTeam,
  awayTeam,
  competitionId,
  matchStatus = 'SCHEDULED',
  variant = 'inline',
}) => {
  const [odds, setOdds] = useState<MatchOdds | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ne pas charger pour matchs terminés
    if (matchStatus === 'FINISHED') {
      setIsLoading(false);
      return;
    }

    const loadOdds = async () => {
      try {
        const matchOdds = await findMatchOdds(homeTeam, awayTeam, competitionId);
        setOdds(matchOdds);
      } catch (err) {
        console.error('[OddsBadge] Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOdds();
  }, [homeTeam, awayTeam, competitionId, matchStatus]);

  // Ne rien afficher pour matchs terminés ou en chargement
  if (matchStatus === 'FINISHED' || isLoading) {
    return null;
  }

  const winamaxOdds = odds?.odds.winamax;

  // Pas de cotes disponibles
  if (!winamaxOdds) {
    return null;
  }

  const favorite = getFavorite(odds!);

  if (variant === 'inline') {
    // Version compacte avec mini-logo Winamax
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1 text-[10px]"
        title="Cotes Winamax"
      >
        <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-[7px]">W</span>
        </div>
        <OddsPill value={winamaxOdds.home} isFavorite={favorite === 'home'} />
        <OddsPill value={winamaxOdds.draw} isFavorite={favorite === 'draw'} />
        <OddsPill value={winamaxOdds.away} isFavorite={favorite === 'away'} />
      </motion.div>
    );
  }

  // Version ligne complète avec branding Winamax
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 mt-2"
    >
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 flex items-center justify-center">
          <span className="text-white font-black text-[8px]">W</span>
        </div>
        <span className="text-[10px] text-gray-400">Winamax</span>
      </div>
      <div className="flex items-center gap-2">
        <OddsCell label="1" value={winamaxOdds.home} isFavorite={favorite === 'home'} />
        <OddsCell label="N" value={winamaxOdds.draw} isFavorite={favorite === 'draw'} />
        <OddsCell label="2" value={winamaxOdds.away} isFavorite={favorite === 'away'} />
      </div>
    </motion.div>
  );
};

// Petite pilule de cote (variant inline)
const OddsPill: React.FC<{ value: number; isFavorite?: boolean }> = ({
  value,
  isFavorite = false,
}) => (
  <span
    className={`
      px-1.5 py-0.5 rounded font-medium
      ${isFavorite
        ? 'bg-green-500/20 text-green-400'
        : 'bg-white/10 text-gray-300'
      }
    `}
  >
    {formatOdds(value)}
  </span>
);

// Cellule de cote avec label (variant row)
const OddsCell: React.FC<{ label: string; value: number; isFavorite?: boolean }> = ({
  label,
  value,
  isFavorite = false,
}) => (
  <div className="flex flex-col items-center">
    <span className="text-[9px] text-gray-500">{label}</span>
    <span
      className={`
        text-xs font-bold
        ${isFavorite ? 'text-green-400' : 'text-white'}
      `}
    >
      {formatOdds(value)}
    </span>
  </div>
);

export default OddsBadge;
