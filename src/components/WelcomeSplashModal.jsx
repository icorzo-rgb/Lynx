import React from 'react';
import { LynxLogo } from './LynxLogo';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const WelcomeSplashModal = ({ onClose, onStart }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#F4EFFC] flex flex-col justify-between items-center px-6 py-10 animate-in fade-in duration-300 select-none overflow-hidden">
      
      {/* Ondas y formas decorativas en tonos lavanda y violeta suave */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-200/50 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-brand-300/30 blur-3xl pointer-events-none" />

      {/* Onda SVG de Fondo Suave */}
      <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
        <svg viewBox="0 0 500 500" className="w-full h-full text-purple-200 fill-current">
          <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z"></path>
          <path d="M0,400 C150,300 350,500 500,400 L500,500 L0,500 Z" opacity="0.6"></path>
        </svg>
      </div>

      {/* Espaciador superior */}
      <div className="w-full flex justify-end relative z-10">
        <button 
          onClick={onClose}
          className="text-xs font-semibold text-purple-700/70 hover:text-purple-900 bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm transition-colors"
        >
          Saltar
        </button>
      </div>

      {/* Contenido Central: Isotipo y Marca Exactos */}
      <div className="flex flex-col items-center text-center max-w-sm mx-auto relative z-10 my-auto">
        <div className="p-4 bg-white/40 backdrop-blur-sm rounded-3xl border border-purple-100/50 shadow-soft">
          <LynxLogo size="xl" layout="vertical" showText={true} showSlogan={true} />
        </div>

        {/* Pilares clave */}
        <div className="flex items-center gap-2 mt-6 text-[11px] font-bold text-purple-900/80 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-purple-100 shadow-sm">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            Matriculados
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
            Contacto Directo
          </span>
        </div>
      </div>

      {/* Botón Comenzar -> */}
      <div className="w-full max-w-sm relative z-10">
        <button
          onClick={() => {
            if (onStart) onStart();
            onClose();
          }}
          className="w-full py-4 px-8 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-base shadow-lg shadow-brand-700/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Comenzar</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
