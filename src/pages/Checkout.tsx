import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, MapPin, Phone, User, Mail, Send, CreditCard, Banknote, Lock } from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { BRAND_CONFIG } from '../data/products';
import { CustomerDetails, Order } from '../types';
import { api } from '../lib/api';

type PaymentMethod = 'razorpay' | 'cod' | 'whatsapp';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const inputCls =
  'w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-900';
const plainInputCls =
  'w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-900';
const labelCls = 'text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1';

const METHOD_META: Record<PaymentMethod, { icon: React.ElementType; title: string; sub: string }> = {
  razorpay: { icon: CreditCard, title: 'Pay Online', sub: 'UPI, Cards, Netbanking, Wallets · Secured by Razorpay' },
  cod: { icon: Banknote, title: 'Cash on Delivery', sub: 'Pay when your order arrives' },
  whatsapp: { icon: WhatsAppIcon, title: 'Order via WhatsApp', sub: `Confirm & pay with our team on ${BRAND_CONFIG.phone}` },
};

export const Checkout: React.FC = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '',
    orderNotes: '',
  });

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const availableMethods = (['razorpay', 'cod', 'whatsapp'] as PaymentMethod[]).filter((m) =>
    m === 'razorpay' ? settings.razorpayEnabled : m === 'cod' ? settings.codEnabled : settings.whatsappOrderEnabled
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  useEffect(() => {
    if (availableMethods.length && !availableMethods.includes(paymentMethod)) setPaymentMethod(availableMethods[0]);
  }, [settings]);

  const shipping = settings.freeShippingAbove && subtotal >= settings.freeShippingAbove ? 0 : settings.shippingFee || 0;
  const total = subtotal + shipping;

  // Prefill from the logged-in account
  useEffect(() => {
    if (!user) return;
    const a = user.address || {};
    setFormData((f) => ({
      ...f,
      fullName: f.fullName || a.fullName || user.name,
      phoneNumber: f.phoneNumber || a.phoneNumber || user.phone || '',
      email: f.email || user.email,
      address: f.address || a.address || '',
      city: a.city || f.city,
      state: a.state || f.state,
      pincode: f.pincode || a.pincode || '',
    }));
  }, [user?._id]);

  useEffect(() => {
    if (cartItems.length === 0 && !placedOrder) navigate('/cart');
  }, [cartItems.length, placedOrder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppMessage = (orderNumber: string) => {
    const itemsList = cartItems
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.product.name}*\n   - Size: ${item.selectedSize}\n   - Qty: ${item.quantity}\n   - Price: ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
      )
      .join('\n');

    const msg =
      `*NEW ORDER ${orderNumber} - THE WARDROBE STUDIO*\n` +
      `----------------------------------------\n` +
      `*Customer Name:* ${formData.fullName}\n` +
      `*Phone:* ${formData.phoneNumber}\n` +
      `*Email:* ${formData.email}\n` +
      `*Delivery Address:* ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n` +
      (formData.orderNotes ? `*Special Notes:* ${formData.orderNotes}\n` : '') +
      `----------------------------------------\n` +
      `*ORDERED ITEMS:*\n${itemsList}\n` +
      `----------------------------------------\n` +
      `*Total:* ₹${total.toLocaleString('en-IN')}\n` +
      `Please confirm availability and dispatch estimated time. Thank you!`;

    return encodeURIComponent(msg);
  };

  const finish = (order: Order) => {
    setPlacedOrder(order);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = async () => {
    setError('');
    if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.pincode) {
      setError('Please fill in your Name, Phone Number, Address and Pincode.');
      return;
    }
    setBusy(true);
    try {
      const res = await api<{ order: Order; razorpay?: { keyId: string; orderId: string; amount: number; currency: string } }>('/orders', {
        body: {
          paymentMethod,
          customer: formData,
          items: cartItems.map((i) => ({ productId: i.product.id, size: i.selectedSize, color: i.selectedColor, quantity: i.quantity })),
        },
      });

      if (paymentMethod === 'whatsapp') {
        window.open(`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${generateWhatsAppMessage(res.order.orderNumber)}`, '_blank');
        finish(res.order);
        setBusy(false);
        return;
      }

      if (paymentMethod === 'razorpay' && res.razorpay) {
        if (!(await loadRazorpay())) throw new Error('Could not load the payment window. Check your connection and try again.');
        const rz = new window.Razorpay({
          key: res.razorpay.keyId,
          order_id: res.razorpay.orderId,
          amount: res.razorpay.amount,
          currency: res.razorpay.currency,
          name: BRAND_CONFIG.name,
          description: `Order ${res.order.orderNumber}`,
          image: `${window.location.origin}/logo.png`,
          prefill: { name: formData.fullName, email: formData.email, contact: formData.phoneNumber },
          theme: { color: '#D92B38' },
          handler: async (resp: any) => {
            try {
              const v = await api<{ order: Order }>(`/orders/${res.order._id}/verify-payment`, { body: resp });
              finish(v.order);
            } catch (err) {
              setError(`${(err as Error).message}. If money was deducted, please contact us with order ${res.order.orderNumber}.`);
            } finally {
              setBusy(false);
            }
          },
          modal: {
            ondismiss: () => {
              setBusy(false);
              setError('Payment was cancelled. You can try again.');
              api(`/orders/${res.order._id}/payment-failed`, { body: {} }).catch(() => {});
            },
          },
        });
        rz.on('payment.failed', (resp: any) => setError(resp?.error?.description || 'Payment failed. Please try again.'));
        rz.open();
        return; // busy is cleared by handler / ondismiss
      }

      finish(res.order);
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  };

  if (authLoading) return null;

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-in zoom-in-50 duration-300">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="text-cherry text-xs font-bold uppercase tracking-[0.25em] block">
          {placedOrder.paymentStatus === 'Paid' ? 'Payment Successful' : 'Order Placed'}
        </span>
        <h1 className="font-serif text-3xl font-normal text-stone-900">Thank You, {placedOrder.customer.fullName}!</h1>
        <p className="text-stone-600 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto">
          Your order reference is <strong className="text-stone-900 font-mono text-base">{placedOrder.orderNumber}</strong>. A confirmation
          has been sent to <strong>{placedOrder.customer.email}</strong>, and you'll get an email every time your order status changes.
        </p>

        <div className="bg-sky-soft p-6 rounded-2xl border border-sky-200 text-left space-y-3 max-w-lg mx-auto text-xs text-stone-700">
          <h4 className="font-serif text-sm font-bold text-sky-dark">Delivery Address:</h4>
          <p>
            {placedOrder.customer.address}, {placedOrder.customer.city}, {placedOrder.customer.state} - {placedOrder.customer.pincode}
          </p>
          <div className="pt-2 border-t border-sky-200 flex justify-between font-bold text-stone-900">
            <span>Total Value:</span>
            <span>₹{placedOrder.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/account"
            className="bg-cherry hover:bg-cherry-hover text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow"
          >
            Track My Order
          </Link>
          <button
            onClick={() => navigate('/')}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl"
          >
            Return to Store Home
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) return null;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-sky-soft flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7 text-sky-dark" />
        </div>
        <h1 className="font-serif text-3xl text-stone-900">Log in to check out</h1>
        <p className="text-sm text-stone-600 font-light">
          Sign in or create a free account so we can email your order updates and you can track every order.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login?redirect=/checkout"
            className="bg-cherry hover:bg-cherry-hover text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider"
          >
            Log in
          </Link>
          <Link
            to="/register?redirect=/checkout"
            className="border border-stone-300 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:border-cherry hover:text-cherry"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <span className="text-cherry text-xs font-bold uppercase tracking-[0.25em] block mb-1">Boutique Checkout</span>
          <h1 className="font-serif text-3xl font-normal text-stone-900">Shipping & Payment</h1>
        </div>
        <button onClick={() => navigate('/cart')} className="text-xs text-stone-600 hover:text-cherry font-medium flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bag</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Shipping Address Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-sky-dark border-b border-stone-100 pb-3">
              <MapPin className="w-5 h-5 text-cherry" />
              <h2 className="font-serif text-lg font-bold text-stone-900">Customer & Shipping Details</h2>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className={labelCls}>Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="text" name="fullName" required placeholder="e.g. Archana Ramanathan" value={formData.fullName} onChange={handleChange} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>WhatsApp Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="tel" name="phoneNumber" required placeholder="e.g. 8300687857" value={formData.phoneNumber} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Email (for order updates)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="email" name="email" placeholder="e.g. archana@example.com" value={formData.email} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelCls}>Full Door Address & Street *</label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="Door No, Flat/Apartment, Street Name, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-cherry focus:bg-white text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={plainInputCls} />
                </div>
                <div>
                  <label className={labelCls}>State *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className={plainInputCls} />
                </div>
                <div>
                  <label className={labelCls}>Pincode *</label>
                  <input type="text" name="pincode" placeholder="600034" value={formData.pincode} onChange={handleChange} className={plainInputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Custom Size or Gift Instructions (Optional)</label>
                <input
                  type="text"
                  name="orderNotes"
                  placeholder="e.g. Please shorten sleeve length by 1 inch"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  className={plainInputCls}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right: Order Summary & Payment */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-sky-200 p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Outfits in Your Order ({cartItems.length})
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-stone-100">
              {cartItems.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-14 object-cover rounded-lg border border-stone-200" />
                  <div className="flex-1 text-xs">
                    <h4 className="font-semibold text-stone-900 line-clamp-1">{item.product.name}</h4>
                    <span className="text-stone-500 font-light">
                      Size: {item.selectedSize} | Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-stone-900 text-xs">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-serif font-bold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping:</span>
                {shipping ? (
                  <span className="font-bold text-stone-900">₹{shipping.toLocaleString('en-IN')}</span>
                ) : (
                  <span className="text-emerald-700 font-bold">Complimentary</span>
                )}
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                <span>Total Amount:</span>
                <span className="font-serif text-cherry text-xl">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className={labelCls}>Payment Method</p>
              {availableMethods.length === 0 && (
                <p className="text-xs text-red-600">Ordering is temporarily unavailable. Please contact us on WhatsApp.</p>
              )}
              {availableMethods.map((m) => {
                const { icon: Icon, title, sub } = METHOD_META[m];
                return (
                  <label
                    key={m}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === m ? 'border-cherry bg-red-50/40' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input type="radio" name="paymentMethod" checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} className="accent-[#D92B38]" />
                    <Icon className="w-5 h-5 text-stone-700" />
                    <span className="flex-1">
                      <span className="block text-xs font-semibold text-stone-900">{title}</span>
                      <span className="block text-[11px] text-stone-500">{sub}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            {error && <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}

            <button
              type="button"
              onClick={placeOrder}
              disabled={busy || availableMethods.length === 0}
              className="w-full bg-cherry hover:bg-cherry-hover disabled:opacity-60 text-white py-4 rounded-xl font-semibold text-xs uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {paymentMethod === 'razorpay' ? <Lock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{busy ? 'Processing…' : paymentMethod === 'razorpay' ? `Pay ₹${total.toLocaleString('en-IN')}` : 'Place Order'}</span>
            </button>

            <div className="p-4 bg-sky-soft rounded-xl text-[11px] text-stone-600 space-y-1">
              <p className="font-semibold text-sky-dark">Notice:</p>
              <p className="font-light">
                Your order is saved to your account and a confirmation email is sent instantly. You'll receive email updates as it's packed,
                shipped and delivered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
