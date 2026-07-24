# Ramani Warehouse Digital Growth Engine Design

## Status

Approved design direction from the proposal translation. This spec converts the Heritage Mabati proposal deliverables into Ramani Warehouse equivalents and defines a phased implementation for the existing React/Vite storefront and Express API.

## Existing Product Context

Ramani Warehouse is currently a React/Vite ecommerce storefront with an Express API. The site already includes:

- Public homepage with hero carousel, category carousel, trust strip, featured products, and why-Ramani content.
- Category browsing through `/categories` and `/categories/:slug`.
- Product detail pages through `/product/:id`.
- Cart context, checkout page, and optional Stripe checkout fallback.
- Customer account placeholder at `/account`.
- Private admin area at `/admin` protected by an admin code.
- Admin editing for products, categories, hero slides, image uploads, and poster dimensions.
- JSON-backed data stored in `server/data/*.json`.

The current architecture is suitable for a first-phase growth platform, but JSON files are not sufficient for durable production CRM, analytics, authentication, or media storage. This design deliberately separates features that can be built now from features that require a later storage/auth upgrade.

## Proposal Translation

The source proposal was written for a roofing company. Ramani Warehouse will receive equivalent business capabilities instead of literal roofing features. Every feature must be optimized around Ramani's actual catalog mix: Eco Boards, HDPE plastics, glass recycling/crafting inputs, PPR pipes and fittings, interior design/fit-out products, detergent and grease solutions, furniture, and future warehouse categories.

| Proposal Deliverable | Ramani Warehouse Equivalent |
| --- | --- |
| Roofing lead generation | Project sourcing enquiries, quote requests, cart-assisted buying, and WhatsApp lead capture |
| Customer trust and brand authority | Verified product details, stock/lead-time visibility, practical product guides, testimonials, delivery/payment clarity, and Ramani contact proof |
| Dealer engagement | Partner, supplier, branch, or fulfillment support management |
| Filterable roofing catalog by gauge, color, application | Searchable/filterable Ramani catalog by category, use case, stock, lead time, price, specs, and project fit |
| Dealer portal | Private operations portal for admin users and future fulfillment partners |
| Installation guides and case studies | Resource hub for product guides, procurement advice, material use cases, fit-out ideas, cleaning/maintenance notes, and project examples |
| Calculator-style planning tool | Multi-category project materials estimator and quote builder for Ramani products |
| Product comparison | Side-by-side comparison for Ramani products and categories |
| Dealer locator | Fulfillment/contact locator for Ramani support points, partners, branches, suppliers, or delivery coverage |
| AI chatbot, live chat, WhatsApp | Support widget with WhatsApp-first handoff, structured enquiry capture, and future AI/live-chat integration |
| CRM integration | Lead and quote inbox with status tracking and export-ready records |
| Ecommerce readiness | Checkout for standard products, quote requests for bulk/custom products, and fulfillment notes |
| Analytics dashboard | Admin metrics for visits/events, top products, quote requests, checkout attempts, product comparisons, estimator submissions, and lead outcomes |
| Phased scalability | Launch, scale, automate, and lead phases adapted to Ramani's marketplace strategy |

## Business Objectives

The platform must achieve four outcomes:

1. Increase qualified leads by giving visitors clear enquiry, quote, WhatsApp, estimator, and checkout paths.
2. Improve buyer confidence with richer product transparency, resource content, visible contact details, and practical proof points.
3. Support operations by giving admins a single place to manage catalog content, resources, leads, quotes, partners, and metrics.
4. Create a scalable technical foundation that can move from JSON files to database-backed CRM, analytics, auth, and persistent media storage.

Every optimization should be judged by Ramani buying efficiency: a customer should reach the right category, product, bundle, quote path, or support contact with fewer decisions, less uncertainty, and no roofing-specific assumptions.

## Audience

Primary users:

- Retail customers buying furniture, fittings, supplies, and project materials.
- Contractors and project buyers sourcing multiple materials or bulk quantities.
- Business buyers needing quotes, delivery coordination, or repeat procurement.
- Ramani administrators managing content, products, quotes, and follow-up.

Future users:

- Fulfillment partners, suppliers, branches, or dealers that need restricted access to stock, pricing, quote requests, or marketing assets.

## Core User Journeys

### Discovery to Lead

1. Visitor lands on homepage.
2. They see Ramani's key categories, proof points, support options, and featured products.
3. They choose one of four paths: browse catalog, start estimator, request quote, or WhatsApp Ramani.
4. The site captures enough context to qualify the lead: name, phone, product/category interest, project type, quantity, location, and preferred contact method.
5. Admin sees the enquiry in the lead inbox with source and status.

