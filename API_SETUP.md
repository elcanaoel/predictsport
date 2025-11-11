# API Setup Guide

## Current Status

✅ **Sample data loaded successfully!**
- The application is now working with sample data
- You can explore all features without an API key
- Sample data includes live matches, predictions, and statistics

## Getting Real Match Data

To fetch real match data from API-Football, follow these steps:

### Step 1: Get Your Free API Key

1. Visit: **https://www.api-football.com/**
2. Click "**Pricing**" or "**Get Started**"
3. Sign up for the **FREE plan**:
   - 100 requests per day
   - Access to all leagues
   - Live scores and fixtures
   - No credit card required

4. After signing up, go to your **Dashboard**
5. Copy your **API Key**

### Step 2: Add API Key to Your Project

1. Open the `.env` file in the project root
2. Replace `your_api_key_here` with your actual API key:

```env
# Database
DATABASE_URL="file:./dev.db"

# API-Football
FOOTBALL_API_KEY="YOUR_ACTUAL_API_KEY_HERE"
FOOTBALL_API_HOST="v3.football.api-sports.io"

# Application
NODE_ENV="development"
```

3. Save the file

### Step 3: Fetch Real Match Data

Run these commands to get real data:

```bash
# Fetch matches from major leagues
npm run update-matches

# Generate AI predictions
npm run generate-predictions

# Update live scores (for ongoing matches)
npm run update-live
```

## Free Tier Limits

The free API tier includes:
- ✅ **100 requests per day**
- ✅ All major leagues (Premier League, La Liga, etc.)
- ✅ Live scores and fixtures
- ✅ Team statistics
- ✅ Match predictions

**Tips to stay within limits:**
- Run `update-matches` once per day (uses ~7 requests)
- Run `update-live` only during match times
- Use the sample data for development/testing

## Sample Data vs Real Data

### Currently Using Sample Data
The application is populated with:
- **1 Live Match**: Liverpool vs Man City (1-0, 1st Half)
- **3 Upcoming Matches**: Including Man United vs Arsenal
- **1 Finished Match**: Barcelona vs Real Madrid (2-1)
- **18 Predictions**: Across all matches with confidence scores

### With Real API Data
You'll get:
- Real fixtures from 7 major leagues
- Actual team logos and league badges
- Live score updates
- Real match statistics
- Accurate predictions based on current form

## Testing Without API Key

You can fully test the application with sample data:

1. **Home Page**: http://localhost:3000
   - View predictions and statistics
   - See upcoming matches

2. **Live Scores**: http://localhost:3000/live
   - See the live match with auto-refresh
   - Test the refresh functionality

3. **All Predictions**: http://localhost:3000/predictions
   - Browse predictions by type
   - See confidence levels

4. **All Matches**: http://localhost:3000/matches
   - View matches by date
   - See match details

## Resetting Sample Data

To reset and reload sample data:

```bash
# Clear database and reload
npx prisma db push --force-reset
npm run seed
```

## Troubleshooting

### 403 Error (Forbidden)
- API key is missing or invalid
- Check `.env` file has correct key
- Verify key is active on API-Football dashboard

### No Matches Showing
- Run `npm run seed` to load sample data
- Or get API key and run `npm run update-matches`

### Rate Limit Exceeded
- Free tier: 100 requests/day
- Wait 24 hours or upgrade plan
- Use sample data for development

## Next Steps

1. ✅ **Explore the app with sample data** (No API key needed)
2. 🔑 **Get your free API key** when ready for real data
3. 🚀 **Run update scripts** to fetch live matches
4. 📊 **Monitor your usage** on API-Football dashboard

## Support

- **API-Football Docs**: https://www.api-football.com/documentation-v3
- **Free API Signup**: https://www.api-football.com/pricing
- **Dashboard**: https://dashboard.api-football.com/

---

**Note**: The sample data is perfect for development, testing, and demonstrating the application. Get the API key when you're ready to deploy or need real match data.
