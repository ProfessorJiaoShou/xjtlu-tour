import { useState } from 'react';
import { Location } from '../App';
import { X, MapPin, Zap, Lightbulb, CheckCircle, Navigation, Camera, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

interface LocationDetailProps {
  location: Location;
  onClose: () => void;
  onVisit: (locationId: string) => void;
  onViewPanorama?: (location: Location) => void;
  onViewPhotos?: (location: Location) => void;
}

export function LocationDetail({ location, onClose, onVisit, onViewPanorama }: LocationDetailProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showPhotos, setShowPhotos] = useState(false);
  const photos = location.photos || [];

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

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {photos.length > 0 && (
            <button
              onClick={() => setShowPhotos(!showPhotos)}
              className="absolute top-4 left-4 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors text-white"
            >
              <Images className="w-5 h-5" />
            </button>
          )}

          <div className="relative h-64 overflow-hidden">
            <div
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                showPhotos && photos.length > 0 ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
              }`}
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 h-full p-8 text-white">
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

            {photos.length > 0 && (
              <div
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  showPhotos ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
                }`}
              >
                <div className="relative h-full bg-gray-900">
                  <Carousel
                    className="w-full h-full"
                    opts={{
                      align: 'center',
                      loop: true,
                    }}
                    setApi={(api) => {
                      if (api) {
                        api.on('select', () => {
                          setCurrentPhotoIndex(api.selectedScrollSnap());
                        });
                      }
                    }}
                  >
                    <CarouselContent className="h-full">
                      {photos.map((photo, index) => (
                        <CarouselItem key={index} className="h-full">
                          <img
                            src={photo}
                            alt={`${location.name} - Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70" />
                    <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70" />
                  </Carousel>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm z-10">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {photos.length > 0 && !showPhotos && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {location.name}
              </h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                  {location.category}
                </span>
                {location.visited && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-500 rounded-full text-sm text-white">
                    <CheckCircle className="w-4 h-4" />
                    Visited
                  </span>
                )}
              </div>
            </div>
          )}
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