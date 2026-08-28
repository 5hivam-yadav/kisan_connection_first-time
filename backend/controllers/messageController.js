import { dataStore } from '../services/dataStore.js';

export const getMessages = async (req, res) => {
  try {
    const { recipientId, inquiryId } = req.query;
    const messages = dataStore.getConversation(req.user._id, recipientId, inquiryId);
    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const sender = req.user;
    const { receiverId, inquiryId, listingId, cropName, message, offerPrice, quantity } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ success: false, message: 'Receiver and message content are required' });
    }

    const newMsg = dataStore.createMessage({
      senderId: sender._id,
      senderName: sender.name,
      receiverId,
      inquiryId,
      listingId,
      cropName,
      message,
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
      quantity
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMsg
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
