import express from 'express';
import { getPrices, getPriceByCrop, getPriceComparison } from '../controllers/priceController.js';

const router = express.Router();

router.get('/', getPrices);
router.get('/trends', getPriceComparison);
router.get('/compare', getPriceComparison);
router.get('/:crop', getPriceByCrop);

export default router;
