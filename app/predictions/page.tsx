import { prisma } from '@/lib/prisma';
import MatchCardExpanded from '@/components/MatchCardExpanded';
import { Target } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getAllMatches() {
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
  });

  return matches;
}

export default async function PredictionsPage() {
  const matches = await getAllMatches();

  // Calculate total predictions
  const totalPredictions = matches.reduce((sum, match) => sum + (match.predictions?.length || 0), 0);

  // Sort matches by number of predictions (most predictions first)
  const sortedMatches = [...matches].sort((a, b) => 
    (b.predictions?.length || 0) - (a.predictions?.length || 0)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">All Predictions</h1>
        </div>
        <p className="text-gray-600">
          Browse all matches with comprehensive predictions. Click "All Predictions" on any match to see all 34 betting options.
        </p>
        <div className="mt-4 flex gap-4">
          <div className="bg-blue-50 rounded-lg px-4 py-2">
            <p className="text-sm text-gray-600">Total Matches</p>
            <p className="text-2xl font-bold text-blue-600">{matches.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg px-4 py-2">
            <p className="text-sm text-gray-600">Total Predictions</p>
            <p className="text-2xl font-bold text-green-600">{totalPredictions}</p>
          </div>
          <div className="bg-purple-50 rounded-lg px-4 py-2">
            <p className="text-sm text-gray-600">Avg per Match</p>
            <p className="text-2xl font-bold text-purple-600">
              {matches.length > 0 ? Math.round(totalPredictions / matches.length) : 0}
            </p>
          </div>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            No predictions available yet.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Run the update and prediction scripts to generate predictions.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            💡 <strong>Tip:</strong> Click "All Predictions" button on any match card to view all 34 prediction options organized by category.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMatches.map((match) => (
              <MatchCardExpanded key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
