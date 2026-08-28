import express from 'express';
import { getDashboardStats, verifyUser, resolveReport } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.post('/verify-user', protect, authorize('admin'), verifyUser);
router.put('/reports/:id', protect, authorize('admin'), resolveReport);

export default router;
