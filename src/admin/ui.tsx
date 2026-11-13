import React from 'react';
import { X } from 'lucide-react';

export const inputCls =
  'w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-cherry focus:ring-2 focus:ring-red-100';

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`bg-white border border-stone-200 rounded-xl shadow-sm ${className}`}>{children}</div>
);

export const PageHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({ title, subtitle, actions }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">{title}</h1>
      {subtitle && <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; size?: 'sm' | 'md' };
export const Btn: React.FC<BtnProps> = ({ variant = 'primary', size = 'md', className = '', ...props }) => {
  const v = {
    primary: 'bg-cherry hover:bg-cherry-hover text-white',
    secondary: 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-stone-600 hover:bg-stone-100',
  }[variant];
  const s = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${v} ${s} ${className}`}
    />
  );
};

export const Field: React.FC<{ label: string; hint?: string; className?: string; children: React.ReactNode }> = ({ label, hint, className = '', children }) => (
  <label className={`block ${className}`}>
    <span className="block text-xs font-medium text-stone-700 mb-1">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-stone-500 mt-1">{hint}</span>}
  </label>
);

export const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }> = ({ checked, onChange, label, hint }) => (
  <label className="flex items-start gap-3 cursor-pointer select-none">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`mt-0.5 w-10 h-6 rounded-full relative transition-colors shrink-0 ${checked ? 'bg-emerald-500' : 'bg-stone-300'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
    <span>
      <span className="block text-sm font-medium text-stone-800">{label}</span>
      {hint && <span className="block text-xs text-stone-500">{hint}</span>}
    </span>
  </label>
);

export const Badge: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = 'bg-stone-100 text-stone-700', children }) => (
  <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${className}`}>{children}</span>
);

export const Modal: React.FC<{ title: string; onClose: () => void; wide?: boolean; children: React.ReactNode; footer?: React.ReactNode }> = ({
  title,
  onClose,
  wide,
  children,
  footer,
}) => (
  <div className="fixed inset-0 z-[100] bg-black/40 flex items-start sm:items-center justify-center p-2 sm:p-6 overflow-y-auto" onMouseDown={onClose}>
    <div
      className={`bg-white rounded-xl shadow-2xl w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} my-4 flex flex-col max-h-[calc(100vh-2rem)]`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
        <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
        <button onClick={onClose} className="p-1 text-stone-500 hover:text-stone-900" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5 overflow-y-auto flex-1">{children}</div>
      {footer && <div className="px-5 py-3 border-t border-stone-200 flex justify-end gap-2">{footer}</div>}
    </div>
  </div>
);

export const Empty: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-center text-sm text-stone-500 py-12">{children}</div>
);

export const Spinner = () => <div className="w-8 h-8 border-2 border-cherry border-t-transparent rounded-full animate-spin mx-auto my-12" />;

export const orderStatusClass = (s: string) =>
  ({
    Pending: 'bg-amber-100 text-amber-800',
    Confirmed: 'bg-sky-100 text-sky-800',
    Processing: 'bg-indigo-100 text-indigo-800',
    Shipped: 'bg-violet-100 text-violet-800',
    'Out for Delivery': 'bg-cyan-100 text-cyan-800',
    Delivered: 'bg-emerald-100 text-emerald-800',
    Cancelled: 'bg-red-100 text-red-800',
    Returned: 'bg-stone-200 text-stone-700',
  })[s] || 'bg-stone-100 text-stone-700';

export const paymentStatusClass = (s: string) =>
  ({ Paid: 'bg-emerald-100 text-emerald-800', Pending: 'bg-amber-100 text-amber-800', Failed: 'bg-red-100 text-red-800', Refunded: 'bg-stone-200 text-stone-700' })[s] ||
  'bg-stone-100 text-stone-700';
