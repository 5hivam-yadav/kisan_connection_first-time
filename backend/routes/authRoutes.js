import express from 'express';
import { register, login, sendOtp, verifyOtp, getMe, updateProfile, switchDemoRole } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/switch-demo-role', switchDemoRole);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
