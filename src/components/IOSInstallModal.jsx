import React from 'react';
import { X, Share2, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { LynxLogo } from './LynxLogo';

export const IOSInstallModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-purple-100 p-6">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-purple-50 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabecera con Logo */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-purple-50 mb-3 border border-purple-100">
            <LynxLogo size="md" showText={false} />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Instalar LYNX en iPhone / iPad
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Safari permite añadir LYNX como una aplicación nativa en tu pantalla de inicio en 2 simples pasos:
          </p>
        </div>

        {/* Pasos */}
        <div className="space-y-3.5 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
              1
            </div>
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">Tocá el botón Compartir</span>
              En la barra inferior de Safari, tocá el ícono de compartir (<Share2 className="w-3.5 h-3.5 inline text-brand-700 mx-0.5" />).
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
              2
            </div>
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">«Añadir a pantalla de inicio»</span>
              Buscá y seleccioná la opción <span className="font-semibold text-brand-800">«Añadir a pantalla de inicio»</span> (<PlusSquare className="w-3.5 h-3.5 inline text-brand-700 mx-0.5" />) y tocá <span className="font-bold text-slate-900">«Añadir»</span>.
            </div>
          </div>
        </div>

        {/* Ventajas */}
        <div className="flex items-center gap-2 mb-6 px-1 text-[11px] font-semibold text-purple-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Accedé a pantalla completa, sin barras y con carga inmediata.</span>
        </div>

        {/* Botón Entendido */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold transition-all shadow-md shadow-brand-700/20 active:scale-[0.99]"
        >
          Entendido
        </button>

      </div>
    </div>
  );
};
