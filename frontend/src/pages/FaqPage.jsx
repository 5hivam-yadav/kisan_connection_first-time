import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How can farmers list their crops on KisanConnect?",
      a: "Farmers can register using their mobile number, verify via OTP, click '+ Add Produce', fill in the harvest details (quantity, price, photo, quality grade), and publish immediately to the marketplace."
    },
    {
      q: "Is there any commission or platform fee charged to farmers?",
      a: "No. KisanConnect operates on a 100% direct trade model with zero commission fees for farmers. Farmers receive full deal value directly."
    },
    {
      q: "How is the Agricultural Price Discovery information calculated?",
      a: "Price data aggregates real-time APMC Mandi feeds from state marketing boards and AGMARKNET across India, alongside actual platform listing averages to calculate fair reference price ranges."
    },
    {
      q: "How are buyers and farmers verified on the platform?",
      a: "Farmers are verified through mobile OTP, Aadhaar, and land records (e.g. 7/12 extract / Patta). Buyers are verified via GST registration, FSSAI certificates, and APMC trader licenses."
    },
    {
      q: "Can farmers use the platform in their regional languages?",
      a: "Yes! KisanConnect supports 9 major Indian languages: English, हिन्दी (Hindi), मराठी (Marathi), ગુજરાતી (Gujarati), ਪੰਜਾਬੀ (Punjabi), தமிழ் (Tamil), తెలుగు (Telugu), ಕನ್ನಡ (Kannada), and বাংলা (Bengali), with built-in voice-to-text input."
    },
    {
      q: "How does direct inquiry and price negotiation work?",
      a: "Buyers can click 'Send Direct Inquiry' on any crop listing to specify quantity, delivery date, and propose an offer price. The farmer receives an instant notification and can Accept, Decline, or Counter-Offer with a single click."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
          Help & Answers
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-slate-500">Everything you need to know about trading on KisanConnect</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-sm text-slate-900 hover:text-emerald-700"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-2 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
