import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from '../types';

interface CommentListProps {
  comments: Comment[];
}

function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3">
          <Link to={`/profile/${comment.author.id}`}>
            <img
              src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.username}`}
              alt={comment.author.username}
              className="w-8 h-8 rounded-full"
            />
          </Link>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-3">
              <Link to={`/profile/${comment.author.id}`} className="font-semibold hover:underline">
                {comment.author.username}
              </Link>
              <p>{comment.content}</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;