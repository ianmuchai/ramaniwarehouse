import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { whatsappUrl } from '../utils/whatsapp';

function actionClass({ isActive }) {
  return isActive ? 'mobile-action-link active' : 'mobile-action-link';
}

function Icon({ type }) {
  if (type === 'shop') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 9.5 6.2 4h11.6L19 9.5v8.2A2.3 2.3 0 0 1 16.7 20H7.3A2.3 2.3 0 0 1 5 17.7V9.5Zm2.7-3.6-.6 3h9.8l-.6-3H7.7Zm-.8 5v6.8c0 .22.18.4.4.4h9.4c.22 0 .4-.18.4-.4v-6.8H6.9Zm2.2 1.2h1.8a1.1 1.1 0 0 0 2.2 0h1.8a2.9 2.9 0 0 1-5.8 0Z" />
      </svg>
    );
  }

  if (type === 'estimate') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.2 3.6h9.6A2.2 2.2 0 0 1 19 5.8v12.4a2.2 2.2 0 0 1-2.2 2.2H7.2A2.2 2.2 0 0 1 5 18.2V5.8a2.2 2.2 0 0 1 2.2-2.2Zm0 1.9a.3.3 0 0 0-.3.3v12.4c0 .17.13.3.3.3h9.6a.3.3 0 0 0 .3-.3V5.8a.3.3 0 0 0-.3-.3H7.2Zm1.5 3h6.6v1.8H8.7V8.5Zm0 3.7h6.6V14H8.7v-1.8Zm0 3.7h3.6v1.8H8.7v-1.8Z" />
      </svg>
    );
  }

  if (type === 'quote-list') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.7 17.2a2 2 0 1 1-.02 4.02 2 2 0 0 1 .02-4.02Zm9.8 0a2 2 0 1 1 0 4.02 2 2 0 0 1 0-4.02ZM4.1 3l.62 2.7H21l-2.1 8.1a2.3 2.3 0 0 1-2.22 1.72H7.7a2.3 2.3 0 0 1-2.24-1.78L3.1 4.9H1V3h3.1Zm1.06 4.6 1.96 5.67c.07.22.28.36.52.36h9.04c.24 0 .45-.16.52-.39l1.45-5.64H5.16Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.04 4.2a7.74 7.74 0 0 0-6.7 11.63L4.3 19.7l3.98-1.03a7.74 7.74 0 1 0 3.76-14.47Zm0 1.72a6.02 6.02 0 0 1 5.1 9.22 6 6 0 0 1-7.36 2.2l-.24-.12-2.36.61.63-2.3-.15-.25a6.02 6.02 0 0 1 4.38-9.36Zm-2.5 3.1c-.13 0-.34.05-.52.24-.18.2-.69.67-.69 1.63s.71 1.9.81 2.03c.1.13 1.38 2.2 3.43 2.99 1.7.67 2.05.54 2.42.5.37-.03 1.2-.49 1.37-.96.17-.47.17-.87.12-.96-.05-.08-.18-.13-.38-.23-.2-.1-1.2-.59-1.38-.66-.18-.07-.31-.1-.44.1-.13.2-.51.66-.63.8-.12.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.6-.53-1-1.18-1.12-1.38-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.34h-.37Z" />
    </svg>
  );
}

export default function MobileActionBar() {
  const { itemsCount } = useCart();
  const quoteCount = itemsCount > 99 ? '99+' : String(itemsCount);

  return (
    <nav className="mobile-action-bar" aria-label="Mobile quick actions">
      <NavLink to="/categories" className={actionClass} aria-label="Shop Ramani categories">
        <span className="mobile-action-icon" aria-hidden="true"><Icon type="shop" /></span>
        <span className="mobile-action-text">Shop</span>
      </NavLink>
      <NavLink to="/estimator" className={actionClass} aria-label="Open Ramani product estimator">
        <span className="mobile-action-icon" aria-hidden="true"><Icon type="estimate" /></span>
        <span className="mobile-action-text">Estimate</span>
      </NavLink>
      <a className="mobile-action-link mobile-whatsapp-action" href={whatsappUrl({ text: 'Hello Ramani Warehouse, I would like to chat with marketing staff and make an order.' })} target="_blank" rel="noreferrer" aria-label="WhatsApp marketing staff to make an order">
        <span className="mobile-action-icon whatsapp-mark" aria-hidden="true"><Icon type="whatsapp" /></span>
        <span className="mobile-action-text visually-hidden">WhatsApp</span>
      </a>
      <NavLink to="/checkout" className={actionClass} aria-label={`Quote list with ${itemsCount} items`}>
        <span className="mobile-action-icon mobile-cart-icon" aria-hidden="true">
          <Icon type="quote-list" />
          <span className="mobile-cart-count">{quoteCount}</span>
        </span>
        <span className="mobile-action-text">Quote</span>
      </NavLink>
    </nav>
  );
}