### Browse to Confident Product Decision

1. Visitor opens categories or searches the catalog.
2. They filter by category, project use, stock status, lead time, price range, and specs.
3. They compare selected products side by side.
4. Product pages show media, specs, stock, lead time, price, related products, quote CTA, WhatsApp CTA, and add-to-cart.
5. Visitor checks out for standard products or requests a quote for bulk/custom needs.

### Project Estimator to Quote

1. Visitor opens the estimator.
2. They choose project type, relevant categories, approximate quantity or dimensions, urgency, location, and support preference.
3. The estimator returns a suggested materials list using existing products and simple rules.
4. Visitor can add items to cart, send a quote request, or continue on WhatsApp.
5. Admin receives the estimator submission with recommended items and visitor details.

### Admin Lead Follow-Up

1. Admin opens `/admin`.
2. Dashboard shows new leads, quote requests, estimator submissions, checkout attempts, top products, and low/unclear catalog data.
3. Admin opens a lead record, reviews customer details, source, products, notes, and status.
4. Admin updates status to new, contacted, quoted, won, lost, or archived.
5. Admin can copy a WhatsApp-ready message, record follow-up notes, and later export leads.

### Future Partner/Fulfillment Workflow

1. Admin creates partner records for branches, suppliers, fulfillment partners, or dealer-like contacts.
2. Public locator shows relevant support points by area, category, or service type.
3. Future partner login allows restricted access to assigned enquiries, stock notes, marketing assets, and quote fulfillment details.

## Public Website Design

### Navigation

Primary navigation should expose:

- Home
- Categories
- Estimator
- Resources
- Contact or Quote

The header should keep cart and login/admin access. The quote/WhatsApp action should be visible without crowding mobile navigation.

### Homepage

The homepage should become a conversion-focused command surface:

- Hero area with strong Ramani value proposition and CTAs for catalog, estimator, and quote request.
- Category carousel retained but labelled around project sourcing.
- Trust strip expanded with visible promises: local sourcing support, quote response, delivery coordination, verified catalog, and secure checkout path.
- Featured categories and products.
- "Start with your project" section that routes users to estimator, quote request, or WhatsApp.
- Social proof/resource preview section for guides, project examples, and testimonials.
- Contact band with phone, WhatsApp, location, email, and response expectation.

### Catalog and Categories

The catalog should support:

- Text search across name, SKU, description, category, and specs.
- Category filter.
- Use-case/project filter such as eco-board partitions, sustainable panels, glass craft/recycling, plumbing installation, cleaning operations, furniture sourcing, interior fit-out, maintenance, manufacturing input, and bulk supply.
- Stock filter.
- Lead-time filter.
- Price range filter.
- Sort by featured, price low/high, name, stock confidence, and fastest lead time.
- Compare selection for up to four products.
- Clear empty state with quote/WhatsApp fallback.

Category pages should include a short category overview, featured products, resource links, and quote CTA.

Catalog optimization should avoid forcing every product into the same buying pattern. Standard stocked products can emphasize cart and checkout. Bulk, custom, service-heavy, or project-dependent products should emphasize quote request, WhatsApp handoff, and estimator inclusion.

### Product Detail

Each product page should include:

- Product media gallery.
- Name, SKU, category, price, stock, lead time, rating/proof indicator, and badge.
- Description and specs.
- Project-fit/use-case list.
- Quantity selector.
- Add to cart.
- Buy now.
- Request quote for this product.
- WhatsApp enquiry for this product.
- Add to compare.
- Related products.
- Resource links for the category when available.

### Product Comparison

Comparison should be a public workflow, not just an admin tool:

- Users can select up to four products from catalog cards.
- A comparison drawer or page shows price, category, stock, lead time, specs, use cases, badge, and CTA.
- Comparison state can be client-side only in the first implementation.
- Users can add one or more compared products to cart or request a quote.

### Project Materials Estimator

Estimator fields:

- Project type: home, office, retail, hospitality, workshop, maintenance, construction, recycling, glass craft, cleaning operations, furniture sourcing, interior fit-out, plumbing, custom.
- Category interests: current Ramani categories.
- Approximate quantity input: units, area, rooms, pieces, or "not sure".
- Urgency: today, this week, this month, planning.
- Delivery area.
- Budget range.
- Contact details: name, phone, email optional.
- Preferred follow-up: call, WhatsApp, email.
- Notes.

Estimator output:

