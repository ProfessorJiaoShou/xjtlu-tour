import { useEffect, useRef, useState } from 'react';
import { X, Navigation, ImageOff, RefreshCw, ZoomIn, ZoomOut, RotateCw, Smartphone } from 'lucide-react';
import { Viewer } from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';

interface PanoramaViewerProps {
  panoramaUrl: string;
  locationName: string;
  onClose: () => void;
}

export function PanoramaViewer({ panoramaUrl, locationName, onClose }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [showGyroButton, setShowGyroButton] = useState(true);

  useEffect(() => {
    if (!panoramaUrl) {
      setError('No panorama image available for this location');
      setLoading(false);
      return;
    }

    // 验证图片URL是否有效
    const img = new Image();
    img.onload = () => {
      // 图片加载成功，初始化查看器
      initializeViewer();
    };
    img.onerror = () => {
      setError('Failed to load panorama image. Please check the image path and format.');
      setLoading(false);
    };
    img.src = panoramaUrl;

    const initializeViewer = () => {
      if (!containerRef.current) return;

      try {
        const viewer = new Viewer({
          container: containerRef.current,
          panorama: panoramaUrl,
          caption: locationName,
          defaultZoomLvl: 0,
          mousewheel: true,
          navbar: [
            'zoom',
            'move',
            'fullscreen'
          ]
        });

        viewerRef.current = viewer;

        viewer.on('ready', () => {
          console.log('Panorama viewer ready');
          setLoading(false);
          setError(null);
        });

        viewer.on('error', (e: any) => {
          console.error('Panorama viewer error:', e);
          setLoading(false);
          setError('Failed to initialize panorama viewer. The image format may not be supported.');
        });

        return () => {
          if (viewerRef.current) {
            viewerRef.current.destroy();
            viewerRef.current = null;
          }
        };
      } catch (err) {
        console.error('Failed to initialize panorama viewer:', err);
        setLoading(false);
        setError('Failed to initialize panorama viewer. Please try again.');
      }
    };
  }, [panoramaUrl, locationName]);

  const toggleGyroscope = async () => {
    if (!viewerRef.current) return;

    if (gyroEnabled) {
      try {
        viewerRef.current.stopGyroscopeControl();
        setGyroEnabled(false);
      } catch (err) {
        console.error('Failed to disable gyroscope:', err);
      }
    } else {
      try {
        await viewerRef.current.startGyroscopeControl();
        setGyroEnabled(true);
      } catch (err) {
        console.error('Failed to enable gyroscope:', err);
        setError('Unable to enable gyroscope. Please ensure your device supports it and permission is granted.');
      }
    }
  };

  const handleZoomIn = () => {
    if (viewerRef.current) {
      viewerRef.current.zoom(viewerRef.current.getZoomLevel() + 5);
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      viewerRef.current.zoom(viewerRef.current.getZoomLevel() - 5);
    }
  };

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.zoom(0);
      viewerRef.current.rotate({ yaw: 0, pitch: 0 });
    }
  };

  const getZoomPercentage = () => {
    if (viewerRef.current) {
      const zoom = viewerRef.current.getZoomLevel();
      return Math.max(0, Math.min(100, Math.round(zoom)));
    }
    return 0;
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
          {showGyroButton && (
            <button
              onClick={toggleGyroscope}
              className={`hover:bg-white/20 rounded-full p-2 transition-colors ${gyroEnabled ? 'bg-green-500/50' : ''}`}
              title={gyroEnabled ? 'Disable Gyroscope' : 'Enable Gyroscope'}
            >
              <Smartphone className={`w-5 h-5 ${gyroEnabled ? 'text-green-300' : ''}`} />
            </button>
          )}
          <button
            onClick={handleZoomOut}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm min-w-[3rem] text-center">{getZoomPercentage()}%</span>
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
          Drag to rotate · Scroll to zoom · Gyroscope for mobile
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
        className="flex-1 w-full h-full"
      />
    </div>
  );
}