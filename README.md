# BettingTip - Sports Prediction & Betting Tips Platform

A fully functional betting tips and sports prediction website with real match data that updates automatically daily. Built with Next.js 14, TypeScript, Prisma, and integrated with API-Football for real-time sports data.

## Features

- ⚽ **Real-Time Match Data**: Integrates with API-Football to fetch live match data from major leagues
- 🎯 **Form-Based Predictions**: Advanced prediction engine analyzing last 7 matches of each team
- 📊 **34 Prediction Types**: 1X2, Over/Under, BTTS, Double Chance, Correct Score, and 29 more options per match
- 🔄 **Automatic Daily Updates**: Fully automated - updates matches and generates predictions daily at 6 AM
- 📱 **Expandable Match Cards**: Click to view all 34 predictions organized by category
- 📈 **Confidence Scores**: Each prediction includes confidence level (45-95%) and analysis
- 🏆 **Major Leagues**: Covers Premier League, La Liga, Bundesliga, Serie A, Ligue 1, and more
- 🔴 **Live Scores**: Real-time score updates with auto-refresh during matches

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: API-Football (RapidAPI)
- **Scheduling**: Node-cron for automated updates

## Prerequisites

- Node.js 18+ installed
- API-Football API key (free tier available at https://www.api-football.com/)

## Installation

1. **Clone the repository**
   ```bash
   cd c:\Projects\bettingtip
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

   Edit `.env` and add your API-Football credentials:
   ```env
   DATABASE_URL="file:./dev.db"
   FOOTBALL_API_KEY="your_api_key_here"
   FOOTBALL_API_HOST="v3.football.api-sports.io"
   ```

   Get your free API key at: https://www.api-football.com/

4. **Initialize the database**
   ```bash
   npx prisma db push
   ```

5. **Fetch initial match data**
   ```bash
   npm run update-matches
   ```

6. **Generate predictions**
   ```bash
   node scripts/generate-predictions.js
   ```

## Usage

### Development Server

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Automated Updates

### 🤖 Automatic Daily Updates (Recommended)

**Start the automated service:**
```bash
npm run daily-update
```

This will:
- ✅ Run immediately on startup
- ✅ Schedule daily updates at 6:00 AM
- ✅ Update matches automatically
- ✅ Generate predictions automatically
- ✅ Keep running in background

**For production (using PM2):**
```bash
npm install -g pm2
pm2 start npm --name "bettingtip-daily" -- run daily-update
pm2 save
pm2 startup
```

**Optional - Live score updates (hourly):**
```bash
pm2 start npm --name "bettingtip-live" -- run live-update
pm2 save
```

📖 **Full automation guide:** See `QUICK_START_AUTOMATION.md` and `AUTOMATION.md`

### 📝 Manual Updates

Update matches manually:
```bash
npm run update-matches
```

Generate new predictions:
```bash
npm run generate-predictions
```

Update live scores:
```bash
npm run update-live
```

## Project Structure

```
bettingtip/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── predictions/       # Predictions page
│   ├── matches/           # Matches page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx     # Navigation bar
│   ├── MatchCard.tsx      # Match display card
│   ├── PredictionCard.tsx # Prediction display card
│   └── StatsOverview.tsx  # Statistics component
├── lib/                   # Utility libraries
│   ├── prisma.ts          # Prisma client
│   ├── football-api.ts    # API-Football integration
│   ├── prediction-engine.ts # Prediction algorithm
│   └── utils.ts           # Helper functions
├── prisma/                # Database schema
│   └── schema.prisma      # Prisma schema
├── scripts/               # Automation scripts
│   ├── update-matches.js  # Fetch match data
│   └── generate-predictions.js # Generate predictions
└── public/                # Static assets
```

## API Integration

This project uses **API-Football** (via RapidAPI) which provides:

- Live match fixtures and results
- Team statistics and form
- League information
- Head-to-head records
- Match predictions

**Free Tier Limits**: 100 requests/day (sufficient for testing)

## Database Schema

- **League**: Football leagues and competitions
- **Team**: Team information and logos
- **Match**: Match fixtures, scores, and status
- **Prediction**: Generated betting predictions
- **Statistics**: Performance tracking

## Prediction Algorithm

The prediction engine analyzes:

1. **Team Form**: Recent match results (W/D/L)
2. **Goals Statistics**: Average goals scored/conceded
3. **Home Advantage**: Historical home performance
4. **Head-to-Head**: Previous encounters between teams
5. **League Position**: Current standings and momentum

## Customization

### Add More Leagues

Edit `scripts/update-matches.js` and add league IDs to the `MAJOR_LEAGUES` array:

```javascript
const MAJOR_LEAGUES = [39, 140, 78, 135, 61, 2, 3]; // Add more IDs
```

Find league IDs at: https://www.api-football.com/documentation-v3#tag/Leagues

### Adjust Prediction Confidence

Modify the prediction algorithm in `lib/prediction-engine.ts` to adjust confidence calculations.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Compatible with:
- Netlify
- Railway
- Render
- AWS
- DigitalOcean

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Disclaimer

⚠️ **Important**: This platform is for educational and entertainment purposes only. Always gamble responsibly. Betting predictions are not guaranteed and past performance does not indicate future results.

## Support

For issues or questions:
- Check the API-Football documentation
- Review the code comments
- Open an issue on GitHub

## Roadmap

- [ ] User authentication and profiles
- [ ] Favorite teams and leagues
- [ ] Email notifications for predictions
- [ ] Advanced analytics dashboard
- [ ] Live match updates via WebSocket
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

Built with ❤️ using Next.js and API-Football
