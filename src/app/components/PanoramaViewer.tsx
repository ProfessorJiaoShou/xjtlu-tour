import { useEffect, useRef, useState } from 'react';
import { X, Navigation, ImageOff, RefreshCw, ZoomIn, ZoomOut, RotateCw, Smartphone } from 'lucide-react';
import { Viewer } from '@photo-sphere-viewer/core';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';
import '@photo-sphere-viewer/core/index.css';

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

  // 检查设备是否支持陀螺仪
  useEffect(() => {
    // 强制显示陀螺仪按钮
    setShowGyroButton(true);
  }, []);

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
        const plugins: any[] = [];
        
        if (GyroscopePlugin) {
          // 创建陀螺仪插件实例并配置选项
          const gyroPlugin = new GyroscopePlugin({
            touchmove: true,      // 允许水平移动
            roll: true,           // 应用相机滚动
            absolutePosition: false, // 使用相对位置
            moveMode: 'smooth'   // 平滑移动
          });
          plugins.push(gyroPlugin);
          console.log('✅ Gyroscope plugin configured and added');
        } else {
          console.warn('⚠️ Gyroscope plugin not available, continuing without it');
        }

        const viewer = new Viewer({
          container: containerRef.current,
          panorama: panoramaUrl,
          caption: locationName,
          defaultZoomLvl: 50,
          mousewheel: true,
          navbar: [
            'zoom',
            'move',
            'fullscreen'
          ],
          plugins: [
            GyroscopePlugin,
          ],
        });

        viewerRef.current = viewer;

        viewer.addEventListener('ready', () => {
          console.log('Panorama viewer ready');
          setLoading(false);
          setError(null);
        });

        viewer.addEventListener('error', (e: any) => {
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

    const gyroPlugin = viewerRef.current.getPlugin(GyroscopePlugin);
    if (!gyroPlugin) {
      setError('Gyroscope plugin not available');
      return;
    }

    if (gyroEnabled) {
      try {
        gyroPlugin.stop();
        setGyroEnabled(false);
      } catch (err) {
        console.error('Failed to disable gyroscope:', err);
      }
    } else {
      try {
        // 检查设备是否支持陀螺仪
        if (typeof DeviceOrientationEvent !== 'undefined') {
          // iOS 13+ 需要请求权限
          if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
              const permission = await (DeviceOrientationEvent as any).requestPermission();
              if (permission === 'granted') {
                gyroPlugin.start();
                setGyroEnabled(true);
              } else {
                setError('Gyroscope permission denied. Please allow access in your device settings.');
              }
            } catch (err) {
              console.error('Permission request failed:', err);
              setError('Failed to request gyroscope permission. Please check device settings.');
            }
          } else {
            // Android和其他设备直接启用
            gyroPlugin.start();
            setGyroEnabled(true);
          }
        } else {
          setError('Your device does not support gyroscope or is not a mobile device.');
        }
      } catch (err) {
        console.error('Failed to enable gyroscope:', err);
        setError('Unable to enable gyroscope. Please ensure your device supports it and permission is granted.');
      }
    }
  };

  const handleZoomIn = () => {
    if (viewerRef.current) {
      const currentZoom = viewerRef.current.getZoomLevel();
      const newZoom = Math.min(100, currentZoom + 10);
      viewerRef.current.zoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      const currentZoom = viewerRef.current.getZoomLevel();
      const newZoom = Math.max(0, currentZoom - 10);
      viewerRef.current.zoom(newZoom);
    }
  };

  const handleReset = () => {
    if (viewerRef.current) {
      // 使用正确的API重置视角
      viewerRef.current.zoom(50); // 重置缩放
      viewerRef.current.reset(); // 使用内置的reset方法
    }
  };

  const getZoomPercentage = () => {
    if (viewerRef.current) {
      const zoom = viewerRef.current.getZoomLevel();
      return Math.max(0, Math.min(100, Math.round(zoom)));
    }
    return 50; // 默认返回50%
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
          {gyroEnabled ? 'Gyroscope enabled - Move device to explore' : 'Drag to rotate · Scroll to zoom · Gyroscope for mobile'}
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