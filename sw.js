/* ห้องเรียนครูปลื้ม — Service Worker
   หน้าเว็บ: ดึงจากเน็ตก่อนเสมอ (ได้เวอร์ชันล่าสุด) ถ้าออฟไลน์ใช้สำเนาล่าสุดแทน
   ข้อมูลจาก Supabase ไม่เก็บแคช (ต้องสดเสมอ) */
const CACHE = 'crp-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;   // Supabase / CDN ผ่านตรง
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)).catch(() => {}); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('./index.html'))));
});
