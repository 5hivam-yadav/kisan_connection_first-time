import React, { useState } from 'react';
import { X, Send, ShieldCheck, Calendar, IndianRupee, Layers } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import confetti from 'canvas-confetti';

export const InquiryModal = ({ listing, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [proposedPrice, setProposedPrice] = useState(listing ? listing.price : '');
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login as a buyer to send direct purchase inquiries.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/inquiries', {
        listingId: listing._id,
        requestedQuantity: Number(requestedQuantity),
        proposedPrice: Number(proposedPrice),
        requiredDeliveryDate,
        message
      });

      if (res.success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        showToast("Inquiry Sent!", `Direct inquiry sent to farmer ${listing.farmerName}`);
        if (onSuccess) onSuccess(res.inquiry);
        onClose();
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const estTotal = (Number(requestedQuantity) || 0) * (Number(proposedPrice) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-green-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={listing.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'} 
              alt={listing.cropName} 
              className="w-12 h-12 rounded-2xl object-cover border border-white/30"
            />
            <div>
              <h3 className="font-bold text-base text-white leading-tight">{listing.cropName}</h3>
              <p className="text-xs text-emerald-100">Farmer: {listing.farmerName} • {listing.location?.district}, {listing.location?.state}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
            <div>
              <span className="text-emerald-700 font-medium">Farmer's Listed Price:</span>
              <p className="font-bold text-base text-emerald-900">₹{listing.price.toLocaleString()} / {listing.unit}</p>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 font-medium">Available Quantity:</span>
              <p className="font-bold text-base text-emerald-900">{listing.quantity} {listing.unit}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Quantity ({listing.unit}) *
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min="1"
                  max={listing.quantity}
                  placeholder={`e.g. 50`}
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Offer Price (₹ / {listing.unit}) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min="10"
                  placeholder={`e.g. ${listing.price}`}
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none font-semibold text-emerald-700"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Required Delivery / Pickup Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                required
                value={requiredDeliveryDate}
                onChange={(e) => setRequiredDeliveryDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Message / Delivery Specifications *
            </label>
            <textarea
              required
              rows="3"
              placeholder="e.g. We require Grade A sorted produce for immediate dispatch to Vashi warehouse. Truck arranged by us."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none leading-relaxed"
            ></textarea>
          </div>

          {estTotal > 0 && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Estimated Deal Value:</span>
              <span className="text-base font-extrabold text-emerald-700">₹{estTotal.toLocaleString()}</span>
            </div>
          )}

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Send Inquiry to Farmer'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
