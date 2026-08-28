import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export const RegionalPriceBarChart = ({ regions = [] }) => {
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <div>
        <h4 className="font-bold text-base text-slate-900">🏛️ Regional APMC Mandi Price Comparison</h4>
        <p className="text-xs text-slate-500">Real-time benchmark comparison across key hub mandis</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={regions} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="mandi" 
              tick={{ fontSize: 10, fill: '#475569' }} 
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}/Quintal`, 'Mandi Rate']}
              contentStyle={{ borderRadius: '1rem', background: '#0f172a', color: '#fff', border: 'none', fontSize: '12px' }}
            />
            <Bar dataKey="price" radius={[8, 8, 0, 0]}>
              {regions.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
