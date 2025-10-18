import React from 'react';
import { ICONS } from '../constants';

const MessagesScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <ICONS.Chat className="w-24 h-24 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700">Messages</h2>
      <p className="text-gray-500 mt-2">
        This is where your conversations will be displayed.
      </p>
    </div>
  );
};

export default MessagesScreen;