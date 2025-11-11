const cron = require('node-cron');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

console.log('⚽ BettingTip Live Score Update Service Started');
console.log('⏰ Scheduled to run every hour during match hours (12 PM - 11 PM)');
console.log('─────────────────────────────────────────\n');

// Function to update live scores
async function updateLiveScores() {
  const now = new Date();
  const hour = now.getHours();
  
  // Only run during typical match hours (12 PM to 11 PM)
  if (hour < 12 || hour > 23) {
    console.log(`[${now.toLocaleString()}] Outside match hours, skipping...`);
    return;
  }
  
  console.log(`\n[${now.toLocaleString()}] Updating live scores...`);
  
  try {
    const { stdout, stderr } = await execPromise('npm run update-live');
    console.log(stdout);
    if (stderr) console.error('Warnings:', stderr);
    
    console.log('✅ Live scores updated successfully!\n');
  } catch (error) {
    console.error('❌ Error updating live scores:', error.message);
  }
}

// Schedule live score updates every hour
// Format: second minute hour day month weekday
cron.schedule('0 0 * * * *', () => {
  updateLiveScores();
}, {
  scheduled: true,
  timezone: "Europe/London" // Adjust to your timezone
});

// Run immediately on startup
console.log('🚀 Running initial live score update...');
updateLiveScores();

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\n👋 Live score update service stopped');
  process.exit(0);
});

console.log('✨ Service is running. Press Ctrl+C to stop.\n');
