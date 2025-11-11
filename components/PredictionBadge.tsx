import { getConfidenceBadgeColor } from '@/lib/utils';

interface PredictionBadgeProps {
  prediction: any;
}

export default function PredictionBadge({ prediction }: PredictionBadgeProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-700">
          {prediction.predictionType.replace('_', ' ')}
        </p>
        <p className="text-lg font-bold text-blue-600">
          {prediction.prediction.replace('_', ' ')}
        </p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceBadgeColor(
          prediction.confidence
        )}`}
      >
        {prediction.confidence}%
      </span>
    </div>
  );
}
