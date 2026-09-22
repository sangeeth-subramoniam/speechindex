/* Speech Cards service worker — cache-first so the app works with no internet.
 *
 * TO RELEASE A CHANGE: bump CACHE_VERSION below, commit, push.
 * The phone picks up the new version the next time it is opened while online.
 */
var CACHE_VERSION = "speech-cards-v2";

var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./cards.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // { cache: "reload" } is essential: it bypasses the browser's own HTTP cache.
      // Without it a new release re-caches the OLD files and the change never appears.
      return Promise.all(ASSETS.map(function (url) {
        return fetch(new Request(url, { cache: "reload" })).then(function (res) {
          if (!res || !res.ok) { throw new Error("precache failed: " + url); }
          return cache.put(url, res);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        return key === CACHE_VERSION ? null : caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") { return; }

  // Always read from THIS version's cache only. The global caches.match() would
  // search every cache, including one left over from the previous release.
  event.respondWith(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) { return hit; }
        return fetch(req).then(function (res) {
          if (res && res.ok && res.type === "basic") {
            cache.put(req, res.clone());
          }
          return res;
        }).catch(function () {
          // offline and not cached: for a page request, hand back the app shell
          if (req.mode === "navigate") { return cache.match("./index.html"); }
          return Response.error();
        });
      });
    })
  );
});
