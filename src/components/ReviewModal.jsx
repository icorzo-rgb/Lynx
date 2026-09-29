import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  Send
} from 'lucide-react';

export const ReviewModal = ({ provider, onClose, onSubmitReview }) => {
  const [clientName, setClientName] = useState('');
  const [punctuality, setPunctuality] = useState(5);
  const [qualityPrice, setQualityPrice] = useState(5);
  const [serviceQuality, setServiceQuality] = useState(5);
  const [comment, setComment] = useState('');
  const [isVerified, setIsVerified] = useState(true);

  if (!provider) return null;

  const overall = ((punctuality + qualityPrice + serviceQuality) / 3).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim()) return;

    const newReview = {
      id: 'rev-' + Date.now(),
      clientName: clientName.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      date: 'Recién',
      ratingOverall: parseFloat(overall),
      ratingPunctuality: punctuality,
      ratingQualityPrice: qualityPrice,
      ratingServiceQuality: serviceQuality,
      comment: comment.trim(),
      isVerifiedHire: isVerified
    };

    onSubmitReview(provider.id, newReview);
    onClose();
  };

  const renderStars = (currentVal, setter) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-5 h-5 ${
                star <= currentVal
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-200 hover:text-amber-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 p-5 sm:p-6 space-y-4">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 leading-tight">
              Calificar a {provider.name}
            </h3>
            <p className="text-xs text-brand-700 font-semibold mt-0.5">
              {provider.categoryName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Nombre del Cliente */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Tu Nombre Completo
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej: Marcelo Fernández"
              className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>

          {/* 3 Ejes de Calificación */}
          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">
              Evaluación del Servicio
            </span>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">1. Puntualidad</span>
              {renderStars(punctuality, setPunctuality)}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">2. Calidad / Precio</span>
              {renderStars(qualityPrice, setQualityPrice)}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">3. Prolijidad</span>
              {renderStars(serviceQuality, setServiceQuality)}
            </div>

            <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Promedio General:</span>
              <span className="text-xs font-black text-brand-700 bg-white px-2.5 py-0.5 rounded-lg border border-purple-200">
                ⭐ {overall} / 5.0
              </span>
            </div>
          </div>

          {/* Comentario */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Tu Reseña Detallada
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describí cómo fue el trabajo realizado..."
              className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-800"
            />
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-black text-xs sm:text-sm shadow-md shadow-brand-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Send className="w-4 h-4" />
            <span>Publicar Mi Calificación en Lynx</span>
          </button>
        </form>

      </div>
    </div>
  );
};
