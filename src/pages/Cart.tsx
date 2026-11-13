import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    if (promoCode.trim().toUpperCase() === 'WARDROBE10') {
      const discAmount = Math.round(subtotal * 0.1);
      setDiscount(discAmount);
      setPromoSuccess('10% Festive Discount Applied!');
    } else if (promoCode.trim().toUpperCase() === 'WELCOME15') {
      const discAmount = Math.round(subtotal * 0.15);
      setDiscount(discAmount);
      setPromoSuccess('15% First Order Discount Applied!');
    } else {
      setPromoError('Invalid coupon code. Try WARDROBE10 for 10% off.');
    }
  };

  const finalTotal = Math.max(0, subtotal - discount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-sky-soft text-sky-dark rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="font-serif text-3xl font-medium text-stone-900">Your Shopping Bag is Empty</h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed">
          Explore our signature collection of Mul Cotton kurtas, Chanderi suit sets, and graceful plus-size dresses designed for self-celebration.
        </p>
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 bg-cherry hover:bg-cherry-hover text-white text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <span className="text-cherry text-xs font-bold uppercase tracking-[0.25em] block mb-1">
            Shopping Experience
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Your Shopping Bag
          </h1>
        </div>
        <Link
          to="/collections"
          className="mt-2 sm:mt-0 text-xs text-stone-600 hover:text-cherry font-medium flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Browsing</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-sm divide-y divide-stone-100">
            {cartItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
              >
                {/* Image + Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-stone-200 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-dark bg-sky-soft px-2 py-0.5 rounded">
                      {item.product.fabric}
                    </span>
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-serif text-base font-semibold text-stone-900 hover:text-cherry transition-colors mt-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Selected Size: <strong className="text-stone-800">{item.selectedSize}</strong>
                    </p>
                    <div className="text-sm font-bold text-stone-900 font-serif mt-2">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                  <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-base font-bold text-stone-900 block">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      className="text-stone-400 hover:text-cherry transition-colors text-xs font-medium inline-flex items-center gap-1 mt-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs pt-2">
            <button
              onClick={clearCart}
              className="text-stone-500 hover:text-cherry font-medium underline"
            >
              Clear Entire Bag
            </button>
            <span className="text-stone-400">
              {cartItems.length} design{cartItems.length > 1 ? 's' : ''} in bag
            </span>
          </div>
        </div>

        {/* Right: Summary Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-sky-200 p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-semibold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h2>

            {/* Subtotal lines */}
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-serif font-bold text-stone-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-cherry font-semibold">
                  <span>Festive Discount:</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="text-emerald-700 font-bold">FREE (Complimentary)</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-stone-900">Total Payable:</span>
                <span className="font-serif text-2xl font-bold text-cherry">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-stone-100">
              <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                Promo Code / Gift Coupon:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WARDROBE10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs uppercase focus:outline-none focus:border-cherry"
                />
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && <p className="text-[11px] text-emerald-600 font-medium">{promoSuccess}</p>}
              {promoError && <p className="text-[11px] text-cherry font-medium">{promoError}</p>}
            </form>

            {/* Note on WhatsApp Checkout */}
            <div className="p-4 bg-sky-soft rounded-xl border border-sky-200/80 text-xs text-stone-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-sky-dark text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Boutique WhatsApp Checkout</span>
              </div>
              <p className="font-light text-[11px] leading-relaxed">
                No credit card details required online. Proceeding to checkout will let you confirm shipping details and place your order directly via WhatsApp or inquiry request.
              </p>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-cherry hover:bg-cherry-hover text-white py-4 rounded-xl font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Authentic Handloom Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
};
