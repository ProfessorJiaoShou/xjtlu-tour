import { useEffect, useRef, useState } from 'react';
import { Location } from '../App';

declare global {
  interface Window {
    AMapLoader: any;
    AMap: any;
  }
}

interface AMapViewProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

export function AMapView({ locations, onLocationSelect }: AMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // 西交利物浦大学坐标（苏州工业园区）
  const xjtluCenter: [number, number] = [120.735, 31.264];

  useEffect(() => {
    if (!mapContainerRef.current || mapLoaded) return;

    console.log('开始初始化高德地图...');
    console.log('AMapLoader对象是否存在:', window.AMapLoader);
    
    // 确保容器有明确的样式和ID
    const initMap = () => {
      try {
        // 检查AMapLoader是否已加载
        if (!window.AMapLoader) {
          setMapError('高德地图API未加载，请检查网络连接');
          return;
        }

        console.log('AMapLoader对象已加载:', window.AMapLoader);

        // 确保容器存在
        if (!mapContainerRef.current) {
          setMapError('地图容器未找到');
          return;
        }

        // 设置容器样式，确保可见
        mapContainerRef.current.style.width = '100%';
        mapContainerRef.current.style.height = '100%';
        mapContainerRef.current.style.minHeight = '500px';
        mapContainerRef.current.style.backgroundColor = '#f0f0f0';

        // 生成唯一容器ID
        const containerId = `amap-container-${Date.now()}`;
        mapContainerRef.current.id = containerId;

        console.log('容器ID:', containerId);
        console.log('容器元素:', mapContainerRef.current);
        console.log('容器样式:', mapContainerRef.current.style);

        // 等待容器完全渲染
        setTimeout(() => {
          // 检查容器是否在DOM中
          const containerElement = document.getElementById(containerId);
          if (!containerElement) {
            setMapError('地图容器未挂载到DOM');
            return;
          }

          console.log('容器已找到:', containerElement);
          console.log('容器尺寸:', containerElement.offsetWidth, 'x', containerElement.offsetHeight);

          // 使用AMapLoader.load加载地图
          window.AMapLoader.load({
            key: '76098a9a85a43e2dd84ade8475cec962',
            version: '2.0',
            plugins: ['AMap.Scale', 'AMap.ToolBar']
          }).then((AMap: any) => {
            console.log('AMapLoader加载成功:', AMap);

            // 再次检查容器是否存在
            const currentContainer = document.getElementById(containerId);
            if (!currentContainer) {
              setMapError('地图容器在API加载过程中丢失');
              return;
            }

            console.log('容器再次检查通过');

            // 设置应用标识（强制要求）
            if (AMap.getConfig) {
              AMap.getConfig().appname = 'amap-jsapi-skill';
              console.log('✅ 应用标识已设置');
            }

            // 创建地图实例 - 使用更简单的配置
            try {
              const map = new AMap.Map(containerId, {
                viewMode: '2D', // 使用2D模式更稳定
                zoom: 17,
                center: xjtluCenter
              });

              console.log('地图实例创建成功:', map);

              // 添加比例尺控件
              map.addControl(new AMap.Scale());
              
              // 添加工具栏控件
              map.addControl(new AMap.ToolBar());

              // 监听地图加载完成
              map.on('complete', () => {
                console.log('✅ 地图加载完成');
                setMapLoaded(true);
                setMapError(null);
              });

              // 监听地图加载错误
              map.on('error', (error: any) => {
                console.error('❌ 地图加载错误:', error);
                setMapError('地图加载失败: ' + error.message);
              });

              mapRef.current = map;

            } catch (mapError: any) {
              console.error('❌ 地图实例创建失败:', mapError);
              setMapError('地图实例创建失败: ' + mapError.message);
            }

          }).catch((e: any) => {
            console.error('❌ AMapLoader加载失败:', e);
            setMapError('AMapLoader加载失败: ' + e.message);
          });

        }, 200); // 等待容器渲染完成

      } catch (error: any) {
        console.error('❌ 初始化地图失败:', error);
        setMapError('初始化地图失败: ' + error.message);
      }
    };

    // 延迟初始化，确保DOM完全加载
    setTimeout(initMap, 300);

    return () => {
      console.log('清理地图实例...');
      if (mapRef.current) {
        try {
          mapRef.current.destroy();
          mapRef.current = null;
        } catch (error) {
          console.error('清理地图实例时发生错误:', error);
        }
      }
    };
  }, [mapLoaded]);

  // 检查AMapLoader是否加载的独立效果
  useEffect(() => {
    const checkAMapLoaderLoaded = () => {
      if (window.AMapLoader) {
        console.log('✅ AMapLoader已加载');
      } else {
        console.log('❌ AMapLoader未加载');
        setTimeout(checkAMapLoaderLoaded, 1000);
      }
    };

    checkAMapLoaderLoaded();
  }, []);

  return (
    <div className="h-full w-full relative">
      {/* 高德地图容器 - 使用更简单的样式 */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
      />
      
      {/* 加载状态 */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载高德地图...</p>
            <p className="text-gray-400 text-sm mt-2">AMapLoader状态: {window.AMapLoader ? '✅ 已加载' : '❌ 未加载'}</p>
          </div>
        </div>
      )}
      
      {/* 错误状态 */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/80">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <p className="text-red-600 font-medium">地图加载失败</p>
            <p className="text-red-500 text-sm mt-2">{mapError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              刷新页面重试
            </button>
          </div>
        </div>
      )}
      
      {/* 调试信息 */}
      {mapLoaded && (
        <div className="absolute top-4 left-4 bg-green-500/90 rounded-lg px-3 py-2 text-white text-xs">
          ✅ 地图加载成功
        </div>
      )}
      
      {/* AMapLoader状态指示器 */}
      <div className="absolute top-4 right-4 bg-blue-500/90 rounded-lg px-3 py-2 text-white text-xs">
        AMapLoader: {window.AMapLoader ? '✅' : '❌'}
      </div>
    </div>
  );
}