import React, { useEffect, useRef, useState } from 'react';
import { ICONS } from '../constants';

interface VideoChatProps {
    onNext: () => void;
    onStop: () => void;
}

const VideoChat: React.FC<VideoChatProps> = ({ onNext, onStop }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getPermissions = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (error) {
        console.error('Error accessing camera/mic:', error);
        setHasPermission(false);
      }
    };

    getPermissions();

    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-gray-900 rounded-xl shadow-2xl">
      <div className="flex-1 grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-2 p-2">
        {/* Remote Video */}
        <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
              <ICONS.VideoOff className="h-12 w-12 mb-4" />
              <p className="font-semibold">Stranger's Video</p>
              <p className="text-sm text-center text-gray-300">Connecting...</p>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm font-medium">Stranger</div>
        </div>
        
        {/* Local Video */}
        <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {hasPermission === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                <ICONS.Camera className="h-12 w-12 mb-4 animate-pulse" />
                <p>Starting your camera...</p>
            </div>
          )}
          <video ref={myVideoRef} className={`w-full h-full object-cover transition-opacity ${hasPermission ? 'opacity-100' : 'opacity-0'}`} autoPlay muted playsInline />
          {hasPermission === false && (
            <div className="absolute m-4 max-w-sm bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <ICONS.Video className="h-5 w-5" />
              <div>
                <p className="font-bold">Camera Access Required</p>
                <p className="text-sm">Please allow camera access to use this feature.</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm font-medium">You</div>
        </div>
      </div>
      
      <div className="flex justify-center items-center p-4 gap-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
        <button onClick={onStop} className="flex items-center gap-2 bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors">
            <ICONS.X className="h-5 w-5" /> Stop
        </button>
        <button onClick={onNext} className="flex items-center gap-2 bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-colors">
            <ICONS.Refresh className="h-5 w-5" /> Next
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
