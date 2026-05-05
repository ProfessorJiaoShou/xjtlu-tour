
import { useRef, useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';

interface CameraCaptureProps {
  locationName: string;
  onCapture: (photoData: string) => void;
  onClose: () => void;
}

export function CameraCapture({ locationName, onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function initCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support camera access');
        return;
      }

      try {
        const constraints = {
          video: {
            facingMode: 'environment'
          },
          audio: false
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            setIsVideoReady(true);
          };
          
          videoRef.current.oncanplay = () => {
            setIsVideoReady(true);
          };
          
          videoRef.current.onerror = (e) => {
            console.error('Video error:', e);
            setError('Camera failed to load, please check device permissions');
          };
        }
      } catch (err: any) {
        console.error('Camera access error:', err);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission denied, please allow access in settings');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('Camera device not found');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is being used by another application');
        } else {
          setError(`Unable to access camera: ${err.message || 'Unknown error'}`);
        }
      }
    }
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  const handleCapture = () => {
    if (!isVideoReady) {
      console.warn('Video not ready yet');
      return;
    }
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoData);
      }
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <p className="font-medium">{locationName}</p>
          <p className="text-sm text-gray-300">Take Photo</p>
        </div>
        <button
          onClick={onClose}
          className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-8 max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Unable to Access Camera</h3>
              <p className="text-gray-300 mb-6">{error}</p>
            </div>
            <>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                  Retry ({retryCount})
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-white text-black px-6 py-3 rounded-lg"
                >
                  Close
                </button>
              </div>
            </>
          </div>
        ) : capturedPhoto ? (
          <img
            src={capturedPhoto}
            alt="Captured photo"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-w-full max-h-full object-cover"
            />
            {!isVideoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-sm">Loading camera...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center">
        {capturedPhoto ? (
          <button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Confirm
          </button>
        ) : (
          <button
            onClick={handleCapture}
            disabled={!isVideoReady}
            className={`bg-white hover:bg-gray-100 rounded-full p-6 transition-colors shadow-lg ${
              !isVideoReady ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Camera className="w-8 h-8 text-black" />
          </button>
        )}
      </div>
    </div>
  );
}