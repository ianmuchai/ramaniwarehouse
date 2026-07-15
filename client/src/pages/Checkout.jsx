import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { assetUrl } from '../utils/assets';

function formatKes(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

export default function Checkout() {
  const { cart, subtotal, update, clear } = useCart();
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal > 0 ? 1500 : 0;
  const total = subtotal + shipping;

  async function submit(event) {
    event.preventDefault();
    if (!cart.length) {
      setMessage('Your cart is empty. Add a product first.');
      return;
    }

    setSubmitting(true);
    setMessage('Preparing your order...');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, customer })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Checkout failed.');
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(`Order ${data.orderId} created. Ramani Warehouse will confirm fulfillment.`);
        clear();
      }
    } catch (error) {
      setMessage(error.message || 'Checkout could not be completed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">Checkout</span>
          <h1>Confirm your project cart.</h1>
          <p>Review quantities, delivery details, and payment path before sending the order.</p>
        </div>
      </section>

      <section className="container checkout-grid">
        <form className="checkout-form card-panel" onSubmit={submit}>
          <h2>Delivery details</h2>
          <label>Full name<input required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
          <label>Email<input type="email" required value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
          <label>Phone<input value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
          <label>Delivery address<textarea required rows="4" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} /></label>
          <button className="button primary" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Proceed to pay'}</button>
          {message ? <p className="status-text">{message}</p> : null}
        </form>

        <aside className="order-summary card-panel">
          <h2>Order summary</h2>
          {cart.length === 0 ? (
            <div className="empty-cart"><p>No items in cart.</p><Link className="button secondary" to="/categories">Start shopping</Link></div>
          ) : (
            <>
              <div className="cart-lines">
                {cart.map((item) => (
                  <div key={item.id} className="cart-line">
                    <img src={assetUrl(item.image)} alt="" />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{formatKes(item.price)} x {item.quantity}</span>
                    </div>
                    <div className="qty-controls">
                      <button type="button" onClick={() => update(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => update(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-box">
                <div><span>Subtotal</span><strong>{formatKes(subtotal)}</strong></div>
                <div><span>Shipping estimate</span><strong>{formatKes(shipping)}</strong></div>
                <div className="total"><span>Total</span><strong>{formatKes(total)}</strong></div>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

