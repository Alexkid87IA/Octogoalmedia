/**
 * Types pour les réponses de l'API Football
 * Documentation: https://www.api-football.com/documentation-v3
 */

// =============================================
// TYPES DE BASE
// =============================================

export interface ApiTeam {
  id: number;
  name: string;
  logo?: string;
  code?: string;
  country?: string;
  founded?: number;
  national?: boolean;
}

export interface ApiPlayer {
  id: number;
  name: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  birth?: {
    date: string;
    place: string;
    country: string;
  };
  nationality?: string;
  height?: string;
  weight?: string;
  injured?: boolean;
  photo?: string;
  number?: number;
  pos?: string;
  grid?: string;
}

export interface ApiLeague {
  id: number;
  name: string;
  country?: string;
  logo?: string;
  flag?: string;
  season?: number;
  round?: string;
}

export interface ApiVenue {
  id?: number;
  name?: string;
  address?: string;
  city?: string;
  capacity?: number;
  surface?: string;
  image?: string;
}

// =============================================
// STANDINGS (CLASSEMENTS)
// =============================================

export interface ApiStandingTeam {
  id: number;
  name: string;
  logo: string;
}

export interface ApiStandingStats {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
}

export interface ApiStanding {
  rank: number;
  team: ApiStandingTeam;
  points: number;
  goalsDiff: number;
  group?: string;
  form?: string;
  status?: string;
  description?: string;
  all: ApiStandingStats;
  home: ApiStandingStats;
  away: ApiStandingStats;
  update?: string;
}

export interface ApiStandingsResponse {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    standings: ApiStanding[][];
  };
}

// =============================================
// FIXTURES (MATCHS)
// =============================================

export interface ApiFixtureStatus {
  long: string;
  short: string;
  elapsed?: number;
}

export interface ApiFixture {
  id: number;
  referee?: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods?: {
    first?: number;
    second?: number;
  };
  venue?: ApiVenue;
  status: ApiFixtureStatus;
}

export interface ApiScore {
  halftime?: {
    home: number | null;
    away: number | null;
  };
  fulltime?: {
    home: number | null;
    away: number | null;
  };
  extratime?: {
    home: number | null;
    away: number | null;
  };
  penalty?: {
    home: number | null;
    away: number | null;
  };
}

export interface ApiGoals {
  home: number | null;
  away: number | null;
}

export interface ApiFixtureTeams {
  home: ApiTeam & { winner?: boolean | null };
  away: ApiTeam & { winner?: boolean | null };
}

export interface ApiFixtureResponse {
  fixture: ApiFixture;
  league: ApiLeague;
  teams: ApiFixtureTeams;
  goals: ApiGoals;
  score: ApiScore;
}

// =============================================
// EVENTS (ÉVÉNEMENTS DE MATCH)
// =============================================

export interface ApiEvent {
  time: {
    elapsed: number;
    extra?: number | null;
  };
  team: ApiTeam;
  player: {
    id: number;
    name: string;
  };
  assist?: {
    id: number | null;
    name: string | null;
  };
  type: string;
  detail: string;
  comments?: string | null;
}

// =============================================
// STATISTICS (STATISTIQUES)
// =============================================

export interface ApiStatistic {
  type: string;
  value: number | string | null;
}

export interface ApiTeamStatistics {
  team: ApiTeam;
  statistics: ApiStatistic[];
}

// =============================================
// LINEUPS (COMPOSITIONS)
// =============================================

export interface ApiLineupPlayer {
  player: ApiPlayer;
}

export interface ApiLineup {
  team: ApiTeam;
  coach?: {
    id: number;
    name: string;
    photo?: string;
  };
  formation?: string;
  startXI: ApiLineupPlayer[];
  substitutes: ApiLineupPlayer[];
}

// =============================================
// PLAYER STATISTICS
// =============================================

export interface ApiPlayerStatistics {
  player: ApiPlayer;
  statistics: Array<{
    team: ApiTeam;
    league: ApiLeague;
    games: {
      appearences?: number;
      lineups?: number;
      minutes?: number;
      number?: number;
      position?: string;
      rating?: string;
      captain?: boolean;
    };
    substitutes?: {
      in?: number;
      out?: number;
      bench?: number;
    };
    shots?: {
      total?: number;
      on?: number;
    };
    goals?: {
      total?: number;
      conceded?: number;
      assists?: number;
      saves?: number;
    };
    passes?: {
      total?: number;
      key?: number;
      accuracy?: number;
    };
    tackles?: {
      total?: number;
      blocks?: number;
      interceptions?: number;
    };
    duels?: {
      total?: number;
      won?: number;
    };
    dribbles?: {
      attempts?: number;
      success?: number;
      past?: number;
    };
    fouls?: {
      drawn?: number;
      committed?: number;
    };
    cards?: {
      yellow?: number;
      yellowred?: number;
      red?: number;
    };
    penalty?: {
      won?: number;
      commited?: number;
      scored?: number;
      missed?: number;
      saved?: number;
    };
  }>;
}

