import React from 'react';
import { Post as PostType } from '../types';
import PostCard from './PostCard';

interface PostListProps {
  posts: PostType[];
}

function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;