import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  getTeamDetails, 
  getTeamLastResults, 
  getTeamNextMatches,
  formatDateFR,
  getMatchResult,
} from '../services/apiFootball';

// Types
interface TeamDetails {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  coach: {
    id: number;
    name: string;
    nationality: string;
  } | null;
  squad: Player[];
  runningCompetitions: Competition[];
}

interface Player {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
}

interface Competition {
  id: number;
  name: string;
  code: string;
  emblem: string;
}

interface Match {
  id: number;
  utcDate: string;
  status: string;
  competition: {
    name: string;
    emblem: string;
  };
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

// Grouper les joueurs par position
const positionGroups: Record<string, string[]> = {
  'Gardiens': ['Goalkeeper'],
  'Défenseurs': ['Defence', 'Centre-Back', 'Left-Back', 'Right-Back'],
  'Milieux': ['Midfield', 'Central Midfield', 'Defensive Midfield', 'Attacking Midfield', 'Left Midfield', 'Right Midfield'],
  'Attaquants': ['Offence', 'Centre-Forward', 'Left Winger', 'Right Winger'],
};

function getPositionGroup(position: string): string {
  for (const [group, positions] of Object.entries(positionGroups)) {
    if (positions.some(p => position?.includes(p))) {
      return group;
    }
  }
  return 'Autres';
}

// Calculer l'âge
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function FootballClubPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [lastResults, setLastResults] = useState<Match[]>([]);
  const [nextMatches, setNextMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'squad' | 'matches'>('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamData() {
      if (!teamId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const id = parseInt(teamId);
        
        const [teamData, results, upcoming] = await Promise.all([
          getTeamDetails(id),
          getTeamLastResults(id, 5),
          getTeamNextMatches(id, 5),
        ]);
        
        if (!teamData) {
          setError('Club non trouvé');
          return;
        }
        
        setTeam(teamData);
        setLastResults(results);
        setNextMatches(upcoming);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTeamData();
  }, [teamId]);

  // Grouper l'effectif par position
  const squadByPosition = team?.squad.reduce((acc, player) => {
    const group = getPositionGroup(player.position);
    if (!acc[group]) acc[group] = [];
    acc[group].push(player);
    return acc;
  }, {} as Record<string, Player[]>) || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Chargement du club...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Club non trouvé'}</p>
          <Link 
            to="/football" 
            className="text-pink-400 hover:text-pink-300 underline"
          >
            ← Retour aux classements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Bouton retour */}
        <Link 
          to="/football" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          ← Retour aux classements
        </Link>

