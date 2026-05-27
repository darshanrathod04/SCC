const CACHE_NAME = 'scc-mainframe-v4';

const ASSETS_TO_CACHE = [
  '/',
  '/views/shared/index.html',
  '/views/student/main.html',
  '/views/shared/internships.html',
  '/views/shared/events.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo.png',
  '/manifest.json'
];

// INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SCC: Nexus Assets Secured');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SCC: Clearing Old Data');
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {

      // Cache hit
      if (cachedResponse) {
        return cachedResponse;
      }

      // Network request
      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {

          // Offline page fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/views/shared/index.html');
          }

          // IMPORTANT: Always return valid response
          return new Response(JSON.stringify({
            error: 'Offline'
          }), {
            status: 503,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        });
    })
  );
});