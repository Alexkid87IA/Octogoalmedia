// src/components/football/MatchesTicker.tsx
// Ticker des matchs pour la homepage - Affiche les matchs des compétitions TOP

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Radio } from 'lucide-react';
import { getLiveMatches, getTodayFixtures, getNextFixtures } from '../../services/apiFootball';
import { getTopCompetitionIds, isTopCompetition } from '../../config/competitions';

interface Match {
  id: number;
  utcDate: string;
  status: string;
  minute?: number;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
}

export default function MatchesTicker() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);
        const topIds = getTopCompetitionIds();

        // Récupérer en parallèle: matchs en direct, matchs du jour, prochains matchs
        const [liveData, todayData, upcomingData] = await Promise.all([
          getLiveMatches(),
          getTodayFixtures(topIds),
          Promise.all(topIds.map(id => getNextFixtures(String(id), 3).catch(() => []))),
        ]);

        // Filtrer les matchs en direct pour garder seulement ceux des compétitions TOP ou tous
        const liveMatches = liveData.filter((m: Match) =>
          m.competition?.id ? isTopCompetition(m.competition.id) : true
        );

        // Combiner les prochains matchs
        const nextMatches = upcomingData.flat();

        // Créer une liste combinée avec priorité:
        // 1. Matchs en direct (toutes compétitions)
        // 2. Matchs du jour (compétitions TOP)
        // 3. Prochains matchs (compétitions TOP)
        const allMatches: Match[] = [];

        // Ajouter les matchs en direct en premier
        liveMatches.forEach((match: Match) => {
          if (!allMatches.find(m => m.id === match.id)) {
            allMatches.push(match);
          }
        });

        // Ajouter les matchs du jour
        todayData.forEach((match: Match) => {
          if (!allMatches.find(m => m.id === match.id)) {
            allMatches.push(match);
          }
        });

        // Ajouter les prochains matchs
        nextMatches.forEach((match: Match) => {
          if (!allMatches.find(m => m.id === match.id)) {
            allMatches.push(match);
          }
        });

        // Trier: en direct d'abord, puis par date
        allMatches.sort((a, b) => {
          const aLive = a.status === 'IN_PLAY' || a.status === 'PAUSED';
          const bLive = b.status === 'IN_PLAY' || b.status === 'PAUSED';
          if (aLive && !bLive) return -1;
          if (!aLive && bLive) return 1;
          return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
        });

        setMatches(allMatches.slice(0, 15)); // Max 15 matchs
        setError(null);
      } catch (err) {
        console.error('Erreur chargement matchs:', err);
        setError('Impossible de charger les matchs');
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();

    // Rafraîchir toutes les 60 secondes
    const interval = setInterval(fetchMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll handlers
  const scrollLeft = () => {
    setScrollPosition(prev => Math.max(prev - 300, 0));
  };

  const scrollRight = () => {
    setScrollPosition(prev => prev + 300);
  };

  // Formater la date/heure
  const formatMatchTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (isToday) {
      return { date: "Auj.", time, isToday: true };
    } else if (isTomorrow) {
      return { date: "Dem.", time, isToday: false };
    } else {
      return {
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        time,
        isToday: false,
      };
    }
  };

  // Status du match
  const getMatchStatus = (match: Match) => {
    switch (match.status) {
      case 'FINISHED':
        return { label: 'Terminé', color: 'bg-gray-500' };
      case 'IN_PLAY':
        return { label: match.minute ? `${match.minute}'` : 'Live', color: 'bg-red-500 animate-pulse' };
      case 'PAUSED':
        return { label: 'Mi-temps', color: 'bg-yellow-500' };
      default:
        return null;
    }
  };

  const liveCount = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED').length;

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 py-3 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-40 h-12 bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || matches.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-sm border-b border-white/10 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Bouton scroll gauche */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-gray-900/90 hover:bg-gray-800 rounded-full border border-white/10 transition-colors"
          style={{ display: scrollPosition > 0 ? 'flex' : 'none' }}
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        {/* Container des matchs */}
        <div className="overflow-hidden py-2">
          <motion.div
            className="flex items-center gap-3"
            animate={{ x: -scrollPosition }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Label "Matchs" */}
            <div className="flex-shrink-0 flex items-center gap-2 pr-4 border-r border-white/10">
              {liveCount > 0 ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                    {liveCount} Live
                  </span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Matchs</span>
                </>
              )}
            </div>

            {/* Liste des matchs */}
            {matches.map((match) => {
              const timeInfo = formatMatchTime(match.utcDate);
              const status = getMatchStatus(match);
              const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
              const isFinished = match.status === 'FINISHED';

              return (
                <Link
                  key={match.id}
                  to={`/match/${match.id}`}
                  className={`flex-shrink-0 group relative bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2 transition-all border ${
                    isLive ? 'border-red-500/50 ring-1 ring-red-500/30' : 'border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Équipe domicile */}
                    <div className="flex items-center gap-2">
                      <img
                        src={match.homeTeam.crest}
                        alt=""
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-white text-xs font-medium w-10 truncate">
                        {match.homeTeam.shortName?.substring(0, 3).toUpperCase() || match.homeTeam.name.substring(0, 3).toUpperCase()}
                      </span>
                    </div>

                    {/* Score ou Heure */}
                    <div className="flex flex-col items-center min-w-[50px]">
                      {isFinished || isLive ? (
                        <>
                          <div className="flex items-center gap-1 text-white font-bold text-sm">
                            <span>{match.score.fullTime.home ?? '-'}</span>
                            <span className="text-gray-500">-</span>
                            <span>{match.score.fullTime.away ?? '-'}</span>
                          </div>
                          {status && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${status.color} text-white mt-0.5`}>
                              {status.label}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            timeInfo.isToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {timeInfo.time}
                          </span>
                          <span className="text-[10px] text-gray-500 mt-0.5">
                            {timeInfo.date}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Équipe extérieur */}
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-medium w-10 truncate text-right">
                        {match.awayTeam.shortName?.substring(0, 3).toUpperCase() || match.awayTeam.name.substring(0, 3).toUpperCase()}
                      </span>
                      <img
                        src={match.awayTeam.crest}
                        alt=""
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  </div>

                  {/* Badge compétition au hover */}
                  {match.competition?.emblem && (
                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <img
                        src={match.competition.emblem}
                        alt=""
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                  )}
                </Link>
              );
            })}

            {/* Lien voir tous les matchs */}
            <Link
              to="/matchs"
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-pink-400 hover:text-pink-300 text-xs font-medium transition-colors"
            >
              <span>Voir tous les matchs</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Bouton scroll droite */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-gray-900/90 hover:bg-gray-800 rounded-full border border-white/10 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>

        {/* Dégradé de fade sur les côtés */}
        <div className="absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900/95 to-transparent pointer-events-none" />
        <div className="absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900/95 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
