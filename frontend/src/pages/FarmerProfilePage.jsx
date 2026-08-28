import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RatingStars } from '../components/common/RatingStars';
import { CropCard } from '../components/cards/CropCard';
import api from '../services/api';
import { MapPin, CheckCircle2, Award, Phone, Sprout, MessageSquare } from 'lucide-react';

export const FarmerProfilePage = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/farmers/${id}`);
        if (res.success) {
          setFarmer(res.farmer);
          setListings(res.listings || []);
          setReviews(res.reviews || []);
        }
      } catch (err) {
        console.log('Error loading farmer profile:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-12 skeleton-shimmer h-96 rounded-3xl"></div>;
  }

  if (!farmer) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Farmer Profile Not Found</h2>
        <Link to="/marketplace" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold inline-block">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Profile Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <img
            src={farmer.profileImage || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200'}
            alt={farmer.name}
            className="w-20 h-20 rounded-3xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{farmer.name}</h1>
              {farmer.verification?.isVerified && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{farmer.location?.village ? `${farmer.location.village}, ` : ''}{farmer.location?.district}, {farmer.location?.state}</span>
            </p>
            <div className="pt-1">
              <RatingStars rating={farmer.rating || 4.9} count={farmer.ratingCount || 24} size="sm" />
            </div>
          </div>
        </div>

        <Link
          to={`/chat?recipientId=${farmer._id}`}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact Farmer</span>
        </Link>
      </div>

      {/* Active Listings by this Farmer */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900">
          Available Harvest by {farmer.name} ({listings.length})
        </h2>
        {listings.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No active listings available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(l => (
              <CropCard key={l._id} listing={l} />
            ))}
          </div>
        )}
      </div>

      {/* Reviews & Ratings */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900">Buyer Reviews & Transactions ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400">No buyer reviews yet.</p>
        ) : (
          <div className="space-y-3 divide-y divide-slate-100">
            {reviews.map(r => (
              <div key={r._id} className="pt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">{r.reviewerName}</span>
                  <RatingStars rating={r.rating} size="xs" />
                </div>
                <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
