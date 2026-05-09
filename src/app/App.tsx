import { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { QRCodeExchange } from './components/QRCodeExchange';
import { LocationDetail } from './components/LocationDetail';
import { TourProgress } from './components/TourProgress';
import { PanoramaViewer } from './components/PanoramaViewer';
import { OSMapView } from './components/OSMapView';
import { CameraCapture } from './components/CameraCapture';
import { PhotoAlbum } from './components/PhotoAlbum';
import { CheckInSuccess } from './components/CheckInSuccess';
import { Tutorial } from './components/Tutorial';

import pano1 from '../imports/panoramas/1.JPG';
import pano3 from '../imports/panoramas/3.JPG';
import pano6 from '../imports/panoramas/6.JPG';
import pano11 from '../imports/panoramas/11.JPG';

// Import 2D photos
import cb from '../imports/photos/cb.JPG';
import as1 from '../imports/photos/as1.jpg';
import as2 from '../imports/photos/as2.jpg';
import as3 from '../imports/photos/as3.jpg';
import sa1 from '../imports/photos/sa1.jpg';
import sa2 from '../imports/photos/sa2.jpg';
import sa3 from '../imports/photos/sa3.jpg';
import sa4 from '../imports/photos/sa4.jpg';
import sa5 from '../imports/photos/sa5.jpg';
import sa6 from '../imports/photos/sa6.jpg';
import eb1 from '../imports/photos/eb1.jpg';
import eb2 from '../imports/photos/eb2.jpg';
import eb3 from '../imports/photos/eb3.jpg';
import eb4 from '../imports/photos/eb4.jpg';
import eb5 from '../imports/photos/eb5.jpg';
import ee1 from '../imports/photos/ee1.jpg';
import ee2 from '../imports/photos/ee2.jpg';
import ee3 from '../imports/photos/ee3.jpg';
import ee4 from '../imports/photos/ee4.jpg';
import sport1 from '../imports/photos/sport1.jpg';
import sport2 from '../imports/photos/sport2.jpg';
import sport3 from '../imports/photos/sport3.jpg';
import sport4 from '../imports/photos/sport4.jpg';
import sport5 from '../imports/photos/sport5.jpg';
import sport6 from '../imports/photos/sport6.jpg';
import southlake1 from '../imports/photos/southlake1.jpg';
import southlake2 from '../imports/photos/southlake2.jpg';
import southlake3 from '../imports/photos/southlake3.jpg';
import bs1 from '../imports/photos/bs1.jpg';
import bs2 from '../imports/photos/bs2.jpg';
import bs3 from '../imports/photos/bs3.jpg';
import ma1 from '../imports/photos/ma1.jpg';
import ma2 from '../imports/photos/ma2.jpg';
import ma3 from '../imports/photos/ma3.jpg';
import ma4 from '../imports/photos/ma4.jpg';
import es1 from '../imports/photos/es1.jpg';
import es2 from '../imports/photos/es2.jpg';
import es3 from '../imports/photos/es3.jpg';

// Import navigation images
import nav1 from '../imports/navigation/01.png';
import nav2 from '../imports/navigation/02.png';
import nav3 from '../imports/navigation/03.png';
import nav4 from '../imports/navigation/04.png';
import nav5 from '../imports/navigation/05.png';
import nav6 from '../imports/navigation/06.png';
import nav7 from '../imports/navigation/07.png';
import nav8 from '../imports/navigation/08.png';

import nav10 from '../imports/navigation/10.png';

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
  visible?: boolean;
  floorPlanUrl?: string;
  navigation?: string[];
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showQRExchange, setShowQRExchange] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [panoramaLocation, setPanoramaLocation] = useState<Location | null>(null);
  const [checkInSuccessLocation, setCheckInSuccessLocation] = useState<Location | null>(null);
  const [cameraLocation, setCameraLocation] = useState<Location | null>(null);
  const [showPhotoAlbum, setShowPhotoAlbum] = useState(false);
  const [showCompletionAlbum, setShowCompletionAlbum] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [mapMode, setMapMode] = useState<'custom' | 'osm'>('custom'); // Map mode: custom - custom map, osm - OpenStreetMap
  const [userProfile, setUserProfile] = useState<any>(null);

  const toggleMapMode = () => {
    setMapMode(prev => prev === 'custom' ? 'amap' : 'custom');
  };

  const handleProfileSetupComplete = (profile: any) => {
    setUserProfile(profile);
    setShowProfileSetup(false);
  };

  const handleStartExploring = () => {
    setShowWelcome(false);
    const savedProfile = localStorage.getItem('userProfile');
    if (!savedProfile) {
      setShowProfileSetup(true);
    } else {
      setUserProfile(JSON.parse(savedProfile));
    }
    setShowTutorial(true);
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Central Building (CB)',
      category: 'academic',
      description: 'The iconic main building of XJTLU, housing administrative offices and the main reception area.',
      funFact: 'The Central Building is famous for its appearance in many campus photos and is often the first stop for new students and visitors!',
      image: '🏛️',
      coordinates: { x: 48, y: 42 },
      visited: false,
      points: 10,
      photos: [cb],
      visible: true,
    },
    //下面这个已经弃用
    {
      id: '2',
      name: 'AS building (AS)',
      category: 'academic',
      description: 'Arts and Social Sciences building with lecture halls, seminar rooms, and art studios.',
      funFact: 'The high quality photography and lighting equipment in AS building is available for students to use.',
      image: '📚',
      coordinates: { x: 30, y: 35 },
      visited: false,
      points: 15,
      photos: [as1, as2, as3],
      visible: true
    },
    {
      id: '3',
      name: 'Foundation Building (FB)',
      category: 'academic',
      description: 'Home to foundation year programs and language learning facilities.',
      funFact: 'The FB building is the oldest building in XJTLU which was built in 2006.',
      image: '📖',
      coordinates: { x: 42, y: 32 },
      visited: false,
      points: 10,
      visible: true
    },
    {
      id: '4',
      name: 'South Campus Sports Field',
      category: 'recreation',
      description: 'Professional sports complex with football field, running track, and sport facilities for various sports.',
      funFact: 'The track hosts inter-university competitions throughout the year!',
      image: '⚽',
      coordinates: { x: 75, y: 75 },
      visited: false,
      points: 10,
      photos: [sport1, sport2, sport3, sport4, sport5, sport6],
      visible: true
    },
    {
      id: '5',
      name: 'South Campus Lake',
      category: 'landmark',
      description: 'Beautiful scenic lake in the heart of South Campus, perfect for relaxation and photography.',
      funFact: 'The swans are a popular attraction in the campus, known for their graceful movements!',
      image: '🌊',
      coordinates: { x: 50, y: 75 },
      visited: false,
      points: 5,
      photos: [southlake1, southlake2, southlake3],
      visible: true
    },
    {
      id: '6',
      name: 'Dining Hall',
      category: 'facility',
      description: 'Multiple dining options including Chinese and Western cuisine.',
      funFact: 'Serves over 10,000 meals daily across multiple restaurants and cafes!',
      image: '🍜',
      coordinates: { x: 52, y: 48 },
      visited: false,
      points: 5,
      photos: [],
      visible: true
    },
    {
      id: '7',
      name: 'Engineering Building (EB)',
      category: 'academic',
      description: 'State-of-the-art engineering labs with robotics, electronics, and mechanical workshops.',
      funFact: 'Home to advanced 3D printers, laser cutters, and CNC machines available to all SAT students!',
      image: '⚙️',
      coordinates: { x: 58, y: 52 },
      visited: false,
      points: 15,
      photos: [eb1, eb2, eb3, eb4, eb5],
      visible: true
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
      points: 10,
      photos: [bs1, bs2, bs3],
      visible: true
    },
    {//这个也弃用
      id: '9',
      name: 'Science Building (SA/SB/SC/SD)',
      category: 'academic',
      description: 'Science building with lecture halls, labs, and study areas.',
      funFact: 'Most students will lose their way in these buildings because the structure is quite complex!',
      image: '🌍',
      coordinates: { x: 46, y: 38 },
      visited: false,
      points: 10,
      photos: [sa1, sa2, sa3, sa4, sa5, sa6],
      navigation: [nav1, nav2, nav3, nav4, nav5, nav6, nav7, nav8, nav10],
      visible: true
    },
    {
      id: '10',
      name: 'Life Sciences Building (LS)',
      category: 'academic',
      description: 'Advanced biology and chemistry labs for cutting-edge research and teaching.',
      funFact: 'LS is the latest building in XJTLU which was built in 2026.',
      image: '🔬',
      coordinates: { x: 22, y: 28 },
      visited: false,
      points: 15,
      photos: [],
      visible: true
    },
    {
      id: '11',
      name: 'Mathematics Building (MA)',
      category: 'academic',
      description: 'Dedicated space for mathematical sciences with computer labs and study areas.',
      funFact: 'Most year1 students will have their first calculus class here!',
      image: '🔢',
      coordinates: { x: 56, y: 62 },
      visited: false,
      points: 10,
      photos: [ma1, ma2, ma3, ma4],
      visible: true
    },
    {
      id: '12',
      name: 'Environmental Science Building (ES)',
      category: 'academic',
      description: 'Dedicated space for environmental sciences with computer labs and study areas.',
      funFact: 'ES building is the farest building from the dormitory so some students may late arrive.',
      image: '🌳',
      coordinates: { x: 68, y: 38 },
      visited: false,
      points: 10,
      photos: [es1, es2, es3],
      visible: true
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
    return <WelcomeScreen onStart={handleStartExploring} />;
  }

  if (showProfileSetup) {
    return <ProfileSetup onComplete={handleProfileSetupComplete} />;
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
        onOpenQRExchange={() => setShowQRExchange(true)}
        onOpenTutorial={() => setShowTutorial(true)}
      />

      <div className="flex-1 overflow-hidden">
        {mapMode === 'custom' ? (
          <MapView
            locations={locations}
            onLocationSelect={handleLocationSelect}
          />
        ) : (
          <OSMapView
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
          floorPlanUrl={selectedLocation.floorPlanUrl}
          navigation={selectedLocation.navigation}
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

      {showTutorial && (
        <Tutorial onClose={() => setShowTutorial(false)} />
      )}

      <QRCodeExchange
        isOpen={showQRExchange}
        onClose={() => setShowQRExchange(false)}
      />
    </div>
  );
}