import { useState, useRef, useEffect } from 'react';
import { Location } from '../App';
import { Navigation, Info, ZoomIn, ZoomOut, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import campusMapImage from '../../imports/xjtlu.png';
import { RealTimeLocation } from './RealTimeLocation';

interface MapViewProps {
  locations: Location[];// 位置数据列表
  onLocationSelect: (location: Location) => void;// 选择位置回调函数
  showRealTimeLocation?: boolean;// 是否显示实时位置功能
};//地图属性接口

// 📍 SVG按钮位置配置 - 使用SVG坐标系统
// 坐标范围: x: 0-1000, y: 0-1000 (SVG视口坐标系)
const buttonPositions: Record<string, { x: number; y: number; size: number }> = {
  '1': { x: 420, y: 555, size: 20 },   // 中心大楼 (CB)
  '2': { x: 500, y: 700, size: 20 },   // AS building (AS)
  '3': { x: 410, y: 460, size: 20 },   // 基础教学楼 (FB)
  '4': { x: 720, y: 750, size: 20 },   // 南校区运动场
  '5': { x: 570, y: 790, size: 20 },   // 南校区湖泊
  '6': { x: 630, y: 550, size: 15 },   // 食堂
  '7': { x: 700, y: 580, size: 20 },   // 工程大楼 (EB)
  '8': { x: 520, y: 800, size: 20 },   // 商学院 (BS)
  '9': { x: 525, y: 555, size: 20 },   // science building 
  '10': { x: 300, y: 300, size: 20 },  // 生命科学大楼 (LS)
  '11': { x: 700, y: 500, size: 20 },  // 数学大楼 (MA)
  '12': { x: 580, y: 900, size: 20 },  // 环境科学大楼 (ES)
};

// 校园地图边界坐标（示例值，需要根据实际地图调整）
// 苏州西交利物浦大学的大致坐标范围
const CAMPUS_BOUNDS = {
  north: 31.281614119049036,
  south: 31.27534623859844,
  east: 120.74501235711083,
  west: 120.72424536239407
};

// 将经纬度坐标转换为地图上的像素坐标
const convertToMapCoordinates = (lat: number, lng: number) => {
  // 简单的线性映射，需要根据实际地图尺寸和坐标范围调整
  const x = ((lng - CAMPUS_BOUNDS.west) / (CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west)) * 1000;
  const y = ((CAMPUS_BOUNDS.north - lat) / (CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south)) * 1000;
  
  // 调试信息
  console.log('Converting coordinates:', { lat, lng, x, y });
  
  return { x, y };
};

export function MapView({ locations, onLocationSelect, showRealTimeLocation = true }: MapViewProps) {// 地图组件
  const [scale, setScale] = useState(1);// 缩放比例
  const [position, setPosition] = useState({ x: 0, y: 0 });// 地图位置
  const [isDragging, setIsDragging] = useState(false);// 是否正在拖动
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });//拖拽开始位置
  const [showInfo, setShowInfo] = useState(true);// 是否显示信息
  const [userPosition, setUserPosition] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [debugMode, setDebugMode] = useState(false);// 调试模式开关
  
  // 调试：检查userPosition状态
  useEffect(() => {
    console.log('userPosition updated:', userPosition);
  }, [userPosition]);
  
  // 调试：检查userPosition状态
  useEffect(() => {
    console.log('userPosition updated:', userPosition);
  }, [userPosition]);
  
  // 使用ref来引用SVG容器
  const svgContainerRef = useRef<HTMLDivElement>(null);
  
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.3, Math.min(5, scale + delta));
    setScale(newScale);
  };
  
  // 使用useEffect添加事件监听器，避免被动事件监听器问题
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [scale]); // 依赖scale，确保使用最新的scale值
  
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

  // 处理位置更新
  const handleLocationUpdate = (position: { latitude: number; longitude: number; accuracy: number }) => {
    console.log('Location update received:', position);
    setUserPosition(position);
  };
  
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <div className="h-full w-full relative bg-white overflow-hidden">
      {/* 实时位置组件 */}
      {showRealTimeLocation && (
        <RealTimeLocation 
          onLocationUpdate={handleLocationUpdate}
          showAccuracy={true}
        />
      )}
      {/* 地图容器 - 使用图片背景和SVG按钮 */}
      <div 
        ref={svgContainerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {/* 校园地图图片背景 */}
        <img
          src={campusMapImage}
          alt="XJTLU Campus Map"
          className="w-full h-full object-contain"
        />
        
        {/* SVG按钮层 - 在图片上方叠加SVG按钮 */}
        <svg 
          viewBox="0 0 1000 1000" 
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 地点标记按钮 - 使用SVG确保按钮与地图同步缩放 */}
          {locations.filter(loc => loc.visible).map((location) => {
            const buttonPos = buttonPositions[location.id] || { x: 500, y: 500, size: 20 };
            const radius = buttonPos.size;
            
            return (
              <g key={location.id} onClick={() => onLocationSelect(location)} className="cursor-pointer pointer-events-auto">
                {/* 已访问地点的脉冲动画效果 */}
                {location.visited && (
                  <circle 
                    cx={buttonPos.x} 
                    cy={buttonPos.y} 
                    r={radius * 1.5} 
                    fill="#22c55e" 
                    fillOpacity="0.3"
                    className="animate-pulse"
                  />
                )}
                
                {/* 主按钮圆形 */}
                <circle 
                  cx={buttonPos.x} 
                  cy={buttonPos.y} 
                  r={radius} 
                  fill={location.visited ? "#22c55e" : "#3b82f6"} 
                  stroke="white" 
                  strokeWidth="3"
                  className="hover:fill-opacity-80 transition-all"
                />
                
                {/* 地点图标 */}
                <text 
                  x={buttonPos.x} 
                  y={buttonPos.y + radius * 0.3} 
                  textAnchor="middle" 
                  fill="white" 
                  fontSize={radius * 0.8}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {location.image}
                </text>
                
                {/* 已访问标记（绿色对勾） */}
                {location.visited && (
                  <text 
                    x={buttonPos.x + radius * 0.6} 
                    y={buttonPos.y - radius * 0.6} 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize={radius * 0.6}
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    ✓
                  </text>
                )}
              </g>
            );
          })}
          
          {/* 实时位置标记 - 集成到SVG系统中 */}
          {userPosition && (
            <g className="pointer-events-none">
              {/* 精度范围圆环 - 修复精度计算 */}
              <circle 
                cx={convertToMapCoordinates(userPosition.latitude, userPosition.longitude).x}
                cy={convertToMapCoordinates(userPosition.latitude, userPosition.longitude).y}
                r={Math.max(userPosition.accuracy * 0.05, 5)} // 调整精度范围比例
                fill="#ef4444"
                fillOpacity="0.2"
                stroke="#ef4444"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              
              {/* 位置标记 - 红色圆点 */}
              <circle 
                cx={convertToMapCoordinates(userPosition.latitude, userPosition.longitude).x}
                cy={convertToMapCoordinates(userPosition.latitude, userPosition.longitude).y}
                r="8"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
              />
              
              {/* 中心白点 */}
              <circle 
                cx={convertToMapCoordinates(userPosition.latitude, userPosition.longitude).x}
                cy={convertToMapCoordinates(userPosition.latitude, userPosition.longitude).y}
                r="2"
                fill="white"
              />
            </g>
          )}
          
          {/* 调试模式：显示边界框 */}
          {debugMode && (
            <g className="pointer-events-none">
              {/* 边界矩形 */}
              <rect
                x="0"
                y="0"
                width="1000"
                height="1000"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="10,5"
              />
              
              {/* 边界标签 */}
              <text x="500" y="20" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">
                Debug Mode - Campus Bounds
              </text>
              <text x="10" y="35" fill="#fbbf24" fontSize="12">
                NW: {CAMPUS_BOUNDS.north.toFixed(6)}, {CAMPUS_BOUNDS.west.toFixed(6)}
              </text>
              <text x="990" y="35" textAnchor="end" fill="#fbbf24" fontSize="12">
                NE: {CAMPUS_BOUNDS.north.toFixed(6)}, {CAMPUS_BOUNDS.east.toFixed(6)}
              </text>
              <text x="10" y="985" fill="#fbbf24" fontSize="12">
                SW: {CAMPUS_BOUNDS.south.toFixed(6)}, {CAMPUS_BOUNDS.west.toFixed(6)}
              </text>
              <text x="990" y="985" textAnchor="end" fill="#fbbf24" fontSize="12">
                SE: {CAMPUS_BOUNDS.south.toFixed(6)}, {CAMPUS_BOUNDS.east.toFixed(6)}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md z-20">
        <div className="flex items-center gap-2 text-xs">
          <Navigation className="w-3 h-3 text-blue-600" />
          <span className="font-semibold">XJTLU Campus Map</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex flex-row gap-1 z-20">
        <button
          onClick={() => setScale(prev => Math.min(3, prev + 0.2))}
          className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}
          className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={resetView}
          className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 text-blue-600" />
        </button>
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-1 shadow-md text-center">
          <span className="text-[10px] font-bold text-blue-600">{Math.round(scale * 100)}%</span>
        </div>
        <button
          onClick={() => setDebugMode(!debugMode)}
          className={`bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors ${debugMode ? 'ring-2 ring-yellow-400' : ''}`}
          title="Toggle Debug Mode"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {debugMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            )}
          </svg>
        </button>
      </div>
      
      {/* 调试模式面板 */}
      {debugMode && (
        <div className="absolute bottom-4 right-4 z-20 bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-yellow-800 text-sm">Debug Mode Active</span>
            <button
              onClick={() => setDebugMode(false)}
              className="text-yellow-600 hover:text-yellow-800 text-xs"
            >
              Close
            </button>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="border-b border-yellow-200 pb-2">
              <span className="font-semibold text-yellow-700">Campus Bounds:</span>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <div>
                  <span className="text-gray-600">North:</span>
                  <span className="ml-1 font-mono">{CAMPUS_BOUNDS.north.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-gray-600">South:</span>
                  <span className="ml-1 font-mono">{CAMPUS_BOUNDS.south.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-gray-600">East:</span>
                  <span className="ml-1 font-mono">{CAMPUS_BOUNDS.east.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-gray-600">West:</span>
                  <span className="ml-1 font-mono">{CAMPUS_BOUNDS.west.toFixed(6)}</span>
                </div>
              </div>
            </div>
            
            <div className="border-b border-yellow-200 pb-2">
              <span className="font-semibold text-yellow-700">User Position:</span>
              {userPosition ? (
                <div className="mt-1 space-y-1">
                  <div>
                    <span className="text-gray-600">Lat:</span>
                    <span className="ml-1 font-mono">{userPosition.latitude.toFixed(6)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Lng:</span>
                    <span className="ml-1 font-mono">{userPosition.longitude.toFixed(6)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Map X:</span>
                    <span className="ml-1 font-mono">{convertToMapCoordinates(userPosition.latitude, userPosition.longitude).x.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Map Y:</span>
                    <span className="ml-1 font-mono">{convertToMapCoordinates(userPosition.latitude, userPosition.longitude).y.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">No position data</span>
              )}
            </div>
            
            <div>
              <span className="font-semibold text-yellow-700">Instructions:</span>
              <ul className="text-gray-600 list-disc list-inside mt-1 space-y-1">
                <li>Adjust bounds in MapView.tsx</li>
                <li>Map X/Y should be 0-1000</li>
                <li>Red dot should appear on map</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-semibold">Instructions</span>
            </div>
            {showInfo ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}
          </button>
          {showInfo && (
            <div className="p-2 border-t border-gray-100">
              <p className="text-[10px] text-gray-600 mb-1">Tap on a location to view details</p>
              <div className="flex gap-2 text-[10px] text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Not Visited
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                  Visited
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}