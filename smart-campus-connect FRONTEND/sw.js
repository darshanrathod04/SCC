const CACHE_NAME = 'scc-mainframe-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/views/shared/index.html',     // Login Page
  '/views/student/main.html',     // <--- SAHI PATH: views/student/
  '/views/shared/internships.html', 
  '/views/shared/events.html',
  '/css/style.css', 
  '/js/main.js',
  '/images/logo.png',
  '/manifest.json'
];

// 1. Install Event: Saari files ko memory mein save karna
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SCC: Nexus Assets Secured');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Naye sw ko turant activate karne ke liye
});

// 2. Activate Event: Purana cache saaf karna
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
});

// 3. Fetch Event: Smart Navigation & Offline Support
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Agar cache mein file mil gayi toh wahi dikhao
      if (response) return response;

      // Agar cache mein nahi hai toh internet se mangwao
      return fetch(event.request).catch(() => {
        // AGAR OFFLINE HAI aur page nahi mil raha, toh default home dikhao
        if (event.request.mode === 'navigate') {
          return caches.match('/views/shared/index.html');
        }
      });
    })
  );
});