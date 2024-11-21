import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User } from '../types';
import PostList from '../components/PostList';

function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, postsResponse] = await Promise.all([
          axios.get(`/api/users/${userId}`),
          axios.get(`/api/posts/user/${userId}`),
        ]);
        setUser(userResponse.data);
        setPosts(postsResponse.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center text-red-500 mt-8">
        <p>{error || 'User not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
            alt={user.username}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600">{user.bio || 'No bio available'}</p>
            <div className="mt-2 space-x-4">
              <span>{user.followers.length} followers</span>
              <span>{user.following.length} following</span>
            </div>
          </div>
        </div>
        {currentUser?.id !== user.id && (
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {user.followers.includes(currentUser?.id || '') ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
      <PostList posts={posts} />
    </div>
  );
}

export default Profile;