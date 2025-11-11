import { TeamStatistics } from './football-api';

export interface PredictionResult {
  type: string;
  prediction: string;
  confidence: number;
  analysis: string;
  odds?: number;
}

export class PredictionEngine {
  // Analyze match and generate predictions
  static analyzeMath(
    homeStats: TeamStatistics | null,
    awayStats: TeamStatistics | null,
    h2hMatches: any[]
  ): PredictionResult[] {
    const predictions: PredictionResult[] = [];

    // 1X2 Prediction (Home/Draw/Away)
    const matchResult = this.predict1X2(homeStats, awayStats, h2hMatches);
    predictions.push(matchResult);

    // Over/Under 2.5 Goals
    const overUnder = this.predictOverUnder(homeStats, awayStats);
    predictions.push(overUnder);

    // Both Teams to Score (BTTS)
    const btts = this.predictBTTS(homeStats, awayStats);
    predictions.push(btts);

    // Double Chance
    const doubleChance = this.predictDoubleChance(homeStats, awayStats);
    predictions.push(doubleChance);

    return predictions;
  }

  private static predict1X2(
    homeStats: TeamStatistics | null,
    awayStats: TeamStatistics | null,
    h2hMatches: any[]
  ): PredictionResult {
    let homeScore = 50;
    let awayScore = 50;

    // Analyze form
    if (homeStats?.form && awayStats?.form) {
      const homeFormScore = this.calculateFormScore(homeStats.form);
      const awayFormScore = this.calculateFormScore(awayStats.form);
      
      homeScore += (homeFormScore - awayFormScore) * 2;
      awayScore += (awayFormScore - homeFormScore) * 2;
    }

    // Home advantage
    homeScore += 10;

    // Goals scored/conceded
    if (homeStats && awayStats) {
      const homeGoalDiff = parseFloat(homeStats.goals.for.average) - parseFloat(homeStats.goals.against.average);
      const awayGoalDiff = parseFloat(awayStats.goals.for.average) - parseFloat(awayStats.goals.against.average);
      
      homeScore += homeGoalDiff * 5;
      awayScore += awayGoalDiff * 5;
    }

    // Head to head
    if (h2hMatches.length > 0) {
      const h2hScore = this.analyzeH2H(h2hMatches);
      homeScore += h2hScore;
      awayScore -= h2hScore;
    }

    // Normalize scores
    const total = homeScore + awayScore;
    homeScore = (homeScore / total) * 100;
    awayScore = (awayScore / total) * 100;

    let prediction = 'HOME';
    let confidence = homeScore;
    let analysis = 'Home team has the advantage';

    if (awayScore > homeScore) {
      prediction = 'AWAY';
      confidence = awayScore;
      analysis = 'Away team is favored to win';
    } else if (Math.abs(homeScore - awayScore) < 10) {
      prediction = 'DRAW';
      confidence = 100 - Math.abs(homeScore - awayScore);
      analysis = 'Match is evenly balanced, draw likely';
    }

    return {
      type: '1X2',
      prediction,
      confidence: Math.min(Math.round(confidence), 95),
      analysis,
    };
  }

  private static predictOverUnder(
    homeStats: TeamStatistics | null,
    awayStats: TeamStatistics | null
  ): PredictionResult {
    let totalGoals = 2.5;

    if (homeStats && awayStats) {
      const homeAvg = parseFloat(homeStats.goals.for.average);
      const awayAvg = parseFloat(awayStats.goals.for.average);
      totalGoals = homeAvg + awayAvg;
    }

    const prediction = totalGoals > 2.5 ? 'OVER_2.5' : 'UNDER_2.5';
    const confidence = Math.min(Math.abs(totalGoals - 2.5) * 20 + 60, 90);

    return {
      type: 'OVER_UNDER',
      prediction,
      confidence: Math.round(confidence),
      analysis: `Expected total goals: ${totalGoals.toFixed(1)}`,
    };
  }

  private static predictBTTS(
    homeStats: TeamStatistics | null,
    awayStats: TeamStatistics | null
  ): PredictionResult {
    let bttsScore = 50;

    if (homeStats && awayStats) {
      const homeScoring = parseFloat(homeStats.goals.for.average);
      const awayScoring = parseFloat(awayStats.goals.for.average);
      const homeConceding = parseFloat(homeStats.goals.against.average);
      const awayConceding = parseFloat(awayStats.goals.against.average);

      // Both teams score well and concede
      if (homeScoring > 1.2 && awayScoring > 1.2) {
        bttsScore += 20;
      }
      if (homeConceding > 1.0 && awayConceding > 1.0) {
        bttsScore += 20;
      }
    }

    const prediction = bttsScore > 60 ? 'YES' : 'NO';
    const confidence = Math.min(Math.abs(bttsScore - 50) + 55, 85);

    return {
      type: 'BTTS',
      prediction,
      confidence: Math.round(confidence),
      analysis: prediction === 'YES' 
        ? 'Both teams likely to score' 
        : 'At least one team may not score',
    };
  }

  private static predictDoubleChance(
    homeStats: TeamStatistics | null,
    awayStats: TeamStatistics | null
  ): PredictionResult {
    // This is a safer bet combining two outcomes
    let prediction = '1X'; // Home or Draw
    let confidence = 75;
    let analysis = 'Home team unlikely to lose';

    if (awayStats && homeStats) {
      const awayStrength = parseFloat(awayStats.goals.for.average) - parseFloat(awayStats.goals.against.average);
      const homeStrength = parseFloat(homeStats.goals.for.average) - parseFloat(homeStats.goals.against.average);

      if (awayStrength > homeStrength + 0.5) {
        prediction = 'X2'; // Draw or Away
        analysis = 'Away team unlikely to lose';
      }
    }

    return {
      type: 'DOUBLE_CHANCE',
      prediction,
      confidence,
      analysis,
    };
  }

  private static calculateFormScore(form: string): number {
    let score = 0;
    for (const result of form.split('').reverse().slice(0, 5)) {
      if (result === 'W') score += 3;
      else if (result === 'D') score += 1;
    }
    return score;
  }

  private static analyzeH2H(h2hMatches: any[]): number {
    let homeWins = 0;
    let awayWins = 0;

    h2hMatches.slice(0, 5).forEach((match) => {
      if (match.goals.home > match.goals.away) homeWins++;
      else if (match.goals.away > match.goals.home) awayWins++;
    });

    return (homeWins - awayWins) * 3;
  }
}
