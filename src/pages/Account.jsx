import React from 'react';
import { Link } from 'react-router-dom';

export default function Account() {
  return (
    <main>
      <section className="page-hero compact account-hero">
        <div className="container">
          <span className="eyebrow">Customer Account</span>
          <h1>Your Ramani account.</h1>
          <p>Track orders, save delivery details, and manage project sourcing requests. Live customer authentication can be connected when the account system is ready.</p>
        </div>
      </section>

      <section className="container account-panel-grid">
        <article className="card-panel account-card">
          <span className="eyebrow">Orders</span>
          <h2>Order tracking</h2>
          <p>Keep warehouse orders, payment status, and fulfillment updates in one customer space.</p>
          <Link className="button primary" to="/checkout">Go to checkout</Link>
        </article>

        <article className="card-panel account-card">
          <span className="eyebrow">Projects</span>
          <h2>Saved sourcing lists</h2>
          <p>Use the storefront cart today. Saved lists and repeat orders can be connected to user accounts later.</p>
          <Link className="button secondary" to="/categories">Browse categories</Link>
        </article>
      </section>
    </main>
  );
}
