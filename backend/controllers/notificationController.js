import { dataStore } from '../services/dataStore.js';

export const getNotifications = async (req, res) => {
  try {
    const notifs = await dataStore.getNotifications(req.user._id);
    const unreadCount = notifs.filter(n => !n.read).length;
    res.status(200).json({
      success: true,
      count: notifs.length,
      unreadCount,
      notifications: notifs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notif = await dataStore.markNotificationAsRead(req.params.id);
    res.status(200).json({
      success: true,
      notification: notif
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await dataStore.markAllNotificationsAsRead(req.user._id);
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
