import { dataStore } from '../services/dataStore.js';

export const getBuyers = async (req, res) => {
  try {
    const { buyerType, state } = req.query;
    let buyers = await dataStore.getAllBuyers();

    if (buyerType && buyerType !== 'All') {
      buyers = buyers.filter(b => b.buyerType?.toLowerCase() === buyerType.toLowerCase());
    }

    if (state && state !== 'All') {
      buyers = buyers.filter(b => b.location.state.toLowerCase() === state.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: buyers.length,
      buyers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuyerById = async (req, res) => {
  try {
    const buyer = await dataStore.findUserById(req.params.id);
    if (!buyer || buyer.role !== 'buyer') {
      return res.status(404).json({ success: false, message: 'Buyer not found' });
    }
    const reviews = await dataStore.getReviewsForUser(buyer._id);
    res.status(200).json({
      success: true,
      buyer,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
