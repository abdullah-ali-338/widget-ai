// Widget AI service worker: app shell caching so the installed app opens fast and works offline (chat itself needs the network).
// Bump VERSION whenever you want clients to drop old cached files.
const VERSION = 'widget-ai-v1';
const SHELL = [
  '/',
  '/manifest.webmanifest',
  '/static/icons/icon-192.png',
  '/static/icons/icon-512.png'
];
const CACHEABLE_HOSTS = [
  self.location.host,
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first for the page, but fall back to cache if the server is slow (cold start) or offline.
function pageRequest(req) {
  return new Promise((resolve) => {
    const timer = setTimeout(async () => {
      const cached = await caches.match('/');
      if (cached) resolve(cached);
    }, 3000);

    fetch(req)
      .then((res) => {
        clearTimeout(timer);
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put('/', copy));
        }
        resolve(res);
      })
      .catch(async () => {
        clearTimeout(timer);
        resolve((await caches.match('/')) || Response.error());
      });
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.pathname === '/chat') return;                 // never cache API calls
  if (!CACHEABLE_HOSTS.includes(url.host)) return;

  if (req.mode === 'navigate') {
    event.respondWith(pageRequest(req));
    return;
  }

  // Everything else: serve cached copy right away, refresh it in the background.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
