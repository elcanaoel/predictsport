import { prisma } from '@/lib/prisma';
import MatchCardExpanded from '@/components/MatchCardExpanded';
import LiveScoresRefresh from '@/components/LiveScoresRefresh';
import { Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getLiveAndUpcomingMatches() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const matches = await prisma.match.findMany({
    where: {
      matchDate: {
        gte: today,
        lt: tomorrow,
      },
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
  });

  // Separate live and upcoming matches
  const liveMatches = matches.filter(m => 
    ['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(m.status)
  );
  
  const upcomingMatches = matches.filter(m => m.status === 'NS');
  const finishedMatches = matches.filter(m => 
    ['FT', 'AET', 'PEN'].includes(m.status)
  );

  return { liveMatches, upcomingMatches, finishedMatches };
}

export default async function LivePage() {
  const { liveMatches, upcomingMatches, finishedMatches } = await getLiveAndUpcomingMatches();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold">Live Scores</h1>
          </div>
          <p className="text-gray-600">
            Real-time updates from today's matches
          </p>
        </div>
        <LiveScoresRefresh />
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex items-center">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-red-600">
              Live Now ({liveMatches.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <MatchCardExpanded key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Upcoming Today ({upcomingMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <MatchCardExpanded key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Finished Matches */}
      {finishedMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Finished Today ({finishedMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finishedMatches.map((match) => (
              <MatchCardExpanded key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* No Matches */}
      {liveMatches.length === 0 && upcomingMatches.length === 0 && finishedMatches.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            No matches scheduled for today
          </p>
          <p className="text-sm text-gray-400">
            Check back later or run the update script to fetch match data
          </p>
        </div>
      )}
    </div>
  );
}
