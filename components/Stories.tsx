

import React from 'react';
import StoryCircle from './StoryCircle';
// Fix: The 'users' member is not exported from '../constants'. It was also unused in this file.
import { stories } from '../constants';

const Stories: React.FC = () => {
  return (
    <div className="border-b border-gray-200 py-3">
      <div className="flex space-x-4 px-4 overflow-x-auto no-scrollbar">
        {/* Your Story */}
        <div className="flex-shrink-0 flex flex-col items-center space-y-1 w-16">
          <div className="relative w-16 h-16">
            <div className="w-full h-full rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center truncate w-full">Your Story</p>
        </div>
        
        {/* Friends' Stories */}
        {stories.map(story => (
          <StoryCircle key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default Stories;