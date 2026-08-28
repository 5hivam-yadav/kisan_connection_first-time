import { dataStore } from '../services/dataStore.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = dataStore.getAdminStats();
    const recentUsers = dataStore.users.slice(0, 8);
    const recentReports = dataStore.getReports();
    res.status(200).json({
      success: true,
      stats,
      recentUsers,
      recentReports
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const user = dataStore.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.verification = {
      ...user.verification,
      isVerified: status === 'verified',
      status: status || 'verified',
      verifiedAt: new Date()
    };

    res.status(200).json({
      success: true,
      message: `User verification updated to ${status}`,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const report = dataStore.resolveReport(req.params.id, status, adminNotes);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Report resolved successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
