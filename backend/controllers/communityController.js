import { dataStore } from '../services/dataStore.js';

export const getPosts = async (req, res) => {
  try {
    const posts = await dataStore.getPosts(req.query);
    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await dataStore.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Community post not found' });
    }
    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const user = req.user;
    const { category, title, content, images, cropTag } = req.body;

    if (!category || !title || !content) {
      return res.status(400).json({ success: false, message: 'Category, title and content are required' });
    }

    const newPost = await dataStore.createPost({
      authorId: user._id,
      authorName: user.name,
      authorRole: user.role,
      authorLocation: `${user.location?.district || 'India'}, ${user.location?.state || ''}`,
      authorAvatar: user.profileImage,
      authorVerified: user.verification?.isVerified || true,
      category,
      cropTag: cropTag || 'General Agriculture',
      title,
      content,
      images: images || []
    });

    res.status(201).json({
      success: true,
      message: 'Post published to Kisan Community forum!',
      post: newPost
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await dataStore.toggleLikePost(req.params.id, req.user._id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({
      success: true,
      likesCount: post.likesCount,
      liked: post.likes.includes(req.user._id),
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const post = await dataStore.addComment(req.params.id, {
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userAvatar: req.user.profileImage,
      userLocation: `${req.user.location?.district || ''}, ${req.user.location?.state || ''}`,
      comment
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await dataStore.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.authorId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await dataStore.deletePost(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
