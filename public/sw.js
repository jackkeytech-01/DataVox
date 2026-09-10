const CACHE_NAME = "jadata-v1";

const STATIC_ASSETS = [
    "/style_index.css",
    "/script_index.js",
    "/image/datavox_icon.png"
];


// INSTALL
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});


// ACTIVATE
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});


// FETCH
self.addEventListener("fetch", event => {

    // Only handle GET requests
    if (event.request.method !== "GET") {
        return;
    }

    // Don't cache API/dynamic requests
    if (
        event.request.url.includes("/api/") ||
        event.request.url.includes("/login") ||
        event.request.url.includes("/signup") ||
        event.request.url.includes("/logout")
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {

                // Save successful static resources
                if (
                    response.ok &&
                    (
                        event.request.destination === "style" ||
                        event.request.destination === "script" ||
                        event.request.destination === "image"
                    )
                ) {
                    const responseClone = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }

                return response;
            })
            .catch(() => caches.match(event.request))
    );
});