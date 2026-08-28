import express from 'express';
import { getListings, getListingById, createListing, updateListing, deleteListing, toggleListingStatus } from '../controllers/listingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getListings);
router.get('/:id', getListingById);
router.post('/', protect, authorize('farmer', 'admin'), createListing);
router.put('/:id', protect, updateListing);
router.patch('/:id/toggle-status', protect, toggleListingStatus);
router.delete('/:id', protect, deleteListing);

export default router;
