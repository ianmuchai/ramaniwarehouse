import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <a href="/" className="brand-mark footer-brand">
            <span className="brand-symbol">RW</span>
            <span>
              <strong>Ramani Warehouse</strong>
              <small>Built for serious sourcing</small>
            </span>
          </a>
          <p>Commercial materials, recycled supply, plumbing essentials, cleaning products, and fit-out support for Kenyan projects.</p>
        </div>
        <div>
          <h4>Visit</h4>
          <p>Old Castle breweries next to Vincentian Retreat Center, Nairobi</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>+254 793 371994</p>
          <p>info@ramaniwarehouse.com</p>
        </div>
      </div>
    </footer>
  );
}
