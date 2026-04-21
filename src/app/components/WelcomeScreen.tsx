import { Compass, Map, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="animate-bounce mb-8">
        <Compass className="w-24 h-24" />
      </div>

      <h1 className="text-4xl mb-4 text-center">XJTLU Campus Explorer</h1>

      <div className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full mb-2">
        <p className="text-sm opacity-90">Xi'an Jiaotong-Liverpool University</p>
      </div>

      <p className="text-xl mb-2 text-center opacity-90">
        Your Interactive AR Tour Guide
      </p>

      <p className="text-sm mb-12 text-center opacity-75 max-w-md">
        Discover all 12 campus locations, unlock fun facts, and collect points as you explore!
      </p>

      <div className="grid grid-cols-3 gap-6 mb-12 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-2">
            <Map className="w-8 h-8" />
          </div>
          <p className="text-xs text-center">Interactive Map</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <p className="text-xs text-center">AR Scanner</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-2">
            <span className="text-2xl">🏆</span>
          </div>
          <p className="text-xs text-center">Earn Points</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="bg-white text-purple-600 px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        Start Exploring
      </button>

      <p className="text-xs mt-8 opacity-60">
        Perfect for new students & campus visitors
      </p>
    </div>
  );
}