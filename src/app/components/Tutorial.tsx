import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, MapPin, Camera, Trophy, RotateCw, QrCode, Layers } from 'lucide-react';
import { Button } from './ui/button';

interface TutorialProps {
  onClose: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to XJTLU Campus Tour!',
    description: 'Explore the beautiful campus of Xi\'an Jiaotong-Liverpool University through our interactive tour guide. Visit locations, collect points, and discover hidden gems!',
    icon: <MapPin className="w-16 h-16 text-blue-600" />,
  },
  {
    title: 'Explore Locations',
    description: 'Tap on any location marker on the map to view details. Each location has a 360° panoramic view, photos, and interesting facts about the building.',
    icon: <MapPin className="w-16 h-16 text-purple-600" />,
  },
  {
    title: 'Check-in & Earn Points',
    description: 'Visit locations and mark them as visited to earn points. Take photos to document your journey and create your personal campus tour album!',
    icon: <Trophy className="w-16 h-16 text-yellow-600" />,
  },
  {
    title: '360° Panoramic Views',
    description: 'Experience immersive 360° panoramic views of each location. Drag to look around and explore the campus like you\'re really there!',
    icon: <RotateCw className="w-16 h-16 text-green-600" />,
  },
  {
    title: 'Photo Check-in',
    description: 'Take photos at each location to create your personal tour album. Share your campus memories with friends!',
    icon: <Camera className="w-16 h-16 text-red-600" />,
  },
  {
    title: 'Map Switching',
    description: 'Switch between Custom Map and OSM (OpenStreetMap) modes. Custom Map shows our custom-designed campus map, while OSM provides real-world mapping data.',
    icon: <Layers className="w-16 h-16 text-indigo-600" />,
  },
  {
    title: 'QR Code Sharing',
    description: 'Generate your personal QR code to share with friends! They can scan your QR code to see your campus tour progress and photos.',
    icon: <QrCode className="w-16 h-16 text-pink-600" />,
  },
  {
    title: 'Ready to Start!',
    description: 'You\'re all set to explore XJTLU! Tap the map to begin your campus tour adventure. Have fun!',
    icon: <MapPin className="w-16 h-16 text-blue-600" />,
  },
];

export function Tutorial({ onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center text-center">
            {step.icon}
            <h2 className="text-2xl font-bold mt-4">{step.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-center leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}