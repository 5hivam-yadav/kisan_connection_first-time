import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  const { showToast } = useNotification();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message Sent", "Thank you. Our Krishi support team will contact you within 24 hours.");
    setName('');
    setPhone('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact KisanConnect Helpline</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions regarding listing crops, buyer verification, or market prices? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">National Farmer Toll-Free Support</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-2xl text-emerald-950">
                <Phone className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-bold block">1800-180-1551</span>
                  <span className="text-[11px] text-emerald-800">Toll-Free (Mon - Sat: 8 AM - 8 PM)</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-2xl text-blue-950">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="font-bold block">support@kisanconnect.gov.in</span>
                  <span className="text-[11px] text-blue-800">24/7 Email Inquiries</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-2xl text-amber-950">
                <MapPin className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="font-bold block">Krishi Bhawan Headquarters</span>
                  <span className="text-[11px] text-amber-800">Dr. Rajendra Prasad Road, New Delhi 110001</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">Send an Inquiry / Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
              <textarea
                required
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Message</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
