const CACHE_NAME = 'students-cache-v4';
const urlsToCache = [
  '/',
  '/index.html',
  './css/style.css',   
    '/script.js',
    './Students.html',
    './Tasks.html',
  './image/avatar.jpg',
  './Messages.html',
  './manifest.json',
  './css/icon-192.png',
  './css/icon-512.png'  
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                          .map(name => caches.delete(name))
            );
        })
    );
});