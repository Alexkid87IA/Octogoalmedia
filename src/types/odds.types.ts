// src/types/odds.types.ts
// Types pour l'intégration des cotes de paris

export interface OddsValue {
  value: number;
  bookmaker: string;
}

export interface OverUnderOdds {
  line: number;      // Ex: 2.5
  over: number;      // Cote pour Over
  under: number;     // Cote pour Under
}

export interface BookmakerOdds {
  home: number;
  draw: number;
  away: number;
  overUnder?: OverUnderOdds;
  lastUpdate: string;
}

export interface BestOdds {
  home: OddsValue;
  draw: OddsValue;
  away: OddsValue;
}

export interface MatchOdds {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  odds: {
    winamax?: BookmakerOdds;
    bestOdds: BestOdds;
  };
}

export interface OddsApiResponse {
  success: boolean;
  sport: string;
  count: number;
  apiUsage: {
    remaining: string | null;
    used: string | null;
  };
  data: MatchOdds[];
}

// Mapping des compétitions pour l'API
export type SportKey =
  | 'ligue1'
  | 'premierleague'
  | 'laliga'
  | 'seriea'
  | 'bundesliga'
  | 'championsleague'
  | 'europaleague'
  | 'ligue2';

// Mapping ID compétition API-Football vers SportKey
export const COMPETITION_TO_SPORT: Record<number, SportKey> = {
  61: 'ligue1',
  39: 'premierleague',
  140: 'laliga',
  135: 'seriea',
  78: 'bundesliga',
  2: 'championsleague',
  3: 'europaleague',
  62: 'ligue2',
};

// Fonction utilitaire pour formater les cotes
export function formatOdds(value: number): string {
  if (!value || value === 0) return '-';
  return value.toFixed(2);
}

// Fonction pour déterminer la tendance d'une cote
export function getOddsTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
  if (!previous || current === previous) return 'stable';
  return current > previous ? 'up' : 'down';
}

// Fonction pour calculer la probabilité implicite
export function impliedProbability(odds: number): number {
  if (!odds || odds <= 1) return 0;
  return (1 / odds) * 100;
}

// Fonction pour trouver le favori
export function getFavorite(odds: MatchOdds): 'home' | 'draw' | 'away' | null {
  const winamax = odds.odds.winamax;
  if (!winamax) return null;

  const { home, draw, away } = winamax;
  const min = Math.min(home, draw, away);

  if (min === home) return 'home';
  if (min === away) return 'away';
  return 'draw';
}
