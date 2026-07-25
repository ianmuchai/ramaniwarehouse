import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuoteForm from '../components/QuoteForm';
import { whatsappUrl } from '../utils/whatsapp';

export default function Contact() {
  const [partners, setPartners] = useState([]);
  useEffect(() => { axios.get('/api/partners/public').then((res) => setPartners(res.data || [])).catch(() => {}); }, []);
  return (
    <main>
      <section className="page-hero compact"><div className="container"><span className="eyebrow">Quote and Support</span><h1>Tell Ramani what you are sourcing.</h1><p>Use the form for a structured quote request or continue directly on WhatsApp for fast follow-up.</p></div></section>
      <section className="container contact-grid"><div className="card-panel"><h2>Request a quote</h2><QuoteForm source="contact" /></div><aside className="card-panel support-panel"><span className="eyebrow">Support points</span><h2>Ramani contact coverage</h2>{partners.map((partner) => <article key={partner.id} className="support-card"><strong>{partner.name}</strong><span>{partner.location}</span><p>{partner.notes}</p><div className="quote-actions"><a className="button primary compact" href={whatsappUrl({ phone: partner.whatsapp, text: 'Hello Ramani Warehouse, I need help with a quote.' })} target="_blank" rel="noreferrer">WhatsApp</a><a className="button secondary compact" href={`tel:${partner.phone}`}>Call</a></div></article>)}</aside></section>
    </main>
  );
}