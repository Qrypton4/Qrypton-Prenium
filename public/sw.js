// public/sw.js
// Service worker volontairement simple et prudent :
// - Les pages (HTML) passent TOUJOURS par le réseau en priorité, pour ne jamais
//   servir de contenu périmé à un visiteur ou à Googlebot (SEO préservé).
// - Seuls les fichiers statiques (images, icônes, polices, CSS/JS générés par
//   Next.js) sont mis en cache, pour accélérer les visites répétées.
// - Les appels API (/api/...) ne sont jamais interceptés ni mis en cache.

const CACHE_NAME = "qrypton-static-v1";
const STATIC_CACHE_PATTERNS = [
  /^\/icons\//,
  /^\/assets\//,
  /^\/_next\/static\//,
  /\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/,
];

function isStaticAsset(url) {
  return STATIC_CACHE_PATTERNS.some((re) => re.test(url.pathname));
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/") || event.request.method !== "GET") {
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then(
          (cached) =>
            cached ||
            fetch(event.request).then((response) => {
              if (response.ok) cache.put(event.request, response.clone());
              return response;
            })
        )
      )
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
