import React, { useState } from 'react';
import { ICONS } from '../constants';
import type { User } from '../types';

interface CreatePostProps {
  user: User;
  onNewPost: (content: string, imageUrl?: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onNewPost }) => {
  const [content, setContent] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onNewPost(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg py-4 mt-4">
      <div className="flex items-center space-x-3">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex justify-end items-center mt-3 gap-4">
        <button type="button" className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600">
            <ICONS.Camera className="w-5 h-5 text-purple-500" /> Photo
        </button>
        <button type="button" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
             <ICONS.Location className="w-5 h-5 text-blue-500" /> Check in
        </button>
        <button 
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-1.5 bg-blue-500 text-white font-semibold rounded-full text-sm hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default CreatePost;