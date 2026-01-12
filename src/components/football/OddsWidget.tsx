// src/components/football/OddsWidget.tsx
// Widget des cotes Winamax pour la sidebar des matchs

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info, RefreshCw, AlertCircle } from 'lucide-react';
import { findMatchOdds } from '../../services/oddsService';
import { MatchOdds, formatOdds, getFavorite, impliedProbability } from '../../types/odds.types';

interface OddsWidgetProps {
  homeTeam: string;
  awayTeam: string;
  competitionId: number;
  matchStatus?: string; // SCHEDULED, IN_PLAY, FINISHED
}

const OddsWidget: React.FC<OddsWidgetProps> = ({
  homeTeam,
  awayTeam,
  competitionId,
  matchStatus = 'SCHEDULED',
}) => {
  const [odds, setOdds] = useState<MatchOdds | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProbabilities, setShowProbabilities] = useState(false);

  useEffect(() => {
    const loadOdds = async () => {
      // Ne pas charger les cotes pour les matchs terminés
      if (matchStatus === 'FINISHED') {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('[OddsWidget] Searching odds for:', { homeTeam, awayTeam, competitionId });
        const matchOdds = await findMatchOdds(homeTeam, awayTeam, competitionId);
        console.log('[OddsWidget] Found odds:', matchOdds);
        setOdds(matchOdds);
      } catch (err) {
        console.error('[OddsWidget] Error:', err);
        setError('Impossible de charger les cotes');
      } finally {
        setIsLoading(false);
      }
    };

    loadOdds();

    // Rafraîchir toutes les 3 minutes pour les matchs en cours
    if (matchStatus === 'IN_PLAY') {
      const interval = setInterval(loadOdds, 3 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [homeTeam, awayTeam, competitionId, matchStatus]);

  const handleRefresh = async () => {
    setIsLoading(true);
    const matchOdds = await findMatchOdds(homeTeam, awayTeam, competitionId);
    setOdds(matchOdds);
    setIsLoading(false);
  };

  // Ne pas afficher pour les matchs terminés
  if (matchStatus === 'FINISHED') {
    return null;
  }

  const winamaxOdds = odds?.odds.winamax;
  const favorite = odds ? getFavorite(odds) : null;

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      {/* Header avec logo Winamax */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Winamax officiel */}
          <img
            src="/images/winamax-logo.png"
            alt="Winamax"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <div>
            <span className="text-white font-bold text-sm">Cotes Winamax</span>
            {matchStatus === 'IN_PLAY' && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded animate-pulse">
                LIVE
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <AlertCircle className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-400">{error}</p>
            </motion.div>
          ) : !winamaxOdds ? (
            <motion.div
              key="no-odds"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <Info className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-400">Cotes indisponibles</p>
              <p className="text-xs text-gray-500 mt-1">pour ce match</p>
            </motion.div>
          ) : (
            <motion.div
              key="odds"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Cotes 1X2 */}
              <div className="grid grid-cols-3 gap-2">
                {/* Victoire domicile */}
                <OddsButton
                  label={homeTeam.split(' ').pop() || '1'}
                  value={winamaxOdds.home}
                  isFavorite={favorite === 'home'}
                  showProbability={showProbabilities}
                />
                {/* Match nul */}
                <OddsButton
                  label="Nul"
                  value={winamaxOdds.draw}
                  isFavorite={favorite === 'draw'}
                  showProbability={showProbabilities}
                />
                {/* Victoire extérieur */}
                <OddsButton
                  label={awayTeam.split(' ').pop() || '2'}
                  value={winamaxOdds.away}
                  isFavorite={favorite === 'away'}
                  showProbability={showProbabilities}
                />
              </div>

              {/* Over/Under 2.5 */}
              {winamaxOdds.overUnder && (
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-gray-500 mb-2">Plus/Moins {winamaxOdds.overUnder.line} buts</p>
                  <div className="grid grid-cols-2 gap-2">
                    <OddsButton
                      label={`+ ${winamaxOdds.overUnder.line}`}
                      value={winamaxOdds.overUnder.over}
                      showProbability={showProbabilities}
                      small
                    />
                    <OddsButton
                      label={`- ${winamaxOdds.overUnder.line}`}
                      value={winamaxOdds.overUnder.under}
                      showProbability={showProbabilities}
                      small
                    />
                  </div>
                </div>
              )}

              {/* Toggle probabilités */}
              <button
                onClick={() => setShowProbabilities(!showProbabilities)}
                className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors py-1"
              >
                {showProbabilities ? 'Voir les cotes' : 'Voir les probabilités'}
              </button>

              {/* Disclaimer */}
              <p className="text-[10px] text-gray-600 text-center leading-tight">
                Cotes à titre informatif uniquement.
                <br />
                Les paris comportent des risques.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Composant bouton de cote
interface OddsButtonProps {
  label: string;
  value: number;
  isFavorite?: boolean;
  showProbability?: boolean;
  small?: boolean;
}

const OddsButton: React.FC<OddsButtonProps> = ({
  label,
  value,
  isFavorite = false,
  showProbability = false,
  small = false,
}) => {
  const displayValue = showProbability
    ? `${impliedProbability(value).toFixed(0)}%`
    : formatOdds(value);

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center rounded-lg
        transition-all duration-200 cursor-default
        ${small ? 'py-2 px-3' : 'py-3 px-2'}
        ${isFavorite
          ? 'bg-green-500/20 border border-green-500/30'
          : 'bg-white/5 border border-white/10 hover:bg-white/10'
        }
      `}
    >
      <span className={`text-gray-400 ${small ? 'text-[10px]' : 'text-xs'} mb-0.5`}>
        {label}
      </span>
      <span
        className={`
          font-bold
          ${small ? 'text-sm' : 'text-lg'}
          ${isFavorite ? 'text-green-400' : 'text-white'}
        `}
      >
        {displayValue}
      </span>
      {isFavorite && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
      )}
    </div>
  );
};

export default OddsWidget;
