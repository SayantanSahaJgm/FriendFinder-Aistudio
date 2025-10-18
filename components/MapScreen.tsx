import React, { useState, useEffect, useCallback } from 'react';
import { ICONS } from '../constants';
import type { NearbyUser } from '../types';
import { fetchNearbyUsers } from '../api';

interface MapScreenProps {
  currentUserId: number;
}

const MapScreen: React.FC<MapScreenProps> = ({ currentUserId }) => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    setLocation(null);
    setNearbyUsers([]);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          const users = await fetchNearbyUsers(currentUserId);
          setNearbyUsers(users);
        } catch (apiError) {
          setError('Failed to fetch nearby users. Please try again.');
          console.error(apiError);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. If you changed your mind, please enable it in your browser settings and try again.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Your location information is currently unavailable.');
            break;
          case err.TIMEOUT:
            setError('The request to get your location timed out.');
            break;
          default:
            setError('An unknown error occurred while fetching your location.');
            break;
        }
        setLoading(false);
      }
    );
  }, [currentUserId]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // Effect to refresh nearby users periodically
  useEffect(() => {
    if (location) {
      const intervalId = setInterval(async () => {
        try {
          const users = await fetchNearbyUsers(currentUserId);
          setNearbyUsers(users);
        } catch (apiError) {
          console.error("Failed to refresh nearby users:", apiError);
          // Silently fail on refresh to not disturb the user
        }
      }, 60000); // 60 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [location, currentUserId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-pulse">
        <ICONS.Location className="w-24 h-24 text-blue-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-600">Finding your location...</h2>
        <p className="text-gray-400 mt-2">
          This may take a moment.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-red-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v.01M15.06 18.364A8.962 8.962 0 0112 19.5c-5 0-9-4.03-9-9s4.03-9 9-9c2.49 0 4.73 1 6.364 2.636m-4.242 4.242a3 3 0 11-4.243-4.243 3 3 0 014.243 4.243zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
           <path strokeLinecap="round" strokeLinejoin="round" d="M21 21L3 3" />
        </svg>

        <h2 className="text-2xl font-bold text-gray-700">Location Error</h2>
        <p className="text-gray-500 mt-2 max-w-xs">
          {error}
        </p>
        <button
          onClick={fetchLocation}
          className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors"
          aria-label="Try again to fetch location"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (location) {
    const { lat, lon } = location;
    const zoom = 0.005; 
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - zoom},${lat - zoom},${lon + zoom},${lat + zoom}&layer=mapnik&marker=${lat},${lon}`;
    
    return (
      <div className="w-full h-full flex flex-col bg-gray-50">
        <div className="h-1/2 shadow-lg z-10">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={mapSrc}
            title="User Location Map"
            aria-label="Map showing your current location"
          ></iframe>
        </div>
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
            <h3 className="text-md font-bold text-gray-900 mb-4 px-1">People Nearby</h3>
            <div className="space-y-3">
              {nearbyUsers.length > 0 ? nearbyUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm transition-transform hover:scale-105">
                        <div className="flex items-center space-x-4">
                            <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover"/>
                            <div>
                                <p className="font-semibold text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.distance}</p>
                            </div>
                        </div>
                        <button className="px-4 py-1.5 bg-blue-100 text-blue-600 font-semibold rounded-full text-sm hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                            Wave
                        </button>
                    </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No one seems to be nearby right now.</p>
                  </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <ICONS.Map className="w-24 h-24 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700">Map View</h2>
      <p className="text-gray-500 mt-2">
        Preparing map...
      </p>
    </div>
  );
};

export default MapScreen;