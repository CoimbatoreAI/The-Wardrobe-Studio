import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingCart, Users, Package, AlertTriangle } from 'lucide-react';
import { api, inr, formatDate } from '../lib/api';
import { Order, ORDER_STATUSES } from '../types';
import { Card, PageHeader, Badge, Spinner, orderStatusClass, paymentStatusClass } from './ui';

interface Stats {
  users: number;
  products: number;
  orders: number;
  revenue: number;
  byStatus: Record<string, number>;
  recentOrders: Order[];
  daily: { _id: string; revenue: number; orders: number }[];
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [setup, setSetup] = useState<{ razorpay: boolean; smtp: boolean } | null>(null);

  useEffect(() => {
    api<Stats>('/admin/stats').then(setStats);
    api('/admin/settings').then((s) => setSetup({ razorpay: s.razorpayEnabled && !!s.razorpayKeyId, smtp: !!s.smtpHost }));
  }, []);

  if (!stats) return <Spinner />;

  // Fill the last 14 days so empty days still show
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 864e5);
    const key = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const hit = stats.daily.find((x) => x._id === key);
    return { key, label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), revenue: hit?.revenue || 0, orders: hit?.orders || 0 };
  });
  const max = Math.max(1, ...days.map((d) => d.revenue));

  const tiles = [
    { label: 'Revenue', value: inr(stats.revenue), icon: IndianRupee, to: '/admin/orders' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, to: '/admin/orders' },
    { label: 'Customers', value: stats.users, icon: Users, to: '/admin/users' },
    { label: 'Products', value: stats.products, icon: Package, to: '/admin/products' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your store" />

      {setup && (!setup.razorpay || !setup.smtp) && (
        <Card className="p-4 mb-6 border-amber-200 bg-amber-50 flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-sm text-amber-900 space-y-1">
            {!setup.razorpay && <p>Online payments are off. Add your Razorpay keys to accept UPI/card payments.</p>}
            {!setup.smtp && <p>Email is not configured, so verification, thank-you and order update emails are not being sent.</p>}
            <Link to="/admin/settings" className="font-semibold underline">
              Open settings
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {tiles.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="p-4 hover:border-stone-300 transition-colors">
              <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                {label}
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-semibold text-stone-900 mt-2 tabular-nums">{value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-stone-900 mb-4">Revenue · last 14 days</h2>
          <div className="flex items-end gap-1.5 h-44">
            {days.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
                <span className="text-[10px] text-stone-500 opacity-0 group-hover:opacity-100 tabular-nums">{d.revenue ? inr(d.revenue) : ''}</span>
                <div
                  className="w-full max-w-6 bg-cherry/80 group-hover:bg-cherry rounded-t"
                  style={{ height: `${(d.revenue / max) * 100}%`, minHeight: d.revenue ? 4 : 1 }}
                  title={`${d.label}: ${inr(d.revenue)} · ${d.orders} order(s)`}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-1">
            {days.map((d, i) => (
              <span key={d.key} className="flex-1 text-center text-[9px] text-stone-400">
                {i % 2 === 0 ? d.label : ''}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-stone-900 mb-4">Orders by status</h2>
          <div className="space-y-2">
            {ORDER_STATUSES.map((s) => (
              <Link key={s} to={`/admin/orders?status=${encodeURIComponent(s)}`} className="flex items-center justify-between text-sm hover:bg-stone-50 rounded px-1 py-0.5">
                <Badge className={orderStatusClass(s)}>{s}</Badge>
                <span className="tabular-nums font-medium">{stats.byStatus[s] || 0}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <h2 className="text-sm font-semibold text-stone-900">Recent orders</h2>
          <Link to="/admin/orders" className="text-xs text-cherry font-medium">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center text-stone-500">No orders yet</td>
                </tr>
              )}
              {stats.recentOrders.map((o) => (
                <tr key={o._id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <Link to={`/admin/orders?open=${o._id}`} className="font-mono font-semibold text-stone-900 hover:text-cherry">
                      {o.orderNumber}
                    </Link>
                    <p className="text-xs text-stone-500">{formatDate(o.createdAt)}</p>
                  </td>
                  <td className="px-5 py-3">{o.customer.fullName}</td>
                  <td className="px-5 py-3">
                    <Badge className={orderStatusClass(o.status)}>{o.status}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={paymentStatusClass(o.paymentStatus)}>{o.paymentStatus}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{inr(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};
