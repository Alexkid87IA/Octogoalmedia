import { useEffect, useState } from 'react';
import { getStandings, LEAGUES } from '../../services/apiFootball';

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
}

interface StandingsWidgetProps {
  league?: keyof typeof LEAGUES;
  title?: string;
  limit?: number;
}

export default function StandingsWidget({ 
  league = 'LIGUE_1', 
  title = 'Classement Ligue 1',
  limit = 10 
}: StandingsWidgetProps) {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true);
        const data = await getStandings(LEAGUES[league]);
        setStandings(data.slice(0, limit));
        setError(null);
      } catch (err) {
        setError('Impossible de charger le classement');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, [league, limit]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-800 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-blue-500 px-4 py-3">
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>

      {/* Tableau */}
      <div className="p-4">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-xs uppercase">
              <th className="text-left pb-2 w-8">#</th>
              <th className="text-left pb-2">Club</th>
              <th className="text-center pb-2 w-8">MJ</th>
              <th className="text-center pb-2 w-8">G</th>
              <th className="text-center pb-2 w-8">N</th>
              <th className="text-center pb-2 w-8">P</th>
              <th className="text-center pb-2 w-10">Diff</th>
              <th className="text-center pb-2 w-10 font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr 
                key={team.team.id}
                className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors ${
                  index < 3 ? 'bg-green-900/20' : 
                  index >= standings.length - 3 && limit >= 10 ? 'bg-red-900/20' : ''
                }`}
              >
                <td className="py-2 text-gray-400 font-medium">{team.position}</td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={team.team.crest} 
                      alt={team.team.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-white text-sm truncate max-w-[120px]">
                      {team.team.name}
                    </span>
                  </div>
                </td>
                <td className="py-2 text-center text-gray-400 text-sm">{team.playedGames}</td>
                <td className="py-2 text-center text-green-400 text-sm">{team.won}</td>
                <td className="py-2 text-center text-gray-400 text-sm">{team.draw}</td>
                <td className="py-2 text-center text-red-400 text-sm">{team.lost}</td>
                <td className="py-2 text-center text-gray-300 text-sm">
                  {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                </td>
                <td className="py-2 text-center text-white font-bold">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}