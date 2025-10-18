
import React, { useState, useMemo } from 'react';
import type { Post } from '../types';
import { ICONS } from '../constants';
import PostCard from './PostCard';

interface SearchScreenProps {
  posts: Post[];
}

const SearchScreen: React.FC<SearchScreenProps> = ({ posts }) => {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return posts.filter(post => 
      post.content.toLowerCase().includes(lowerCaseQuery) ||
      post.user.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, posts]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for posts or users..."
            className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <ICONS.Search className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {query.trim() === '' ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
            <ICONS.Search className="w-16 h-16 mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold">Find Something New</h2>
            <p>Search for posts by content or username.</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="mt-4 flex flex-col gap-4">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
             <ICONS.XCircle className="w-16 h-16 mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold">No Results Found</h2>
            <p>Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;