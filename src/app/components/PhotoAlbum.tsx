
import { useState, useEffect } from 'react';
import { X, MapPin, Trophy, ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';
import { Location } from '../App';

interface PhotoAlbumProps {
  locations: Location[];
  onClose: () => void;
  isCompletion?: boolean;
}

export function PhotoAlbum({ locations, onClose, isCompletion = false }: PhotoAlbumProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const userPhotos = locations.filter(loc => loc.userPhoto).map(loc => ({
    location: loc,
    photo: loc.userPhoto!
  }));

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % userPhotos.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + userPhotos.length) % userPhotos.length);
  };

  const handleDownload = () => {
    const currentPhoto = userPhotos[currentIndex];
    if (currentPhoto) {
      const link = document.createElement('a');
      link.href = currentPhoto.photo;
      link.download = `${currentPhoto.location.name.replace(/\s+/g, '_')}_photo.jpg`;
      link.click();
    }
  };

  const handleShare = async () => {
    const currentPhoto = userPhotos[currentIndex];
    if (currentPhoto && navigator.share) {
      try {
        await navigator.share({
          title: `My photo at ${currentPhoto.location.name}`,
          text: `I completed check-in at ${currentPhoto.location.name} at XJTLU!`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userPhotos.length]);

  if (userPhotos.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <X className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
          <p className="text-gray-600 mb-6">You haven't taken any check-in photos yet</p>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentPhoto = userPhotos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{currentPhoto.location.name}</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            {currentIndex + 1} / {userPhotos.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center p-8">
          <img
            src={currentPhoto.photo}
            alt={`${currentPhoto.location.name} - Photo ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-12 left-12 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{currentPhoto.location.name}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
          {isCompletion ? (
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>🎉 Congratulations! You've completed all locations!</span>
            </div>
          ) : (
            <p>Swipe to view your check-in photos</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
            title="Download photo"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}