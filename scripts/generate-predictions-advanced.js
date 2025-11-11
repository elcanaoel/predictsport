const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Analyze last 7 matches for a team
async function getTeamForm(teamId, currentMatchDate) {
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ],
      matchDate: {
        lt: currentMatchDate
      },
      status: 'FT', // Only finished matches
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: {
      matchDate: 'desc'
    },
    take: 7
  });

  if (matches.length === 0) {
    return {
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsConceded: 0,
      avgGoalsScored: 0,
      avgGoalsConceded: 0,
      cleanSheets: 0,
      bttsCount: 0,
      form: 'N/A',
      matchesPlayed: 0
    };
  }

  let wins = 0, draws = 0, losses = 0;
  let goalsScored = 0, goalsConceded = 0;
  let cleanSheets = 0, bttsCount = 0;
  let formString = '';

  matches.forEach(match => {
    const isHome = match.homeTeamId === teamId;
    const teamScore = isHome ? match.homeScore : match.awayScore;
    const opponentScore = isHome ? match.awayScore : match.homeScore;

    goalsScored += teamScore || 0;
    goalsConceded += opponentScore || 0;

    if (teamScore > opponentScore) {
      wins++;
      formString += 'W';
    } else if (teamScore === opponentScore) {
      draws++;
      formString += 'D';
    } else {
      losses++;
      formString += 'L';
    }

    if (opponentScore === 0) cleanSheets++;
    if (teamScore > 0 && opponentScore > 0) bttsCount++;
  });

  return {
    wins,
    draws,
    losses,
    goalsScored,
    goalsConceded,
    avgGoalsScored: (goalsScored / matches.length).toFixed(2),
    avgGoalsConceded: (goalsConceded / matches.length).toFixed(2),
    cleanSheets,
    bttsCount,
    form: formString,
    matchesPlayed: matches.length
  };
}

