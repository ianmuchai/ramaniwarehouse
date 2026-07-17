import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

          <nav className="nav" aria-label="Primary navigation">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/categories" className="nav-link">Categories</NavLink>
          </nav>

          <div className="header-actions">
            <button className="login-icon-button" type="button" onClick={openLogin} aria-label="Login or admin access">
              <span aria-hidden="true">A</span>
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
                <input type="password" value={adminCode} onChange={(event) => setAdminCode(event.target.value)} placeholder="Private admin code" />
              </label>
              <button className="button primary" type="submit">Enter admin</button>
            </form>
            {loginMessage ? <p className="status-text">{loginMessage}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

