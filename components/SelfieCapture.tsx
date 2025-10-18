import React, { useEffect, useRef, useState } from 'react';
import { ICONS } from '../constants';
import { detectFace } from '../ai';
import type { FaceDetectionOutput } from '../types';

interface SelfieCaptureProps {
    onSelfieCaptured: (dataUri: string) => void;
    onCancel: () => void;
}

type CaptureStatus = 'initializing' | 'previewing' | 'capturing' | 'verifying' | 'failed';

const SelfieCapture: React.FC<SelfieCaptureProps> = ({ onSelfieCaptured, onCancel }) => {
  const [status, setStatus] = useState<CaptureStatus>('initializing');
  const [verificationResult, setVerificationResult] = useState<FaceDetectionOutput | null>(null);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus('previewing');
      } catch (error) {
        console.error('Error accessing camera:', error);
        setStatus('failed');
        setVerificationResult({ faceDetected: false, reason: 'Camera access denied. Please enable it in your browser settings.' });
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndVerify = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setStatus('capturing');
    setProgress(10);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const dataUri = canvas.toDataURL('image/jpeg');
    
    setStatus('verifying');

    const progressInterval = setInterval(() => {
      setProgress(p => (p < 90 ? p + 5 : 90));
    }, 100);

    try {
      const result = await detectFace(dataUri);
      setVerificationResult(result);
      if (result.faceDetected) {
        setProgress(100);
        setTimeout(() => onSelfieCaptured(dataUri), 500);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Face detection failed:', error);
      setStatus('failed');
      setVerificationResult({ faceDetected: false, reason: 'Could not connect to verification service.' });
    } finally {
      clearInterval(progressInterval);
    }
  };
  
  const renderStatusMessage = () => {
    switch (status) {
      case 'initializing':
        return <p className='flex items-center gap-2 text-gray-500'><ICONS.Refresh className="h-4 w-4 animate-spin"/> Initializing camera...</p>;
      case 'previewing':
        return <p className="text-gray-600">Center your face in the frame and click Capture.</p>;
      case 'capturing':
      case 'verifying':
        return (
          <div className='w-full text-center'>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.2s' }}></div>
            </div>
            <p className="text-sm text-blue-600 font-semibold">{status === 'capturing' ? 'Capturing...' : 'Verifying with AI...'}</p>
          </div>
        );
      case 'failed':
        return (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-left w-full">
            <h3 className="font-bold text-sm flex items-center gap-2"><ICONS.XCircle className="h-4 w-4"/> Verification Failed</h3>
            <p className="text-xs mt-1">{verificationResult?.reason || 'Please try again.'}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ICONS.Camera className='h-6 w-6' />
            Video Chat Verification
        </h2>
        <p className="text-sm text-gray-500 mt-1">
            To ensure a safe community, we need to quickly verify your face before connecting.
        </p>
      </div>
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden relative flex items-center justify-center shadow-inner">
             <video ref={videoRef} className={`w-full h-full object-cover transition-opacity duration-300 ${status === 'previewing' ? 'opacity-100' : 'opacity-60'}`} autoPlay muted playsInline />
             {status !== 'previewing' && <div className="absolute inset-0 bg-black/20" />}
             {status === 'initializing' && <ICONS.Camera className="w-12 h-12 text-gray-400 animate-pulse" />}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />

        <div className='w-full text-center p-2 min-h-[4rem] flex items-center justify-center'>
           {renderStatusMessage()}
        </div>

        <div className='w-full flex gap-2'>
            <button onClick={onCancel} className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            {status === 'failed' ? (
                 <button onClick={() => setStatus('previewing')} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    <ICONS.Refresh className="w-5 h-5" /> Try Again
                </button>
            ) : (
                <button onClick={captureAndVerify} disabled={status !== 'previewing'} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2">
                    {status === 'verifying' ? <ICONS.Refresh className="animate-spin w-5 h-5"/> : <ICONS.Send className="w-5 h-5" />}
                    Capture & Connect
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default SelfieCapture;
