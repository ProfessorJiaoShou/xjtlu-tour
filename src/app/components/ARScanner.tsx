import { useState, useEffect, useRef } from 'react';
import { Location } from '../App';
import { Scan, Zap, Target, Camera, AlertCircle } from 'lucide-react';

interface ARScannerProps {
  locations: Location[];
  onLocationVisit: (locationId: string) => void;
  onLocationSelect: (location: Location) => void;
}

export function ARScanner({ locations, onLocationVisit, onLocationSelect }: ARScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedLocation, setDetectedLocation] = useState<Location | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const nearby = locations.filter((_, index) => index < 3);
    setNearbyLocations(nearby);
  }, [locations]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setCameraError(null);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please ensure camera permission is granted.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setDetectedLocation(null);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          const randomLocation = nearbyLocations[Math.floor(Math.random() * nearbyLocations.length)];
          if (randomLocation) {
            setDetectedLocation(randomLocation);
            setTimeout(() => {
              onLocationVisit(randomLocation.id);
              setIsScanning(false);
              setScanProgress(0);
            }, 2500);
          }
          return 100;
        }
        return prev + 2;
      });
    }, 30);
  };

  return (
    <div className="h-full w-full relative bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      {!cameraActive && !cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-center">
            <Camera className="w-12 h-12 mx-auto mb-3 animate-pulse" />
            <p>Starting camera...</p>
          </div>
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-center p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
            <p className="mb-4">{cameraError}</p>
            <button
              onClick={startCamera}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10"></div>

        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 border-4 border-blue-400/70 rounded-lg shadow-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
            </div>

            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{
                    top: `${scanProgress}%`,
                    transition: 'top 100ms linear',
                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)'
                  }}
                ></div>
              </div>
            )}

            {detectedLocation && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 text-center shadow-2xl border-2 border-green-400 animate-pulse">
                  <div className="text-6xl mb-2">{detectedLocation.image}</div>
                  <h3 className="text-gray-900 mb-1">{detectedLocation.name}</h3>
                  <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4" />
                    +{detectedLocation.points} 积分
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-4 left-4 right-4 bg-black/40 backdrop-blur-md rounded-lg p-3 text-white z-10 pointer-events-auto">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-5 h-5" />
            <span className="text-sm">AR Camera Mode</span>
          </div>
          <p className="text-xs opacity-75">
            Point camera at campus landmarks to scan and discover!
          </p>
        </div>

        <div className="absolute top-28 right-4 space-y-2 z-10">
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 text-white text-xs pointer-events-auto">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-green-400" />
              <span>Nearby Locations</span>
            </div>
            {nearbyLocations.slice(0, 3).map(loc => (
              <div key={loc.id} className="flex items-center gap-2 mt-2">
                <span>{loc.image}</span>
                <span className="text-xs truncate max-w-[120px]">{loc.name}</span>
                {loc.visited && <span className="text-green-400 text-xs">✓</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-32 left-0 right-0 px-4 z-10 pointer-events-auto">
          <button
            onClick={handleScan}
            disabled={isScanning || !cameraActive}
            className={`w-full py-4 rounded-full shadow-lg transition-all ${
              isScanning || !cameraActive
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-xl hover:scale-105 active:scale-95'
            } text-white flex items-center justify-center gap-2`}
          >
            <Scan className={`w-6 h-6 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? `Scanning... ${scanProgress}%` : 'Start AR Scan'}
          </button>

          {scanProgress === 0 && cameraActive && (
            <p className="text-white text-xs text-center mt-3 opacity-75">
              Tap to start scanning and discover campus locations
            </p>
          )}
        </div>

        <div className="absolute bottom-4 left-0 right-0 px-4 z-10 pointer-events-auto">
          <div className="grid grid-cols-3 gap-2">
            {nearbyLocations.slice(0, 3).map(loc => (
              <button
                key={loc.id}
                onClick={() => onLocationSelect(loc)}
                className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-white hover:bg-black/60 transition-colors"
              >
                <div className="text-2xl mb-1">{loc.image}</div>
                <div className="text-xs truncate">{loc.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}