import React from 'react';
import { 
  Home, 
  Search, 
  Plus, 
  MessageSquare, 
  User,
  Heart
} from 'lucide-react';

export const BottomNav = ({ 
  activeTab = 'inicio', 
  onSelectTab,
  onOpenRegisterModal,
  unreadCount = 0
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-purple-100 shadow-floating py-1.5 px-3 sm:px-6">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Inicio */}
        <button
          onClick={() => onSelectTab('inicio')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'inicio' 
              ? 'text-brand-700 font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Inicio</span>
        </button>

        {/* Búsqueda */}
        <button
          onClick={() => onSelectTab('busqueda')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'busqueda' 
              ? 'text-brand-700 font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Búsqueda</span>
        </button>

        {/* Publicar Trabajo (+) - Botón Central Destacado */}
        <button
          onClick={onOpenRegisterModal}
          className="relative -top-3 flex flex-col items-center group"
          title="Sumá tu Oficio en Lynx"
        >
          <div className="w-12 h-12 rounded-full bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center shadow-lg shadow-brand-700/35 group-hover:scale-105 group-active:scale-95 transition-all">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-brand-800 mt-0.5">Publicar</span>
        </button>

        {/* Mensajes */}
        <button
          onClick={() => onSelectTab('mensajes')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'mensajes' 
              ? 'text-brand-700 font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Mensajes</span>
        </button>

        {/* Perfil / Mis Publicaciones */}
        <button
          onClick={() => onSelectTab('perfil')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors ${
            activeTab === 'perfil' 
              ? 'text-brand-700 font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Perfil</span>
        </button>

      </div>
    </div>
  );
};
