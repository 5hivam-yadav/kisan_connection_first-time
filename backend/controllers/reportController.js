import { dataStore } from '../services/dataStore.js';

export const createReport = async (req, res) => {
  try {
    const { targetId, targetType, reason, description } = req.body;
    if (!targetId || !targetType || !reason || !description) {
      return res.status(400).json({ success: false, message: 'Target ID, type, reason and description are required' });
    }

    const report = await dataStore.createReport({
      reporterId: req.user._id,
      reporterName: req.user.name,
      targetId,
      targetType,
      reason,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted for administrative review. Thank you for keeping KisanConnect safe!',
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
