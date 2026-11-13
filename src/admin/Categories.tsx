import React, { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { api } from '../lib/api';
import { Category } from '../types';
import { useStore } from '../context/StoreContext';
import { Card, PageHeader, Btn, Field, Toggle, Badge, Modal, Empty, Spinner, inputCls } from './ui';

type Draft = Partial<Category>;

export const Categories: React.FC = () => {
  const { refresh } = useStore();
  const [items, setItems] = useState<Category[] | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api<Category[]>('/admin/categories').then(setItems);
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.name) return setError('Name is required');
    setSaving(true);
    setError('');
    try {
      if (editing._id) await api(`/admin/categories/${editing._id}`, { method: 'PUT', body: editing });
      else await api('/admin/categories', { body: editing });
      setEditing(null);
      load();
      refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    try {
      await api(`/admin/categories/${c._id}`, { method: 'DELETE' });
      load();
      refresh();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const fd = new FormData();
    fd.append('images', files[0]);
    const d = await api<{ urls: string[] }>('/admin/upload', { body: fd });
    setEditing((e) => ({ ...e, image: d.urls[0] }));
  };

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Shown on the home page and as filters in Collections"
        actions={
          <Btn onClick={() => { setError(''); setEditing({ name: '', description: '', image: '', count: '', sortOrder: (items?.length || 0), isActive: true }); }}>
            <Plus className="w-4 h-4" /> Add category
          </Btn>
        }
      />
      {!items ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Card>
          <Empty>No categories yet</Empty>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <Card key={c._id} className="overflow-hidden flex flex-col">
              <div className="aspect-[16/9] bg-stone-100 relative">
                {c.image && <img src={c.image} alt="" className="w-full h-full object-cover" />}
                {c.isActive === false && <Badge className="absolute top-2 left-2 bg-stone-800 text-white">Hidden</Badge>}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-stone-900">{c.name}</h3>
                  <span className="text-xs text-stone-400">#{c.sortOrder}</span>
                </div>
                <p className="text-xs text-stone-500 mt-1 flex-1">{c.description}</p>
                <div className="flex justify-end gap-1 mt-3">
                  <Btn variant="ghost" size="sm" onClick={() => { setError(''); setEditing(c); }}>
                    <Pencil className="w-4 h-4" /> Edit
                  </Btn>
                  <Btn variant="ghost" size="sm" onClick={() => remove(c)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <Modal
          title={editing._id ? 'Edit category' : 'Add category'}
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
            <Field label="Name *" hint={editing._id ? 'Renaming also moves all products in this category' : undefined}>
              <input className={inputCls} value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea rows={2} className={inputCls} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Field label="Image">
              <div className="flex gap-2">
                <input className={inputCls} placeholder="Image URL" value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
                <Btn type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
                  <Upload className="w-4 h-4" />
                </Btn>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files)} />
              </div>
              {editing.image && <img src={editing.image} alt="" className="mt-2 h-28 rounded-lg object-cover" />}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Badge text" hint='e.g. "24 Designs"'>
                <input className={inputCls} value={editing.count || ''} onChange={(e) => setEditing({ ...editing, count: e.target.value })} />
              </Field>
              <Field label="Sort order">
                <input type="number" className={inputCls} value={editing.sortOrder ?? 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} />
              </Field>
            </div>
            <Toggle checked={editing.isActive !== false} onChange={(v) => setEditing({ ...editing, isActive: v })} label="Visible in store" />
          </div>
        </Modal>
      )}
    </>
  );
};
