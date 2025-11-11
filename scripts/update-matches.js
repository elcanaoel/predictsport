const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const API_KEY = process.env.FOOTBALL_API_KEY || '';
const API_HOST = process.env.FOOTBALL_API_HOST || 'v3.football.api-sports.io';

const footballApi = axios.create({
  baseURL: `https://${API_HOST}`,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
  },
});

const MAJOR_LEAGUES = [39, 140, 78, 135, 61, 2, 3]; // Premier League, La Liga, Bundesliga, Serie A, Ligue 1, UCL, UEL

async function updateMatches() {
  console.log('Starting match update...');
  
  try {
    // Get today's date and next 7 days
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    for (const date of dates) {
      console.log(`Fetching fixtures for ${date}...`);
      
      const response = await footballApi.get('/fixtures', {
        params: { date },
      });

      const fixtures = response.data.response || [];
      console.log(`Found ${fixtures.length} fixtures`);

      for (const fixture of fixtures) {
        // Only process matches from major leagues
        if (!MAJOR_LEAGUES.includes(fixture.league.id)) continue;

        try {
          // Upsert league
          await prisma.league.upsert({
            where: { id: fixture.league.id },
            update: {
              name: fixture.league.name,
              country: fixture.league.country,
              logo: fixture.league.logo,
              flag: fixture.league.flag,
              season: fixture.league.season,
            },
            create: {
              id: fixture.league.id,
              name: fixture.league.name,
              country: fixture.league.country,
              logo: fixture.league.logo,
              flag: fixture.league.flag,
              season: fixture.league.season,
            },
          });

          // Upsert home team
          await prisma.team.upsert({
            where: { id: fixture.teams.home.id },
            update: {
              name: fixture.teams.home.name,
              logo: fixture.teams.home.logo,
            },
            create: {
              id: fixture.teams.home.id,
              name: fixture.teams.home.name,
              logo: fixture.teams.home.logo,
            },
          });

          // Upsert away team
          await prisma.team.upsert({
            where: { id: fixture.teams.away.id },
            update: {
              name: fixture.teams.away.name,
              logo: fixture.teams.away.logo,
            },
            create: {
              id: fixture.teams.away.id,
              name: fixture.teams.away.name,
              logo: fixture.teams.away.logo,
            },
          });

          // Upsert match
          await prisma.match.upsert({
            where: { fixtureId: fixture.fixture.id },
            update: {
              status: fixture.fixture.status.short,
              homeScore: fixture.goals.home,
              awayScore: fixture.goals.away,
              matchDate: new Date(fixture.fixture.date),
              venue: fixture.fixture.venue?.name,
              round: fixture.league.round,
            },
            create: {
              fixtureId: fixture.fixture.id,
              leagueId: fixture.league.id,
              homeTeamId: fixture.teams.home.id,
              awayTeamId: fixture.teams.away.id,
              matchDate: new Date(fixture.fixture.date),
              status: fixture.fixture.status.short,
              homeScore: fixture.goals.home,
              awayScore: fixture.goals.away,
              venue: fixture.fixture.venue?.name,
              round: fixture.league.round,
            },
          });

          console.log(`Updated: ${fixture.teams.home.name} vs ${fixture.teams.away.name}`);
        } catch (error) {
          console.error(`Error processing fixture ${fixture.fixture.id}:`, error.message);
        }
      }

      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Match update completed successfully!');
  } catch (error) {
    console.error('Error updating matches:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateMatches();
