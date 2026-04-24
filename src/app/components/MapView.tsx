import { useState, useRef, useEffect } from 'react';
import { Location } from '../App';
import { Navigation, Info, ZoomIn, ZoomOut, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import campusMapImage from '../../imports/xjtlu.png';

interface MapViewProps {
  locations: Location[];// 位置数据列表
  onLocationSelect: (location: Location) => void;// 选择位置回调函数
};//地图属性接口

// 📍 SVG按钮位置配置 - 使用SVG坐标系统
// 坐标范围: x: 0-1000, y: 0-1000 (SVG视口坐标系)
const buttonPositions: Record<string, { x: number; y: number; size: number }> = {
  '1': { x: 420, y: 555, size: 20 },   // 中心大楼 (CB)
  '2': { x: 550, y: 450, size: 20 },   // 西安交通大学研究院 (XJRI)
  '3': { x: 410, y: 460, size: 20 },   // 基础教学楼 (FB)
  '4': { x: 720, y: 750, size: 20 },   // 南校区运动场
  '5': { x: 570, y: 790, size: 20 },   // 南校区湖泊
  '6': { x: 630, y: 550, size: 15 },   // 食堂
  '7': { x: 700, y: 580, size: 20 },   // 工程大楼 (EB)
  '8': { x: 520, y: 710, size: 20 },   // 商学院 (BS)
  '9': { x: 599, y: 250, size: 20 },   // 生活区 (LA)  
  '10': { x: 300, y: 300, size: 20 },  // 生命科学大楼 (LS)
  '11': { x: 700, y: 500, size: 20 },  // 数学大楼 (MA)
  '12': { x: 580, y: 900, size: 20 },  // 环境科学大楼 (ES)
};

export function MapView({ locations, onLocationSelect }: MapViewProps) {// 地图组件
  const [scale, setScale] = useState(1);// 缩放比例
  const [position, setPosition] = useState({ x: 0, y: 0 });// 地图位置
  const [isDragging, setIsDragging] = useState(false);// 是否正在拖动
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });//拖拽开始位置
  const [showInfo, setShowInfo] = useState(true);// 是否显示信息  
  
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
  
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <div className="h-full w-full relative bg-white overflow-hidden">
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
          {locations.map((location) => {
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
      </div>

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