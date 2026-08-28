import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { VoiceInput } from '../components/common/VoiceInput';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Sprout, 
  Sparkles, 
  MapPin, 
  IndianRupee, 
  Upload, 
  Eye, 
  Check, 
  Calendar, 
  Layers, 
  ArrowLeft 
} from 'lucide-react';

export const CreateListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    cropName: '',
    category: 'Vegetables',
    variety: '',
    quantity: '',
    unit: 'Quintal',
    quality: 'Grade A (Premium)',
    price: '',
    harvestDate: new Date().toISOString().split('T')[0],
    availabilityDate: new Date().toISOString().split('T')[0],
    farmingMethod: '100% Certified Organic',
    packaging: '50kg Standard Mesh Bags',
    description: '',
    contactPreference: 'All (Phone + Chat + Inquiry)',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600'
  });

  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains & Cereals',
    'Pulses & Legumes',
    'Spices & Condiments',
    'Cash Crops',
    'Oilseeds'
  ];

  // Smart Price Recommender based on selected crop
  const getPriceRecommendation = () => {
    if (formData.cropName.toLowerCase().includes('tomato')) return { mandiAvg: 2400, fairRange: '₹2,200 - ₹2,550' };
    if (formData.cropName.toLowerCase().includes('onion')) return { mandiAvg: 1850, fairRange: '₹1,700 - ₹2,050' };
    if (formData.cropName.toLowerCase().includes('wheat')) return { mandiAvg: 2850, fairRange: '₹2,700 - ₹3,000' };
    if (formData.cropName.toLowerCase().includes('rice') || formData.cropName.toLowerCase().includes('basmati')) return { mandiAvg: 4350, fairRange: '₹4,100 - ₹4,500' };
    if (formData.cropName.toLowerCase().includes('cotton')) return { mandiAvg: 7400, fairRange: '₹7,100 - ₹7,650' };
    return { mandiAvg: 2500, fairRange: '₹2,200 - ₹2,800' };
  };

  const recommendation = getPriceRecommendation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/listings', {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        images: [formData.imageUrl]
      });

      if (res.success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        showToast("Crop Listed!", "Your produce is now live on the KisanConnect marketplace.");
        navigate('/farmer/dashboard');
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Sprout className="w-7 h-7 text-emerald-600" />
            <span>Create New Crop Listing</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish your harvested produce directly to verified wholesale buyers
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>{showPreview ? "Hide Preview" : "Live Preview"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            1. Crop & Classification Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crop Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Nashik Red Onion, Hybrid Tomato"
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Variety / Strain</label>
              <input
                type="text"
                placeholder="e.g. Pusa Basmati 1121, Abhinav 1057"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quality Grade *</label>
              <select
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
              >
                <option value="Grade A (Premium)">Grade A (Premium)</option>
                <option value="Export Quality">Export Quality</option>
                <option value="Grade B (Standard)">Grade B (Standard)</option>
                <option value="Organic Certified">Organic Certified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quantity & Pricing Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            2. Quantity & Expected Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Available Quantity *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 200"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Measurement Unit *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
              >
                <option value="Quintal">Quintal (100 kg)</option>
                <option value="Ton">Ton (1,000 kg)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="Crates">Crates</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Rate (₹ / {formData.unit}) *</label>
              <input
                type="number"
                required
                min="10"
                placeholder="e.g. 2400"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs outline-none font-extrabold text-emerald-800 bg-emerald-50/50"
              />
            </div>
          </div>

          {/* Smart Mandi Price Recommendation Helper Box */}
          <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <div>
              <span className="font-bold">💡 Mandi Rate Helper:</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Current Mandi Benchmark: <strong>₹{recommendation.mandiAvg}/Quintal</strong> • Suggested fair range: <strong>{recommendation.fairRange}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, price: recommendation.mandiAvg.toString() })}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shrink-0 shadow-sm"
            >
              Apply Suggested
            </button>
          </div>
        </div>

        {/* Farming Method, Harvest & Description */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            3. Harvest & Agricultural Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Farming Method *</label>
              <select
                value={formData.farmingMethod}
                onChange={(e) => setFormData({ ...formData, farmingMethod: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
              >
                <option value="100% Certified Organic">100% Certified Organic</option>
                <option value="Natural / ZBNF">Natural / Subhash Palekar ZBNF</option>
                <option value="Integrated Pest Management">Integrated Pest Management (IPM)</option>
                <option value="Conventional Good Agricultural Practice">Conventional GAP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Packaging Specs</label>
              <input
                type="text"
                value={formData.packaging}
                onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Detailed Produce Description (Voice Enabled 🎤) *
              </label>
              <VoiceInput
                onResult={(val) => setFormData({ ...formData, description: `${formData.description} ${val}`.trim() })}
              />
            </div>
            <textarea
              required
              rows="3"
              placeholder="e.g. Export grade size sorted produce. Low moisture content, ideal for long distance cold transit. Stored in hygienic conditions."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Photograph URL *</label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none text-slate-600"
            />
          </div>
        </div>

        {/* Live Preview Box */}
        {showPreview && (
          <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-emerald-400 space-y-3">
            <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wider">
              👀 Live Marketplace Preview
            </h4>
            <div className="max-w-xs mx-auto">
              <div className="bg-white rounded-2xl p-4 shadow-md space-y-2 border">
                <img src={formData.imageUrl} alt="preview" className="w-full h-36 object-cover rounded-xl" />
                <h5 className="font-bold text-sm text-slate-900">{formData.cropName || 'Crop Title'}</h5>
                <p className="text-xs text-emerald-700 font-bold">₹{formData.price || '0'} / {formData.unit}</p>
                <p className="text-[10px] text-slate-500">{formData.quantity || 0} {formData.unit} • {formData.quality}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/farmer/dashboard')}
            className="px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitting ? 'Publishing...' : 'Publish Crop Listing'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
