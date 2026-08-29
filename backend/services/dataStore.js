import { User } from '../models/User.js';
import { CropListing } from '../models/CropListing.js';
import { PriceData } from '../models/PriceData.js';
import { Inquiry } from '../models/Inquiry.js';
import { Message } from '../models/Message.js';
import { CommunityPost } from '../models/CommunityPost.js';
import { Review } from '../models/Review.js';
import { Notification } from '../models/Notification.js';
import { Report } from '../models/Report.js';
import { FarmerProfile } from '../models/FarmerProfile.js';
import { BuyerProfile } from '../models/BuyerProfile.js';

const plain = (value) => (value ? JSON.parse(JSON.stringify(value)) : null);
const plainList = (values) => values.map(plain);
const sameId = (a, b) => String(a) === String(b);
const escapedRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class MongoDataStore {
  async findUserByPhone(phone) { return plain(await User.findOne({ phone }).lean()); }
  async findUserByEmail(email) { return email ? plain(await User.findOne({ email: new RegExp(`^${escapedRegex(email)}$`, 'i') }).lean()) : null; }
  async findUserById(userId) { return plain(await User.findById(userId).lean()); }
  async getAllFarmers() { return plainList(await User.find({ role: 'farmer' }).sort({ createdAt: -1 }).lean()); }
  async getAllBuyers() { return plainList(await User.find({ role: 'buyer' }).sort({ createdAt: -1 }).lean()); }
  async getRecentUsers(limit = 8) { return plainList(await User.find().sort({ createdAt: -1 }).limit(limit).lean()); }

  async createUser(userData) {
    const user = await User.create(userData);
    if (user.role === 'farmer') await FarmerProfile.create({ userId: user._id, farmSize: userData.farmSize, crops: userData.cropsGrown || [], farmingPractices: userData.farmingPractices, location: userData.location });
    if (user.role === 'buyer') await BuyerProfile.create({ userId: user._id, businessName: userData.businessName || user.name, buyerType: userData.buyerType, requiredCrops: userData.requiredCrops || [] });
    return plain(user);
  }
  async updateUser(userId, updateData) { return plain(await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).lean()); }

  async getListings(filters = {}) {
    const query = { status: filters.status || 'active' };
    if (filters.category && filters.category !== 'All') query.category = new RegExp(`^${escapedRegex(filters.category)}$`, 'i');
    if (filters.state && filters.state !== 'All') query['location.state'] = new RegExp(`^${escapedRegex(filters.state)}$`, 'i');
    if (filters.district && filters.district !== 'All') query['location.district'] = new RegExp(`^${escapedRegex(filters.district)}$`, 'i');
    if (filters.quality && filters.quality !== 'All') query.quality = new RegExp(escapedRegex(filters.quality), 'i');
    if (filters.organicOnly === 'true' || filters.organicOnly === true) query.farmingMethod = /organic/i;
    if (filters.verifiedOnly === 'true' || filters.verifiedOnly === true) query.farmerVerified = true;
    if (filters.farmerId) query.farmerId = filters.farmerId;
    if (filters.minPrice || filters.maxPrice) query.price = { ...(filters.minPrice && { $gte: Number(filters.minPrice) }), ...(filters.maxPrice && { $lte: Number(filters.maxPrice) }) };
    if (filters.search) { const search = new RegExp(escapedRegex(filters.search), 'i'); query.$or = [{ cropName: search }, { variety: search }, { 'location.state': search }, { 'location.district': search }, { farmerName: search }, { description: search }]; }
    const sort = filters.sortBy === 'price_asc' ? { price: 1 } : filters.sortBy === 'price_desc' ? { price: -1 } : filters.sortBy === 'quantity_desc' ? { quantity: -1 } : filters.sortBy === 'harvest_soon' ? { harvestDate: 1 } : { createdAt: -1 };
    return plainList(await CropListing.find(query).sort(sort).lean());
  }
  async getListingById(listingId) { return plain(await CropListing.findByIdAndUpdate(listingId, { $inc: { viewsCount: 1 } }, { new: true }).lean()); }
  async findListingById(listingId) { return plain(await CropListing.findById(listingId).lean()); }
  async createListing(data) { return plain(await CropListing.create(data)); }
  async updateListing(listingId, data) { return plain(await CropListing.findByIdAndUpdate(listingId, data, { new: true, runValidators: true }).lean()); }
  async deleteListing(listingId) { return Boolean(await CropListing.findByIdAndDelete(listingId)); }

  async getAllPrices(filters = {}) {
    const query = {};
    if (filters.crop && filters.crop !== 'All') query.crop = new RegExp(escapedRegex(filters.crop), 'i');
    if (filters.state && filters.state !== 'All') query.state = new RegExp(`^${escapedRegex(filters.state)}$`, 'i');
    if (filters.district && filters.district !== 'All') query.district = new RegExp(`^${escapedRegex(filters.district)}$`, 'i');
    return plainList(await PriceData.find(query).lean());
  }
  async getPriceByCrop(crop) { return plain(await PriceData.findOne({ crop: new RegExp(escapedRegex(crop), 'i') }).lean()); }

  async getInquiriesByUser(userId, role) { return plainList(await Inquiry.find(role === 'farmer' ? { farmerId: userId } : role === 'buyer' ? { buyerId: userId } : {}).sort({ createdAt: -1 }).lean()); }
  async getInquiryById(inquiryId) { return plain(await Inquiry.findById(inquiryId).lean()); }
  async createInquiry(data) {
    const inquiry = await Inquiry.create(data);
    await CropListing.findByIdAndUpdate(inquiry.listingId, { $inc: { inquiriesCount: 1 } });
    await this.createNotification({ userId: inquiry.farmerId, type: 'inquiry', title: 'New Buyer Inquiry', message: `${inquiry.buyerName} sent an inquiry for ${inquiry.requestedQuantity} ${inquiry.unit} of ${inquiry.cropName}.`, link: `/farmer/inquiries?inquiry=${inquiry._id}` });
    return plain(inquiry);
  }
  async updateInquiryStatus(inquiryId, status, negotiationMessage = null) {
    const update = { status, updatedAt: new Date() };
    if (negotiationMessage) update.$push = { negotiationHistory: negotiationMessage };
    const inquiry = await Inquiry.findByIdAndUpdate(inquiryId, update, { new: true }).lean();
    if (!inquiry) return null;
    const notifyUser = ['accepted', 'rejected'].includes(status) ? inquiry.buyerId : inquiry.farmerId;
    await this.createNotification({ userId: notifyUser, type: 'inquiry', title: `Inquiry ${status.toUpperCase()}`, message: `Your inquiry for ${inquiry.cropName} is now marked as ${status}.`, link: sameId(notifyUser, inquiry.buyerId) ? '/buyer/inquiries' : `/farmer/inquiries?inquiry=${inquiry._id}` });
    return plain(inquiry);
  }

  async getConversation(user1, user2, inquiryId) { return plainList(await Message.find(inquiryId ? { inquiryId } : { $or: [{ senderId: user1, receiverId: user2 }, { senderId: user2, receiverId: user1 }] }).sort({ createdAt: 1 }).lean()); }
  async createMessage(data) { const message = await Message.create(data); await this.createNotification({ userId: message.receiverId, type: 'message', title: `New message from ${message.senderName || 'user'}`, message: `${message.message.slice(0, 80)}...`, link: '/chat' }); return plain(message); }

  async getPosts(filters = {}) { return plainList(await CommunityPost.find(filters.category && filters.category !== 'All' ? { category: filters.category } : {}).sort({ pinned: -1, createdAt: -1 }).lean()); }
  async getPostById(postId) { return plain(await CommunityPost.findById(postId).lean()); }
  async createPost(data) { return plain(await CommunityPost.create(data)); }
  async toggleLikePost(postId, userId) {
    const post = await CommunityPost.findById(postId); if (!post) return null;
    const index = post.likes.map(String).indexOf(String(userId));
    if (index >= 0) post.likes.splice(index, 1); else post.likes.push(String(userId));
    post.likesCount = post.likes.length; await post.save(); return plain(post);
  }
  async addComment(postId, data) { return plain(await CommunityPost.findByIdAndUpdate(postId, { $push: { comments: data }, $inc: { commentsCount: 1 } }, { new: true }).lean()); }
  async deletePost(postId) { return Boolean(await CommunityPost.findByIdAndDelete(postId)); }
  async getReviewsForUser(userId) { return plainList(await Review.find({ reviewedUserId: userId }).sort({ createdAt: -1 }).lean()); }
  async createReview(data) { return plain(await Review.create(data)); }
  async getNotifications(userId) { return plainList(await Notification.find({ userId }).sort({ createdAt: -1 }).lean()); }
  async createNotification(data) { return plain(await Notification.create(data)); }
  async markNotificationAsRead(notificationId) { return plain(await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true }).lean()); }
  async markAllNotificationsAsRead(userId) { await Notification.updateMany({ userId }, { read: true }); return true; }
  async getReports() { return plainList(await Report.find().sort({ createdAt: -1 }).lean()); }
  async createReport(data) { return plain(await Report.create(data)); }
  async resolveReport(reportId, status, adminNotes = '') { return plain(await Report.findByIdAndUpdate(reportId, { status, adminNotes }, { new: true }).lean()); }
  async getAdminStats() {
    const [totalFarmers, totalBuyers, activeListings, totalInquiries, acceptedDeals, communityPosts, pendingReports, priceDatasets] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'buyer' }),
      CropListing.countDocuments({ status: 'active' }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'accepted' }),
      CommunityPost.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      PriceData.countDocuments()
    ]);
    return { totalFarmers, totalBuyers, activeListings, totalInquiries, acceptedDeals, communityPosts, pendingReports, priceDatasets, totalEstimatedVolume: '0 Quintals' };
  }
}

export const dataStore = new MongoDataStore();
