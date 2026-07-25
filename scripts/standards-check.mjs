import { readFileSync } from 'node:fs';

const checks = [
  {
    file: 'src/App.jsx',
    patterns: ['className="skip-link"', 'id="main-content"']
  },
  {
    file: 'src/components/Header.jsx',
    patterns: ['useLocation', 'aria-expanded={menuOpen}', 'aria-controls="primary-navigation"', 'autoComplete="current-password"']
  },
  {
    file: 'src/pages/Home.jsx',
    patterns: ['setResources((res.data?.resources || []).slice(0, 3))']
  },
  {
    file: 'src/components/QuoteForm.jsx',
    patterns: ['autoComplete="name"', 'type="tel"', 'autoComplete="tel"', 'role="status"', 'aria-live="polite"']
  },
  {
    file: 'src/pages/Estimator.jsx',
    patterns: ['autoComplete="name"', 'type="tel"', 'autoComplete="tel"', 'role="status"', 'aria-live="polite"']
  },
  {
    file: 'src/pages/Checkout.jsx',
    patterns: ['Guest checkout', 'autoComplete="name"', 'autoComplete="email"', 'type="tel"', 'autoComplete="tel"', 'checkout-assurance', 'role="status"']
  },
  {
    file: 'src/components/ProductPage.jsx',
    patterns: ['buyingModeLabel', 'buying-mode-pill', 'id="product-quote"', 'Request consult']
  },
  {
    file: 'src/components/ProductList.jsx',
    patterns: ['buying-mode-chip', 'Request consult', 'decoding="async"']
  },
  {
    file: 'src/pages/Categories.jsx',
    patterns: ['catalog-result-bar', 'clearFilters', 'visually-hidden']
  },
  {
    file: 'src/pages/CategoryPage.jsx',
    patterns: ['catalog-result-bar', 'clearFilters', 'visually-hidden']
  },
  {
    file: 'src/index.css',
    patterns: ['.skip-link', '.menu-toggle', '.nav.is-open', ':focus-visible', '@media (prefers-reduced-motion: reduce)', '.catalog-result-bar', '.checkout-assurance', '.buying-mode-pill']
  }
];

const failures = [];

for (const check of checks) {
  const source = readFileSync(check.file, 'utf8');
  for (const pattern of check.patterns) {
    if (!source.includes(pattern)) {
      failures.push(`${check.file} is missing ${pattern}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Standards check passed (${checks.length} files).`);
