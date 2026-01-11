import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { getTodayFixtures, getNextFixtures, LEAGUES } from '../../services/apiFootball';

interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
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
        
        // Récupérer les prochains matchs de plusieurs ligues
        const leagues = ['FL1', 'PL', 'PD', 'SA', 'BL1'];
        const allMatches: Match[] = [];
        
        for (const league of leagues) {
          try {
            const response = await fetch(`/api/football/competitions/${league}/matches?status=SCHEDULED&limit=5`);
            if (response.ok) {
              const data = await response.json();
              if (data.matches) {
                allMatches.push(...data.matches.slice(0, 3));
              }
            }
          } catch (e) {
            console.log(`Erreur pour ${league}:`, e);
          }
        }
        
        // Trier par date
        allMatches.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
        
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
        isToday: false 
      };
    }
  };

  // Status du match
  const getMatchStatus = (status: string, score: any) => {
    switch (status) {
      case 'FINISHED':
        return { label: 'Terminé', color: 'bg-gray-500' };
      case 'IN_PLAY':
      case 'LIVE':
        return { label: 'En cours', color: 'bg-red-500 animate-pulse' };
      case 'PAUSED':
        return { label: 'Mi-temps', color: 'bg-yellow-500' };
      case 'SCHEDULED':
      case 'TIMED':
      default:
        return null;
    }
  };

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
    return null; // Ne rien afficher si erreur ou pas de matchs
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
              <Calendar className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Matchs</span>
            </div>

            {/* Liste des matchs */}
            {matches.map((match) => {
              const timeInfo = formatMatchTime(match.utcDate);
              const status = getMatchStatus(match.status, match.score);
              const isLive = match.status === 'IN_PLAY' || match.status === 'LIVE';
              const isFinished = match.status === 'FINISHED';

              return (
                <Link
                  key={match.id}
                  to="/football"
                  className={`flex-shrink-0 group relative bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2 transition-all border border-transparent hover:border-white/10 ${
                    isLive ? 'ring-1 ring-red-500/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Équipe domicile */}
                    <div className="flex items-center gap-2">
                      <img 
                        src={match.homeTeam.crest} 
                        alt={match.homeTeam.shortName}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-white text-xs font-medium w-10 truncate">
                        {match.homeTeam.tla || match.homeTeam.shortName?.substring(0, 3).toUpperCase()}
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
                        {match.awayTeam.tla || match.awayTeam.shortName?.substring(0, 3).toUpperCase()}
                      </span>
                      <img 
                        src={match.awayTeam.crest} 
                        alt={match.awayTeam.shortName}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  </div>

                  {/* Badge compétition au hover */}
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <img 
                      src={match.competition.emblem} 
                      alt={match.competition.name}
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                </Link>
              );
            })}

            {/* Lien voir tous les matchs */}
            <Link
              to="/football"
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