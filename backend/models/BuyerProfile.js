import mongoose from 'mongoose';

const buyerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  buyerType: { 
    type: String, 
    enum: ['Wholesaler', 'Retailer', 'Food Processor', 'Restaurant', 'Local Shop', 'Exporter', 'Institutional Buyer'], 
    default: 'Wholesaler' 
  },
  requiredCrops: [{ type: String }],
  typicalQuantity: { type: String, default: '100 - 500 Quintals/month' },
  gstNumber: { type: String, default: '' },
  verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified'], default: 'verified' }
});

export const BuyerProfile = mongoose.model('BuyerProfile', buyerProfileSchema);
