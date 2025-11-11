const cron = require('node-cron');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

console.log('🤖 BettingTip Daily Update Service Started');
console.log('⏰ Scheduled to run daily at 6:00 AM');
console.log('─────────────────────────────────────────\n');

// Function to run update and predictions
async function runDailyUpdate() {
  console.log(`\n[${new Date().toLocaleString()}] Starting daily update...`);
  
  try {
    // Step 1: Update matches
    console.log('📥 Fetching latest match data from API...');
    const { stdout: matchOutput, stderr: matchError } = await execPromise('npm run update-matches');
    console.log(matchOutput);
    if (matchError) console.error('Match update warnings:', matchError);
    
    // Step 2: Generate predictions
    console.log('\n🎯 Generating predictions based on last 7 matches...');
    const { stdout: predOutput, stderr: predError } = await execPromise('npm run generate-predictions');
    console.log(predOutput);
    if (predError) console.error('Prediction warnings:', predError);
    
    console.log('\n✅ Daily update completed successfully!');
    console.log(`Next update scheduled for tomorrow at 6:00 AM\n`);
  } catch (error) {
    console.error('\n❌ Error during daily update:', error.message);
    console.error('Will retry tomorrow at 6:00 AM\n');
  }
}

// Schedule daily updates at 6:00 AM
// Format: second minute hour day month weekday
cron.schedule('0 0 6 * * *', () => {
  runDailyUpdate();
}, {
  scheduled: true,
  timezone: "Europe/London" // Adjust to your timezone
});

// Also run immediately on startup (optional - comment out if not needed)
console.log('🚀 Running initial update...');
runDailyUpdate();

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\n👋 Daily update service stopped');
  process.exit(0);
});

console.log('✨ Service is running. Press Ctrl+C to stop.\n');
