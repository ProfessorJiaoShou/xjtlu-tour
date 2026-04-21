import { Map, List } from 'lucide-react';

interface NavigationBarProps {
  currentView: 'map' | 'list' | 'welcome';
  onViewChange: (view: 'map' | 'list') => void;
}

export function NavigationBar({ currentView, onViewChange }: NavigationBarProps) {
  const navItems = [
    { id: 'map' as const, icon: Map, label: 'Map' },
    { id: 'list' as const, icon: List, label: 'Places' }
  ];

  return (
    <nav className="bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
              currentView === id
                ? 'text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className={`w-6 h-6 mb-1 ${currentView === id ? 'animate-pulse' : ''}`} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}