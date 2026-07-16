const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let sharp = null;
try {
  sharp = require('sharp');
} catch (error) {
  sharp = null;
}

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
const publicDir = path.join(__dirname, 'public');
const imageDir = path.join(publicDir, 'images');
const dataDir = path.join(__dirname, 'data');
const catalogPath = path.join(dataDir, 'products.json');
const heroPath = path.join(dataDir, 'hero-slides.json');
const categoriesPath = path.join(dataDir, 'categories.json');
const adminKey = process.env.ADMIN_KEY || 'ramani-admin';

fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(publicDir));

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const defaultCategories = [
  { id: 'eco-boards', name: 'Eco Board', tagline: 'Sustainable panels for partitions, fit-outs, and interiors.', image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80', color: '#f97316' },
  { id: 'hdpe-plastics', name: 'HDPE Plastics', tagline: 'Reliable recycled plastic inputs for manufacturing and packaging.', image: 'https://images.unsplash.com/photo-1581093458791-9d5a6f8f580b?auto=format&fit=crop&w=1400&q=80', color: '#0ea5e9' },
  { id: 'glass-recycling', name: 'Glass Recycling', tagline: 'Sorted glass supply for reuse, construction, and industrial projects.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80', color: '#14b8a6' },
  { id: 'ppr-pipes-fittings', name: 'PPR Pipes & Fittings', tagline: 'Durable plumbing systems for commercial and residential builds.', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80', color: '#2563eb' },
  { id: 'interior-design', name: 'Interior Design', tagline: 'Curated finishes and fit-out packages for modern spaces.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80', color: '#a855f7' },
  { id: 'cleaning-solutions', name: 'Detergent & Grease', tagline: 'Industrial cleaning products for hygiene-heavy environments.', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1400&q=80', color: '#22c55e' },
  { id: 'furniture', name: 'Furniture', tagline: 'Ready-made and custom furniture for homes, offices, hospitality, and commercial spaces.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80', color: '#8b5cf6' }];

function loadCategories() {
  try {
    if (!fs.existsSync(categoriesPath)) return defaultCategories;
    const parsed = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    return Array.isArray(parsed) && parsed.length ? parsed : defaultCategories;
  } catch (error) {
    console.error('Could not load categories:', error.message);
    return defaultCategories;
  }
}

function saveCategories() {
  fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));
}

let categories = loadCategories();

const defaultProducts = [
  { id: 1, sku: 'RW-ECO-018', name: 'Eco Board', price: 18500, description: 'Recycled composite panels built for modern interior walls, partitions, ceiling accents, and commercial fit-outs.', category: 'Eco Board', categoryId: 'eco-boards', image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', rating: 4.8, leadTime: '2-4 days', stock: 'In stock', badge: 'Best seller', specs: ['Moisture resistant', 'Easy to cut', 'Low waste installation'], gallery: ['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'] },
  { id: 2, sku: 'RW-HDP-032', name: 'HDPE Plastic Granules', price: 32000, description: 'Premium recycled HDPE material prepared for manufacturing, packaging, moulding, and industrial production runs.', category: 'HDPE Plastics', categoryId: 'hdpe-plastics', image: 'https://images.unsplash.com/photo-1581093458791-9d5a6f8f580b?auto=format&fit=crop&w=1200&q=80', rating: 4.7, leadTime: '1-3 days', stock: 'Bulk ready', badge: 'Bulk supply', specs: ['Washed material', 'Manufacturing grade', 'Consistent batches'], gallery: ['https://images.unsplash.com/photo-1581093458791-9d5a6f8f580b?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80'] },
  { id: 3, sku: 'RW-GLS-009', name: 'Sorted Glass Recycling Supply', price: 9800, description: 'Sorted recycled glass for construction mixes, decor, reuse pipelines, and sustainable industrial applications.', category: 'Glass Recycling', categoryId: 'glass-recycling', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80', rating: 4.6, leadTime: '3-5 days', stock: 'Available', badge: 'Eco choice', specs: ['Sorted batches', 'Project quantities', 'Reuse ready'], gallery: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=1200&q=80'] },
  { id: 4, sku: 'RW-PPR-145', name: 'PPR Pipes & Fittings Kit', price: 14500, description: 'Durable plumbing kit for water systems, commercial installations, maintenance crews, and project contractors.', category: 'PPR Pipes & Fittings', categoryId: 'ppr-pipes-fittings', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', rating: 4.9, leadTime: 'Same week', stock: 'Fast moving', badge: 'Contractor pick', specs: ['Heat resistant', 'Low leakage fittings', 'Commercial grade'], gallery: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80'] },
  { id: 5, sku: 'RW-INT-072', name: 'Commercial Interior Package', price: 72000, description: 'A curated fit-out package for offices, retail spaces, hospitality interiors, display walls, and customer-facing spaces.', category: 'Interior Design', categoryId: 'interior-design', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', rating: 4.8, leadTime: 'Consult first', stock: 'Custom order', badge: 'Premium', specs: ['Material selection', 'Space planning', 'Finish schedule'], gallery: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80'] },
  { id: 6, sku: 'RW-CLN-065', name: 'Industrial Detergent & Grease Solution', price: 6500, description: 'Cleaning products for workshops, warehouses, hospitality backrooms, food handling zones, and hygiene-heavy environments.', category: 'Detergent & Grease', categoryId: 'cleaning-solutions', image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1200&q=80', rating: 4.5, leadTime: '1-2 days', stock: 'In stock', badge: 'Operations essential', specs: ['Heavy-duty clean', 'Bulk packs', 'Facility friendly'], gallery: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80'] }
];


