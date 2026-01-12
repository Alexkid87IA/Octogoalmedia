// src/components/article/blocks/PlayerComparison.tsx
// Comparaison de deux joueurs côte à côte
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Trophy, ArrowRight } from 'lucide-react';
import { PlayerComparisonBlock } from '../../../types/sanity';
import { urlFor } from '../../../utils/sanityClient';

interface PlayerComparisonProps {
  value: PlayerComparisonBlock;
}

const PlayerComparison: React.FC<PlayerComparisonProps> = ({ value }) => {
  const { title, player1, player2, stats, verdict, season } = value;

  // Récupérer l'URL d'image d'un joueur
  const getPlayerImage = (player: typeof player1) => {
    if (!player?.image?.asset) return null;
    try {
      if (player.image.asset.url) return player.image.asset.url;
      if (player.image.asset._ref) return urlFor(player.image).width(200).height(200).url();
      return null;
    } catch {
      return null;
    }
  };

  const player1Image = getPlayerImage(player1);
  const player2Image = getPlayerImage(player2);

  // Déterminer la couleur de l'avantage
  const getAdvantageStyle = (advantage?: string) => {
    if (advantage === 'player1') return { p1: 'text-green-400 font-bold', p2: 'text-gray-400' };
    if (advantage === 'player2') return { p1: 'text-gray-400', p2: 'text-green-400 font-bold' };
    return { p1: 'text-gray-300', p2: 'text-gray-300' };
  };

  return (
    <div className="my-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      {title && (
        <div className="px-6 py-4 border-b border-white/10 bg-black/30">
          <h3 className="text-xl font-bold text-white text-center">{title}</h3>
          {season && (
            <p className="text-sm text-gray-500 text-center mt-1">Saison {season}</p>
          )}
        </div>
      )}

      {/* Joueurs */}
      <div className="grid grid-cols-2 gap-4 p-6">
        {/* Joueur 1 */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-600/20 overflow-hidden border-2 border-pink-500/30">
            {player1Image ? (
              <img src={player1Image} alt={player1.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={40} className="text-pink-400" />
              </div>
            )}
          </div>
          <h4 className="text-lg font-bold text-white">{player1.name}</h4>
          {player1.club && (
            <p className="text-sm text-gray-400">{player1.club}</p>
          )}
        </div>

        {/* Joueur 2 */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-600/20 overflow-hidden border-2 border-blue-500/30">
            {player2Image ? (
              <img src={player2Image} alt={player2.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={40} className="text-blue-400" />
              </div>
            )}
          </div>
          <h4 className="text-lg font-bold text-white">{player2.name}</h4>
          {player2.club && (
            <p className="text-sm text-gray-400">{player2.club}</p>
          )}
        </div>
      </div>

      {/* Stats comparatives */}
      <div className="border-t border-white/10">
        {stats?.map((stat, index) => {
          const advantageStyle = getAdvantageStyle(stat.advantage);
          return (
            <div
              key={stat._key || index}
              className={`grid grid-cols-3 items-center px-6 py-3 ${
                index % 2 === 0 ? 'bg-black/20' : ''
              }`}
            >
              <span className={`text-lg text-right ${advantageStyle.p1}`}>
                {stat.value1}
              </span>
              <span className="text-sm text-gray-500 text-center px-2">
                {stat.label}
              </span>
              <span className={`text-lg text-left ${advantageStyle.p2}`}>
                {stat.value2}
              </span>
            </div>
          );
        })}
      </div>

      {/* Verdict */}
      {verdict && (
        <div className="p-6 border-t border-white/10 bg-gradient-to-r from-pink-500/10 to-blue-500/10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Trophy size={20} className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Verdict
            </span>
          </div>

          {verdict.winner && (
            <p className="text-lg font-bold text-white text-center mb-2">
              {verdict.winner === 'draw' && 'Égalité'}
              {verdict.winner === 'player1' && `Avantage ${player1.name}`}
              {verdict.winner === 'player2' && `Avantage ${player2.name}`}
            </p>
          )}

          {verdict.comment && (
            <p className="text-gray-400 text-center text-sm leading-relaxed">
              {verdict.comment}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerComparison;
