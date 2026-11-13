import React, { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Upload, X, Star } from 'lucide-react';
import { api, inr } from '../lib/api';
import { Product, Category } from '../types';
import { useStore } from '../context/StoreContext';
import { Card, PageHeader, Btn, Field, Toggle, Badge, Modal, Empty, Spinner, inputCls } from './ui';

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', 'Free Size'];

type Draft = Omit<Product, 'id'> & { id?: string; isActive?: boolean };

const blank = (category = ''): Draft => ({
  name: '',
  subtitle: '',
  category,
  price: 0,
  originalPrice: undefined,
  rating: 5,
  reviewsCount: 0,
  images: [],
  fabric: '',
  description: '',
  details: [],
  careInstructions: [],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: [],
  isNew: true,
  isBestseller: false,
  inStock: true,
  isActive: true,
});

const ProductForm: React.FC<{ initial: Draft; categories: Category[]; onClose: () => void; onSaved: () => void }> = ({
  initial,
  categories,
  onClose,
  onSaved,
}) => {
  const [p, setP] = useState<Draft>(initial);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initial.id;
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setP((x) => ({ ...x, [k]: v }));

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    setUploading(true);
    try {
      const d = await api<{ urls: string[] }>('/admin/upload', { body: fd });
      set('images', [...p.images, ...d.urls]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const save = async () => {
    setError('');
    if (!p.name || !p.category || !p.price) return setError('Name, category and price are required');
    setSaving(true);
    try {
      if (isEdit) await api(`/admin/products/${initial.id}`, { method: 'PUT', body: p });
      else await api('/admin/products', { body: p });
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const lines = (v: string[]) => v.join('\n');
  const fromLines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

  return (
    <Modal
      wide
      title={isEdit ? `Edit · ${initial.name}` : 'Add product'}
      onClose={onClose}
      footer={
        <>
          {error && <span className="text-sm text-red-600 mr-auto self-center">{error}</span>}
          <Btn variant="secondary" onClick={onClose}>
            Cancel
          </Btn>
          <Btn onClick={save} disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </Btn>
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Field label="Product name *">
            <input className={inputCls} value={p.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="Subtitle">
            <input className={inputCls} value={p.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category *">
              <select className={inputCls} value={p.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c._id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Fabric / material">
              <input className={inputCls} list="fabrics" value={p.fabric} onChange={(e) => set('fabric', e.target.value)} />
              <datalist id="fabrics">
                {['Mul Cotton', 'Mul Chanderi', 'Silk Chanderi', 'Georgette', 'Modal Silk'].map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Selling price (₹) *">
              <input type="number" min={0} className={inputCls} value={p.price || ''} onChange={(e) => set('price', Number(e.target.value))} />
            </Field>
            <Field label="MRP / original price (₹)" hint="Shown struck-through">
              <input
                type="number"
                min={0}
                className={inputCls}
                value={p.originalPrice ?? ''}
                onChange={(e) => set('originalPrice', e.target.value === '' ? undefined : Number(e.target.value))}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rating (0–5)">
              <input type="number" min={0} max={5} step={0.1} className={inputCls} value={p.rating} onChange={(e) => set('rating', Number(e.target.value))} />
            </Field>
            <Field label="Reviews count">
              <input type="number" min={0} className={inputCls} value={p.reviewsCount} onChange={(e) => set('reviewsCount', Number(e.target.value))} />
            </Field>
          </div>
          <Field label="Description">
            <textarea rows={3} className={inputCls} value={p.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
          <Field label="Details" hint="One per line">
            <textarea rows={3} className={inputCls} defaultValue={lines(p.details)} onChange={(e) => set('details', fromLines(e.target.value))} />
          </Field>
          <Field label="Care instructions" hint="One per line">
            <textarea rows={3} className={inputCls} defaultValue={lines(p.careInstructions)} onChange={(e) => set('careInstructions', fromLines(e.target.value))} />
          </Field>
        </div>

        <div className="space-y-5">
          <div>
            <span className="block text-xs font-medium text-stone-700 mb-2">Images (first one is the main image)</span>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {p.images.map((src, i) => (
                <div key={src + i} className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                    {i > 0 && (
                      <button
                        type="button"
                        title="Make main image"
                        onClick={() => set('images', [src, ...p.images.filter((_, j) => j !== i)])}
                        className="p-1 bg-white rounded"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button type="button" title="Remove" onClick={() => set('images', p.images.filter((_, j) => j !== i))} className="p-1 bg-white rounded">
                      <X className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </div>
                  {i === 0 && <span className="absolute top-1 left-1 text-[9px] bg-cherry text-white px-1 rounded">MAIN</span>}
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="aspect-[3/4] rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-500 hover:border-cherry hover:text-cherry text-xs gap-1"
              >
                <Upload className="w-5 h-5" />
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
            <div className="flex gap-2">
              <input className={inputCls} placeholder="…or paste an image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <Btn
                type="button"
                variant="secondary"
                onClick={() => {
                  if (imageUrl.trim()) set('images', [...p.images, imageUrl.trim()]);
                  setImageUrl('');
                }}
              >
                Add
              </Btn>
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-stone-700 mb-2">Sizes</span>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => {
                const on = p.sizes.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => set('sizes', on ? p.sizes.filter((x) => x !== s) : ALL_SIZES.filter((x) => x === s || p.sizes.includes(x)))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${on ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 text-stone-600'}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-stone-700 mb-2">Colours</span>
            <div className="space-y-2">
              {p.colors.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => set('colors', p.colors.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))}
                    className="w-10 h-9 rounded border border-stone-300 p-0.5"
                  />
                  <input
                    className={inputCls}
                    placeholder="Colour name"
                    value={c.name}
                    onChange={(e) => set('colors', p.colors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                  />
                  <Btn type="button" variant="ghost" size="sm" onClick={() => set('colors', p.colors.filter((_, j) => j !== i))}>
                    <X className="w-4 h-4" />
                  </Btn>
                </div>
              ))}
              <Btn type="button" variant="secondary" size="sm" onClick={() => set('colors', [...p.colors, { name: '', hex: '#D92B38' }])}>
                <Plus className="w-3.5 h-3.5" /> Add colour
              </Btn>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-stone-200">
            <Toggle checked={p.isActive !== false} onChange={(v) => set('isActive', v)} label="Visible in store" hint="Turn off to hide without deleting" />
            <Toggle checked={p.inStock} onChange={(v) => set('inStock', v)} label="In stock" />
            <Toggle checked={!!p.isNew} onChange={(v) => set('isNew', v)} label="Mark as New" />
            <Toggle checked={!!p.isBestseller} onChange={(v) => set('isBestseller', v)} label="Bestseller" hint="Shown on the home page" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const Products: React.FC = () => {
  const { refresh } = useStore();
  const [items, setItems] = useState<(Product & { isActive?: boolean })[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = () => api<Product[]>('/admin/products').then(setItems);
  useEffect(() => {
    load();
    api<Category[]>('/admin/categories').then(setCategories);
  }, []);

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}" permanently? Tip: you can hide it instead by turning off "Visible in store".`)) return;
    await api(`/admin/products/${p.id}`, { method: 'DELETE' });
    load();
    refresh();
  };

  const quickToggle = async (p: Product & { isActive?: boolean }, field: 'inStock' | 'isActive') => {
    await api(`/admin/products/${p.id}`, { method: 'PUT', body: { [field]: !(p[field] ?? true) } });
    load();
    refresh();
  };

  const shown = (items || []).filter(
    (p) => (!cat || p.category === cat) && (!q || `${p.name} ${p.id} ${p.fabric}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={items ? `${items.length} products` : undefined}
        actions={
          <Btn onClick={() => setEditing(blank(categories[0]?.name))}>
            <Plus className="w-4 h-4" /> Add product
          </Btn>
        }
      />
      <Card>
        <div className="p-4 border-b border-stone-200 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={`${inputCls} pl-9`} placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className={`${inputCls} w-auto`} value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        {!items ? (
          <Spinner />
        ) : shown.length === 0 ? (
          <Empty>No products found</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-stone-500 bg-stone-50">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">Product</th>
                  <th className="text-left font-medium px-4 py-2.5">Category</th>
                  <th className="text-right font-medium px-4 py-2.5">Price</th>
                  <th className="text-left font-medium px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr key={p.id} className="border-t border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0] || '/logo.png'} alt="" className="w-10 h-12 rounded object-cover bg-stone-100 border border-stone-200" />
                        <div className="min-w-0">
                          <p className="font-medium text-stone-900 truncate max-w-[260px]">{p.name}</p>
                          <p className="text-xs text-stone-500">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{p.category}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className="font-semibold">{inr(p.price)}</span>
                      {p.originalPrice ? <span className="block text-xs text-stone-400 line-through">{inr(p.originalPrice)}</span> : null}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button onClick={() => quickToggle(p, 'isActive')} title="Toggle visibility">
                          <Badge className={p.isActive === false ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-emerald-800'}>
                            {p.isActive === false ? 'Hidden' : 'Visible'}
                          </Badge>
                        </button>
                        <button onClick={() => quickToggle(p, 'inStock')} title="Toggle stock">
                          <Badge className={p.inStock ? 'bg-sky-100 text-sky-800' : 'bg-red-100 text-red-800'}>{p.inStock ? 'In stock' : 'Out of stock'}</Badge>
                        </button>
                        {p.isBestseller && <Badge className="bg-amber-100 text-amber-800">Bestseller</Badge>}
                        {p.isNew && <Badge className="bg-violet-100 text-violet-800">New</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Btn variant="ghost" size="sm" onClick={() => setEditing(p)} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Btn>
                      <Btn variant="ghost" size="sm" onClick={() => remove(p)} title="Delete">
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
      {editing && (
        <ProductForm
          initial={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
            refresh();
          }}
        />
      )}
    </>
  );
};
