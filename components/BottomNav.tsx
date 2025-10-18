import React from 'react';
import type { View } from '../types';
import { ICONS } from '../constants';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 text-gray-500 hover:text-blue-500 transition-colors py-2">
    <div className={`relative w-6 h-6 ${isActive ? 'text-blue-500' : ''}`}>
      {icon}
    </div>
    <span className={`text-xs mt-1 ${isActive ? 'text-blue-500 font-semibold' : ''}`}>{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: 'feed' as View, label: 'Feed', icon: <ICONS.Home className="w-full h-full" /> },
    { view: 'map' as View, label: 'Map', icon: <ICONS.Map className="w-full h-full" /> },
    { view: 'bluetooth' as View, label: 'Bluetooth', icon: <ICONS.Bluetooth className="w-full h-full" /> },
    { view: 'wifi' as View, label: 'WiFi', icon: <ICONS.Wifi className="w-full h-full" /> },
    { view: 'search' as View, label: 'Search', icon: <ICONS.Search className="w-full h-full" /> },
    { view: 'random' as View, label: 'Random', icon: <ICONS.Random className="w-full h-full" /> },
  ];

  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white/80 backdrop-blur-md z-10 border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
      </div>
    </footer>
  );
};

export default BottomNav;