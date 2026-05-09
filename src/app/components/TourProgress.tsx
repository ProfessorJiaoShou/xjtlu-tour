import { Trophy, MapPin, Camera, QrCode, HelpCircle } from 'lucide-react';

interface TourProgressProps {
  visitedCount: number;
  totalCount: number;
  points: number;
  mapMode?: 'custom' | 'osm';
  onToggleMapMode?: () => void;
  onOpenPhotoAlbum?: () => void;
  hasUserPhotos?: boolean;
  onOpenQRExchange?: () => void;
  onOpenTutorial?: () => void;
}

export function TourProgress({ visitedCount, totalCount, points, mapMode = 'custom', onToggleMapMode, onOpenPhotoAlbum, hasUserPhotos, onOpenQRExchange, onOpenTutorial }: TourProgressProps) {
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
          {onOpenTutorial && (
            <button
              onClick={onOpenTutorial}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-200"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Tutorial</span>
            </button>
          )}
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
              {mapMode === 'custom' ? 'Custom Map' : 'OSM'}
            </span>
          </button>
          {hasUserPhotos && onOpenPhotoAlbum && (
            <button
              onClick={onOpenPhotoAlbum}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">My Photos</span>
            </button>
          )}
          {onOpenQRExchange && (
            <button
              onClick={onOpenQRExchange}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
            >
              <QrCode className="w-4 h-4" />
              <span className="text-sm font-medium">QR Code</span>
            </button>
          )}
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