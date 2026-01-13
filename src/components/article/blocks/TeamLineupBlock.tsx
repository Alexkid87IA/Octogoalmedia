// src/components/article/blocks/TeamLineupBlock.tsx
// Bloc composition d'équipe avec terrain de foot interactif - v2.0

import React from 'react';

// Types
interface TeamLineupProps {
  value: {
    title?: string;
    matchContext?: string;
    displayMode: 'single' | 'versus';
    theme: 'classic' | 'dark' | 'ligue1' | 'ucl' | 'octogoal';
    showPlayerPhotos: boolean;
    showRatings: boolean;
    showSubstitutes: boolean;
    team1: Team;
    team2?: Team;
  };
}

interface Team {
  clubName?: string;
  clubColor?: string;
  formation: string;
  coach?: string;
  players: Player[];
  substitutes?: { _key: string; playerName: string; number?: number; position?: string }[];
}

interface Player {
  _key: string;
  position: string;
  playerName: string;
  number?: number;
  isCaptain?: boolean;
  highlight?: 'none' | 'motm' | 'goal' | 'assist' | 'yellow' | 'red';
  rating?: number;
}

// Thèmes du terrain
const PITCH_THEMES = {
  classic: { grass: 'linear-gradient(180deg, #2d8a4e 0%, #1e6b3a 50%, #2d8a4e 100%)', lines: '#ffffff' },
  dark: { grass: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)', lines: '#4a5568' },
  ligue1: { grass: 'linear-gradient(180deg, #091C3E 0%, #0D2B5C 50%, #091C3E 100%)', lines: '#ffffff' },
  ucl: { grass: 'linear-gradient(180deg, #0E1E5B 0%, #1a3a8a 50%, #0E1E5B 100%)', lines: '#ffffff' },
  octogoal: { grass: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', lines: '#ec4899' },
};

// Formations avec positions (x, y en pourcentage) - TRÈS ESPACÉES
const FORMATIONS: Record<string, { x: number; y: number }[]> = {
  '4-3-3': [
    { x: 50, y: 6 },   // GK
    { x: 8, y: 24 }, { x: 33, y: 20 }, { x: 67, y: 20 }, { x: 92, y: 24 }, // DEF - très écartés
    { x: 20, y: 44 }, { x: 50, y: 40 }, { x: 80, y: 44 }, // MID
    { x: 15, y: 66 }, { x: 50, y: 72 }, { x: 85, y: 66 }, // ATT
  ],
  '4-4-2': [
    { x: 50, y: 6 },
    { x: 8, y: 24 }, { x: 33, y: 20 }, { x: 67, y: 20 }, { x: 92, y: 24 },
    { x: 8, y: 46 }, { x: 33, y: 44 }, { x: 67, y: 44 }, { x: 92, y: 46 },
    { x: 35, y: 70 }, { x: 65, y: 70 },
  ],
  '4-2-3-1': [
    { x: 50, y: 6 },
    { x: 8, y: 24 }, { x: 33, y: 20 }, { x: 67, y: 20 }, { x: 92, y: 24 },
    { x: 33, y: 38 }, { x: 67, y: 38 },
    { x: 15, y: 56 }, { x: 50, y: 54 }, { x: 85, y: 56 },
    { x: 50, y: 74 },
  ],
  '3-5-2': [
    { x: 50, y: 6 },
    { x: 20, y: 22 }, { x: 50, y: 18 }, { x: 80, y: 22 },
    { x: 5, y: 44 }, { x: 28, y: 42 }, { x: 50, y: 38 }, { x: 72, y: 42 }, { x: 95, y: 44 },
    { x: 35, y: 70 }, { x: 65, y: 70 },
  ],
  '3-4-3': [
    { x: 50, y: 6 },
    { x: 20, y: 22 }, { x: 50, y: 18 }, { x: 80, y: 22 },
    { x: 10, y: 44 }, { x: 37, y: 42 }, { x: 63, y: 42 }, { x: 90, y: 44 },
    { x: 15, y: 66 }, { x: 50, y: 72 }, { x: 85, y: 66 },
  ],
  '5-3-2': [
    { x: 50, y: 6 },
    { x: 5, y: 26 }, { x: 27, y: 20 }, { x: 50, y: 18 }, { x: 73, y: 20 }, { x: 95, y: 26 },
    { x: 22, y: 44 }, { x: 50, y: 42 }, { x: 78, y: 44 },
    { x: 35, y: 70 }, { x: 65, y: 70 },
  ],
  '4-1-4-1': [
    { x: 50, y: 6 },
    { x: 8, y: 24 }, { x: 33, y: 20 }, { x: 67, y: 20 }, { x: 92, y: 24 },
    { x: 50, y: 36 },
    { x: 10, y: 54 }, { x: 37, y: 52 }, { x: 63, y: 52 }, { x: 90, y: 54 },
    { x: 50, y: 74 },
  ],
  '5-4-1': [
    { x: 50, y: 6 },
    { x: 5, y: 26 }, { x: 27, y: 20 }, { x: 50, y: 18 }, { x: 73, y: 20 }, { x: 95, y: 26 },
    { x: 10, y: 46 }, { x: 37, y: 44 }, { x: 63, y: 44 }, { x: 90, y: 46 },
    { x: 50, y: 72 },
  ],
  '4-5-1': [
    { x: 50, y: 6 },
    { x: 8, y: 24 }, { x: 33, y: 20 }, { x: 67, y: 20 }, { x: 92, y: 24 },
    { x: 5, y: 46 }, { x: 28, y: 44 }, { x: 50, y: 42 }, { x: 72, y: 44 }, { x: 95, y: 46 },
    { x: 50, y: 72 },
  ],
  '3-4-1-2': [
    { x: 50, y: 6 },
    { x: 20, y: 22 }, { x: 50, y: 18 }, { x: 80, y: 22 },
    { x: 10, y: 42 }, { x: 37, y: 40 }, { x: 63, y: 40 }, { x: 90, y: 42 },
    { x: 50, y: 56 },
    { x: 35, y: 72 }, { x: 65, y: 72 },
  ],
};

// Icônes des highlights
const HIGHLIGHT_ICONS: Record<string, string> = {
  motm: '⭐',
  goal: '⚽',
  assist: '🎯',
  yellow: '🟨',
  red: '🟥',
};

// Composant joueur sur le terrain - Design compact et élégant
const PlayerDot: React.FC<{
  player?: Player;
  position: { x: number; y: number };
  clubColor?: string;
  showRating?: boolean;
}> = ({ player, position, clubColor, showRating }) => {
  const bgColor = clubColor || '#ec4899';
  const lastName = player?.playerName?.split(' ').pop() || '';

  return (
    <div
      className="absolute flex flex-col items-center z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Cercle du joueur - plus petit pour éviter chevauchement */}
      <div
        className="relative w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white/90 flex items-center justify-center shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-white font-bold text-xs md:text-sm">
          {player?.number || '?'}
        </span>

        {/* Badge Capitaine */}
        {player?.isCaptain && (
          <div className="absolute -top-0.5 -left-0.5 w-3.5 h-3.5 bg-yellow-500 rounded-full flex items-center justify-center text-[8px] text-black font-bold border border-white">
            C
          </div>
        )}

        {/* Badge Highlight */}
        {player?.highlight && player.highlight !== 'none' && HIGHLIGHT_ICONS[player.highlight] && (
          <div className="absolute -top-0.5 -right-0.5 text-[10px]">
            {HIGHLIGHT_ICONS[player.highlight]}
          </div>
        )}

        {/* Note */}
        {showRating && player?.rating && (
          <div
            className={`absolute -bottom-0.5 -right-0.5 px-1 py-0.5 rounded text-[8px] text-white font-bold ${
              player.rating >= 7 ? 'bg-green-500' : player.rating >= 5 ? 'bg-amber-500' : 'bg-red-500'
            }`}
          >
            {player.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Nom du joueur - texte plus petit */}
      <span
        className="mt-0.5 text-[9px] md:text-[10px] text-white font-medium text-center max-w-[55px] truncate leading-tight"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,1)' }}
      >
        {lastName}
      </span>
    </div>
  );
};

// Composant terrain de foot - Plus grand et mieux proportionné
const FootballPitch: React.FC<{ team: Team; theme: string; showRatings?: boolean; isVersus?: boolean }> = ({
  team,
  theme,
  showRatings,
  isVersus = false,
}) => {
  const themeColors = PITCH_THEMES[theme as keyof typeof PITCH_THEMES] || PITCH_THEMES.octogoal;
  const positions = FORMATIONS[team.formation] || FORMATIONS['4-3-3'];

  return (
    <div
      className="w-full rounded-xl relative overflow-hidden shadow-xl"
      style={{
        background: themeColors.grass,
        aspectRatio: '2/3',
        maxWidth: isVersus ? '400px' : '100%',
        minHeight: isVersus ? 'auto' : '600px',
      }}
    >
      {/* Lignes du terrain SVG - ratio 2:3 (100x150) */}
      <svg
        viewBox="0 0 100 150"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Contour */}
        <rect x="5" y="5" width="90" height="140" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        {/* Ligne médiane */}
        <line x1="5" y1="75" x2="95" y2="75" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        {/* Cercle central */}
        <circle cx="50" cy="75" r="12" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        <circle cx="50" cy="75" r="1" fill={themeColors.lines} opacity="0.7" />
        {/* Surface de réparation bas (côté gardien) */}
        <rect x="22" y="5" width="56" height="18" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        <rect x="34" y="5" width="32" height="7" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        <path d="M 36 23 Q 50 30 64 23" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        {/* Surface de réparation haut */}
        <rect x="22" y="127" width="56" height="18" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        <rect x="34" y="138" width="32" height="7" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        <path d="M 36 127 Q 50 120 64 127" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        {/* Buts */}
        <rect x="40" y="2" width="20" height="3" fill="none" stroke={themeColors.lines} strokeWidth="0.6" opacity="0.8" />
        <rect x="40" y="145" width="20" height="3" fill="none" stroke={themeColors.lines} strokeWidth="0.6" opacity="0.8" />
        {/* Corners */}
        <path d="M 5 8 Q 8 5 11 5" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        <path d="M 89 5 Q 92 5 95 8" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        <path d="M 5 142 Q 8 145 11 145" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
        <path d="M 89 145 Q 92 145 95 142" fill="none" stroke={themeColors.lines} strokeWidth="0.4" opacity="0.7" />
      </svg>

      {/* Joueurs */}
      {positions.map((pos, index) => (
        <PlayerDot
          key={team.players[index]?._key || index}
          player={team.players[index]}
          position={pos}
          clubColor={team.clubColor}
          showRating={showRatings}
        />
      ))}

      {/* Badge formation */}
      <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-md border border-white/20">
        {team.formation}
      </div>
    </div>
  );
};

// Composant principal
const TeamLineupBlock: React.FC<TeamLineupProps> = ({ value }) => {
  const { title, matchContext, displayMode, theme, team1, team2, showSubstitutes, showRatings } = value;

  return (
    <div className="my-10 md:my-16">
      {/* Header */}
      {(title || matchContext) && (
        <div className="text-center mb-8">
          {title && <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h3>}
          {matchContext && <p className="text-gray-400 text-sm">{matchContext}</p>}
        </div>
      )}

      {/* Terrains */}
      <div
        className={`flex gap-4 md:gap-8 justify-center items-start ${
          displayMode === 'versus' ? 'flex-row flex-wrap' : 'flex-col items-center'
        }`}
      >
        {/* Équipe 1 */}
        <div className="text-center flex flex-col items-center">
          {team1.clubName && (
            <p className="font-bold mb-3 text-lg" style={{ color: team1.clubColor || '#ec4899' }}>
              {team1.clubName}
            </p>
          )}
          <FootballPitch team={team1} theme={theme} showRatings={showRatings} isVersus={displayMode === 'versus'} />
          {team1.coach && (
            <p className="mt-3 text-sm text-gray-400">
              <span className="text-gray-500">Coach:</span> {team1.coach}
            </p>
          )}
        </div>

        {/* VS */}
        {displayMode === 'versus' && team2 && (
          <div className="self-center px-4">
            <span className="text-3xl font-black text-gray-600">VS</span>
          </div>
        )}

        {/* Équipe 2 */}
        {displayMode === 'versus' && team2 && (
          <div className="text-center flex flex-col items-center">
            {team2.clubName && (
              <p className="font-bold mb-3 text-lg" style={{ color: team2.clubColor || '#3b82f6' }}>
                {team2.clubName}
              </p>
            )}
            <FootballPitch team={team2} theme={theme} showRatings={showRatings} isVersus />
            {team2.coach && (
              <p className="mt-3 text-sm text-gray-400">
                <span className="text-gray-500">Coach:</span> {team2.coach}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Remplaçants */}
      {showSubstitutes && (team1.substitutes?.length || (displayMode === 'versus' && team2?.substitutes?.length)) && (
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-xs uppercase tracking-wider text-gray-500 text-center mb-4">Remplaçants</p>

          <div className={`flex gap-8 ${displayMode === 'versus' ? 'justify-center flex-wrap' : 'justify-center'}`}>
            {/* Remplaçants équipe 1 */}
            {team1.substitutes && team1.substitutes.length > 0 && (
              <div className="text-center">
                {team1.clubName && displayMode === 'versus' && (
                  <p className="text-xs font-medium mb-2" style={{ color: team1.clubColor || '#ec4899' }}>
                    {team1.clubName}
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-1.5 max-w-[400px]">
                  {team1.substitutes.map((sub) => (
                    <span
                      key={sub._key}
                      className="px-2 py-1 bg-gray-800/80 text-gray-300 text-xs rounded-md"
                    >
                      {sub.number && <span className="text-gray-500 mr-1">{sub.number}</span>}
                      {sub.playerName.split(' ').pop()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Remplaçants équipe 2 */}
            {displayMode === 'versus' && team2?.substitutes && team2.substitutes.length > 0 && (
              <div className="text-center">
                {team2.clubName && (
                  <p className="text-xs font-medium mb-2" style={{ color: team2.clubColor || '#3b82f6' }}>
                    {team2.clubName}
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-1.5 max-w-[400px]">
                  {team2.substitutes.map((sub) => (
                    <span
                      key={sub._key}
                      className="px-2 py-1 bg-gray-800/80 text-gray-300 text-xs rounded-md"
                    >
                      {sub.number && <span className="text-gray-500 mr-1">{sub.number}</span>}
                      {sub.playerName.split(' ').pop()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLineupBlock;
