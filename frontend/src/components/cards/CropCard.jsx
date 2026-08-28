import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle, ShieldCheck, Heart, Sparkles, Send, Eye, Calendar } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { InquiryModal } from '../common/InquiryModal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const CropCard = ({ listing, isSaved, onToggleSave }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [saved, setSaved] = useState(isSaved || false);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSaved = !saved;
    setSaved(newSaved);
    if (onToggleSave) onToggleSave(listing._id, newSaved);
    showToast(newSaved ? "Saved to Bookmarks" : "Removed from Bookmarks", listing.cropName);
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden flex flex-col group relative">
        
        {/* Top Image & Floating Badges */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
          <img
            src={listing.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600'}
            alt={listing.cropName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

          {/* Floating Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 hover:scale-110 transition-all shadow-md z-10"
            title="Save crop listing"
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Category & Organic Badge */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm flex items-center space-x-1">
              <span>{listing.category}</span>
            </span>
            {listing.farmingMethod?.toLowerCase().includes('organic') && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-sm flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>100% Organic</span>
              </span>
            )}
          </div>

          {/* Quality Grade Tag Bottom Left of Image */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
              {listing.quality}
            </span>
          </div>

          {/* Availability Status */}
          <div className="absolute bottom-3 right-3 z-10 text-[10px] text-white/90 font-medium flex items-center space-x-1 bg-black/40 px-2 py-0.5 rounded-lg backdrop-blur-sm">
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span>Ready: {new Date(listing.availabilityDate || listing.harvestDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          
          <div>
            {/* Crop Title */}
            <div className="flex items-start justify-between">
              <Link to={`/listings/${listing._id}`} className="hover:text-emerald-700 transition-colors">
                <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {listing.cropName}
                </h3>
              </Link>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
              Variety: <span className="text-slate-700">{listing.variety}</span>
            </p>

            {/* Farmer Info & Verification */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link 
                to={`/farmer/${listing.farmerId}`} 
                className="flex items-center space-x-1.5 hover:text-emerald-700 font-semibold text-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                  {listing.farmerName?.[0]}
                </div>
                <span className="truncate max-w-[120px]">{listing.farmerName}</span>
                {listing.farmerVerified && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                )}
              </Link>
              <RatingStars rating={listing.farmerRating || 4.8} size="sm" showScore={true} />
            </div>

            {/* Location & Distance */}
            <div className="flex items-center space-x-1 text-xs text-slate-500 mt-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                {listing.location?.district}, {listing.location?.state}
              </span>
            </div>
          </div>

          {/* Pricing & Quantity Box */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Expected Price</span>
                <div className="text-lg font-extrabold text-emerald-700 leading-tight">
                  ₹{listing.price.toLocaleString()}
                  <span className="text-xs font-semibold text-slate-500 ml-1">/ {listing.unit}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Available</span>
                <div className="text-xs font-bold text-slate-800">
                  {listing.quantity.toLocaleString()} {listing.unit}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-3.5">
              <Link
                to={`/listings/${listing._id}`}
                className="py-2 px-3 rounded-xl border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </Link>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inquire</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        listing={listing}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </>
  );
};
