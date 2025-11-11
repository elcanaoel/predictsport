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

async function updateLiveScores() {
  console.log('Updating live scores...');
  
  try {
    // Get today's date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    console.log(`Fetching live matches for ${dateStr}...`);
    
    // Fetch today's fixtures
    const response = await footballApi.get('/fixtures', {
      params: { date: dateStr, live: 'all' },
    });

    const fixtures = response.data.response || [];
    console.log(`Found ${fixtures.length} live/today fixtures`);

    let updated = 0;
    let errors = 0;

    for (const fixture of fixtures) {
      try {
        // Find match in database
        const match = await prisma.match.findUnique({
          where: { fixtureId: fixture.fixture.id },
        });

        if (!match) {
          console.log(`Match ${fixture.fixture.id} not in database, skipping...`);
          continue;
        }

        // Update match status and scores
        await prisma.match.update({
          where: { fixtureId: fixture.fixture.id },
          data: {
            status: fixture.fixture.status.short,
            homeScore: fixture.goals.home,
            awayScore: fixture.goals.away,
          },
        });

        console.log(
          `✓ Updated: ${fixture.teams.home.name} ${fixture.goals.home ?? '-'} - ${fixture.goals.away ?? '-'} ${fixture.teams.away.name} [${fixture.fixture.status.short}]`
        );
        updated++;
      } catch (error) {
        console.error(`Error updating fixture ${fixture.fixture.id}:`, error.message);
        errors++;
      }
    }

    console.log(`\nUpdate complete!`);
    console.log(`- Updated: ${updated} matches`);
    console.log(`- Errors: ${errors}`);
  } catch (error) {
    console.error('Error updating live scores:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateLiveScores();
