const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPredictions() {
  const match = await prisma.match.findFirst({
    where: { id: 22 }, // Check match ID 22 which we know has predictions
    include: {
      predictions: true,
      homeTeam: true,
      awayTeam: true,
    },
  });

  if (!match) {
    console.log('Match ID 22 not found');
    return;
  }

  console.log(`\nMatch ID: ${match.id}`);
  console.log(`Match: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
  console.log(`Total Predictions: ${match.predictions.length}\n`);

  // Group by type
  const byType = {};
  match.predictions.forEach(p => {
    if (!byType[p.predictionType]) {
      byType[p.predictionType] = [];
    }
    byType[p.predictionType].push(p);
  });

  Object.keys(byType).forEach(type => {
    console.log(`${type}: ${byType[type].length} predictions`);
    byType[type].forEach(p => {
      console.log(`  - ${p.prediction} (${p.confidence}% confidence)`);
    });
    console.log('');
  });

  await prisma.$disconnect();
}

checkPredictions();
