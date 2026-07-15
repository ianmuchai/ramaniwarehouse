import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';
import { useCart } from '../context/CartContext';

function formatKes(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');
  const { add } = useCart();

  useEffect(() => {
    axios.get('/api/products')
      .then((res) => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const product = useMemo(() => products.find((entry) => String(entry.id) === String(id)), [products, id]);
  const related = useMemo(() => products.filter((entry) => entry.category === product?.category && entry.id !== product?.id).slice(0, 3), [products, product]);

  function addToCart() {
    add(product, qty);
    setMessage(`${qty} item${qty > 1 ? 's' : ''} added to cart.`);
  }

  function buyNow() {
    add(product, qty);
    navigate('/checkout');
  }

  if (loading) return <main className="container"><div className="loading-card">Loading product...</div></main>;
  if (!product) return <main className="container"><div className="loading-card">Product not found.</div></main>;

  return (
    <main className="product-detail-page">
      <section className="product-hero container">
        <div className="product-gallery">
          <img className="main-product-image" src={assetUrl(product.image)} alt={product.name} />
          <div className="gallery-strip">
            {(product.gallery || [product.image]).map((image) => <img key={image} src={assetUrl(image)} alt="" />)}
          </div>
        </div>
        <div className="product-info-panel">
          <Link to="/categories" className="back-link">Back to categories</Link>
          <span className="category-pill big">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="product-proof-row">
            <span>{product.rating} rating</span>
            <span>{product.stock}</span>
            <span>{product.leadTime}</span>
          </div>
          <div className="spec-row detail">
            {(product.specs || []).map((spec) => <span key={spec}>{spec}</span>)}
          </div>
          <div className="purchase-box">
            <div>
              <small>Price</small>
              <strong>{formatKes(product.price)}</strong>
            </div>
            <div className="qty-stepper" aria-label="Quantity selector">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <div className="purchase-actions">
              <button className="button primary" type="button" onClick={buyNow}>Buy now</button>
              <button className="button secondary" type="button" onClick={addToCart}>Add to cart</button>
            </div>
            {message ? <p className="status-text">{message}</p> : null}
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section related-section">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">Related supply</span>
              <h2>More from {product.category}.</h2>
            </div>
            <Link className="button secondary" to="/categories">All categories</Link>
          </div>
          <div className="related-grid">
            {related.map((entry) => (
              <Link key={entry.id} to={`/product/${entry.id}`} className="related-card">
                <img src={assetUrl(entry.image)} alt={entry.name} />
                <strong>{entry.name}</strong>
                <span>{formatKes(entry.price)}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}



