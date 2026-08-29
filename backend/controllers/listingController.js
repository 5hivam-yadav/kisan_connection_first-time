import { dataStore } from '../services/dataStore.js';

export const getListings = async (req, res) => {
  try {
    const listings = await dataStore.getListings(req.query);
    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await dataStore.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Crop listing not found' });
    }

    // Attach matching Mandi price & comparison stats
    const matchingPrice = await dataStore.getPriceByCrop(listing.cropName);
    const farmerInfo = await dataStore.findUserById(listing.farmerId);

    res.status(200).json({
      success: true,
      listing,
      farmer: farmerInfo,
      priceComparison: matchingPrice ? {
        farmerPrice: listing.price,
        mandiAvgPrice: matchingPrice.averagePrice,
        mandiMinPrice: matchingPrice.minimumPrice,
        mandiMaxPrice: matchingPrice.maximumPrice,
        platformAvgPrice: matchingPrice.platformPrice,
        referenceRange: matchingPrice.referenceRange,
        mandiName: matchingPrice.market,
        trendPercentage: matchingPrice.trendPercentage,
        demandLevel: matchingPrice.demandLevel,
        disclaimer: "Market prices are indicative and may vary by location, quality, quantity and time. Always verify the latest local market price before making a transaction."
      } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createListing = async (req, res) => {
  try {
    const farmer = req.user;
    const {
      cropName,
      category,
      variety,
      quantity,
      unit,
      quality,
      price,
      harvestDate,
      availabilityDate,
      location,
      images,
      farmingMethod,
      description,
      packaging,
      contactPreference
    } = req.body;

    if (!cropName || !category || !quantity || !price) {
      return res.status(400).json({ success: false, message: 'Crop name, category, quantity and price are required' });
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
    ];

    const newListing = await dataStore.createListing({
      farmerId: farmer._id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      farmerRating: farmer.rating || 4.9,
      farmerVerified: farmer.verification?.isVerified || true,
      cropName,
      category,
      variety: variety || 'Standard High Yield',
      quantity: Number(quantity),
      unit: unit || 'Quintal',
      quality: quality || 'Grade A (Premium)',
      price: Number(price),
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      availabilityDate: availabilityDate ? new Date(availabilityDate) : new Date(),
      location: location || farmer.location,
      images: images && images.length > 0 ? images : defaultImages,
      farmingMethod: farmingMethod || '100% Certified Organic',
      description: description || 'Fresh farm harvest available for direct delivery and buyer pickup.',
      packaging: packaging || 'Standard Gunny Bags / Ventilated Crates',
      contactPreference: contactPreference || 'All (Phone + Chat + Inquiry)'
    });

    res.status(201).json({
      success: true,
      message: 'Crop listing published successfully to KisanConnect marketplace!',
      listing: newListing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await dataStore.findListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.farmerId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this listing' });
    }

    const updated = await dataStore.updateListing(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleListingStatus = async (req, res) => {
  try {
    const listing = await dataStore.findListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const newStatus = listing.status === 'active' ? 'paused' : 'active';
    const updated = await dataStore.updateListing(req.params.id, { status: newStatus });

    res.status(200).json({
      success: true,
      message: `Listing status updated to ${newStatus}`,
      listing: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await dataStore.findListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.farmerId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await dataStore.deleteListing(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
