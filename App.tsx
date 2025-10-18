import React, { useState } from 'react';
import type { View, User, Post } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MainFeed from './components/MainFeed';
import MapScreen from './components/MapScreen';
import BluetoothScreen from './components/BluetoothScreen';
import WifiScreen from './components/WifiScreen';
import SearchScreen from './components/SearchScreen';
import RandomScreen from './components/RandomScreen';
import AuthScreen from './components/AuthScreen';
import ProfileScreen from './components/ProfileScreen';
import NotificationsScreen from './components/NotificationsScreen';
import MessagesScreen from './components/MessagesScreen';
import { posts as initialPosts } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('feed');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleCreatePost = (content: string, imageUrl?: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: Date.now(),
      user: currentUser,
      timestamp: 'Just now',
      content,
      imageUrl,
      likes: 0,
      comments: 0,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleUpdateBio = (newBio: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, bio: newBio });
    }
  };

  const renderContent = () => {
    if (!currentUser) {
      return <AuthScreen onLoginSuccess={setCurrentUser} />;
    }
    switch (activeView) {
      case 'feed':
        return <MainFeed user={currentUser} posts={posts} onNewPost={handleCreatePost} />;
      case 'map':
        return <MapScreen currentUserId={currentUser.id} />;
      case 'bluetooth':
        return <BluetoothScreen />;
      case 'wifi':
        return <WifiScreen />;
      case 'search':
        return <SearchScreen posts={posts} />;
      case 'random':
        return <RandomScreen />;
      case 'profile':
        return <ProfileScreen user={currentUser} onUpdateBio={handleUpdateBio} />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'messages':
        return <MessagesScreen />;
      // Default case to catch any unhandled views and show the feed.
      default:
        return <MainFeed user={currentUser} posts={posts} onNewPost={handleCreatePost} />;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('feed');
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white h-screen flex flex-col shadow-2xl">
      {currentUser && <Header 
          user={currentUser} 
          onLogout={handleLogout} 
          onProfileClick={() => setActiveView('profile')}
          onMessagesClick={() => setActiveView('messages')}
          onNotificationsClick={() => setActiveView('notifications')}
        />}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {renderContent()}
      </main>
      {currentUser && <BottomNav activeView={activeView} setActiveView={setActiveView} />}
    </div>
  );
};

export default App;