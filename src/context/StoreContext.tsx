import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';
import { Product, Category, PublicSettings } from '../types';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: PublicSettings;
  loading: boolean;
  refresh: () => void;
}

const defaultSettings: PublicSettings = {
  razorpayEnabled: false,
  razorpayKeyId: '',
  codEnabled: true,
  whatsappOrderEnabled: true,
  shippingFee: 0,
  freeShippingAbove: 1999,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    Promise.all([
      api<Product[]>('/products').then(setProducts),
      api<Category[]>('/categories').then(setCategories),
      api<PublicSettings>('/settings/public').then(setSettings),
    ])
      .catch((err) => console.error('Failed to load store data', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(refresh, [refresh]);

  return (
    <StoreContext.Provider value={{ products, categories, settings, loading, refresh }}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
};