function loadProducts() {
  try {
    if (!fs.existsSync(catalogPath)) return defaultProducts;
    const parsed = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    return Array.isArray(parsed) && parsed.length ? parsed : defaultProducts;
  } catch (error) {
    console.error('Could not load product catalog:', error.message);
    return defaultProducts;
  }
}

function saveProducts() {
  fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2));
}

let products = loadProducts();
const defaultHeroSlides = [
  { id: 'contractor-marketplace', eyebrow: 'Modern sourcing marketplace', title: 'Shop project materials with warehouse-level confidence.', text: 'Eco Board, PPR fittings, recycled materials, cleaning supplies, and interior packages curated for serious projects.', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=80', cta: 'Shop categories', href: '/categories' },
  { id: 'sustainable-supply', eyebrow: 'Sustainable supply chain', title: 'Industrial materials that look good and work hard.', text: 'Find products that support cleaner builds, practical timelines, and procurement teams that need speed.', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=80', cta: 'Explore products', href: '/categories' },
  { id: 'fitout-ready', eyebrow: 'Fit-out and operations', title: 'From shell to showroom, source it in one place.', text: 'Materials, finishes, pipes, and maintenance essentials for contractors, retailers, hotels, and offices.', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80', cta: 'Build a cart', href: '/checkout' }
];
function loadHeroSlides() {
  try {
    if (!fs.existsSync(heroPath)) return defaultHeroSlides;
    const parsed = JSON.parse(fs.readFileSync(heroPath, 'utf8'));
    return Array.isArray(parsed) && parsed.length ? parsed : defaultHeroSlides;
  } catch (error) {
    console.error('Could not load hero slides:', error.message);
    return defaultHeroSlides;
  }
}

function saveHeroSlides() {
  fs.writeFileSync(heroPath, JSON.stringify(heroSlides, null, 2));
}

let heroSlides = loadHeroSlides();
const posterSpecs = [
  { name: 'Homepage hero carousel', pixels: '1600 x 820', ratio: '80:41', safeArea: 'Keep text-free subject matter inside the center 1280 x 620 area.' },
  { name: 'Category carousel poster', pixels: '1200 x 720', ratio: '5:3', safeArea: 'Keep product/category focus inside the center 980 x 560 area.' },
  { name: 'Product card image', pixels: '900 x 720', ratio: '5:4', safeArea: 'Keep product fully visible inside the center 760 x 600 area.' },
  { name: 'Promo strip banner', pixels: '1600 x 560', ratio: '20:7', safeArea: 'Keep offer copy inside the center 1320 x 420 area.' }
];

const siteProfile = {
  name: 'Ramani Warehouse',
  location: 'Old Castle breweries next to Vincentian Retreat Center, Nairobi',
  phone: '+254 793 371994',
  email: 'info@ramaniwarehouse.com',
  metrics: [
    { value: '7+', label: 'Core categories' },
    { value: '24h', label: 'Quote response' },
    { value: 'KES', label: 'Local checkout' }
  ]
};

const browserSafeImageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg', '.bmp']);
const acceptedImageExtensions = new Set([...browserSafeImageExtensions, '.tif', '.tiff', '.heic', '.heif', '.jfif', '.pjpeg', '.pjp']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) => {
    const parsed = path.parse(file.originalname || 'upload');
    const ext = String(parsed.ext || '').toLowerCase();
    const base = String(parsed.name || 'image').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '') || 'image';
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

function isAcceptedImage(file) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  return acceptedImageExtensions.has(ext) || String(file.mimetype || '').startsWith('image/');
}

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (isAcceptedImage(file)) return cb(null, true);
    return cb(new Error('Upload an image file: JPG, PNG, WebP, GIF, AVIF, SVG, BMP, TIFF, HEIC, or HEIF.'));
  }
});

