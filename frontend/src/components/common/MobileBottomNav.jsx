import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Home, ShoppingBag, PlusCircle, MessageSquare, User, TrendingUp } from 'lucide-react';

export const MobileBottomNav = () => {
  const { isAuthenticated, isFarmer, isBuyer, isAdmin } = useAuth();
  const { t } = useLanguage();

  const getProfileLink = () => {
    if (!isAuthenticated) return '/login';
    if (isFarmer) return '/farmer/dashboard';
    if (isBuyer) return '/buyer/dashboard';
    if (isAdmin) return '/admin';
    return '/profile';
  };

  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center justify-center py-2 px-1 text-[11px] font-semibold transition-colors ${
      isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
    }`;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-2 py-1 flex items-center justify-around safe-area-pb">
      
      {/* Home */}
      <NavLink to="/" className={navItemClass}>
        <Home className="w-5 h-5 mb-0.5" />
        <span>{t('home')}</span>
      </NavLink>

      {/* Marketplace */}
      <NavLink to="/marketplace" className={navItemClass}>
        <ShoppingBag className="w-5 h-5 mb-0.5" />
        <span>{t('marketplace')}</span>
      </NavLink>

      {/* Prominent Add Produce Button */}
      <NavLink
        to={isFarmer ? '/farmer/create-listing' : '/marketplace'}
        className="flex flex-col items-center -mt-6 group"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
          <PlusCircle className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold text-emerald-700 mt-1">
          {isFarmer ? '+ Add' : 'Explore'}
        </span>
      </NavLink>

      {/* Community */}
      <NavLink to="/community" className={navItemClass}>
        <MessageSquare className="w-5 h-5 mb-0.5" />
        <span>{t('community')}</span>
      </NavLink>

      {/* Profile / Dashboard */}
      <NavLink to={getProfileLink()} className={navItemClass}>
        <User className="w-5 h-5 mb-0.5" />
        <span>{isAuthenticated ? 'Profile' : t('login')}</span>
      </NavLink>

    </div>
  );
};
