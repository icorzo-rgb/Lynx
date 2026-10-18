/**
 * Registro seguro y compatible del Service Worker de LYNX.
 * Cumple con los estándares PWA de navegación segura (HTTPS o localhost).
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

    const isHttps = window.location.protocol === 'https:';

    // PWA solo es permitida en HTTPS o localhost para entornos de desarrollo y pruebas
    if (!isHttps && !isLocalhost) {
      console.warn('[LYNX PWA] El Service Worker requiere HTTPS para operar en producción.');
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          // Escuchar nuevas versiones del service worker
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Contenido nuevo disponible
                  console.log('[LYNX PWA] Nueva versión disponible. Se aplicará al reiniciar la aplicación.');
                } else {
                  // Contenido cacheado para uso offline
                  console.log('[LYNX PWA] Aplicación lista para funcionar sin conexión.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('[LYNX PWA] Error al registrar Service Worker:', error);
        });
    });
  }
}
