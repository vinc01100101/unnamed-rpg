const filesToCache = [
  "/assets/characters/body/fClass.png",
  "/assets/characters/head/head.png",
  "/assets/maps/wip1.png",
];
const staticCacheName = "inGameAssets-v1.1";

for (let i = 1; i <= 5; i++) {
  filesToCache.push("/assets/maps/maptiles" + i + ".png");
}
self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log("Installing service worker");
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(filesToCache).then(() => {
        console.log("Files cached successfully");
      });
    })
  );
});

//delete the outdated/unused cache
self.addEventListener("activate", (event) => {
  // console.log("Claiming control");
  // self.clients.claim();

  console.log("Activating service worker..");

  const cacheWhiteList = [staticCacheName];

  event.waitUntil(
    caches.keys().then((cacheList) => {
      return Promise.all(
        cacheList.map((x) => {
          if (cacheWhiteList.indexOf(x) === -1) {
            return caches.delete(x).then(() => {
              console.log("Unused cache " + x + "successfully deleted");
            });
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // check if request is made by chrome extensions or web page
  // if request is made for web page url must contains http.
  if (!(event.request.url.indexOf("http") === 0)) {
    console.log("not http");
    return;
  } // skip the request. if request is not made with http protocol
  console.log("Fetching: " + event.request.url);

  event.respondWith(
    //check first if the request is cached
    caches.match(event.request).then((cachedFile) => {
      if (cachedFile) {
        console.log("Found: " + cachedFile.url + " in caches");
        return cachedFile;
      }

      //if non found
      console.log(
        "No cache found, request for " + event.request.url + " sent.."
      );
      return fetch(event.request).then((response) => {
        if (!/socket\.io/.test(event.request.url)) {
          return caches.open(staticCacheName).then((cache) => {
            cache.put(event.request.url, response.clone());
            console.log("Response from server successfully cached");
            return response;
          });
        } else {
          console.log("wont cache a socket.io");
          return response;
        }
      });
    })
  );
});
