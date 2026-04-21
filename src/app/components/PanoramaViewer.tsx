import { useEffect, useRef, useState } from 'react';
import { X, Navigation, ImageOff, RefreshCw, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface PanoramaViewerProps {
  panoramaUrl: string;
  locationName: string;
  onClose: () => void;
}

export function PanoramaViewer({ panoramaUrl, locationName, onClose }: PanoramaViewerProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!panoramaUrl) {
      setError('No panorama image available for this location');
      setLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      console.log('Panorama image loaded successfully');
      setLoading(false);
      setError(null);
    };
    img.onerror = () => {
      console.error('Failed to load panorama image');
      setLoading(false);
      setError('Failed to load panorama image. Please check the image path.');
    };
    img.src = panoramaUrl;
  }, [panoramaUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  };

  const handleReset = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden">
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            <span className="font-medium">{locationName}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white flex items-center gap-3">
          <button
            onClick={handleZoomOut}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/30" />
          <button
            onClick={handleReset}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
            title="Reset"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
          Drag to move · Scroll to zoom
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading 360° panorama...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-white text-center max-w-md p-6">
            <ImageOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Image Available</h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex-1 w-full h-full overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <img
            ref={imageRef}
            src={panoramaUrl}
            alt="360° Panorama"
            className="max-w-none max-h-none"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}