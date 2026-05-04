import { useEffect, useRef, useState } from 'react';
import { Location } from '../App';
import AMapLoader from '@amap/amap-jsapi-loader';

interface AMapViewProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

export function AMapView({ locations, onLocationSelect }: AMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 西交利物浦大学坐标（苏州工业园区）
  const xjtluCenter: [number, number] = [120.735, 31.264];
  
  // 从环境变量获取API密钥
  const amapKey = import.meta.env.VITE_AMAP_KEY || '76098a9a85a43e2dd84ade8475cec962';
  const securityCode = import.meta.env.VITE_AMAP_SECURITY_CODE || '84ce068129c5ca6c297cf65918adf524';

  useEffect(() => {
    if (!mapContainerRef.current || mapLoaded) return;

    console.log('开始加载高德地图...');

    // 动态加载高德地图API
    const loadAMap = async () => {
      let AMap: any = null;
      let map: any = null;
      
      try {
        // 根据文档要求：必须在加载前配置安全密钥
        console.log('配置安全密钥...');
        (window as any)._AMapSecurityConfig = {
          securityJsCode: securityCode,
        };

        console.log('安全密钥配置完成:', (window as any)._AMapSecurityConfig);

        // 使用官方AMapLoader加载地图
        console.log('开始加载AMapLoader...');
        AMap = await AMapLoader.load({
          key: amapKey,
          version: '2.0',
          plugins: [] // 不加载插件，只保留基础地图
        });

        console.log('AMapLoader加载成功:', AMap);

        // 设置应用标识（必须步骤）
        AMap.getConfig().appname = 'amap-jsapi-skill';

        // 初始化地图 - 使用字符串ID而不是DOM引用
        console.log('开始初始化地图实例...');
        console.log('容器ID:', mapContainerRef.current.id || '未设置ID');
        
        // 确保容器有ID
        if (!mapContainerRef.current.id) {
          mapContainerRef.current.id = 'amap-container';
        }
        
        map = new AMap.Map('amap-container', {
          viewMode: '2D', // 使用2D模式，更简单
          zoom: 17,
          center: xjtluCenter,
          mapStyle: 'amap://styles/normal'
        });

        console.log('地图实例创建成功:', map);
        
        // 监听地图加载完成事件（文档推荐）
        map.on('complete', () => {
          console.log('地图加载完成事件触发');
          setMapLoaded(true);
        });
        
        // 备用：如果complete事件不触发，设置超时
        setTimeout(() => {
          if (!mapLoaded) {
            console.log('地图加载超时，强制设置加载状态');
            setMapLoaded(true);
          }
        }, 3000);

        mapRef.current = map;

      } catch (error) {
        console.error('加载高德地图失败:', error);
        
        // 清理资源
        try {
          if (map) {
            map.destroy();
          }
        } catch (destroyError) {
          console.error('清理地图实例失败:', destroyError);
        }
        
        // 设置错误状态
        setMapLoaded(false);
      }
    };

    loadAMap();

    return () => {
      console.log('清理地图实例...');
      // 清理地图实例
      try {
        if (mapRef.current) {
          mapRef.current.destroy();
          mapRef.current = null;
        }
      } catch (error) {
        console.error('清理地图实例时发生错误:', error);
      }
    };
  }, [mapLoaded]);

  return (
    <div className="h-full w-full">
      {/* 高德地图容器 - 最简单的样式 */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '500px',
          backgroundColor: '#f0f0f0'
        }}
      />
      
      {/* 加载状态 */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载高德地图...</p>
          </div>
        </div>
      )}
      
      {/* 调试信息 */}
      {mapLoaded && (
        <div className="absolute top-4 left-4 bg-green-500/90 rounded-lg px-3 py-2 text-white text-xs">
          地图加载成功
        </div>
      )}
    </div>
  );
}