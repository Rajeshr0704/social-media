import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Image } from 'lucide-react';
import { createPost } from '../store/slices/postsSlice';
import { AppDispatch } from '../store';

function CreatePost() {
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      dispatch(createPost({ content, imageUrl }));
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
        />
        
        {showImageInput && (
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
          >
            <Image className="h-5 w-5" />
            <span>Add Image</span>
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;