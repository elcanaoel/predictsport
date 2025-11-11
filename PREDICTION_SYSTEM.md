# Advanced Prediction System

## Overview

The BettingTip platform now uses an **advanced prediction engine** that analyzes the **last 7 matches** of each team to generate accurate predictions.

## How It Works

### 1. Team Form Analysis

For each match, the system analyzes:

**Home Team Last 7 Matches:**
- Wins, Draws, Losses
- Goals Scored & Conceded
- Average goals per game
- Clean sheets
- Both Teams to Score (BTTS) frequency
- Form string (e.g., "WWDLWDW")

**Away Team Last 7 Matches:**
- Same statistics as home team

### 2. Prediction Generation

Based on the last 7 matches, the system generates **34 predictions per match**:

#### Match Result (1X2) - 3 predictions
- **Home Win**: Based on home form, goals scored, and home advantage
- **Draw**: Based on balanced team strengths
- **Away Win**: Based on away form and goals scored

#### Over/Under Goals - 6 predictions
- Over/Under 0.5, 1.5, 2.5, 3.5 goals
- Based on combined average goals from last 7 matches

#### Both Teams to Score (BTTS) - 2 predictions
- **Yes**: Based on BTTS frequency in last 7 matches
- **No**: Based on clean sheet records

#### Double Chance - 3 predictions
- 1X, 12, X2
- Safer bets combining two outcomes

#### Halftime Result - 3 predictions
- Based on early goal patterns from recent matches

#### Correct Score - 6 predictions
- Most likely scores: 1-0, 2-0, 2-1, 1-1, 0-1, 0-2
- Based on average goals scored/conceded

#### Total Goals - 3 predictions
- 0-1, 2-3, 4+ goals
- Based on expected total goals

#### Win to Nil - 2 predictions
- Based on clean sheet frequency

#### First Half Goals - 3 predictions
- Based on early scoring patterns

#### Second Half Winner - 3 predictions
- Based on team finishing strength

## Confidence Calculation

### With Historical Data (7+ matches):

**1X2 Confidence:**
```
Home Strength = (Wins × 3 + Draws) / (Matches × 3) × 100
+ Home Advantage (10%)
+ Goal Difference Factor
```

**Over/Under Confidence:**
```
Expected Goals = Home Avg Goals + Away Avg Goals
Confidence based on deviation from threshold
```

**BTTS Confidence:**
```
BTTS Rate = (BTTS Count / Total Matches) × 100
Average of home and away BTTS rates
```

### Without Historical Data:

When teams have no recent matches, the system uses intelligent defaults:
- Home Win: 55% (slight home advantage)
- Draw: 50%
- Away Win: 45%
- Expected Goals: 2.5
- BTTS Rate: 50%

## Example Analysis

```
Match: Manchester City vs Liverpool

Home Form (Man City): WWWDWWL (Last 7)
- 5 Wins, 1 Draw, 1 Loss
- 18 Goals Scored (2.57 avg)
- 5 Goals Conceded (0.71 avg)
- 4 Clean Sheets
- BTTS in 3/7 matches

Away Form (Liverpool): WWLWDWW (Last 7)
- 5 Wins, 1 Draw, 1 Loss
- 16 Goals Scored (2.29 avg)
- 7 Goals Conceded (1.00 avg)
- 3 Clean Sheets
- BTTS in 4/7 matches

Generated Predictions:
1X2:
- Home Win: 68% confidence
- Draw: 52% confidence
- Away Win: 65% confidence

Over/Under:
- Over 2.5: 85% confidence (Expected: 4.86 goals)
- Under 2.5: 45% confidence

BTTS:
- Yes: 75% confidence (50% BTTS rate)
- No: 55% confidence
```

## Running the System

### Generate Predictions:
```bash
npm run generate-predictions
```

This will:
1. Fetch all upcoming matches
2. Analyze last 7 matches for each team
3. Calculate confidence scores
4. Generate 34 predictions per match
5. Save to database

### Update Match Data First:
```bash
npm run update-matches
npm run generate-predictions
```

## Data Requirements

### Optimal Performance:
- Teams have played 7+ recent matches
- Matches are from the same season
- Match results are finalized (status: 'FT')

### Fallback Mode:
- When teams have <7 matches, uses available data
- When no data available, uses intelligent defaults
- System always generates predictions

## Advantages

✅ **Data-Driven**: Based on actual recent performance
✅ **Adaptive**: Adjusts to current form, not season averages
✅ **Comprehensive**: 34 predictions covering all bet types
✅ **Transparent**: Shows analysis basis for each prediction
✅ **Reliable**: Handles missing data gracefully

## Future Enhancements

- [ ] Head-to-head analysis between teams
- [ ] Home/away split statistics
- [ ] Player availability impact
- [ ] Weather conditions
- [ ] Referee statistics
- [ ] League position factor
- [ ] Recent injuries/suspensions
- [ ] Motivation factors (cup finals, relegation battles)

## Technical Details

**Script**: `scripts/generate-predictions-advanced.js`
**Database**: Analyzes `Match` table for historical data
**Output**: Creates `Prediction` records with confidence scores
**Execution Time**: ~2-3 seconds per match

## Notes

- System prioritizes recent form over season-long statistics
- 7 matches provides optimal balance between recency and sample size
- Confidence scores are normalized to 45-95% range
- All predictions include detailed analysis text
- System automatically handles teams with no historical data

---

**Last Updated**: November 9, 2024
**Version**: 2.0 (Advanced Form-Based Predictions)
