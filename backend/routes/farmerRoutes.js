import express from 'express';
import { getFarmers, getFarmerById } from '../controllers/farmerController.js';

const router = express.Router();

router.get('/', getFarmers);
router.get('/:id', getFarmerById);

export default router;
