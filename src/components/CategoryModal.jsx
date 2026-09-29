import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  Droplets, 
  Building2, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Flame, 
  Wrench, 
  MoreHorizontal,
  Layers,
  Check
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const iconMap = {
  Layers: Layers,
  Droplets: Droplets,
  Building2: Building2,
  Zap: Zap,
  Hammer: Hammer,
  Paintbrush: Paintbrush,
  Flame: Flame,
  Wrench: Wrench,
  MoreHorizontal: MoreHorizontal
};

export const CategoryModal = ({
  selectedCategory,
  onSelectCategory,
  onClose
}) => {
  const [query, setQuery] = useState('');

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.id !== 'todos' && cat.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleChoose = (catId) => {
    onSelectCategory(catId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-purple-100 max-h-[92vh]">
        
        {/* Cabecera: ← Elegir trabajo */}
        <div className="p-4 border-b border-purple-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-bold text-slate-900">
            Elegir trabajo
          </h2>

          <button
            onClick={() => handleChoose('todos')}
            className="text-xs font-bold text-brand-600 hover:text-brand-800"
          >
            Ver todos
          </button>
        </div>

        {/* Buscador de trabajo o categoría */}
        <div className="p-4 pb-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar trabajo o categoría"
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-purple-50/60 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Lista de Categorías con iconos morados estilo Lynx */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Wrench;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleChoose(cat.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 group ${
                  isSelected 
                    ? 'bg-purple-50/80 border-brand-500 shadow-sm' 
                    : 'bg-white border-purple-100 hover:border-brand-300 hover:bg-purple-50/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' 
                      : 'bg-purple-100/70 text-brand-700 group-hover:bg-brand-600 group-hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 block">
                      {cat.name}
                    </span>
                    {cat.badge && (
                      <span className="inline-block text-[10px] font-extrabold text-brand-700 uppercase tracking-wide">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
