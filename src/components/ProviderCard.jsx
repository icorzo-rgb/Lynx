import React from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Flame, 
  MessageSquare, 
  Phone, 
  Award, 
  ChevronRight, 
  Heart, 
  ShieldCheck 
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

export const ProviderCard = ({
  provider,
  onSelect,
  onOpenChat,
  onOpenWhatsApp,
  isFavorite = false,
  onToggleFavorite
}) => {
  const formatARS = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <article className="group bg-white rounded-3xl border border-purple-100/90 hover:border-brand-400 hover:shadow-premium transition-all duration-300 overflow-hidden flex flex-col justify-between p-4 sm:p-5 gap-4">
      
      <div>
        {/* Cabecera con Foto Real o Iniciales y Corazón de Favorito */}
        <div className="flex items-start gap-3.5">
          
          <div className="cursor-pointer" onClick={() => onSelect(provider)}>
            <AvatarDisplay
              name={provider.name}
              avatarUrl={provider.avatarUrl}
              size="md"
              showStatus={true}
              isAvailable={provider.isAvailableNow}
            />
          </div>

          {/* Información Principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-700 bg-purple-100/70 px-2 py-0.5 rounded-full truncate">
                {provider.categoryName}
              </span>
              
              {/* Botón Favorito */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleFavorite) onToggleFavorite(provider.id);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>
            </div>

            <h3 
              onClick={() => onSelect(provider)}
              className="text-base font-bold text-slate-900 group-hover:text-brand-700 cursor-pointer transition-colors mt-0.5 truncate"
            >
              {provider.name}
            </h3>

            {/* Ubicación y Distancia */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <span className="truncate">{provider.locationName}</span>
              <span>•</span>
              <strong className="text-brand-800 font-bold shrink-0">{provider.distanceKm ? `${provider.distanceKm.toFixed(1)} km` : 'Cerca'}</strong>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-slate-800">{(provider.rating || 5.0).toFixed(1)}</span>
              <span className="text-[11px] text-slate-400">({provider.totalReviews || 1})</span>
            </div>
          </div>
        </div>

        {/* Badges de Verificación */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {provider.isMatriculado && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-brand-900 text-[10px] sm:text-[11px] font-bold">
              <Award className="w-3 h-3 text-brand-600 shrink-0" />
              <span>Matriculado</span>
            </span>
          )}

          {provider.hasInsurance && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] sm:text-[11px] font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Seguro</span>
            </span>
          )}

          {provider.isEmergency247 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[10px] sm:text-[11px] font-bold">
              <Flame className="w-3 h-3 text-rose-600 shrink-0" />
              <span>Urgente 24hs</span>
            </span>
          )}
        </div>

        {/* Biografía / Sobre mí resumido */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-2.5 leading-relaxed">
          {provider.shortBio}
        </p>
      </div>

      {/* Pie de Tarjeta: Acciones */}
      <div className="pt-3 border-t border-purple-50 flex items-center justify-between gap-2">
        <div>
          {provider.pricing?.model === 'FREE_QUOTE' ? (
            <span className="text-xs font-bold text-emerald-600">Presupuesto sin cargo</span>
          ) : (
            <span className="text-xs font-black text-slate-900">
              {provider.pricing?.minVisitFeeArs > 0 ? `Visita desde ${formatARS(provider.pricing.minVisitFeeArs)}` : 'Presupuesto sin cargo'}
            </span>
          )}
        </div>

        {/* Botones */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenChat(provider)}
            className="p-2 rounded-xl text-brand-700 bg-purple-50 hover:bg-purple-100 transition-colors"
            title="Chat directo"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenWhatsApp(provider)}
            className="px-3 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => onSelect(provider)}
            className="p-2 rounded-xl text-brand-700 hover:bg-purple-50 transition-colors"
            title="Ver perfil completo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
