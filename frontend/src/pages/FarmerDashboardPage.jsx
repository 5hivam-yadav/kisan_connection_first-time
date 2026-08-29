import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { 
  Sprout, 
  PlusCircle, 
  TrendingUp, 
  MessageSquare, 
  Package, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trash2, 
  Eye, 
  Pause, 
  Play, 
  IndianRupee,
  Users,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const FarmerDashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotification();
  const [searchParams] = useSearchParams();
  const inquiryIdFromNotification = searchParams.get('inquiry');
  const inquiryRefs = useRef({});

  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [negotiateMessage, setNegotiateMessage] = useState('');
  const [highlightedInquiry, setHighlightedInquiry] = useState(null);

  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      const [listingsRes, inquiriesRes] = await Promise.all([
        api.get(`/listings?farmerId=${user?._id || 'usr_farmer_01'}`),
        api.get('/inquiries')
      ]);
      if (listingsRes.success) setListings(listingsRes.listings);
      if (inquiriesRes.success) setInquiries(inquiriesRes.inquiries);
    } catch (err) {
      console.log('Error fetching farmer dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerData();
  }, [user]);

  useEffect(() => {
    if (!inquiryIdFromNotification || !inquiries.some((inquiry) => inquiry._id === inquiryIdFromNotification)) return;

    const target = inquiryRefs.current[inquiryIdFromNotification];
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedInquiry(inquiryIdFromNotification);
    const timer = setTimeout(() => setHighlightedInquiry(null), 3500);
    return () => clearTimeout(timer);
  }, [inquiries, inquiryIdFromNotification]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/listings/${id}/toggle-status`);
      if (res.success) {
        showToast("Status Updated", res.message);
        setListings(prev => prev.map(l => l._id === id ? res.listing : l));
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this crop listing?")) return;
    try {
      const res = await api.delete(`/listings/${id}`);
      if (res.success) {
        showToast("Deleted", "Crop listing removed.");
        setListings(prev => prev.filter(l => l._id !== id));
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, status) => {
    try {
      const res = await api.put(`/inquiries/${inquiryId}`, {
        status,
        counterPrice: status === 'negotiating' ? counterPrice : undefined,
        message: status === 'negotiating' ? negotiateMessage : undefined
      });
      if (res.success) {
        showToast("Inquiry Updated", `Status changed to ${status}`);
        setInquiries(prev => prev.map(i => i._id === inquiryId ? res.inquiry : i));
        setSelectedInquiry(null);
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  const totalProduceValue = listings.reduce((sum, l) => sum + (l.price * l.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaste, {user?.name || 'Shivam yadav'}! 👨‍🌾
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-emerald-100 border border-white/30">
              Verified Farmer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100">
            {user?.location?.district || 'Nashik'}, {user?.location?.state || 'Maharashtra'} • Manage your crop listings and direct buyer inquiries
          </p>
        </div>

        <Link
          to="/farmer/create-listing"
          className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm shadow-lg flex items-center space-x-2 shrink-0 transition-transform hover:scale-105"
        >
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <span>+ Add New Crop Listing</span>
        </Link>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Listings</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{listings.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Published on Marketplace</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Inquiries</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{inquiries.length}</div>
          <p className="text-[11px] text-slate-500 font-medium">From verified buyers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accepted Deals</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            {inquiries.filter(i => i.status === 'accepted').length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Ready for dispatch</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Produce Value</span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-800">
            ₹{totalProduceValue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Across active crops</p>
        </div>
      </div>

      {/* Received Inquiries Manager Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Incoming Buyer Inquiries ({inquiries.length})</span>
            </h2>
            <p className="text-xs text-slate-500">Negotiate and accept direct purchase requests</p>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No buyer inquiries received yet.</p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq._id}
                ref={(node) => {
                  if (node) inquiryRefs.current[inq._id] = node;
                }}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  highlightedInquiry === inq._id
                    ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100'
                    :
                  inq.status === 'accepted'
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : inq.status === 'negotiating'
                    ? 'border-blue-200 bg-blue-50/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={inq.cropImage || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100'}
                      alt={inq.cropName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{inq.cropName}</h4>
                      <p className="text-xs text-slate-500">
                        Buyer: <strong className="text-slate-800">{inq.buyerName}</strong> ({inq.buyerBusiness || 'Wholesale Buyer'})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      inq.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inq.status === 'negotiating'
                        ? 'bg-blue-100 text-blue-800'
                        : inq.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-slate-400">Qty Requested:</span>
                    <p className="font-bold text-slate-800">{inq.requestedQuantity} {inq.unit}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Offered Price:</span>
                    <p className="font-bold text-emerald-700">₹{inq.proposedPrice} / {inq.unit}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Listed Price:</span>
                    <p className="font-bold text-slate-800">₹{inq.originalListingPrice} / {inq.unit}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Delivery Date:</span>
                    <p className="font-bold text-slate-800">{inq.requiredDeliveryDate}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 italic">
                  "{inq.message}"
                </p>

                {/* Negotiation Thread if exists */}
                {inq.negotiationHistory && inq.negotiationHistory.length > 0 && (
                  <div className="pl-3 border-l-2 border-blue-400 space-y-1.5 pt-1 text-xs">
                    {inq.negotiationHistory.map((n, idx) => (
                      <div key={idx} className="text-slate-600">
                        <span className="font-bold text-slate-800">{n.senderName} ({n.senderRole}):</span> offered ₹{n.offeredPrice}/unit — "{n.message}"
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {inq.status !== 'accepted' && inq.status !== 'rejected' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => handleUpdateInquiryStatus(inq._id, 'accepted')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept Inquiry</span>
                    </button>

                    <button
                      onClick={() => setSelectedInquiry(selectedInquiry === inq._id ? null : inq._id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Send Counter Offer</span>
                    </button>

                    <button
                      onClick={() => handleUpdateInquiryStatus(inq._id, 'rejected')}
                      className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold"
                    >
                      Decline
                    </button>

                    <Link
                      to={`/chat?recipientId=${inq.buyerId}&inquiryId=${inq._id}`}
                      className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Open Chat</span>
                    </Link>
                  </div>
                )}

                {/* Counter Offer Form Expansion */}
                {selectedInquiry === inq._id && (
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 space-y-2 animate-in fade-in duration-150">
                    <h5 className="font-bold text-xs text-blue-950">Counter Offer Details</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Your Counter Rate (₹/unit)"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(e.target.value)}
                        className="p-2 rounded-lg border border-slate-200 text-xs outline-none bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Reason / Packaging note"
                        value={negotiateMessage}
                        onChange={(e) => setNegotiateMessage(e.target.value)}
                        className="p-2 rounded-lg border border-slate-200 text-xs outline-none bg-white"
                      />
                    </div>
                    <button
                      onClick={() => handleUpdateInquiryStatus(inq._id, 'negotiating')}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Counter Offer</span>
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Crop Listings Table Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>My Active Crop Listings ({listings.length})</span>
          </h2>
          <Link
            to="/farmer/create-listing"
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            + Create New
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="p-3">Crop & Variety</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Listed Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Views</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.map((l) => (
                <tr key={l._id} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={l.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100'}
                        alt={l.cropName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{l.cropName}</span>
                        <span className="text-[11px] text-slate-400">{l.variety} • {l.quality}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-slate-800">
                    {l.quantity} {l.unit}
                  </td>
                  <td className="p-3 font-bold text-emerald-700">
                    ₹{l.price.toLocaleString()} / {l.unit}
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      l.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-medium">
                    {l.viewsCount || 0}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      to={`/listings/${l._id}`}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 inline-block"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(l._id)}
                      className="p-1.5 text-slate-500 hover:text-amber-600"
                      title={l.status === 'active' ? "Pause listing" : "Activate listing"}
                    >
                      {l.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteListing(l._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
