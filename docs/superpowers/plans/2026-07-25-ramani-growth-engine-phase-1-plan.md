# Ramani Growth Engine Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working Ramani digital growth engine slice: category-aware product discovery, comparison, estimator, quote capture, resource hub, and admin lead follow-up.

**Architecture:** Extend the existing Vite/React storefront and Express API rather than replacing them. Keep JSON-file persistence for this phase, with small helper functions in `server/index.js` and focused React pages/components under `src/`.

**Tech Stack:** React 18, React Router 6, Vite 5, Express 4, JSON files under `server/data`, existing CSS in `src/index.css`.

## Global Constraints

- Every feature must be optimized around Ramani's actual catalog mix: Eco Boards, HDPE plastics, glass recycling/crafting inputs, PPR pipes and fittings, interior design/fit-out products, detergent and grease solutions, furniture, and future warehouse categories.
- The estimator must not claim engineering accuracy or imply one universal calculator fits every Ramani category.
- Product buying modes must support `checkout`, `quote`, and `consult`.
- Existing cart, checkout, product editing, category editing, hero editing, and image upload workflows must remain functional.
- Public UI must not expose empty promises for future AI, live chat, CRM, database, or partner-login features.
- No new runtime dependency unless the existing code cannot reasonably implement the feature.

---

## File Structure

- Modify `server/index.js`: add JSON stores for leads, resources, partners, analytics; add public and admin endpoints; add product metadata defaults and estimator recommendation helpers.
- Modify `server/data/products.json`: enrich existing products with `useCases`, `tags`, `buyingMode`, `estimatorType`, `measurementUnit`, `projectTypes`, and `supportNotes`.
- Create `server/data/resources.json`: starter published resources covering Ramani's main categories.
- Create `server/data/leads.json`: initial empty lead list.
- Create `server/data/partners.json`: starter public support/fulfillment records.
- Create `server/data/analytics-events.json`: initial empty analytics event list.
- Modify `src/App.jsx`: add routes for `/estimator`, `/resources`, `/resources/:slug`, and `/contact`.
- Modify `src/components/Header.jsx`: expose Estimator, Resources, and Quote/Contact navigation.
- Modify `src/pages/Home.jsx`: add project-start, resources preview, and quote/WhatsApp conversion sections.
- Modify `src/pages/Categories.jsx` and `src/pages/CategoryPage.jsx`: add search/filter/sort and comparison entry points.
- Modify `src/components/ProductList.jsx`: add compare and quote actions on cards.
- Modify `src/components/ProductPage.jsx`: add product-specific quote, WhatsApp, buying-mode, use-case, and comparison controls.
- Create `src/context/CompareContext.jsx`: client-side comparison state for up to four products.
- Create `src/pages/Estimator.jsx`: category-aware estimator and quote handoff.
- Create `src/pages/Resources.jsx`: resource listing page.
- Create `src/pages/ResourceDetail.jsx`: single resource page with related product and quote CTAs.
- Create `src/pages/Contact.jsx`: general quote/contact form and public support records.
- Create `src/components/QuoteForm.jsx`: reusable quote form for product, estimator, contact, resource, and cart contexts.
- Create `src/components/CompareTray.jsx`: persistent compare drawer/tray.
- Create `src/utils/whatsapp.js`: WhatsApp URL builder.
- Modify `src/pages/Admin.jsx`: add dashboard cards, lead inbox, lead status update, admin notes, and resource/partner visibility summaries.
- Modify `src/index.css`: responsive styles for new public and admin surfaces.

---

### Task 1: Backend Data Stores and Public Lead APIs

**Files:**
- Modify: `server/index.js`
- Create: `server/data/leads.json`
- Create: `server/data/resources.json`
- Create: `server/data/partners.json`
- Create: `server/data/analytics-events.json`

**Interfaces:**
- Produces `POST /api/leads` accepting `{ source, customer, interest, preferredContact, estimator }`.
- Produces `POST /api/estimator` accepting `{ customer, input, recommendation, preferredContact }`.
- Produces `POST /api/analytics/events` accepting `{ type, source, productId, categoryId, metadata }`.
- Produces `GET /api/resources`, `GET /api/resources/:slug`, and `GET /api/partners/public`.
- Produces `GET /api/admin/leads`, `PUT /api/admin/leads/:id`, `POST /api/admin/leads/:id/notes`, and `GET /api/admin/dashboard`.

