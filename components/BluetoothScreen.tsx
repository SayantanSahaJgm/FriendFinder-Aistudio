import React, { useState } from 'react';
import { ICONS } from '../constants';
import { fetchNearbyBluetoothUsers } from '../api';
import type { NearbyUser } from '../types';

type ScanStatus = 'idle' | 'scanning' | 'results' | 'denied';

const BluetoothScreen: React.FC = () => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set());

  // In a real app, currentUserId would come from auth context/props
  const currentUserId = 1; 

  const startScan = async () => {
    setStatus('scanning');
    setNearbyUsers([]);
    try {
      // Simulate asking for Bluetooth permissions
      // In a real Web Bluetooth app, you'd call navigator.bluetooth.requestDevice() here
      const users = await fetchNearbyBluetoothUsers(currentUserId);
      setNearbyUsers(users);
      setStatus('results');
    } catch (error) {
      console.error("Bluetooth scan simulation failed:", error);
      setStatus('denied'); // Simulate permission denied or other error
    }
  };

  const handleSendRequest = (userId: number) => {
    setSentRequests(prev => new Set(prev).add(userId));
    // Here you would call an API to send the friend request
  };
  
  const renderContent = () => {
    switch (status) {
      case 'scanning':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Animated waves */}
              <div className="absolute w-full h-full rounded-full bg-blue-500/20 animate-ping"></div>
              <div className="absolute w-3/4 h-3/4 rounded-full bg-blue-500/30 animate-ping [animation-delay:-1s]"></div>
              {/* Central icon */}
              <div className="relative w-24 h-24 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                <ICONS.Bluetooth className="w-12 h-12" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-12">Scanning for Friends...</h2>
            <p className="text-gray-500 mt-2">Make sure your friends have FriendFinder open.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        );

      case 'results':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="p-4 text-center border-b">
                <h2 className="text-xl font-bold text-gray-800">Found {nearbyUsers.length} People</h2>
                <p className="text-sm text-gray-500">Tap to send a friend request.</p>
            </div>
            {nearbyUsers.length > 0 ? (
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {nearbyUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm transition-transform hover:scale-[1.02]">
                            <div className="flex items-center space-x-4">
                                <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover"/>
                                <div>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.distance}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleSendRequest(user.id)}
                                disabled={sentRequests.has(user.id)}
                                className={`px-4 py-1.5 font-semibold rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    sentRequests.has(user.id)
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-blue-400'
                                }`}
                            >
                                {sentRequests.has(user.id) ? 'Sent' : 'Connect'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <p className="font-semibold">No one seems to be nearby.</p>
                    <p className="text-sm">Try moving to a different area.</p>
                </div>
            )}
             <div className="p-4 border-t">
                 <button
                    onClick={startScan}
                    className="w-full mt-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors flex items-center justify-center gap-2"
                >
                    <ICONS.Refresh className="w-5 h-5" />
                    Scan Again
                </button>
            </div>
          </div>
        );
      
      case 'denied':
         return (
             <div className="flex flex-col items-center justify-center text-center">
                <ICONS.XCircle className="w-24 h-24 text-red-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-700">Bluetooth Access Denied</h2>
                <p className="text-gray-500 mt-2 max-w-xs">
                    To find friends nearby, FriendFinder needs Bluetooth access. Please enable it in your device settings.
                </p>
                <button
                    onClick={startScan}
                    className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors"
                >
                    Try Again
                </button>
            </div>
         );

      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <ICONS.Bluetooth className="w-24 h-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">Find Friends Nearby</h2>
            <p className="text-gray-500 mt-2 max-w-xs">
              Use Bluetooth to discover and connect with people around you, even without internet.
            </p>
            <button
              onClick={startScan}
              className="mt-8 px-8 py-3 bg-blue-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform hover:scale-105"
            >
              Start Scanning
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50">
      {renderContent()}
    </div>
  );
};

export default BluetoothScreen;