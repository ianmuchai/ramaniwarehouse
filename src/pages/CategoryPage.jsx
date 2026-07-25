import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';
import ProductList from '../components/ProductList';

const defaultFilters = { query: '', buyingMode: 'all', sort: 'featured' };

function slugify(value) {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function searchable(product) {
  return [product.name, product.sku, product.description, product.category, ...(product.specs || []), ...(product.tags || []), ...(product.useCases || [])].join(' ').toLowerCase();
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [site, setSite] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    axios.get('/api/site')
      .then((res) => { setSite(res.data || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const category = useMemo(() => (site.categories || []).find((entry) => slugify(entry.name) === slug), [site.categories, slug]);
  const products = useMemo(() => (site.products || []).filter((product) => slugify(product.category) === slug), [site.products, slug]);
  const filteredProducts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return products.filter((product) => {
      const queryMatch = !query || searchable(product).includes(query);
      const modeMatch = filters.buyingMode === 'all' || product.buyingMode === filters.buyingMode;
      return queryMatch && modeMatch;
    }).sort((a, b) => {
      if (filters.sort === 'price-low') return Number(a.price || 0) - Number(b.price || 0);
      if (filters.sort === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
      if (filters.sort === 'name') return String(a.name).localeCompare(String(b.name));
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [products, filters]);
  const hasActiveFilters = filters.query || filters.buyingMode !== 'all' || filters.sort !== 'featured';

  function clearFilters() {
    setFilters({ ...defaultFilters });
  }

  if (loading) return <main className="container"><div className="loading-card">Loading category...</div></main>;

  return (
    <main>
      <section className="page-hero category-detail-hero" style={{ '--accent': category?.color || '#f97316' }}>
        <div className="page-hero-bg">{category?.image ? <img src={assetUrl(category.image)} alt="" loading="eager" decoding="async" /> : null}</div>
        <div className="container page-hero-content">
          <span className="eyebrow">Category</span>
          <h1>{category?.name || 'Category'}</h1>
          <p>{category?.tagline || 'Browse curated Ramani Warehouse products.'}</p>
          <div className="hero-actions"><Link className="button glass" to="/categories">View all categories</Link><Link className="button primary" to="/contact">Request quote</Link></div>
        </div>
      </section>

      <section className="section products-section category-products-only">
        <div className="catalog-controls slim mobile-filter-scroll" aria-label="Category product filters">
          <label><span className="visually-hidden">Search category products</span><input type="search" autoComplete="off" value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder={`Search ${category?.name || 'category'} products`} /></label>
          <label><span className="visually-hidden">Filter by buying mode</span><select value={filters.buyingMode} onChange={(event) => setFilters({ ...filters, buyingMode: event.target.value })}><option value="all">All buying modes</option><option value="checkout">Checkout-ready</option><option value="quote">Quote-led</option><option value="consult">Consult first</option></select></label>
          <label><span className="visually-hidden">Sort products</span><select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}><option value="featured">Featured</option><option value="price-low">Price low to high</option><option value="price-high">Price high to low</option><option value="name">Name</option></select></label>
        </div>
        <div className="catalog-result-bar">
          <p role="status" aria-live="polite">Showing {filteredProducts.length} of {products.length} {category?.name || 'category'} products</p>
          {hasActiveFilters ? <button className="button secondary compact" type="button" onClick={clearFilters}>Clear filters</button> : null}
        </div>
        {filteredProducts.length ? <ProductList products={filteredProducts} /> : <div className="empty-cart"><p>No products match this category filter.</p><Link className="button primary" to="/contact">Request sourcing help</Link></div>}
      </section>
    </main>
  );
}