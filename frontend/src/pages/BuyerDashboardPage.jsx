import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CropCard } from '../components/cards/CropCard';
import api from '../services/api';
import { 
  ShoppingCart, 
  Search, 
  MessageSquare, 
  Heart, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Package 
} from 'lucide-react';

export const BuyerDashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [inquiries, setInquiries] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerData = async () => {
      setLoading(true);
      try {
        const [inqRes, listRes] = await Promise.all([
          api.get('/inquiries'),
          api.get('/listings?sortBy=recentlyListed')
        ]);
        if (inqRes.success) setInquiries(inqRes.inquiries);
        if (listRes.success) setSavedListings(listRes.listings.slice(0, 3));
      } catch (err) {
        console.log('Error loading buyer dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyerData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.name || 'Vikram Singhania'} 🏢
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-blue-100 border border-white/30">
              Verified Buyer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-blue-100">
            {user?.businessName || 'AgriFresh Wholesale Logistics'} • Direct farm procurement portal
          </p>
        </div>

        <Link
          to="/marketplace"
          className="px-5 py-3 rounded-2xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs sm:text-sm shadow-lg flex items-center space-x-2 shrink-0 transition-transform hover:scale-105"
        >
          <Search className="w-4 h-4 text-blue-600" />
          <span>Search & Procure Produce</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sent Inquiries</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{inquiries.length}</div>
          <p className="text-[11px] text-slate-500 font-medium">To verified farmers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accepted Deals</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            {inquiries.filter(i => i.status === 'accepted').length}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">Ready for dispatch</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Negotiations</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">
            {inquiries.filter(i => i.status === 'negotiating').length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Ongoing price discussions</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saved Bookmarks</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">
            {savedListings.length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Tracked produce</p>
        </div>
      </div>

      {/* Purchase Inquiries Tracker */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <span>My Purchase Inquiries & Pipeline</span>
        </h2>

        {inquiries.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No active inquiries. Explore marketplace to send direct quotes.</p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq._id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={inq.cropImage || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100'}
                      alt={inq.cropName}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{inq.cropName}</h4>
                      <p className="text-[11px] text-slate-500">Farmer: {inq.farmerName}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                    inq.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inq.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Qty:</span>
                    <p className="font-bold text-slate-800">{inq.requestedQuantity} {inq.unit}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Proposed Rate:</span>
                    <p className="font-bold text-emerald-700">₹{inq.proposedPrice} / {inq.unit}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Value:</span>
                    <p className="font-bold text-slate-800">₹{(inq.requestedQuantity * inq.proposedPrice).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Delivery:</span>
                    <p className="font-bold text-slate-800">{inq.requiredDeliveryDate}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <Link
                    to={`/chat?recipientId=${inq.farmerId}&inquiryId=${inq._id}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-xl"
                  >
                    Open Negotiation Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
