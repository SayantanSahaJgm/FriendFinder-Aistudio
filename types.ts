export interface User {
  id: number;
  name: string;
  avatarUrl: string;
  bio?: string;
}

export interface Story {
  id: number;
  user: User;
  imageUrl: string;
}

export interface Post {
  id: number;
  user: User;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export interface NearbyUser extends User {
  distance: string;
}

export type View = 'map' | 'bluetooth' | 'wifi' | 'feed' | 'search' | 'random' | 'profile' | 'notifications' | 'messages';

// Types for Random Chat feature
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'stranger';
  text: string;
}

export type ChatMode = 'text' | 'audio' | 'video';

export type ChatStatus = 'idle' | 'capturingSelfie' | 'searching' | 'connected' | 'error';

export interface FaceDetectionOutput {
  faceDetected: boolean;
  reason: string;
}