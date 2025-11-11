interface StatsOverviewProps {
  stats: {
    totalPredictions: number;
    wonPredictions: number;
    pendingPredictions: number;
    winRate: string;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Performance Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalPredictions}
          </p>
          <p className="text-sm text-gray-600">Total Predictions</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">
            {stats.wonPredictions}
          </p>
          <p className="text-sm text-gray-600">Won</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {stats.pendingPredictions}
          </p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.winRate}%</p>
          <p className="text-sm text-gray-600">Win Rate</p>
        </div>
      </div>
    </div>
  );
}
