import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Navigation, 
  SlidersHorizontal, 
  Check, 
  X,
  Compass
} from 'lucide-react';
import { ARGENTINA_LOCATIONS } from '../data/mockData';

export const LocationRadarModal = ({
  selectedLocation,
  onSelectLocation,
  searchRadiusKm = 5,
  onApplyRadius,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [currentRadius, setCurrentRadius] = useState(searchRadiusKm);
  const [selectedLoc, setSelectedLoc] = useState(selectedLocation || ARGENTINA_LOCATIONS[0]);
  const [isLocating, setIsLocating] = useState(false);

  const filteredLocations = ARGENTINA_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSimulateGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setSelectedLoc(ARGENTINA_LOCATIONS[0]); // Palermo, CABA
      setIsLocating(false);
    }, 500);
  };

  const handleApply = () => {
    onSelectLocation(selectedLoc);
    if (onApplyRadius) onApplyRadius(currentRadius);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-purple-100 max-h-[92vh]">
        
        {/* Cabecera: ← Ubicación */}
        <div className="p-4 border-b border-purple-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-bold text-slate-900">
            Ubicación
          </h2>

          <div className="w-9" /> {/* Spacer */}
        </div>

        {/* Buscador de dirección o zona */}
        <div className="p-4 pb-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar dirección o zona"
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-purple-50/60 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
            <button 
              type="button"
              className="absolute right-3 p-1 text-slate-400 hover:text-brand-600 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mapa con Radar Visual Interactivo */}
        <div className="px-4 py-2 flex-1">
          <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-slate-100 border border-purple-100 shadow-inner flex items-center justify-center">
            
            {/* Fondo simulado de mapa de cuadrículas */}
            <div className="absolute inset-0 bg-[#F4F1FA] opacity-90">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E6DDF2" strokeWidth="1"/>
                  </pattern>
                  {/* Calles principales diagonales simuladas */}
                  <pattern id="roads" width="90" height="90" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="90" y2="90" stroke="#DDD3ED" strokeWidth="3"/>
                    <line x1="90" y1="0" x2="0" y2="90" stroke="#DDD3ED" strokeWidth="2"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <rect width="100%" height="100%" fill="url(#roads)" opacity="0.6"/>
              </svg>
            </div>

            {/* Círculo de Radar con Radio Dinámico y Ondas */}
            <div 
              className="absolute rounded-full bg-brand-500/15 border-2 border-brand-500/50 flex items-center justify-center transition-all duration-300 pointer-events-none"
              style={{
                width: `${Math.min(240, Math.max(80, currentRadius * 16))}px`,
                height: `${Math.min(240, Math.max(80, currentRadius * 16))}px`
              }}
            >
              {/* Pulso de onda */}
              <div className="absolute inset-0 rounded-full border border-brand-400/40 animate-radar-wave" />
              <div className="absolute inset-0 rounded-full bg-brand-400/10" />
            </div>

            {/* Pin Central con Isotipo / Ubicación */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-700/40 animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2.5 py-0.5 rounded-full bg-white/95 text-[11px] font-bold text-slate-800 shadow-md border border-purple-100 max-w-[160px] truncate">
                {selectedLoc.name}
              </span>
            </div>

            {/* Botón Flotante GPS */}
            <button
              onClick={handleSimulateGPS}
              className="absolute bottom-3 right-3 p-3 rounded-2xl bg-white text-slate-700 hover:text-brand-600 shadow-md border border-purple-100 transition-all hover:scale-105 active:scale-95 z-20"
              title="Centrar en mi ubicación"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin text-brand-600' : ''}`} />
            </button>
          </div>

          {/* Lista rápida de resultados de búsqueda si escribe */}
          {query.trim() && (
            <div className="mt-2 max-h-32 overflow-y-auto rounded-2xl bg-white border border-purple-100 shadow-sm py-1">
              {filteredLocations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLoc(loc);
                    setQuery('');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-purple-50 transition-colors ${
                    selectedLoc.id === loc.id ? 'bg-purple-50 text-brand-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    {loc.name}
                  </span>
                  {selectedLoc.id === loc.id && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          )}

          {/* Control Slider: Radio de búsqueda */}
          <div className="mt-4 p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Radio de búsqueda</span>
              <span className="text-brand-700 bg-white px-2.5 py-0.5 rounded-lg border border-purple-200">
                {currentRadius} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={currentRadius}
              onChange={(e) => setCurrentRadius(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-purple-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>1 km</span>
              <span>10 km</span>
              <span>25 km</span>
            </div>
          </div>
        </div>

        {/* Botón Aplicar */}
        <div className="p-4 pt-2">
          <button
            onClick={handleApply}
            className="w-full py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-sm shadow-md shadow-brand-700/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Aplicar
          </button>
        </div>

      </div>
    </div>
  );
};
