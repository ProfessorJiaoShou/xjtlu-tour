import { Trophy, MapPin } from 'lucide-react';

interface TourProgressProps {
  visitedCount: number;
  totalCount: number;
  points: number;
  mapMode?: 'custom' | 'amap';
  onToggleMapMode?: () => void;
}

export function TourProgress({ visitedCount, totalCount, points, mapMode = 'custom', onToggleMapMode }: TourProgressProps) {
  const percentage = (visitedCount / totalCount) * 100;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="text-sm">
            <span className="text-blue-600">{visitedCount}</span>
            <span className="text-gray-500">/{totalCount}</span> visited
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMapMode}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
              mapMode === 'custom' 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">
              {mapMode === 'custom' ? 'Custom Map' : 'AMap'}
            </span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-white" />
            <span className="text-white">{points}</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}