import React from 'react';
import { AlertCircle } from 'lucide-react';

export const PriceDisclaimer = ({ source = 'AGMARKNET / State APMC Mandi Feeds', updatedAt = '28 Aug 2026' }) => {
  return (
    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start space-x-2.5 shadow-sm">
      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <p className="font-semibold text-amber-950">
          Mandatory Market Price Notice:
        </p>
        <p className="text-[11px] text-amber-900 mt-0.5">
          "Market prices are indicative and may vary by location, quality, quantity and time. Always verify the latest local market price before making a transaction."
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-amber-700/90 font-medium">
          <span>📊 <strong>Source:</strong> {source}</span>
          <span>⏱️ <strong>Last Synced:</strong> {updatedAt}</span>
        </div>
      </div>
    </div>
  );
};
