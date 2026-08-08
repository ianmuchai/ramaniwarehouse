import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { assetUrl } from '../utils/assets';

export default function CompareTray() {
  const { items, removeCompare, clearCompare } = useCompare();
  const { add } = useCart();
  if (!items.length) return null;

  return (
    <aside className="compare-tray" aria-label="Product comparison">
      <div className="compare-tray-head">
        <div><strong>Compare products</strong><span>{items.length}/4 selected</span></div>
        <button type="button" onClick={clearCompare}>Clear</button>
      </div>
      <div className="compare-grid">
        {items.map((item) => (
          <article key={item.id}>
            <img src={assetUrl(item.image)} alt="" />
            <strong>{item.name}</strong>
            <span>{item.category}</span>
            <small>{item.stock} | {item.leadTime}</small>
            <small>Quote on request</small>
            <div>
              <button type="button" onClick={() => add(item, 1)}>Quote list</button>
              <button type="button" onClick={() => removeCompare(item.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
      <Link className="button primary compact" to="/contact">Request comparison quote</Link>
    </aside>
  );
}