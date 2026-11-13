import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { BRAND_CONFIG } from '../data/products';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Hello! I would like size and styling advice for your collection.');

  const handleSend = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Chat Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#1C3347] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-inner">
                TWS
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold">Wardrobe Personal Stylist</h4>
                <p className="text-[10px] text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Chennai Studio
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-sky-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#F5F8FA] space-y-3 text-xs">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-stone-100 text-stone-700 leading-relaxed">
              Vanakkam! Welcome to <strong>The Wardrobe Studio</strong>. How can our personal stylists assist you today? We offer custom size fitting, live fabric previews, and instant order placement.
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
                Your Query / Preferred Outfit:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-cherry text-xs text-stone-800"
              />
            </div>

            <button
              onClick={handleSend}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-xs uppercase tracking-wider"
            >
              <Send className="w-3.5 h-3.5" />
              Chat on WhatsApp ({BRAND_CONFIG.phone})
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Circle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border-2 border-white group"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6 fill-current" />
        <span className="hidden group-hover:inline text-xs font-semibold uppercase tracking-wider pr-1">
          WhatsApp Stylist
        </span>
      </button>
    </div>
  );
};
