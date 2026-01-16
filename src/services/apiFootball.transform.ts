// src/services/apiFootball.transform.ts
// Fonctions de transformation pour API-Football

// Types pour les réponses API brutes
interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue?: { name: string };
    referee?: string;
  };
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
  };
}

interface ApiStandingTeam {
  rank: number;
  team: { id: number; name: string; logo: string };
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  points: number;
  goalsDiff: number;
  form: string;
  group?: string;
}

interface ApiTopScorer {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    nationality: string;
    photo: string;
  };
  statistics: Array<{
    team?: { id: number; name: string; logo: string };
    goals?: { total: number; assists: number };
    games?: { appearences: number };
  }>;
}

interface ApiEvent {
  time: { elapsed: number; extra?: number };
  team: { id: number; name: string; logo: string };
  player?: { id?: number; name?: string };
  assist?: { id?: number; name?: string };
  type: string;
  detail?: string;
  comments?: string;
}

interface ApiTeamData {
  team: { id: number; name: string; logo: string; code?: string; founded?: number; country?: string };
  venue?: { name: string; address?: string };
}

// Status mapping
const STATUS_MAPPING: Record<string, string> = {
  TBD: 'SCHEDULED',
  NS: 'SCHEDULED',
  FT: 'FINISHED',
  AET: 'FINISHED',
  PEN: 'FINISHED',
  '1H': 'IN_PLAY',
  HT: 'IN_PLAY',
  '2H': 'IN_PLAY',
  ET: 'IN_PLAY',
  BT: 'IN_PLAY',
  P: 'IN_PLAY',
  SUSP: 'SUSPENDED',
  INT: 'INTERRUPTED',
  PST: 'POSTPONED',
  CANC: 'CANCELLED',
  ABD: 'ABANDONED',
  AWD: 'AWARDED',
  WO: 'WALKOVER',
  LIVE: 'IN_PLAY',
};

/**
 * Extrait le numéro de journée depuis le round
 */
export function extractMatchday(round: string): number {
  if (!round) return 1;
  const match = round.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}

/**
 * Transforme un match API-Football en format compatible avec l'ancien format
 */
export function transformMatch(fixture: ApiFixture) {
  return {
    id: fixture.fixture.id,
    utcDate: fixture.fixture.date,
    status: STATUS_MAPPING[fixture.fixture.status.short] || fixture.fixture.status.short,
    statusShort: fixture.fixture.status.short,
    minute: fixture.fixture.status.elapsed,
    matchday: extractMatchday(fixture.league.round),
    round: fixture.league.round,
    homeTeam: {
      id: fixture.teams.home.id,
      name: fixture.teams.home.name,
      shortName: fixture.teams.home.name,
      tla: fixture.teams.home.name.substring(0, 3).toUpperCase(),
      crest: fixture.teams.home.logo,
    },
    awayTeam: {
      id: fixture.teams.away.id,
      name: fixture.teams.away.name,
      shortName: fixture.teams.away.name,
      tla: fixture.teams.away.name.substring(0, 3).toUpperCase(),
      crest: fixture.teams.away.logo,
    },
    score: {
      fullTime: {
        home: fixture.goals.home,
        away: fixture.goals.away,
      },
      halfTime: {
        home: fixture.score.halftime.home,
        away: fixture.score.halftime.away,
      },
    },
    competition: {
      id: fixture.league.id,
      name: fixture.league.name,
      emblem: fixture.league.logo,
    },
    venue: fixture.fixture.venue?.name,
    referee: fixture.fixture.referee,
  };
}

/**
 * Transforme un classement API-Football
 */
export function transformStanding(team: ApiStandingTeam) {
  return {
    position: team.rank,
    team: {
      id: team.team.id,
      name: team.team.name,
      shortName: team.team.name,
      tla: team.team.name.substring(0, 3).toUpperCase(),
      crest: team.team.logo,
    },
    playedGames: team.all.played,
    won: team.all.win,
    draw: team.all.draw,
    lost: team.all.lose,
    points: team.points,
    goalsFor: team.all.goals.for,
    goalsAgainst: team.all.goals.against,
    goalDifference: team.goalsDiff,
    form: team.form,
  };
}

/**
 * Transforme un buteur API-Football
 */
export function transformScorer(item: ApiTopScorer) {
  return {
    player: {
      id: item.player.id,
      name: item.player.name,
      firstName: item.player.firstname,
      lastName: item.player.lastname,
      nationality: item.player.nationality,
      photo: item.player.photo,
    },
    team: {
      id: item.statistics[0]?.team?.id,
      name: item.statistics[0]?.team?.name,
      crest: item.statistics[0]?.team?.logo,
    },
    goals: item.statistics[0]?.goals?.total || 0,
    assists: item.statistics[0]?.goals?.assists || 0,
    playedMatches: item.statistics[0]?.games?.appearences || 0,
  };
}

/**
 * Transforme un événement de match
 */
export function transformEvent(event: ApiEvent) {
  return {
    time: {
      elapsed: event.time.elapsed,
      extra: event.time.extra,
    },
    team: {
      id: event.team.id,
      name: event.team.name,
      logo: event.team.logo,
    },
    player: {
      id: event.player?.id,
      name: event.player?.name,
    },
    assist: {
      id: event.assist?.id,
      name: event.assist?.name,
    },
    type: event.type,
    detail: event.detail,
    comments: event.comments,
  };
}

/**
 * Transforme les données d'une équipe
 */
export function transformTeam(item: ApiTeamData) {
  return {
    id: item.team.id,
    name: item.team.name,
    shortName: item.team.name,
    tla: item.team.code || item.team.name.substring(0, 3).toUpperCase(),
    crest: item.team.logo,
    venue: item.venue?.name,
    founded: item.team.founded,
    country: item.team.country,
  };
}

/**
 * Parse une valeur de stat (gère les pourcentages)
 */
export function parseStatValue(stats: Array<{ type: string; value: string | number | null }>, type: string): number {
  const stat = stats.find((s) => s.type === type);
  if (!stat) return 0;
  if (typeof stat.value === 'string' && stat.value.includes('%')) {
    return parseInt(stat.value);
  }
  return (stat.value as number) || 0;
}
