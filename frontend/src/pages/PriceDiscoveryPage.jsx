import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PriceChart } from '../components/cards/PriceChart';
import { RegionalPriceBarChart } from '../components/cards/RegionalPriceBarChart';
import { DemandIndicator } from '../components/cards/DemandIndicator';
import { PriceDisclaimer } from '../components/common/PriceDisclaimer';
import api from '../services/api';
import { 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Layers, 
  Activity, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter
} from 'lucide-react';

export const PriceDiscoveryPage = () => {
  const { t } = useLanguage();

  const [pricesList, setPricesList] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedPriceData, setSelectedPriceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const availableCrops = [
    'Tomato',
    'Nashik Red Onion',
    'Basmati Rice (1121)',
    'Sharbati Wheat',
    'Guntur Red Chilli',
    'Potato (Chipsona / Table)',
    'Raw Cotton (Kapas Shankar-6)',
    'Yellow Soybean',
    'Shimla Royal Apples',
    'Robusta Banana',
    'Mustard Seed',
    'Turmeric Finger'
  ];

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/prices');
      if (res.success) {
        setPricesList(res.prices);
        const match = res.prices.find(p => p.crop.toLowerCase().includes(selectedCrop.toLowerCase())) || res.prices[0];
        setSelectedPriceData(match);
      }
    } catch (err) {
      console.log('Error fetching prices:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
    const match = pricesList.find(p => p.crop.toLowerCase().includes(crop.toLowerCase()));
    if (match) setSelectedPriceData(match);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Module Title Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wide">
          📊 APMC Price Intelligence Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('priceDiscoveryTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('priceDiscoverySubtitle')}
        </p>
      </div>

      {/* Horizontal Crop Switcher */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {availableCrops.map((crop) => (
          <button
            key={crop}
            onClick={() => handleSelectCrop(crop)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              selectedCrop.toLowerCase() === crop.toLowerCase()
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <span>{crop}</span>
          </button>
        ))}
      </div>

      {/* Selected Crop Metric Highlights */}
      {selectedPriceData && (
        <div className="space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Modal Price */}
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Modal Mandi Rate
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
                ₹{selectedPriceData.averagePrice.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">per {selectedPriceData.unit}</p>
              <div className="pt-1 flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{selectedPriceData.trendPercentage} vs last week</span>
              </div>
            </div>

            {/* Platform Avg Rate */}
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Platform Listing Avg
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                ₹{selectedPriceData.platformPrice.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Direct farmer listings</p>
              <span className="text-[10px] text-slate-400 block pt-1">Zero middlemen cut</span>
            </div>

            {/* Reference Range */}
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Mandi Price Spread
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-slate-800">
                ₹{selectedPriceData.minimumPrice.toLocaleString()} – ₹{selectedPriceData.maximumPrice.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Min to Max reported</p>
              <span className="text-[10px] text-emerald-600 font-semibold block pt-1">
                Mandi: {selectedPriceData.market}
              </span>
            </div>

            {/* Demand Indicator Card */}
            <DemandIndicator
              level={selectedPriceData.demandLevel}
              score={selectedPriceData.demandScore || 85}
            />

          </div>

          {/* Charts Row: Trend Chart (Left 8) + Regional Bar Chart (Right 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <PriceChart
                data={selectedPriceData.priceHistory}
                cropName={selectedPriceData.crop}
                unit={selectedPriceData.unit}
              />
            </div>
            <div className="lg:col-span-4">
              <RegionalPriceBarChart
                regions={[
                  { mandi: 'Lasalgaon', price: selectedPriceData.averagePrice },
                  { mandi: 'Azadpur', price: Math.round(selectedPriceData.averagePrice * 1.12) },
                  { mandi: 'Vashi', price: Math.round(selectedPriceData.averagePrice * 1.05) },
                  { mandi: 'Surat', price: Math.round(selectedPriceData.averagePrice * 0.96) },
                  { mandi: 'Kolar', price: Math.round(selectedPriceData.averagePrice * 1.08) }
                ]}
              />
            </div>
          </div>

          {/* Disclaimer Component */}
          <PriceDisclaimer
            source={selectedPriceData.source}
            updatedAt={selectedPriceData.updatedAt}
          />

        </div>
      )}

    </div>
  );
};
