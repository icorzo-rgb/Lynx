import React from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Heart, 
  Settings, 
  ArrowRight,
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';

export const HeroSearch = ({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onOpenRadarModal,
  onOpenCategoryModal,
  onOpenMyPublications,
  onOpenMessages,
  onOpenFavorites,
  onOpenSettings,
  onlyMatriculados,
  onToggleMatriculados,
  emergencyOnly,
  onToggleEmergency,
  freeQuoteOnly,
  onToggleFreeQuote,
  totalResults
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F0FC] via-[#FAF8FF] to-[#FAF8FF] pt-4 pb-6 px-4 sm:px-6 lg:px-8 border-b border-purple-100/60">
      
      {/* Fondo decorativo con halos suaves de luz violeta */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-200/35 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-brand-200/25 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* Saludo Principal: "Hola, ¿en qué podemos ayudarte hoy?" */}
        <div className="text-left pt-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Hola,<br />
            <span className="text-brand-900">¿en qué podemos ayudarte hoy?</span>
          </h1>
        </div>

        {/* Barra de Ubicación / Buscador Rápido (Estilo Pantalla 2) */}
        <div className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-soft border border-purple-100/90 flex flex-col sm:flex-row gap-2">
          
          {/* Botón / Selector de Ubicación */}
          <button
            type="button"
            onClick={onOpenRadarModal}
            className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 text-left transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-brand-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-brand-800 block">
                Buscar ubicación
              </span>
              <span className="text-xs text-slate-500 font-medium truncate block">
                {selectedLocation.name}
              </span>
            </div>
          </button>

          {/* Buscador de Servicio por Texto */}
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por oficio, nombre o arreglo..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white rounded-xl sm:rounded-2xl border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>

        </div>

        {/* 6 Cuadrículas de Acceso Rápido (Grid 3x2 / 2x3 de la Pantalla 2) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5 pt-1">
          
          {/* 1. Trabajadores cerca de mí */}
          <button
            onClick={onOpenRadarModal}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-100/90 shadow-soft hover:shadow-md transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-brand-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
              Trabajadores<br />cerca de mí
            </span>
          </button>

          {/* 2. Elegir trabajo */}
          <button
            onClick={onOpenCategoryModal}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-100/90 shadow-soft hover:shadow-md transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-brand-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
              Elegir<br />trabajo
            </span>
          </button>

          {/* 3. Mis publicaciones */}
          <button
            onClick={onOpenMyPublications}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-100/90 shadow-soft hover:shadow-md transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-brand-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
              Mis<br />publicaciones
            </span>
          </button>

          {/* 4. Mensajes */}
          <button
            onClick={onOpenMessages}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-100/90 shadow-soft hover:shadow-md transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-brand-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
              Mensajes
            </span>
          </button>

          {/* 5. Favoritos */}
          <button
            onClick={onOpenFavorites}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-100/90 shadow-soft hover:shadow-md transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-brand-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
              Favoritos
            </span>
          </button>

          {/* 6. Configuración */}
          <button
            onClick={onOpenSettings}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-purple-50/70 border border-purple-100/90 shadow-soft hover:shadow-md transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-brand-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
              Configuración
            </span>
          </button>

        </div>

        {/* Banner Promocional: "Encontrá al profesional ideal cerca de tu negocio" */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-100 via-purple-50 to-white border border-purple-200/80 p-5 sm:p-6 flex items-center justify-between shadow-soft">
          
          <div className="relative z-10 max-w-sm space-y-2">
            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-brand-800 bg-purple-200/70 px-2.5 py-0.5 rounded-full">
              Cobertura Lynx
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              Encontrá al profesional ideal cerca de tu negocio
            </h3>
            <button
              onClick={onOpenCategoryModal}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-700 hover:text-brand-900 group pt-1"
            >
              <span>Explorar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Ilustración de Profesional */}
          <div className="shrink-0 relative hidden xs:block sm:block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80" 
                alt="Profesional" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Filtros Rápidos (Chips / Pills) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          
          <button
            onClick={onToggleMatriculados}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              onlyMatriculados
                ? 'bg-brand-700 text-white shadow-sm ring-2 ring-purple-400/50'
                : 'bg-white text-slate-700 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${onlyMatriculados ? 'text-white' : 'text-brand-600'}`} />
            <span>Matriculados Oficiales</span>
          </button>

          <button
            onClick={onToggleEmergency}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              emergencyOnly
                ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-400/50'
                : 'bg-white text-slate-700 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${emergencyOnly ? 'text-white' : 'text-rose-500'}`} />
            <span>Guardia 24hs / Urgente</span>
          </button>

          <button
            onClick={onToggleFreeQuote}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              freeQuoteOnly
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                : 'bg-white text-slate-700 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${freeQuoteOnly ? 'text-white' : 'text-emerald-500'}`} />
            <span>Presupuesto sin cargo</span>
          </button>
        </div>

      </div>
    </section>
  );
};
