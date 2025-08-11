const CACHE='vive-pwa-v1';
const CORE=[
  './','./index.html','./app.jsx','./manifest.webmanifest',
  './icons/icon-192.png','./icons/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // network-first for dynamic, cache-first for CORE
  if(CORE.some(x=>e.request.url.includes(x.replace('./','')))){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
    return;
  }
  e.respondWith(fetch(e.request).then(res=>{
    const copy=res.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy));
    return res;
  }).catch(()=>caches.match(e.request)));
});
