import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CropCard } from '../components/cards/CropCard';
import { VoiceInput } from '../components/common/VoiceInput';
import api from '../services/api';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X, 
  Check, 
  Grid, 
  List, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  MapPin,
  ChevronDown
} from 'lucide-react';

export const MarketplacePage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [state, setState] = useState(searchParams.get('state') || 'All');
  const [quality, setQuality] = useState('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('recentlyListed');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains & Cereals',
    'Pulses & Legumes',
    'Spices & Condiments',
    'Cash Crops',
    'Oilseeds'
  ];

  const states = [
    'All',
    'Maharashtra',
    'Punjab',
    'Gujarat',
    'Karnataka',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Andhra Pradesh',
    'Tamil Nadu',
    'West Bengal',
    'Rajasthan',
    'Haryana',
    'Himachal Pradesh',
    'Telangana'
  ];

  const qualities = [
    'All',
    'Grade A (Premium)',
    'Export Quality',
    'Grade B (Standard)'
  ];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (state && state !== 'All') params.append('state', state);
      if (quality && quality !== 'All') params.append('quality', quality);
      if (organicOnly) params.append('organicOnly', 'true');
      if (verifiedOnly) params.append('verifiedOnly', 'true');
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await api.get(`/listings?${params.toString()}`);
      if (res.success) {
        setListings(res.listings);
      }
    } catch (err) {
      console.log('Error fetching listings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category, state, quality, organicOnly, verifiedOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setState('All');
    setQuality('All');
    setOrganicOnly(false);
    setVerifiedOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('recentlyListed');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Quick Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            🌾 Agricultural Crop Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover verified produce directly from Indian farmers with zero commission
          </p>
        </div>

        {/* Search Bar with Voice Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
          <VoiceInput onResult={(val) => { setSearch(val); fetchListings(); }} />
          <button
            type="submit"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* Horizontal Category Buttons Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Sidebar Filters + Crop Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 font-bold text-sm text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>{t('filters')}</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* State Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Origin State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Quality Grade Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Quality Grade</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              {qualities.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Price (₹ / Quintal)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={fetchListings}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={fetchListings}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>
          </div>

          {/* Toggles: Organic & Verified */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Certified Organic</span>
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Farmers Only</span>
              </span>
            </label>
          </div>

        </aside>

        {/* Product Cards Content Area */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Top Sort & Count Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center space-x-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
              <span className="font-bold text-slate-700">
                {listings.length} {listings.length === 1 ? 'Crop Found' : 'Crops Available'}
              </span>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-1.5 rounded-xl border border-slate-200 font-semibold text-slate-800 text-xs outline-none bg-slate-50"
              >
                <option value="recentlyListed">Recently Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="quantity_desc">Highest Quantity</option>
                <option value="harvest_soon">Harvest Soon</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-3xl skeleton-shimmer"></div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 space-y-3">
              <div className="text-4xl">🌾</div>
              <h3 className="font-bold text-base text-slate-800">{t('noListingsFound')}</h3>
              <p className="text-xs text-slate-500">Try changing your search terms or resetting filters.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <CropCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Slide-Out Filter Panel */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-sm lg:hidden">
          <div className="bg-white w-5/6 max-w-sm h-full p-6 overflow-y-auto space-y-5 ml-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Filter Crops</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded-full">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* State Filter */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Origin State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Quality Grade Filter */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Quality Grade</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  {qualities.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span className="text-xs font-semibold text-slate-700">100% Certified Organic</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span className="text-xs font-semibold text-slate-700">Verified Farmers Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t flex space-x-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2.5 rounded-xl border text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
