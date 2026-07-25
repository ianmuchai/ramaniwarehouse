import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductList from '../components/ProductList';
import { whatsappUrl } from '../utils/whatsapp';

function slugify(value) {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const fallbackProfile = {
  metrics: [
    { value: '7+', label: 'Core categories' },
    { value: '24h', label: 'Quote response' },
    { value: 'KES', label: 'Local checkout' }
  ]
};

export default function Home() {
  const [site, setSite] = useState({ profile: fallbackProfile, heroSlides: [], categories: [], products: [] });
  const [resources, setResources] = useState([]);
  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    axios.get('/api/site').then((res) => {
      setSite(res.data || {});
      setResources((res.data?.resources || []).slice(0, 3));
    }).catch(() => {});
  }, []);

  const heroSlides = site.heroSlides || [];
  const activeSlide = heroSlides[activeHero] || heroSlides[0];
  const categories = site.categories || [];
  const products = site.products || [];

  useEffect(() => {
    if (heroSlides.length < 2) return undefined;
    const timer = window.setInterval(() => setActiveHero((current) => (current + 1) % heroSlides.length), 5600);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  const topCategories = useMemo(() => categories.slice(0, 7), [categories]);

  return (
    <main>
      <section className="hero-market">
        <div className="hero-bg" aria-hidden="true">
          {activeSlide?.image ? <img src={assetUrl(activeSlide.image)} alt="" /> : null}
        </div>
        <div className="hero-content mobile-hero-stack">
          <div className="hero-copy">
            <span className="eyebrow">{activeSlide?.eyebrow || 'Ramani Warehouse'}</span>
            <h1>{activeSlide?.title || 'Shop project materials with warehouse-level confidence.'}</h1>
            <p>{activeSlide?.text || 'Source materials, supplies, and fit-out essentials for modern commercial projects.'}</p>
            <div className="hero-actions">
              <Link className="button primary" to={activeSlide?.href || '/categories'}>{activeSlide?.cta || 'Shop categories'}</Link>
              <Link className="button glass" to="/checkout">View cart</Link>
            </div>
            <div className="metric-row">
              {(site.profile?.metrics || fallbackProfile.metrics).map((metric) => (
                <span key={metric.label}><strong>{metric.value}</strong>{metric.label}</span>
              ))}
            </div>
          </div>
          <div className="hero-shop-panel">
            <div className="panel-topline"><span>Live collections</span><strong>{categories.length || 7}</strong></div>
            <CategoryCarousel categories={categories} />
          </div>
        </div>
        <div className="hero-switcher">
          {heroSlides.map((slide, index) => (
            <button key={slide.id} className={index === activeHero ? 'active' : ''} onClick={() => setActiveHero(index)} type="button">
              <span>{String(index + 1).padStart(2, '0')}</span>{slide.eyebrow}
            </button>
          ))}
        </div>
      </section>


      <section className="section trust-strip-section">
        <div className="trust-strip">
          <span>Local sourcing support</span>
          <span>Fast quote response</span>
          <span>Editable product catalog</span>
          <span>Checkout-ready orders</span>
        </div>
      </section>

      <section className="section project-start-section">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Start with your project</span>
            <h2>Move from browsing to a quote-ready sourcing path.</h2>
          </div>
          <Link className="button primary" to="/estimator">Open estimator</Link>
        </div>
        <div className="project-start-grid">
          <Link to="/estimator"><strong>Estimate mixed materials</strong><p>Eco Boards, glass, PPR, cleaning supplies, furniture, and custom sourcing can start from one guided brief.</p></Link>
          <Link to="/contact"><strong>Request a formal quote</strong><p>Send project details, location, timeline, budget, and preferred follow-up method directly to Ramani.</p></Link>
          <a href={whatsappUrl({ text: 'Hello Ramani Warehouse, I need help sourcing project materials.' })} target="_blank" rel="noreferrer"><strong>Continue on WhatsApp</strong><p>Use the fastest path when you need human help choosing products or confirming availability.</p></a>
        </div>
      </section>

      <section className="section category-strip-section categories-only-section">
        <div className="compact-section-title"><h2>Categories</h2></div>
        <div className="department-grid">
          {topCategories.map((category) => (
            <Link key={category.id} to={`/categories/${slugify(category.name)}`} className="department-card" style={{ '--accent': category.color }}>
              <img src={assetUrl(category.image)} alt={category.name} />
              <div>
                <span>{category.name}</span>
                <p>{category.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section products-section">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Featured products</span>
            <h2>High-demand items for real projects.</h2>
          </div>
          <Link className="button secondary" to="/categories">View all</Link>
        </div>
        <ProductList products={products} limit={6} />
      </section>

      <section className="section resource-preview-section">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Resource hub</span>
            <h2>Guides for smarter Ramani sourcing.</h2>
          </div>
          <Link className="button secondary" to="/resources">View resources</Link>
        </div>
        <div className="resource-mini-grid">
          {resources.map((resource) => <Link key={resource.id} to={`/resources/${resource.slug}`}><strong>{resource.title}</strong><p>{resource.summary}</p><span>Read guide</span></Link>)}
        </div>
      </section>

      <section className="section contact-band-section">
        <div className="contact-band">
          <div><span className="eyebrow">Ramani support</span><h2>Need help confirming what to buy?</h2><p>Call, WhatsApp, or send a quote request with your product list and delivery area.</p></div>
          <div className="contact-band-actions"><a className="button primary" href={whatsappUrl({ text: 'Hello Ramani Warehouse, I need help with a quote.' })} target="_blank" rel="noreferrer">WhatsApp</a><Link className="button secondary" to="/contact">Quote form</Link><a className="button glass" href="tel:+254793371994">Call +254 793 371994</a></div>
        </div>
      </section>

      <section className="section experience-band">
        <div>
          <span className="eyebrow">Why Ramani</span>
          <h2>Designed for buyers who need less confusion and more certainty.</h2>
        </div>
        <div className="experience-grid">
          <article><strong>Shop with confidence</strong><p>See product details, prices, availability, and delivery expectations before you place an order.</p></article>
          <article><strong>Materials for real projects</strong><p>Find practical supplies for construction, interiors, maintenance, retail spaces, workshops, and daily operations.</p></article>
          <article><strong>Easy ordering</strong><p>Add what you need to cart, confirm your details, and let the Ramani team help you complete fulfillment.</p></article>
        </div>
      </section>
    </main>
  );
}
