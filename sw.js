/* ═══════════════════════════════════════════════════════════════
   WORLD LIVE — Service Worker (network-first)
   ─ GitHub Pages에 올린 최신 파일이 항상 그대로 반영되도록
     '네트워크 우선(network-first)' 으로 동작합니다.
   ─ 오프라인·통신 실패 때만 캐시로 대신하고, 새 버전은
     skipWaiting + clients.claim 으로 즉시 활성화됩니다.
   ─ 외부 스트림(.m3u8/.ts/youtube/kbs 등)은 절대 가로채지 않습니다.
   ═══════════════════════════════════════════════════════════════ */
const VERSION = 'worldlive-pwa-v4';
const RUNTIME = VERSION + '-runtime';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

/* 가로채지 않을 요청 — 라이브 스트림·API·외부 CDN */
const BYPASS_HOSTS = [
  'youtube.com', 'youtube-nocookie.com', 'googlevideo.com', 'ytimg.com',
  'kbs.co.kr', 'kbsWorld', 'akamaized.net', 'cloudfront.net', 'fastly.net',
  'jsdelivr.net', 'cdnjs.cloudflare.com', 'googleapis.com', 'gstatic.com',
  'cloudflare.com', 'workers.dev'
];
const BYPASS_EXT = /\.(m3u8|m3u|ts|mpd|mp4|m4s|key|aac|webm)(\?|$)/i;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // 개별 add — 일부 파일이 실패해도 설치 자체가 막히지 않게
    await Promise.all(SHELL.map(url =>
      cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
    ));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION && k !== RUNTIME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function bypass(url, request) {
  if (url.origin !== self.location.origin) return true;
  if (BYPASS_EXT.test(url.pathname)) return true;
  if (BYPASS_HOSTS.some(h => url.hostname.includes(h))) return true;
  if (url.pathname.includes('/apk/')) return true;          // APK 파일은 그대로 내려받기
  if (request.headers.has('range')) return true;            // 미디어 부분 요청
  return false;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (bypass(url, request)) return;                          // 브라우저에 그대로 맡김

  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME);
    try {
      // 네트워크 우선 — HTTP 캐시를 쓰지 않고 서버에 재검증(ETag 304)을 요청
      const response = await fetch(request, request.mode === 'navigate'
        ? { cache: 'no-cache' }
        : { cache: 'no-cache' });
      if (response && response.ok && response.type === 'basic') {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (err) {
      // 오프라인/통신 실패 → 캐시, 화면 이동이면 앱 셸
      const cached = await cache.match(request) || await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const shell = await caches.match('./index.html') || await caches.match('./');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
