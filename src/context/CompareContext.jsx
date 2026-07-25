import React, { createContext, useContext, useMemo, useState } from 'react';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]);

  function addCompare(product) {
    setItems((current) => {
      if (!product || current.some((entry) => String(entry.id) === String(product.id))) return current;
      return [...current, product].slice(0, 4);
    });
  }

  function removeCompare(id) {
    setItems((current) => current.filter((entry) => String(entry.id) !== String(id)));
  }

  function clearCompare() {
    setItems([]);
  }

  function isCompared(id) {
    return items.some((entry) => String(entry.id) === String(id));
  }

  const value = useMemo(() => ({ items, addCompare, removeCompare, clearCompare, isCompared }), [items]);
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const value = useContext(CompareContext);
  if (!value) throw new Error('useCompare must be used inside CompareProvider');
  return value;
}