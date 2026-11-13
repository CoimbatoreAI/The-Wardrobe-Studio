import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, Phone, Sparkles, ChevronDown, User } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_CONFIG } from '../data/products';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const { totalItems, wishlist } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-sky-500 text-white text-xs py-2 px-4 text-center tracking-wider flex items-center justify-between font-medium">
        <div className="hidden md:flex items-center gap-2 text-sky-100 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Handcrafted Luxury Ethnic Wear</span>
        </div>
        <div className="mx-auto md:mx-0 flex items-center gap-1.5">
          <span>Complimentary Express Shipping on Orders Above ₹1,999</span>
          <span className="hidden sm:inline text-sky-300/60">•</span>
          <a
            href={`tel:${BRAND_CONFIG.phone}`}
            className="hidden sm:inline-flex items-center gap-1 text-sky-200 hover:text-white transition-colors underline underline-offset-2 ml-1"
          >
            <Phone className="w-3 h-3 text-sky-300" />
            {BRAND_CONFIG.phone}
          </a>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px]">
          <a
            href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white px-2.5 py-0.5 rounded-full transition-colors text-[10px]"
          >
            <WhatsAppIcon className="w-3 h-3" />
            WhatsApp Orders
          </a>
        </div>
      </div>

      {/* Main Navigation Glass Bar */}
      <div className="glass-nav border-b border-[#E2EEF8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-cherry transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex flex-col items-center group text-center my-auto">
            <img src="/logo.png" alt="The Wardrobe Studio" className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              to="/"
              className={`relative text-[11px] xl:text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 py-1 ${
                isActive('/') ? 'text-cherry font-semibold' : 'text-stone-700 hover:text-cherry'
              }`}
            >
              Home
              {isActive('/') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cherry rounded-full" />}
            </Link>

            {/* Collections Dropdown */}
            <div className="relative group py-4">
              <Link
                to="/collections"
                className={`relative text-[11px] xl:text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 flex items-center gap-1 ${
                  isActive('/collections') ? 'text-cherry font-semibold' : 'text-stone-700 hover:text-cherry'
                }`}
              >
                Collections
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute top-[80%] left-0 hidden group-hover:block pt-2 w-56 z-50">
                <div className="bg-white border border-sky-100 shadow-xl py-2 rounded-lg flex flex-col">
                  <Link to="/collections?category=kurta" className="px-4 py-2 text-xs text-stone-700 hover:text-cherry hover:bg-sky-50 transition-colors">Kurta</Link>
                  <Link to="/collections?category=2-piece-kurta-suit-set" className="px-4 py-2 text-xs text-stone-700 hover:text-cherry hover:bg-sky-50 transition-colors">2 Piece Kurta Suit Set</Link>
                  <Link to="/collections?category=3-piece-kurta-suit-set" className="px-4 py-2 text-xs text-stone-700 hover:text-cherry hover:bg-sky-50 transition-colors">3 Piece Kurta Suit Set</Link>
                  <Link to="/collections?category=dresses" className="px-4 py-2 text-xs text-stone-700 hover:text-cherry hover:bg-sky-50 transition-colors">Dresses</Link>
                  <Link to="/collections?category=plus-size" className="px-4 py-2 text-xs text-stone-700 hover:text-cherry hover:bg-sky-50 transition-colors">Plus Size</Link>
                  <Link to="/collections" className="px-4 py-2 text-xs text-stone-700 hover:text-cherry hover:bg-sky-50 transition-colors font-medium border-t border-sky-50 mt-1 pt-3">All Collections</Link>
                </div>
              </div>
            </div>

            <Link
              to="/about"
              className={`relative text-[11px] xl:text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 py-1 ${
                isActive('/about') ? 'text-cherry font-semibold' : 'text-stone-700 hover:text-cherry'
              }`}
            >
              Our Story
              {isActive('/about') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cherry rounded-full" />}
            </Link>

            <Link
              to="/founder"
              className={`relative text-[11px] xl:text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 py-1 ${
                isActive('/founder') ? 'text-cherry font-semibold' : 'text-stone-700 hover:text-cherry'
              }`}
            >
              Founder's Letter
              {isActive('/founder') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cherry rounded-full" />}
            </Link>

            <Link
              to="/franchise"
              className={`relative text-[11px] xl:text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 py-1 ${
                isActive('/franchise') ? 'text-cherry font-semibold' : 'text-stone-700 hover:text-cherry'
              }`}
            >
              Franchise Enquiry
              {isActive('/franchise') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cherry rounded-full" />}
            </Link>
          </nav>

          {/* Icons Bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-stone-700 hover:text-emerald-700 bg-sky-soft hover:bg-emerald-50 border border-sky-soft px-3 py-1.5 rounded-full transition-all"
              title="Chat with Wardrobe Stylist"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-[11px] hidden xl:inline">Assistance</span>
            </a>

            <Link
              to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'}
              className="p-2 text-stone-700 hover:text-cherry transition-colors flex items-center gap-1.5"
              title={user ? 'My account' : 'Log in'}
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline text-[11px] font-medium max-w-[90px] truncate">
                {user ? user.name.split(' ')[0] : 'Login'}
              </span>
            </Link>

            <Link
              to="/favorites"
              className="p-2 text-stone-700 hover:text-cherry transition-colors relative"
              title="Favorites"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-sky-soft text-sky-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-sky-300">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-cherry hover:bg-cherry-hover text-white px-3.5 py-2 rounded-full transition-all shadow-md hover:shadow-lg transform active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wider">Bag</span>
              <span className="bg-white text-cherry text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-sky-soft px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-300 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm uppercase tracking-widest font-medium py-2.5 border-b border-stone-100 flex items-center justify-between ${
                isActive('/') ? 'text-cherry font-semibold' : 'text-stone-800'
              }`}
            >
              <span>Home</span>
              {isActive('/') && <span className="w-2 h-2 rounded-full bg-cherry" />}
            </Link>

            <div className="flex flex-col border-b border-stone-100">
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                className={`text-sm uppercase tracking-widest font-medium py-2.5 flex items-center justify-between w-full text-left ${
                  location.pathname.startsWith('/collections') ? 'text-cherry font-semibold' : 'text-stone-800'
                }`}
              >
                <span>Collections</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCollectionsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCollectionsOpen && (
                <div className="pl-4 py-2 space-y-4 bg-sky-50/50 rounded-b-md mb-2 border-l-2 border-sky-200">
                  <Link to="/collections?category=kurta" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-stone-700 hover:text-cherry">Kurta</Link>
                  <Link to="/collections?category=2-piece-kurta-suit-set" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-stone-700 hover:text-cherry">2 Piece Kurta Suit Set</Link>
                  <Link to="/collections?category=3-piece-kurta-suit-set" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-stone-700 hover:text-cherry">3 Piece Kurta Suit Set</Link>
                  <Link to="/collections?category=dresses" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-stone-700 hover:text-cherry">Dresses</Link>
                  <Link to="/collections?category=plus-size" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-stone-700 hover:text-cherry">Plus Size</Link>
                  <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-stone-700 hover:text-cherry font-medium">All Collections</Link>
                </div>
              )}
            </div>

            {[
              user ? { name: 'My Account', path: '/account' } : { name: 'Login / Register', path: '/login' },
              ...(user?.role === 'admin' ? [{ name: 'Admin Panel', path: '/admin' }] : []),
              { name: 'Our Story', path: '/about' },
              { name: "Founder's Letter", path: '/founder' },
              { name: 'FAQs', path: '/faq' },
              { name: 'Contact Us', path: '/contact' },
              { name: 'Shipping & Delivery', path: '/shipping' },
              { name: 'Return & Exchange', path: '/return-policy' },
              { name: 'Privacy Policy', path: '/privacy-policy' },
              { name: 'Terms & Conditions', path: '/terms' },
            ].map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-widest font-medium py-2.5 border-b border-stone-100 flex items-center justify-between ${
                  isActive(link.path) ? 'text-cherry font-semibold' : 'text-stone-800'
                }`}
              >
                <span>{link.name}</span>
                {isActive(link.path) && <span className="w-2 h-2 rounded-full bg-cherry" />}
              </Link>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <a
              href={`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=Hello%20The%20Wardrobe%20Studio%2C%20I%20would%20like%20assistance%20with%20your%20collection.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Direct WhatsApp Stylist
            </a>
            <div className="text-center text-xs text-stone-500 pt-2">
              Phone: {BRAND_CONFIG.phone}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
