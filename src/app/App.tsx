import { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LocationDetail } from './components/LocationDetail';
import { TourProgress } from './components/TourProgress';
import { PanoramaViewer } from './components/PanoramaViewer';
import { AMapView } from './components/AMapView';
import { CameraCapture } from './components/CameraCapture';
import { PhotoAlbum } from './components/PhotoAlbum';
import { CheckInSuccess } from './components/CheckInSuccess';

import pano1 from '../imports/panoramas/1.JPG';
import pano3 from '../imports/panoramas/3.JPG';
import pano6 from '../imports/panoramas/6.JPG';
import pano11 from '../imports/panoramas/11.JPG';




export type Location = {
  id: string;
  name: string;
  category: 'academic' | 'facility' | 'landmark' | 'recreation';
  description: string;
  funFact: string;
  image: string;
  coordinates: { x: number; y: number };
  visited: boolean;
  points: number;
  photos?: string[];
  userPhoto?: string;
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [panoramaLocation, setPanoramaLocation] = useState<Location | null>(null);
  const [checkInSuccessLocation, setCheckInSuccessLocation] = useState<Location | null>(null);
  const [cameraLocation, setCameraLocation] = useState<Location | null>(null);
  const [showPhotoAlbum, setShowPhotoAlbum] = useState(false);
  const [showCompletionAlbum, setShowCompletionAlbum] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [mapMode, setMapMode] = useState<'custom' | 'amap'>('custom'); // 地图模式：custom-自定义地图，amap-高德地图

  const toggleMapMode = () => {
    setMapMode(prev => prev === 'custom' ? 'amap' : 'custom');
  };
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Central Building (CB)',
      category: 'academic',
      description: 'The iconic main building of XJTLU, housing administrative offices and the main reception area.',
      funFact: 'The Central Building was the first structure built on campus in 2006!',
      image: '🏛️',
      coordinates: { x: 48, y: 42 },
      visited: false,
      points: 10,
      photos: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800'
      ]
    },
    {
      id: '2',
      name: 'Library',
      category: 'academic',
      description: 'Modern academic library with extensive collections, study spaces, and 24/7 access during exams.',
      funFact: 'The library holds over 400,000 books and provides access to millions of digital resources!',
      image: '📚',
      coordinates: { x: 30, y: 35 },
      visited: false,
      points: 15,
      photos: [
        'https://images.unsplash.com/photo-1568667256549-094345857637?w=800',
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800'
      ]
    },
    {
      id: '3',
      name: 'Foundation Building (FB)',
      category: 'academic',
      description: 'Home to foundation year programs and language learning facilities.',
      funFact: 'Every XJTLU student starts their journey with foundation courses here!',
      image: '📖',
      coordinates: { x: 42, y: 32 },
      visited: false,
      points: 10
    },
    {
      id: '4',
      name: 'South Campus Sports Field',
      category: 'recreation',
      description: 'Professional sports complex with football field, running track, and basketball courts.',
      funFact: 'The track hosts inter-university competitions throughout the year!',
      image: '⚽',
      coordinates: { x: 75, y: 75 },
      visited: false,
      points: 10
    },
    {
      id: '5',
      name: 'South Campus Lake',
      category: 'landmark',
      description: 'Beautiful scenic lake in the heart of South Campus, perfect for relaxation and photography.',
      funFact: 'The lake features a unique circular design with bridges and walking paths!',
      image: '🌊',
      coordinates: { x: 50, y: 75 },
      visited: false,
      points: 5
    },
    {
      id: '6',
      name: 'Dining Hall',
      category: 'facility',
      description: 'Multiple dining options including Chinese, Western, Japanese, and Korean cuisine.',
      funFact: 'Serves over 10,000 meals daily across multiple restaurants and cafes!',
      image: '🍜',
      coordinates: { x: 52, y: 48 },
      visited: false,
      points: 5
    },
    {
      id: '7',
      name: 'Engineering Building (EB)',
      category: 'academic',
      description: 'State-of-the-art engineering labs with robotics, electronics, and mechanical workshops.',
      funFact: 'Home to advanced 3D printers, laser cutters, and CNC machines available to all students!',
      image: '⚙️',
      coordinates: { x: 58, y: 52 },
      visited: false,
      points: 15
    },
    {
      id: '8',
      name: 'Business School (BS)',
      category: 'academic',
      description: 'Modern business school with lecture halls, seminar rooms, and innovation spaces.',
      funFact: 'Hosts regular talks from international business leaders and entrepreneurs!',
      image: '💼',
      coordinates: { x: 62, y: 58 },
      visited: false,
      points: 10
    },
    {
      id: '9',
      name: 'International Building (IB)',
      category: 'academic',
      description: 'Hub for international programs, language centers, and cultural exchange activities.',
      funFact: 'Over 80 nationalities are represented in student programs here!',
      image: '🌍',
      coordinates: { x: 46, y: 38 },
      visited: false,
      points: 10
    },
    {
      id: '10',
      name: 'Life Sciences Building (LS)',
      category: 'academic',
      description: 'Advanced biology and chemistry labs for cutting-edge research and teaching.',
      funFact: 'Features specialized equipment for genetic research and molecular biology!',
      image: '🔬',
      coordinates: { x: 22, y: 28 },
      visited: false,
      points: 15
    },
    {
      id: '11',
      name: 'Mathematics Building (MA)',
      category: 'academic',
      description: 'Dedicated space for mathematical sciences with computer labs and study areas.',
      funFact: 'Houses one of the largest collections of mathematical texts in Suzhou!',
      image: '🔢',
      coordinates: { x: 56, y: 62 },
      visited: false,
      points: 10
    },
    {
      id: '12',
      name: 'Academy Building (AG)',
      category: 'academic',
      description: 'Multi-purpose academic building with modern classrooms and collaborative spaces.',
      funFact: 'Features flexible learning spaces that can be reconfigured for different teaching styles!',
      image: '🎓',
      coordinates: { x: 68, y: 38 },
      visited: false,
      points: 10
    }
  ]);

  const handleLocationVisit = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location && !location.visited) {
      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          setTotalPoints(points => points + loc.points);
          return { ...loc, visited: true };
        }
        return loc;
      }));
      setCheckInSuccessLocation(location);
      setSelectedLocation(null);
    }
  };

  const handleCameraCapture = (photoData: string) => {
    if (cameraLocation) {
      setLocations(prev => prev.map(loc => {
        if (loc.id === cameraLocation.id) {
          return { ...loc, userPhoto: photoData };
        }
        return loc;
      }));
      setCameraLocation(null);
    }
  };

  const handleCloseCheckInSuccess = () => {
    setCheckInSuccessLocation(null);
  };

  const handleOpenCameraFromSuccess = () => {
    if (checkInSuccessLocation) {
      setCameraLocation(checkInSuccessLocation);
      setCheckInSuccessLocation(null);
    }
  };

  const handleCloseCamera = () => {
    setCameraLocation(null);
  };

  const handleOpenPhotoAlbum = () => {
    setShowPhotoAlbum(true);
  };

  const handleClosePhotoAlbum = () => {
    setShowPhotoAlbum(false);
  };

  const handleOpenCompletionAlbum = () => {
    setShowCompletionAlbum(true);
  };

  const handleCloseCompletionAlbum = () => {
    setShowCompletionAlbum(false);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCloseDetail = () => {
    setSelectedLocation(null);
  };

  const handleViewPanorama = (location: Location) => {
    setPanoramaLocation(location);
    setSelectedLocation(null);
  };

  const handleClosePanorama = () => {
    setPanoramaLocation(null);
  };

  useEffect(() => {
    const allVisited = locations.every(loc => loc.visited && loc.userPhoto);
    if (allVisited && !showCompletionAlbum) {     handleOpenCompletionAlbum();
    }
  }, [locations]);

  const getPanoramaUrl = (locationId: string) => {
    const panoramaMap: Record<string, string> = {
      '1': pano1,
      '3':pano3,
      '6':pano6,
      '11':pano11,
    };
    return panoramaMap[locationId] || '';
  };

  const visitedCount = locations.filter(loc => loc.visited).length;
  const totalLocations = locations.length;

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="h-screen w-full bg-gradient-to-b from-blue-50 to-white flex flex-col relative overflow-hidden">
      <TourProgress
        visitedCount={visitedCount}
        totalCount={totalLocations}
        points={totalPoints}
        mapMode={mapMode}
        onToggleMapMode={toggleMapMode}
        onOpenPhotoAlbum={handleOpenPhotoAlbum}
        hasUserPhotos={locations.some(loc => loc.userPhoto)}
      />

      <div className="flex-1 overflow-hidden">
        {mapMode === 'custom' ? (
          <MapView
            locations={locations}
            onLocationSelect={handleLocationSelect}
          />
        ) : (
          <AMapView
            locations={locations}
            onLocationSelect={handleLocationSelect}
          />
        )}
      </div>

      {selectedLocation && (
        <LocationDetail
          location={selectedLocation}
          onClose={handleCloseDetail}
          onVisit={handleLocationVisit}
          onViewPanorama={handleViewPanorama}
        />
      )}

      {panoramaLocation && (
        <PanoramaViewer
          panoramaUrl={getPanoramaUrl(panoramaLocation.id)}
          locationName={panoramaLocation.name}
          onClose={handleClosePanorama}
        />
      )}

      {checkInSuccessLocation && (
        <CheckInSuccess
          location={checkInSuccessLocation}
          onClose={handleCloseCheckInSuccess}
          onTakePhoto={handleOpenCameraFromSuccess}
        />
      )}

      {cameraLocation && (
        <CameraCapture
          locationName={cameraLocation.name}
          onCapture={handleCameraCapture}
          onClose={handleCloseCamera}
        />
      )}

      {showPhotoAlbum && (
        <PhotoAlbum
          locations={locations}
          onClose={handleClosePhotoAlbum}
        />
      )}

      {showCompletionAlbum && (
        <PhotoAlbum
          locations={locations}
          onClose={handleCloseCompletionAlbum}
          isCompletion={true}
        />
      )}
    </div>
  );
}