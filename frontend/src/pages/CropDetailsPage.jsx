import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { RatingStars } from '../components/common/RatingStars';
import { PriceDisclaimer } from '../components/common/PriceDisclaimer';
import { InquiryModal } from '../components/common/InquiryModal';
import { ReportModal } from '../components/common/ReportModal';
import api from '../services/api';
import { 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  Phone, 
  MessageSquare, 
  Heart, 
  Calendar, 
  Layers, 
  Award, 
  Sparkles, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  ArrowLeft,
  Share2
} from 'lucide-react';

export const CropDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [listing, setListing] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [priceComparison, setPriceComparison] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/listings/${id}`);
        if (res.success) {
          setListing(res.listing);
          setFarmer(res.farmer);
          setPriceComparison(res.priceComparison);
        }
      } catch (err) {
        showToast("Error", err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="h-96 rounded-3xl skeleton-shimmer"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="text-4xl">🌾</div>
        <h2 className="text-xl font-bold text-slate-800">Crop Listing Not Found</h2>
        <Link to="/marketplace" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold inline-block">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing.cropName, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link Copied", "Crop link copied to clipboard.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setSaved(!saved); showToast(saved ? "Removed" : "Saved", listing.cropName); }}
            className={`p-2 rounded-xl border transition-colors ${saved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Share listing"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Specifications + Pricing Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Images & Crop Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Large Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md bg-slate-900 border-2 border-white">
            <img
              src={listing.images?.[selectedImage] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
              alt={listing.cropName}
              className="w-full h-full object-cover"
            />
            {listing.farmingMethod?.toLowerCase().includes('organic') && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-lg flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Certified Organic</span>
              </span>
            )}
          </div>

          {/* Thumbnail Selector */}
          {listing.images && listing.images.length > 1 && (
            <div className="flex items-center space-x-3">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-emerald-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Crop Specifications Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Crop Specifications & Harvest Details</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Category:</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{listing.category}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Variety:</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{listing.variety}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Quality Grade:</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{listing.quality}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Harvest Date:</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {new Date(listing.harvestDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Farming Practice:</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{listing.farmingMethod}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Packaging:</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{listing.packaging}</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-xs text-slate-700 mb-1">Farmer's Description:</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Farmer Profile Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3.5">
                <img
                  src={farmer?.profileImage || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150'}
                  alt={listing.farmerName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-bold text-sm text-slate-900">{listing.farmerName}</h4>
                    {listing.farmerVerified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{listing.location?.village ? `${listing.location.village}, ` : ''}{listing.location?.district}, {listing.location?.state}</span>
                  </p>
                  <div className="mt-1">
                    <RatingStars rating={listing.farmerRating || 4.8} size="xs" />
                  </div>
                </div>
              </div>

              <Link
                to={`/farmer/${listing.farmerId}`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 rounded-xl text-xs font-bold transition-colors"
              >
                View Profile
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                ✓ Mobile Verified
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                ✓ Land 7/12 Verified
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-semibold">
                🌾 Direct Producer
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Price Comparison Box & Action Buttons (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          {/* Price & Direct Purchase Inquiry Box */}
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/5 space-y-5">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Farmer Expected Rate</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-800">
                  ₹{listing.price.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-500">/ {listing.unit}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Total Available Stock: <strong>{listing.quantity.toLocaleString()} {listing.unit}</strong>
              </p>
            </div>

            {/* Price Comparison Gauge Module */}
            {priceComparison && (
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>📊 Transparent Price Benchmark</span>
                  <span className="text-[11px] px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-full font-bold">
                    {priceComparison.mandiName}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-600">APMC Mandi Modal Rate:</span>
                    <span className="font-bold text-slate-900">₹{priceComparison.mandiAvgPrice?.toLocaleString()} / Qtl</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Platform Average:</span>
                    <span className="font-bold text-emerald-700">₹{priceComparison.platformAvgPrice?.toLocaleString()} / Qtl</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Reference Price Spread:</span>
                    <span className="font-bold text-amber-700">₹{priceComparison.referenceRange?.min} – ₹{priceComparison.referenceRange?.max}</span>
                  </div>
                </div>

                {/* Micro Price Disclaimer */}
                <p className="text-[10px] text-emerald-800/90 pt-1 border-t border-emerald-200/60 leading-tight italic">
                  *Reference prices are indicative market aggregates and not guaranteed selling prices.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-101"
              >
                <Send className="w-4 h-4" />
                <span>Send Direct Inquiry & Offer</span>
              </button>

              <Link
                to={`/chat?recipientId=${listing.farmerId}&listingId=${listing._id}`}
                className="w-full py-3 rounded-2xl border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Chat with Farmer Directly</span>
              </Link>
            </div>

            {/* Contact Details Preference */}
            <div className="pt-2 text-center text-xs text-slate-500">
              <p>Contact Mode: <span className="font-semibold text-slate-800">{listing.contactPreference}</span></p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-[11px] text-slate-400 hover:text-rose-600 font-medium flex items-center space-x-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Suspicious Listing</span>
              </button>
            </div>

          </div>

          {/* Price Disclaimer Component */}
          <PriceDisclaimer />

        </div>

      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        listing={listing}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

      {/* Report Modal */}
      <ReportModal
        targetId={listing._id}
        targetType="listing"
        targetName={listing.cropName}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

    </div>
  );
};
