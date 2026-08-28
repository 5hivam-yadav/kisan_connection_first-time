import { dataStore } from '../services/dataStore.js';

export const getPrices = async (req, res) => {
  try {
    const prices = dataStore.getAllPrices(req.query);
    res.status(200).json({
      success: true,
      count: prices.length,
      prices,
      disclaimer: "Market prices are indicative and may vary by location, quality, quantity and time. Always verify the latest local market price before making a transaction."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPriceByCrop = async (req, res) => {
  try {
    const priceData = dataStore.getPriceByCrop(req.params.crop);
    res.status(200).json({
      success: true,
      priceData,
      disclaimer: "Market prices are indicative and may vary by location, quality, quantity and time. Always verify the latest local market price before making a transaction."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPriceComparison = async (req, res) => {
  try {
    const { crop } = req.query;
    const priceData = dataStore.getPriceByCrop(crop || 'Tomato');
    const listings = dataStore.getListings({ search: crop || 'Tomato' });

    const avgPlatformPrice = listings.length > 0 
      ? Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length)
      : priceData.platformPrice;

    res.status(200).json({
      success: true,
      crop: priceData.crop,
      mandiAvg: priceData.averagePrice,
      mandiMin: priceData.minimumPrice,
      mandiMax: priceData.maximumPrice,
      platformAvg: avgPlatformPrice,
      referenceRange: priceData.referenceRange,
      demandLevel: priceData.demandLevel,
      demandScore: priceData.demandScore,
      trend: priceData.trendPercentage,
      regionalComparison: [
        { mandi: 'Lasalgaon APMC', state: 'Maharashtra', price: 1850, distance: '12 km' },
        { mandi: 'Azadpur APMC', state: 'Delhi', price: 2150, distance: '1,150 km' },
        { mandi: 'Vashi Market', state: 'Mumbai', price: 2050, distance: '160 km' },
        { mandi: 'Surat APMC', state: 'Gujarat', price: 1950, distance: '220 km' },
        { mandi: 'Kolar APMC', state: 'Karnataka', price: 2200, distance: '980 km' }
      ],
      priceHistory: priceData.priceHistory,
      source: priceData.source,
      updatedAt: priceData.updatedAt,
      disclaimer: "Market prices are indicative and may vary by location, quality, quantity and time. Always verify the latest local market price before making a transaction."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
