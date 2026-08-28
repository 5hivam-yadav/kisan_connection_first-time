import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const PriceChart = ({ data = [], cropName = 'Tomato', unit = 'Quintal' }) => {
  const [timeRange, setTimeRange] = useState('30'); // '7' or '30'

  const chartData = timeRange === '7' ? data.slice(-7) : data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-900/95 text-white text-xs rounded-2xl shadow-xl border border-slate-700 space-y-1">
          <p className="font-bold text-slate-200">{label}</p>
          <div className="space-y-0.5 pt-1">
            <p className="text-emerald-400">
              Modal Mandi Rate: <strong>₹{payload[0]?.value?.toLocaleString()}</strong>
            </p>
            {payload[1] && (
              <p className="text-amber-400">
                Platform Avg: <strong>₹{payload[1]?.value?.toLocaleString()}</strong>
              </p>
            )}
            {payload[2] && (
              <p className="text-sky-400">
                Min Rate: <strong>₹{payload[2]?.value?.toLocaleString()}</strong>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-base text-slate-900 flex items-center space-x-2">
            <span>📈 {cropName} Price Trend Analytics</span>
          </h4>
          <p className="text-xs text-slate-500">Historical APMC Mandi modal price curve (₹ per {unit})</p>
        </div>

        {/* 7-day vs 30-day toggle */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setTimeRange('7')}
            className={`px-3 py-1 rounded-lg transition-all ${
              timeRange === '7' ? 'bg-white text-emerald-700 font-bold shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30')}
            className={`px-3 py-1 rounded-lg transition-all ${
              timeRange === '30' ? 'bg-white text-emerald-700 font-bold shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPlat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
            <Area
              type="monotone"
              name="Mandi Modal Price (₹)"
              dataKey="modalPrice"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorModal)"
            />
            <Area
              type="monotone"
              name="Platform Listing Avg (₹)"
              dataKey="platformAvg"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorPlat)"
            />
            <Line
              type="monotone"
              name="Min Floor (₹)"
              dataKey="minPrice"
              stroke="#94a3b8"
              strokeWidth={1.5}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
