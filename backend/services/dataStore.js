import { seedUsers, seedListings, seedPrices, seedPosts, seedInquiries, seedMessages, seedReviews, seedNotifications, seedReports } from '../data/seedData.js';
import { v4 as uuidv4 } from 'uuid';

// In-Memory Data Store (High-speed state)
class DataStore {
  constructor() {
    this.users = JSON.parse(JSON.stringify(seedUsers));
    this.listings = JSON.parse(JSON.stringify(seedListings));
    this.prices = JSON.parse(JSON.stringify(seedPrices));
    this.posts = JSON.parse(JSON.stringify(seedPosts));
    this.inquiries = JSON.parse(JSON.stringify(seedInquiries));
    this.messages = JSON.parse(JSON.stringify(seedMessages));
    this.reviews = JSON.parse(JSON.stringify(seedReviews));
    this.notifications = JSON.parse(JSON.stringify(seedNotifications));
    this.reports = JSON.parse(JSON.stringify(seedReports));
  }

  // --- Users ---
  findUserByPhone(phone) {
    return this.users.find(u => u.phone === phone);
  }

  findUserByEmail(email) {
    if (!email) return null;
    return this.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  getAllFarmers() {
    return this.users.filter(u => u.role === 'farmer');
  }

  getAllBuyers() {
    return this.users.filter(u => u.role === 'buyer');
  }

  createUser(userData) {
    const newUser = {
      _id: `usr_${uuidv4().slice(0, 8)}`,
      rating: 4.8,
      ratingCount: 1,
      verification: { isVerified: true, status: 'verified', documents: [] },
      createdAt: new Date(),
      ...userData
    };
    this.users.unshift(newUser);
    return newUser;
  }

  updateUser(id, updateData) {
    const idx = this.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updateData };
    return this.users[idx];
  }

