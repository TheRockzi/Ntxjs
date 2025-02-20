import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import { FiMapPin, FiSearch, FiStar, FiMap, FiLayers, FiLoader, FiAlertCircle } from 'react-icons/fi';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface SavedLocation extends Location {
  id: string;
  name: string;
  timestamp: number;
}

export function GeolocationSection() {
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 12
  });
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/dark-v11');
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    // Load saved locations from localStorage
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }
  }, []);

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setViewState({ ...viewState, latitude, longitude });
        
        try {
          // Reverse geocoding using Mapbox API
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
          );
          const data = await response.json();
          const address = data.features[0]?.place_name;

          setCurrentLocation({ latitude, longitude, address });
        } catch (err) {
          setCurrentLocation({ latitude, longitude });
        }
        
        setIsLoading(false);
      },
      (err) => {
        setError('Could not get your location. Please check your permissions.');
        setIsLoading(false);
      }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.features?.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const address = data.features[0].place_name;

        setViewState({ ...viewState, latitude, longitude });
        setCurrentLocation({ latitude, longitude, address });
      } else {
        setError('Location not found');
      }
    } catch (err) {
      setError('Failed to search location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLocation = () => {
    if (!currentLocation) return;

    const newLocation: SavedLocation = {
      id: Date.now().toString(),
      name: currentLocation.address || `Location ${savedLocations.length + 1}`,
      timestamp: Date.now(),
      ...currentLocation
    };

    const updatedLocations = [...savedLocations, newLocation];
    setSavedLocations(updatedLocations);
    localStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
  };

  const toggleMapStyle = () => {
    setMapStyle(current => 
      current === 'mapbox://styles/mapbox/dark-v11'
        ? 'mapbox://styles/mapbox/satellite-v9'
        : 'mapbox://styles/mapbox/dark-v11'
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 rounded-full bg-[#00e5ff]/10 mb-4"
        >
          <FiMapPin className="text-3xl text-[#00e5ff]" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Geolocation Intelligence</h2>
        <p className="text-gray-400">Track and analyze geographical data</p>
      </div>

      {/* Search and Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative">
          <FiSearch className="absolute left-4 top-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location..."
            className="w-full bg-black/40 backdrop-blur-xl border-2 border-white/10 rounded-xl
                     pl-12 pr-4 py-3 text-white placeholder:text-gray-500
                     focus:outline-none focus:border-[#00e5ff]/40 transition-all"
          />
        </form>

        <div className="flex gap-2">
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
            className="flex-1 bg-[#00e5ff] text-white px-4 py-3 rounded-xl
                     hover:bg-[#00e5ff]/90 transition-all font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <>
                <FiMapPin />
                <span>Get Current Location</span>
              </>
            )}
          </button>

          <button
            onClick={toggleMapStyle}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-4
                     hover:bg-black/60 transition-all"
          >
            <FiLayers className="text-[#00e5ff]" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <FiAlertCircle className="text-red-500" />
            <span className="text-red-500">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map and Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4
                     hover:border-white/20 transition-all h-[500px]">
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle={mapStyle}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            className="w-full h-full rounded-lg"
          >
            <NavigationControl />
            <GeolocateControl />
            {currentLocation && (
              <Marker
                latitude={currentLocation.latitude}
                longitude={currentLocation.longitude}
                anchor="bottom"
              >
                <div className="relative group">
                  <FiMapPin className="text-2xl text-[#00e5ff] filter drop-shadow-glow
                                   transform -translate-y-1/2 group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48
                               bg-black/90 text-white text-sm rounded-lg py-2 px-3 opacity-0
                               group-hover:opacity-100 transition-opacity">
                    {currentLocation.address || 'Selected Location'}
                  </div>
                </div>
              </Marker>
            )}
          </Map>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Current Location Info */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6
                       hover:border-white/20 transition-all">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiMap className="text-[#00e5ff]" />
              Current Location
            </h3>
            
            {currentLocation ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white">{currentLocation.address || 'Address not available'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Latitude</p>
                    <p className="text-white">{currentLocation.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Longitude</p>
                    <p className="text-white">{currentLocation.longitude.toFixed(6)}</p>
                  </div>
                </div>
                <button
                  onClick={handleSaveLocation}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2
                           hover:bg-black/60 transition-all flex items-center justify-center gap-2"
                >
                  <FiStar className="text-[#00e5ff]" />
                  <span>Save Location</span>
                </button>
              </div>
            ) : (
              <p className="text-gray-400">No location selected</p>
            )}
          </div>

          {/* Saved Locations */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6
                       hover:border-white/20 transition-all">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiStar className="text-[#00e5ff]" />
              Saved Locations
            </h3>
            
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {savedLocations.length > 0 ? (
                savedLocations.map(location => (
                  <button
                    key={location.id}
                    onClick={() => {
                      setViewState({
                        ...viewState,
                        latitude: location.latitude,
                        longitude: location.longitude
                      });
                      setCurrentLocation(location);
                    }}
                    className="w-full bg-black/20 rounded-lg p-3 text-left hover:bg-black/40
                             transition-all border border-white/5 hover:border-white/10"
                  >
                    <p className="text-white font-medium truncate">{location.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(location.timestamp).toLocaleDateString()}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-center">No saved locations</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}