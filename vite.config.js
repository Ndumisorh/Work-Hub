import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function offlineCachePlugin() {
  return {
    name: 'work-hub-offline-cache',
    apply: 'build',
    generateBundle(_options, bundle) {
      const emittedAssets = Object.keys(bundle)
        .filter((fileName) => fileName !== 'sw.js' && !fileName.endsWith('.map'))
        .map((fileName) => `./${fileName}`)
      const precacheAssets = [...new Set(['./', './index.html', './manifest.webmanifest', './work-hub-icon.svg', ...emittedAssets])]

      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: `
const CACHE_NAME = 'work-hub-offline-v1';
const APP_SHELL = new URL('./index.html', self.registration.scope).href;
const PRECACHE_URLS = ${JSON.stringify(precacheAssets)}.map((path) => new URL(path, self.registration.scope).href);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter((name) => name.startsWith('work-hub-offline-') && name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => (await caches.match(APP_SHELL)) || Response.error()));
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      return await fetch(request);
    } catch {
      return Response.error();
    }
  })());
});
`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), offlineCachePlugin()],
})