  // --- Listings ---
  getListings(filters = {}) {
    let result = [...this.listings];

    if (filters.status) {
      result = result.filter(l => l.status === filters.status);
    } else {
      result = result.filter(l => l.status === 'active');
    }

    if (filters.category && filters.category !== 'All') {
      result = result.filter(l => l.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.state && filters.state !== 'All') {
      result = result.filter(l => l.location.state.toLowerCase() === filters.state.toLowerCase());
    }

    if (filters.district && filters.district !== 'All') {
      result = result.filter(l => l.location.district.toLowerCase() === filters.district.toLowerCase());
    }

    if (filters.quality && filters.quality !== 'All') {
      result = result.filter(l => l.quality.toLowerCase().includes(filters.quality.toLowerCase()));
    }

    if (filters.organicOnly === 'true' || filters.organicOnly === true) {
      result = result.filter(l => l.farmingMethod.toLowerCase().includes('organic'));
    }

    if (filters.verifiedOnly === 'true' || filters.verifiedOnly === true) {
      result = result.filter(l => l.farmerVerified === true);
    }

    if (filters.minPrice) {
      result = result.filter(l => l.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(l => l.price <= Number(filters.maxPrice));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(l => 
        l.cropName.toLowerCase().includes(q) ||
        l.variety.toLowerCase().includes(q) ||
        l.location.state.toLowerCase().includes(q) ||
        l.location.district.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      );
    }

    if (filters.farmerId) {
      result = result.filter(l => l.farmerId === filters.farmerId);
    }

    // Sorting
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'quantity_desc') {
      result.sort((a, b) => b.quantity - a.quantity);
    } else if (filters.sortBy === 'harvest_soon') {
      result.sort((a, b) => new Date(a.harvestDate) - new Date(b.harvestDate));
    } else {
      // Default: recently listed
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  getListingById(id) {
    const listing = this.listings.find(l => l._id === id);
    if (listing) {
      listing.viewsCount = (listing.viewsCount || 0) + 1;
    }
    return listing;
  }

  createListing(listingData) {
    const newListing = {
      _id: `list_${uuidv4().slice(0, 8)}`,
      viewsCount: 0,
      inquiriesCount: 0,
      status: 'active',
      createdAt: new Date(),
      ...listingData
    };
    this.listings.unshift(newListing);
    return newListing;
  }

  updateListing(id, updateData) {
    const idx = this.listings.findIndex(l => l._id === id);
    if (idx === -1) return null;
    this.listings[idx] = { ...this.listings[idx], ...updateData };
    return this.listings[idx];
  }

  deleteListing(id) {
    const idx = this.listings.findIndex(l => l._id === id);
    if (idx === -1) return false;
    this.listings.splice(idx, 1);
    return true;
  }

  // --- Prices ---
  getAllPrices(filters = {}) {
    let result = [...this.prices];
    if (filters.crop && filters.crop !== 'All') {
      result = result.filter(p => p.crop.toLowerCase().includes(filters.crop.toLowerCase()));
    }
    if (filters.state && filters.state !== 'All') {
      result = result.filter(p => p.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.district && filters.district !== 'All') {
      result = result.filter(p => p.district.toLowerCase() === filters.district.toLowerCase());
    }
    return result;
  }

  getPriceByCrop(cropName) {
    return this.prices.find(p => p.crop.toLowerCase().includes(cropName.toLowerCase())) || this.prices[0];
  }

  // --- Inquiries ---
  getInquiriesByUser(userId, role) {
    if (role === 'farmer') {
      return this.inquiries.filter(i => i.farmerId === userId);
    } else if (role === 'buyer') {
      return this.inquiries.filter(i => i.buyerId === userId);
    }
    return this.inquiries;
  }

  getInquiryById(id) {
    return this.inquiries.find(i => i._id === id);
  }

  createInquiry(inquiryData) {
    const newInquiry = {
      _id: `inq_${uuidv4().slice(0, 8)}`,
      status: 'pending',
      negotiationHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...inquiryData
    };
    this.inquiries.unshift(newInquiry);

    // Update listing inquiriesCount
    const listing = this.listings.find(l => l._id === inquiryData.listingId);
    if (listing) {
      listing.inquiriesCount = (listing.inquiriesCount || 0) + 1;
    }

    // Add Notification for farmer
    this.createNotification({
      userId: inquiryData.farmerId,
      type: 'inquiry',
      title: 'New Buyer Inquiry',
      message: `${inquiryData.buyerName} sent an inquiry for ${inquiryData.requestedQuantity} ${inquiryData.unit || 'Quintals'} of ${inquiryData.cropName}.`,
      link: '/farmer/inquiries'
    });

    return newInquiry;
  }

  updateInquiryStatus(id, status, negotiationMessage = null) {
    const inquiry = this.inquiries.find(i => i._id === id);
    if (!inquiry) return null;
    inquiry.status = status;
    inquiry.updatedAt = new Date();
    if (negotiationMessage) {
      inquiry.negotiationHistory.push({
        ...negotiationMessage,
        createdAt: new Date()
      });
    }

    // Create notification
    const notifyUser = status === 'accepted' || status === 'rejected' ? inquiry.buyerId : inquiry.farmerId;
    this.createNotification({
      userId: notifyUser,
      type: 'inquiry',
      title: `Inquiry ${status.toUpperCase()}`,
      message: `Your inquiry for ${inquiry.cropName} is now marked as ${status}.`,
      link: inquiry.buyerId === notifyUser ? '/buyer/inquiries' : '/farmer/inquiries'
    });

    return inquiry;
  }

  // --- Messages / Chat ---
  getConversation(user1, user2, inquiryId) {
    return this.messages.filter(m => 
      (m.inquiryId === inquiryId) ||
      (m.senderId === user1 && m.receiverId === user2) ||
      (m.senderId === user2 && m.receiverId === user1)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  createMessage(messageData) {
    const newMsg = {
      _id: `msg_${uuidv4().slice(0, 8)}`,
      read: false,
      createdAt: new Date(),
      ...messageData
    };
    this.messages.push(newMsg);

    this.createNotification({
      userId: messageData.receiverId,
      type: 'message',
      title: `New message from ${messageData.senderName || 'user'}`,
      message: messageData.message.slice(0, 80) + '...',
      link: '/chat'
    });

    return newMsg;
  }

  // --- Community Posts ---
  getPosts(filters = {}) {
    let result = [...this.posts];
    if (filters.category && filters.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q) ||
        p.cropTag.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.createdAt) - new Date(a.createdAt));
  }

  getPostById(id) {
    return this.posts.find(p => p._id === id);
  }

  createPost(postData) {
    const newPost = {
      _id: `post_${uuidv4().slice(0, 8)}`,
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      sharesCount: 0,
      pinned: false,
      createdAt: new Date(),
      ...postData
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  toggleLikePost(postId, userId) {
    const post = this.posts.find(p => p._id === postId);
    if (!post) return null;
    const idx = post.likes.indexOf(userId);
    if (idx === -1) {
      post.likes.push(userId);
      post.likesCount = post.likes.length;
    } else {
      post.likes.splice(idx, 1);
      post.likesCount = post.likes.length;
    }
    return post;
  }

  addComment(postId, commentData) {
    const post = this.posts.find(p => p._id === postId);
    if (!post) return null;
    const newComment = {
      _id: `cmt_${uuidv4().slice(0, 6)}`,
      createdAt: new Date(),
      ...commentData
    };
    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    return post;
  }

  deletePost(postId) {
    const idx = this.posts.findIndex(p => p._id === postId);
    if (idx === -1) return false;
    this.posts.splice(idx, 1);
    return true;
  }

  // --- Reviews ---
  getReviewsForUser(userId) {
    return this.reviews.filter(r => r.reviewedUserId === userId);
  }

  createReview(reviewData) {
    const newReview = {
      _id: `rev_${uuidv4().slice(0, 8)}`,
      createdAt: new Date(),
      ...reviewData
    };
    this.reviews.unshift(newReview);
    return newReview;
  }

  // --- Notifications ---
  getNotifications(userId) {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createNotification(notifData) {
    const notif = {
      _id: `notif_${uuidv4().slice(0, 8)}`,
      read: false,
      createdAt: new Date(),
      ...notifData
    };
    this.notifications.unshift(notif);
    return notif;
  }

  markNotificationAsRead(id) {
    const notif = this.notifications.find(n => n._id === id);
    if (notif) notif.read = true;
    return notif;
  }

  markAllNotificationsAsRead(userId) {
    this.notifications.filter(n => n.userId === userId).forEach(n => n.read = true);
    return true;
  }

  // --- Reports ---
  getReports() {
    return this.reports;
  }

  createReport(reportData) {
    const newReport = {
      _id: `rep_${uuidv4().slice(0, 8)}`,
      status: 'pending',
      createdAt: new Date(),
      ...reportData
    };
    this.reports.unshift(newReport);
    return newReport;
  }

  resolveReport(id, status, adminNotes = '') {
    const report = this.reports.find(r => r._id === id);
    if (report) {
      report.status = status;
      report.adminNotes = adminNotes;
    }
    return report;
  }

  // --- Admin Stats ---
  getAdminStats() {
    return {
      totalFarmers: this.users.filter(u => u.role === 'farmer').length,
      totalBuyers: this.users.filter(u => u.role === 'buyer').length,
      activeListings: this.listings.filter(l => l.status === 'active').length,
      totalInquiries: this.inquiries.length,
      acceptedDeals: this.inquiries.filter(i => i.status === 'accepted').length,
      communityPosts: this.posts.length,
      pendingReports: this.reports.filter(r => r.status === 'pending').length,
      priceDatasets: this.prices.length,
      totalEstimatedVolume: '14,250 Quintals'
    };
  }
}

export const dataStore = new DataStore();
