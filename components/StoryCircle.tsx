
import React from 'react';
import type { Story } from '../types';

interface StoryCircleProps {
  story: Story;
}

const StoryCircle: React.FC<StoryCircleProps> = ({ story }) => {
  return (
    <div className="flex-shrink-0 flex flex-col items-center space-y-1 w-16">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
          <div className="bg-white p-0.5 rounded-full h-full w-full">
            <img
              src={story.user.avatarUrl}
              alt={story.user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-800 text-center truncate w-full">{story.user.name}</p>
    </div>
  );
};

export default StoryCircle;
