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

// 校园地图边界坐标（示例值，需要根据实际地图调整）
const CAMPUS_BOUNDS = {
  north: 31.285,
  south: 31.275,
  east: 120.745,
  west: 120.735
};

// 将经纬度坐标转换为地图上的像素坐标
const convertToMapCoordinates = (lat: number, lng: number) => {
  // 简单的线性映射，需要根据实际地图尺寸和坐标范围调整
  const x = ((lng - CAMPUS_BOUNDS.west) / (CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west)) * 1000;
  const y = ((CAMPUS_BOUNDS.north - lat) / (CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south)) * 1000;
  return { x, y };
};

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

  // 计算地图上的位置
  const mapPosition = position ? convertToMapCoordinates(position.latitude, position.longitude) : null;

  return (
    <div className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Crosshair className="w-4 h-4" />
          Real-time Location
        </h3>
        <div className="flex items-center gap-2">
          {isTracking ? (
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Tracking</span>
            </div>
          ) : (
            <span className="text-xs text-gray-500">Inactive</span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {position && (
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Latitude:</span>
            <span className="font-mono">{position.latitude.toFixed(6)}</span>
          </div>
          <div className="flex justify-between">
            <span>Longitude:</span>
            <span className="font-mono">{position.longitude.toFixed(6)}</span>
          </div>
          {showAccuracy && (
            <div className="flex justify-between">
              <span>Accuracy:</span>
              <span className="font-mono">±{accuracyRadius.toFixed(1)}m</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Start Tracking
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Stop Tracking
          </button>
        )}
      </div>

      {/* 在地图上显示位置标记 */}
      {mapPosition && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: `${mapPosition.x}px`,
            top: `${mapPosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            {/* 精度范围圆环 */}
            {showAccuracy && accuracyRadius > 0 && (
              <div
                className="absolute border-2 border-blue-300/50 rounded-full bg-blue-100/20"
                style={{
                  width: `${Math.max(accuracyRadius * 0.5, 20)}px`,
                  height: `${Math.max(accuracyRadius * 0.5, 20)}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}
            
            {/* 位置标记 - 红色圆点 */}
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
}