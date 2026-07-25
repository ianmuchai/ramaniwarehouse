import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';

function formatKes(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

function modeLabel(mode) {
  if (mode === 'consult') return 'Consult first';
  if (mode === 'quote') return 'Quote-led';
  return 'Checkout-ready';
}

export default function ProductList({ category, limit, products: providedProducts }) {
  const [remoteProducts, setRemoteProducts] = useState([]);
  const [loading, setLoading] = useState(!providedProducts);
  const [addedId, setAddedId] = useState(null);
  const { add } = useCart();
  const { addCompare, isCompared } = useCompare();

  useEffect(() => {
    if (providedProducts) return undefined;
    let mounted = true;
    setLoading(true);
    axios.get('/api/products')
      .then((res) => {
        if (!mounted) return;
        setRemoteProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [providedProducts]);

  const visible = useMemo(() => {
    const source = providedProducts || remoteProducts;
    const filtered = category && category !== 'All' ? source.filter((product) => product.category === category) : source;
    return limit ? filtered.slice(0, limit) : filtered;
  }, [category, limit, providedProducts, remoteProducts]);

  function addProduct(product) {
    if (product.buyingMode === 'consult') return;
    add(product, 1);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1400);
  }

  if (loading) return <div className="loading-card">Loading products...</div>;
  if (!visible.length) return <div className="loading-card">No products found for this selection.</div>;

  return (
    <div className="product-grid">
      {visible.map((product) => (
        <article key={product.id} className="product-card">
          <Link to={`/product/${product.id}`} className="product-media" aria-label={`View ${product.name}`}>
            <img src={assetUrl(product.image)} alt={product.name} loading="lazy" decoding="async" />
            <span className="product-badge">{product.badge}</span>
          </Link>
          <div className="product-body">
            <div className="product-meta">
              <span>{product.category}</span>
              <span>{product.rating} rating</span>
            </div>
            <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
            <p>{product.description}</p>
            <div className="spec-row">
              {(product.specs || []).slice(0, 3).map((spec) => <span key={spec}>{spec}</span>)}
            </div>
            <div className="product-commerce-row">
              <span>{product.stock}</span>
              <span>{product.leadTime}</span>
              <span className="buying-mode-chip">{modeLabel(product.buyingMode)}</span>
            </div>
            <div className="product-footer">
              <div>
                <strong>{formatKes(product.price)}</strong>
                <small>{product.buyingMode === 'consult' ? 'Consult-backed pricing' : 'Project-ready pricing'}</small>
              </div>
            </div>
            <div className="product-card-actions">
              {product.buyingMode === 'consult' ? (
                <Link className="button primary compact" to={`/product/${product.id}#product-quote`}>Request consult</Link>
              ) : (
                <button className="button primary compact" type="button" onClick={() => addProduct(product)}>{addedId === product.id ? 'Added' : product.buyingMode === 'quote' ? 'Add for quote' : 'Add to cart'}</button>
              )}
              <button className="button secondary compact" type="button" onClick={() => addCompare(product)}>{isCompared(product.id) ? 'Comparing' : 'Compare'}</button>
              <Link className="button secondary compact" to={`/product/${product.id}`}>View details</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}