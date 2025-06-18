const CACHE_NAME = 'stock-viewer-v1';
const assetsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// Install event: cache the application shell
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching app shell');
                return cache.addAll(assetsToCache);
            })
    );
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', event => {
    // We only want to cache GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response from cache
                if (response) {
                    return response;
                }

                // Not in cache - go to network
                return fetch(event.request);
            }
        )
    );
});