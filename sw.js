/* sw.js atualizado */
const CACHE_NAME = 'project-x-v1';

// O segredo é usar caminhos relativos com './'
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './components.js',
  './save-system.js',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
