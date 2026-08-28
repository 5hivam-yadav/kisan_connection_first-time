import React, { useState, useEffect } from 'react';
import { CropCard } from '../components/cards/CropCard';
import api from '../services/api';
import { Heart } from 'lucide-react';

export const SavedListingsPage = () => {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const res = await api.get('/listings?sortBy=recentlyListed');
        if (res.success) {
          setSavedListings(res.listings.slice(0, 4));
        }
      } catch (err) {
        console.log('Error loading saved listings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          <span>Saved / Bookmarked Produce</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track shortlisted crops and send direct purchase inquiries at the right market time
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedListings.map(l => (
          <CropCard key={l._id} listing={l} isSaved={true} />
        ))}
      </div>
    </div>
  );
};
