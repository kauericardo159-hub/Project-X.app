/* ==========================================================================
      PROJECT-X | SERVICE WORKER (ENGINE)
========================================================================== */

const CACHE_NAME = 'project-x-v1';

// Arquivos para funcionar offline (opcional, mas ajuda na velocidade)
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './components.js',
  './save-system.js',
  './icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// O evento FETCH é obrigatório para o Chrome mostrar o botão de instalar
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
