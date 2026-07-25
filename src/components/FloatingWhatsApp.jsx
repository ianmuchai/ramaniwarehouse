import React from 'react';
import { whatsappUrl } from '../utils/whatsapp';

export default function FloatingWhatsApp() {
  const text = 'Hello Ramani Warehouse, I would like to chat with marketing and make an order.';

  return (
    <a className="floating-whatsapp" href={whatsappUrl({ text })} target="_blank" rel="noreferrer" aria-label="Chat with Ramani marketing on WhatsApp">
      <span className="floating-whatsapp-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img" focusable="false">
          <path d="M16 4.4c-6.2 0-11.2 4.8-11.2 10.8 0 2.1.6 4.1 1.8 5.9L5 27.6l6.9-1.6c1.3.5 2.7.8 4.1.8 6.2 0 11.2-4.8 11.2-10.8S22.2 4.4 16 4.4Zm0 20.1c-1.3 0-2.6-.3-3.8-.8l-.4-.2-4.1 1 1-3.9-.3-.4c-1-1.5-1.5-3.2-1.5-5 0-4.8 4.1-8.7 9.1-8.7s9.1 3.9 9.1 8.7-4.1 9.3-9.1 9.3Z" />
          <path d="M21.1 18.4c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.7l.5-.5c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6 0 1.5 1.1 3 1.2 3.2.2.2 2.2 3.5 5.4 4.8.8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z" />
        </svg>
      </span>
      <span className="floating-whatsapp-text"><strong>WhatsApp</strong><small>Chat or order</small></span>
    </a>
  );
}