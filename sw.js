/* PROJECT-X SERVICE WORKER - V3 */
const CACHE_NAME = 'px-alpha-cache';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalação e Cache
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Project-X: Armazenando arquivos vitais');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de lixo
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// Resposta Offline/Online (Obrigatório para Android/PC)
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.match(evt.request);
    })
  );
});
