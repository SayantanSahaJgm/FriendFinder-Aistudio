import React from 'react';
import { ICONS } from '../constants';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onProfileClick: () => void;
  onMessagesClick: () => void;
  onNotificationsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onProfileClick, onMessagesClick, onNotificationsClick }) => {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button onClick={onProfileClick} className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" title="View Profile">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          </button>
           <button onClick={onLogout} className="text-gray-500 hover:text-red-500" title="Logout">
            <ICONS.Logout className="w-6 h-6" />
           </button>
        </div>
        <h1 className="text-xl font-bold text-gray-800">FriendFinder</h1>
        <div className="flex items-center space-x-4">
          <button onClick={onMessagesClick} className="relative" title="Messages">
            <ICONS.Chat className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">1</span>
          </button>
          <button onClick={onNotificationsClick} className="relative" title="Notifications">
            <ICONS.Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">2</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;