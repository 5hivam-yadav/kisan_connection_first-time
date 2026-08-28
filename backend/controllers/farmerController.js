import { dataStore } from '../services/dataStore.js';

export const getFarmers = async (req, res) => {
  try {
    const { state, crop, search } = req.query;
    let farmers = dataStore.getAllFarmers();

    if (state && state !== 'All') {
      farmers = farmers.filter(f => f.location.state.toLowerCase() === state.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      farmers = farmers.filter(f => 
        f.name.toLowerCase().includes(q) ||
        f.location.district.toLowerCase().includes(q) ||
        f.location.village?.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: farmers.length,
      farmers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFarmerById = async (req, res) => {
  try {
    const farmer = dataStore.findUserById(req.params.id);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    const listings = dataStore.getListings({ farmerId: farmer._id });
    const reviews = dataStore.getReviewsForUser(farmer._id);
    const posts = dataStore.getPosts().filter(p => p.authorId === farmer._id);

    res.status(200).json({
      success: true,
      farmer,
      listings,
      reviews,
      posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
