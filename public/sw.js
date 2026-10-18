/**
 * LYNX Service Worker
 * Provee capacidades offline, caché de app shell y activos estáticos.
 * 
 * SEGURIDAD Y PRIVACIDAD:
 * - NO almacena información personal, datos privados ni credenciales de usuarios.
 * - Solo se cachean recursos públicos estáticos (HTML, JS, CSS, Fuentes, Iconos).
 * - Todas las peticiones que no sean GET o que involucren APIs/datos sensibles se canalizan directo a la red.
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `lynx-shell-${CACHE_VERSION}`;
const CACHE_RUNTIME = `lynx-runtime-${CACHE_VERSION}`;

// Recursos esenciales que forman el App Shell
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png'
];

// Palabras clave de URLs que NUNCA deben ser almacenadas en caché (privacidad / datos de usuario)
const EXCLUDED_PATTERNS = [
  '/api/auth',
  '/api/user',
  '/api/private',
  '/api/payment',
  '/api/token',
  '/login',
  '/logout',
  '/admin'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Intentamos precachear los recursos base; si alguno falla no bloqueamos la instalación completa
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[LYNX SW] No se pudo precachear ${url}:`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activación del Service Worker y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== CACHE_RUNTIME) {
            console.log('[LYNX SW] Eliminando caché obsoleta:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Manejo de peticiones (Fetch)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Descartar esquemas no soportados (ej. extensiones de navegador chrome-extension://)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 2. Solo cachear peticiones GET (nunca POST, PUT, DELETE, etc.)
  if (request.method !== 'GET') {
    return;
  }

  // 3. Exclusión de seguridad y privacidad: Nunca cachear endpoints con datos privados
  const isExcluded = EXCLUDED_PATTERNS.some((pattern) => url.pathname.includes(pattern));
  if (isExcluded) {
    return;
  }

  // 4. Estrategia para Navegación (Páginas HTML): Network-First con Fallback a Caché
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Si no hay red, intentamos devolver index.html de la caché (la app React carga sus datos locales)
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const appShell = await caches.match('/index.html');
          if (appShell) {
            return appShell;
          }
          // Si todo falla, página de contingencia offline
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // 5. Estrategia para Activos Estáticos (JS, CSS, Fuentes, Iconos, Imágenes)
  // Stale-While-Revalidate: Responde velozmente con la copia en caché y actualiza en segundo plano
  const isStaticAsset = (
    url.origin === self.location.origin ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  );

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_RUNTIME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Error de red silencioso para no romper la carga de activos en caché
          });

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Soporte para recibir mensajes desde la aplicación (ej. forzar actualización)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
