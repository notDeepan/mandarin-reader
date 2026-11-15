importScripts('js/packs.js', 'js/core.js');

const CACHE_NAME = 'reader-v6';
const CORE_FILES = [
  './',
  'index.html',
  'manifest.json',
  'css/app.css',
  'js/strings.js',
  'js/packs.js',
  'js/core.js',
  'js/app.js'
];

self.addEventListener('install', e => {
  const list = Core.precacheList(PACKS, CORE_FILES);
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(list.required)
        .then(() => Promise.all(list.optional.map(url => cache.add(url).catch(() => {})))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// A redirected response can't answer a navigation, so rebuild it as a plain one.
const unredirect = r => (r && r.redirected
  ? r.blob().then(body => new Response(body, { status: r.status, statusText: r.statusText, headers: r.headers }))
  : r);

const offlinePage = () => caches.match('./').then(r => r || caches.match('index.html')).then(unredirect);

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return unredirect(cached);
      return fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    }).catch(() => (e.request.mode === 'navigate' ? offlinePage() : Response.error()))
  );
});
