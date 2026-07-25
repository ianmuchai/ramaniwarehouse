import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PwaInstallButton from './PwaInstallButton';

export default function Header() {
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function openLogin() {
    setLoginOpen(true);
    setLoginMessage('');
  }

  function closeLogin() {
    setLoginOpen(false);
    setAdminCode('');
    setLoginMessage('');
  }

  function continueCustomer() {
    closeLogin();
    navigate('/account');
  }

  function enterAdmin(event) {
    event.preventDefault();
    const code = adminCode.trim();
    if (!code) {
      setLoginMessage('Enter the admin access code.');
      return;
    }
    sessionStorage.setItem('ramani_admin_key', code);
    closeLogin();
    navigate('/admin');
  }

  return (
    <>
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
        <div className="header-inner">
          <Link to="/" className="brand-mark" aria-label="Ramani Warehouse home">
            <span className="brand-logo-frame">
              <img src="/images/ramani-logo.svg" alt="" />
            </span>
            <span>
              <strong>Ramani Warehouse</strong>
              <small>Materials marketplace</small>
            </span>
          </Link>

          <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>

          <nav id="primary-navigation" className={menuOpen ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/categories" className="nav-link">Categories</NavLink>
            <NavLink to="/estimator" className="nav-link">Estimator</NavLink>
            <NavLink to="/resources" className="nav-link">Resources</NavLink>
            <NavLink to="/contact" className="nav-link">Quote</NavLink>
          </nav>

          <div className="header-actions">
            <PwaInstallButton />
            <button className="login-icon-button" type="button" onClick={openLogin} aria-label="Login or admin access">
              <svg className="admin-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3.4 18.4 6v5.1c0 4.1-2.54 7.72-6.4 9.1-3.86-1.38-6.4-5-6.4-9.1V6L12 3.4Z" />
                <path d="M9.7 10.2a2.3 2.3 0 1 0 4.6 0 2.3 2.3 0 0 0-4.6 0Z" />
                <path d="M8.55 16.15c.68-1.34 1.86-2.05 3.45-2.05s2.77.71 3.45 2.05" />
              </svg>
            </button>
            <Link to="/checkout" className="cart-button" aria-label={`Cart with ${itemsCount} items`}>
              <span>Cart</span>
              <strong>{itemsCount}</strong>
            </Link>
          </div>
        </div>
      </header>

      {loginOpen ? (
        <div className="login-popover-backdrop" role="presentation" onClick={closeLogin}>
          <div className="login-popover" role="dialog" aria-modal="true" aria-label="Login options" onClick={(event) => event.stopPropagation()}>
            <button className="login-close" type="button" onClick={closeLogin} aria-label="Close login">x</button>
            <span className="eyebrow">Login</span>
            <h2>Access Ramani</h2>
            <p>Customers can continue to their account area. Admin users can enter the private code to manage the store.</p>
            <button className="button secondary" type="button" onClick={continueCustomer}>Customer account</button>
            <form className="admin-mini-form" onSubmit={enterAdmin}>
              <label>
                Admin code
                <input type="password" value={adminCode} onChange={(event) => setAdminCode(event.target.value)} placeholder="Private admin code" autoComplete="current-password" />
              </label>
              <button className="button primary" type="submit">Enter admin</button>
            </form>
            {loginMessage ? <p className="status-text" role="status">{loginMessage}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}