// Generate predictions based on team form
function generatePredictionsFromForm(match, homeForm, awayForm) {
  const predictions = [];

  // 1. Match Result (1X2) - Based on form and goals
  const homeStrength = (homeForm.wins * 3 + homeForm.draws) / (homeForm.matchesPlayed * 3) * 100;
  const awayStrength = (awayForm.wins * 3 + awayForm.draws) / (awayForm.matchesPlayed * 3) * 100;
  const homeAdvantage = 10; // Home advantage bonus

  let homeWinConf = Math.min(Math.round(homeStrength + homeAdvantage + (homeForm.avgGoalsScored - awayForm.avgGoalsConceded) * 10), 95);
  let drawConf = Math.min(Math.round(100 - Math.abs(homeStrength - awayStrength)), 85);
  let awayWinConf = Math.min(Math.round(awayStrength + (awayForm.avgGoalsScored - homeForm.avgGoalsConceded) * 10), 95);

  // Handle cases with no data - use defaults
  if (homeForm.matchesPlayed === 0 || awayForm.matchesPlayed === 0) {
    homeWinConf = 55; // Slight home advantage
    drawConf = 50;
    awayWinConf = 45;
  } else {
    // Normalize confidences
    const total = homeWinConf + drawConf + awayWinConf;
    homeWinConf = Math.max(Math.round((homeWinConf / total) * 100), 45);
    drawConf = Math.max(Math.round((drawConf / total) * 100), 40);
    awayWinConf = Math.max(Math.round((awayWinConf / total) * 100), 45);
  }

  predictions.push({
    matchId: match.id,
    predictionType: '1X2',
    prediction: 'HOME',
    confidence: homeWinConf,
    analysis: homeForm.matchesPlayed > 0 
      ? `Home: ${homeForm.form} (${homeForm.wins}W-${homeForm.draws}D-${homeForm.losses}L), Avg ${homeForm.avgGoalsScored} goals/game`
      : 'Home advantage. No recent form data available',
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: '1X2',
    prediction: 'DRAW',
    confidence: drawConf,
    analysis: homeForm.matchesPlayed > 0 && awayForm.matchesPlayed > 0
      ? `Teams evenly matched. Home form: ${homeForm.form}, Away form: ${awayForm.form}`
      : 'Evenly matched teams. No recent form data available',
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: '1X2',
    prediction: 'AWAY',
    confidence: awayWinConf,
    analysis: awayForm.matchesPlayed > 0
      ? `Away: ${awayForm.form} (${awayForm.wins}W-${awayForm.draws}D-${awayForm.losses}L), Avg ${awayForm.avgGoalsScored} goals/game`
      : 'Away team prediction. No recent form data available',
    result: 'PENDING',
  });

  // 2. Over/Under Goals - Based on average goals
  const expectedGoals = homeForm.matchesPlayed === 0 || awayForm.matchesPlayed === 0 
    ? 2.5 // Default expected goals
    : parseFloat(homeForm.avgGoalsScored) + parseFloat(awayForm.avgGoalsScored);
  
  predictions.push({
    matchId: match.id,
    predictionType: 'OVER_UNDER',
    prediction: 'OVER_0.5',
    confidence: Math.min(Math.round(expectedGoals * 30 + 50), 95),
    analysis: `Expected ${expectedGoals.toFixed(1)} total goals. Both teams scoring regularly`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'OVER_UNDER',
    prediction: 'OVER_1.5',
    confidence: Math.min(Math.round(expectedGoals * 25 + 40), 90),
    analysis: `Home avg: ${homeForm.avgGoalsScored}, Away avg: ${awayForm.avgGoalsScored}`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'OVER_UNDER',
    prediction: 'OVER_2.5',
    confidence: expectedGoals > 2.5 ? Math.min(Math.round(expectedGoals * 20 + 35), 85) : Math.max(Math.round(expectedGoals * 15 + 25), 45),
    analysis: `Expected total: ${expectedGoals.toFixed(1)} goals based on last 7 matches`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'OVER_UNDER',
    prediction: 'OVER_3.5',
    confidence: expectedGoals > 3.5 ? Math.min(Math.round(expectedGoals * 15 + 30), 80) : Math.max(Math.round(expectedGoals * 10 + 20), 40),
    analysis: `High-scoring if form continues. Combined avg: ${expectedGoals.toFixed(1)}`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'OVER_UNDER',
    prediction: 'UNDER_2.5',
    confidence: expectedGoals < 2.5 ? Math.min(Math.round((3 - expectedGoals) * 25 + 45), 85) : Math.max(Math.round((3 - expectedGoals) * 15 + 35), 40),
    analysis: `Low-scoring expected. Home concedes ${homeForm.avgGoalsConceded}, Away concedes ${awayForm.avgGoalsConceded}`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'OVER_UNDER',
    prediction: 'UNDER_3.5',
    confidence: Math.min(Math.round((4 - expectedGoals) * 20 + 50), 85),
    analysis: `Moderate scoring expected based on recent form`,
    result: 'PENDING',
  });

  // 3. Both Teams to Score - Based on BTTS history
  const homeBttsRate = homeForm.matchesPlayed > 0 ? (homeForm.bttsCount / homeForm.matchesPlayed) * 100 : 50;
  const awayBttsRate = awayForm.matchesPlayed > 0 ? (awayForm.bttsCount / awayForm.matchesPlayed) * 100 : 50;
  const avgBttsRate = (homeBttsRate + awayBttsRate) / 2;

  predictions.push({
    matchId: match.id,
    predictionType: 'BTTS',
    prediction: 'YES',
    confidence: Math.min(Math.round(avgBttsRate + 20), 90),
    analysis: `Home BTTS in ${homeForm.bttsCount}/${homeForm.matchesPlayed} games, Away BTTS in ${awayForm.bttsCount}/${awayForm.matchesPlayed} games`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'BTTS',
    prediction: 'NO',
    confidence: Math.min(Math.round(100 - avgBttsRate + 10), 85),
    analysis: `Home ${homeForm.cleanSheets} clean sheets, Away ${awayForm.cleanSheets} clean sheets in last 7`,
    result: 'PENDING',
  });

  // 4. Double Chance - Safer bets based on form
  predictions.push({
    matchId: match.id,
    predictionType: 'DOUBLE_CHANCE',
    prediction: '1X',
    confidence: Math.min(homeWinConf + drawConf - 20, 90),
    analysis: `Home unbeaten in ${homeForm.wins + homeForm.draws} of last ${homeForm.matchesPlayed} matches`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'DOUBLE_CHANCE',
    prediction: '12',
    confidence: Math.min(homeWinConf + awayWinConf - 20, 88),
    analysis: `Low draw rate. Home: ${homeForm.draws}D, Away: ${awayForm.draws}D in last 7`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'DOUBLE_CHANCE',
    prediction: 'X2',
    confidence: Math.min(drawConf + awayWinConf - 20, 90),
    analysis: `Away unbeaten in ${awayForm.wins + awayForm.draws} of last ${awayForm.matchesPlayed} matches`,
    result: 'PENDING',
  });

  // 5. Halftime Result - Based on early goals
  const homeEarlyGoals = parseFloat(homeForm.avgGoalsScored) * 0.6; // Assume 60% in first half
  const awayEarlyGoals = parseFloat(awayForm.avgGoalsScored) * 0.6;

  predictions.push({
    matchId: match.id,
    predictionType: 'HALFTIME',
    prediction: 'HOME_HT',
    confidence: Math.min(Math.round(homeWinConf * 0.7), 80),
    analysis: `Home strong starters, averaging ${homeForm.avgGoalsScored} goals/game`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'HALFTIME',
    prediction: 'DRAW_HT',
    confidence: Math.min(Math.round(drawConf * 0.9), 75),
    analysis: `Cautious start likely, teams testing each other`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'HALFTIME',
    prediction: 'AWAY_HT',
    confidence: Math.min(Math.round(awayWinConf * 0.7), 80),
    analysis: `Away fast starters, averaging ${awayForm.avgGoalsScored} goals/game`,
    result: 'PENDING',
  });

  // 6. Correct Score - Most likely based on averages
  const mostLikelyHomeGoals = Math.round(parseFloat(homeForm.avgGoalsScored));
  const mostLikelyAwayGoals = Math.round(parseFloat(awayForm.avgGoalsScored));

  const correctScores = [
    { prediction: '1-0', conf: homeWinConf > 60 && expectedGoals < 2.5 ? 65 : 50 },
    { prediction: '2-0', conf: homeWinConf > 70 && expectedGoals > 2 ? 60 : 45 },
    { prediction: '2-1', conf: homeWinConf > 60 && expectedGoals > 2.5 ? 62 : 48 },
    { prediction: '1-1', conf: drawConf > 50 ? 70 : 55 },
    { prediction: '0-1', conf: awayWinConf > 60 && expectedGoals < 2.5 ? 65 : 50 },
    { prediction: '0-2', conf: awayWinConf > 70 && expectedGoals > 2 ? 60 : 45 }
  ];

  correctScores.forEach(score => {
    predictions.push({
      matchId: match.id,
      predictionType: 'CORRECT_SCORE',
      prediction: score.prediction,
      confidence: Math.min(score.conf, 75),
      analysis: `Based on form: Home ${homeForm.avgGoalsScored} avg, Away ${awayForm.avgGoalsScored} avg`,
      result: 'PENDING',
    });
  });

  // 7. Total Goals - Ranges based on expected goals
  predictions.push({
    matchId: match.id,
    predictionType: 'TOTAL_GOALS',
    prediction: '0-1_GOALS',
    confidence: expectedGoals < 1.5 ? Math.min(Math.round((2 - expectedGoals) * 35 + 40), 85) : 45,
    analysis: `Tight defensive match expected. Combined avg: ${expectedGoals.toFixed(1)}`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'TOTAL_GOALS',
    prediction: '2-3_GOALS',
    confidence: Math.abs(expectedGoals - 2.5) < 0.5 ? 80 : 65,
    analysis: `Most likely range based on ${homeForm.matchesPlayed + awayForm.matchesPlayed} recent matches`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'TOTAL_GOALS',
    prediction: '4+_GOALS',
    confidence: expectedGoals > 3.5 ? Math.min(Math.round(expectedGoals * 18 + 25), 85) : 45,
    analysis: `High-scoring thriller if form continues. Expected: ${expectedGoals.toFixed(1)}`,
    result: 'PENDING',
  });

  // 8. Win to Nil - Based on clean sheets
  const homeCleanSheetRate = (homeForm.cleanSheets / homeForm.matchesPlayed) * 100;
  const awayCleanSheetRate = (awayForm.cleanSheets / awayForm.matchesPlayed) * 100;

  predictions.push({
    matchId: match.id,
    predictionType: 'WIN_TO_NIL',
    prediction: 'HOME_WIN_TO_NIL',
    confidence: Math.min(Math.round((homeWinConf * 0.6) + (homeCleanSheetRate * 0.4)), 80),
    analysis: `Home ${homeForm.cleanSheets} clean sheets in last ${homeForm.matchesPlayed} matches`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'WIN_TO_NIL',
    prediction: 'AWAY_WIN_TO_NIL',
    confidence: Math.min(Math.round((awayWinConf * 0.6) + (awayCleanSheetRate * 0.4)), 80),
    analysis: `Away ${awayForm.cleanSheets} clean sheets in last ${awayForm.matchesPlayed} matches`,
    result: 'PENDING',
  });

  // 9. First Half Goals
  const firstHalfExpected = expectedGoals * 0.55; // Typically 55% of goals in first half

  predictions.push({
    matchId: match.id,
    predictionType: 'FIRST_HALF_GOALS',
    prediction: 'OVER_0.5_FH',
    confidence: Math.min(Math.round(firstHalfExpected * 35 + 45), 90),
    analysis: `Early goals likely. Teams average ${expectedGoals.toFixed(1)} total goals`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'FIRST_HALF_GOALS',
    prediction: 'OVER_1.5_FH',
    confidence: firstHalfExpected > 1.5 ? Math.min(Math.round(firstHalfExpected * 25 + 35), 80) : 50,
    analysis: `Multiple first half goals expected based on attacking form`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'FIRST_HALF_GOALS',
    prediction: 'UNDER_1.5_FH',
    confidence: firstHalfExpected < 1.5 ? Math.min(Math.round((2 - firstHalfExpected) * 30 + 40), 85) : 50,
    analysis: `Slow start expected, teams feeling each other out`,
    result: 'PENDING',
  });

  // 10. Second Half Winner
  predictions.push({
    matchId: match.id,
    predictionType: 'SECOND_HALF_WINNER',
    prediction: 'HOME_2H',
    confidence: Math.min(Math.round(homeWinConf * 0.75), 75),
    analysis: `Home team finishes strong, ${homeForm.wins} wins in last ${homeForm.matchesPlayed}`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'SECOND_HALF_WINNER',
    prediction: 'DRAW_2H',
    confidence: Math.min(Math.round(drawConf * 0.85), 70),
    analysis: `Even second half expected based on overall form`,
    result: 'PENDING',
  });

  predictions.push({
    matchId: match.id,
    predictionType: 'SECOND_HALF_WINNER',
    prediction: 'AWAY_2H',
    confidence: Math.min(Math.round(awayWinConf * 0.75), 75),
    analysis: `Away team strong finishers, ${awayForm.wins} wins in last ${awayForm.matchesPlayed}`,
    result: 'PENDING',
  });

  return predictions;
}

