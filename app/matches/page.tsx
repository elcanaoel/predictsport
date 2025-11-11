import { prisma } from '@/lib/prisma';
import MatchCardExpanded from '@/components/MatchCardExpanded';
import { Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';

export const dynamic = 'force-dynamic';

async function getMatchesByDate(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const matches = await prisma.match.findMany({
    where: {
      matchDate: {
        gte: startOfDay,
        lte: endOfDay,
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

  return matches;
}

export default async function MatchesPage() {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const matchesByDate = await Promise.all(
    dates.map(async (date) => ({
      date,
      matches: await getMatchesByDate(date),
    }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Matches</h1>
        <p className="text-gray-600">
          View all upcoming matches for the next 7 days
        </p>
      </div>

      <div className="space-y-8">
        {matchesByDate.map(({ date, matches }) => (
          <div key={date.toISOString()}>
            <div className="flex items-center gap-2 mb-4 bg-white rounded-lg shadow px-4 py-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold ml-auto">
                {matches.length} matches
              </span>
            </div>

            {matches.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No matches scheduled for this day
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <MatchCardExpanded key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
