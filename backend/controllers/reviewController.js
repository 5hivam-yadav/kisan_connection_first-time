import { dataStore } from '../services/dataStore.js';

export const getReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await dataStore.getReviewsForUser(userId);
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const reviewer = req.user;
    const { reviewedUserId, listingId, rating, categories, comment } = req.body;

    if (!reviewedUserId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Reviewed user, rating and comment are required' });
    }

    const review = await dataStore.createReview({
      reviewerId: reviewer._id,
      reviewerName: reviewer.name,
      reviewerRole: reviewer.role,
      reviewedUserId,
      listingId,
      rating: Number(rating),
      categories: categories || { communication: 5, productQuality: 5, reliability: 5, accuracy: 5 },
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review and rating submitted successfully!',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
