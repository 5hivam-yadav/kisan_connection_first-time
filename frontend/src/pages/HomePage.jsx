import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CropCard } from '../components/cards/CropCard';
import { VoiceInput } from '../components/common/VoiceInput';
import { PriceDisclaimer } from '../components/common/PriceDisclaimer';
import api from '../services/api';
import { 
  Sprout, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Sparkles, 
  PhoneCall, 
  Award,
  Layers,
  ChevronRight,
  TrendingDown,
  Activity,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

export const HomePage = ({ onOpenRoleSwitcher }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [featuredListings, setFeaturedListings] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, pricesRes] = await Promise.all([
          api.get('/listings?sortBy=recentlyListed'),
          api.get('/prices')
        ]);
        if (listingsRes.success) setFeaturedListings(listingsRes.listings.slice(0, 6));
        if (pricesRes.success) setMandiPrices(pricesRes.prices);
      } catch (err) {
        console.log('Error fetching homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleVoiceSearchResult = (transcript) => {
    setSearchQuery(transcript);
    navigate(`/marketplace?search=${encodeURIComponent(transcript)}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 md:py-16 bg-gradient-to-b from-emerald-50/70 via-earth-50 to-white">
        <div className="absolute top-0 inset-x-0 h-40 bg-radial-gradient pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-900 text-xs font-bold shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span>🇮🇳 India's Direct Agricultural Network</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Connect Directly. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-500">
                  Sell Better. Grow Together.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t('heroSubtitle')}
              </p>

              {/* Smart Search Bar with Voice Input */}
              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto lg:mx-0">
                <div className="p-2 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-xl shadow-emerald-600/10 flex items-center space-x-2">
                  <Search className="w-5 h-5 text-emerald-600 ml-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
                  />
                  <VoiceInput onResult={handleVoiceSearchResult} />
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Primary & Secondary Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/marketplace"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center space-x-2 transition-all hover:scale-102"
                >
                  <span>{t('exploreMarketplace')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register?role=farmer"
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-200 shadow-sm flex items-center space-x-2 transition-all"
                >
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>{t('joinAsFarmer')}</span>
                </Link>
              </div>

              {/* Key Trust Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 text-left">
                <div>
                  <div className="font-extrabold text-base sm:text-lg text-slate-900">0% Comm.</div>
                  <div className="text-[11px] text-slate-500 font-medium">Direct Deals</div>
                </div>
                <div>
                  <div className="font-extrabold text-base sm:text-lg text-emerald-700">Realtime</div>
                  <div className="text-[11px] text-slate-500 font-medium">Mandi Prices</div>
                </div>
                <div>
                  <div className="font-extrabold text-base sm:text-lg text-blue-700">100% KYC</div>
                  <div className="text-[11px] text-slate-500 font-medium">Verified Buyers</div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800&auto=format&fit=crop&q=80"
                  alt="Indian Farmer in field"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                {/* Floating Stat 1: Top Left */}
                <div className="absolute top-4 left-4 p-3 rounded-2xl glass-panel text-slate-900 text-xs shadow-lg border border-white/80 animate-float">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      🌾
                    </div>
                    <div>
                      <span className="font-extrabold text-emerald-800 text-sm">5,000+</span>
                      <p className="text-[10px] text-slate-500 font-medium">Active Farmers</p>
                    </div>
                  </div>
                </div>

                {/* Floating Stat 2: Top Right */}
                <div className="absolute top-4 right-4 p-3 rounded-2xl glass-panel text-slate-900 text-xs shadow-lg border border-white/80 animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      🏢
                    </div>
                    <div>
                      <span className="font-extrabold text-blue-800 text-sm">1,200+</span>
                      <p className="text-[10px] text-slate-500 font-medium">Verified Buyers</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Overlay Info Card */}
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                      🍅
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Nashik Hybrid Tomato</h4>
                      <p className="text-[11px] text-emerald-700 font-semibold">Listed at ₹2,400 / Qtl • Grade A</p>
                    </div>
                  </div>
                  <Link
                    to="/marketplace"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm"
                  >
                    View
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE APMC MANDI PRICE TICKER (Continuous scrolling marquee) */}
      <section className="bg-slate-900 text-white py-3.5 overflow-hidden border-y border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <div className="flex items-center space-x-2 bg-emerald-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 z-10 shadow-md">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Mandi Live</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap w-full ml-4 relative">
            <div className="animate-ticker space-x-8 text-xs font-medium">
              {mandiPrices.concat(mandiPrices).map((p, index) => (
                <div key={index} className="inline-flex items-center space-x-2.5">
                  <span className="font-bold text-slate-100">{p.crop}:</span>
                  <span className="text-emerald-400 font-extrabold">₹{p.averagePrice?.toLocaleString()}</span>
                  <span className="text-slate-400 text-[11px]">({p.market})</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    p.trendDirection === 'up' ? 'text-emerald-400 bg-emerald-950/80' : 'text-rose-400 bg-rose-950/80'
                  }`}>
                    {p.trendPercentage}
                  </span>
                  <span className="text-slate-600 font-bold">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4-Step Workflow with Visual Connectors) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wide">
            Seamless Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all space-y-3 relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-lg shadow-sm group-hover:scale-110 transition-transform">
              🌱
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Step 01</div>
            <h3 className="font-bold text-base text-slate-900">{t('step1Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('step1Desc')}</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all space-y-3 relative group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-lg shadow-sm group-hover:scale-110 transition-transform">
              📦
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Step 02</div>
            <h3 className="font-bold text-base text-slate-900">{t('step2Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('step2Desc')}</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all space-y-3 relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-extrabold text-lg shadow-sm group-hover:scale-110 transition-transform">
              📊
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Step 03</div>
            <h3 className="font-bold text-base text-slate-900">{t('step3Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('step3Desc')}</p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all space-y-3 relative group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-lg shadow-sm group-hover:scale-110 transition-transform">
              🤝
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Step 04</div>
            <h3 className="font-bold text-base text-slate-900">{t('step4Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('step4Desc')}</p>
          </div>

        </div>
      </section>

      {/* 4. FEATURED FRESH CROP LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Direct From Farmers</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Featured Fresh Produce
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View all 25+ listings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {featuredListings.map((listing) => (
            <CropCard key={listing._id} listing={listing} />
          ))}
        </div>
      </section>

      {/* 5. PRICE DISCOVERY SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                📊 Transparent Agricultural Price Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Know the Real Mandi Price Before Selling or Buying.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Compare direct farmer prices with official APMC Mandi rates, historical 30-day price trends, and buyer demand indicators across all major Indian states.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/price-discovery"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Open Price Discovery Tool</span>
                </Link>
                <Link
                  to="/map-discovery"
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>View On Regional Map</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 space-y-3">
              <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wide">Sample Benchmark (Tomato)</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between pb-1 border-b border-white/10">
                  <span className="text-slate-300">Lasalgaon APMC Mandi:</span>
                  <span className="font-bold text-white">₹2,400 / Qtl</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-white/10">
                  <span className="text-slate-300">Platform Average:</span>
                  <span className="font-bold text-emerald-300">₹2,350 / Qtl</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-white/10">
                  <span className="text-slate-300">Reference Spread:</span>
                  <span className="font-bold text-amber-300">₹2,200 – ₹2,550</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Market Demand:</span>
                  <span className="font-bold text-emerald-400">🟢 High (Score: 88/100)</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic pt-1">
                Data source: AGMARKNET real-time feeds.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. KISAN COMMUNITY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">🌾 Kisan Manch</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Join 5,000+ Farmers Sharing Daily Advice & Success
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Pest control formulas, fertilizer preparation, groundwater management, and mandi updates directly from experienced farmers.
            </p>
          </div>
          <Link
            to="/community"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md shrink-0 flex items-center space-x-2"
          >
            <span>Visit Community Forum</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </section>

    </div>
  );
};