- [ ] **Step 1: Create initial JSON data files**

Add:

```json
[]
```

to `server/data/leads.json` and `server/data/analytics-events.json`.

Add starter `server/data/partners.json`:

```json
[
  {
    "id": "ramani-nairobi-support",
    "name": "Ramani Warehouse Nairobi Support",
    "type": "support",
    "location": "Old Castle breweries next to Vincentian Retreat Center, Nairobi",
    "coverageAreas": ["Nairobi", "Kiambu", "Machakos", "Kajiado"],
    "phone": "+254 793 371994",
    "whatsapp": "+254793371994",
    "email": "info@ramaniwarehouse.com",
    "categories": ["Eco Board", "HDPE Plastics", "Glass Recycling", "PPR Pipes & Fittings", "Interior Design", "Detergent & Grease", "Furniture"],
    "public": true,
    "notes": "Primary sales, quote, and fulfillment coordination contact."
  }
]
```

Add starter `server/data/resources.json` with one published record per major category. Use slugs:

```json
[
  {
    "id": "eco-board-buying-guide",
    "slug": "eco-board-buying-guide",
    "title": "Eco Board Buying Guide",
    "summary": "How to plan partitions, display surfaces, and interior panels with Eco Board.",
    "body": "Eco Board is best handled as a project material rather than a one-off item. Start with the wall, partition, ceiling, or display area, then confirm finish expectations, installation timeline, and delivery area with the Ramani team before final quoting.",
    "categoryId": "eco-boards",
    "tags": ["eco board", "interiors", "partitions"],
    "coverImage": "/images/ramani-logo.svg",
    "relatedProducts": [],
    "status": "published",
    "createdAt": "2026-07-25T00:00:00.000Z",
    "updatedAt": "2026-07-25T00:00:00.000Z"
  }
]
```

Repeat the same shape for `glass-craft-and-recycling-guide`, `ppr-plumbing-planning-guide`, `interior-fitout-sourcing-guide`, `cleaning-operations-supply-guide`, and `furniture-sourcing-guide`.

- [ ] **Step 2: Add reusable JSON helpers in `server/index.js`**

Place after `saveHeroSlides()`:

```js
function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error(`Could not read ${path.basename(filePath)}:`, error.message);
    return fallback;
  }
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}
```

- [ ] **Step 3: Add paths and in-memory stores**

Near other data paths:

```js
const leadsPath = path.join(dataDir, 'leads.json');
const resourcesPath = path.join(dataDir, 'resources.json');
const partnersPath = path.join(dataDir, 'partners.json');
const analyticsPath = path.join(dataDir, 'analytics-events.json');
```

After `let heroSlides = loadHeroSlides();`:

```js
let leads = readJsonFile(leadsPath, []);
let resources = readJsonFile(resourcesPath, []);
let partners = readJsonFile(partnersPath, []);
let analyticsEvents = readJsonFile(analyticsPath, []);
```

- [ ] **Step 4: Add normalization helpers**

Place before `sitePayload()`:

```js
const leadStatuses = new Set(['new', 'contacted', 'quoted', 'won', 'lost', 'archived']);

function normalizeCustomer(value = {}) {
  return {
    name: String(value.name || '').trim(),
    phone: String(value.phone || '').trim(),
    email: String(value.email || '').trim(),
    company: String(value.company || '').trim(),
    location: String(value.location || '').trim()
  };
}

function normalizeLead(payload = {}, sourceOverride) {
  const customer = normalizeCustomer(payload.customer || {});
  if (!customer.name) return { error: 'Name is required.' };
  if (!customer.phone) return { error: 'Phone is required.' };

  const now = new Date().toISOString();
  return {
    id: `LEAD-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    source: String(sourceOverride || payload.source || 'contact').trim(),
    status: 'new',
    customer,
    interest: {
      products: Array.isArray(payload.interest?.products) ? payload.interest.products : [],
      categories: Array.isArray(payload.interest?.categories) ? payload.interest.categories : [],
      budget: String(payload.interest?.budget || '').trim(),
      timeline: String(payload.interest?.timeline || '').trim(),
      notes: String(payload.interest?.notes || '').trim()
    },
    preferredContact: String(payload.preferredContact || 'whatsapp').trim(),
    estimator: payload.estimator || null,
    adminNotes: []
  };
}

