const CACHE_NAME = 'qualitystock-v3'; // Incremented version for update

// Note: We only need to cache index.html here, since CSS and JS are inside it.
const urlsToCache = [
  '/',
  'index.html',
  'https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css'
];

// Install Event: Cache the app shell.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Event: Clean up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event: Serve from cache first, then fall back to network.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response; // Serve from cache
        return fetch(event.request); // Fallback to network
      })
  );
});