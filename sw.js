"use strict";
const CACHE = "mobile-ui-lab-v12-f1-f4-github-pages-v1-20261112";
const ASSETS = ["./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(names => Promise.all(names.filter(name => name.startsWith("mobile-ui-lab-") && name !== CACHE).map(name => caches.delete(name)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./index.html")));
    return;
  }
  // Only precached, explicitly listed static shell files, never user notes or API data.
  const known = ASSETS.map(asset => new URL(asset, self.registration.scope).pathname);
  if (known.includes(url.pathname)) event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
});
