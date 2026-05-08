
import { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

interface PhotoGalleryProps {
  locationName: string;
  photos: string[];
  onClose: () => void;
}

export function PhotoGallery({ locationName, photos, onClose }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleImageClick = async () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      
      if (containerRef.current) {
        try {
          if (!document.fullscreenElement) {
            await containerRef.current.requestFullscreen();
          } else {
            await document.exitFullscreen();
          }
        } catch (error) {
          console.error('Fullscreen error:', error);
        }
      }
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setIsZoomed(!isZoomed);
        clickTimeoutRef.current = null;
      }, 300);
    }
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (photos.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <X className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No Photos Available</h3>
          <p className="text-gray-600 mb-6">There are no photos available for this location.</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <span className="font-medium">{locationName}</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-300">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoom}
            className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Carousel
          className="w-full h-full"
          opts={{
            align: 'center',
            loop: true,
          }}
          setApi={(api) => {
            if (api) {
              api.on('select', () => {
                setCurrentIndex(api.selectedScrollSnap());
              });
            }
          }}
        >
          <CarouselContent className="h-full items-center">
            {photos.map((photo, index) => (
              <CarouselItem key={index} className="h-full flex items-center justify-center">
                <div
                  className="
                    relative w-full h-full flex items-center justify-center cursor-pointer
                  "
                  onClick={handleImageClick}
                >
                  <img
                    src={photo}
                    alt={`${locationName} - Photo ${index + 1}`}
                    className={`
                      max-w-full max-h-full object-contain transition-transform duration-300
                      ${isZoomed ? 'scale-200' : 'scale-100'}
                    `}
                    style={{
                      maxWidth: '100vw',
                      maxHeight: '100vh',
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70" />
        </Carousel>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-center text-sm">
          <p>Swipe or use arrows · Click to zoom · Double-click to fullscreen</p>
        </div>
      </div>
    </div>
  );
}