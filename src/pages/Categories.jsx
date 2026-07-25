import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';
import ProductList from '../components/ProductList';

const defaultFilters = { query: '', stock: 'all', buyingMode: 'all', sort: 'featured' };

function slugify(value) {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function searchable(product) {
  return [product.name, product.sku, product.description, product.category, ...(product.specs || []), ...(product.tags || []), ...(product.useCases || [])].join(' ').toLowerCase();
}

function filterProducts(products, filters) {
  const query = filters.query.trim().toLowerCase();
  return products.filter((product) => {
    const queryMatch = !query || searchable(product).includes(query);
    const stockMatch = filters.stock === 'all' || String(product.stock || '').toLowerCase().includes(filters.stock);
    const modeMatch = filters.buyingMode === 'all' || product.buyingMode === filters.buyingMode;
    return queryMatch && stockMatch && modeMatch;
  }).sort((a, b) => {
    if (filters.sort === 'price-low') return Number(a.price || 0) - Number(b.price || 0);
    if (filters.sort === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
    if (filters.sort === 'name') return String(a.name).localeCompare(String(b.name));
    if (filters.sort === 'fastest') return String(a.leadTime || '').localeCompare(String(b.leadTime || ''));
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });
}

export default function Categories() {
  const [site, setSite] = useState({ categories: [], products: [] });
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    axios.get('/api/site').then((res) => setSite(res.data || {})).catch(() => {});
  }, []);

  const categories = site.categories || [];
  const products = site.products || [];
  const filteredProducts = useMemo(() => filterProducts(products, filters), [products, filters]);
  const hasActiveFilters = filters.query || filters.stock !== 'all' || filters.buyingMode !== 'all' || filters.sort !== 'featured';
  const categoryCounts = useMemo(() => products.reduce((map, product) => {
    map[product.category] = (map[product.category] || 0) + 1;
    return map;
  }, {}), [products]);

  function clearFilters() {
    setFilters({ ...defaultFilters });
  }

  return (
    <main>
      <section className="page-hero compact">
        <div className="container">
          <span className="eyebrow">Collections</span>
          <h1>Browse Ramani by department.</h1>
          <p>Choose the category that matches your project and jump straight into a curated product shelf.</p>
        </div>
      </section>

      <section className="section">
        <div className="department-grid large">
          {categories.map((category) => (
            <Link key={category.id} to={`/categories/${slugify(category.name)}`} className="department-card" style={{ '--accent': category.color }}>
              <img src={assetUrl(category.image)} alt={category.name} loading="lazy" decoding="async" />
              <div>
                <span>{category.name}</span>
                <p>{category.tagline}</p>
                <small>{categoryCounts[category.name] || 0} products</small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section products-section">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">All products</span>
            <h2>Full warehouse shelf.</h2>
          </div>
          <Link className="button secondary" to="/estimator">Start estimator</Link>
        </div>
        <div className="catalog-controls" aria-label="Product filters">
          <label><span className="visually-hidden">Search all products</span><input type="search" autoComplete="off" value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="Search products, specs, or project use" /></label>
          <label><span className="visually-hidden">Filter by stock</span><select value={filters.stock} onChange={(event) => setFilters({ ...filters, stock: event.target.value })}><option value="all">All stock</option><option value="in stock">In stock</option><option value="available">Available</option><option value="bulk">Bulk</option><option value="custom">Custom</option></select></label>
          <label><span className="visually-hidden">Filter by buying mode</span><select value={filters.buyingMode} onChange={(event) => setFilters({ ...filters, buyingMode: event.target.value })}><option value="all">All buying modes</option><option value="checkout">Checkout-ready</option><option value="quote">Quote-led</option><option value="consult">Consult first</option></select></label>
          <label><span className="visually-hidden">Sort products</span><select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}><option value="featured">Featured</option><option value="price-low">Price low to high</option><option value="price-high">Price high to low</option><option value="name">Name</option><option value="fastest">Fastest lead time</option></select></label>
        </div>
        <div className="catalog-result-bar">
          <p role="status" aria-live="polite">Showing {filteredProducts.length} of {products.length} products</p>
          {hasActiveFilters ? <button className="button secondary compact" type="button" onClick={clearFilters}>Clear filters</button> : null}
        </div>
        {filteredProducts.length ? <ProductList products={filteredProducts} /> : <div className="empty-cart"><p>No products match those filters.</p><Link className="button primary" to="/contact">Request sourcing help</Link><Link className="button secondary" to="/estimator">Try estimator</Link></div>}
      </section>
    </main>
  );
}