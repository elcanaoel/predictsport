'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatTime } from '@/lib/utils';
import { Clock, MapPin, RefreshCw } from 'lucide-react';
import LiveScoreBadge from './LiveScoreBadge';

interface LiveMatchCardProps {
  match: any;
  autoRefresh?: boolean;
}

export default function LiveMatchCard({ match: initialMatch, autoRefresh = true }: LiveMatchCardProps) {
  const [match, setMatch] = useState(initialMatch);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const isLive = ['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(match.status);

  const refreshMatch = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/matches/${match.id}`);
      const data = await response.json();
      
      if (data.success) {
        setMatch(data.match);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error refreshing match:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!autoRefresh || !isLive) return;

    // Refresh every 30 seconds for live matches
    const interval = setInterval(() => {
      refreshMatch();
    }, 30000);

    return () => clearInterval(interval);
  }, [match.id, isLive, autoRefresh]);

  const getStatusDisplay = () => {
    switch (match.status) {
      case 'NS': return formatTime(match.matchDate);
      case 'FT': return 'Full Time';
      case 'AET': return 'After Extra Time';
      case 'PEN': return 'After Penalties';
      case 'PST': return 'Postponed';
      case 'CANC': return 'Cancelled';
      case 'ABD': return 'Abandoned';
      case 'SUSP': return 'Suspended';
      default: return match.status;
    }
  };

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

      {/* Teams and Scores */}
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {match.homeTeam.logo && (
              <Image
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                width={40}
                height={40}
                className="object-contain"
              />
            )}
            <span className="font-semibold text-lg text-gray-900">
              {match.homeTeam.name}
            </span>
          </div>
          {match.homeScore !== null ? (
            <span className={`text-3xl font-bold ${isLive ? 'text-red-600' : 'text-gray-900'}`}>
              {match.homeScore}
            </span>
          ) : (
            <span className="text-2xl font-bold text-gray-400">-</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {match.awayTeam.logo && (
              <Image
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                width={40}
                height={40}
                className="object-contain"
              />
            )}
            <span className="font-semibold text-lg text-gray-900">
              {match.awayTeam.name}
            </span>
          </div>
          {match.awayScore !== null ? (
            <span className={`text-3xl font-bold ${isLive ? 'text-red-600' : 'text-gray-900'}`}>
              {match.awayScore}
            </span>
          ) : (
            <span className="text-2xl font-bold text-gray-400">-</span>
          )}
        </div>
      </div>

      {/* Match Info */}
      <div className="space-y-2 text-sm text-gray-600 pt-3 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{getStatusDisplay()}</span>
          </div>
          {isLive && (
            <button
              onClick={refreshMatch}
              disabled={isRefreshing}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-xs">Refresh</span>
            </button>
          )}
        </div>
        {match.venue && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{match.venue}</span>
          </div>
        )}
        {isLive && (
          <div className="text-xs text-gray-500 mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