- Recommended categories.
- Suggested products based on category and use-case tags.
- Quantity assumptions clearly displayed.
- Estimated subtotal when prices exist.
- Quote-only and consult-first items clearly separated from checkout-ready items.
- "Add suggested items to cart."
- "Request formal quote."
- "Continue on WhatsApp."

Estimator rules should be simple and transparent in phase 1. They can rely on category matches, product tags/specs, and default quantity heuristics. The estimator must not claim engineering accuracy or imply one universal calculator fits every Ramani category.

Category-aware estimator behavior:

- Eco Boards: guide users by area, rooms, partition/wall/ceiling use, board quantity uncertainty, and quote follow-up.
- HDPE Plastics: guide users by bulk quantity, manufacturing/crafting use, grade/spec needs, and batch availability.
- Glass Recycling and Glass Crafting: guide users by intended use, sorted material needs, craft/project volume, safety/handling notes, and quote follow-up.
- PPR Pipes and Fittings: guide users by plumbing project type, approximate run length, fitting needs, and consult-first validation.
- Interior Design: guide users by space type, package interest, budget range, timeline, and consultation path.
- Detergent and Grease Solutions: guide users by facility type, cleaning frequency, pack size, and repeat supply needs.
- Furniture: guide users by room type, quantity, finish/customization, delivery area, and quote or checkout path.
- Cross-category projects: allow mixed recommendations and make the generated list editable before quote submission.

### Quote Request

Quote requests should be available from:

- Header/contact CTA.
- Product page.
- Cart/checkout.
- Estimator.
- Empty search/filter state.
- Resource pages.

Required fields:

- Name.
- Phone.
- Interest source.
- Products or categories of interest.
- Quantity or project notes.
- Location.
- Preferred contact method.

Optional fields:

- Email.
- Budget range.
- Timeline.
- Company name.
- Attachment in a later phase.

### Resources

Resource hub content types:

- Buying guide.
- Product guide.
- Project idea.
- Maintenance or usage note.
- Case study.
- FAQ.

Resource records need:

- Title.
- Slug.
- Summary.
- Body.
- Category.
- Tags.
- Cover image.
- Published/draft status.
- Related products.

Public resource pages should include quote and WhatsApp CTAs tied to the resource topic.

Resource topics should be distributed across Ramani categories rather than concentrated in one product line. Initial content should include practical guidance for eco boards, glass/crafting or recycling, PPR fittings, interiors, cleaning operations, and furniture sourcing.

### Contact and Support

Support must be WhatsApp-first for the Kenyan buying context while still supporting form-based capture.

Support surfaces:

- Floating WhatsApp/contact button.
- Product-specific WhatsApp links with prefilled product name/SKU.
- Estimator-specific WhatsApp links with project summary.
- Quote form.
- Contact page or section.
- Future chat/AI hook.

Phase 1 should implement structured forms and WhatsApp handoff. AI chatbot and live chat are future integrations unless the user explicitly prioritizes them.

## Admin and Operations Design

### Admin Dashboard

The admin landing view should summarize:

- New leads.
- New quote requests.
- Estimator submissions.
- Recent checkout/order attempts.
- Top viewed or top-interacted products when tracking exists.
- Products missing images, specs, prices, stock, or lead-time values.
- Resource drafts.

### Lead and Quote Inbox

Lead records should include:

- ID.
- Created date.
- Source: quote form, product page, cart, estimator, WhatsApp CTA, resource, contact.
- Customer details.
- Products/categories.
- Project notes.
- Location.
- Preferred contact.
- Status.
- Admin notes.
- Last updated date.

Statuses:

- New.
- Contacted.
- Quoted.
- Won.
- Lost.
- Archived.

Admin actions:

- Update status.
- Add note.
- Copy WhatsApp follow-up text.
- Open product/category context.
- Export-ready data structure in a later phase.

### Estimator Submissions

Estimator submissions should be stored as lead records with an estimator payload:

- Input fields.
- Generated recommendation.
- Suggested products.
- Estimated subtotal.
- User confirmation action.

### Resource Manager

Admin should manage resource hub content:

- Create/edit/delete resource records.
- Toggle draft/published.
- Assign category and related products.
- Upload/assign cover images using existing image upload patterns.

### Partner/Fulfillment Manager

Phase 3 partner records:

- Name.
- Type: branch, supplier, fulfillment partner, dealer, installer, support contact, logistics.
- Location and coverage areas.
- Contact phone, WhatsApp, email.
- Categories supported.
- Public/private visibility.
- Notes.

Public locator should only show records marked public.

### Analytics Dashboard

