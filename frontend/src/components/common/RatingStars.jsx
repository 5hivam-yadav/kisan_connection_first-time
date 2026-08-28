import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 4.8, size = 'sm', count, showScore = true }) => {
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  
  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
      {showScore && (
        <span className="text-xs font-bold text-slate-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-[11px] text-slate-400">
          ({count})
        </span>
      )}
    </div>
  );
};
