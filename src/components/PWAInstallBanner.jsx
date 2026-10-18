import React from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { LynxLogo } from './LynxLogo';

export const PWAInstallBanner = ({
  canInstall,
  isInstalled,
  isDismissed,
  onInstall,
  onDismiss
}) => {
  if (!canInstall || isInstalled || isDismissed) {
    return null;
  }

  return (
    <aside 
      aria-label="Aviso de instalación de LYNX"
      className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-40 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-purple-100 animate-in fade-in slide-in-from-bottom-3 duration-300 transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Isotipo */}
        <div className="p-2.5 rounded-xl bg-purple-50 shrink-0 border border-purple-100 flex items-center justify-center">
          <LynxLogo size="sm" showText={false} />
        </div>

        {/* Textos */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-black text-slate-900 tracking-tight">
              Instalar LYNX
            </h4>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-brand-700">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
            Instalá la app para acceder con un toque, a pantalla completa y con soporte sin conexión.
          </p>

          {/* Acciones */}
          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={onInstall}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-sm shadow-brand-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Instalar ahora</span>
            </button>

            <button
              onClick={onDismiss}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>

        {/* Botón X */}
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-purple-50 transition-colors shrink-0"
          title="Cerrar aviso"
          aria-label="Cerrar aviso de instalación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
