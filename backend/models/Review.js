import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerName: { type: String, required: true },
  reviewerRole: { type: String, enum: ['farmer', 'buyer'], required: true },
  reviewedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing' },
  rating: { type: Number, min: 1, max: 5, required: true },
  categories: {
    communication: { type: Number, min: 1, max: 5, default: 5 },
    productQuality: { type: Number, min: 1, max: 5, default: 5 },
    reliability: { type: Number, min: 1, max: 5, default: 5 },
    accuracy: { type: Number, min: 1, max: 5, default: 5 }
  },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Review = mongoose.model('Review', reviewSchema);
