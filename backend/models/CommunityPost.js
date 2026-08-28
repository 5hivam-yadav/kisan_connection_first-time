import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userRole: { type: String, default: 'farmer' },
  userAvatar: { type: String },
  userLocation: { type: String },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const communityPostSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, default: 'farmer' },
  authorLocation: { type: String, default: 'Nashik, Maharashtra' },
  authorAvatar: { type: String },
  authorVerified: { type: Boolean, default: true },
  category: { 
    type: String, 
    enum: [
      'Crop Tips', 
      'Pest Management', 
      'Fertilizers & Nutrients', 
      'Irrigation & Water', 
      'Farm Equipment & Tech', 
      'Weather Advisory', 
      'Market & Mandi Updates', 
      'Success Stories', 
      'Questions & Q&A'
    ], 
    required: true 
  },
  cropTag: { type: String, default: 'General' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  likes: [{ type: String }], // user ids
  likesCount: { type: Number, default: 0 },
  comments: [commentSchema],
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
