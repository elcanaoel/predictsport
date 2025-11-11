import axios from 'axios';

const API_KEY = process.env.FOOTBALL_API_KEY || '';
const API_HOST = process.env.FOOTBALL_API_HOST || 'v3.football.api-sports.io';

const footballApi = axios.create({
  baseURL: `https://${API_HOST}`,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
  },
});

export interface FootballFixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
    };
    venue: {
      name: string;
      city: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface TeamStatistics {
  form: string;
  goals: {
    for: {
      total: number;
      average: string;
    };
    against: {
      total: number;
      average: string;
    };
  };
  biggest: {
    wins: {
      home: string;
      away: string;
    };
  };
}

export const footballApiService = {
  // Get fixtures for a specific date
  async getFixturesByDate(date: string): Promise<FootballFixture[]> {
    try {
      const response = await footballApi.get('/fixtures', {
        params: {
          date, // Format: YYYY-MM-DD
        },
      });
      return response.data.response || [];
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      return [];
    }
  },

  // Get fixtures for major leagues
  async getFixturesByLeague(leagueId: number, season: number): Promise<FootballFixture[]> {
    try {
      const response = await footballApi.get('/fixtures', {
        params: {
          league: leagueId,
          season,
          next: 10, // Get next 10 matches
        },
      });
      return response.data.response || [];
    } catch (error) {
      console.error('Error fetching league fixtures:', error);
      return [];
    }
  },

  // Get team statistics
  async getTeamStatistics(teamId: number, season: number, leagueId: number): Promise<TeamStatistics | null> {
    try {
      const response = await footballApi.get('/teams/statistics', {
        params: {
          team: teamId,
          season,
          league: leagueId,
        },
      });
      return response.data.response || null;
    } catch (error) {
      console.error('Error fetching team statistics:', error);
      return null;
    }
  },

  // Get head to head matches
  async getHeadToHead(team1Id: number, team2Id: number): Promise<FootballFixture[]> {
    try {
      const response = await footballApi.get('/fixtures/headtohead', {
        params: {
          h2h: `${team1Id}-${team2Id}`,
          last: 5,
        },
      });
      return response.data.response || [];
    } catch (error) {
      console.error('Error fetching head to head:', error);
      return [];
    }
  },

  // Get predictions from API
  async getPredictions(fixtureId: number) {
    try {
      const response = await footballApi.get('/predictions', {
        params: {
          fixture: fixtureId,
        },
      });
      return response.data.response?.[0] || null;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return null;
    }
  },
};

// Major league IDs for popular competitions
export const MAJOR_LEAGUES = {
  PREMIER_LEAGUE: 39,      // England
  LA_LIGA: 140,            // Spain
  BUNDESLIGA: 78,          // Germany
  SERIE_A: 135,            // Italy
  LIGUE_1: 61,             // France
  CHAMPIONS_LEAGUE: 2,     // UEFA Champions League
  EUROPA_LEAGUE: 3,        // UEFA Europa League
};
