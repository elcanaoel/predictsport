# Quick Start: Automated Daily Updates

Get your BettingTip platform running with automatic daily prediction generation in 5 minutes!

## 🚀 Quick Setup (Windows)

### Step 1: Test Manual Updates

First, verify everything works manually:

```bash
# Test match updates
npm run update-matches

# Test predictions
npm run generate-predictions
```

If both work, proceed to automation!

### Step 2: Start Automated Service

**Option A: Keep Terminal Open (Simplest)**

```bash
npm run daily-update
```

This will:
- ✅ Run immediately
- ✅ Schedule daily updates at 6:00 AM
- ✅ Keep running until you close the terminal

**Option B: Run as Background Service (Recommended)**

Install PM2 (process manager):
```bash
npm install -g pm2
```

Start the service:
```bash
pm2 start npm --name "bettingtip-daily" -- run daily-update
pm2 save
```

Check status:
```bash
pm2 status
pm2 logs bettingtip-daily
```

### Step 3: Optional - Live Score Updates

For hourly live score updates during matches:

```bash
# Option A: Terminal
npm run live-update

# Option B: PM2
pm2 start npm --name "bettingtip-live" -- run live-update
pm2 save
```

## ⏰ Schedule

| What | When | Command |
|------|------|---------|
| Match Data | Daily 6:00 AM | Automatic |
| Predictions | Daily 6:05 AM | Automatic |
| Live Scores | Hourly (12 PM-11 PM) | Optional |

## 🎯 What Happens Automatically

**Every Day at 6:00 AM:**
1. Fetches latest matches from API-Football
2. Analyzes last 7 matches for each team
3. Generates 34 predictions per match
4. Updates database
5. Ready for users to view!

## 📊 Monitoring

**Check if running:**
```bash
pm2 status
```

**View logs:**
```bash
pm2 logs bettingtip-daily
```

**Restart if needed:**
```bash
pm2 restart bettingtip-daily
```

## 🔧 Configuration

### Change Update Time

Edit `scripts/daily-update.js`:

```javascript
// Line 31: Change from 6:00 AM to 8:00 AM
cron.schedule('0 0 8 * * *', () => {
  // ...
});
```

### Change Timezone

```javascript
// Line 35: Change timezone
timezone: "America/New_York" // Your timezone
```

### Disable Startup Update

```javascript
// Line 40: Comment out this line
// runDailyUpdate();
```

## 🌐 For Deployed Sites (Vercel/Netlify)

### Vercel

1. Add to Vercel dashboard:
   - Environment Variable: `CRON_SECRET` = `your-secret-key`

2. Deploy - cron is auto-configured via `vercel.json`

3. Test:
   ```bash
   curl -H "Authorization: Bearer your-secret-key" \
     https://your-app.vercel.app/api/cron/daily-update
   ```

### Other Platforms

Use external cron service:
1. Sign up at https://cron-job.org/
2. Add job:
   - URL: `https://your-site.com/api/cron/daily-update`
   - Schedule: `0 6 * * *` (6 AM daily)
   - Header: `Authorization: Bearer your-secret-key`

## ✅ Verification

**Check if automation is working:**

1. **View logs:**
   ```bash
   pm2 logs bettingtip-daily --lines 50
   ```

2. **Check database:**
   ```bash
   npm run db:studio
   ```
   - Open Prisma Studio
   - Check `Match` table for recent matches
   - Check `Prediction` table for predictions

3. **Check website:**
   - Visit http://localhost:3000
   - Should see updated matches and predictions

## 🆘 Troubleshooting

### Service not running
```bash
pm2 restart bettingtip-daily
pm2 logs bettingtip-daily
```

### No new predictions
- Check API key is valid
- Check API rate limits (100/day free)
- View logs for errors

### Database errors
- Ensure only one service is running
- Restart the service

## 📱 Stop the Service

**Temporary stop:**
```bash
pm2 stop bettingtip-daily
```

**Permanent removal:**
```bash
pm2 delete bettingtip-daily
pm2 save
```

## 🎉 You're Done!

Your BettingTip platform now:
- ✅ Updates match data automatically every day
- ✅ Generates predictions automatically
- ✅ Runs in the background
- ✅ Requires zero manual intervention

Just keep your computer/server running, and the site will always have fresh predictions!

---

**Need help?** Check `AUTOMATION.md` for detailed documentation.