async function imageUrlFromFile(file) {
  const originalPath = file.path;
  const ext = path.extname(file.originalname || file.filename || '').toLowerCase();
  if (!sharp || browserSafeImageExtensions.has(ext)) return `/images/${file.filename}`;

  const outputName = `${path.basename(file.filename, path.extname(file.filename))}.webp`;
  const outputPath = path.join(imageDir, outputName);
  try {
    await sharp(originalPath).rotate().webp({ quality: 84 }).toFile(outputPath);
    fs.unlink(originalPath, () => {});
    return `/images/${outputName}`;
  } catch (error) {
    console.error('Image conversion failed, keeping original upload:', error.message);
    return `/images/${file.filename}`;
  }
}

function nextProductId() {
  return products.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0) + 1;
}

function normalizeSpecs(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
}


function normalizeCategory(payload, existing = {}) {
  const name = String(payload.name || existing.name || '').trim();
  const image = String(payload.image || existing.image || '').trim();

  if (!name) return { error: 'Collection name is required.' };
  if (!image) return { error: 'Collection image URL is required.' };

  return {
    ...existing,
    id: String(existing.id || payload.id || slugify(name)),
    name,
    tagline: String(payload.tagline || existing.tagline || '').trim(),
    image,
    color: String(payload.color || existing.color || '#f97316').trim()
  };
}
function normalizeProduct(payload, existing = {}) {
  const categoryName = String(payload.category || existing.category || '').trim();
  const category = categories.find((entry) => entry.name === categoryName || entry.id === payload.categoryId);
  const image = String(payload.image || existing.image || '').trim();
  const name = String(payload.name || existing.name || '').trim();
  const price = Number(payload.price ?? existing.price ?? 0);

  if (!name) return { error: 'Product name is required.' };
  if (!categoryName) return { error: 'Product category is required.' };
  if (!Number.isFinite(price) || price < 0) return { error: 'A valid product price is required.' };

  return {
    ...existing,
    sku: String(payload.sku || existing.sku || `RW-${Date.now()}`).trim(),
    name,
    price,
    description: String(payload.description || existing.description || '').trim(),
    category: category?.name || categoryName,
    categoryId: category?.id || slugify(categoryName),
    image,
    rating: Number(payload.rating ?? existing.rating ?? 4.6),
    leadTime: String(payload.leadTime || existing.leadTime || 'Confirm on order').trim(),
    stock: String(payload.stock || existing.stock || 'Available').trim(),
    badge: String(payload.badge || existing.badge || 'New').trim(),
    specs: normalizeSpecs(payload.specs ?? existing.specs),
    gallery: normalizeSpecs(payload.gallery ?? existing.gallery).length ? normalizeSpecs(payload.gallery ?? existing.gallery) : image ? [image] : []
  };
}


function normalizeHeroSlide(payload, existing = {}) {
  const title = String(payload.title || existing.title || '').trim();
  const image = String(payload.image || existing.image || '').trim();

  if (!title) return { error: 'Hero title is required.' };
  if (!image) return { error: 'Hero image URL is required.' };

  return {
    ...existing,
    id: String(existing.id || payload.id || slugify(title) || `slide-${Date.now()}`),
    eyebrow: String(payload.eyebrow || existing.eyebrow || '').trim(),
    title,
    text: String(payload.text || existing.text || '').trim(),
    image,
    cta: String(payload.cta || existing.cta || 'Shop now').trim(),
    href: String(payload.href || existing.href || '/categories').trim()
  };
}
function sitePayload() {
  return { profile: siteProfile, heroSlides, categories, products };
}

function requireAdmin(req, res, next) {
  const key = req.get('x-admin-key');
  if (key !== adminKey) return res.status(401).json({ message: 'Admin access required.' });
  return next();
}

