const CACHE_NAME = 'projectx-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/components.js',
  '/save-system.js',
  '/icon.png'
];

// Instalação do Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Resposta com Cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
