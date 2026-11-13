import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, User as UserIcon, LogOut, ChevronDown, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, inr, formatDate } from '../lib/api';
import { Order } from '../types';

export const statusColor = (s: string) =>
  ({
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Confirmed: 'bg-sky-50 text-sky-700 border-sky-200',
    Processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Shipped: 'bg-violet-50 text-violet-700 border-violet-200',
    'Out for Delivery': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
    Returned: 'bg-stone-100 text-stone-700 border-stone-200',
  })[s] || 'bg-stone-100 text-stone-700 border-stone-200';

const inputCls = 'w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-cherry focus:bg-white';

export const Account: React.FC = () => {
  const { user, loading, logout, setUser } = useAuth();
  const [tab, setTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [profile, setProfile] = useState({ name: '', phone: '', currentPassword: '', newPassword: '' });
  const [address, setAddress] = useState({ fullName: '', phoneNumber: '', address: '', city: '', state: '', pincode: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) return;
    api<Order[]>('/orders/mine').then(setOrders).catch(() => setOrders([]));
    setProfile((p) => ({ ...p, name: user.name, phone: user.phone || '' }));
    setAddress({ fullName: '', phoneNumber: '', address: '', city: '', state: '', pincode: '', ...(user.address || {}) });
  }, [user?._id]);

  if (loading) return null;
  if (!user) return <Navigate to="/login?redirect=/account" replace />;

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const d = await api('/auth/me', { method: 'PUT', body: { ...profile, address } });
      setUser(d.user);
      setProfile((p) => ({ ...p, currentPassword: '', newPassword: '' }));
      setMsg('Saved');
    } catch (err) {
      setMsg((err as Error).message);
    }
  };

  const cancel = async (o: Order) => {
    if (!confirm(`Cancel order ${o.orderNumber}?`)) return;
    try {
      const updated = await api<Order>(`/orders/${o._id}/cancel`, { body: {} });
      setOrders((list) => list!.map((x) => (x._id === o._id ? updated : x)));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-cherry text-xs font-bold uppercase tracking-[0.25em] block mb-1">My Account</span>
          <h1 className="font-serif text-3xl text-stone-900">Hello, {user.name}</h1>
          <p className="text-xs text-stone-500 mt-1">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {user.role === 'admin' && (
            <Link to="/admin" className="text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white px-4 py-2.5 rounded-lg">
              Admin panel
            </Link>
          )}
          <button onClick={logout} className="text-xs font-semibold uppercase tracking-wider border border-stone-300 px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:border-cherry hover:text-cherry">
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { k: 'orders', label: 'My Orders', icon: Package },
          { k: 'profile', label: 'Profile & Address', icon: UserIcon },
        ].map(({ k, label, icon: Icon }) => (
          <button
            key={k}
            onClick={() => setTab(k as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider ${tab === k ? 'bg-cherry text-white' : 'bg-white border border-stone-200 text-stone-700'}`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders === null && <p className="text-sm text-stone-500">Loading orders…</p>}
          {orders?.length === 0 && (
            <div className="bg-white border border-sky-100 rounded-2xl p-10 text-center space-y-3">
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm text-stone-600">You haven't placed any orders yet.</p>
              <Link to="/collections" className="inline-block text-xs text-cherry font-semibold uppercase tracking-wider">
                Shop now
              </Link>
            </div>
          )}
          {orders?.map((o) => (
            <div key={o._id} className="bg-white border border-sky-100 rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open === o._id ? null : o._id)} className="w-full p-5 flex flex-wrap items-center gap-4 text-left">
                <div className="flex-1 min-w-[160px]">
                  <p className="font-mono text-sm font-bold text-stone-900">{o.orderNumber}</p>
                  <p className="text-xs text-stone-500">{formatDate(o.createdAt)} · {o.items.length} item(s)</p>
                </div>
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${statusColor(o.status)}`}>{o.status}</span>
                <span className="font-serif font-bold text-stone-900">{inr(o.total)}</span>
                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${open === o._id ? 'rotate-180' : ''}`} />
              </button>
              {open === o._id && (
                <div className="border-t border-stone-100 p-5 grid md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3">
                    {o.items.map((i, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {i.image && <img src={i.image} alt="" className="w-12 h-14 object-cover rounded-lg border border-stone-200" />}
                        <div className="flex-1">
                          <p className="font-semibold text-stone-900">{i.name}</p>
                          <p className="text-stone-500">Size {i.size} · Qty {i.quantity}</p>
                        </div>
                        <span className="font-semibold">{inr(i.price * i.quantity)}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-stone-100 space-y-1">
                      <div className="flex justify-between"><span>Subtotal</span><span>{inr(o.subtotal)}</span></div>
                      <div className="flex justify-between"><span>Shipping</span><span>{o.shipping ? inr(o.shipping) : 'Free'}</span></div>
                      <div className="flex justify-between font-bold text-sm"><span>Total</span><span>{inr(o.total)}</span></div>
                      <p className="text-stone-500 pt-1">
                        Payment: {o.paymentMethod === 'razorpay' ? 'Online' : o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'WhatsApp'} · {o.paymentStatus}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-stone-900 mb-1">Delivery address</p>
                      <p className="text-stone-600">{o.customer.fullName}, {o.customer.address}, {o.customer.city}, {o.customer.state} - {o.customer.pincode}</p>
                    </div>
                    {o.trackingNumber && (
                      <div className="flex items-center gap-2 bg-sky-soft p-3 rounded-lg">
                        <Truck className="w-4 h-4 text-sky-dark" />
                        <span>{o.courier || 'Courier'}: <strong>{o.trackingNumber}</strong></span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-stone-900 mb-2">Order timeline</p>
                      <ol className="space-y-2 border-l-2 border-sky-100 pl-4">
                        {o.statusHistory.map((h, idx) => (
                          <li key={idx}>
                            <p className="font-semibold text-stone-800">{h.status}</p>
                            <p className="text-stone-500">{formatDate(h.at)}{h.note ? ` · ${h.note}` : ''}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                    {['Pending', 'Confirmed'].includes(o.status) && (
                      <button onClick={() => cancel(o)} className="text-red-600 font-semibold underline">
                        Cancel order
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <form onSubmit={saveProfile} className="bg-white border border-sky-100 rounded-2xl p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="font-serif text-lg text-stone-900">Profile</h2>
            <input className={inputCls} placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <input className={inputCls} placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <h3 className="font-serif text-base text-stone-900 pt-3">Change password</h3>
            <input className={inputCls} type="password" placeholder="Current password" value={profile.currentPassword} onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })} />
            <input className={inputCls} type="password" placeholder="New password" value={profile.newPassword} onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })} />
          </div>
          <div className="space-y-3">
            <h2 className="font-serif text-lg text-stone-900">Saved delivery address</h2>
            <input className={inputCls} placeholder="Full name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
            <input className={inputCls} placeholder="Phone" value={address.phoneNumber} onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })} />
            <textarea className={inputCls} rows={2} placeholder="Door no, street, landmark" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} />
            <div className="grid grid-cols-3 gap-2">
              <input className={inputCls} placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <input className={inputCls} placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              <input className={inputCls} placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
            </div>
          </div>
          <div className="md:col-span-2 flex items-center gap-4">
            <button className="bg-cherry hover:bg-cherry-hover text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider">Save changes</button>
            {msg && <span className="text-xs text-stone-600">{msg}</span>}
          </div>
        </form>
      )}
    </div>
  );
};
