import { useState } from 'react';
import { Location } from '../App';
import { Navigation, Info, ZoomIn, ZoomOut, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import campusMapImage from '../../imports/xjtlu.png';

interface MapViewProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
};

// 📍 Button position configuration - Modify each button's position and size here
// Coordinate range: left: 0-100%, top: 0-100%
// Size range: size: 0.5-3.0 (1.0 is default size)
const buttonPositions: Record<string, { left: number; top: number; size: number }> = {
  '1': { left: 42, top: 55.5, size: 0.5 },   // Central Building (CB)
  '2': { left: 55, top: 45, size: 0.5},   // Xi'an Jiaotong-university research institute (XJRI)
  '3': { left: 41, top: 46, size: 0.5 },   // Foundation Building (FB)
  '4': { left: 72, top: 68, size: 0.5 },   // South Campus Sports Field
  '5': { left: 57, top: 70, size: 0.5 },   // South Campus Lake
  '6': { left: 63, top: 55, size: 0.3 },   // Dining Hall
  '7': { left: 70, top: 58, size: 0.5 },   // Engineering Building (EB)
  '8': { left: 52, top: 71, size: 0.5 },   // Business School (BS)
  '9': { left: 45, top: 25, size: 0.5 },   // Living Area (LA)  
  '10': { left: 30, top: 36, size: 0.5 },  // Life Sciences Building (LS)
  '11': { left: 70, top: 50, size: 0.5 },  // Mathematics Building (MA)
  '12': { left: 58, top: 75, size: 0.5 },  // Environmental Science Building (ES)
};

export function MapView({ locations, onLocationSelect }: MapViewProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(true);
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    setScale(newScale);
  };
  
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
      <div 
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
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
        <img
          src={campusMapImage}
          alt="XJTLU Campus Map"
          className="w-full h-full object-contain"
        />
        
        <div className="absolute inset-0 p-4 pt-12 pb-4">
          {locations.map((location) => {
            const buttonPos = buttonPositions[location.id] || { left: 50, top: 50, size: 1.0 };
            const buttonSize = buttonPos.size || 1.0;
            const baseSize = 48;
            const scaledSize = baseSize * buttonSize;
            const iconSize = Math.round(24 * buttonSize);
            const pulseSize = Math.round(64 * buttonSize);
            const checkSize = Math.round(24 * buttonSize);
            const checkFontSize = Math.round(14 * buttonSize);
            
            return (
              <button
                key={location.id}
                onClick={() => onLocationSelect(location)}
                className="absolute cursor-pointer transition-all hover:scale-110 active:scale-95"
                style={{
                  left: `${buttonPos.left}%`,
                  top: `${buttonPos.top}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${scaledSize}px`,
                  height: `${scaledSize}px`
                }}
              >
                {location.visited && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="rounded-full bg-green-500/30 animate-pulse" 
                      style={{
                        width: `${pulseSize}px`,
                        height: `${pulseSize}px`
                      }}
                    />
                  </div>
                )}
                <div 
                  className="relative rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  style={{
                    borderWidth: `${Math.round(4 * buttonSize)}px`
                  }}
                >
                  <span 
                    style={{
                      fontSize: `${iconSize}px`
                    }}
                  >
                    {location.image}
                  </span>
                </div>
                {location.visited && (
                  <div 
                    className="absolute bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                    style={{
                      top: `-${Math.round(4 * buttonSize)}px`,
                      right: `-${Math.round(4 * buttonSize)}px`,
                      width: `${checkSize}px`,
                      height: `${checkSize}px`,
                      fontSize: `${checkFontSize}px`
                    }}
                  >
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
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