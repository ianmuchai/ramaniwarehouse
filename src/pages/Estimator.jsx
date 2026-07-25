import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { assetUrl } from '../utils/assets';
import { whatsappUrl } from '../utils/whatsapp';

const projectTypes = ['home', 'office', 'retail', 'hospitality', 'workshop', 'maintenance', 'construction', 'recycling', 'glass craft', 'cleaning operations', 'furniture sourcing', 'interior fit-out', 'plumbing', 'custom'];
const urgencies = ['today', 'this week', 'this month', 'planning'];

function formatKes(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

function recommendProducts(products, input) {
  const selected = new Set(input.categories);
  const terms = [input.projectType, input.quantity, input.notes, ...input.categories].join(' ').toLowerCase();
  return products.filter((product) => {
    const categoryMatch = selected.size === 0 || selected.has(product.category);
    const projectMatch = (product.projectTypes || []).some((type) => terms.includes(String(type).toLowerCase()));
    const tagMatch = (product.tags || []).some((tag) => terms.includes(String(tag).toLowerCase()));
    const useMatch = (product.useCases || []).some((useCase) => terms.includes(String(useCase).toLowerCase()));
    return categoryMatch || projectMatch || tagMatch || useMatch;
  }).slice(0, 6);
}

function modeLabel(mode) {
  if (mode === 'consult') return 'Consult first';
  if (mode === 'quote') return 'Quote-led';
  return 'Checkout-ready';
}

export default function Estimator() {
  const [site, setSite] = useState({ categories: [], products: [] });
  const [input, setInput] = useState({ projectType: 'custom', categories: [], quantity: '', urgency: 'this week', location: '', budget: '', notes: '' });
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', location: '' });
  const [preferredContact, setPreferredContact] = useState('whatsapp');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    axios.get('/api/site').then((res) => setSite(res.data || {})).catch(() => {});
  }, []);

  const recommendation = useMemo(() => recommendProducts(site.products || [], input), [site.products, input]);
  const estimatedSubtotal = recommendation.reduce((sum, product) => sum + Number(product.price || 0), 0);

  function toggleCategory(categoryName) {
    setInput((current) => ({
      ...current,
      categories: current.categories.includes(categoryName) ? current.categories.filter((item) => item !== categoryName) : [...current.categories, categoryName]
    }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim()) {
      setMessage('Name and phone are required so Ramani can follow up.');
      return;
    }
    setSubmitting(true);
    setMessage('Sending estimator request...');
    try {
      const payload = {
        customer: { ...customer, location: customer.location || input.location },
        input,
        preferredContact,
        recommendation: {
          products: recommendation.map((product) => ({ id: product.id, name: product.name, sku: product.sku, buyingMode: product.buyingMode })),
          estimatedSubtotal
        }
      };
      const response = await fetch('/api/estimator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Estimator submission failed.');
      setSubmitted(true);
      setMessage('Estimator submitted. Ramani will confirm quantities and quote details.');
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

  const whatsappText = `Hello Ramani Warehouse, I need help with a ${input.projectType} project. Categories: ${input.categories.join(', ') || 'not sure'}. Quantity/details: ${input.quantity || input.notes || 'to confirm'}.`;

  return (
    <main className="estimator-page">
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">Project Estimator</span>
          <h1>Build a quote-ready Ramani materials list.</h1>
          <p>Select the products and project context you know. Ramani will confirm final quantities, availability, and fulfillment.</p>
        </div>
      </section>

      <section className="container estimator-grid">
        <form className="card-panel estimator-form" onSubmit={submit} aria-busy={submitting}>
          <h2>Project details</h2>
          <label>Project type<select value={input.projectType} onChange={(event) => setInput({ ...input, projectType: event.target.value })}>{projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          <div className="category-choice-grid">
            {(site.categories || []).map((category) => <label key={category.id}><input type="checkbox" checked={input.categories.includes(category.name)} onChange={() => toggleCategory(category.name)} />{category.name}</label>)}
          </div>
          <label>Approximate quantity or area<input autoComplete="off" value={input.quantity} onChange={(event) => setInput({ ...input, quantity: event.target.value })} placeholder="e.g. 4 rooms, 20 packs, 200kg, not sure" /></label>
          <div className="quote-grid"><label>Urgency<select value={input.urgency} onChange={(event) => setInput({ ...input, urgency: event.target.value })}>{urgencies.map((urgency) => <option key={urgency} value={urgency}>{urgency}</option>)}</select></label><label>Delivery area<input autoComplete="shipping address-level2" value={input.location} onChange={(event) => setInput({ ...input, location: event.target.value })} /></label></div>
          <label>Budget range<input inputMode="text" autoComplete="off" value={input.budget} onChange={(event) => setInput({ ...input, budget: event.target.value })} /></label>
          <label>Notes<textarea rows="4" value={input.notes} onChange={(event) => setInput({ ...input, notes: event.target.value })} /></label>
          <h2>Follow-up details</h2>
          <div className="quote-grid"><label>Name<input required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label><label>Phone<input required type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label><label>Email<input type="email" autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label><label>Preferred contact<select value={preferredContact} onChange={(event) => setPreferredContact(event.target.value)}><option value="whatsapp">WhatsApp</option><option value="call">Call</option><option value="email">Email</option></select></label></div>
          <button className="button primary" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Request formal quote'}</button>
          {message ? <p className="status-text" role="status" aria-live="polite">{message}</p> : null}
        </form>

        <aside className="card-panel recommendation-panel">
          <span className="eyebrow">Suggested starting list</span>
          <h2>{recommendation.length ? `${recommendation.length} matched products` : 'Choose categories to begin'}</h2>
          <p>This is a planning aid. Ramani will confirm final quantities, compatibility, stock, and quote details.</p>
          <div className="recommendation-list">
            {recommendation.map((product) => <article key={product.id}><img src={assetUrl(product.image)} alt="" loading="lazy" decoding="async" /><div><strong>{product.name}</strong><span>{modeLabel(product.buyingMode)} | {product.measurementUnit}</span><small>{product.supportNotes}</small></div><b>{formatKes(product.price)}</b></article>)}
          </div>
          {recommendation.length ? <div className="quote-actions"><button className="button secondary" type="button" onClick={addRecommendedToCart}>Add suitable items to cart</button><a className="button glass" href={whatsappUrl({ text: whatsappText })} target="_blank" rel="noreferrer">Continue on WhatsApp</a></div> : <Link className="button secondary" to="/categories">Browse categories</Link>}
          {submitted ? <p className="status-text" role="status" aria-live="polite">Saved as a Ramani lead for follow-up.</p> : null}
        </aside>
      </section>
    </main>
  );
}