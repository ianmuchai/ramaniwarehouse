const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

function readJson(name, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));
  } catch (error) {
    return fallback;
  }
}

const profile = {
  name: 'Ramani Warehouse',
  location: 'Old Castle breweries next to Vincentian Retreat Center, Nairobi',
  phone: '+254 793 371994',
  email: 'info@ramaniwarehouse.com',
  metrics: [
    { value: '6+', label: 'Core categories' },
    { value: '24h', label: 'Quote response' },
    { value: 'KES', label: 'Local checkout' }
  ]
};

const posterSpecs = [
  { name: 'Homepage hero carousel', pixels: '1600 x 820', ratio: '80:41', safeArea: 'Keep text-free subject matter inside the center 1280 x 620 area.' },
  { name: 'Category carousel poster', pixels: '1200 x 720', ratio: '5:3', safeArea: 'Keep product/category focus inside the center 980 x 560 area.' },
  { name: 'Product card image', pixels: '900 x 720', ratio: '5:4', safeArea: 'Keep product fully visible inside the center 760 x 600 area.' },
  { name: 'Promo strip banner', pixels: '1600 x 560', ratio: '20:7', safeArea: 'Keep offer copy inside the center 1320 x 420 area.' }
];

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

module.exports = function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/^\/api/, '') || '/';
  const categories = readJson('categories.json', []);
  const products = readJson('products.json', []);
  const heroSlides = readJson('hero-slides.json', []);

  if (req.method === 'GET' && pathname === '/site') return send(res, 200, { profile, heroSlides, categories, products });
  if (req.method === 'GET' && pathname === '/products') return send(res, 200, products);
  if (req.method === 'GET' && pathname.startsWith('/products/')) {
    const id = pathname.split('/').pop();
    const product = products.find((entry) => String(entry.id) === String(id));
    return product ? send(res, 200, product) : send(res, 404, { message: 'Product not found.' });
  }
  if (req.method === 'GET' && pathname === '/categories') return send(res, 200, categories);
  if (req.method === 'GET' && pathname === '/poster-specs') return send(res, 200, posterSpecs);
  if (req.method === 'POST' && pathname === '/checkout') return send(res, 200, { url: null, orderId: `RW-${Date.now()}`, paymentMode: 'demo' });

  if (pathname.startsWith('/admin')) return send(res, 401, { message: 'Admin features require the full root deployment.' });
  return send(res, 404, { message: 'Route not found.' });
};
