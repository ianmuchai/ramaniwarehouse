import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { assetUrl } from '../utils/assets';

export default function Resources() {
  const [resources, setResources] = useState([]);
  useEffect(() => { axios.get('/api/resources').then((res) => setResources(res.data || [])).catch(() => {}); }, []);
  return (
    <main>
      <section className="page-hero compact"><div className="container"><span className="eyebrow">Resources</span><h1>Ramani buying guides.</h1><p>Practical sourcing guidance for Eco Boards, glass, PPR, interiors, cleaning products, furniture, and warehouse projects.</p></div></section>
      <section className="container resource-grid">
        {resources.map((resource) => <Link key={resource.id} className="resource-card" to={`/resources/${resource.slug}`}><img src={assetUrl(resource.coverImage)} alt="" /><span className="eyebrow">{resource.tags?.slice(0, 2).join(' / ')}</span><h2>{resource.title}</h2><p>{resource.summary}</p><strong>Read guide</strong></Link>)}
      </section>
    </main>
  );
}