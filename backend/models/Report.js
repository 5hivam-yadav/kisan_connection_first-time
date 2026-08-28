import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reporterName: { type: String },
  targetId: { type: String, required: true },
  targetType: { type: String, enum: ['listing', 'post', 'user', 'comment'], required: true },
  reason: { 
    type: String, 
    enum: ['Fake Listing', 'Scam / Fraud', 'Incorrect Information', 'Inappropriate Content', 'Spam', 'Harassment', 'Other'], 
    required: true 
  },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'investigating', 'resolved', 'dismissed'], default: 'pending' },
  adminNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Report = mongoose.model('Report', reportSchema);
