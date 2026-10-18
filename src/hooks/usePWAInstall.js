import { useState, useEffect, useCallback } from 'react';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('lynx_pwa_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // 1. Verificar si ya se ejecuta en modo standalone (ya instalada)
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      const isAndroidApp = document.referrer.includes('android-app://');
      const installed = Boolean(isStandaloneMedia || isIOSStandalone || isAndroidApp);
      setIsInstalled(installed);
      return installed;
    };

    const alreadyInstalled = checkStandalone();

    // 2. Detectar si es iOS (iPhone, iPad, iPod)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) || (
      navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
    );
    setIsIOS(isIOSDevice);

    // Si ya está instalada, no mostramos aviso de instalación
    if (alreadyInstalled) {
      setCanInstall(false);
      return;
    }

    // Si es iOS y no está instalada, se puede instalar vía Safari ("Añadir a pantalla de inicio")
    if (isIOSDevice) {
      setCanInstall(true);
    }

    // 3. Escuchar evento nativo de instalación en Chrome, Edge, Android, etc.
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    // 4. Escuchar evento de confirmación de instalación completada
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
      console.log('[LYNX PWA] Aplicación instalada exitosamente en el sistema.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Función para disparar la instalación
  const promptInstall = useCallback(async () => {
    // Caso iOS: Abrir modal con pasos claros de Safari
    if (isIOS) {
      setShowIOSModal(true);
      return { outcome: 'ios_guide' };
    }

    // Caso Android / Chrome / Edge / Navegadores compatibles
    if (!deferredPrompt) {
      return { outcome: 'unavailable' };
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[LYNX PWA] El usuario aceptó la instalación.');
        setIsInstalled(true);
      } else {
        console.log('[LYNX PWA] El usuario canceló la instalación.');
      }
      setDeferredPrompt(null);
      return choiceResult;
    } catch (err) {
      console.error('[LYNX PWA] Error al solicitar instalación:', err);
      return { outcome: 'error', error: err };
    }
  }, [deferredPrompt, isIOS]);

  // Descartar aviso por la sesión actual
  const dismissPrompt = useCallback(() => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('lynx_pwa_dismissed', 'true');
    } catch {
      // Ignorar restricciones de almacenamiento
    }
  }, []);

  return {
    canInstall,
    isInstalled,
    isIOS,
    showIOSModal,
    setShowIOSModal,
    isDismissed,
    promptInstall,
    dismissPrompt
  };
}
