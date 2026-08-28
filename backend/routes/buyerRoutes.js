import express from 'express';
import { getBuyers, getBuyerById } from '../controllers/buyerController.js';

const router = express.Router();

router.get('/', getBuyers);
router.get('/:id', getBuyerById);

export default router;
