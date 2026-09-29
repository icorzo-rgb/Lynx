import React from 'react';
import { ShieldCheck, Award, MessageSquare, CheckCircle2, Star, Zap } from 'lucide-react';

export const StatsSection = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Validación Oficial',
      desc: 'Revisión de identidades y credenciales de oficio'
    },
    {
      icon: Award,
      title: 'Matrículas Habilitadas',
      desc: 'Gasistas ENARGAS y electricistas COPIME'
    },
    {
      icon: MessageSquare,
      title: 'Contacto Directo',
      desc: 'Trato directo por WhatsApp o Web Chat sin intermediarios'
    },
    {
      icon: Star,
      title: 'Reseñas Transparentes',
      desc: 'Calificaciones basadas en trabajos reales'
    }
  ];

  return (
    <section className="py-10 bg-white border-t border-purple-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-700 bg-purple-100/70 px-3 py-1 rounded-full">
            Garantía de Confianza Lynx
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            La red más transparente para contratar oficios y servicios
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center text-center p-4 rounded-3xl bg-purple-50/40 border border-purple-100/70 hover:border-brand-300 transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl bg-white text-brand-700 shadow-sm flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
