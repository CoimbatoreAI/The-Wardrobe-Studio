import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Trash2, Mail, Eye } from 'lucide-react';
import { api, inr, formatDate } from '../lib/api';
import { Order, ORDER_STATUSES } from '../types';
import { BRAND_CONFIG } from '../data/products';
import { Card, PageHeader, Btn, Field, Badge, Modal, Empty, Spinner, inputCls, orderStatusClass, paymentStatusClass } from './ui';

const methodLabel = (m: string) => (m === 'razorpay' ? 'Razorpay' : m === 'cod' ? 'COD' : 'WhatsApp');

const OrderDetail: React.FC<{ id: string; onClose: () => void; onChanged: () => void }> = ({ id, onClose, onChanged }) => {
  const [o, setO] = useState<Order | null>(null);
  const [form, setForm] = useState({ status: '', paymentStatus: '', courier: '', trackingNumber: '', adminNote: '', note: '', notify: true });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () =>
    api<Order>(`/admin/orders/${id}`).then((d) => {
      setO(d);
      setForm({
        status: d.status,
        paymentStatus: d.paymentStatus,
        courier: d.courier || '',
        trackingNumber: d.trackingNumber || '',
        adminNote: d.adminNote || '',
        note: '',
        notify: true,
      });
    });
  useEffect(() => {
    load();
  }, [id]);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const d = await api<{ order: Order; emailed: boolean }>(`/admin/orders/${id}`, { method: 'PUT', body: form });
      const statusChanged = d.order.status !== o?.status;
      setMsg(statusChanged ? (d.emailed ? 'Saved · customer emailed' : form.notify ? 'Saved · email not sent (check SMTP settings)' : 'Saved') : 'Saved');
      await load();
      onChanged();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const resend = async () => {
    const d = await api<{ emailed: boolean }>(`/admin/orders/${id}/resend-email`, { body: { note: form.note } });
    setMsg(d.emailed ? 'Status email sent to customer' : 'Email not sent (check SMTP settings)');
  };

  const user = o && typeof o.user === 'object' ? o.user : null;

  return (
    <Modal wide title={o ? `Order ${o.orderNumber}` : 'Order'} onClose={onClose}>
      {!o ? (
        <Spinner />
      ) : (
        <div className="grid lg:grid-cols-5 gap-6 text-sm">
          <div className="lg:col-span-3 space-y-5">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className={orderStatusClass(o.status)}>{o.status}</Badge>
              <Badge className={paymentStatusClass(o.paymentStatus)}>
                {methodLabel(o.paymentMethod)} · {o.paymentStatus}
              </Badge>
              <span className="text-xs text-stone-500">{formatDate(o.createdAt)}</span>
            </div>

            <div className="border border-stone-200 rounded-lg divide-y divide-stone-100">
              {o.items.map((i, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3">
                  {i.image && <img src={i.image} alt="" className="w-11 h-14 object-cover rounded border border-stone-200" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 truncate">{i.name}</p>
                    <p className="text-xs text-stone-500">
                      Size {i.size || '-'}
                      {i.color ? ` · ${i.color}` : ''} · {inr(i.price)} × {i.quantity}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums">{inr(i.price * i.quantity)}</span>
                </div>
              ))}
              <div className="p-3 space-y-1 text-xs">
                <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{inr(o.subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="tabular-nums">{o.shipping ? inr(o.shipping) : 'Free'}</span></div>
                <div className="flex justify-between text-sm font-semibold"><span>Total</span><span className="tabular-nums">{inr(o.total)}</span></div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase mb-1">Customer</h3>
                <p className="font-medium">{o.customer.fullName}</p>
                <p className="text-stone-600">{o.customer.email}</p>
                <p className="text-stone-600">
                  {o.customer.phoneNumber}{' '}
                  <a
                    className="text-emerald-700 text-xs font-medium"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://wa.me/91${o.customer.phoneNumber.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${o.customer.fullName}, this is ${BRAND_CONFIG.name} about your order ${o.orderNumber}.`)}`}
                  >
                    WhatsApp
                  </a>
                </p>
                {user && <p className="text-xs text-stone-500 mt-1">Account: {user.email}</p>}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase mb-1">Ship to</h3>
                <p className="text-stone-700">
                  {o.customer.address}, {o.customer.city}, {o.customer.state} - {o.customer.pincode}
                </p>
                {o.customer.orderNotes && <p className="text-xs bg-amber-50 text-amber-900 p-2 rounded mt-2">Note: {o.customer.orderNotes}</p>}
              </div>
            </div>

            {o.razorpayPaymentId && (
              <p className="text-xs text-stone-500">
                Razorpay payment: <span className="font-mono">{o.razorpayPaymentId}</span> · order <span className="font-mono">{o.razorpayOrderId}</span>
              </p>
            )}

            <div>
              <h3 className="text-xs font-semibold text-stone-500 uppercase mb-2">Timeline</h3>
              <ol className="border-l-2 border-stone-200 pl-4 space-y-2">
                {o.statusHistory.map((h, i) => (
                  <li key={i}>
                    <span className="font-medium">{h.status}</span>{' '}
                    <span className="text-xs text-stone-500">· {formatDate(h.at)}</span>
                    {h.note && <p className="text-xs text-stone-600">{h.note}</p>}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 bg-stone-50 border border-stone-200 rounded-lg p-4 h-fit">
            <h3 className="font-semibold text-stone-900">Update order</h3>
            <Field label="Order status">
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Payment status">
              <select className={inputCls} value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}>
                {['Pending', 'Paid', 'Failed', 'Refunded'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Courier">
                <input className={inputCls} placeholder="e.g. DTDC" value={form.courier} onChange={(e) => setForm({ ...form, courier: e.target.value })} />
              </Field>
              <Field label="Tracking no.">
                <input className={inputCls} value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} />
              </Field>
            </div>
            <Field label="Message to customer" hint="Included in the status email and timeline">
              <textarea rows={2} className={inputCls} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-xs text-stone-700">
              <input type="checkbox" checked={form.notify} onChange={(e) => setForm({ ...form, notify: e.target.checked })} />
              Email the customer when status changes
            </label>
            <Field label="Internal note (not shown to customer)">
              <textarea rows={2} className={inputCls} value={form.adminNote} onChange={(e) => setForm({ ...form, adminNote: e.target.value })} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Btn>
              <Btn variant="secondary" onClick={resend} title="Re-send current status email">
                <Mail className="w-4 h-4" /> Email status
              </Btn>
            </div>
            {msg && <p className="text-xs text-stone-700">{msg}</p>}
          </div>
        </div>
      )}
    </Modal>
  );
};

export const Orders: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<Order[] | null>(null);
  const [q, setQ] = useState('');
  const status = params.get('status') || '';
  const payment = params.get('payment') || '';
  const openId = params.get('open');

  const load = () => {
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    if (payment) qs.set('paymentStatus', payment);
    if (q) qs.set('q', q);
    return api<Order[]>(`/admin/orders?${qs}`).then(setItems);
  };
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [status, payment, q]);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next);
  };

  const remove = async (o: Order) => {
    if (!confirm(`Delete order ${o.orderNumber} permanently?`)) return;
    await api(`/admin/orders/${o._id}`, { method: 'DELETE' });
    load();
  };

  const quickStatus = async (o: Order, s: string) => {
    const d = await api<{ order: Order; emailed: boolean }>(`/admin/orders/${o._id}`, { method: 'PUT', body: { status: s, notify: true } });
    setItems((list) => list!.map((x) => (x._id === o._id ? d.order : x)));
  };

  return (
    <>
      <PageHeader title="Orders" subtitle={items ? `${items.length} orders` : undefined} />
      <Card>
        <div className="p-4 border-b border-stone-200 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={`${inputCls} pl-9`} placeholder="Order no, name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className={`${inputCls} w-auto`} value={status} onChange={(e) => setParam('status', e.target.value)}>
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select className={`${inputCls} w-auto`} value={payment} onChange={(e) => setParam('payment', e.target.value)}>
            <option value="">All payments</option>
            {['Pending', 'Paid', 'Failed', 'Refunded'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        {!items ? (
          <Spinner />
        ) : items.length === 0 ? (
          <Empty>No orders found</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-stone-500 bg-stone-50">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">Order</th>
                  <th className="text-left font-medium px-4 py-2.5">Customer</th>
                  <th className="text-left font-medium px-4 py-2.5">Payment</th>
                  <th className="text-left font-medium px-4 py-2.5">Status</th>
                  <th className="text-right font-medium px-4 py-2.5">Total</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {items.map((o) => (
                  <tr key={o._id} className="border-t border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <button onClick={() => setParam('open', o._id)} className="font-mono font-semibold text-stone-900 hover:text-cherry">
                        {o.orderNumber}
                      </button>
                      <p className="text-xs text-stone-500">{formatDate(o.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.customer.fullName}</p>
                      <p className="text-xs text-stone-500">{o.customer.phoneNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={paymentStatusClass(o.paymentStatus)}>
                        {methodLabel(o.paymentMethod)} · {o.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => quickStatus(o, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer ${orderStatusClass(o.status)}`}
                        title="Change status (customer is emailed)"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{inr(o.total)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Btn variant="ghost" size="sm" onClick={() => setParam('open', o._id)} title="View">
                        <Eye className="w-4 h-4" />
                      </Btn>
                      <Btn variant="ghost" size="sm" onClick={() => remove(o)} title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {openId && <OrderDetail id={openId} onClose={() => setParam('open', '')} onChanged={load} />}
    </>
  );
};
