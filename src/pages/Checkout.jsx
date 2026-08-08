import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { assetUrl } from '../utils/assets';

export default function Checkout() {
  const { cart, update, clear } = useCart();
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!cart.length) {
      setMessage('Your quote list is empty. Add a product first.');
      return;
    }

    setSubmitting(true);
    setMessage('Preparing your quote request...');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, customer })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Quote request failed.');
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(`Order ${data.orderId} created. Ramani Warehouse will confirm fulfillment.`);
        clear();
      }
    } catch (error) {
      setMessage(error.message || 'Quote request could not be completed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">Quote list</span>
          <h1>Confirm your quote request.</h1>
          <p>Review quantities and delivery details before sending the quote request.</p>
        </div>
      </section>

      <section className="container checkout-grid">
        <form className="checkout-form card-panel" onSubmit={submit} aria-busy={submitting}>
          <h2>Guest quote request</h2>
          <p className="form-helper">No account required. Ramani uses these details to confirm delivery, availability, and fulfillment.</p>
          <label>Full name<input required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
          <label>Email<input type="email" required autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
          <label>Phone<input type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
          <label>Delivery address<textarea required rows="4" autoComplete="shipping street-address" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} /></label>
          <div className="checkout-assurance" aria-label="Checkout assurances">
            <span>No account required</span>
            <span>Delivery confirmed by staff</span>
            <span>Quote support available</span>
          </div>
          <button className="button primary" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send order request'}</button>
          {message ? <p className="status-text" role="status" aria-live="polite">{message}</p> : null}
        </form>

        <aside className="order-summary card-panel">
          <h2>Quote summary</h2>
          {cart.length === 0 ? (
            <div className="empty-cart"><p>No items in your quote list.</p><Link className="button secondary" to="/categories">Browse products</Link></div>
          ) : (
            <>
              <div className="cart-lines">
                {cart.map((item) => (
                  <div key={item.id} className="cart-line">
                    <img src={assetUrl(item.image)} alt="" loading="lazy" decoding="async" />
                    <div>
                      <strong>{item.name}</strong>
                      <span>Quantity: {item.quantity}</span>
                    </div>
                    <div className="qty-controls" aria-label={`Quantity controls for ${item.name}`}>
                      <button type="button" onClick={() => update(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => update(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-box">
                <div><span>Commercial details</span><strong>Confirmed by Ramani</strong></div>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}