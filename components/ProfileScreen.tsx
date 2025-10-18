
import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface ProfileScreenProps {
  user: User;
  onUpdateBio: (newBio: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdateBio }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftBio, setDraftBio] = useState(user.bio || '');

  useEffect(() => {
    // Keep draft bio in sync if user prop changes while not editing
    if (!isEditing) {
      setDraftBio(user.bio || '');
    }
  }, [user.bio, isEditing]);

  const handleSave = () => {
    onUpdateBio(draftBio);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftBio(user.bio || '');
    setIsEditing(false);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="relative mb-4">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
      
      <div className="w-full mt-8 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">About Me</h2>
            {!isEditing && (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-medium text-blue-500 hover:text-blue-700"
                >
                    Edit
                </button>
            )}
        </div>
        
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <textarea
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              className="w-full h-32 p-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tell everyone a little about yourself..."
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-sm leading-relaxed">
            {user.bio || 'No bio yet. Tap "Edit" to add one!'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;