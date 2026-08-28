import mongoose from 'mongoose';

const negotiationMessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: { type: String },
  senderRole: { type: String },
  offeredPrice: { type: Number },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const inquirySchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName: { type: String, required: true },
  buyerBusiness: { type: String },
  buyerPhone: { type: String },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String, required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing', required: true },
  cropName: { type: String, required: true },
  cropImage: { type: String },
  requestedQuantity: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  proposedPrice: { type: Number, required: true },
  originalListingPrice: { type: Number, required: true },
  requiredDeliveryDate: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'negotiating', 'accepted', 'rejected', 'completed'], 
    default: 'pending' 
  },
  negotiationHistory: [negotiationMessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
