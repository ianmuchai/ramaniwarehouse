import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';

function slugify(value) {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CategoryCarousel({ categories: providedCategories }) {
  const [remoteCategories, setRemoteCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (providedCategories?.length) return undefined;
    axios.get('/api/categories').then((res) => setRemoteCategories(res.data || [])).catch(() => setRemoteCategories([]));
  }, [providedCategories]);

  const categories = useMemo(() => providedCategories?.length ? providedCategories : remoteCategories, [providedCategories, remoteCategories]);

  useEffect(() => {
    if (categories.length < 2) return undefined;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % categories.length), 5200);
    return () => window.clearInterval(timer);
  }, [categories.length]);

  if (!categories.length) return <div className="skeleton-card" />;

  const active = categories[activeIndex];

  return (
    <div className="category-carousel">
      <Link className="category-slide" to={`/categories/${slugify(active.name)}`} style={{ '--slide-color': active.color || '#f97316' }}>
        <img src={assetUrl(active.image)} alt={active.name} />
        <div className="category-slide-overlay">
          <span>Featured collection</span>
          <h3>{active.name}</h3>
          <p>{active.tagline}</p>
        </div>
      </Link>
      <div className="carousel-dots" aria-label="Category carousel controls">
        {categories.map((category, index) => (
          <button
            key={category.id || category.name}
            className={index === activeIndex ? 'dot active' : 'dot'}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${category.name}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}



