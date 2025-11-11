import Image from 'next/image';
import { formatDate, formatTime, getConfidenceBadgeColor } from '@/lib/utils';
import { TrendingUp, Clock } from 'lucide-react';

interface PredictionCardProps {
  prediction: any;
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const { match } = prediction;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
      {/* Match Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          {match.league.logo && (
            <Image
              src={match.league.logo}
              alt={match.league.name}
              width={20}
              height={20}
              className="object-contain"
            />
          )}
          <span className="text-xs font-semibold text-gray-600">
            {match.league.name}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {match.homeTeam.logo && (
              <Image
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                width={24}
                height={24}
                className="object-contain"
              />
            )}
            <span className="font-semibold text-sm">{match.homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {match.awayTeam.logo && (
              <Image
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                width={24}
                height={24}
                className="object-contain"
              />
            )}
            <span className="font-semibold text-sm">{match.awayTeam.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>
            {formatDate(match.matchDate)} at {formatTime(match.matchDate)}
          </span>
        </div>
      </div>

      {/* Prediction Details */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {prediction.predictionType.replace('_', ' ')}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceBadgeColor(
              prediction.confidence
            )}`}
          >
            {prediction.confidence}% confidence
          </span>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-blue-900">
              {prediction.prediction.replace('_', ' ')}
            </span>
          </div>
          {prediction.analysis && (
            <p className="text-xs text-gray-600 mt-2">{prediction.analysis}</p>
          )}
        </div>

        {prediction.result && prediction.result !== 'PENDING' && (
          <div
            className={`text-center py-2 rounded-lg font-semibold text-sm ${
              prediction.result === 'WON'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {prediction.result}
          </div>
        )}
      </div>
    </div>
  );
}
