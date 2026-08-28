import express from 'express';
import { getInquiries, createInquiry, updateInquiryStatus } from '../controllers/inquiryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getInquiries);
router.post('/', protect, createInquiry);
router.put('/:id', protect, updateInquiryStatus);

export default router;
