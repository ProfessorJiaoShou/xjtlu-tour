import { useState } from 'react';
import { Location } from '../App';
import { Search, Filter, CheckCircle, Circle } from 'lucide-react';

interface LocationsListProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

export function LocationsList({ locations, onLocationSelect }: LocationsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || loc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All', icon: '🌐' },
    { id: 'academic', label: 'Academic', icon: '🎓' },
    { id: 'facility', label: 'Facilities', icon: '🍽️' },
    { id: 'recreation', label: 'Sports', icon: '⚽' },
    { id: 'landmark', label: 'Landmarks', icon: '🏞️' }
  ];

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-full whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="text-xs">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredLocations.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No locations found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => onLocationSelect(location)}
              className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all active:scale-98 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">
                  {location.image}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900 truncate">
                      {location.name}
                    </h3>
                    {location.visited ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {location.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">
                      {location.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      ⚡ {location.points} points
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
