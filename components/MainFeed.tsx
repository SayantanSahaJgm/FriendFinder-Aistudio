import React from 'react';
import Stories from './Stories';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import type { User, Post } from '../types';

interface MainFeedProps {
  user: User;
  posts: Post[];
  onNewPost: (content: string, imageUrl?: string) => void;
}

const MainFeed: React.FC<MainFeedProps> = ({ user, posts, onNewPost }) => {
  return (
    <div className="flex flex-col">
      <Stories />
      <div className="px-4">
        <CreatePost user={user} onNewPost={onNewPost} />
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default MainFeed;