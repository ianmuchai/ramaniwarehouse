import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import QuoteForm from '../components/QuoteForm';
import { assetUrl } from '../utils/assets';

export default function ResourceDetail() {
  const { slug } = useParams();
  const [resource, setResource] = useState(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => { axios.get(`/api/resources/${slug}`).then((res) => setResource(res.data)).catch(() => setMissing(true)); }, [slug]);
  if (missing) return <main className="container"><div className="loading-card">Resource not found.</div></main>;
  if (!resource) return <main className="container"><div className="loading-card">Loading resource...</div></main>;
  return (
    <main className="resource-detail-page">
      <section className="resource-detail-hero"><img src={assetUrl(resource.coverImage)} alt="" /><div><Link to="/resources" className="back-link">Back to resources</Link><span className="eyebrow">Ramani guide</span><h1>{resource.title}</h1><p>{resource.summary}</p></div></section>
      <section className="container resource-detail-grid"><article className="resource-body card-panel"><p>{resource.body}</p><div className="spec-row detail">{(resource.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div></article><aside className="card-panel"><h2>Turn this guide into a quote</h2><QuoteForm source="resource" categories={[resource.categoryId]} defaultNotes={`I read ${resource.title} and would like help sourcing the right products.`} /></aside></section>
    </main>
  );
}