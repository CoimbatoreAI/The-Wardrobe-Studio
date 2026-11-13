import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { api, inr, formatDate } from '../lib/api';
import { User, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { Card, PageHeader, Btn, Field, Toggle, Badge, Modal, Empty, Spinner, inputCls, orderStatusClass } from './ui';

type Draft = Partial<User> & { password?: string };

export const Users: React.FC = () => {
  const { user: me } = useAuth();
  const [items, setItems] = useState<User[] | null>(null);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [editing, setEditing] = useState<Draft | null>(null);
  const [viewing, setViewing] = useState<{ user: User; orders: Order[] } | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    const qs = new URLSearchParams();
    if (q) qs.set('q', q);
    if (role) qs.set('role', role);
    return api<User[]>(`/admin/users?${qs}`).then(setItems);
  };
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [q, role]);

  const save = async () => {
    if (!editing) return;
    setError('');
    setSaving(true);
    try {
      if (editing._id) await api(`/admin/users/${editing._id}`, { method: 'PUT', body: editing });
      else await api('/admin/users', { body: editing });
      setEditing(null);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const patch = async (u: User, body: Partial<User>) => {
    try {
      await api(`/admin/users/${u._id}`, { method: 'PUT', body });
      load();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const remove = async (u: User) => {
    if (!confirm(`Delete ${u.email}? Their orders will be kept.`)) return;
    try {
      await api(`/admin/users/${u._id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={items ? `${items.length} accounts` : undefined}
        actions={
          <Btn onClick={() => { setError(''); setEditing({ name: '', email: '', phone: '', password: '', role: 'user', isVerified: true }); }}>
            <Plus className="w-4 h-4" /> Add user
          </Btn>
        }
      />
      <Card>
        <div className="p-4 border-b border-stone-200 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={`${inputCls} pl-9`} placeholder="Name, email or phone…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className={`${inputCls} w-auto`} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="user">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        {!items ? (
          <Spinner />
        ) : items.length === 0 ? (
          <Empty>No users found</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-stone-500 bg-stone-50">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">User</th>
                  <th className="text-left font-medium px-4 py-2.5">Status</th>
                  <th className="text-right font-medium px-4 py-2.5">Orders</th>
                  <th className="text-right font-medium px-4 py-2.5">Spent</th>
                  <th className="text-left font-medium px-4 py-2.5">Joined</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u._id} className="border-t border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">
                        {u.name} {u._id === me?._id && <span className="text-xs text-stone-400">(you)</span>}
                      </p>
                      <p className="text-xs text-stone-500">
                        {u.email}
                        {u.phone ? ` · ${u.phone}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.role === 'admin' && <Badge className="bg-stone-900 text-white">Admin</Badge>}
                        <button onClick={() => patch(u, { isVerified: !u.isVerified })} title="Toggle verified">
                          <Badge className={u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                            {u.isVerified ? 'Verified' : 'Unverified'}
                          </Badge>
                        </button>
                        {u.isBlocked && <Badge className="bg-red-100 text-red-800">Blocked</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{u.orders}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{inr(u.spent || 0)}</td>
                    <td className="px-4 py-3 text-xs text-stone-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Btn variant="ghost" size="sm" title="View" onClick={() => api(`/admin/users/${u._id}`).then(setViewing)}>
                        <Eye className="w-4 h-4" />
                      </Btn>
                      <Btn variant="ghost" size="sm" title="Edit" onClick={() => { setError(''); setEditing({ ...u, password: '' }); }}>
                        <Pencil className="w-4 h-4" />
                      </Btn>
                      {u._id !== me?._id && (
                        <Btn variant="ghost" size="sm" title="Delete" onClick={() => remove(u)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Btn>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && (
        <Modal
          title={editing._id ? `Edit ${editing.email}` : 'Add user'}
          onClose={() => setEditing(null)}
          footer={
            <>
              {error && <span className="text-sm text-red-600 mr-auto self-center">{error}</span>}
              <Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Btn>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Name *">
              <input className={inputCls} value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email *">
                <input type="email" className={inputCls} value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              </Field>
              <Field label="Phone">
                <input className={inputCls} value={editing.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
              </Field>
            </div>
            <Field label={editing._id ? 'New password' : 'Password *'} hint={editing._id ? 'Leave empty to keep the current password' : undefined}>
              <input type="text" className={inputCls} value={editing.password || ''} onChange={(e) => setEditing({ ...editing, password: e.target.value })} />
            </Field>
            <Field label="Role">
              <select className={inputCls} value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as User['role'] })}>
                <option value="user">Customer</option>
                <option value="admin">Admin (full access to this panel)</option>
              </select>
            </Field>
            <Toggle checked={!!editing.isVerified} onChange={(v) => setEditing({ ...editing, isVerified: v })} label="Email verified" />
            {editing._id && (
              <Toggle checked={!!editing.isBlocked} onChange={(v) => setEditing({ ...editing, isBlocked: v })} label="Blocked" hint="Blocked users can't log in or order" />
            )}
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal wide title={viewing.user.name} onClose={() => setViewing(null)}>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-stone-600">{viewing.user.email}</p>
              <p className="text-stone-600">{viewing.user.phone}</p>
              <p className="text-xs text-stone-500 pt-2">Joined {formatDate(viewing.user.createdAt)}</p>
              {viewing.user.lastLoginAt && <p className="text-xs text-stone-500">Last login {formatDate(viewing.user.lastLoginAt)}</p>}
              {viewing.user.address?.address && (
                <div className="pt-3">
                  <p className="text-xs font-semibold text-stone-500 uppercase mb-1">Saved address</p>
                  <p className="text-stone-700">
                    {viewing.user.address.address}, {viewing.user.address.city}, {viewing.user.address.state} - {viewing.user.address.pincode}
                  </p>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-stone-500 uppercase mb-2">Orders ({viewing.orders.length})</p>
              {viewing.orders.length === 0 ? (
                <p className="text-stone-500">No orders yet</p>
              ) : (
                <div className="border border-stone-200 rounded-lg divide-y divide-stone-100">
                  {viewing.orders.map((o) => (
                    <Link key={o._id} to={`/admin/orders?open=${o._id}`} className="flex items-center gap-3 p-3 hover:bg-stone-50">
                      <span className="font-mono font-semibold flex-1">{o.orderNumber}</span>
                      <span className="text-xs text-stone-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
                      <Badge className={orderStatusClass(o.status)}>{o.status}</Badge>
                      <span className="font-semibold tabular-nums">{inr(o.total)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
