import { useEffect, useRef, useState } from 'react';
import { Location } from '../App';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface OSMapViewProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

interface UserPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function OSMapView({ locations, onLocationSelect }: OSMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // XJTLU coordinates (Suzhou Industrial Park)
  const xjtluCenter: [number, number] = [31.278, 120.735];

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      // 初始化 Leaflet 地图
      const map = L.map(mapContainerRef.current, {
        center: xjtluCenter,
        zoom: 17,
        zoomControl: true,
      });

      // 添加 OpenStreetMap 图层
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      setMapLoaded(true);
      setMapError(null);

      // 自动开始位置追踪
      startLocationTracking();

    } catch (error: any) {
      console.error('初始化地图失败:', error);
      setMapError('初始化地图失败: ' + error.message);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // 位置追踪功能（自动运行）
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      console.warn('浏览器不支持地理位置服务');
      return;
    }

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
          accuracy: pos.coords.accuracy
        };
        updateUserPositionMarker(newPosition);
      },
      (err) => {
        console.warn('获取位置失败:', err.message);
      },
      options
    );

    // 开始持续追踪
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        updateUserPositionMarker(newPosition);
      },
      (err) => {
        console.warn('位置追踪失败:', err.message);
      },
      options
    );
  };

  // 更新用户位置标记
  const updateUserPositionMarker = (position: UserPosition) => {
    if (!mapRef.current) return;

    // 移除旧的标记和精度圆
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.remove();
    }

    // 创建精度圆
    accuracyCircleRef.current = L.circle([position.latitude, position.longitude], {
      radius: position.accuracy,
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.2,
      weight: 1
    }).addTo(mapRef.current);

    // 创建用户位置标记（简单的红点，不显示按钮）
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `<div style="
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #ef4444;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    userMarkerRef.current = L.marker([position.latitude, position.longitude], { icon: userIcon })
      .addTo(mapRef.current);
  };

  // 不显示地点标记按钮
  // OpenStreetMap 模式下只显示用户位置，不显示地点标记
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // 清除现有标记
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }, [mapLoaded]);

  return (
    <div className="h-full w-full relative">
      {/* OpenStreetMap 容器 */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Loading state */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading OpenStreetMap...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/80 z-10">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <p className="text-red-600 font-medium">Map loading failed</p>
            <p className="text-red-500 text-sm mt-2">{mapError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Refresh to retry
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}