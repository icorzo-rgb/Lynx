import React from 'react';
import { 
  Flame, 
  Zap, 
  Droplets, 
  Hammer, 
  Paintbrush, 
  Wrench, 
  Building2, 
  Layers,
  MoreHorizontal
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

export const CategoryGrid = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Explorar por Especialidad
          </h2>
          <p className="text-[11px] text-slate-500">
            Filtrá prestadores disponibles según el tipo de trabajo
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Wrench;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border ${
                isSelected
                  ? 'bg-brand-700 text-white border-brand-700 shadow-md shadow-brand-700/20 scale-105'
                  : 'bg-white text-slate-700 border-purple-100 hover:border-brand-300 hover:bg-purple-50/50 shadow-soft'
              }`}
            >
              <div className={`p-1 rounded-xl ${
                isSelected ? 'bg-white/20 text-white' : 'bg-purple-100/70 text-brand-700'
              }`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>

              <span>{cat.name}</span>

              {cat.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                  isSelected ? 'bg-white text-brand-700' : 'bg-purple-100 text-brand-800'
                }`}>
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
