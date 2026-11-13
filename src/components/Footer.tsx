import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart, Instagram, Facebook } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { BRAND_CONFIG } from '../data/products';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#182836] text-[#E8F1F8] pt-16 pb-12 border-t-4 border-cherry relative overflow-hidden">
      {/* Decorative Sky Blue Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C3347]/40 to-[#12202C] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Proverb Feature Banner */}
        <div className="text-center pb-14 border-b border-sky-900/60 max-w-3xl mx-auto">
          <span className="text-cherry text-xs uppercase tracking-[0.3em] font-semibold block mb-3">
            Heritage Tamil Philosophy
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-sky-100 font-normal mb-3 tracking-wide">
            "{BRAND_CONFIG.proverbTamil}"
          </h3>
          <p className="text-sky-200/80 font-serif italic text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            "{BRAND_CONFIG.proverbTranslation}"
          </p>
        </div>

        {/* 4 Column Main Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <img src="/logo.png" alt="The Wardrobe Studio" className="h-16 w-auto object-contain brightness-0 invert" />
            <p className="text-sky-200/70 text-xs leading-relaxed font-light">
              Crafting timeless women's ethnic wear in Chennai. Specializing in buttery Mul Cottons, delicate Mul Chanderis, hand-block prints, and tailored plus-size luxury.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-200 hover:text-white hover:border-cherry hover:bg-cherry transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BRAND_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-200 hover:text-white hover:border-cherry hover:bg-cherry transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-300 hover:text-white hover:bg-emerald-600 transition-all"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h5 className="font-cinzel text-xs text-cherry uppercase tracking-[0.25em] font-bold mb-5">
              The Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-sky-200/80">
              <li>
                <Link to="/collections?category=Kurta" className="hover:text-white transition-colors">
                  Mul Cotton Kurtas
                </Link>
              </li>
              <li>
                <Link to="/collections?category=2 Piece Kurta Suit Set" className="hover:text-white transition-colors">
                  2 Piece Kurta Suit Sets
                </Link>
              </li>
              <li>
                <Link to="/collections?category=3 Piece Kurta Suit Set" className="hover:text-white transition-colors">
                  3 Piece Suit Sets with Organza Dupatta
                </Link>
              </li>
              <li>
                <Link to="/collections?category=Dresses" className="hover:text-white transition-colors">
                  Ethnic Fusion Maxi Dresses
                </Link>
              </li>
              <li>
                <Link to="/collections?category=Plus Size" className="hover:text-white transition-colors">
                  Regal Plus Size Collection (XL - XXL)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h5 className="font-cinzel text-xs text-cherry uppercase tracking-[0.25em] font-bold mb-5">
              Quick Links
            </h5>
            <ul className="space-y-2.5 text-xs text-sky-200/80">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-white transition-colors">
                  Return & Exchange
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Boutique Info */}
          <div className="space-y-3.5 text-xs text-sky-200/80">
            <h5 className="font-cinzel text-xs text-cherry uppercase tracking-[0.25em] font-bold mb-5">
              Flagship Boutique
            </h5>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{BRAND_CONFIG.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <a href={`tel:${BRAND_CONFIG.phone}`} className="hover:text-white font-medium text-sky-100">
                +91 {BRAND_CONFIG.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 font-medium text-emerald-200"
              >
                WhatsApp Order Line: {BRAND_CONFIG.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{BRAND_CONFIG.email}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-sky-900/60 flex items-center justify-center text-[11px] text-sky-300/60">
          <p>© {new Date().getFullYear()} The Wardrobe Studio. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
