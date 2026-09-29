import React from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Trash2,
  Frown,
  ChevronRight
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

export const FavoritesModal = ({
  favorites,
  providers,
  onToggleFavorite,
  onSelectProvider,
  onOpenChat,
  onOpenWhatsApp,
  onClose
}) => {
  const favoriteProviders = providers.filter(p => favorites.includes(p.id));

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
            <span>Favoritos Guardados</span>
            <span className="text-xs bg-purple-100 text-brand-700 px-2 py-0.5 rounded-full font-extrabold">
              {favoriteProviders.length}
            </span>
          </h2>

          <div className="w-9" />
        </div>

        {/* Lista de Favoritos */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {favoriteProviders.length > 0 ? (
            favoriteProviders.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100 hover:border-brand-300 transition-all gap-3"
              >
                <div 
                  onClick={() => {
                    onSelectProvider(provider);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <AvatarDisplay
                    name={provider.name}
                    avatarUrl={provider.avatarUrl}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {provider.name}
                    </h3>
                    <p className="text-xs text-brand-700 font-medium truncate">
                      {provider.categoryName}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-0.5 font-bold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {(provider.rating || 5.0).toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>{provider.locationName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onOpenChat(provider);
                      onClose();
                    }}
                    className="p-2 rounded-xl text-brand-700 bg-white hover:bg-purple-100 transition-colors shadow-sm"
                    title="Chatear"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onToggleFavorite(provider.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Quitar de favoritos"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-400 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Aún no tenés favoritos guardados
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Podés tocar el corazón en cualquier tarjeta de profesional para guardarlo acá y acceder rápido.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
