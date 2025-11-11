'use client';

interface LiveScoreBadgeProps {
  status: string;
}

export default function LiveScoreBadge({ status }: LiveScoreBadgeProps) {
  const isLive = ['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(status);
  
  if (!isLive) return null;

  const getStatusText = () => {
    switch (status) {
      case '1H': return 'LIVE - 1st Half';
      case 'HT': return 'Half Time';
      case '2H': return 'LIVE - 2nd Half';
      case 'ET': return 'Extra Time';
      case 'P': return 'Penalties';
      default: return 'LIVE';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </div>
      <span className="text-xs font-bold text-red-600 uppercase">
        {getStatusText()}
      </span>
    </div>
  );
}
