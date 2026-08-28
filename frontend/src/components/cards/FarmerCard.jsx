import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2, Award, Phone } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';

export const FarmerCard = ({ farmer }) => {
  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
      <div className="flex items-start space-x-3.5">
        <img
          src={farmer.profileImage || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200'}
          alt={farmer.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-sm"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-1.5">
            <h4 className="font-bold text-sm text-slate-900">{farmer.name}</h4>
            {farmer.verification?.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            )}
          </div>
          <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{farmer.location?.village ? `${farmer.location.village}, ` : ''}{farmer.location?.district}, {farmer.location?.state}</span>
          </div>
          <div className="mt-1">
            <RatingStars rating={farmer.rating || 4.9} count={farmer.ratingCount || 20} size="xs" />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
          🌾 {farmer.farmSize || 5} Acres Farm
        </span>
        <Link
          to={`/farmer/${farmer._id}`}
          className="text-xs font-bold text-slate-700 hover:text-emerald-700"
        >
          View Listings & Profile →
        </Link>
      </div>
    </div>
  );
};
