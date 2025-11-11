import { prisma } from '@/lib/prisma';
import MatchCardExpanded from '@/components/MatchCardExpanded';
import StatsOverview from '@/components/StatsOverview';
import { TrendingUp, Target, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getUpcomingMatches() {
  const matches = await prisma.match.findMany({
    where: {
      matchDate: {
        gte: new Date(),
      },
      status: 'NS',
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
      predictions: true,
    },
    orderBy: {
      matchDate: 'asc',
    },
    take: 12,
  });

  return matches;
}

async function getStatistics() {
  const totalPredictions = await prisma.prediction.count();
  const wonPredictions = await prisma.prediction.count({
    where: { result: 'WON' },
  });
  const pendingPredictions = await prisma.prediction.count({
    where: { result: 'PENDING' },
  });

  const winRate = totalPredictions > 0 
    ? ((wonPredictions / (totalPredictions - pendingPredictions)) * 100).toFixed(1)
    : '0.0';

  return {
    totalPredictions,
    wonPredictions,
    pendingPredictions,
    winRate,
  };
}

export default async function Home() {
  const matches = await getUpcomingMatches();
  const stats = await getStatistics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Expert Sports Predictions</h1>
        <p className="text-xl mb-6">
          Get daily betting tips powered by real-time data and advanced analytics
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Total Predictions</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalPredictions}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Win Rate</span>
            </div>
            <p className="text-3xl font-bold">{stats.winRate}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Active Tips</span>
            </div>
            <p className="text-3xl font-bold">{stats.pendingPredictions}</p>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <StatsOverview stats={stats} />

      {/* Upcoming Matches */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Today's Top Predictions</h2>
        {matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              No upcoming matches available. Please run the update script to fetch match data.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run update-matches</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCardExpanded key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Real-Time Data</h3>
          <p className="text-gray-600">
            Live match updates and statistics from major leagues worldwide
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Expert Analysis</h3>
          <p className="text-gray-600">
            Advanced algorithms analyze team form, head-to-head, and statistics
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Daily Updates</h3>
          <p className="text-gray-600">
            Automatic daily updates ensure you never miss a betting opportunity
          </p>
        </div>
      </div>
    </div>
  );
}
