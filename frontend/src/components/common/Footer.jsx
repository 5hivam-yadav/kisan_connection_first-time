import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, Phone, Mail, MapPin, Heart, ShieldCheck, Award, MessageCircle } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800 mt-20 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Kisan<span className="text-emerald-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footerDesc')}
            </p>
            
            <div className="flex items-center space-x-3 pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Direct & Transparent</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold bg-amber-950/60 px-3 py-1.5 rounded-full border border-amber-800">
                <Award className="w-4 h-4" />
                <span>Zero Commission</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/marketplace" className="hover:text-emerald-400 transition-colors">Crops Marketplace</Link></li>
              <li><Link to="/price-discovery" className="hover:text-emerald-400 transition-colors">Mandi Price Discovery</Link></li>
              <li><Link to="/map-discovery" className="hover:text-emerald-400 transition-colors">Map-Based Discovery</Link></li>
              <li><Link to="/community" className="hover:text-emerald-400 transition-colors">Kisan Community Manch</Link></li>
              <li><Link to="/farmer/create-listing" className="hover:text-emerald-400 transition-colors">Post Crop Listing</Link></li>
            </ul>
          </div>

          {/* Column 3: Support & Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support & Help</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Our Mission</Link></li>
              <li><Link to="/faqs" className="hover:text-emerald-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Toll-Free Helpline</Link></li>
              <li><a href="#disclaimer" className="hover:text-emerald-400 transition-colors">Price Data Disclaimer</a></li>
              <li><span className="text-slate-500">Security & KYC Guidelines</span></li>
            </ul>
          </div>

          {/* Column 4: Contact Helpline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Krishi Helpline</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1800-180-1551 (Toll-Free)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@kisanconnect.gov.in</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>{t('copyright')}</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for Indian Farmers</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
