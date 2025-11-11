import Image from 'next/image';
import { formatDate, formatTime } from '@/lib/utils';
import { Clock, MapPin } from 'lucide-react';
import PredictionBadge from './PredictionBadge';
import LiveScoreBadge from './LiveScoreBadge';

interface MatchCardProps {
  match: any;
}

export default function MatchCard({ match }: MatchCardProps) {
  const topPrediction = match.predictions
    ?.sort((a: any, b: any) => b.confidence - a.confidence)[0];

  const isLive = ['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(match.status);

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 ${isLive ? 'ring-2 ring-red-500' : ''}`}>
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
        <div className="pt-3 border-t">
          <p className="text-xs text-gray-500 mb-2">Top Prediction</p>
          <PredictionBadge prediction={topPrediction} />
        </div>
      )}
    </div>
  );
}
