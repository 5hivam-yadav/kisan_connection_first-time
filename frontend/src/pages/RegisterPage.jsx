import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sprout, Phone, Lock, User, MapPin, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import confetti from 'canvas-confetti';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState(searchParams.get('role') || 'farmer');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP Verification
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: 'password123',
    language: 'en',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Dindori',
    pincode: '422202',
    farmSize: 5,
    businessName: '',
    buyerType: 'Wholesaler'
  });

  const [otp, setOtp] = useState('123456');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const res = await api.post('/auth/send-otp', { phone: formData.phone });
      if (res.success) {
        showToast("OTP Sent", `Verification code sent to +91 ${formData.phone} (Demo: 123456)`);
        setStep(2);
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role,
        language: formData.language,
        location: {
          state: formData.state,
          district: formData.district,
          village: formData.village,
          pincode: formData.pincode
        },
        farmSize: Number(formData.farmSize),
        businessName: formData.businessName,
        buyerType: formData.buyerType
      });

      if (res.success) {
        confetti({ particleCount: 100, spread: 70 });
        showToast("Account Created!", `Welcome to KisanConnect, ${res.user.name}`);
        if (role === 'farmer') navigate('/farmer/dashboard');
        else navigate('/buyer/dashboard');
      } else {
        showToast("Registration Failed", res.message, "error");
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create KisanConnect Profile</h2>
          <p className="text-xs text-slate-500">
            Join the direct farm-to-market transparent trading network
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'farmer' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👨‍🌾 Farmer Profile
          </button>
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'buyer' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏢 Buyer / Trader Profile
          </button>
        </div>

        {/* Step 1: Info Form */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'farmer' ? 'Farmer Full Name *' : 'Owner / Contact Name *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rameshwar Patil"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="9822012345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="farmer@kisan.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>
            </div>

            {/* Role Specific Fields */}
            {role === 'farmer' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farm Size (Acres)</label>
                  <input
                    type="number"
                    value={formData.farmSize}
                    onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business / Firm Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AgriFresh Logistics"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Buyer Category *</label>
                  <select
                    value={formData.buyerType}
                    onChange={(e) => setFormData({ ...formData, buyerType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                  >
                    <option value="Wholesaler">Wholesaler / Trader</option>
                    <option value="Food Processor">Food Processor / Mill</option>
                    <option value="Retailer">Retail Chain / Hypermarket</option>
                    <option value="Restaurant">Restaurant / Hotel Group</option>
                    <option value="Exporter">Agri Exporter</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Create Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all"
            >
              Verify Mobile via OTP →
            </button>

          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="font-bold">📱 OTP Verification Sent:</span>
              <p>We sent a 6-digit SMS verification code to <strong>+91 {formData.phone}</strong>.</p>
              <p className="text-[11px] text-emerald-700 font-semibold">(Use Demo Code: 123456)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit OTP *</label>
              <input
                type="text"
                required
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-emerald-400 text-center text-lg font-extrabold tracking-widest outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {submitting ? 'Creating Profile...' : 'Verify & Complete Registration'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};
