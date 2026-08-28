import React from 'react';
import { Flame, TrendingUp, Users, Search } from 'lucide-react';

export const DemandIndicator = ({ level = 'High Demand', score = 88 }) => {
  const isHigh = level.toLowerCase().includes('high');
  const isMedium = level.toLowerCase().includes('medium');

  const badgeColor = isHigh
    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
    : isMedium
    ? 'bg-amber-50 text-amber-800 border-amber-300'
    : 'bg-rose-50 text-rose-800 border-rose-300';

  const dotColor = isHigh ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Realtime Crop Demand Index</span>
        </h4>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${badgeColor}`}>
          <span className={`w-2 h-2 rounded-full animate-ping ${dotColor}`}></span>
          <span>{level}</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500 font-medium">Buyer Interest Intensity:</span>
          <span className="font-extrabold text-slate-800">{score} / 100</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isHigh
                ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                : isMedium
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-rose-500 to-red-400'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {/* Demand Factors Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
          <Users className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
          <span className="font-bold text-slate-800">14+</span>
          <span className="text-[10px] text-slate-400 leading-tight">Active Inquiries</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
          <Search className="w-3.5 h-3.5 text-blue-600 mb-0.5" />
          <span className="font-bold text-slate-800">420+</span>
          <span className="text-[10px] text-slate-400 leading-tight">Searches / Week</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
          <span className="font-bold text-slate-800">+6.8%</span>
          <span className="text-[10px] text-slate-400 leading-tight">Price Trend</span>
        </div>
      </div>
    </div>
  );
};
