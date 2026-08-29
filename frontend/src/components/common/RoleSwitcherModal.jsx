import React from 'react';
import { X, UserCheck, Shield, ShoppingCart, Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const RoleSwitcherModal = ({ isOpen, onClose }) => {
  const { user, switchDemoRole } = useAuth();
  const { showToast } = useNotification();

  if (!isOpen) return null;

  const handleSelect = async (role) => {
    const res = await switchDemoRole(role);
    if (res.success) {
      showToast("Role Switched", `Now viewing KisanConnect as a ${role.toUpperCase()}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">🎭 Demo Persona Switcher</h3>
            <p className="text-xs text-slate-300">Quickly explore different role experiences in 1-click</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          
          {/* Farmer Persona */}
          <div
            onClick={() => handleSelect('farmer')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3.5 ${
              user?.role === 'farmer' 
                ? 'border-emerald-500 bg-emerald-50/70 shadow-md shadow-emerald-500/10' 
                : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">👨‍🌾 Farmer Persona (Shivam yadav)</h4>
                {user?.role === 'farmer' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full">Active</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Location: Nashik, Maharashtra • Post crop listings, view market trends, manage incoming buyer inquiries.
              </p>
            </div>
          </div>

          {/* Buyer Persona */}
          <div
            onClick={() => handleSelect('buyer')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3.5 ${
              user?.role === 'buyer' 
                ? 'border-blue-500 bg-blue-50/70 shadow-md shadow-blue-500/10' 
                : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">🏢 Buyer Persona (Vikram Singhania)</h4>
                {user?.role === 'buyer' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-600 text-white rounded-full">Active</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AgriFresh Wholesale, Vashi APMC • Send inquiries, negotiate prices, save favorite farmers.
              </p>
            </div>
          </div>

          {/* Admin Persona */}
          <div
            onClick={() => handleSelect('admin')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3.5 ${
              user?.role === 'admin' 
                ? 'border-purple-500 bg-purple-50/70 shadow-md shadow-purple-500/10' 
                : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/30'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">🛡️ Admin Persona</h4>
                {user?.role === 'admin' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-600 text-white rounded-full">Active</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Krishi Bhawan Authority • Review KYC verifications, moderate community posts, platform metrics.
              </p>
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
