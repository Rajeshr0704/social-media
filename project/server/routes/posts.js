import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a post
router.post('/', async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const post = new Post({
      content,
      imageUrl,
      author: req.userId,
    });
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike a post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.userId);
    if (likeIndex === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment
router.post('/:id/comment', async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      content,
      author: req.userId,
    });

    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar');

    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;