Phase 1 analytics can be event records stored locally in JSON. Phase 4 should move analytics to a database or analytics service.

Events to track:

- Product view.
- Category view.
- Search performed.
- Filter applied.
- Product compared.
- Add to cart.
- Quote request submitted.
- Estimator started.
- Estimator submitted.
- WhatsApp CTA clicked.
- Checkout submitted.

Dashboard metrics:

- Total leads.
- Leads by source.
- Quote requests by status.
- Estimator submissions.
- Top products by interaction.
- Cart/checkout attempts.
- WhatsApp clicks.
- Lead conversion status counts.

## Data Model

Phase 1 can extend JSON files under `server/data`.

### Product Extensions

Products should support these fields:

- `id`
- `sku`
- `name`
- `price`
- `description`
- `category`
- `categoryId`
- `image`
- `gallery`
- `rating`
- `leadTime`
- `stock`
- `badge`
- `specs`
- `useCases`
- `tags`
- `buyingMode`
- `estimatorType`
- `measurementUnit`
- `projectTypes`
- `supportNotes`
- `minOrder`
- `bulkAvailable`
- `quoteOnly`
- `featured`

Existing product records should remain compatible when new fields are missing.

`buyingMode` should support `checkout`, `quote`, and `consult`. This keeps the site efficient across very different Ramani products: a furniture item may be checkout-ready, bulk HDPE may be quote-led, and an interior package may be consult-first.

### Lead Record

```json
{
  "id": "LEAD-1780000000000",
  "createdAt": "2026-07-25T00:00:00.000Z",
  "updatedAt": "2026-07-25T00:00:00.000Z",
  "source": "product",
  "status": "new",
  "customer": {
    "name": "Customer Name",
    "phone": "+254...",
    "email": "",
    "company": "",
    "location": ""
  },
  "interest": {
    "products": [],
    "categories": [],
    "budget": "",
    "timeline": "",
    "notes": ""
  },
  "preferredContact": "whatsapp",
  "estimator": null,
  "adminNotes": []
}
```

### Resource Record

```json
{
  "id": "resource-id",
  "slug": "resource-slug",
  "title": "Resource title",
  "summary": "Short public summary",
  "body": "Resource body",
  "categoryId": "eco-boards",
  "tags": [],
  "coverImage": "",
  "relatedProducts": [],
  "status": "published",
  "createdAt": "2026-07-25T00:00:00.000Z",
  "updatedAt": "2026-07-25T00:00:00.000Z"
}
```

### Partner Record

```json
{
  "id": "partner-id",
  "name": "Partner name",
  "type": "fulfillment",
  "location": "Nairobi",
  "coverageAreas": [],
  "phone": "",
  "whatsapp": "",
  "email": "",
  "categories": [],
  "public": true,
  "notes": ""
}
```

### Analytics Event

```json
{
  "id": "EVT-1780000000000",
  "createdAt": "2026-07-25T00:00:00.000Z",
  "type": "quote_submitted",
  "source": "product",
  "productId": 1,
  "categoryId": "eco-boards",
  "metadata": {}
}
```

## API Design

Public endpoints:

