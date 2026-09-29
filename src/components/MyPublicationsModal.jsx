import React from 'react';
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Eye, 
  Trash2, 
  Sparkles 
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

export const MyPublicationsModal = ({
  providers,
  onOpenRegisterModal,
  onSelectProvider,
  onDeleteProvider,
  onClose
}) => {
  const userPublications = providers.filter(p => p.id.startsWith('prov-custom-') || p.isUserCreated);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-purple-100 max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="p-4 border-b border-purple-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Mis Publicaciones de Oficio</span>
            <span className="text-xs bg-purple-100 text-brand-700 px-2 py-0.5 rounded-full font-extrabold">
              {userPublications.length}
            </span>
          </h2>

          <button
            onClick={() => {
              onClose();
              onOpenRegisterModal();
            }}
            className="p-2 rounded-xl text-brand-700 hover:bg-purple-50 transition-colors"
            title="Publicar nuevo oficio"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Lista de Publicaciones */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {userPublications.length > 0 ? (
            userPublications.map((pub) => (
              <div
                key={pub.id}
                className="p-4 rounded-3xl bg-purple-50/50 border border-purple-100 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AvatarDisplay
                      name={pub.name}
                      avatarUrl={pub.avatarUrl}
                      size="sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900">
                          {pub.businessName || pub.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          Activo
                        </span>
                      </div>
                      <p className="text-xs text-brand-700 font-semibold">
                        {pub.categoryName}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-brand-500" />
                        <span>{pub.locationName}</span>
                      </p>
                    </div>
                  </div>

                  {onDeleteProvider && (
                    <button
                      onClick={() => onDeleteProvider(pub.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Eliminar publicación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-purple-100 text-xs">
                  <span className="text-slate-500">
                    WhatsApp: <strong className="text-slate-700">{pub.whatsappPhone}</strong>
                  </span>

                  <button
                    onClick={() => {
                      onSelectProvider(pub);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-brand-700 font-bold hover:bg-brand-50 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver mi Perfil</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-purple-100/70 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Aún no publicaste ningún oficio
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Registrá tu perfil en Lynx para empezar a recibir consultas directas de personas en tu zona.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenRegisterModal();
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-extrabold shadow-md shadow-brand-700/20 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Sumar mi Oficio Ahora</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
