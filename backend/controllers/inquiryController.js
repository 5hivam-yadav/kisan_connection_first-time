import { dataStore } from '../services/dataStore.js';

export const getInquiries = async (req, res) => {
  try {
    const user = req.user;
    const inquiries = dataStore.getInquiriesByUser(user._id, user.role);
    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInquiry = async (req, res) => {
  try {
    const buyer = req.user;
    const { listingId, requestedQuantity, proposedPrice, requiredDeliveryDate, message } = req.body;

    const listing = dataStore.getListingById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Crop listing not found' });
    }

    if (!requestedQuantity || !proposedPrice || !message) {
      return res.status(400).json({ success: false, message: 'Quantity, proposed price and message are required' });
    }

    const inquiry = dataStore.createInquiry({
      buyerId: buyer._id,
      buyerName: buyer.name,
      buyerBusiness: buyer.businessName || 'Verified Buyer',
      buyerPhone: buyer.phone,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      listingId: listing._id,
      cropName: listing.cropName,
      cropImage: listing.images?.[0] || '',
      requestedQuantity: Number(requestedQuantity),
      unit: listing.unit,
      proposedPrice: Number(proposedPrice),
      originalListingPrice: listing.price,
      requiredDeliveryDate: requiredDeliveryDate || 'Immediate Dispatch',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry sent directly to farmer!',
      inquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, counterPrice, message } = req.body;

    const existing = dataStore.getInquiryById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    let negotiationMessage = null;
    if (status === 'negotiating' && (counterPrice || message)) {
      negotiationMessage = {
        senderId: req.user._id,
        senderName: req.user.name,
        senderRole: req.user.role,
        offeredPrice: counterPrice ? Number(counterPrice) : existing.proposedPrice,
        message: message || `Counter offer: ₹${counterPrice}/unit`
      };
    }

    const updated = dataStore.updateInquiryStatus(id, status, negotiationMessage);

    res.status(200).json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      inquiry: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