- `GET /api/site`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/resources`
- `GET /api/resources/:slug`
- `GET /api/partners/public`
- `POST /api/leads`
- `POST /api/estimator`
- `POST /api/analytics/events`
- `POST /api/checkout`

Admin endpoints:

- `GET /api/admin/dashboard`
- `GET /api/admin/leads`
- `PUT /api/admin/leads/:id`
- `POST /api/admin/leads/:id/notes`
- `GET /api/admin/resources`
- `POST /api/admin/resources`
- `PUT /api/admin/resources/:id`
- `DELETE /api/admin/resources/:id`
- `GET /api/admin/partners`
- `POST /api/admin/partners`
- `PUT /api/admin/partners/:id`
- `DELETE /api/admin/partners/:id`
- Existing product/category/hero endpoints remain.

## Error Handling

Public forms should:

- Validate required fields before submission.
- Show concise inline errors.
- Preserve form values after failed submission.
- Show clear success states with next action: call, WhatsApp, browse, or checkout.
- Never expose stack traces or server internals.

API handlers should:

- Validate payload shape.
- Normalize optional arrays and strings.
- Return `400` for invalid input.
- Return `401` for invalid admin key.
- Return `404` for missing records.
- Return `500` with a generic message for unexpected failures.

## Accessibility and UX Requirements

- Forms must have real labels.
- Buttons must describe their action.
- Header and mobile navigation must be keyboard accessible.
- Product cards and comparison controls must not rely on color alone.
- Dynamic status messages should be visible near the relevant form.
- Layout must avoid nested cards and must keep operational surfaces dense but readable.
- Mobile catalog filters should be usable without pushing product results too far down the page.
- Text must not overflow buttons or cards at mobile widths.

## Visual Direction

Ramani should feel practical, modern, and trustworthy. The design should stay marketplace-oriented rather than marketing-heavy:

- Use real product/category imagery.
- Keep homepage energetic but still functional.
- Prefer restrained panels, compact controls, and clear product data.
- Avoid a single-hue palette.
- Preserve the Ramani logo and brand recognition.
- Use clear CTAs: browse, estimate, request quote, WhatsApp, add to cart.

## Implementation Phases

### Phase 1: Public Growth Layer

Goal: make the public site behave like a lead-generating marketplace.

Includes:

- Navigation updates.
- Homepage conversion sections.
- Catalog search/filter/sort.
- Product comparison.
- Product-page quote and WhatsApp CTAs.
- Category-aware estimator UI with simple recommendations across all current Ramani categories.
- Resource hub public pages.
- Contact/quote surfaces.
- Client-side analytics event calls where useful.

Storage:

- JSON files for resources, leads, estimator submissions, and analytics events.

### Phase 2: Lead and Quote Operations

Goal: give Ramani staff a real follow-up workflow.

Includes:

- Lead/quote inbox in admin.
- Lead status changes.
- Admin notes.
- WhatsApp-ready message copying.
- Estimator submissions stored as lead records.
- Dashboard cards for lead and quote activity.
- Quote source context on each record.

### Phase 3: Partner and Analytics Layer

Goal: support fulfillment routing and decision visibility.

Includes:

- Partner/fulfillment manager.
- Public locator.
- Analytics dashboard.
- Product interaction summaries.
- Lead conversion status reporting.
- Resource performance summary if events are available.

### Phase 4: Production Hardening

Goal: move from prototype-grade persistence to production-grade operations.

Includes:

- Database migration for products, categories, resources, leads, partners, events, and orders.
- Proper authentication and role-based admin/partner access.
- Persistent media storage such as Vercel Blob, Cloudinary, S3, or Supabase Storage.
- Real CRM integration if selected.
- Real analytics integration if selected.
- AI/live chat integration if selected.
- Backup/export flows.

## Out of Scope for First Implementation Plan

These are intentionally deferred unless explicitly reprioritized:

- Fully accurate engineering/material calculations for any category.
- Category-specific professional design, plumbing, safety, or installation advice beyond clearly labelled estimates and quote guidance.
- Real AI chatbot.
- Real live chat agent console.
- Multi-user authentication.
- Payment reconciliation dashboard.
- Partner login.
- Database migration.
- Persistent production upload storage.
- SMS/email automation.
- Full CRM integration.

The first implementation plan should still create data and API boundaries that make these additions straightforward later.

## Verification Strategy

Each implementation phase should be verified with:

- `npm.cmd run build`.
- Manual browser check of public routes.
- Manual admin workflow check with the configured admin key.
- API checks for new public and admin endpoints.
- Form validation checks for required fields and failure states.
- Mobile viewport review for header, filters, estimator, quote forms, comparison, and admin surfaces.

For Phase 1 and Phase 2, minimum acceptance checks:

- Visitor can find and filter products.
- Visitor can compare products.
- Visitor can submit a quote request.
- Visitor can complete a category-aware estimator flow for at least Eco Boards, glass/crafting or recycling, PPR, interiors, cleaning, furniture, and general custom sourcing, then submit it as a lead.
- Visitor can open WhatsApp from a product or quote context.
- Admin can view and update new leads.
- Existing cart, checkout, product editing, category editing, hero editing, and image upload workflows remain functional.

## Acceptance Criteria

The Ramani adaptation is successful when:

- Every proposal deliverable has a visible Ramani-equivalent feature or an explicit phased implementation path.
- Source-proposal-specific ideas have been translated into Ramani-specific buying workflows and do not appear as irrelevant category tools in the public product experience.
- Eco Boards, glass/crafting or recycling, PPR, interiors, cleaning solutions, furniture, and future categories are supported through flexible product metadata, estimator logic, quote paths, and resource content.
- The public site supports discovery, evaluation, enquiry, estimator, cart, and contact paths.
- Admin users can manage more than storefront content: they can also follow up leads and understand performance.
- The implementation avoids vague placeholders in public UI. Deferred features are framed as future phases in technical docs, not as empty public promises.
- Existing storefront behavior is preserved.
- The system can later migrate to persistent storage without rewriting the public user experience.
