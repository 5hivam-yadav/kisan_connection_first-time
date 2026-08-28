import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  Sprout, 
  Search, 
  Globe, 
  Bell, 
  User, 
  Menu, 
  X, 
  PlusCircle, 
  TrendingUp, 
  ShoppingBag, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  ChevronDown,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

export const Navbar = ({ onOpenRoleSwitcher }) => {
  const { user, isAuthenticated, isFarmer, isBuyer, isAdmin, logout } = useAuth();
  const { currentLang, languages, changeLanguage, t } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotification();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifDropdownOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
      isActive
        ? 'bg-emerald-100 text-emerald-800 font-semibold'
        : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                  Kisan<span className="text-emerald-600">Connect</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Bharat
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block font-medium leading-none mt-0.5">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass}>
              <span>{t('home')}</span>
            </NavLink>
            <NavLink to="/marketplace" className={navLinkClass}>
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>{t('marketplace')}</span>
            </NavLink>
            <NavLink to="/price-discovery" className={navLinkClass}>
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>{t('priceDiscovery')}</span>
            </NavLink>
            <NavLink to="/map-discovery" className={navLinkClass}>
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{t('mapDiscovery')}</span>
            </NavLink>
            <NavLink to="/community" className={navLinkClass}>
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>{t('community')}</span>
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              <span>{t('about')}</span>
            </NavLink>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-2 md:space-x-3">

            {/* Role Demo Switcher Badge / Button */}
            <button
              onClick={onOpenRoleSwitcher}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors shadow-sm"
              title="Switch demo role between Farmer, Buyer, Admin, Guest"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {isAuthenticated
                  ? (isFarmer ? '👨‍🌾 Farmer' : isBuyer ? '🏢 Buyer' : '🛡️ Admin')
                  : '🎭 Demo Switcher'}
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-emerald-50 transition-colors"
                aria-label="Select Language"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">
                  {languages.find(l => l.code === currentLang)?.nativeName || 'Language'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language / भाषा
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        currentLang === lang.code ? 'font-bold text-emerald-700 bg-emerald-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.nativeName} ({lang.name})</span>
                      {currentLang === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-slate-900">Notifications</span>
                        <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                          {unreadCount} unread
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">No new notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              markAsRead(n._id);
                              if (n.link) navigate(n.link);
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                              !n.read ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <h5 className={`text-xs font-semibold ${!n.read ? 'text-emerald-900 font-bold' : 'text-slate-800'}`}>
                                {n.title}
                              </h5>
                              {!n.read && <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authenticated User Menu or Login/Register Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-emerald-50 border border-slate-200 transition-colors"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                  />
                  <div className="hidden md:block text-left pr-1">
                    <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold capitalize">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500">+91 {user.phone}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                        {user.role} Account
                      </span>
                    </div>

                    <div className="py-1">
                      {isFarmer && (
                        <>
                          <Link
                            to="/farmer/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                          >
                            <User className="w-4 h-4 text-emerald-600" />
                            <span>{t('farmerDashboard')}</span>
                          </Link>
                          <Link
                            to="/farmer/create-listing"
                            onClick={() => setUserDropdownOpen(false)}
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                          >
                            <PlusCircle className="w-4 h-4 text-emerald-600" />
                            <span>{t('addProduce')}</span>
                          </Link>
                          <Link
                            to="/farmer/inquiries"
                            onClick={() => setUserDropdownOpen(false)}
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                            <span>{t('myInquiries')}</span>
                          </Link>
                        </>
                      )}

                      {isBuyer && (
                        <>
                          <Link
                            to="/buyer/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                          >
                            <User className="w-4 h-4 text-emerald-600" />
                            <span>{t('buyerDashboard')}</span>
                          </Link>
                          <Link
                            to="/buyer/inquiries"
                            onClick={() => setUserDropdownOpen(false)}
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                            <span>{t('myInquiries')}</span>
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>{t('adminPanel')}</span>
                        </Link>
                      )}

                      <Link
                        to="/saved-listings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        <span>{t('savedListings')}</span>
                      </Link>

                      <Link
                        to="/chat"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>{t('chat')}</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-emerald-50"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50"
          >
            {t('home')}
          </NavLink>
          <NavLink
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50"
          >
            {t('marketplace')}
          </NavLink>
          <NavLink
            to="/price-discovery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50"
          >
            {t('priceDiscovery')}
          </NavLink>
          <NavLink
            to="/map-discovery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50"
          >
            {t('mapDiscovery')}
          </NavLink>
          <NavLink
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50"
          >
            {t('community')}
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50"
          >
            {t('about')}
          </NavLink>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRoleSwitcher();
              }}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center"
            >
              🎭 Switch Demo Persona (Farmer / Buyer / Admin)
            </button>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-white bg-emerald-600 rounded-xl"
                >
                  {t('register')}
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full py-2 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
              >
                {t('logout')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
