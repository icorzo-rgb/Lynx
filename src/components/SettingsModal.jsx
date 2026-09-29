import React from 'react';
import { 
  ArrowLeft, 
  Settings, 
  ShieldCheck, 
  Bell, 
  Moon, 
  Smartphone, 
  Info,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { LynxLogo } from './LynxLogo';

export const SettingsModal = ({ onClose, onOpenSplash }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-purple-100 max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="p-4 border-b border-purple-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-bold text-slate-900">
            Configuración
          </h2>

          <div className="w-9" />
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Logo y versión de Lynx */}
          <div className="text-center p-4 bg-purple-50/60 rounded-3xl border border-purple-100/80">
            <LynxLogo size="md" showText={true} showSlogan={true} />
            <span className="inline-block mt-3 px-3 py-1 bg-white text-[11px] font-bold text-brand-700 rounded-full border border-purple-200">
              Versión 2.0 • Argentina
            </span>
          </div>

          {/* Opciones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-brand-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Notificaciones de consultas</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Activadas
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-brand-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Verificación de Matrículas</span>
              </div>
              <span className="text-xs font-extrabold text-brand-700 bg-purple-50 px-2 py-0.5 rounded-md">
                ENARGAS / COPIME
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-brand-700 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Privacidad y Protección</span>
              </div>
              <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                Cifrado SSL
              </span>
            </div>
          </div>

          {/* Ver pantalla de bienvenida de nuevo */}
          <button
            onClick={() => {
              onClose();
              if (onOpenSplash) onOpenSplash();
            }}
            className="w-full py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-brand-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ver pantalla de Bienvenida Lynx</span>
          </button>
        </div>

      </div>
    </div>
  );
};
