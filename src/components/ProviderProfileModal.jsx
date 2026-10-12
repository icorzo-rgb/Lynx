import React, { useState } from 'react';
import { 
  ArrowLeft, 
  X, 
  Heart, 
  Star, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Flame, 
  Phone, 
  MessageSquare, 
  Wrench, 
  PlusCircle
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

export const ProviderProfileModal = ({
  provider,
  onClose,
  onOpenChat,
  onOpenWhatsApp,
  onOpenReviewModal,
  isFavorite = false,
  onToggleFavorite
}) => {
  if (!provider) return null;

  const [contactMenuOpen, setContactMenuOpen] = useState(false);

  const defaultServices = provider.servicesList || [
    provider.categoryName || 'Servicio Profesional',
    'Reparaciones',
    'Instalación',
    'Mantenimiento'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto border border-purple-100">
        
        {/* Cabecera Superior Flotante con Foto de Portada o Gradiente Elegante */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-r from-purple-900 via-brand-900 to-indigo-950 shrink-0">
          {provider.coverImageUrl && (
            <img 
              src={provider.coverImageUrl} 
              alt={provider.name} 
              className="w-full h-full object-cover opacity-75"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Botones de Control Superiores */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition-all shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(provider.id)}
                className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition-all shadow-md"
                title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition-all shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenedor Principal con Scroll */}
        <div className="overflow-y-auto flex-1 px-5 pb-24 space-y-5">
          
          {/* Tarjeta de Identidad del Profesional */}
          <div className="-mt-14 relative z-10 flex flex-col items-start bg-white p-4 rounded-3xl border border-purple-100 shadow-soft">
            <div className="flex items-start gap-3.5 w-full">
              
              {/* Avatar con Check de Verificado */}
              <AvatarDisplay
                name={provider.name}
                avatarUrl={provider.avatarUrl}
                size="lg"
                showVerifiedBadge={true}
              />

              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 truncate">
                  {provider.name}
                </h1>

                <p className="text-xs text-brand-700 font-bold mt-0.5">
                  {provider.businessName || provider.categoryName}
                </p>

                {/* Rating y Distancia */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-1.5">
                  {provider.totalReviews > 0 && provider.rating !== null ? (
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(provider.rating).toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({provider.totalReviews} reseñas)</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-medium text-slate-400">
                      <Star className="w-3.5 h-3.5 text-slate-300" />
                      <span>Sin calificaciones aún</span>
                    </span>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>{provider.locationName}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Badges: Matriculado, Seguro, Urgente */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-purple-50 w-full">
              {provider.isMatriculado && (
                <span className="px-3 py-1 rounded-xl bg-purple-50 text-brand-900 text-xs font-bold border border-purple-200">
                  Matriculado
                </span>
              )}
              {provider.hasInsurance && (
                <span className="px-3 py-1 rounded-xl bg-purple-50 text-brand-900 text-xs font-bold border border-purple-200">
                  Seguro
                </span>
              )}
              {provider.isEmergency247 && (
                <span className="px-3 py-1 rounded-xl bg-purple-50 text-brand-900 text-xs font-bold border border-purple-200">
                  Urgente
                </span>
              )}
            </div>
          </div>

          {/* Sección: Sobre mí */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900">
              Sobre mí
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-purple-50/30 p-3.5 rounded-2xl border border-purple-50 whitespace-pre-line">
              {provider.shortBio}
            </p>
          </div>

          {/* Sección: Servicios */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900">
              Servicios
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {defaultServices.map((srv, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-purple-50/50 border border-purple-100/80"
                >
                  <div className="w-7 h-7 rounded-xl bg-white text-brand-700 flex items-center justify-center shadow-sm shrink-0">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {srv}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección: Reseñas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">
                Reseñas
              </h3>
              <button
                onClick={() => onOpenReviewModal(provider)}
                className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Calificar</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {provider.reviews && provider.reviews.length > 0 ? (
                provider.reviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-soft space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <AvatarDisplay
                          name={rev.clientName}
                          avatarUrl={rev.avatarUrl}
                          size="sm"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            {rev.clientName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {rev.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map((starNum) => (
                            <Star 
                              key={starNum} 
                              className={`w-3 h-3 ${starNum <= Math.round(Number(rev.ratingOverall)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-extrabold text-slate-700">
                          {Number(rev.ratingOverall).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Aún no hay reseñas registradas para este profesional.</p>
              )}
            </div>
          </div>

        </div>

        {/* Barra Inferior Fija: Botón "Contactar" */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-purple-100 z-30 flex flex-col gap-2">
          
          {contactMenuOpen ? (
            <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => {
                  setContactMenuOpen(false);
                  onOpenChat(provider);
                }}
                className="py-3 px-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Web Chat</span>
              </button>

              <button
                onClick={() => {
                  setContactMenuOpen(false);
                  onOpenWhatsApp(provider);
                }}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setContactMenuOpen(true)}
              className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-black text-sm shadow-lg shadow-brand-700/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contactar</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