function publicResource(resource) {
  return resource.status === 'published';
}
```

- [ ] **Step 5: Add public endpoints**

Place before `app.use('/api/admin', requireAdmin);`:

```js
app.get('/api/resources', (req, res) => res.json(resources.filter(publicResource)));
app.get('/api/resources/:slug', (req, res) => {
  const resource = resources.find((entry) => entry.slug === req.params.slug && publicResource(entry));
  if (!resource) return res.status(404).json({ message: 'Resource not found.' });
  return res.json(resource);
});

app.get('/api/partners/public', (req, res) => res.json(partners.filter((entry) => entry.public)));

app.post('/api/leads', (req, res) => {
  const normalized = normalizeLead(req.body);
  if (normalized.error) return res.status(400).json({ message: normalized.error });
  leads = [normalized, ...leads];
  writeJsonFile(leadsPath, leads);
  return res.status(201).json({ success: true, lead: normalized });
});

app.post('/api/estimator', (req, res) => {
  const normalized = normalizeLead({
    source: 'estimator',
    customer: req.body.customer,
    interest: {
      products: req.body.recommendation?.products || [],
      categories: req.body.input?.categories || [],
      budget: req.body.input?.budget || '',
      timeline: req.body.input?.urgency || '',
      notes: req.body.input?.notes || ''
    },
    preferredContact: req.body.preferredContact || 'whatsapp',
    estimator: {
      input: req.body.input || {},
      recommendation: req.body.recommendation || {}
    }
  }, 'estimator');
  if (normalized.error) return res.status(400).json({ message: normalized.error });
  leads = [normalized, ...leads];
  writeJsonFile(leadsPath, leads);
  return res.status(201).json({ success: true, lead: normalized });
});

app.post('/api/analytics/events', (req, res) => {
  const event = {
    id: `EVT-${Date.now()}`,
    createdAt: new Date().toISOString(),
    type: String(req.body.type || 'unknown').trim(),
    source: String(req.body.source || '').trim(),
    productId: req.body.productId || null,
    categoryId: req.body.categoryId || null,
    metadata: req.body.metadata || {}
  };
  analyticsEvents = [event, ...analyticsEvents].slice(0, 1000);
  writeJsonFile(analyticsPath, analyticsEvents);
  return res.status(201).json({ success: true });
});
```

- [ ] **Step 6: Add admin endpoints**

Place after `app.use('/api/admin', requireAdmin);`:

```js
app.get('/api/admin/dashboard', (req, res) => {
  const statusCounts = leads.reduce((counts, lead) => {
    counts[lead.status] = (counts[lead.status] || 0) + 1;
    return counts;
  }, {});
  const sourceCounts = leads.reduce((counts, lead) => {
    counts[lead.source] = (counts[lead.source] || 0) + 1;
    return counts;
  }, {});
  return res.json({
    leadsTotal: leads.length,
    statusCounts,
    sourceCounts,
    estimatorSubmissions: leads.filter((lead) => lead.source === 'estimator').length,
    analyticsTotal: analyticsEvents.length,
    recentLeads: leads.slice(0, 5)
  });
});

app.get('/api/admin/leads', (req, res) => res.json(leads));

