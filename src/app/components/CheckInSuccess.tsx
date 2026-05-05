
import { CheckCircle, X, Camera, SkipForward } from 'lucide-react';
import { Location } from '../App';

interface CheckInSuccessProps {
  location: Location;
  onClose: () => void;
  onTakePhoto: () => void;
}

export function CheckInSuccess({ location, onClose, onTakePhoto }: CheckInSuccessProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-slide-up mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check-in Successful!
            </h2>
            <p className="text-gray-600 mb-1">
              {location.name}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-4xl font-bold text-green-600">+{location.points}</span>
              <span className="text-gray-500">Points</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onTakePhoto}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Take Photo
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <SkipForward className="w-5 h-5" />
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}