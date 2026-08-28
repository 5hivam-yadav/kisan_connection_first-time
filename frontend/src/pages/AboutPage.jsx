import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, TrendingUp, Users, Heart, Award, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wide">
          Our Agricultural Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Empowering Indian Farmers Through Direct Market Linkages & Price Transparency
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          KisanConnect was built with a single purpose: to eliminate unfair middleman exploitation, create transparent APMC Mandi price discovery, and foster a national farmer-to-farmer knowledge community.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
            🌱
          </div>
          <h3 className="font-bold text-base text-slate-900">Direct Farm-to-Market</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Zero brokerage fees. Farmers retain full profit margins by selling directly to verified food processors, exporters, and wholesale buyers.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
            📊
          </div>
          <h3 className="font-bold text-base text-slate-900">Mandi Price Discovery</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time APMC price aggregates, 30-day historical trend analytics, and buyer demand indicators for accurate price decisions.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
            🤝
          </div>
          <h3 className="font-bold text-base text-slate-900">Kisan Community Manch</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Peer-to-peer advisory platform for sharing pest control formulations, organic farming methods, and water conservation practices.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
            🛡️
          </div>
          <h3 className="font-bold text-base text-slate-900">Trust & KYC Verification</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rigorous identity verification, land record checks, and buyer business documentation to ensure safe, scam-free trade.
          </p>
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">5,000+</div>
          <div className="text-xs text-slate-300 mt-1 font-medium">Registered Farmers</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">1,200+</div>
          <div className="text-xs text-slate-300 mt-1 font-medium">Verified Buyers</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">50+</div>
          <div className="text-xs text-slate-300 mt-1 font-medium">APMC Mandis Covered</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</div>
          <div className="text-xs text-slate-300 mt-1 font-medium">Commission Free</div>
        </div>
      </div>

    </div>
  );
};
