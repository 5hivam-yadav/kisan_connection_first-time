import mongoose from 'mongoose';

const priceHistoryItemSchema = new mongoose.Schema({
  date: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  modalPrice: { type: Number, required: true },
  platformAvg: { type: Number, required: true },
  demandIndex: { type: Number, default: 75 } // 0 - 100
});

const priceDataSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  category: { type: String, required: true },
  unit: { type: String, default: 'Quintal' },
  state: { type: String, required: true },
  district: { type: String, required: true },
  market: { type: String, required: true }, // e.g. "Lasalgaon Mandi", "Azadpur Mandi"
  minimumPrice: { type: Number, required: true },
  maximumPrice: { type: Number, required: true },
  averagePrice: { type: Number, required: true }, // Modal price
  platformPrice: { type: Number, required: true },
  referenceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  demandLevel: { type: String, enum: ['High Demand', 'Medium Demand', 'Low Demand'], default: 'High Demand' },
  demandScore: { type: Number, default: 85 }, // percentage
  trendPercentage: { type: String, default: '+4.5%' },
  trendDirection: { type: String, enum: ['up', 'down', 'stable'], default: 'up' },
  priceHistory: [priceHistoryItemSchema],
  source: { type: String, default: 'AGMARKNET / State APMC Mandi Realtime Feeds' },
  updatedAt: { type: String, default: '28 Aug 2026' }
});

export const PriceData = mongoose.model('PriceData', priceDataSchema);
