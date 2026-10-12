import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  X, 
  Send, 
  Plus, 
  Phone, 
  CheckCheck,
  User,
  Wrench,
  Trash2
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

export const ChatModal = ({ provider, onClose, onOpenWhatsApp }) => {
  if (!provider) return null;

  const storageKey = `lynx_chat_direct_${provider.id}`;

  // Cargar historial de chat específico sin ningún mensaje automático generado
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filtrar cualquier mensaje preconfigurado viejo para garantizar que solo haya mensajes manuales
          return parsed.filter(m => m.id !== 'm1' && !m.id?.startsWith('m-reply-') && !m.id?.startsWith('m-reply'));
        }
      }
    } catch (e) {
      console.warn('Error loading chat:', e);
    }
    return [];
  });

  // Selector de emisor: 'user' (usuario que consulta) o 'provider' (el trabajador respondiendo a voluntad)
  const [senderRole, setSenderRole] = useState('user');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Guardar en localStorage cuando cambian los mensajes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.warn('Error saving chat:', e);
    }
  }, [messages, storageKey]);

  // Enviar mensaje manual: CERO respuestas automáticas por IA
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: 'm-' + Date.now(),
      sender: senderRole, // 'user' o 'provider' según quién decida responder a voluntad
      senderName: senderRole === 'user' ? 'Usuario que consulta' : provider.name,
      text: inputText.trim(),
      time: currentTime,
      isRead: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleAttachRealPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMsg = {
          id: 'm-img-' + Date.now(),
          sender: senderRole,
          senderName: senderRole === 'user' ? 'Usuario que consulta' : provider.name,
          text: senderRole === 'user' ? 'Foto adjuntada por el usuario:' : 'Foto o muestra enviada por el trabajador:',
          image: reader.result,
          time: currentTime,
          isRead: true
        };

        setMessages((prev) => [...prev, newMsg]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('¿Deseas vaciar la conversación de este chat?')) {
      setMessages([]);
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden h-[90vh] flex flex-col border border-purple-100">
        
        {/* Cabecera del Chat */}
        <div className="p-3.5 bg-white border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-purple-50 transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <AvatarDisplay
              name={provider.name}
              avatarUrl={provider.avatarUrl}
              size="sm"
              showStatus={true}
              isAvailable={provider.isAvailableNow}
            />

            <div className="min-w-0">
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight truncate">
                {provider.name}
              </h3>
              <span className="text-[11px] text-brand-700 font-semibold block truncate">
                {provider.businessName || provider.categoryName} • {provider.locationName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Vaciar chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onOpenWhatsApp(provider)}
              className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Abrir en WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selector de Emisor: permite que el usuario o el trabajador respondan a voluntad */}
        <div className="px-3.5 py-2.5 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-700">Responder como:</span>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-purple-200 shadow-2xs text-xs">
            <button
              type="button"
              onClick={() => setSenderRole('user')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                senderRole === 'user'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-brand-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Usuario</span>
            </button>

            <button
              type="button"
              onClick={() => setSenderRole('provider')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                senderRole === 'provider'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-brand-700'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Trabajador ({provider.name.split(' ')[0]})</span>
            </button>
          </div>
        </div>

        {/* Contenedor de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8FF]">
          
          <div className="text-center my-1">
            <span className="px-3 py-1 bg-purple-100/70 text-purple-900 text-[10px] font-bold rounded-full">
              Chat Directo • Sin mensajes automáticos
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="py-14 px-4 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-100/80 text-brand-700 flex items-center justify-center mx-auto shadow-inner">
                <AvatarDisplay
                  name={provider.name}
                  avatarUrl={provider.avatarUrl}
                  size="md"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">
                  Chat con {provider.name}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Iniciá la conversación cuando desees. Ninguna inteligencia artificial responde por el trabajador ni se envían mensajes automáticos.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">
                  {msg.sender === 'user' ? 'Usuario' : `${provider.name} (Trabajador)`}
                </span>

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-700 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-purple-100 rounded-bl-none shadow-soft'
                  }`}
                >
                  {msg.text}

                  {msg.image && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-purple-200 bg-white">
                      <img src={msg.image} alt="Adjunto" className="w-full h-40 object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-brand-600" />}
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Barra de Entrada de Mensajes */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-purple-100 flex items-center gap-2">
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAttachRealPhoto}
            className="hidden"
          />

          {/* Botón (+) para adjuntar foto */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 text-brand-700 flex items-center justify-center transition-colors shrink-0"
            title="Adjuntar foto"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Input de texto */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              senderRole === 'user' 
                ? `Escribí tu consulta a ${provider.name.split(' ')[0]}...` 
                : `Respuesta de ${provider.name.split(' ')[0]}...`
            }
            className="flex-1 text-xs sm:text-sm p-3 bg-purple-50/60 focus:bg-white rounded-2xl border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
          />

          {/* Botón Enviar */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-brand-700/25 transition-all shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
