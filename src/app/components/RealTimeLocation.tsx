import { useState, useEffect, useRef } from 'react';
import { Navigation, Crosshair } from 'lucide-react';

interface RealTimeLocationProps {
  onLocationUpdate?: (position: { latitude: number; longitude: number; accuracy: number }) => void;
  showAccuracy?: boolean;
}

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

// 坐标转换函数在MapView.tsx中定义

export function RealTimeLocation({ onLocationUpdate, showAccuracy = true }: RealTimeLocationProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string>('');
  const [accuracyRadius, setAccuracyRadius] = useState(0);
  const watchIdRef = useRef<number | null>(null);

  // 清理位置监听
  const cleanupWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // 开始位置追踪
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('浏览器不支持地理位置服务');
      return;
    }

    setError('');
    setIsTracking(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    // 获取当前位置
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        };
        setPosition(newPosition);
        setAccuracyRadius(pos.coords.accuracy);
        onLocationUpdate?.(newPosition);
      },
      (err) => {
        setError(`获取位置失败: ${err.message}`);
        setIsTracking(false);
      },
      options
    );

    // 开始持续追踪
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        };
        setPosition(newPosition);
        setAccuracyRadius(pos.coords.accuracy);
        onLocationUpdate?.(newPosition);
      },
      (err) => {
        setError(`位置追踪失败: ${err.message}`);
      },
      options
    );
  };

  // 停止位置追踪
  const stopTracking = () => {
    cleanupWatch();
    setIsTracking(false);
    setError('');
  };

  // 组件卸载时清理
  useEffect(() => {
    return cleanupWatch;
  }, []);

  // 计算地图上的位置（由MapView组件处理）
  // 位置标记已集成到MapView的SVG系统中

  return (
    <div className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 min-w-48">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Crosshair className="w-3 h-3" />
          <span className="text-sm">Location</span>
        </h3>
        <div className="flex items-center gap-1">
          {isTracking ? (
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Active</span>
            </div>
          ) : (
            <span className="text-xs text-gray-500">Inactive</span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-1.5 mb-2">
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}

      {position && (
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Lat:</span>
            <span className="font-mono">{position.latitude.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span>Lng:</span>
            <span className="font-mono">{position.longitude.toFixed(4)}</span>
          </div>
          {showAccuracy && (
            <div className="flex justify-between">
              <span>Acc:</span>
              <span className="font-mono">±{accuracyRadius.toFixed(0)}m</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-1.5 mt-2">
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Navigation className="w-3 h-3" />
            Start
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors"
          >
            Stop
          </button>
        )}
      </div>

      {/* 位置标记已集成到MapView组件的SVG系统中 */}
    </div>
  );
}