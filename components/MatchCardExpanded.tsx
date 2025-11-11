'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDate, formatTime, getConfidenceBadgeColor } from '@/lib/utils';
import { Clock, MapPin, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import LiveScoreBadge from './LiveScoreBadge';

interface MatchCardExpandedProps {
  match: any;
}

export default function MatchCardExpanded({ match }: MatchCardExpandedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const topPrediction = match.predictions
    ?.sort((a: any, b: any) => b.confidence - a.confidence)[0];

  const isLive = ['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(match.status);

  // Group predictions by type
  const predictionsByType: Record<string, any[]> = {};
  match.predictions?.forEach((pred: any) => {
    if (!predictionsByType[pred.predictionType]) {
      predictionsByType[pred.predictionType] = [];
    }
    predictionsByType[pred.predictionType].push(pred);
  });

  // Sort predictions within each type by confidence
  Object.keys(predictionsByType).forEach(type => {
    predictionsByType[type].sort((a, b) => b.confidence - a.confidence);
  });

  const predictionTypeLabels: Record<string, string> = {
    '1X2': 'Match Result',
    'OVER_UNDER': 'Over/Under Goals',
    'BTTS': 'Both Teams to Score',
    'DOUBLE_CHANCE': 'Double Chance',
    'HALFTIME': 'Halftime Result',
    'CORRECT_SCORE': 'Correct Score',
    'TOTAL_GOALS': 'Total Goals',
    'WIN_TO_NIL': 'Win to Nil',
    'FIRST_HALF_GOALS': 'First Half Goals',
    'SECOND_HALF_WINNER': 'Second Half Winner'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 ${isLive ? 'ring-2 ring-red-500' : ''}`}>
      {/* League Info */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          {match.league.logo && (
            <Image
              src={match.league.logo}
              alt={match.league.name}
              width={24}
              height={24}
              className="object-contain"
            />
          )}
          <span className="text-sm font-semibold text-gray-700">
            {match.league.name}
          </span>
        </div>
        {isLive && <LiveScoreBadge status={match.status} />}
      </div>

      {/* Teams */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {match.homeTeam.logo && (
              <Image
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                width={32}
                height={32}
                className="object-contain"
              />
            )}
            <span className="font-semibold text-gray-900">
              {match.homeTeam.name}
            </span>
          </div>
          {match.homeScore !== null && (
            <span className={`text-2xl font-bold ${isLive ? 'text-red-600' : 'text-gray-900'}`}>
              {match.homeScore}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {match.awayTeam.logo && (
              <Image
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                width={32}
                height={32}
                className="object-contain"
              />
            )}
            <span className="font-semibold text-gray-900">
              {match.awayTeam.name}
            </span>
          </div>
          {match.awayScore !== null && (
            <span className={`text-2xl font-bold ${isLive ? 'text-red-600' : 'text-gray-900'}`}>
              {match.awayScore}
            </span>
          )}
        </div>
      </div>

      {/* Match Info */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            {formatDate(match.matchDate)} at {formatTime(match.matchDate)}
          </span>
        </div>
        {match.venue && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{match.venue}</span>
          </div>
        )}
      </div>

      {/* Top Prediction */}
      {topPrediction && (
        <div className="pt-3 border-t mb-3">
          <p className="text-xs text-gray-500 mb-2">Top Prediction</p>
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {predictionTypeLabels[topPrediction.predictionType] || topPrediction.predictionType}
              </p>
              <p className="text-lg font-bold text-blue-600">
                {topPrediction.prediction.replace(/_/g, ' ')}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceBadgeColor(topPrediction.confidence)}`}>
              {topPrediction.confidence}%
            </span>
          </div>
        </div>
      )}

      {/* All Predictions Dropdown */}
      {match.predictions && match.predictions.length > 0 && (
        <div className="pt-3 border-t">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">
                All Predictions ({match.predictions.length})
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Expanded Predictions */}
          {isExpanded && (
            <div className="mt-3 space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(predictionsByType).map(([type, predictions]) => (
                <div key={type} className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    {predictionTypeLabels[type] || type}
                  </h4>
                  <div className="space-y-2">
                    {predictions.map((pred: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white rounded p-2 flex items-center justify-between hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {pred.prediction.replace(/_/g, ' ')}
                          </p>
                          {pred.analysis && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {pred.analysis}
                            </p>
                          )}
                        </div>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getConfidenceBadgeColor(pred.confidence)}`}>
                          {pred.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
