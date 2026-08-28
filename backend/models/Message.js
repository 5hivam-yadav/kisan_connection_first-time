import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing' },
  cropName: { type: String },
  message: { type: String, required: true },
  offerPrice: { type: Number },
  quantity: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
