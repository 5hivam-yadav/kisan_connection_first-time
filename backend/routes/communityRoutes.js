import express from 'express';
import { getPosts, getPostById, createPost, toggleLike, addComment, deletePost } from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', protect, createPost);
router.post('/posts/:id/like', protect, toggleLike);
router.post('/posts/:id/comment', protect, addComment);
router.delete('/posts/:id', protect, deletePost);

export default router;
