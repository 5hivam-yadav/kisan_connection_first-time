import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'buyer', 'admin'], default: 'farmer' },
  language: { type: String, default: 'en' },
  location: {
    state: { type: String, default: 'Maharashtra' },
    district: { type: String, default: 'Nashik' },
    village: { type: String, default: 'Dindori' },
    pincode: { type: String, default: '422202' },
    coordinates: {
      lat: { type: Number, default: 20.1983 },
      lng: { type: Number, default: 73.8344 }
    }
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    documents: [{ type: String }],
    verifiedAt: { type: Date }
  },
  profileImage: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  rating: { type: Number, default: 4.8 },
  ratingCount: { type: Number, default: 12 },
  businessName: { type: String, default: '' },
  buyerType: { type: String, default: '' },
  requiredCrops: [{ type: String }],
  farmSize: { type: Number, default: 5 },
  cropsGrown: [{ type: String }],
  farmingPractices: { type: String, default: 'Organic' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
