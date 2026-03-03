const CACHE_NAME = 'px-v2';
const ASSETS = [
  './',
  './index.html',
  './components.js',
  './save-system.js',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// Instala e guarda os ficheiros essenciais
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Ativa e limpa caches velhos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
});

// EVENTO FETCH: Sem isto, o Chrome NÃO permite instalar como App
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