app.get('/api/site', (req, res) => res.json(sitePayload()));
app.get('/api/products', (req, res) => res.json(products));
app.get('/api/products/:id', (req, res) => {
  const product = products.find((entry) => String(entry.id) === String(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json(product);
});
app.get('/api/categories', (req, res) => res.json(categories));
app.get('/api/poster-specs', (req, res) => res.json(posterSpecs));
app.use('/api/admin', requireAdmin);
app.get('/api/admin/poster-specs', (req, res) => res.json(posterSpecs));
app.get('/api/admin/hero-slides', (req, res) => res.json(heroSlides));

app.put('/api/admin/hero-slides/:id', (req, res) => {
  const index = heroSlides.findIndex((entry) => String(entry.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Hero slide not found.' });
  const normalized = normalizeHeroSlide(req.body, heroSlides[index]);
  if (normalized.error) return res.status(400).json({ message: normalized.error });
  heroSlides[index] = normalized;
  saveHeroSlides();
  return res.json({ success: true, slide: heroSlides[index], heroSlides });
});

app.post('/api/admin/hero-slides/:id/image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const slide = heroSlides.find((entry) => String(entry.id) === String(req.params.id));
  if (!slide) return res.status(404).json({ message: 'Hero slide not found.' });
  const imageUrl = await imageUrlFromFile(req.file);
  slide.image = imageUrl;
  saveHeroSlides();
  return res.json({ success: true, imageUrl, slide, heroSlides });
});

app.get('/api/admin/categories', (req, res) => res.json(categories));

app.put('/api/admin/categories/:id', (req, res) => {
  const index = categories.findIndex((entry) => String(entry.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Featured collection not found.' });
  const normalized = normalizeCategory(req.body, categories[index]);
  if (normalized.error) return res.status(400).json({ message: normalized.error });
  categories[index] = normalized;
  saveCategories();
  return res.json({ success: true, category: categories[index], categories });
});

app.post('/api/admin/categories/:id/image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const category = categories.find((entry) => String(entry.id) === String(req.params.id));
  if (!category) return res.status(404).json({ message: 'Featured collection not found.' });
  const imageUrl = await imageUrlFromFile(req.file);
  category.image = imageUrl;
  saveCategories();
  return res.json({ success: true, imageUrl, category, categories });
});

app.get('/api/admin/products', (req, res) => res.json(products));

app.post('/api/admin/products', (req, res) => {
  const normalized = normalizeProduct(req.body);
  if (normalized.error) return res.status(400).json({ message: normalized.error });
  const product = { id: nextProductId(), ...normalized };
  products = [product, ...products];
  saveProducts();
  return res.status(201).json({ success: true, product, products });
});

app.put('/api/admin/products/:id', (req, res) => {
  const index = products.findIndex((entry) => String(entry.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found.' });
  const normalized = normalizeProduct(req.body, products[index]);
  if (normalized.error) return res.status(400).json({ message: normalized.error });
  products[index] = { ...normalized, id: products[index].id };
  saveProducts();
  return res.json({ success: true, product: products[index], products });
});

app.delete('/api/admin/products/:id', (req, res) => {
  const exists = products.some((entry) => String(entry.id) === String(req.params.id));
  if (!exists) return res.status(404).json({ message: 'Product not found.' });
  products = products.filter((entry) => String(entry.id) !== String(req.params.id));
  saveProducts();
  return res.json({ success: true, products });
});

app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: await imageUrlFromFile(req.file) });
});

app.post('/api/admin/products/:id/image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const product = products.find((entry) => String(entry.id) === String(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  const imageUrl = await imageUrlFromFile(req.file);
  product.image = imageUrl;
  product.gallery = [imageUrl, ...(product.gallery || []).filter((image) => image !== imageUrl)].slice(0, 4);
  saveProducts();
  return res.json({ success: true, imageUrl, product, products });
});

app.post('/api/admin/products/:id/gallery/:index/image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const product = products.find((entry) => String(entry.id) === String(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  const imageUrl = await imageUrlFromFile(req.file);
  const index = Math.max(0, Number(req.params.index) || 0);
  const gallery = Array.isArray(product.gallery) ? [...product.gallery] : [];
  gallery[index] = imageUrl;
  product.gallery = gallery.filter(Boolean).slice(0, 6);
  if (index === 0 || !product.image) product.image = imageUrl;
  saveProducts();
  return res.json({ success: true, imageUrl, product, products });
});

app.post('/api/checkout', async (req, res) => {
  const { cart = [], customer = {} } = req.body;
  if (!cart.length) return res.status(400).json({ message: 'Cart is empty.' });
  if (!customer.name || !customer.email || !customer.address) return res.status(400).json({ message: 'Name, email, and delivery address are required.' });

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey) {
    try {
      const stripe = new Stripe(stripeSecretKey);
      const lineItems = cart.map((item) => ({
        price_data: { currency: 'kes', product_data: { name: item.name }, unit_amount: item.price },
        quantity: item.quantity
      }));
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: customer.email,
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?checkout=success`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?checkout=cancel`,
        line_items: lineItems,
        metadata: { customerName: customer.name || '', customerPhone: customer.phone || '', customerAddress: customer.address || '' }
      });
      return res.json({ url: session.url, orderId: session.id, paymentMode: 'stripe' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Stripe checkout could not be initialized.' });
    }
  }

  return res.json({ url: null, orderId: `RW-${Date.now()}`, paymentMode: 'demo' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Ramani Warehouse backend listening on port ${port}`);
  });
}

module.exports = app;
