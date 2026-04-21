import { Location } from '../App';
import { X, MapPin, Zap, Lightbulb, CheckCircle, Navigation, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LocationDetailProps {
  location: Location;
  onClose: () => void;
  onVisit: (locationId: string) => void;
  onViewPanorama?: (location: Location) => void;
}

export function LocationDetail({ location, onClose, onVisit, onViewPanorama }: LocationDetailProps) {
  const handleMarkVisited = () => {
    if (!location.visited) {
      onVisit(location.id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-7xl mb-4">
              {location.image}
            </div>

            <h2 className="text-2xl mb-2">
              {location.name}
            </h2>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm capitalize">
                {location.category}
              </span>
              {location.visited && (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-500 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Visited
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-96">
          <div>
            <div className="flex items-center gap-2 mb-2 text-gray-700">
              <MapPin className="w-5 h-5" />
              <h3>About this location</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {location.description}
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-900 mb-1">Fun Fact</h4>
                <p className="text-sm text-yellow-800">
                  {location.funFact}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Points Reward</span>
              </div>
              <span className="text-2xl text-blue-600">{location.points}</span>
            </div>
          </div>

          {!location.visited ? (
            <button
              onClick={handleMarkVisited}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Visited
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800">You've explored this location!</p>
              <p className="text-sm text-green-600 mt-1">Keep exploring to earn more points</p>
            </div>
          )}

          {onViewPanorama && (
            <button
              onClick={() => onViewPanorama(location)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              360° View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}