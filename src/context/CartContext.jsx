import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('rw_cart');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('rw_cart', JSON.stringify(cart));
  }, [cart]);

  function add(product, qty = 1) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + qty } : p));
      return [...prev, { ...product, quantity: qty }];
    });
  }

  function update(id, quantity) {
    setCart((prev) => prev.flatMap((p) => (p.id === id && quantity > 0 ? [{ ...p, quantity }] : p.id === id && quantity <= 0 ? [] : [p])));
  }

  function remove(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function clear() {
    setCart([]);
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const itemsCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, add, update, remove, clear, subtotal, itemsCount }}>
      {children}
    </CartContext.Provider>
  );
}
