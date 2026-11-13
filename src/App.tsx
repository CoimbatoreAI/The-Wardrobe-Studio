import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Check, X } from 'lucide-react';

import { Home } from './pages/Home';
import { Collections } from './pages/Collections';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { Founder } from './pages/Founder';
import { Franchise } from './pages/Franchise';
import { Favorites } from './pages/Favorites';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { ReturnPolicy } from './pages/ReturnPolicy';
import { FAQ } from './pages/FAQ';
import { ShippingAndDelivery } from './pages/ShippingAndDelivery';
import { ContactUs } from './pages/ContactUs';
import { Login, Register, VerifyEmail, ForgotPassword, ResetPassword } from './pages/AuthPages';
import { Account } from './pages/Account';
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { Products as AdminProducts } from './admin/Products';
import { Categories as AdminCategories } from './admin/Categories';
import { Orders as AdminOrders } from './admin/Orders';
import { Users as AdminUsers } from './admin/Users';
import { Settings as AdminSettings } from './admin/Settings';

// Scroll to top helper on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 0);
  }, [pathname]);
  return null;
}

// Toast notification for Add to Bag
function ToastNotification() {
  const { toastMessage, clearToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 bg-[#1C3347] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-sky-300/40 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 max-w-sm">
      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
        <Check className="w-4 h-4" />
      </div>
      <p className="text-xs text-sky-100 font-medium leading-tight flex-1">{toastMessage}</p>
      <button onClick={clearToast} className="p-1 text-sky-300 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 font-sans selection:bg-[#D92B38] selection:text-white">
      <Header />
      <ToastNotification />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route element={<StoreLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/account" element={<Account />} />
                <Route path="/about" element={<About />} />
                <Route path="/founder" element={<Founder />} />
                <Route path="/franchise" element={<Franchise />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/shipping" element={<ShippingAndDelivery />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="*" element={<Home />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
