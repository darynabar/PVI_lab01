const CACHE_NAME = 'students-cache-v1';
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

// Етап встановлення: зберігаємо файли в кеш
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Етап перехоплення запитів: віддаємо з кешу, якщо немає інтернету
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Якщо файл є в кеші - віддаємо його, якщо ні - йдемо в інтернет
        return response || fetch(event.request);
      })
  );
});