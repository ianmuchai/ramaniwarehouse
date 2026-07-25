import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import QuoteForm from './QuoteForm';
import { whatsappUrl } from '../utils/whatsapp';

function formatKes(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

function buyingModeLabel(mode) {
  if (mode === 'consult') return 'Consult first';
  if (mode === 'quote') return 'Quote-led';
  return 'Checkout-ready';
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');
  const { add } = useCart();
  const { addCompare } = useCompare();

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
    if (product?.buyingMode === 'consult') {
      setMessage('This item needs a consult before cart checkout. Send a project brief below.');
      return;
    }
    add(product, qty);
    setMessage(`${qty} item${qty > 1 ? 's' : ''} added to cart.`);
  }

  function buyNow() {
    if (product?.buyingMode === 'consult') {
      setMessage('This item needs a consult before checkout. Send a project brief below.');
      return;
    }
    add(product, qty);
    navigate('/checkout');
  }

  if (loading) return <main className="container"><div className="loading-card">Loading product...</div></main>;
  if (!product) return <main className="container"><div className="loading-card">Product not found.</div></main>;

  const isConsultFirst = product.buyingMode === 'consult';
  const isQuoteLed = product.buyingMode === 'quote' || product.quoteOnly;

  return (
    <main className="product-detail-page">
      <section className="product-hero container">
        <div className="product-gallery">
          <img className="main-product-image" src={assetUrl(product.image)} alt={product.name} loading="eager" decoding="async" />
          <div className="gallery-strip">
            {(product.gallery || [product.image]).map((image) => <img key={image} src={assetUrl(image)} alt="" loading="lazy" decoding="async" />)}
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
            <span className="buying-mode-pill">{buyingModeLabel(product.buyingMode)}</span>
          </div>
          <div className="spec-row detail">
            {(product.specs || []).map((spec) => <span key={spec}>{spec}</span>)}
          </div>
          <div className="spec-row detail">
            {(product.useCases || []).map((useCase) => <span key={useCase}>{useCase}</span>)}
          </div>
          {product.supportNotes ? <p className="support-note">{product.supportNotes}</p> : null}
          <div className="purchase-box">
            <div>
              <small>{isConsultFirst ? 'Indicative price' : 'Price'}</small>
              <strong>{formatKes(product.price)}</strong>
            </div>
            <div className="qty-stepper" aria-label="Quantity selector">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">-</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
            </div>
            <div className="purchase-actions">
              {isConsultFirst ? (
                <a className="button primary" href="#product-quote">Request consult</a>
              ) : (
                <>
                  <button className="button primary" type="button" onClick={buyNow}>{isQuoteLed ? 'Start quote cart' : 'Buy now'}</button>
                  <button className="button secondary" type="button" onClick={addToCart}>{isQuoteLed ? 'Add for quote' : 'Add to cart'}</button>
                </>
              )}
              <a className="button secondary" href="#product-quote">{isConsultFirst ? 'Project brief' : 'Request quote'}</a>
              <button className="button secondary" type="button" onClick={() => addCompare(product)}>Compare</button>
              <a className="button glass" href={whatsappUrl({ text: `Hello Ramani Warehouse, I am interested in ${product.name} (${product.sku}).` })} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
            {message ? <p className="status-text" role="status" aria-live="polite">{message}</p> : null}
          </div>
        </div>
      </section>

      <section className="section product-quote-section" id="product-quote">
        <div className="container product-quote-panel card-panel">
          <div>
            <span className="eyebrow">Project quote</span>
            <h2>Need help confirming quantities or fulfillment?</h2>
            <p>Share your project context and Ramani will confirm stock, buying mode, and quote details.</p>
          </div>
          <QuoteForm source="product" products={[product]} defaultNotes={`I am interested in ${product.name}.`} />
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
                <img src={assetUrl(entry.image)} alt={entry.name} loading="lazy" decoding="async" />
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