const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSampleData() {
  console.log('Seeding sample data...');

  try {
    // Create sample leagues
    const premierLeague = await prisma.league.upsert({
      where: { id: 39 },
      update: {},
      create: {
        id: 39,
        name: 'Premier League',
        country: 'England',
        logo: 'https://media.api-sports.io/football/leagues/39.png',
        flag: 'https://media.api-sports.io/flags/gb.svg',
        season: 2024,
      },
    });

    const laLiga = await prisma.league.upsert({
      where: { id: 140 },
      update: {},
      create: {
        id: 140,
        name: 'La Liga',
        country: 'Spain',
        logo: 'https://media.api-sports.io/football/leagues/140.png',
        flag: 'https://media.api-sports.io/flags/es.svg',
        season: 2024,
      },
    });

    console.log('✓ Created leagues');

    // Create sample teams
    const teams = [
      { id: 33, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' },
      { id: 34, name: 'Newcastle United', logo: 'https://media.api-sports.io/football/teams/34.png' },
      { id: 40, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
      { id: 42, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
      { id: 50, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
      { id: 49, name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' },
      { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
      { id: 541, name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
    ];

    for (const team of teams) {
      await prisma.team.upsert({
        where: { id: team.id },
        update: {},
        create: team,
      });
    }

    console.log('✓ Created teams');

    // Create sample matches
    const now = new Date();
    const today = new Date(now);
    today.setHours(15, 0, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(17, 30, 0, 0);

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(20, 0, 0, 0);

    const matches = [
      // Live match
      {
        fixtureId: 1001,
        leagueId: 39,
        homeTeamId: 40,
        awayTeamId: 50,
        matchDate: new Date(now.getTime() - 30 * 60000), // Started 30 mins ago
        status: '1H',
        homeScore: 1,
        awayScore: 0,
        venue: 'Anfield',
        round: 'Regular Season - 12',
      },
      // Upcoming today
      {
        fixtureId: 1002,
        leagueId: 39,
        homeTeamId: 33,
        awayTeamId: 42,
        matchDate: today,
        status: 'NS',
        homeScore: null,
        awayScore: null,
        venue: 'Old Trafford',
        round: 'Regular Season - 12',
      },
      {
        fixtureId: 1003,
        leagueId: 39,
        homeTeamId: 49,
        awayTeamId: 34,
        matchDate: new Date(today.getTime() + 2 * 60 * 60000), // 2 hours later
        status: 'NS',
        homeScore: null,
        awayScore: null,
        venue: 'Stamford Bridge',
        round: 'Regular Season - 12',
      },
      // Finished
      {
        fixtureId: 1004,
        leagueId: 140,
        homeTeamId: 529,
        awayTeamId: 541,
        matchDate: yesterday,
        status: 'FT',
        homeScore: 2,
        awayScore: 1,
        venue: 'Camp Nou',
        round: 'Regular Season - 11',
      },
      // Tomorrow
      {
        fixtureId: 1005,
        leagueId: 39,
        homeTeamId: 42,
        awayTeamId: 40,
        matchDate: tomorrow,
        status: 'NS',
        homeScore: null,
        awayScore: null,
        venue: 'Emirates Stadium',
        round: 'Regular Season - 12',
      },
      {
        fixtureId: 1006,
        leagueId: 140,
        homeTeamId: 541,
        awayTeamId: 529,
        matchDate: new Date(tomorrow.getTime() + 3 * 60 * 60000),
        status: 'NS',
        homeScore: null,
        awayScore: null,
        venue: 'Santiago Bernabéu',
        round: 'Regular Season - 11',
      },
    ];

    for (const match of matches) {
      await prisma.match.upsert({
        where: { fixtureId: match.fixtureId },
        update: match,
        create: match,
      });
    }

    console.log('✓ Created matches');

    // Create sample predictions
    const predictions = [
      // Match 1001 - Liverpool vs Man City (Live)
      {
        matchId: 1,
        predictionType: '1X2',
        prediction: 'HOME',
        confidence: 72,
        analysis: 'Liverpool has strong home form and Man City is missing key players',
        result: 'PENDING',
      },
      {
        matchId: 1,
        predictionType: 'OVER_UNDER',
        prediction: 'OVER_2.5',
        confidence: 78,
        analysis: 'Both teams have high-scoring records this season',
        result: 'PENDING',
      },
      {
        matchId: 1,
        predictionType: 'BTTS',
        prediction: 'YES',
        confidence: 85,
        analysis: 'Both teams have strong attacking capabilities',
        result: 'PENDING',
      },
      // Match 1002 - Man United vs Arsenal
      {
        matchId: 2,
        predictionType: '1X2',
        prediction: 'AWAY',
        confidence: 68,
        analysis: 'Arsenal in excellent form, United struggling at home',
        result: 'PENDING',
      },
      {
        matchId: 2,
        predictionType: 'OVER_UNDER',
        prediction: 'OVER_2.5',
        confidence: 71,
        analysis: 'Expected goals: 3.2 based on recent performances',
        result: 'PENDING',
      },
      {
        matchId: 2,
        predictionType: 'BTTS',
        prediction: 'YES',
        confidence: 76,
        analysis: 'Both teams score regularly',
        result: 'PENDING',
      },
      // Match 1003 - Chelsea vs Newcastle
      {
        matchId: 3,
        predictionType: '1X2',
        prediction: 'HOME',
        confidence: 65,
        analysis: 'Chelsea strong at home, Newcastle inconsistent away',
        result: 'PENDING',
      },
      {
        matchId: 3,
        predictionType: 'OVER_UNDER',
        prediction: 'UNDER_2.5',
        confidence: 62,
        analysis: 'Chelsea has tightened defense recently',
        result: 'PENDING',
      },
      {
        matchId: 3,
        predictionType: 'BTTS',
        prediction: 'NO',
        confidence: 58,
        analysis: 'Chelsea likely to keep clean sheet',
        result: 'PENDING',
      },
      // Match 1004 - Barcelona vs Real Madrid (Finished)
      {
        matchId: 4,
        predictionType: '1X2',
        prediction: 'HOME',
        confidence: 70,
        analysis: 'Barcelona dominant at Camp Nou',
        result: 'WON',
      },
      {
        matchId: 4,
        predictionType: 'OVER_UNDER',
        prediction: 'OVER_2.5',
        confidence: 82,
        analysis: 'El Clasico typically high-scoring',
        result: 'WON',
      },
      {
        matchId: 4,
        predictionType: 'BTTS',
        prediction: 'YES',
        confidence: 88,
        analysis: 'Both teams always score in El Clasico',
        result: 'WON',
      },
      // Match 1005 - Arsenal vs Liverpool
      {
        matchId: 5,
        predictionType: '1X2',
        prediction: 'DRAW',
        confidence: 64,
        analysis: 'Evenly matched top teams',
        result: 'PENDING',
      },
      {
        matchId: 5,
        predictionType: 'OVER_UNDER',
        prediction: 'OVER_2.5',
        confidence: 79,
        analysis: 'Both teams have potent attacks',
        result: 'PENDING',
      },
      {
        matchId: 5,
        predictionType: 'BTTS',
        prediction: 'YES',
        confidence: 91,
        analysis: 'Both teams score in 90% of their matches',
        result: 'PENDING',
      },
      // Match 1006 - Real Madrid vs Barcelona
      {
        matchId: 6,
        predictionType: '1X2',
        prediction: 'HOME',
        confidence: 69,
        analysis: 'Real Madrid strong at Bernabéu',
        result: 'PENDING',
      },
      {
        matchId: 6,
        predictionType: 'OVER_UNDER',
        prediction: 'OVER_2.5',
        confidence: 84,
        analysis: 'El Clasico always delivers goals',
        result: 'PENDING',
      },
      {
        matchId: 6,
        predictionType: 'BTTS',
        prediction: 'YES',
        confidence: 89,
        analysis: 'Historical data shows both teams score',
        result: 'PENDING',
      },
    ];

    for (const prediction of predictions) {
      await prisma.prediction.create({
        data: prediction,
      });
    }

    console.log('✓ Created predictions');

    // Create statistics
    await prisma.statistics.upsert({
      where: { date: new Date(now.setHours(0, 0, 0, 0)) },
      update: {
        totalPredictions: 18,
        wonPredictions: 3,
        lostPredictions: 0,
        pendingPredictions: 15,
        winRate: 100.0,
      },
      create: {
        date: new Date(now.setHours(0, 0, 0, 0)),
        totalPredictions: 18,
        wonPredictions: 3,
        lostPredictions: 0,
        pendingPredictions: 15,
        winRate: 100.0,
      },
    });

    console.log('✓ Created statistics');

    console.log('\n✅ Sample data seeded successfully!');
    console.log('\nSummary:');
    console.log('- 2 Leagues (Premier League, La Liga)');
    console.log('- 8 Teams');
    console.log('- 6 Matches (1 Live, 3 Upcoming, 1 Finished, 1 Tomorrow)');
    console.log('- 18 Predictions');
    console.log('- Statistics tracking');
    console.log('\nYou can now view the application at http://localhost:3000');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSampleData();
