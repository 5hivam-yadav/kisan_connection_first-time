import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import { seedUsers, seedListings, seedPrices, seedPosts, seedInquiries, seedMessages, seedReviews, seedNotifications, seedReports } from '../data/seedData.js';
import { User } from '../models/User.js';
import { CropListing } from '../models/CropListing.js';
import { PriceData } from '../models/PriceData.js';
import { CommunityPost } from '../models/CommunityPost.js';
import { Inquiry } from '../models/Inquiry.js';
import { Message } from '../models/Message.js';
import { Review } from '../models/Review.js';
import { Notification } from '../models/Notification.js';
import { Report } from '../models/Report.js';
import { FarmerProfile } from '../models/FarmerProfile.js';
import { BuyerProfile } from '../models/BuyerProfile.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mapId = (mapping, sourceId) => mapping.get(sourceId)?.toString();

const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required in backend/.env');
  await mongoose.connect(process.env.MONGODB_URI);

  if (await User.exists({})) {
    throw new Error('MongoDB already contains users. Seed is intentionally non-destructive and will not overwrite data.');
  }

  const users = await User.insertMany(seedUsers.map(({ _id, ...user }) => user));
  const userIds = new Map(seedUsers.map((user, index) => [user._id, users[index]._id]));

  await FarmerProfile.insertMany(seedUsers
    .filter((user) => user.role === 'farmer')
    .map((user) => ({ userId: mapId(userIds, user._id), farmSize: user.farmSize || 5, crops: user.cropsGrown || [], farmingPractices: user.farmingPractices || 'Organic', location: user.location })));
  await BuyerProfile.insertMany(seedUsers
    .filter((user) => user.role === 'buyer')
    .map((user) => ({ userId: mapId(userIds, user._id), businessName: user.businessName || user.name, buyerType: user.buyerType || 'Wholesaler', requiredCrops: user.requiredCrops || [] })));

  const listings = await CropListing.insertMany(seedListings.map(({ _id, farmerId, ...listing }) => ({ ...listing, farmerId: mapId(userIds, farmerId) })));
  const listingIds = new Map(seedListings.map((listing, index) => [listing._id, listings[index]._id]));

  await PriceData.insertMany(seedPrices);
  await CommunityPost.insertMany(seedPosts.map(({ _id, authorId, comments = [], ...post }) => ({
    ...post,
    authorId: mapId(userIds, authorId),
    likes: (post.likes || []).map((userId) => mapId(userIds, userId)).filter(Boolean),
    comments: comments.map(({ userId, ...comment }) => ({ ...comment, userId: mapId(userIds, userId) }))
  })));

  const inquiries = await Inquiry.insertMany(seedInquiries.map(({ _id, buyerId, farmerId, listingId, negotiationHistory = [], ...inquiry }) => ({
    ...inquiry,
    buyerId: mapId(userIds, buyerId),
    farmerId: mapId(userIds, farmerId),
    listingId: mapId(listingIds, listingId),
    negotiationHistory: negotiationHistory.map(({ senderId, ...entry }) => ({ ...entry, senderId: mapId(userIds, senderId) }))
  })));
  const inquiryIds = new Map(seedInquiries.map((inquiry, index) => [inquiry._id, inquiries[index]._id]));

  await Message.insertMany(seedMessages.map(({ _id, senderId, receiverId, inquiryId, listingId, ...message }) => ({ ...message, senderId: mapId(userIds, senderId), receiverId: mapId(userIds, receiverId), inquiryId: mapId(inquiryIds, inquiryId), listingId: mapId(listingIds, listingId) })));
  await Review.insertMany(seedReviews.map(({ _id, reviewerId, reviewedUserId, listingId, ...review }) => ({ ...review, reviewerId: mapId(userIds, reviewerId), reviewedUserId: mapId(userIds, reviewedUserId), listingId: mapId(listingIds, listingId) })));
  await Notification.insertMany(seedNotifications.map(({ _id, userId, ...notification }) => ({ ...notification, userId: mapId(userIds, userId) })));
  await Report.insertMany(seedReports.map(({ _id, reporterId, ...report }) => ({ ...report, reporterId: mapId(userIds, reporterId) })));

  console.log(`Seeded ${users.length} users, ${listings.length} listings, ${inquiries.length} inquiries, and all related MongoDB records.`);
};

run()
  .catch((error) => { console.error(`Seed failed: ${error.message}`); process.exitCode = 1; })
  .finally(async () => mongoose.disconnect());
