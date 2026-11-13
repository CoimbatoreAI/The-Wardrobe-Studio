import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, SizeType } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, selectedSize: SizeType, quantity?: number, color?: string) => void;
  updateQuantity: (productId: string, selectedSize: SizeType, delta: number) => void;
  removeFromCart: (productId: string, selectedSize: SizeType) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tws_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tws_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('tws_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('tws_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, selectedSize: SizeType, quantity = 1, color?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedSize, quantity, selectedColor: color }];
      }
    });

    setToastMessage(`Added "${product.name}" (Size ${selectedSize}) to your cart.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const updateQuantity = (productId: string, selectedSize: SizeType, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string, selectedSize: SizeType) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === selectedSize))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const clearToast = () => setToastMessage(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems,
        wishlist,
        toggleWishlist,
        toastMessage,
        clearToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