// =============================================
// TOP SCORERS / ASSISTS
// =============================================

export interface ApiTopScorer {
  player: ApiPlayer;
  statistics: Array<{
    team: ApiTeam;
    league: ApiLeague;
    games: {
      appearences?: number;
      lineups?: number;
      minutes?: number;
      number?: number;
      position?: string;
      rating?: string;
      captain?: boolean;
    };
    goals: {
      total: number;
      conceded?: number;
      assists?: number;
      saves?: number;
    };
    shots?: {
      total?: number;
      on?: number;
    };
    penalty?: {
      won?: number;
      commited?: number;
      scored?: number;
      missed?: number;
      saved?: number;
    };
  }>;
}

// =============================================
// TRANSFERS
// =============================================

export interface ApiTransfer {
  player: ApiPlayer;
  update?: string;
  transfers: Array<{
    date: string;
    type: string;
    teams: {
      in: ApiTeam;
      out: ApiTeam;
    };
  }>;
}

// =============================================
// INJURIES
// =============================================

export interface ApiInjury {
  player: ApiPlayer;
  team: ApiTeam;
  fixture?: {
    id: number;
    timezone: string;
    date: string;
    timestamp: number;
  };
  league: ApiLeague;
}

// =============================================
// MATCH PLAYER STATS
// =============================================

export interface ApiMatchPlayerStats {
  player: ApiPlayer;
  statistics: Array<{
    games?: {
      minutes?: number;
      number?: number;
      position?: string;
      rating?: string;
      captain?: boolean;
      substitute?: boolean;
    };
    offsides?: number | null;
    shots?: {
      total?: number | null;
      on?: number | null;
    };
    goals?: {
      total?: number | null;
      conceded?: number | null;
      assists?: number | null;
      saves?: number | null;
    };
    passes?: {
      total?: number | null;
      key?: number | null;
      accuracy?: string | null;
    };
    tackles?: {
      total?: number | null;
      blocks?: number | null;
      interceptions?: number | null;
    };
    duels?: {
      total?: number | null;
      won?: number | null;
    };
    dribbles?: {
      attempts?: number | null;
      success?: number | null;
      past?: number | null;
    };
    fouls?: {
      drawn?: number | null;
      committed?: number | null;
    };
    cards?: {
      yellow?: number;
      red?: number;
    };
    penalty?: {
      won?: number | null;
      commited?: number | null;
      scored?: number | null;
      missed?: number | null;
      saved?: number | null;
    };
  }>;
}

export interface ApiMatchPlayersResponse {
  team: ApiTeam;
  players: ApiMatchPlayerStats[];
}

// =============================================
// TYPES INTERNES TRANSFORMÉS
// =============================================

export interface TransformedStanding {
  position: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}

export interface TransformedMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  score: {
    home: number | null;
    away: number | null;
  };
  competition?: {
    id: number;
    name: string;
    logo: string;
  };
  venue?: string;
  round?: string;
}

export interface TransformedTopScorer {
  player: {
    id: number;
    name: string;
    photo: string;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  goals: number;
  assists: number;
  matches: number;
  rating?: number | null;
}

export interface TransformedEvent {
  time: number;
  extraTime?: number | null;
  type: string;
  detail: string;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist?: {
    id: number | null;
    name: string | null;
  };
  comments?: string | null;
}

export interface TransformedLineupPlayer {
  id: number;
  name: string;
  number?: number;
  pos?: string;
  grid?: string;
  photo?: string;
}

export interface TransformedLineup {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  coach?: {
    id: number;
    name: string;
    photo?: string;
  };
  formation?: string;
  startXI: TransformedLineupPlayer[];
  substitutes: TransformedLineupPlayer[];
}

// =============================================
// CACHE TYPES
// =============================================

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

// =============================================
// GROUPED STANDINGS (pour compétitions à groupes)
// =============================================

export interface GroupStanding {
  group: string;
  teams: TransformedStanding[];
}
