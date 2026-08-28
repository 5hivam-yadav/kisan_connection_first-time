import mongoose from 'mongoose';

const farmerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmSize: { type: Number, default: 5 }, // acres
  crops: [{ type: String }],
  farmingPractices: { type: String, enum: ['Organic', 'Conventional', 'Natural Farming', 'Hydroponic', 'Mixed'], default: 'Organic' },
  location: {
    state: String,
    district: String,
    village: String,
    pincode: String
  },
  organicCertified: { type: Boolean, default: false },
  mandiPreference: { type: String, default: 'Nashik APMC Mandi' },
  about: { type: String, default: '' }
});

export const FarmerProfile = mongoose.model('FarmerProfile', farmerProfileSchema);