async function generateAllPredictions() {
  console.log('Generating advanced predictions based on last 7 matches...\n');

  try {
    const matches = await prisma.match.findMany({
      where: {
        matchDate: {
          gte: new Date(),
        },
        status: 'NS',
      },
      include: {
        predictions: true,
        homeTeam: true,
        awayTeam: true,
      },
    });

    console.log(`Found ${matches.length} upcoming matches\n`);

    for (const match of matches) {
      console.log(`\nAnalyzing: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
      
      // Get form for both teams
      const homeForm = await getTeamForm(match.homeTeamId, match.matchDate);
      const awayForm = await getTeamForm(match.awayTeamId, match.matchDate);

      console.log(`  Home form: ${homeForm.form} (${homeForm.matchesPlayed} matches)`);
      console.log(`  Away form: ${awayForm.form} (${awayForm.matchesPlayed} matches)`);

      // Delete existing predictions
      if (match.predictions.length > 0) {
        await prisma.prediction.deleteMany({
          where: { matchId: match.id },
        });
      }

      // Generate predictions based on form
      const predictions = generatePredictionsFromForm(match, homeForm, awayForm);

      // Save predictions - ensure all confidence values are valid
      for (const prediction of predictions) {
        // Fix any NaN or invalid confidence values
        if (isNaN(prediction.confidence) || prediction.confidence < 0 || prediction.confidence > 100) {
          prediction.confidence = 60; // Default confidence
        }
        
        await prisma.prediction.create({
          data: prediction,
        });
      }

      console.log(`  ✓ Generated ${predictions.length} predictions`);
    }

    console.log('\n✅ Advanced prediction generation completed!');
  } catch (error) {
    console.error('Error generating predictions:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

generateAllPredictions();
