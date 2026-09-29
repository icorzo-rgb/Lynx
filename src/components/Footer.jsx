import React from 'react';
import { LynxLogo } from './LynxLogo';
import { ShieldCheck, Heart, MapPin } from 'lucide-react';

export const Footer = ({ onOpenRadarModal, onOpenRegisterModal, onOpenCategoryModal }) => {
  return (
    <footer className="bg-[#FAF8FF] border-t border-purple-100 py-10 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <LynxLogo size="md" showText={true} showSlogan={true} />
            <p className="text-xs text-slate-500 max-w-sm">
              Plataforma para conectar clientes y prestadores independientes de oficios en Argentina de manera rápida y segura.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-brand-800">
            <button 
              onClick={onOpenCategoryModal}
              className="hover:text-brand-900 transition-colors"
            >
              Rubros y Oficios
            </button>
            <button 
              onClick={onOpenRadarModal}
              className="hover:text-brand-900 transition-colors"
            >
              Mapa y Radar de Cobertura
            </button>
            <button 
              onClick={onOpenRegisterModal}
              className="hover:text-brand-900 transition-colors"
            >
              Sumar mi Oficio
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-purple-100/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <span>© {new Date().getFullYear()} Lynx. Todos los derechos reservados.</span>
          <div className="flex items-center gap-1">
            <span>Diseñado con tecnología</span>
            <span className="text-brand-600 font-bold">Lynx Pro</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
