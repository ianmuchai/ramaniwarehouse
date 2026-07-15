import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';
import ProductList from '../components/ProductList';

function slugify(value) {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function Categories() {
  const [site, setSite] = useState({ categories: [], products: [] });

  useEffect(() => {
    axios.get('/api/site').then((res) => setSite(res.data || {})).catch(() => {});
  }, []);

  const categories = site.categories || [];
  const products = site.products || [];
  const categoryCounts = useMemo(() => products.reduce((map, product) => {
    map[product.category] = (map[product.category] || 0) + 1;
    return map;
  }, {}), [products]);

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
              <img src={assetUrl(category.image)} alt={category.name} />
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
        </div>
        <ProductList products={products} />
      </section>
    </main>
  );
}

