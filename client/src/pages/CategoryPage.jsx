import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';
import ProductList from '../components/ProductList';

function slugify(value) {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [site, setSite] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/site')
      .then((res) => {
        setSite(res.data || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const category = useMemo(() => (site.categories || []).find((entry) => slugify(entry.name) === slug), [site.categories, slug]);
  const products = useMemo(() => (site.products || []).filter((product) => slugify(product.category) === slug), [site.products, slug]);

  if (loading) return <main className="container"><div className="loading-card">Loading category...</div></main>;

  return (
    <main>
      <section className="page-hero category-detail-hero" style={{ '--accent': category?.color || '#f97316' }}>
        <div className="page-hero-bg">{category?.image ? <img src={assetUrl(category.image)} alt="" /> : null}</div>
        <div className="container page-hero-content">
          <span className="eyebrow">Category</span>
          <h1>{category?.name || 'Category'}</h1>
          <p>{category?.tagline || 'Browse curated Ramani Warehouse products.'}</p>
          <Link className="button glass" to="/categories">View all categories</Link>
        </div>
      </section>

      <section className="section products-section category-products-only">
        <ProductList products={products} />
      </section>
    </main>
  );
}



