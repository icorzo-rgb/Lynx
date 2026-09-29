import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  X, 
  UserPlus, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Flame, 
  Phone,
  Eye,
  Camera,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { CATEGORIES, ARGENTINA_LOCATIONS } from '../data/mockData';
import { AvatarDisplay } from './AvatarDisplay';

export const RegisterProviderModal = ({ onClose, onAddProvider, onSelectProvider }) => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    category: 'plomeria',
    location: ARGENTINA_LOCATIONS[0].name,
    isMatriculado: false,
    licenseNumber: '',
    isEmergency247: false,
    shortBio: '',
    minVisitFeeArs: 0,
    hasFreeQuote: true
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [createdProvider, setCreatedProvider] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.shortBio.trim()) {
      return;
    }

    const categoryObj = CATEGORIES.find((c) => c.id === formData.category) || CATEGORIES[1];

    const newProvider = {
      id: 'prov-custom-' + Date.now(),
      name: formData.name.trim(),
      businessName: formData.businessName.trim() || `${formData.name.trim()} - Servicios`,
      // Foto real subida por el usuario (o null si decide no adjuntar foto)
      avatarUrl: avatarPreview || null,
      coverImageUrl: coverPreview || null,
      categoryId: formData.category,
      categoryName: categoryObj.name,
      isMatriculado: formData.isMatriculado,
      hasInsurance: true,
      licenseNumber: formData.isMatriculado ? (formData.licenseNumber.trim() || 'Matrícula Oficial Verificada') : null,
      licenseDetails: formData.isMatriculado ? 'Matrícula oficial declarada y habilitada en Lynx.' : null,
      isIdentityVerified: true,
      isEmergency247: formData.isEmergency247,
      isAvailableNow: true,
      isUserCreated: true,
      rating: 5.0,
      totalReviews: 1,
      ratingsBreakdown: {
        punctuality: 5.0,
        qualityPrice: 5.0,
        serviceQuality: 5.0
      },
      locationName: formData.location,
      coverageAreaDescription: `Cobertura activa en ${formData.location} y localidades aledañas.`,
      distanceKm: 0.8,
      shortBio: formData.shortBio.trim(),
      extendedDescription: `${formData.shortBio.trim()}\n\nAtención profesional directa con garantía Lynx.`,
      servicesList: [categoryObj.name, 'Reparaciones', 'Instalación', 'Presupuestos'],
      pricing: {
        model: formData.hasFreeQuote ? 'FREE_QUOTE' : 'FIXED_VISIT',
        minVisitFeeArs: Number(formData.minVisitFeeArs) || 0,
        displayText: formData.hasFreeQuote ? 'Presupuesto sin cargo' : `Visita desde $${formData.minVisitFeeArs} ARS`
      },
      whatsappPhone: formData.phone.trim(),
      responseTime: '~5 min',
      portfolio: coverPreview ? [
        { id: 'p-custom-1', title: 'Trabajo realizado', imageUrl: coverPreview }
      ] : [],
      reviews: [
        {
          id: 'rev-welcome-' + Date.now(),
          clientName: 'Equipo de Validación Lynx',
          date: 'Hoy',
          ratingOverall: 5.0,
          ratingPunctuality: 5,
          ratingQualityPrice: 5,
          ratingServiceQuality: 5,
          comment: 'Perfil de prestador verificado y activado exitosamente.',
          isVerifiedHire: true
        }
      ]
    };

    onAddProvider(newProvider);
    setCreatedProvider(newProvider);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 p-5 sm:p-6 space-y-4 my-auto max-h-[94vh] flex flex-col">
        
        {/* Cabecera: ← Publicar trabajo */}
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-700 hover:bg-purple-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-bold text-slate-900">
            Publicar trabajo
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-purple-100 text-brand-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">¡Perfil Publicado con Éxito!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Tu oficio ya está activo en Lynx. Ya figurás en la lista principal de resultados y podés recibir consultas directas.
              </p>
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onSelectProvider && createdProvider) {
                    onSelectProvider(createdProvider);
                  }
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Mi Perfil Publicado</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                Cerrar y Volver al Inicio
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 pr-1 space-y-4">
            
            {/* Header Tarjeta: Sumá tu Oficio en Lynx */}
            <div className="flex items-center gap-3 p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
              <div className="w-11 h-11 rounded-2xl bg-brand-700 text-white flex items-center justify-center shadow-sm shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 leading-tight">
                  Sumá tu Oficio en Lynx
                </h3>
                <p className="text-xs text-purple-700 font-medium">
                  Publicá tu servicio y empezá a recibir clientes
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Sección: Subir Foto de Perfil Real */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-4">
                <div className="relative">
                  <AvatarDisplay
                    name={formData.name || 'Tu Nombre'}
                    avatarUrl={avatarPreview}
                    size="md"
                  />
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => setAvatarPreview(null)}
                      className="absolute -top-1 -right-1 p-1 bg-rose-500 text-white rounded-full shadow-sm hover:bg-rose-600 transition-colors"
                      title="Quitar foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Tu Foto de Perfil (Opcional)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Subí una foto tuya real o de tu equipo. Si no subís foto, se mostrarán tus iniciales.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-brand-700 text-xs font-bold hover:bg-purple-50 transition-colors shadow-sm mt-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{avatarPreview ? 'Cambiar Foto' : 'Subir Mi Foto'}</span>
                  </button>
                </div>
              </div>

              {/* Nombre y Apellido */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Nombre y Apellido
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Claudio Rossi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>

              {/* Nombre Comercial / Fantasía */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Nombre Comercial / Fantasía
                </label>
                <input
                  type="text"
                  placeholder="Ej: Rossi Gas & Climatización"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>

              {/* Rubro Principal y Zona Principal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Rubro Principal
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Zona Principal
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all cursor-pointer"
                  >
                    {ARGENTINA_LOCATIONS.map((l) => (
                      <option key={l.id} value={l.name}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* WhatsApp con código de área */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  WhatsApp (con código de área)
                </label>
                <input
                  type="text"
                  required
                  placeholder="+54 9 11 1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>

              {/* Descripción Corta de tu Servicio */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Descripción Corta de tu Servicio
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contanos tu experiencia, especialidad y qué trabajos realizás..."
                  value={formData.shortBio}
                  onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>

              {/* Foto de Portada / Trabajos (Opcional) */}
              <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    Foto de Portada de Trabajos (Opcional)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {coverPreview ? 'Foto de trabajo cargada' : 'Adjuntá una foto de un arreglo o instalación real'}
                  </span>
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-brand-700 text-xs font-bold hover:bg-purple-50 transition-colors shadow-sm"
                >
                  <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                  <span>{coverPreview ? 'Cambiar' : 'Adjuntar'}</span>
                </button>
              </div>

              {/* Checkboxes: Matrícula y Urgencias */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
                
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={formData.isMatriculado}
                    onChange={(e) => setFormData({ ...formData, isMatriculado: e.target.checked })}
                    className="w-4 h-4 text-brand-700 rounded border-purple-300 focus:ring-brand-500 mt-0.5"
                  />
                  <span>Posee Matrícula Profesional Oficial (ENARGAS / COPIME / CACAAV)</span>
                </label>

                {formData.isMatriculado && (
                  <input
                    type="text"
                    placeholder="Número de matrícula oficial..."
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full text-xs p-2.5 bg-white rounded-xl border border-brand-300 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                )}

                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={formData.isEmergency247}
                    onChange={(e) => setFormData({ ...formData, isEmergency247: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded border-purple-300 focus:ring-rose-500 mt-0.5"
                  />
                  <span>Ofrezco atención de Urgencias / Guardias 24 Horas</span>
                </label>
              </div>

              {/* Botón Publicar */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-black text-xs sm:text-sm shadow-lg shadow-brand-700/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Upload className="w-4 h-4" />
                <span>Publicar mi Perfil de Prestador</span>
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
