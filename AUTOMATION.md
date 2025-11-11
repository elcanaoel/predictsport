# Automated Daily Updates

This document explains how to set up automatic daily prediction generation for your BettingTip platform.

## Overview

The system automatically:
1. ✅ Fetches latest match data from API-Football
2. ✅ Generates predictions based on last 7 matches
3. ✅ Updates live scores during match hours
4. ✅ Runs daily without manual intervention

## Setup Options

### Option 1: Node.js Cron Service (Local/VPS)

**Best for:** Self-hosted servers, VPS, or local development

#### Installation

Already installed! Just run:

```bash
npm run daily-update
```

This will:
- Run immediately on startup
- Schedule daily updates at 6:00 AM
- Keep running in the background

#### Configuration

Edit `scripts/daily-update.js`:

```javascript
// Change the schedule time
cron.schedule('0 0 6 * * *', ...); // 6:00 AM

// Change timezone
timezone: "America/New_York" // Your timezone
```

#### Running as a Service

**Windows (using PM2):**
```bash
npm install -g pm2
pm2 start npm --name "bettingtip-daily" -- run daily-update
pm2 save
pm2 startup
```

**Linux (systemd):**
Create `/etc/systemd/system/bettingtip-daily.service`:
```ini
[Unit]
Description=BettingTip Daily Update Service
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/bettingtip
ExecStart=/usr/bin/npm run daily-update
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable bettingtip-daily
sudo systemctl start bettingtip-daily
```

### Option 2: Windows Task Scheduler

**Best for:** Windows servers without PM2

1. Open **Task Scheduler**
2. Create **New Task**
3. **General Tab:**
   - Name: "BettingTip Daily Update"
   - Run whether user is logged on or not
4. **Triggers Tab:**
   - New → Daily at 6:00 AM
5. **Actions Tab:**
   - Action: Start a program
   - Program: `cmd.exe`
   - Arguments: `/c cd /d C:\Projects\bettingtip && npm run update-matches && npm run generate-predictions`
6. **Save**

### Option 3: Vercel Cron (Serverless)

**Best for:** Vercel deployments

#### Setup

1. **Add environment variable** in Vercel dashboard:
   ```
   CRON_SECRET=your-random-secret-key-here
   ```

2. **Deploy** - `vercel.json` is already configured:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/daily-update",
         "schedule": "0 6 * * *"
       }
     ]
   }
   ```

3. **Test the endpoint:**
   ```bash
   curl -H "Authorization: Bearer your-secret-key" \
     https://your-app.vercel.app/api/cron/daily-update
   ```

### Option 4: External Cron Services

**Best for:** Any deployment platform

Use services like:
- **EasyCron** (https://www.easycron.com/)
- **cron-job.org** (https://cron-job.org/)
- **Zapier** (https://zapier.com/)

**Setup:**
1. Create account
2. Add new cron job
3. URL: `https://your-domain.com/api/cron/daily-update`
4. Schedule: Daily at 6:00 AM
5. Add header: `Authorization: Bearer your-secret-key`

## Live Score Updates

For real-time score updates during matches:

```bash
npm run live-update
```

This runs hourly between 12 PM - 11 PM (match hours).

**Configuration:**
Edit `scripts/update-live-hourly.js`:
```javascript
// Change match hours
if (hour < 12 || hour > 23) // 12 PM to 11 PM
```

## Schedule Overview

| Task | Frequency | Time | Command |
|------|-----------|------|---------|
| Match Updates | Daily | 6:00 AM | `npm run update-matches` |
| Predictions | Daily | 6:05 AM | `npm run generate-predictions` |
| Live Scores | Hourly | 12 PM - 11 PM | `npm run update-live` |

## Environment Variables

Add to `.env`:

```env
# For API-based cron
CRON_SECRET=your-random-secret-key-here

# API Football
FOOTBALL_API_KEY=your-api-key
FOOTBALL_API_HOST=v3.football.api-sports.io
```

## Monitoring

### Check if service is running:

**PM2:**
```bash
pm2 status
pm2 logs bettingtip-daily
```

**Systemd:**
```bash
sudo systemctl status bettingtip-daily
sudo journalctl -u bettingtip-daily -f
```

**Windows Task Scheduler:**
- Open Task Scheduler
- Check "Task Status" and "Last Run Result"

### Manual Testing

Test the automation:
```bash
# Test match updates
npm run update-matches

# Test predictions
npm run generate-predictions

# Test live scores
npm run update-live

# Test full daily update
node scripts/daily-update.js
```

## Troubleshooting

### Service not running
```bash
# Check logs
pm2 logs bettingtip-daily

# Restart service
pm2 restart bettingtip-daily
```

### API rate limits exceeded
- Free tier: 100 requests/day
- Daily update uses ~14 requests
- Reduce update frequency or upgrade plan

### Predictions not generating
- Check if matches exist in database
- Verify API key is valid
- Check console for errors

### Database locked errors
- Ensure only one update process runs at a time
- Add delays between operations
- Use proper database connection pooling

## Best Practices

✅ **Monitor API usage** - Track daily request count
✅ **Set up alerts** - Get notified if updates fail
✅ **Backup database** - Regular automated backups
✅ **Log rotation** - Prevent log files from growing too large
✅ **Error handling** - Graceful failure and retry logic
✅ **Health checks** - Verify service is running

## API Usage Optimization

To stay within free tier (100 requests/day):

```javascript
// Fetch only major leagues
const MAJOR_LEAGUES = [39, 140, 78, 135, 61]; // 5 leagues

// Fetch only next 3 days
for (let i = 0; i < 3; i++) { // Instead of 7 days
  // ...
}
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Cron service installed and running
- [ ] Timezone set correctly
- [ ] API key valid and tested
- [ ] Database accessible
- [ ] Logs being written
- [ ] First update successful
- [ ] Monitoring set up

## Support

For issues:
1. Check logs first
2. Verify API key and rate limits
3. Test manual updates
4. Review error messages
5. Check API-Football status

---

**Last Updated**: November 9, 2024
**Version**: 1.0 (Automated Updates)
