const CACHE_NAME = 'ramani-pwa-v1';
const OFFLINE_URL = '/offline.html';
const APP_SHELL = [
  '/',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icons/ramani-icon-180.png',
  '/icons/ramani-icon-192.png',
  '/icons/ramani-icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));

    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }

    await self.clients.claim();
  })());
});

async function networkFirstNavigation(request, preloadResponsePromise) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
      cache.put(request, preloadResponse.clone());
      return preloadResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedPage = await cache.match(request);
    const cachedHome = await cache.match('/');
    return cachedPage || cachedHome || cache.match(OFFLINE_URL);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkResponsePromise;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request, event.preloadResponse));
    return;
  }

  if (sameOrigin && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/images/') || url.pathname.startsWith('/icons/') || url.pathname === '/manifest.webmanifest')) {
    event.respondWith(staleWhileRevalidate(request));
  }
});