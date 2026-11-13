import React, { useState } from 'react';
import { NavLink, Navigate, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return <div className="min-h-screen bg-stone-50" />;
  if (!user) return <Navigate to="/login?redirect=/admin" replace />;
  if (user.role !== 'admin')
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-stone-50 p-6 text-center">
        <h1 className="text-xl font-semibold">Admin access only</h1>
        <p className="text-sm text-stone-500">You're logged in as {user.email}, which is not an admin account.</p>
        <Link to="/" className="text-sm text-cherry font-medium">
          Back to store
        </Link>
      </div>
    );

  const sidebar = (
    <nav className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
        <img src="/logo.png" alt="" className="h-9 w-auto bg-white rounded p-0.5" />
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Wardrobe Studio</p>
          <p className="text-sky-200/70 text-[11px]">Admin panel</p>
        </div>
      </div>
      <div className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-white/15 text-white font-medium' : 'text-sky-100/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" /> {label}
          </NavLink>
        ))}
      </div>
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sky-100/80 hover:bg-white/10 hover:text-white">
          <ExternalLink className="w-4 h-4" /> View store
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sky-100/80 hover:bg-white/10 hover:text-white">
          <LogOut className="w-4 h-4" /> Log out
        </button>
        <p className="px-3 pt-2 text-[11px] text-sky-200/60 truncate">{user.email}</p>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans flex">
      <aside className="hidden lg:block w-60 bg-[#1C3347] fixed inset-y-0 left-0">{sidebar}</aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <aside className="w-64 bg-[#1C3347]">{sidebar}</aside>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
      <div className="flex-1 lg:ml-60 min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-stone-200 h-14 flex items-center px-4 gap-3">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-semibold text-sm">Admin panel</span>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
