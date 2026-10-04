const CACHE_NAME = "zh-werewolf-static-v2";
const APP_SHELL = [
  "/game/",
  "/game/static/index.html",
  "/game/static/style.css?v=sequential-opening-v1",
  "/game/static/boot-scene.js?v=sequential-v1",
  "/game/static/castle-lobby.css?v=invite-20260915",
  "/game/static/images/castle-lobby-v1.png",
  "/game/static/network-quality.js?v=realtime-v2-integer",
  "/game/static/app.js?v=realtime-network-v3-steady",
  "/game/static/manifest.webmanifest",
  "/game/static/images/battle-night.svg",
  "/game/static/images/boot-cast.png?v=004a8b537060ca11-direct-v2",
  "/game/static/images/boot-hall-v1.png",
  "/game/static/images/werewolf_bg.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("zh-werewolf-static-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith("/game/") || url.pathname.startsWith("/game/api/")) {
    return;
  }
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/game/"))),
  );
});
