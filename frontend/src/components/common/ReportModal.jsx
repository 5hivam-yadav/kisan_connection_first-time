import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const ReportModal = ({ targetId, targetType, targetName, isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [reason, setReason] = useState('Fake Listing');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to report content.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/reports', {
        targetId,
        targetType,
        reason,
        description
      });
      if (res.success) {
        showToast("Report Received", "Thank you for keeping KisanConnect safe. Our team is investigating.");
        onClose();
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-sm">Report Content</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-rose-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-600">
            Reporting: <strong className="text-slate-900">{targetName || targetId}</strong> ({targetType})
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Report *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-rose-500 outline-none"
            >
              <option value="Fake Listing">Fake / Fraudulent Listing</option>
              <option value="Scam / Fraud">Suspicious Payment Request / Scam</option>
              <option value="Incorrect Information">Incorrect Price or Quality Information</option>
              <option value="Inappropriate Content">Inappropriate Language or Images</option>
              <option value="Spam">Spam / Duplicate Posting</option>
              <option value="Other">Other Issues</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Explanation *</label>
            <textarea
              required
              rows="3"
              placeholder="Please provide details to help our moderators review this report..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-rose-500 outline-none"
            ></textarea>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
