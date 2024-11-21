import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toggleLike, addComment } from '../store/slices/postsSlice';
import { Post } from '../types';
import CommentList from './CommentList';

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const isLiked = user ? post.likes.includes(user.id) : false;

  const handleLike = () => {
    if (user) {
      dispatch(toggleLike({ postId: post.id, userId: user.id }));
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newComment.trim()) {
      dispatch(addComment({
        postId: post.id,
        comment: {
          id: Date.now().toString(),
          content: newComment,
          authorId: user.id,
          author: user,
          postId: post.id,
          createdAt: new Date().toISOString(),
        },
      }));
      setNewComment('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <Link to={`/profile/${post.author.id}`}>
          <img
            src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.username}`}
            alt={post.author.username}
            className="w-10 h-10 rounded-full"
          />
        </Link>
        <div className="ml-3">
          <Link to={`/profile/${post.author.id}`} className="font-semibold hover:underline">
            {post.author.username}
          </Link>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="mb-4">{post.content}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post content" className="rounded-lg mb-4 max-h-96 w-full object-cover" />
      )}

      {/* Post Actions */}
      <div className="flex items-center space-x-6 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes.length}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{post.comments.length}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t pt-4">
          <CommentList comments={post.comments} />
          <form onSubmit={handleComment} className="mt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostCard;