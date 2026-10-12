import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Send,
  Sparkles
} from 'lucide-react';

export const ReviewModal = ({ provider, onClose, onSubmitReview }) => {
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(5); // Puntuación de 0 a 5 estrellas
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState('');

  if (!provider) return null;

  const currentScore = hoverRating !== null ? hoverRating : rating;

  const scoreLabels = {
    0: '0 / 5 ⭐ - Sin estrellas (Insatisfecho)',
    1: '1 / 5 ⭐ - Mal servicio',
    2: '2 / 5 ⭐ - Regular',
    3: '3 / 5 ⭐ - Aceptable',
    4: '4 / 5 ⭐ - Muy bueno',
    5: '5 / 5 ⭐ - Excelente'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim()) return;

    const newReview = {
      id: 'rev-' + Date.now(),
      clientName: clientName.trim(),
      avatarUrl: null,
      date: 'Recién',
      ratingOverall: Number(rating), // Puntuación real de 0 a 5
      comment: comment.trim()
    };

    onSubmitReview(provider.id, newReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 p-5 sm:p-6 space-y-4">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 leading-tight">
              Puntuar a {provider.name}
            </h3>
            <p className="text-xs text-brand-700 font-semibold mt-0.5">
              {provider.categoryName} • Calificación con estrellas de 0 a 5
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre del Cliente */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tu Nombre Completo
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej: Marcelo Fernández"
              className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-800"
            />
          </div>

          {/* Selector de Estrellas de 0 a 5 */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3 text-center">
            <span className="text-xs font-bold text-slate-800 block">
              Seleccioná la puntuación (0 a 5 estrellas)
            </span>

            {/* Estrellas interactivas */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(starVal)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  title={`${starVal} estrellas`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                      starVal <= currentScore
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 hover:text-amber-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Opción de 0 estrellas y etiqueta descriptiva */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-100 text-xs">
              <button
                type="button"
                onClick={() => setRating(0)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  rating === 0 
                    ? 'bg-rose-100 text-rose-700 border border-rose-300' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                0 estrellas
              </button>

              <span className="font-extrabold text-brand-800 bg-white px-2.5 py-1 rounded-xl border border-purple-200 shadow-2xs">
                {scoreLabels[rating]}
              </span>
            </div>
          </div>

          {/* Comentario / Opinión */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tu Opinión o Reseña del Trabajo
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Contanos cómo fue la atención, puntualidad o el resultado del trabajo..."
              className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-800"
            />
          </div>

          {/* Botón Guardar Calificación */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-black text-xs sm:text-sm shadow-md shadow-brand-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Send className="w-4 h-4" />
            <span>Guardar Mi Puntuación Real</span>
          </button>
        </form>

      </div>
    </div>
  );
};
