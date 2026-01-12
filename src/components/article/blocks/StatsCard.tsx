// src/components/article/blocks/StatsCard.tsx
// Carte de statistiques comparatives entre 2 joueurs
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ComparisonStat {
  _key?: string;
  label: string;
  value1: string;
  value2: string;
}

interface StatsCardValue {
  _type: 'statsCard';
  title?: string;
  player1Name?: string;
  player2Name?: string;
  stats?: ComparisonStat[];
  source?: string;
}

interface StatsCardProps {
  value: StatsCardValue;
}

// Comparer les valeurs pour déterminer l'avantage
const getAdvantage = (val1: string, val2: string): 'player1' | 'player2' | 'equal' => {
  const num1 = parseFloat(val1.replace(/[^0-9.-]/g, ''));
  const num2 = parseFloat(val2.replace(/[^0-9.-]/g, ''));

  if (isNaN(num1) || isNaN(num2)) return 'equal';
  if (num1 > num2) return 'player1';
  if (num2 > num1) return 'player2';
  return 'equal';
};

const StatsCard: React.FC<StatsCardProps> = ({ value }) => {
  const { title, player1Name, player2Name, stats, source } = value;

  // Si pas de stats, ne rien afficher
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="my-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header avec titre */}
      {title && (
        <div className="px-6 py-4 border-b border-white/10 bg-black/30">
          <h3 className="text-lg font-bold text-white text-center">{title}</h3>
        </div>
      )}

      {/* Noms des joueurs */}
      {(player1Name || player2Name) && (
        <div className="grid grid-cols-3 items-center px-6 py-4 bg-black/20 border-b border-white/10">
          <div className="text-center">
            <span className="text-lg font-bold text-pink-400">{player1Name || 'Joueur 1'}</span>
          </div>
          <div className="text-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider">VS</span>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-blue-400">{player2Name || 'Joueur 2'}</span>
          </div>
        </div>
      )}

      {/* Stats comparatives */}
      <div>
        {stats.map((stat, index) => {
          const advantage = getAdvantage(stat.value1, stat.value2);

          return (
            <div
              key={stat._key || index}
              className={`grid grid-cols-3 items-center px-6 py-4 ${
                index % 2 === 0 ? 'bg-black/10' : ''
              } ${index !== stats.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              {/* Valeur joueur 1 */}
              <div className="text-center">
                <span
                  className={`text-2xl font-bold ${
                    advantage === 'player1'
                      ? 'text-green-400'
                      : advantage === 'player2'
                      ? 'text-gray-500'
                      : 'text-white'
                  }`}
                >
                  {stat.value1}
                </span>
              </div>

              {/* Label central */}
              <div className="text-center">
                <span className="text-sm text-gray-400 font-medium">
                  {stat.label}
                </span>
              </div>

              {/* Valeur joueur 2 */}
              <div className="text-center">
                <span
                  className={`text-2xl font-bold ${
                    advantage === 'player2'
                      ? 'text-green-400'
                      : advantage === 'player1'
                      ? 'text-gray-500'
                      : 'text-white'
                  }`}
                >
                  {stat.value2}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Source */}
      {source && (
        <div className="px-6 py-3 border-t border-white/10 bg-black/20">
          <span className="text-xs text-gray-500">Source: {source}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
