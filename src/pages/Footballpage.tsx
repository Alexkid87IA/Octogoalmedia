import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  getStandings, 
  getNextFixtures, 
  getTopScorers,
  getMatchesByMatchday,
  getCurrentMatchday,
  LEAGUES,
  LEAGUE_INFO,
  formatDateFR,
} from '../services/apiFootball';

// Types
interface TeamStanding {
  position: number;
  team: {
    id: number;
    name: string;
    crest: string;
  };
  points: number;
  goalDifference: number;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface Match {
  id: number;
  matchday: number;
  utcDate: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

interface Scorer {
  player: {
    id: number;
    name: string;
  };
  team: {
    id: number;
    name: string;
    crest: string;
  };
  goals: number;
  assists: number | null;
}

type LeagueKey = keyof typeof LEAGUES;

export default function FootballPage() {
  const [selectedLeague, setSelectedLeague] = useState<LeagueKey>('LIGUE_1');
  const [activeTab, setActiveTab] = useState<'standings' | 'fixtures' | 'results' | 'scorers'>('standings');
  
  // Données
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [matchdayMatches, setMatchdayMatches] = useState<Match[]>([]);
  const [scorers, setScorers] = useState<Scorer[]>([]);
  
  // Navigation par journée
  const [currentMatchday, setCurrentMatchday] = useState<number>(1);
  const [selectedMatchday, setSelectedMatchday] = useState<number>(1);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const leagueCode = LEAGUES[selectedLeague];
  const leagueInfo = LEAGUE_INFO[leagueCode];

  // Charger les données quand la ligue change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        // Récupérer la journée actuelle
        const currentMD = await getCurrentMatchday(leagueCode);
        setCurrentMatchday(currentMD);
        setSelectedMatchday(currentMD);
        
        // Charger les données de base en parallèle
        const [standingsData, fixturesData, scorersData] = await Promise.all([
          getStandings(leagueCode),
          getNextFixtures(leagueCode, 10),
          getTopScorers(leagueCode),
        ]);
        
        setStandings(standingsData);
        setFixtures(fixturesData);
        setScorers(scorersData);
        
        // Charger les matchs de la journée actuelle
        const matchdayData = await getMatchesByMatchday(leagueCode, currentMD);
        setMatchdayMatches(matchdayData);
        
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [selectedLeague, leagueCode]);

  // Charger les matchs quand on change de journée
  useEffect(() => {
    async function fetchMatchday() {
      if (activeTab !== 'results') return;
      
      setLoading(true);
      try {
        const matchdayData = await getMatchesByMatchday(leagueCode, selectedMatchday);
        setMatchdayMatches(matchdayData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMatchday();
  }, [selectedMatchday, leagueCode, activeTab]);

  // Navigation journée
  const goToPreviousMatchday = () => {
    if (selectedMatchday > 1) {
      setSelectedMatchday(selectedMatchday - 1);
    }
  };

  const goToNextMatchday = () => {
    if (selectedMatchday < leagueInfo.totalMatchdays) {
      setSelectedMatchday(selectedMatchday + 1);
    }
  };

  const goToCurrentMatchday = () => {
    setSelectedMatchday(currentMatchday);
  };

  // Séparer les matchs joués et à venir dans la journée
  const playedMatches = matchdayMatches.filter(m => m.status === 'FINISHED');
  const upcomingMatches = matchdayMatches.filter(m => m.status !== 'FINISHED');

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Football Live ⚽
          </h1>
          <p className="text-gray-400 text-lg">
            Classements, résultats et calendriers en temps réel
          </p>
        </div>

        {/* Sélecteur de Ligue */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(Object.keys(LEAGUES) as LeagueKey[]).map((league) => {
            const info = LEAGUE_INFO[LEAGUES[league]];
            return (
              <button
                key={league}
                onClick={() => setSelectedLeague(league)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedLeague === league
                    ? `bg-gradient-to-r ${info.color} text-white shadow-lg scale-105`
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {info.flag} {info.name}
              </button>
            );
          })}
        </div>

        {/* Onglets */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'standings', label: '📊 Classement' },
            { id: 'fixtures', label: '📅 À venir' },
            { id: 'results', label: '⚽ Journées' },
            { id: 'scorers', label: '🥇 Buteurs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          
          {/* Header de la ligue */}
          <div className={`bg-gradient-to-r ${leagueInfo.color} px-6 py-4`}>
            <h2 className="text-2xl font-bold text-white">
              {leagueInfo.flag} {leagueInfo.name}
            </h2>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Chargement...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-12 text-center text-red-400">
              {error}
            </div>
          )}

          {/* ===================== CLASSEMENT ===================== */}
          {!loading && !error && activeTab === 'standings' && (
            <div className="overflow-x-auto p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-800">
                    <th className="py-3 px-2 text-left">#</th>
                    <th className="py-3 px-2 text-left">Équipe</th>
                    <th className="py-3 px-2 text-center">MJ</th>
                    <th className="py-3 px-2 text-center">V</th>
                    <th className="py-3 px-2 text-center">N</th>
                    <th className="py-3 px-2 text-center">D</th>
                    <th className="py-3 px-2 text-center">BP</th>
                    <th className="py-3 px-2 text-center">BC</th>
                    <th className="py-3 px-2 text-center">DB</th>
                    <th className="py-3 px-2 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <tr 
                      key={team.team.id}
                      className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                        index < 4 ? 'bg-green-900/20' : 
                        index >= standings.length - 3 ? 'bg-red-900/20' : ''
                      }`}
                    >
                      <td className="py-3 px-2 text-gray-400 font-medium">{team.position}</td>
                      <td className="py-3 px-2">
                        <Link 
                          to={`/football/club/${team.team.id}`}
                          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                          <img 
                            src={team.team.crest} 
                            alt={team.team.name}
                            className="w-8 h-8 object-contain"
                          />
                          <span className="text-white font-medium hover:text-pink-400 transition-colors">
                            {team.team.name}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-center text-gray-400">{team.playedGames}</td>
                      <td className="py-3 px-2 text-center text-green-400">{team.won}</td>
                      <td className="py-3 px-2 text-center text-gray-400">{team.draw}</td>
                      <td className="py-3 px-2 text-center text-red-400">{team.lost}</td>
                      <td className="py-3 px-2 text-center text-gray-300">{team.goalsFor}</td>
                      <td className="py-3 px-2 text-center text-gray-300">{team.goalsAgainst}</td>
                      <td className="py-3 px-2 text-center text-gray-300">
                        {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                      </td>
                      <td className="py-3 px-2 text-center text-white font-bold text-lg">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Légende */}
              <div className="flex gap-6 mt-4 pt-4 border-t border-gray-800 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-900/50 rounded"></div>
                  <span className="text-gray-400">Qualification Champions League</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-900/50 rounded"></div>
                  <span className="text-gray-400">Relégation</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================== MATCHS À VENIR ===================== */}
          {!loading && !error && activeTab === 'fixtures' && (
            <div className="p-4">
              {fixtures.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Aucun match à venir</p>
              ) : (
                <div className="space-y-3">
                  {fixtures.map((match) => (
                    <div 
                      key={match.id}
                      className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
                    >
                      <Link 
                        to={`/football/club/${match.homeTeam.id}`}
                        className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
                      >
                        <img 
                          src={match.homeTeam.crest} 
                          alt={match.homeTeam.name}
                          className="w-10 h-10 object-contain"
                        />
                        <span className="text-white font-medium text-right flex-1 hover:text-pink-400">
                          {match.homeTeam.name}
                        </span>
                      </Link>
                      
                      <div className="px-6 text-center">
                        <div className="text-xs text-gray-400 mb-1">
                          {formatDateFR(match.utcDate)}
                        </div>
                        <div className="text-white font-bold text-lg">VS</div>
                        <div className="text-xs text-pink-400 mt-1">
                          J{match.matchday}
                        </div>
                      </div>
                      
                      <Link 
                        to={`/football/club/${match.awayTeam.id}`}
                        className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
                      >
                        <span className="text-white font-medium flex-1 hover:text-pink-400">
                          {match.awayTeam.name}
                        </span>
                        <img 
                          src={match.awayTeam.crest} 
                          alt={match.awayTeam.name}
                          className="w-10 h-10 object-contain"
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================== RÉSULTATS PAR JOURNÉE ===================== */}
          {!loading && !error && activeTab === 'results' && (
            <div className="p-4">
              {/* Navigation par journée */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={goToPreviousMatchday}
                  disabled={selectedMatchday <= 1}
                  className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Préc.
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-xl">
                    Journée {selectedMatchday}
                  </span>
                  {selectedMatchday === currentMatchday && (
                    <span className="px-2 py-1 bg-pink-500 text-white text-xs rounded-full">
                      En cours
                    </span>
                  )}
                </div>
                
                <button
                  onClick={goToNextMatchday}
                  disabled={selectedMatchday >= leagueInfo.totalMatchdays}
                  className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suiv. →
                </button>
              </div>
              
              {/* Bouton retour à la journée actuelle */}
              {selectedMatchday !== currentMatchday && (
                <div className="text-center mb-4">
                  <button
                    onClick={goToCurrentMatchday}
                    className="text-pink-400 hover:text-pink-300 text-sm underline"
                  >
                    ↩ Retour à la journée {currentMatchday}
                  </button>
                </div>
              )}

              {/* Sélecteur rapide de journée */}
              <div className="flex flex-wrap justify-center gap-1 mb-6">
                {Array.from({ length: leagueInfo.totalMatchdays }, (_, i) => i + 1).map((md) => (
                  <button
                    key={md}
                    onClick={() => setSelectedMatchday(md)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-all ${
                      selectedMatchday === md
                        ? 'bg-pink-500 text-white'
                        : md === currentMatchday
                          ? 'bg-gray-700 text-pink-400 border border-pink-500'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {md}
                  </button>
                ))}
              </div>
              
              {/* Liste des matchs de la journée */}
              {matchdayMatches.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Pas de matchs pour cette journée
                </p>
              ) : (
                <div className="space-y-3">
                  {/* Matchs joués */}
                  {playedMatches.length > 0 && (
                    <>
                      <h3 className="text-gray-400 text-sm font-medium mb-2">
                        ✅ Matchs terminés ({playedMatches.length})
                      </h3>
                      {playedMatches.map((match) => (
                        <div 
                          key={match.id}
                          className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
                        >
                          <Link 
                            to={`/football/club/${match.homeTeam.id}`}
                            className="flex items-center gap-3 flex-1 hover:opacity-80"
                          >
                            <img 
                              src={match.homeTeam.crest} 
                              alt={match.homeTeam.name}
                              className="w-10 h-10 object-contain"
                            />
                            <span className="text-white font-medium text-right flex-1 hover:text-pink-400">
                              {match.homeTeam.name}
                            </span>
                          </Link>
                          
                          <div className="px-6 text-center">
                            <div className="flex items-center gap-2">
                              <span className={`text-2xl font-bold ${
                                (match.score.fullTime.home ?? 0) > (match.score.fullTime.away ?? 0) 
                                  ? 'text-green-400' 
                                  : 'text-white'
                              }`}>
                                {match.score.fullTime.home}
                              </span>
                              <span className="text-gray-500">-</span>
                              <span className={`text-2xl font-bold ${
                                (match.score.fullTime.away ?? 0) > (match.score.fullTime.home ?? 0) 
                                  ? 'text-green-400' 
                                  : 'text-white'
                              }`}>
                                {match.score.fullTime.away}
                              </span>
                            </div>
                          </div>
                          
                          <Link 
                            to={`/football/club/${match.awayTeam.id}`}
                            className="flex items-center gap-3 flex-1 hover:opacity-80"
                          >
                            <span className="text-white font-medium flex-1 hover:text-pink-400">
                              {match.awayTeam.name}
                            </span>
                            <img 
                              src={match.awayTeam.crest} 
                              alt={match.awayTeam.name}
                              className="w-10 h-10 object-contain"
                            />
                          </Link>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {/* Matchs à venir */}
                  {upcomingMatches.length > 0 && (
                    <>
                      <h3 className="text-gray-400 text-sm font-medium mb-2 mt-6">
                        ⏳ À venir ({upcomingMatches.length})
                      </h3>
                      {upcomingMatches.map((match) => (
                        <div 
                          key={match.id}
                          className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between border border-gray-700"
                        >
                          <Link 
                            to={`/football/club/${match.homeTeam.id}`}
                            className="flex items-center gap-3 flex-1 hover:opacity-80"
                          >
                            <img 
                              src={match.homeTeam.crest} 
                              alt={match.homeTeam.name}
                              className="w-10 h-10 object-contain"
                            />
                            <span className="text-white font-medium text-right flex-1 hover:text-pink-400">
                              {match.homeTeam.name}
                            </span>
                          </Link>
                          
                          <div className="px-6 text-center">
                            <div className="text-xs text-gray-400 mb-1">
                              {formatDateFR(match.utcDate)}
                            </div>
                            <div className="text-white font-bold">VS</div>
                          </div>
                          
                          <Link 
                            to={`/football/club/${match.awayTeam.id}`}
                            className="flex items-center gap-3 flex-1 hover:opacity-80"
                          >
                            <span className="text-white font-medium flex-1 hover:text-pink-400">
                              {match.awayTeam.name}
                            </span>
                            <img 
                              src={match.awayTeam.crest} 
                              alt={match.awayTeam.name}
                              className="w-10 h-10 object-contain"
                            />
                          </Link>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===================== MEILLEURS BUTEURS ===================== */}
          {!loading && !error && activeTab === 'scorers' && (
            <div className="p-4">
              {scorers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Données non disponibles</p>
              ) : (
                <div className="space-y-2">
                  {scorers.slice(0, 15).map((scorer, index) => (
                    <div 
                      key={scorer.player.id}
                      className={`flex items-center gap-4 p-3 rounded-xl ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-900/30 to-transparent' : 'bg-gray-800'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-700 text-white' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <Link to={`/football/club/${scorer.team.id}`}>
                        <img 
                          src={scorer.team.crest} 
                          alt={scorer.team.name}
                          className="w-8 h-8 object-contain hover:scale-110 transition-transform"
                        />
                      </Link>
                      
                      <div className="flex-1">
                        <div className="text-white font-medium">{scorer.player.name}</div>
                        <Link 
                          to={`/football/club/${scorer.team.id}`}
                          className="text-gray-400 text-sm hover:text-pink-400"
                        >
                          {scorer.team.name}
                        </Link>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{scorer.goals}</div>
                        <div className="text-xs text-gray-400">buts</div>
                      </div>
                      
                      {scorer.assists !== null && (
                        <div className="text-right ml-4">
                          <div className="text-lg font-medium text-gray-300">{scorer.assists}</div>
                          <div className="text-xs text-gray-400">passes</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
        
      </div>
    </div>
  );
}