        {/* Header du club */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Blason */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl p-4 flex items-center justify-center">
              <img 
                src={team.crest} 
                alt={team.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Infos principales */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {team.name}
              </h1>
              {team.tla && (
                <span className="inline-block px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium mb-4">
                  {team.tla}
                </span>
              )}
              
              {/* Compétitions */}
              {team.runningCompetitions.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  {team.runningCompetitions.map((comp) => (
                    <div 
                      key={comp.id}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full"
                    >
                      {comp.emblem && (
                        <img src={comp.emblem} alt={comp.name} className="w-5 h-5" />
                      )}
                      <span className="text-gray-300 text-sm">{comp.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats rapides - Forme récente */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Forme récente</p>
              <div className="flex gap-1">
                {lastResults.slice(0, 5).map((match, i) => {
                  const result = getMatchResult(match, team.id);
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        result === 'win' ? 'bg-green-500 text-white' :
                        result === 'loss' ? 'bg-red-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}
                    >
                      {result === 'win' ? 'V' : result === 'loss' ? 'D' : 'N'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'info', label: '📋 Infos', icon: '📋' },
            { id: 'squad', label: '👥 Effectif', icon: '👥' },
            { id: 'matches', label: '⚽ Matchs', icon: '⚽' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===================== INFOS DU CLUB ===================== */}
        {activeTab === 'info' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Informations générales */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                🏟️ Informations
              </h2>
              <div className="space-y-4">
                {team.venue && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stade</span>
                    <span className="text-white font-medium">{team.venue}</span>
                  </div>
                )}
                {team.founded && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fondé en</span>
                    <span className="text-white font-medium">{team.founded}</span>
                  </div>
                )}
                {team.clubColors && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Couleurs</span>
                    <span className="text-white font-medium">{team.clubColors}</span>
                  </div>
                )}
                {team.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Adresse</span>
                    <span className="text-white font-medium text-right text-sm">{team.address}</span>
                  </div>
                )}
                {team.website && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Site web</span>
                    <a 
                      href={team.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      Visiter →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Entraîneur */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                👔 Staff technique
              </h2>
              {team.coach ? (
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="text-white font-bold text-lg">{team.coach.name}</div>
                  <div className="text-gray-400">Entraîneur</div>
                  {team.coach.nationality && (
                    <div className="text-gray-500 text-sm mt-1">{team.coach.nationality}</div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">Information non disponible</p>
              )}
            </div>
          </div>
        )}

        {/* ===================== EFFECTIF ===================== */}
        {activeTab === 'squad' && (
          <div className="space-y-6">
            {['Gardiens', 'Défenseurs', 'Milieux', 'Attaquants', 'Autres'].map((group) => {
              const players = squadByPosition[group];
              if (!players || players.length === 0) return null;
              
              return (
                <div key={group} className="bg-gray-900 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    {group === 'Gardiens' && '🧤'} 
                    {group === 'Défenseurs' && '🛡️'} 
                    {group === 'Milieux' && '⚙️'} 
                    {group === 'Attaquants' && '⚡'} 
                    {group === 'Autres' && '👤'} 
                    {' '}{group} ({players.length})
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {players.map((player) => (
                      <div 
                        key={player.id}
                        className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors"
                      >
                        <div className="text-white font-medium">{player.name}</div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-400">{player.nationality}</span>
                          {player.dateOfBirth && (
                            <span className="text-gray-500">
                              {calculateAge(player.dateOfBirth)} ans
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {Object.keys(squadByPosition).length === 0 && (
              <div className="bg-gray-900 rounded-2xl p-12 text-center">
                <p className="text-gray-400">Effectif non disponible</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== MATCHS ===================== */}
        {activeTab === 'matches' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Prochains matchs */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                📅 Prochains matchs
              </h2>
              {nextMatches.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Aucun match à venir</p>
              ) : (
                <div className="space-y-3">
                  {nextMatches.map((match) => {
                    const isHome = match.homeTeam.id === team.id;
                    const opponent = isHome ? match.awayTeam : match.homeTeam;
                    
                    return (
                      <div 
                        key={match.id}
                        className="bg-gray-800 rounded-xl p-4"
                      >
                        <div className="text-xs text-gray-400 mb-2">
                          {formatDateFR(match.utcDate)}
                        </div>
                        <div className="flex items-center gap-3">
                          <Link to={`/football/club/${opponent.id}`}>
                            <img 
                              src={opponent.crest} 
                              alt={opponent.name}
                              className="w-10 h-10 object-contain hover:scale-110 transition-transform"
                            />
                          </Link>
                          <div className="flex-1">
                            <span className="text-gray-500 text-sm">
                              {isHome ? 'vs' : '@'}
                            </span>
                            <Link 
                              to={`/football/club/${opponent.id}`}
                              className="text-white font-medium ml-2 hover:text-pink-400"
                            >
                              {opponent.name}
                            </Link>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            isHome 
                              ? 'bg-green-900/50 text-green-400' 
                              : 'bg-blue-900/50 text-blue-400'
                          }`}>
                            {isHome ? 'DOM' : 'EXT'}
                          </span>
                        </div>
                        {match.competition && (
                          <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            {match.competition.emblem && (
                              <img src={match.competition.emblem} alt="" className="w-4 h-4" />
                            )}
                            {match.competition.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Derniers résultats */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                ⚽ Derniers résultats
              </h2>
              {lastResults.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Aucun résultat récent</p>
              ) : (
                <div className="space-y-3">
                  {lastResults.map((match) => {
                    const isHome = match.homeTeam.id === team.id;
                    const opponent = isHome ? match.awayTeam : match.homeTeam;
                    const teamScore = isHome ? match.score.fullTime.home : match.score.fullTime.away;
                    const opponentScore = isHome ? match.score.fullTime.away : match.score.fullTime.home;
                    const result = getMatchResult(match, team.id);
                    
                    return (
                      <div 
                        key={match.id}
                        className={`bg-gray-800 rounded-xl p-4 border-l-4 ${
                          result === 'win' ? 'border-green-500' :
                          result === 'loss' ? 'border-red-500' :
                          'border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Link to={`/football/club/${opponent.id}`}>
                            <img 
                              src={opponent.crest} 
                              alt={opponent.name}
                              className="w-10 h-10 object-contain hover:scale-110 transition-transform"
                            />
                          </Link>
                          <div className="flex-1">
                            <span className="text-gray-500 text-sm">
                              {isHome ? 'vs' : '@'}
                            </span>
                            <Link 
                              to={`/football/club/${opponent.id}`}
                              className="text-white font-medium ml-2 hover:text-pink-400"
                            >
                              {opponent.name}
                            </Link>
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${
                              result === 'win' ? 'text-green-400' :
                              result === 'loss' ? 'text-red-400' :
                              'text-gray-400'
                            }`}>
                              {teamScore} - {opponentScore}
                            </div>
                          </div>
                        </div>
                        {match.competition && (
                          <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            {match.competition.emblem && (
                              <img src={match.competition.emblem} alt="" className="w-4 h-4" />
                            )}
                            {match.competition.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}