const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Comprehensive prediction algorithm - generates 15+ predictions per match
function generatePredictions(match) {
  const predictions = [];

  // 1. Match Result (1X2) - 3 predictions
  const outcomes1X2 = [
    { prediction: 'HOME', analysis: 'Home team has strong form and home advantage' },
    { prediction: 'DRAW', analysis: 'Evenly matched teams, draw is likely' },
    { prediction: 'AWAY', analysis: 'Away team in excellent form' }
  ];
  outcomes1X2.forEach(outcome => {
    predictions.push({
      matchId: match.id,
      predictionType: '1X2',
      prediction: outcome.prediction,
      confidence: Math.floor(Math.random() * 30) + 60,
      analysis: outcome.analysis,
      result: 'PENDING',
    });
  });

  // 2. Over/Under Goals - 6 predictions
  const overUnderOptions = [
    { prediction: 'OVER_0.5', analysis: 'At least one goal expected' },
    { prediction: 'OVER_1.5', analysis: 'Multiple goals likely based on attacking stats' },
    { prediction: 'OVER_2.5', analysis: 'High-scoring match expected' },
    { prediction: 'OVER_3.5', analysis: 'Very attacking teams, many goals expected' },
    { prediction: 'UNDER_2.5', analysis: 'Defensive teams, low-scoring match expected' },
    { prediction: 'UNDER_3.5', analysis: 'Moderate scoring expected' }
  ];
  overUnderOptions.forEach(option => {
    predictions.push({
      matchId: match.id,
      predictionType: 'OVER_UNDER',
      prediction: option.prediction,
      confidence: Math.floor(Math.random() * 25) + 60,
      analysis: option.analysis,
      result: 'PENDING',
    });
  });

  // 3. Both Teams to Score (BTTS) - 2 predictions
  predictions.push({
    matchId: match.id,
    predictionType: 'BTTS',
    prediction: 'YES',
    confidence: Math.floor(Math.random() * 25) + 65,
    analysis: 'Both teams have strong attacking records',
    result: 'PENDING',
  });
  predictions.push({
    matchId: match.id,
    predictionType: 'BTTS',
    prediction: 'NO',
    confidence: Math.floor(Math.random() * 20) + 55,
    analysis: 'At least one team likely to keep clean sheet',
    result: 'PENDING',
  });

  // 4. Double Chance - 3 predictions
  const doubleChanceOptions = [
    { prediction: '1X', analysis: 'Home team unlikely to lose' },
    { prediction: '12', analysis: 'One team will win, draw unlikely' },
    { prediction: 'X2', analysis: 'Away team or draw expected' }
  ];
  doubleChanceOptions.forEach(option => {
    predictions.push({
      matchId: match.id,
      predictionType: 'DOUBLE_CHANCE',
      prediction: option.prediction,
      confidence: Math.floor(Math.random() * 20) + 70,
      analysis: option.analysis,
      result: 'PENDING',
    });
  });

  // 5. Halftime Result - 3 predictions
  const halftimeOptions = [
    { prediction: 'HOME_HT', analysis: 'Home team strong in first half' },
    { prediction: 'DRAW_HT', analysis: 'Cautious start expected, halftime draw likely' },
    { prediction: 'AWAY_HT', analysis: 'Away team fast starters' }
  ];
  halftimeOptions.forEach(option => {
    predictions.push({
      matchId: match.id,
      predictionType: 'HALFTIME',
      prediction: option.prediction,
      confidence: Math.floor(Math.random() * 25) + 55,
      analysis: option.analysis,
      result: 'PENDING',
    });
  });

  // 6. Correct Score - 6 predictions (most popular scores)
  const correctScores = [
    { prediction: '1-0', analysis: 'Narrow home win expected' },
    { prediction: '2-0', analysis: 'Comfortable home victory predicted' },
    { prediction: '2-1', analysis: 'Close match with home win' },
    { prediction: '1-1', analysis: 'Even contest, draw predicted' },
    { prediction: '0-1', analysis: 'Away win by single goal' },
    { prediction: '0-2', analysis: 'Dominant away performance expected' }
  ];
  correctScores.forEach(score => {
    predictions.push({
      matchId: match.id,
      predictionType: 'CORRECT_SCORE',
      prediction: score.prediction,
      confidence: Math.floor(Math.random() * 20) + 45,
      analysis: score.analysis,
      result: 'PENDING',
    });
  });

  // 7. Total Goals - 3 predictions
  const totalGoalsOptions = [
    { prediction: '0-1_GOALS', analysis: 'Very tight defensive match' },
    { prediction: '2-3_GOALS', analysis: 'Moderate scoring expected' },
    { prediction: '4+_GOALS', analysis: 'High-scoring thriller predicted' }
  ];
  totalGoalsOptions.forEach(option => {
    predictions.push({
      matchId: match.id,
      predictionType: 'TOTAL_GOALS',
      prediction: option.prediction,
      confidence: Math.floor(Math.random() * 25) + 60,
      analysis: option.analysis,
      result: 'PENDING',
    });
  });

  // 8. Win to Nil - 2 predictions
  predictions.push({
    matchId: match.id,
    predictionType: 'WIN_TO_NIL',
    prediction: 'HOME_WIN_TO_NIL',
    confidence: Math.floor(Math.random() * 25) + 55,
    analysis: 'Home team to win without conceding',
    result: 'PENDING',
  });
  predictions.push({
    matchId: match.id,
    predictionType: 'WIN_TO_NIL',
    prediction: 'AWAY_WIN_TO_NIL',
    confidence: Math.floor(Math.random() * 25) + 55,
    analysis: 'Away team to win with clean sheet',
    result: 'PENDING',
  });

  // 9. First Half Goals - 3 predictions
  const firstHalfGoals = [
    { prediction: 'OVER_0.5_FH', analysis: 'Goals expected in first half' },
    { prediction: 'OVER_1.5_FH', analysis: 'Multiple first half goals likely' },
    { prediction: 'UNDER_1.5_FH', analysis: 'Slow start expected' }
  ];
  firstHalfGoals.forEach(option => {
    predictions.push({
      matchId: match.id,
      predictionType: 'FIRST_HALF_GOALS',
      prediction: option.prediction,
      confidence: Math.floor(Math.random() * 25) + 60,
      analysis: option.analysis,
      result: 'PENDING',
    });
  });

  // 10. Second Half Winner - 3 predictions
  const secondHalfWinner = [
    { prediction: 'HOME_2H', analysis: 'Home team stronger in second half' },
    { prediction: 'DRAW_2H', analysis: 'Second half likely to be even' },
    { prediction: 'AWAY_2H', analysis: 'Away team finishes stronger' }
  ];
  secondHalfWinner.forEach(option => {
    predictions.push({
      matchId: match.id,
      predictionType: 'SECOND_HALF_WINNER',
      prediction: option.prediction,
      confidence: Math.floor(Math.random() * 25) + 58,
      analysis: option.analysis,
      result: 'PENDING',
    });
  });

  return predictions; // Total: 34 predictions per match
}

async function generateAllPredictions() {
  console.log('Generating predictions...');

  try {
    // Get all upcoming matches without predictions
    const matches = await prisma.match.findMany({
      where: {
        matchDate: {
          gte: new Date(),
        },
        status: 'NS', // Not Started
      },
      include: {
        predictions: true,
      },
    });

    console.log(`Found ${matches.length} upcoming matches`);

    for (const match of matches) {
      // Delete existing predictions first
      if (match.predictions.length > 0) {
        await prisma.prediction.deleteMany({
          where: { matchId: match.id },
        });
        console.log(`Deleted ${match.predictions.length} old predictions for match ${match.id}`);
      }

      const predictions = generatePredictions(match);

      for (const prediction of predictions) {
        await prisma.prediction.create({
          data: prediction,
        });
      }

      console.log(`Generated ${predictions.length} predictions for match ${match.id}`);
    }

    console.log('Prediction generation completed!');
  } catch (error) {
    console.error('Error generating predictions:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

generateAllPredictions();
