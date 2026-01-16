import { describe, it, expect } from 'vitest';
import {
  extractMatchday,
  transformMatch,
  transformStanding,
  transformScorer,
  transformEvent,
  transformTeam,
  parseStatValue,
} from './apiFootball.transform';

describe('apiFootball.transform', () => {
  describe('extractMatchday', () => {
    it('should extract matchday from regular season round', () => {
      expect(extractMatchday('Regular Season - 15')).toBe(15);
    });

    it('should extract matchday from simple number', () => {
      expect(extractMatchday('Round 3')).toBe(3);
    });

    it('should return 1 for empty string', () => {
      expect(extractMatchday('')).toBe(1);
    });

    it('should return 1 for knockout rounds without numbers', () => {
      expect(extractMatchday('Final')).toBe(1);
    });

    it('should handle League Phase rounds', () => {
      expect(extractMatchday('League Phase - 6')).toBe(6);
    });
  });

  describe('transformMatch', () => {
    const mockFixture = {
      fixture: {
        id: 12345,
        date: '2024-01-15T20:00:00Z',
        status: { short: 'FT', elapsed: 90 },
        venue: { name: 'Parc des Princes' },
        referee: 'M. Oliver',
      },
      league: {
        id: 61,
        name: 'Ligue 1',
        logo: 'https://example.com/ligue1.png',
        round: 'Regular Season - 18',
      },
      teams: {
        home: { id: 85, name: 'Paris Saint-Germain', logo: 'https://example.com/psg.png' },
        away: { id: 81, name: 'Olympique de Marseille', logo: 'https://example.com/om.png' },
      },
      goals: { home: 3, away: 1 },
      score: {
        halftime: { home: 1, away: 0 },
      },
    };

    it('should transform fixture ID', () => {
      const result = transformMatch(mockFixture);
      expect(result.id).toBe(12345);
    });

    it('should transform date', () => {
      const result = transformMatch(mockFixture);
      expect(result.utcDate).toBe('2024-01-15T20:00:00Z');
    });

    it('should map status correctly', () => {
      const result = transformMatch(mockFixture);
      expect(result.status).toBe('FINISHED');
      expect(result.statusShort).toBe('FT');
    });

    it('should transform home team', () => {
      const result = transformMatch(mockFixture);
      expect(result.homeTeam.id).toBe(85);
      expect(result.homeTeam.name).toBe('Paris Saint-Germain');
      expect(result.homeTeam.crest).toBe('https://example.com/psg.png');
    });

    it('should transform away team', () => {
      const result = transformMatch(mockFixture);
      expect(result.awayTeam.id).toBe(81);
      expect(result.awayTeam.name).toBe('Olympique de Marseille');
    });

    it('should transform scores', () => {
      const result = transformMatch(mockFixture);
      expect(result.score.fullTime.home).toBe(3);
      expect(result.score.fullTime.away).toBe(1);
      expect(result.score.halfTime.home).toBe(1);
      expect(result.score.halfTime.away).toBe(0);
    });

    it('should transform competition', () => {
      const result = transformMatch(mockFixture);
      expect(result.competition.id).toBe(61);
      expect(result.competition.name).toBe('Ligue 1');
    });

    it('should extract matchday from round', () => {
      const result = transformMatch(mockFixture);
      expect(result.matchday).toBe(18);
    });

    it('should preserve venue and referee', () => {
      const result = transformMatch(mockFixture);
      expect(result.venue).toBe('Parc des Princes');
      expect(result.referee).toBe('M. Oliver');
    });

    it('should map IN_PLAY status', () => {
      const liveFixture = {
        ...mockFixture,
        fixture: { ...mockFixture.fixture, status: { short: '2H', elapsed: 75 } },
      };
      const result = transformMatch(liveFixture);
      expect(result.status).toBe('IN_PLAY');
    });

    it('should map SCHEDULED status', () => {
      const scheduledFixture = {
        ...mockFixture,
        fixture: { ...mockFixture.fixture, status: { short: 'NS', elapsed: null } },
      };
      const result = transformMatch(scheduledFixture);
      expect(result.status).toBe('SCHEDULED');
    });
  });

  describe('transformStanding', () => {
    const mockStanding = {
      rank: 1,
      team: { id: 85, name: 'Paris Saint-Germain', logo: 'https://example.com/psg.png' },
      all: {
        played: 20,
        win: 15,
        draw: 3,
        lose: 2,
        goals: { for: 50, against: 15 },
      },
      points: 48,
      goalsDiff: 35,
      form: 'WWDWW',
    };

    it('should transform position', () => {
      const result = transformStanding(mockStanding);
      expect(result.position).toBe(1);
    });

    it('should transform team', () => {
      const result = transformStanding(mockStanding);
      expect(result.team.id).toBe(85);
      expect(result.team.name).toBe('Paris Saint-Germain');
    });

    it('should transform stats', () => {
      const result = transformStanding(mockStanding);
      expect(result.playedGames).toBe(20);
      expect(result.won).toBe(15);
      expect(result.draw).toBe(3);
      expect(result.lost).toBe(2);
      expect(result.points).toBe(48);
    });

    it('should transform goals', () => {
      const result = transformStanding(mockStanding);
      expect(result.goalsFor).toBe(50);
      expect(result.goalsAgainst).toBe(15);
      expect(result.goalDifference).toBe(35);
    });

    it('should transform form', () => {
      const result = transformStanding(mockStanding);
      expect(result.form).toBe('WWDWW');
    });
  });

  describe('transformScorer', () => {
    const mockScorer = {
      player: {
        id: 123,
        name: 'Kylian Mbappé',
        firstname: 'Kylian',
        lastname: 'Mbappé',
        nationality: 'France',
        photo: 'https://example.com/mbappe.png',
      },
      statistics: [{
        team: { id: 85, name: 'PSG', logo: 'https://example.com/psg.png' },
        goals: { total: 25, assists: 8 },
        games: { appearences: 20 },
      }],
    };

    it('should transform player info', () => {
      const result = transformScorer(mockScorer);
      expect(result.player.id).toBe(123);
      expect(result.player.name).toBe('Kylian Mbappé');
      expect(result.player.nationality).toBe('France');
    });

    it('should transform team info', () => {
      const result = transformScorer(mockScorer);
      expect(result.team.id).toBe(85);
      expect(result.team.name).toBe('PSG');
    });

    it('should transform stats', () => {
      const result = transformScorer(mockScorer);
      expect(result.goals).toBe(25);
      expect(result.assists).toBe(8);
      expect(result.playedMatches).toBe(20);
    });

    it('should handle missing stats gracefully', () => {
      const scorerWithoutStats = {
        ...mockScorer,
        statistics: [{ team: { id: 1, name: 'Team', logo: '' } }],
      };
      const result = transformScorer(scorerWithoutStats);
      expect(result.goals).toBe(0);
      expect(result.assists).toBe(0);
    });
  });

  describe('transformEvent', () => {
    const mockEvent = {
      time: { elapsed: 45, extra: 2 },
      team: { id: 85, name: 'PSG', logo: 'https://example.com/psg.png' },
      player: { id: 123, name: 'Mbappé' },
      assist: { id: 456, name: 'Neymar' },
      type: 'Goal',
      detail: 'Normal Goal',
      comments: 'Great strike',
    };

    it('should transform time', () => {
      const result = transformEvent(mockEvent);
      expect(result.time.elapsed).toBe(45);
      expect(result.time.extra).toBe(2);
    });

    it('should transform team', () => {
      const result = transformEvent(mockEvent);
      expect(result.team.id).toBe(85);
      expect(result.team.name).toBe('PSG');
    });

    it('should transform player and assist', () => {
      const result = transformEvent(mockEvent);
      expect(result.player.id).toBe(123);
      expect(result.player.name).toBe('Mbappé');
      expect(result.assist.name).toBe('Neymar');
    });

    it('should transform event type and detail', () => {
      const result = transformEvent(mockEvent);
      expect(result.type).toBe('Goal');
      expect(result.detail).toBe('Normal Goal');
    });
  });

  describe('transformTeam', () => {
    const mockTeam = {
      team: {
        id: 85,
        name: 'Paris Saint-Germain',
        logo: 'https://example.com/psg.png',
        code: 'PSG',
        founded: 1970,
        country: 'France',
      },
      venue: { name: 'Parc des Princes', address: 'Paris' },
    };

    it('should transform team data', () => {
      const result = transformTeam(mockTeam);
      expect(result.id).toBe(85);
      expect(result.name).toBe('Paris Saint-Germain');
      expect(result.tla).toBe('PSG');
      expect(result.founded).toBe(1970);
      expect(result.country).toBe('France');
      expect(result.venue).toBe('Parc des Princes');
    });

    it('should generate TLA from name if code missing', () => {
      const teamWithoutCode = {
        team: { id: 1, name: 'Liverpool', logo: '' },
      };
      const result = transformTeam(teamWithoutCode);
      expect(result.tla).toBe('LIV');
    });
  });

  describe('parseStatValue', () => {
    it('should parse numeric value', () => {
      const stats = [{ type: 'Total Shots', value: 15 }];
      expect(parseStatValue(stats, 'Total Shots')).toBe(15);
    });

    it('should parse percentage string', () => {
      const stats = [{ type: 'Ball Possession', value: '65%' }];
      expect(parseStatValue(stats, 'Ball Possession')).toBe(65);
    });

    it('should return 0 for missing stat', () => {
      const stats = [{ type: 'Total Shots', value: 15 }];
      expect(parseStatValue(stats, 'Corner Kicks')).toBe(0);
    });

    it('should return 0 for null value', () => {
      const stats = [{ type: 'Total Shots', value: null }];
      expect(parseStatValue(stats, 'Total Shots')).toBe(0);
    });
  });
});
