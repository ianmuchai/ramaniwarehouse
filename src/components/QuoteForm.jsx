import React, { useState } from 'react';
import { whatsappUrl } from '../utils/whatsapp';

export default function QuoteForm({ source, products = [], categories = [], defaultNotes = '', onSuccess }) {
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', company: '', location: '' });
  const [interest, setInterest] = useState({ budget: '', timeline: '', notes: defaultNotes });
  const [preferredContact, setPreferredContact] = useState('whatsapp');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim()) {
      setMessage('Name and phone are required.');
      return;
    }
    setSubmitting(true);
    setMessage('Sending request...');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          customer,
          preferredContact,
          interest: {
            ...interest,
            products: products.map((product) => ({ id: product.id, name: product.name, sku: product.sku, buyingMode: product.buyingMode })),
            categories
          }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Quote request failed.');
      setMessage('Request received. Ramani will follow up with you.');
      onSuccess?.(data.lead);
    } catch (error) {
      setMessage(error.message || 'Could not send request.');
    } finally {
      setSubmitting(false);
    }
  }

  const whatsAppText = `Hello Ramani Warehouse, I would like a quote for ${products.map((product) => product.name).join(', ') || categories.join(', ') || 'project materials'}. ${interest.notes || ''}`.trim();

  return (
    <form className="quote-form" onSubmit={submit} aria-busy={submitting}>
      <div className="quote-grid">
        <label>Name<input required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
        <label>Phone<input required type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
        <label>Email<input type="email" autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
        <label>Company<input autoComplete="organization" value={customer.company} onChange={(event) => setCustomer({ ...customer, company: event.target.value })} /></label>
        <label>Location<input autoComplete="shipping address-level2" value={customer.location} onChange={(event) => setCustomer({ ...customer, location: event.target.value })} /></label>
        <label>Budget range<input inputMode="text" autoComplete="off" value={interest.budget} onChange={(event) => setInterest({ ...interest, budget: event.target.value })} /></label>
        <label>Timeline<input autoComplete="off" value={interest.timeline} onChange={(event) => setInterest({ ...interest, timeline: event.target.value })} /></label>
        <label>Preferred follow-up<select value={preferredContact} onChange={(event) => setPreferredContact(event.target.value)}><option value="whatsapp">WhatsApp</option><option value="call">Call</option><option value="email">Email</option></select></label>
      </div>
      <label>Project notes<textarea rows="4" value={interest.notes} onChange={(event) => setInterest({ ...interest, notes: event.target.value })} /></label>
      <div className="quote-actions">
        <button className="button primary" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Request quote'}</button>
        <a className="button secondary" href={whatsappUrl({ text: whatsAppText })} target="_blank" rel="noreferrer">WhatsApp Ramani</a>
      </div>
      {message ? <p className="status-text" role="status" aria-live="polite">{message}</p> : null}
    </form>
  );
}