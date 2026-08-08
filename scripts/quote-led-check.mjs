import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const files = [
  'src/components/ProductList.jsx',
  'src/components/ProductPage.jsx',
  'src/pages/Checkout.jsx',
  'src/pages/Categories.jsx',
  'src/pages/CategoryPage.jsx',
  'src/pages/Estimator.jsx',
  'src/pages/Home.jsx',
  'src/components/CompareTray.jsx',
  'src/pages/Admin.jsx',
  'server/data/products.json',
  'server/index.js',
  'public/offline.html',
];

const forbidden = [
  /KES/i,
  /Ksh\s*\d/i,
  /formatKes/,
  /Buy now/i,
  /Add to cart/i,
  /Checkout-ready/i,
  /Local checkout/i,
  /price low to high/i,
  /price high to low/i,
  /Project-ready pricing/i,
  /Indicative price/i,
  /Price/,
  /Subtotal/i,
  /Shipping estimate/i,
  /Total/,
  /payment path/i,
  /\bpricing\b/i,
  /\bcheckout-ready\b/i,
  /\bStripe\b/i,
  /\bstripe\b/i,
  /\bprice\s*:/i,
  /\"price\"\s*:/i,
];

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    assert(!pattern.test(source), `${file} still has quote-blocking price/checkout wording: ${pattern}`);
  }
}

console.log('Ramani quote-led public UI check passed');
