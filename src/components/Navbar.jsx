import React, { useState } from 'react';
import { 
  Bell, 
  MapPin, 
  User, 
  Plus, 
  ChevronDown,
  Download
} from 'lucide-react';
import { LynxLogo } from './LynxLogo';
import { ARGENTINA_LOCATIONS } from '../data/mockData';

export const Navbar = ({
  selectedLocation,
  onSelectLocation,
  onOpenRadarModal,
  onOpenRegisterModal,
  onOpenNotifications,
  onOpenProfile,
  unreadNotifications = 1,
  canInstall = false,
  isInstalled = false,
  onInstall = () => {}
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-purple-100/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 py-2.5">
          
          {/* Logo Lynx */}
          <div className="flex items-center gap-3">
            <LynxLogo size="md" showText={true} />
            
            {/* Selector de Localidad en Header Desktop */}
            <div className="relative ml-2 hidden md:block">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50/70 hover:bg-purple-100/70 text-xs font-semibold text-purple-950 transition-colors border border-purple-100"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span className="max-w-[140px] truncate">{selectedLocation.name}</span>
                <ChevronDown className="w-3 h-3 text-purple-400" />
              </button>

              {showLocationDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-purple-400 border-b border-purple-50 flex items-center justify-between">
                    <span>Zonas de Cobertura</span>
                    <button 
                      onClick={() => {
                        setShowLocationDropdown(false);
                        onOpenRadarModal();
                      }}
                      className="text-brand-600 hover:underline lowercase font-semibold"
                    >
                      ver radar
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {ARGENTINA_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          onSelectLocation(loc);
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-purple-50 hover:text-brand-700 transition-colors ${
                          selectedLocation.id === loc.id ? 'bg-purple-50 text-brand-700 font-bold' : 'text-slate-600'
                        }`}
                      >
                        <span>{loc.name}</span>
                        {selectedLocation.id === loc.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones de Cabecera */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Botón Desktop: Publicar Trabajo / Sumar Oficio */}
            <button
              onClick={onOpenRegisterModal}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-extrabold shadow-md shadow-brand-700/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Sumá tu Oficio</span>
            </button>

            {/* Botón Discreto PWA: Instalar LYNX */}
            {canInstall && !isInstalled && (
              <button
                onClick={onInstall}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-brand-700 text-xs font-bold border border-purple-200 transition-all hover:scale-105"
                title="Instalar LYNX en tu dispositivo"
                aria-label="Instalar LYNX"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden lg:inline">Instalar LYNX</span>
              </button>
            )}

            {/* Campana de Notificaciones */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 transition-colors"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5 text-purple-800" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Botón de Perfil / Mis Publicaciones */}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-2xl bg-purple-100/70 hover:bg-purple-200/70 text-brand-900 transition-colors border border-purple-200"
              title="Mis Publicaciones / Perfil"
            >
              <User className="w-5 h-5 text-brand-700" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
