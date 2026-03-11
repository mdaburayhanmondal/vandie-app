'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  vandyId: string;
  vandyName: string;
  category: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => { success: boolean; conflict?: boolean };
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  currentVandyId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('vandy_plate');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('vandy_plate', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const currentVandyId = useMemo(
    () => (cart.length > 0 ? cart[0].vandyId : null),
    [cart],
  );

  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart],
  );
  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart],
  );

  const addToCart = (newItem: CartItem) => {
    if (cart.length > 0 && cart[0].vandyId !== newItem.vandyId) {
      return { success: false, conflict: true };
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === newItem._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === newItem._id ?
            { ...item, quantity: item.quantity + 1 }
          : item,
        );
      }
      return [...prevCart, { ...newItem, quantity: 1 }];
    });

    return { success: true };
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === itemId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
        currentVandyId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
