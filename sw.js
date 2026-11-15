// Serves the page from the phone's cache so it opens instantly (and offline),
// then fetches fresh copies in the background for next time.
const CACHE = "shortcuts-v13";
const CORE = ["./", "index.html", "wind-noise.html", "wind-noise.webmanifest", "report.enc.json", "links.enc.json", "manifest.webmanifest", "icons/icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameSite = url.origin === location.origin;
  const fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameSite && !fonts) return;

  // The page asks for links.json?fresh=… after showing the cached copy: go to the network and update the cache.
  if (sameSite && url.searchParams.has("fresh")) {
    url.search = "";
    e.respondWith(
      fetch(url, { cache: "no-cache" }).then(async (res) => {
        if (res.ok) await (await caches.open(CACHE)).put(url.pathname.endsWith("/") ? "./" : url.href, res.clone());
        return res;
      })
    );
    return;
  }

  // Stale-while-revalidate: answer from cache, refresh in the background.
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      // The shortcuts page is cached under "./"; other pages (like the wind noise form) under their own address.
      const home = url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
      const key = req.mode === "navigate" ? (home ? "./" : url.origin + url.pathname) : req;
      const cached = await cache.match(key, { ignoreSearch: true });
      const fresh = fetch(req, { cache: "no-cache" })
        .then((res) => {
          if (res.ok || res.type === "opaque") cache.put(key, res.clone());
          return res;
        })
        .catch(() => cached);
      if (cached) {
        e.waitUntil(fresh);
        return cached;
      }
      return fresh;
    })
  );
});
