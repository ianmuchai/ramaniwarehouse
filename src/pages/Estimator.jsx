import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { assetUrl } from '../utils/assets';
import { whatsappUrl } from '../utils/whatsapp';
import {
  buildEstimatorPayload,
  buildEstimatorSummary,
  createEstimatorInput,
  getTrack,
  recommendProducts,
  solutionTracks,
  urgencies
} from '../utils/estimatorLogic.mjs';

function formatKes(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

function modeLabel(mode) {
  if (mode === 'consult') return 'Consult first';
  if (mode === 'quote') return 'Quote-led';
  return 'Checkout-ready';
}

function FieldControl({ field, value, onChange }) {
  if (field.type === 'select') {
    return (
      <label className="dynamic-field">
        <span>{field.label}</span>
        <select value={value || ''} onChange={(event) => onChange(field.key, event.target.value)}>
          {(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  return (
    <label className="dynamic-field">
      <span>{field.label}</span>
      <input
        type={field.type || 'text'}
        inputMode={field.type === 'number' ? 'decimal' : undefined}
        min={field.type === 'number' ? '0' : undefined}
        autoComplete="off"
        value={value || ''}
        placeholder={field.placeholder || ''}
        onChange={(event) => onChange(field.key, event.target.value)}
      />
    </label>
  );
}

export default function Estimator() {
  const [site, setSite] = useState({ categories: [], products: [] });
  const [input, setInput] = useState(() => createEstimatorInput('eco-boards'));
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', location: '' });
  const [preferredContact, setPreferredContact] = useState('whatsapp');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    axios.get('/api/site').then((res) => setSite(res.data || {})).catch(() => {});
  }, []);

  const selectedTrack = useMemo(() => getTrack(input.trackId), [input.trackId]);
  const categoryById = useMemo(() => new Map((site.categories || []).map((category) => [category.id, category])), [site.categories]);
  const products = site.products || [];
  const recommendation = useMemo(() => recommendProducts(products, input), [products, input]);
  const estimatorSummary = useMemo(() => buildEstimatorSummary(input, recommendation), [input, recommendation]);
  const estimatedSubtotal = recommendation.reduce((sum, product) => sum + Number(product.price || 0), 0);
  const heroImage = categoryById.get(selectedTrack.id)?.image || '/images/1784186033855-ChatGPT-Image-Jul-16-2026-10_13_37-AM.png';

  function selectTrack(trackId) {
    setInput((current) => createEstimatorInput(trackId, {
      urgency: current.urgency,
      location: current.location,
      budget: current.budget,
      notes: current.notes
    }));
    setSubmitted(false);
    setMessage('');
  }

  function updateSpec(key, value) {
    setInput((current) => ({ ...current, spec: { ...current.spec, [key]: value } }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim()) {
      setMessage('Name and phone are required so Ramani can follow up.');
      return;
    }
    setSubmitting(true);
    setMessage('Sending product-specific estimator request...');
    try {
      const payload = buildEstimatorPayload(input, customer, preferredContact, recommendation, estimatorSummary);
      const response = await fetch('/api/estimator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Estimator submission failed.');
      setSubmitted(true);
      setMessage('Estimator submitted. Ramani will confirm the product path, quantities, and quote details.');
    } catch (error) {
      setMessage(error.message || 'Could not submit estimator.');
    } finally {
      setSubmitting(false);
    }
  }

  function addRecommendedToCart() {
    recommendation.filter((product) => product.buyingMode !== 'consult').forEach((product) => add(product, 1));
    setMessage('Checkout-ready and quote-led items were added to your cart. Consult-first items remain in your request.');
  }

  const whatsappText = `Hello Ramani Warehouse, I need help with ${selectedTrack.title}. ${estimatorSummary.quantitySignal} Delivery area: ${input.location || customer.location || 'to confirm'}.`;

  return (
    <main className="estimator-page product-aware-estimator-page">
      <section className="page-hero compact estimator-hero">
        <div className="container estimator-hero-inner">
          <div>
            <span className="eyebrow">Product Estimator</span>
            <h1>Build a Ramani quote around the product you actually need.</h1>
            <p>Choose Eco Board, glass, HDPE, PPR, cleaning supplies, furniture, or fit-out support. The estimator changes its questions, planning logic, and recommendations for that product path.</p>
          </div>
          <div className="estimator-hero-proof" aria-label="Estimator coverage">
            <img className="estimator-hero-image" src={assetUrl(heroImage)} alt="" loading="eager" decoding="async" />
            <span>7 product paths</span>
            <span>Dynamic requirements</span>
            <span>Quote-ready handoff</span>
          </div>
        </div>
      </section>

      <section className="container estimator-workbench">
        <form className="estimator-form product-aware-form" onSubmit={submit} aria-busy={submitting}>
          <div className="estimator-section-heading">
            <span className="eyebrow">Step 1</span>
            <h2>Choose the Ramani product type</h2>
            <p>The first choice drives the measurement fields, recommendation logic, and follow-up path.</p>
          </div>

          <div className="product-type-grid" role="list" aria-label="Ramani product estimator paths">
            {solutionTracks.map((track) => {
              const category = categoryById.get(track.id);
              const active = track.id === selectedTrack.id;
              const trackProducts = products.filter((product) => track.productCategoryIds.includes(product.categoryId));
              return (
                <button
                  key={track.id}
                  type="button"
                  role="listitem"
                  className={active ? 'product-type-card active' : 'product-type-card'}
                  style={{ '--track-color': category?.color || '#f97316' }}
                  aria-pressed={active}
                  onClick={() => selectTrack(track.id)}
                >
                  <span className="product-type-media" aria-hidden="true">
                    {category?.image ? <img src={assetUrl(category.image)} alt="" loading="lazy" decoding="async" /> : null}
                  </span>
                  <span className="product-type-body">
                    <span className="track-kicker">{track.buyingPath}</span>
                    <strong>{track.title}</strong>
                    <small>{track.decisionCue}</small>
                    <em>{trackProducts.length || 1} catalogue match</em>
                  </span>
                </button>
              );
            })}
          </div>

          <section className="selected-track-panel" aria-label="Selected path">
            <div>
              <span className="eyebrow">Selected path</span>
              <h2>{selectedTrack.title}</h2>
              <p>{selectedTrack.prompt}</p>
            </div>
            <div className="track-fact-grid">
              <span><strong>{selectedTrack.measurementLabel}</strong>Measurement basis</span>
              <span><strong>{selectedTrack.buyingPath}</strong>Buying path</span>
              <span><strong>{recommendation.length}</strong>Matched products</span>
            </div>
          </section>

          <section className="estimator-step-panel">
            <div className="estimator-section-heading compact-heading">
              <span className="eyebrow">Step 2</span>
              <h2>Product-specific requirements</h2>
              <p>These fields change by product type so Ramani receives the details that matter for that line.</p>
            </div>
            <div className="dynamic-field-grid">
              {selectedTrack.fields.map((field) => (
                <FieldControl key={field.key} field={field} value={input.spec[field.key]} onChange={updateSpec} />
              ))}
            </div>
          </section>

          <section className="estimator-step-panel">
            <div className="estimator-section-heading compact-heading">
              <span className="eyebrow">Step 3</span>
              <h2>Delivery and follow-up</h2>
              <p>Ramani uses this to confirm stock, fulfillment, and the correct commercial path.</p>
            </div>
            <div className="quote-grid">
              <label>Urgency<select value={input.urgency} onChange={(event) => setInput({ ...input, urgency: event.target.value })}>{urgencies.map((urgency) => <option key={urgency} value={urgency}>{urgency}</option>)}</select></label>
              <label>Delivery area<input autoComplete="shipping address-level2" value={input.location} onChange={(event) => setInput({ ...input, location: event.target.value })} /></label>
              <label>Budget range<input inputMode="text" autoComplete="off" value={input.budget} onChange={(event) => setInput({ ...input, budget: event.target.value })} /></label>
              <label>Preferred contact<select value={preferredContact} onChange={(event) => setPreferredContact(event.target.value)}><option value="whatsapp">WhatsApp</option><option value="call">Call</option><option value="email">Email</option></select></label>
            </div>
            <label className="dynamic-field full-field"><span>Extra notes</span><textarea rows="4" value={input.notes} onChange={(event) => setInput({ ...input, notes: event.target.value })} placeholder="Add site constraints, finish expectations, delivery notes, or product questions." /></label>
          </section>

          <section className="estimator-step-panel follow-up-panel">
            <div className="estimator-section-heading compact-heading">
              <span className="eyebrow">Step 4</span>
              <h2>Your details</h2>
            </div>
            <div className="quote-grid">
              <label>Name<input required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
              <label>Phone<input required type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
              <label>Email<input type="email" autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
              <label>Customer location<input autoComplete="shipping address-level2" value={customer.location} onChange={(event) => setCustomer({ ...customer, location: event.target.value })} /></label>
            </div>
            <div className="estimator-action-row">
              <button className="button primary" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Request product quote'}</button>
              <a className="button secondary" href={whatsappUrl({ text: whatsappText })} target="_blank" rel="noreferrer">WhatsApp this estimate</a>
            </div>
            {message ? <p className="status-text" role="status" aria-live="polite">{message}</p> : null}
          </section>
        </form>

        <aside className="card-panel recommendation-panel product-aware-summary">
          <span className="eyebrow">Planning outcome</span>
          <h2>{selectedTrack.buyingPath} sourcing path</h2>
          <div className="estimate-summary-card">
            <span>{estimatorSummary.planningBasis}</span>
            <strong>{estimatorSummary.quantitySignal}</strong>
          </div>
          <div className="estimate-metric-grid">
            <span><strong>{recommendation.length}</strong>Relevant items</span>
            <span><strong>{formatKes(estimatedSubtotal)}</strong>Listed item total</span>
          </div>
          <div className="confirmation-list">
            <h3>Ramani will confirm</h3>
            {estimatorSummary.confirmationPoints.map((point) => <span key={point}>{point}</span>)}
          </div>
          <div className="recommendation-list product-aware-recommendations">
            {recommendation.map((product) => <article key={product.id}><img src={assetUrl(product.image)} alt="" loading="lazy" decoding="async" /><div><strong>{product.name}</strong><span>{modeLabel(product.buyingMode)} | {product.measurementUnit}</span><small>{product.supportNotes}</small></div><b>{formatKes(product.price)}</b></article>)}
          </div>
          {recommendation.length ? <div className="quote-actions"><button className="button secondary" type="button" onClick={addRecommendedToCart}>Add suitable items to cart</button><a className="button glass" href={whatsappUrl({ text: whatsappText })} target="_blank" rel="noreferrer">Continue on WhatsApp</a></div> : <Link className="button secondary" to="/categories">Browse categories</Link>}
          {submitted ? <p className="status-text" role="status" aria-live="polite">Saved as a Ramani product estimate for follow-up.</p> : null}
        </aside>
      </section>
    </main>
  );
}