app.put('/api/admin/leads/:id', (req, res) => {
  const lead = leads.find((entry) => entry.id === req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found.' });
  const status = String(req.body.status || lead.status).trim();
  if (!leadStatuses.has(status)) return res.status(400).json({ message: 'Invalid lead status.' });
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  writeJsonFile(leadsPath, leads);
  return res.json({ success: true, lead, leads });
});

app.post('/api/admin/leads/:id/notes', (req, res) => {
  const lead = leads.find((entry) => entry.id === req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found.' });
  const text = String(req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Note text is required.' });
  lead.adminNotes = [{ id: `NOTE-${Date.now()}`, createdAt: new Date().toISOString(), text }, ...(lead.adminNotes || [])];
  lead.updatedAt = new Date().toISOString();
  writeJsonFile(leadsPath, leads);
  return res.status(201).json({ success: true, lead, leads });
});
```

- [ ] **Step 7: Verify backend**

Run: `npm.cmd run build`

Expected: Vite production build succeeds.

- [ ] **Step 8: Commit**

```bash
git add server/index.js server/data/leads.json server/data/resources.json server/data/partners.json server/data/analytics-events.json
git commit -m "Add Ramani lead and resource APIs"
```

---

### Task 2: Product Metadata and Shared Client Utilities

**Files:**
- Modify: `server/data/products.json`
- Create: `src/context/CompareContext.jsx`
- Create: `src/utils/whatsapp.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Produces `CompareProvider`, `useCompare()`, `addCompare(product)`, `removeCompare(id)`, `clearCompare()`, and `isCompared(id)`.
- Produces `whatsappUrl({ phone, text })`.
- App wraps pages in `CompareProvider`.

- [ ] **Step 1: Enrich products**

For every product in `server/data/products.json`, add fields using this pattern:

```json
{
  "useCases": ["interior fit-out", "project sourcing"],
  "tags": ["eco board", "panels", "sustainable"],
  "buyingMode": "quote",
  "estimatorType": "area",
  "measurementUnit": "boards",
  "projectTypes": ["home", "office", "retail", "interior fit-out"],
  "supportNotes": "Share approximate area, finish expectations, and delivery area for a formal quote.",
  "minOrder": "Confirm with Ramani",
  "bulkAvailable": true,
  "quoteOnly": false,
  "featured": true
}
```

Use category-appropriate values:

- Eco Board: `buyingMode: "quote"`, `estimatorType: "area"`.
- HDPE Plastics: `buyingMode: "quote"`, `estimatorType: "bulk"`.
- Glass Recycling: `buyingMode: "quote"`, `estimatorType: "bulk"`, include `glass craft` tags if relevant.
- PPR Pipes & Fittings: `buyingMode: "consult"`, `estimatorType: "plumbing"`.
- Interior Design: `buyingMode: "consult"`, `estimatorType: "space"`.
- Detergent & Grease: `buyingMode: "checkout"`, `estimatorType: "repeat-supply"`.
- Furniture: `buyingMode: "checkout"`, `estimatorType: "pieces"`.

- [ ] **Step 2: Create comparison context**

Create `src/context/CompareContext.jsx`:

```jsx
import React, { createContext, useContext, useMemo, useState } from 'react';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]);

  function addCompare(product) {
    setItems((current) => {
      if (!product || current.some((entry) => String(entry.id) === String(product.id))) return current;
      return [...current, product].slice(0, 4);
    });
  }

  function removeCompare(id) {
    setItems((current) => current.filter((entry) => String(entry.id) !== String(id)));
  }

  function clearCompare() {
    setItems([]);
  }

  function isCompared(id) {
    return items.some((entry) => String(entry.id) === String(id));
  }

  const value = useMemo(() => ({ items, addCompare, removeCompare, clearCompare, isCompared }), [items]);
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const value = useContext(CompareContext);
  if (!value) throw new Error('useCompare must be used inside CompareProvider');
  return value;
}
```

- [ ] **Step 3: Create WhatsApp helper**

Create `src/utils/whatsapp.js`:

```js
export const RAMANI_WHATSAPP = '+254793371994';

export function whatsappUrl({ phone = RAMANI_WHATSAPP, text = '' } = {}) {
  const digits = String(phone).replace(/\D/g, '');
  const normalized = digits.startsWith('254') ? digits : `254${digits.replace(/^0+/, '')}`;
  return `https://wa.me/${normalized}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
```

- [ ] **Step 4: Wrap app with compare provider**

In `src/App.jsx`, import `CompareProvider` and wrap inside `CartProvider`:

```jsx
import { CompareProvider } from './context/CompareContext';
```

```jsx
<CartProvider>
  <CompareProvider>
    <div className="page-shell">...</div>
  </CompareProvider>
</CartProvider>
```

- [ ] **Step 5: Verify**

Run: `npm.cmd run build`

Expected: Build succeeds with no missing imports.

- [ ] **Step 6: Commit**

```bash
git add server/data/products.json src/context/CompareContext.jsx src/utils/whatsapp.js src/App.jsx
git commit -m "Add product metadata and comparison state"
```

---

### Task 3: Reusable Quote Form, Compare Tray, and Navigation

**Files:**
- Create: `src/components/QuoteForm.jsx`
- Create: `src/components/CompareTray.jsx`
- Modify: `src/components/Header.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Interfaces:**
- `QuoteForm` props: `{ source, products = [], categories = [], defaultNotes = '', onSuccess }`.
- `CompareTray` consumes `useCompare()` and `useCart()`.

- [ ] **Step 1: Create `QuoteForm.jsx`**

```jsx
import React, { useState } from 'react';
import { whatsappUrl } from '../utils/whatsapp';

export default function QuoteForm({ source, products = [], categories = [], defaultNotes = '', onSuccess }) {
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', company: '', location: '' });
  const [interest, setInterest] = useState({ budget: '', timeline: '', notes: defaultNotes });
  const [preferredContact, setPreferredContact] = useState('whatsapp');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim()) {
      setMessage('Name and phone are required.');
      return;
    }
    setSubmitting(true);
    setMessage('Sending request...');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          customer,
          preferredContact,
          interest: {
            ...interest,
            products: products.map((product) => ({ id: product.id, name: product.name, sku: product.sku })),
            categories
          }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Quote request failed.');
      setMessage('Request received. Ramani will follow up with you.');
      onSuccess?.(data.lead);
    } catch (error) {
      setMessage(error.message || 'Could not send request.');
    } finally {
      setSubmitting(false);
    }
  }

  const whatsAppText = `Hello Ramani Warehouse, I would like a quote for ${products.map((p) => p.name).join(', ') || categories.join(', ') || 'project materials'}. ${interest.notes || ''}`.trim();

  return (
    <form className="quote-form" onSubmit={submit}>
      <div className="quote-grid">
        <label>Name<input required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></label>
        <label>Phone<input required value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></label>
        <label>Email<input type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></label>
        <label>Location<input value={customer.location} onChange={(event) => setCustomer({ ...customer, location: event.target.value })} /></label>
        <label>Budget range<input value={interest.budget} onChange={(event) => setInterest({ ...interest, budget: event.target.value })} /></label>
        <label>Timeline<input value={interest.timeline} onChange={(event) => setInterest({ ...interest, timeline: event.target.value })} /></label>
      </div>
      <label>Project notes<textarea rows="4" value={interest.notes} onChange={(event) => setInterest({ ...interest, notes: event.target.value })} /></label>
      <label>Preferred follow-up<select value={preferredContact} onChange={(event) => setPreferredContact(event.target.value)}><option value="whatsapp">WhatsApp</option><option value="call">Call</option><option value="email">Email</option></select></label>
      <div className="quote-actions">
        <button className="button primary" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Request quote'}</button>
        <a className="button secondary" href={whatsappUrl({ text: whatsAppText })} target="_blank" rel="noreferrer">WhatsApp Ramani</a>
      </div>
      {message ? <p className="status-text">{message}</p> : null}
    </form>
  );
}
```

- [ ] **Step 2: Create `CompareTray.jsx`**

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { assetUrl } from '../utils/assets';

export default function CompareTray() {
  const { items, removeCompare, clearCompare } = useCompare();
  const { add } = useCart();
  if (!items.length) return null;
  return (
    <aside className="compare-tray" aria-label="Product comparison">
      <div className="compare-tray-head"><strong>Compare products</strong><button type="button" onClick={clearCompare}>Clear</button></div>
      <div className="compare-grid">
        {items.map((item) => (
          <article key={item.id}>
            <img src={assetUrl(item.image)} alt="" />
            <strong>{item.name}</strong>
            <span>{item.category}</span>
            <small>{item.stock} Â· {item.leadTime}</small>
            <button type="button" onClick={() => add(item, 1)}>Add to cart</button>
            <button type="button" onClick={() => removeCompare(item.id)}>Remove</button>
          </article>
        ))}
      </div>
      <Link className="button primary compact" to="/contact">Request comparison quote</Link>
    </aside>
  );
}
```

- [ ] **Step 3: Render `CompareTray` globally**

In `src/App.jsx`, import and render above `Footer`:

```jsx
import CompareTray from './components/CompareTray';
```

```jsx
<CompareTray />
<Footer />
```

- [ ] **Step 4: Update header navigation**

In `src/components/Header.jsx`, add nav links:

```jsx
<NavLink to="/estimator" className="nav-link">Estimator</NavLink>
<NavLink to="/resources" className="nav-link">Resources</NavLink>
<NavLink to="/contact" className="nav-link">Quote</NavLink>
```

- [ ] **Step 5: Add CSS**

Append focused styles for `.quote-form`, `.quote-grid`, `.quote-actions`, `.compare-tray`, `.compare-grid`, and compact mobile behavior.

- [ ] **Step 6: Verify**

Run: `npm.cmd run build`

Expected: Build succeeds and header routes compile.

- [ ] **Step 7: Commit**

```bash
git add src/components/QuoteForm.jsx src/components/CompareTray.jsx src/components/Header.jsx src/App.jsx src/index.css
git commit -m "Add quote form and comparison tray"
```

---

### Task 4: Estimator, Resources, and Contact Pages

**Files:**
- Create: `src/pages/Estimator.jsx`
- Create: `src/pages/Resources.jsx`
- Create: `src/pages/ResourceDetail.jsx`
- Create: `src/pages/Contact.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Interfaces:**
- `Estimator` posts to `POST /api/estimator`.
- `Resources` reads `GET /api/resources`.
- `ResourceDetail` reads `GET /api/resources/:slug`.
- `Contact` reads `GET /api/partners/public` and uses `QuoteForm`.

- [ ] **Step 1: Add routes**

In `src/App.jsx`:

```jsx
import Estimator from './pages/Estimator';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Contact from './pages/Contact';
```

Routes:

```jsx
<Route path="/estimator" element={<Estimator />} />
<Route path="/resources" element={<Resources />} />
<Route path="/resources/:slug" element={<ResourceDetail />} />
<Route path="/contact" element={<Contact />} />
```

- [ ] **Step 2: Create estimator recommendation logic**

Inside `Estimator.jsx`, implement:

```jsx
function recommendProducts(products, input) {
  const selectedCategories = new Set(input.categories);
  const project = String(input.projectType || '').toLowerCase();
  return products
    .filter((product) => {
      const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(product.category);
      const projectMatch = (product.projectTypes || []).some((type) => project.includes(String(type).toLowerCase()) || String(type).toLowerCase().includes(project));
      const tagMatch = (product.tags || []).some((tag) => project.includes(String(tag).toLowerCase()));
      return categoryMatch || projectMatch || tagMatch;
    })
    .slice(0, 6);
}
```

- [ ] **Step 3: Build estimator page**

Fields must match the design: project type, categories, quantity, urgency, delivery area, budget, name, phone, email, preferred follow-up, and notes. On submit, compute recommendations and post:

```js
{
  customer,
  input,
  preferredContact,
  recommendation: {
    products: recommended.map((product) => ({ id: product.id, name: product.name, sku: product.sku, buyingMode: product.buyingMode })),
    estimatedSubtotal
  }
}
```

Render recommended products with clear labels for `checkout`, `quote`, and `consult`.

- [ ] **Step 4: Create resource pages**

`Resources.jsx` lists cards with title, summary, tags, and `Read guide` links.

`ResourceDetail.jsx` shows title, summary, body, tags, and a `QuoteForm` with `source="resource"`.

- [ ] **Step 5: Create contact page**

`Contact.jsx` renders a general `QuoteForm` with `source="contact"` and public partner/support records from `/api/partners/public`.

- [ ] **Step 6: Add CSS**

Add responsive classes for `.estimator-page`, `.estimator-grid`, `.recommendation-list`, `.resource-grid`, `.resource-detail`, and `.contact-grid`.

- [ ] **Step 7: Verify**

Run: `npm.cmd run build`

Expected: Build succeeds and all new routes compile.

- [ ] **Step 8: Commit**

```bash
git add src/pages/Estimator.jsx src/pages/Resources.jsx src/pages/ResourceDetail.jsx src/pages/Contact.jsx src/App.jsx src/index.css
git commit -m "Add estimator resources and contact pages"
```

---

### Task 5: Catalog Filtering, Product Comparison Actions, and Product Quote CTAs

**Files:**
- Modify: `src/pages/Categories.jsx`
- Modify: `src/pages/CategoryPage.jsx`
- Modify: `src/components/ProductList.jsx`
- Modify: `src/components/ProductPage.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Product cards call `useCompare().addCompare(product)`.
- Product pages use `QuoteForm` and `whatsappUrl`.

- [ ] **Step 1: Add filter state to catalog pages**

Add state:

```jsx
const [query, setQuery] = useState('');
const [stock, setStock] = useState('all');
const [buyingMode, setBuyingMode] = useState('all');
const [sort, setSort] = useState('featured');
```

Filter products by query against name, SKU, description, category, specs, tags, and use cases. Filter by stock and buying mode. Sort by featured, price ascending, price descending, name, and fastest lead-time text.

- [ ] **Step 2: Add visible filter controls**

Controls:

```jsx
<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, specs, or project use" />
<select value={stock} onChange={(event) => setStock(event.target.value)}>...</select>
<select value={buyingMode} onChange={(event) => setBuyingMode(event.target.value)}>...</select>
<select value={sort} onChange={(event) => setSort(event.target.value)}>...</select>
```

Empty state must link to `/contact` and `/estimator`.

- [ ] **Step 3: Add compare actions to `ProductList.jsx`**

Import `useCompare` and add a compact button:

```jsx
const { addCompare, isCompared } = useCompare();
```

```jsx
<button className="compare-button" type="button" onClick={(event) => { event.preventDefault(); addCompare(product); }}>
  {isCompared(product.id) ? 'Comparing' : 'Compare'}
</button>
```

- [ ] **Step 4: Add product quote section**

In `ProductPage.jsx`, import `QuoteForm`, `whatsappUrl`, and `useCompare`. Add:

```jsx
<button className="button secondary" type="button" onClick={() => addCompare(product)}>Add to compare</button>
<a className="button glass" href={whatsappUrl({ text: `Hello Ramani Warehouse, I am interested in ${product.name} (${product.sku}).` })} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
```

Below purchase box:

```jsx
<section className="product-quote-panel card-panel">
  <h2>Need a project quote?</h2>
  <QuoteForm source="product" products={[product]} defaultNotes={`I am interested in ${product.name}.`} />
</section>
```

- [ ] **Step 5: Verify**

Run: `npm.cmd run build`

Expected: Build succeeds; existing product and category routes still compile.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Categories.jsx src/pages/CategoryPage.jsx src/components/ProductList.jsx src/components/ProductPage.jsx src/index.css
git commit -m "Improve catalog filtering and product quote flows"
```

---

### Task 6: Homepage Growth Sections

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Home links to `/estimator`, `/contact`, and `/resources`.
- Home reads resources from `/api/resources` for preview cards.

- [ ] **Step 1: Load resources preview**

Extend home state:

```jsx
const [resources, setResources] = useState([]);
```

In `useEffect`, fetch `/api/resources` and keep the first three records.

- [ ] **Step 2: Add project-start section**

Add a section after trust strip with three actions:

- Start materials estimator.
- Request formal quote.
- Browse resources.

Each action must include category-aware copy for Eco Boards, glass/crafting, PPR, interiors, cleaning, and furniture.

- [ ] **Step 3: Add resource preview**

Add a section before the experience band that maps `resources.slice(0, 3)` to cards linking to `/resources/:slug`.

- [ ] **Step 4: Add contact band**

Add phone, WhatsApp, email, location, and response expectation. Link WhatsApp through `whatsappUrl`.

- [ ] **Step 5: Verify**

Run: `npm.cmd run build`

Expected: Build succeeds and homepage imports resolve.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.jsx src/index.css
git commit -m "Add homepage conversion sections"
```

---

### Task 7: Admin Dashboard and Lead Inbox

**Files:**
- Modify: `src/pages/Admin.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Admin calls `GET /api/admin/dashboard` and `GET /api/admin/leads`.
- Admin updates status with `PUT /api/admin/leads/:id`.
- Admin adds notes with `POST /api/admin/leads/:id/notes`.

- [ ] **Step 1: Add admin state**

Add:

```jsx
const [dashboard, setDashboard] = useState(null);
const [leads, setLeads] = useState([]);
const [selectedLeadId, setSelectedLeadId] = useState('');
const [leadMessage, setLeadMessage] = useState('');
const [leadNote, setLeadNote] = useState('');
```

- [ ] **Step 2: Load dashboard and leads in `loadAdmin()`**

Add to the Promise list:

```js
fetch('/api/admin/dashboard', { headers: adminHeaders }),
fetch('/api/admin/leads', { headers: adminHeaders })
```

Set `dashboard`, `leads`, and default selected lead.

- [ ] **Step 3: Add lead status and note handlers**

```jsx
async function updateLeadStatus(id, status) {
  const response = await fetch(`/api/admin/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...adminHeaders },
    body: JSON.stringify({ status })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lead update failed.');
  setLeads(data.leads || []);
  setLeadMessage('Lead status updated.');
}

async function addLeadNote(event) {
  event.preventDefault();
  if (!selectedLeadId || !leadNote.trim()) return;
  const response = await fetch(`/api/admin/leads/${selectedLeadId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders },
    body: JSON.stringify({ text: leadNote })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Note save failed.');
  setLeads(data.leads || []);
  setLeadNote('');
  setLeadMessage('Note added.');
}
```

- [ ] **Step 4: Render dashboard cards**

Add an admin section near the top showing total leads, new leads, estimator submissions, analytics events, and source counts.

- [ ] **Step 5: Render lead inbox**

Add list/detail UI:

- Left list: customer name, source, status, date.
- Detail: contact, location, preferred method, products/categories, estimator payload summary, notes.
- Status select with the six statuses.
- Copy WhatsApp follow-up text button using `navigator.clipboard.writeText`.
- Admin note form.

- [ ] **Step 6: Verify**

Run: `npm.cmd run build`

Expected: Build succeeds; existing admin product/category/hero sections still compile.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Admin.jsx src/index.css
git commit -m "Add admin lead inbox"
```

---

### Task 8: End-to-End Verification and Polish

**Files:**
- Modify only files needed for fixes found during verification.

**Interfaces:**
- All public and admin flows from previous tasks work together.

- [ ] **Step 1: Run build**

Run: `npm.cmd run build`

Expected: Build succeeds.

- [ ] **Step 2: Start dev server**

Run: `npm.cmd run dev`

Expected: Vite and Express start. Frontend is available at `http://localhost:5173`; backend responds through Vite proxy/API routing.

- [ ] **Step 3: Verify public routes**

Open and check:

- `/`
- `/categories`
- `/estimator`
- `/resources`
- `/contact`
- A product detail route from the catalog.

Expected: no blank pages, no obvious overlapping text, and CTAs are visible on desktop and mobile widths.

- [ ] **Step 4: Verify lead submission**

Submit:

- A contact quote request.
- A product quote request.
- An estimator request.

Expected: each request shows success and appears in `server/data/leads.json`.

- [ ] **Step 5: Verify admin lead workflow**

Open `/admin`, unlock with the admin key, view leads, change status, and add a note.

Expected: lead updates persist in `server/data/leads.json`.

- [ ] **Step 6: Verify existing ecommerce workflow**

Add a product to cart, update quantity, open checkout, submit demo order without Stripe.

Expected: existing cart and checkout behavior still works.

- [ ] **Step 7: Final commit**

If verification fixes were made:

```bash
git add <changed-files>
git commit -m "Polish Ramani growth engine flows"
```

If no fixes were needed, do not create an empty commit.

---

## Self-Review Notes

- Spec coverage: This plan covers Phase 1 public discovery, catalog filtering, comparison, quote/contact capture, category-aware estimator, resources, WhatsApp handoff, analytics event storage, and the essential Phase 2 admin lead inbox. It defers real AI/live chat, partner login, database migration, and production media storage as required by the spec.
- Placeholder scan: The plan uses concrete steps, file names, endpoint names, data shapes, and verification commands.
- Type consistency: `Lead`, `Resource`, `Partner`, analytics event, `QuoteForm`, `CompareProvider`, and endpoint names match across tasks.
