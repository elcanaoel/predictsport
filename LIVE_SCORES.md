# Live Scores Feature

This document explains the live scores functionality added to the BettingTip platform.

## Features

### 1. **Live Score Updates**
- Real-time score updates for ongoing matches
- Automatic refresh every 30 seconds for live matches
- Visual indicators (pulsing red dot) for live matches
- Red ring border around live match cards

### 2. **Match Status Tracking**
The system tracks various match statuses:
- `NS` - Not Started
- `1H` - First Half (Live)
- `HT` - Half Time
- `2H` - Second Half (Live)
- `ET` - Extra Time (Live)
- `P` - Penalties (Live)
- `FT` - Full Time
- `AET` - After Extra Time
- `PEN` - After Penalties
- `PST` - Postponed
- `CANC` - Cancelled

### 3. **Live Scores Page**
Access via: `/live` or click "Live Scores" in navigation

Features:
- Separate sections for Live, Upcoming, and Finished matches
- Auto-refresh button to manually update all scores
- Individual match refresh buttons
- Last update timestamp

### 4. **API Endpoints**

#### GET `/api/live-scores`
Fetches all live and today's matches with latest scores
```json
{
  "success": true,
  "matches": [...],
  "updates": [...],
  "timestamp": "2024-11-08T22:00:00.000Z"
}
```

#### GET `/api/matches/[id]`
Fetches a specific match with live updates if applicable
```json
{
  "success": true,
  "match": {...},
  "live": true
}
```

## Components

### LiveScoreBadge
Displays a pulsing red indicator with match status for live matches.

```tsx
<LiveScoreBadge status="1H" />
```

### LiveMatchCard
Enhanced match card with:
- Auto-refresh for live matches (every 30 seconds)
- Manual refresh button
- Live score highlighting in red
- Last update timestamp

```tsx
<LiveMatchCard match={match} autoRefresh={true} />
```

### LiveScoresRefresh
Button component to refresh all live scores on the page.

```tsx
<LiveScoresRefresh />
```

## Usage

### View Live Scores
1. Navigate to `/live` page
2. Live matches appear at the top with pulsing indicators
3. Scores update automatically every 30 seconds
4. Click "Refresh All" to manually update

### Manual Score Updates
Run the update script:
```bash
npm run update-live
```

This fetches the latest scores from API-Football and updates the database.

### Automated Updates
Set up a cron job or scheduled task to run every 1-5 minutes during match days:

**Windows Task Scheduler:**
- Create a new task
- Trigger: Every 5 minutes
- Action: Run `npm run update-live` in project directory

**Linux/Mac Cron:**
```bash
*/5 * * * * cd /path/to/bettingtip && npm run update-live
```

## How It Works

### Client-Side Auto-Refresh
```typescript
useEffect(() => {
  if (!autoRefresh || !isLive) return;
  
  const interval = setInterval(() => {
    refreshMatch(); // Fetch latest data
  }, 30000); // Every 30 seconds
  
  return () => clearInterval(interval);
}, [match.id, isLive, autoRefresh]);
```

### Server-Side Updates
The `/api/live-scores` endpoint:
1. Queries database for today's matches
2. Filters matches with live status
3. Fetches latest data from API-Football
4. Updates database with new scores
5. Returns updated match data

### Database Updates
Matches are updated with:
- Current status
- Home team score
- Away team score
- Last update timestamp

## Visual Indicators

### Live Match Card
- **Red ring border** around the card
- **Pulsing red dot** next to league name
- **Red scores** instead of gray
- **Status badge** showing match period (1H, HT, 2H, etc.)

### Navigation
- "Live Scores" link with Activity icon
- Easy access to live matches page

## Performance Considerations

### API Rate Limits
- Free tier: 100 requests/day
- Each live update uses 1 request
- Recommended: Update every 5 minutes during match times
- Use client-side auto-refresh for individual matches

### Optimization Tips
1. Only fetch live matches, not all matches
2. Cache results for 30-60 seconds
3. Use Next.js ISR (Incremental Static Regeneration)
4. Implement request debouncing

## Testing

### Test Live Scores
1. Ensure matches exist in database
2. Update match status to `1H` manually:
```sql
UPDATE Match SET status = '1H', homeScore = 1, awayScore = 0 WHERE id = 1;
```
3. Visit `/live` page
4. Verify live indicators appear
5. Test auto-refresh functionality

### Mock Live Data
For development without API calls, you can manually update match statuses in the database to simulate live matches.

## Troubleshooting

### Scores Not Updating
1. Check API key is valid in `.env`
2. Verify API rate limits not exceeded
3. Check network connectivity
4. Review console for errors

### Auto-Refresh Not Working
1. Ensure match status is live (`1H`, `2H`, etc.)
2. Check browser console for errors
3. Verify `/api/matches/[id]` endpoint works
4. Clear browser cache

### No Live Matches Showing
1. Run `npm run update-matches` to fetch today's fixtures
2. Check if matches are scheduled for today
3. Verify match status in database
4. Ensure API-Football has live data

## Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Push notifications for goal alerts
- [ ] Live match statistics and events
- [ ] Match commentary and timeline
- [ ] Live betting odds integration
- [ ] Multiple timezone support
- [ ] Favorite teams live alerts

## API Documentation

For more details on the API-Football endpoints used:
- https://www.api-football.com/documentation-v3#tag/Fixtures

## Support

For issues or questions about live scores:
1. Check API-Football status
2. Verify environment variables
3. Review server logs
4. Test API endpoints directly
