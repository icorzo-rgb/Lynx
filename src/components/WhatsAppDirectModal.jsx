import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  MessageCircle 
} from 'lucide-react';

export const WhatsAppDirectModal = ({ provider, onClose }) => {
  if (!provider) return null;

  const defaultTemplates = [
    `Hola ${provider.name}, te contacto desde Lynx por tu servicio de ${provider.categoryName}. ¿Tenés disponibilidad para una consulta?`,
    `¡Hola ${provider.name}! Tengo una URGENCIA en mi domicilio y necesito saber si podés venir hoy. Vi tu perfil en Lynx.`,
    `Hola! Quisiera solicitarte un presupuesto para un trabajo de ${provider.categoryName}. ¿Qué datos necesitás?`
  ];

  const [message, setMessage] = useState(defaultTemplates[0]);
  const [copied, setCopied] = useState(false);

  const cleanPhone = provider.whatsappPhone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 p-5 sm:p-6 space-y-4">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 leading-tight">
                Contactar por WhatsApp
              </h3>
              <p className="text-xs text-brand-700 font-bold">
                {provider.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plantillas Rápidas */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Plantillas de mensaje directo
          </label>
          <div className="space-y-1.5">
            <button
              onClick={() => setMessage(defaultTemplates[0])}
              className="w-full text-left text-xs p-2.5 rounded-xl border border-purple-100 hover:border-emerald-500 hover:bg-emerald-50/40 font-medium text-slate-700 transition-all"
            >
              💬 Consulta estándar de disponibilidad
            </button>
            <button
              onClick={() => setMessage(defaultTemplates[1])}
              className="w-full text-left text-xs p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 font-medium text-rose-800 transition-all"
            >
              🚨 Urgencia inmediata
            </button>
            <button
              onClick={() => setMessage(defaultTemplates[2])}
              className="w-full text-left text-xs p-2.5 rounded-xl border border-purple-100 hover:border-emerald-500 hover:bg-emerald-50/40 font-medium text-slate-700 transition-all"
            >
              📋 Pedido de presupuesto
            </button>
          </div>
        </div>

        {/* Textarea del Mensaje */}
        <div>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 text-xs sm:text-sm rounded-2xl bg-purple-50/40 border border-purple-100 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all leading-relaxed text-slate-800"
          />
        </div>

        {/* Botones de Acción */}
        <div className="space-y-2 pt-1">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>Abrir WhatsApp Ahora</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Mensaje copiado al portapapeles' : 'Copiar texto'}</span>
          </button>
        </div>

        {/* Seguridad */}
        <div className="pt-2 border-t border-purple-50 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Número validado (+54 9 {cleanPhone.slice(3)})</span>
        </div>

      </div>
    </div>
  );
};
