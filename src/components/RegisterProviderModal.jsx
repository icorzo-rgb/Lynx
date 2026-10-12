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
  Trash2,
  Sparkles,
  Bot,
  ToggleLeft,
  ToggleRight,
  Lightbulb,
  Check,
  RotateCw,
  MoreHorizontal,
  Droplets,
  Zap,
  Hammer,
  Paintbrush,
  Building2,
  Wrench
} from 'lucide-react';
import { CATEGORIES, ARGENTINA_LOCATIONS } from '../data/mockData';
import { AvatarDisplay } from './AvatarDisplay';

export const RegisterProviderModal = ({ 
  onClose, 
  onAddProvider, 
  onSelectProvider 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    category: 'plomeria',
    customCategory: '', // Para cuando selecciona 'otros' (Otros Oficios)
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

  // Estado del Asistente de IA para la descripción (activable/desactivable a voluntad)
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

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

  // Generador voluntario de sugerencias de IA
  const handleGenerateAiSuggestion = (type = 'standard') => {
    setIsGeneratingAi(true);

    const workerName = formData.name.trim() || 'Profesional';
    const tradeName = formData.category === 'otros' 
      ? (formData.customCategory.trim() || 'Oficio especializado')
      : (CATEGORIES.find(c => c.id === formData.category)?.name || 'Servicio');
    const locationName = formData.location || 'tu zona';

    setTimeout(() => {
      let suggestion = '';

      if (type === 'standard') {
        suggestion = `Cuento con más de 7 años de experiencia brindando servicios de ${tradeName} en ${locationName} y alrededores. Realizo reparaciones, nuevas instalaciones y mantenimiento integral con herramientas de precisión y materiales de primera calidad. Trabajo prolijo, puntualidad y presupuestos sin cargo.`;
      } else if (type === 'improve') {
        if (formData.shortBio.trim()) {
          suggestion = `Especialista en ${tradeName} en ${locationName}: ${formData.shortBio.trim()}. Nos destacamos por la rapidez en la atención, diagnóstico preciso, precios justos y garantía escrita en cada arreglo realizado.`;
        } else {
          suggestion = `Ofrezco atención profesional de ${tradeName} en ${locationName}. Brindo soluciones rápidas y duraderas para hogares y comercios, con presupuesto previo transparente y asesoramiento personalizado.`;
        }
      } else if (type === 'warranty') {
        suggestion = `Servicio integral de ${tradeName} con garantía y máxima responsabilidad en ${locationName}. Amplia trayectoria en el rubro, cumplimiento riguroso de normas de seguridad, atención personalizada y presupuesto sin compromiso. Tu consulta no molesta.`;
      } else if (type === 'fast') {
        suggestion = `Atención rápida de ${tradeName} en ${locationName}. Disponibilidad inmediata para urgencias y arreglos programados. Presupuestos transparentes sin sorpresas y resolución en el día para tu tranquilidad.`;
      }

      setAiSuggestion(suggestion);
      setIsGeneratingAi(false);
    }, 450);
  };

  const handleApplyAiSuggestion = () => {
    if (aiSuggestion) {
      setFormData((prev) => ({ ...prev, shortBio: aiSuggestion }));
      setAiSuggestion('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.shortBio.trim()) {
      return;
    }

    // Si seleccionó otros oficios y no escribió el nombre
    if (formData.category === 'otros' && !formData.customCategory.trim()) {
      alert('Por favor, escribí de qué oficio se trata en el campo "Otros Oficios".');
      return;
    }

    const categoryObj = CATEGORIES.find((c) => c.id === formData.category) || CATEGORIES[1];
    const finalCategoryName = formData.category === 'otros' 
      ? formData.customCategory.trim() 
      : categoryObj.name;

    const newProvider = {
      id: 'prov-custom-' + Date.now(),
      name: formData.name.trim(),
      businessName: formData.businessName.trim() || `${formData.name.trim()} - ${finalCategoryName}`,
      avatarUrl: avatarPreview || null,
      coverImageUrl: coverPreview || null,
      categoryId: formData.category,
      categoryName: finalCategoryName,
      customTrade: formData.category === 'otros' ? formData.customCategory.trim() : null,
      isMatriculado: formData.isMatriculado,
      hasInsurance: true,
      licenseNumber: formData.isMatriculado ? (formData.licenseNumber.trim() || 'Matrícula Oficial Verificada') : null,
      licenseDetails: formData.isMatriculado ? 'Matrícula oficial declarada y habilitada en Lynx.' : null,
      isIdentityVerified: true,
      isEmergency247: formData.isEmergency247,
      isAvailableNow: true,
      isUserCreated: true,
      // CERO PUNTUACIONES FICTICIAS EN AUTOMÁTICO: Arranca sin calificaciones hasta que usuarios reales lo puntúen
      rating: null,
      totalReviews: 0,
      reviews: [],
      locationName: formData.location,
      coverageAreaDescription: `Cobertura activa en ${formData.location} y localidades aledañas.`,
      distanceKm: 0.8,
      shortBio: formData.shortBio.trim(),
      extendedDescription: `${formData.shortBio.trim()}\n\nAtención profesional directa.`,
      servicesList: [finalCategoryName, 'Reparaciones', 'Instalación', 'Presupuestos'],
      pricing: {
        model: formData.hasFreeQuote ? 'FREE_QUOTE' : 'FIXED_VISIT',
        minVisitFeeArs: Number(formData.minVisitFeeArs) || 0,
        displayText: formData.hasFreeQuote ? 'Presupuesto sin cargo' : `Visita desde $${formData.minVisitFeeArs} ARS`
      },
      whatsappPhone: formData.phone.trim(),
      responseTime: '~5 min',
      portfolio: coverPreview ? [
        { id: 'p-custom-1', title: 'Trabajo realizado', imageUrl: coverPreview }
      ] : []
    };

    onAddProvider(newProvider);
    setCreatedProvider(newProvider);
    setSubmitted(true);
  };

  const tradePills = [
    { id: 'plomeria', name: 'Plomería' },
    { id: 'electricidad', name: 'Electricidad' },
    { id: 'gasistas', name: 'Gasista' },
    { id: 'pintura', name: 'Pintura' },
    { id: 'carpinteria', name: 'Carpintería' },
    { id: 'albanileria', name: 'Albañilería' },
    { id: 'instalaciones', name: 'Instalaciones' },
    { id: 'otros', name: 'Otros Oficios' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 p-5 sm:p-6 space-y-4 my-auto max-h-[94vh] flex flex-col">
        
        {/* Cabecera */}
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
          /* CASO: ÉXITO AL PUBLICAR */
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-purple-100 text-brand-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">¡Perfil Publicado con Éxito!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Tu oficio ya está activo en Lynx. Ya figurás en la lista de resultados para recibir contactos directos y calificaciones de clientes.
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
          /* FORMULARIO DE REGISTRO */
          <div className="overflow-y-auto flex-1 pr-1 space-y-4">
            
            {/* Header Tarjeta */}
            <div className="flex items-center gap-3 p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
              <div className="w-11 h-11 rounded-2xl bg-brand-700 text-white flex items-center justify-center shadow-sm shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-sm text-slate-900 leading-tight">
                  Sumá tu Oficio en Lynx
                </h3>
                <p className="text-[11px] text-purple-700 font-semibold">
                  Publicá tu servicio y empezá a recibir clientes
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Sección: Subir Foto de Perfil */}
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
                    Subí una foto tuya real o de tu equipo para mayor confianza.
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
                  Nombre Comercial / Fantasía (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Rossi Gas & Climatización"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>

              {/* REQUISITO 2: BOTONES DE OFICIO + BOTÓN "OTROS OFICIOS" CON ESCRITURA LIBRE */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Rubro de tu Oficio
                </label>

                {/* Botones de selección rápida de oficio */}
                <div className="flex flex-wrap gap-1.5">
                  {tradePills.map((pill) => {
                    const isSelected = formData.category === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: pill.id })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-brand-700 text-white border-brand-700 shadow-sm scale-102'
                            : 'bg-purple-50/70 text-slate-700 border-purple-100 hover:bg-purple-100'
                        }`}
                      >
                        {pill.id === 'otros' && <MoreHorizontal className="w-3.5 h-3.5 inline mr-1" />}
                        <span>{pill.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Campo de escritura libre cuando se toca en "Otros Oficios" */}
                {formData.category === 'otros' && (
                  <div className="p-3.5 rounded-2xl bg-brand-50/80 border-2 border-brand-300 animate-in fade-in slide-in-from-top-2 duration-200 space-y-1.5 mt-2">
                    <label className="text-xs font-black text-brand-900 flex items-center gap-1.5">
                      <span>¿De qué oficio se trata? (Escribí libremente tu especialidad)</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Ej: Cerrajero, Reparación de PC, Herrería, Tapicero, Jardinero..."
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-brand-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/30 outline-none transition-all font-bold text-slate-900 shadow-2xs"
                    />
                    <p className="text-[11px] text-brand-700">
                      Este oficio aparecerá publicado en tu tarjeta y perfil de Lynx.
                    </p>
                  </div>
                )}
              </div>

              {/* Zona Principal */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Zona Principal
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 bg-purple-50/50 focus:bg-white rounded-2xl border border-purple-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all cursor-pointer font-semibold text-slate-800"
                >
                  {ARGENTINA_LOCATIONS.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
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

              {/* Descripción de tu Servicio con Asistente Opcional */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Descripción de tu Servicio
                  </label>

                  {/* Interruptor del Agente de IA voluntario */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !aiAssistantEnabled;
                      setAiAssistantEnabled(nextState);
                      if (!nextState) setAiSuggestion('');
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all border ${
                      aiAssistantEnabled
                        ? 'bg-purple-100 border-brand-400 text-brand-800 shadow-sm'
                        : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700'
                    }`}
                    title={aiAssistantEnabled ? 'Desactivar agente de IA' : 'Activar sugerencias por IA'}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiAssistantEnabled ? 'text-brand-600 animate-pulse' : 'text-slate-400'}`} />
                    <span>Asistente IA: {aiAssistantEnabled ? 'ACTIVADO' : 'DESACTIVADO'}</span>
                    {aiAssistantEnabled ? (
                      <ToggleRight className="w-4 h-4 text-brand-700" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Panel Inteligente del Agente de IA */}
                {aiAssistantEnabled && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 via-brand-50/40 to-indigo-50/60 border border-brand-200/90 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-700 text-white flex items-center justify-center shadow-xs">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-brand-950 block">
                            Agente de Sugerencias IA
                          </span>
                          <span className="text-[10px] text-purple-700 font-semibold block">
                            Voluntario • Podés aplicar o ignorar las ideas
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAiAssistantEnabled(false)}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 bg-white/70 px-2 py-0.5 rounded-lg border border-purple-100"
                      >
                        Ocultar
                      </button>
                    </div>

                    {/* Botones de acción rápida */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        disabled={isGeneratingAi}
                        onClick={() => handleGenerateAiSuggestion('standard')}
                        className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-white border border-purple-200 text-brand-800 hover:bg-brand-50 hover:border-brand-400 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-brand-600" />
                        <span>Sugerir para mi oficio</span>
                      </button>

                      <button
                        type="button"
                        disabled={isGeneratingAi}
                        onClick={() => handleGenerateAiSuggestion('warranty')}
                        className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-white border border-purple-200 text-brand-800 hover:bg-brand-50 hover:border-brand-400 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Destacar garantía</span>
                      </button>

                      <button
                        type="button"
                        disabled={isGeneratingAi}
                        onClick={() => handleGenerateAiSuggestion('fast')}
                        className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-white border border-purple-200 text-brand-800 hover:bg-brand-50 hover:border-brand-400 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Flame className="w-3 h-3 text-rose-500" />
                        <span>Enfoque rapidez</span>
                      </button>

                      {formData.shortBio.trim() && (
                        <button
                          type="button"
                          disabled={isGeneratingAi}
                          onClick={() => handleGenerateAiSuggestion('improve')}
                          className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-white border border-purple-200 text-brand-800 hover:bg-brand-50 hover:border-brand-400 transition-colors shadow-2xs flex items-center gap-1"
                        >
                          <RotateCw className="w-3 h-3 text-indigo-600" />
                          <span>Mejorar mi texto</span>
                        </button>
                      )}
                    </div>

                    {/* Previsualización de la Sugerencia Generada */}
                    {aiSuggestion && (
                      <div className="bg-white p-3 rounded-xl border border-brand-200 space-y-2 shadow-sm animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between text-[11px] font-bold text-brand-900 border-b border-purple-50 pb-1">
                          <span className="flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            Sugerencia redactada por la IA:
                          </span>
                          <button
                            type="button"
                            onClick={() => setAiSuggestion('')}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed italic">
                          "{aiSuggestion}"
                        </p>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setAiSuggestion('')}
                            className="px-2.5 py-1 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                          >
                            Descartar
                          </button>

                          <button
                            type="button"
                            onClick={handleApplyAiSuggestion}
                            className="px-3 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-xs font-black shadow-xs flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aplicar al formulario</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Textarea de la Descripción */}
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
