
import React from 'react';
import type { Post } from '../types';
import { ICONS } from '../constants';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white">
      {/* Post Header */}
      <div className="flex items-center space-x-3 p-4">
        <img
          src={post.user.avatarUrl}
          alt={post.user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{post.user.name}</p>
          <p className="text-xs text-gray-500">{post.timestamp}</p>
        </div>
      </div>
      
      {/* Post Content */}
      <p className="px-4 pb-3 text-gray-800">{post.content}</p>
      
      {/* Post Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post content"
          className="w-full h-auto"
        />
      )}
      
      {/* Post Actions */}
      <div className="flex justify-between items-center p-4 text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 cursor-pointer hover:text-red-500">
            <ICONS.Heart className="w-6 h-6" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500">
            <ICONS.Comment className="w-6 h-6" />
            <span>{post.comments}</span>
          </div>
        </div>
        <div className="cursor-pointer hover:text-blue-500">
          <ICONS.Share className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
