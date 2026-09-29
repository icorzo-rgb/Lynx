import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  X, 
  Send, 
  Plus, 
  Phone, 
  CheckCheck 
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

export const ChatModal = ({ provider, onClose, onOpenWhatsApp }) => {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'user',
      text: `Hola ${provider?.name || ''}, quisiera consultarte sobre un trabajo en mi zona. ¿Tenés disponibilidad?`,
      time: '10:04',
      isRead: true
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!provider) return null;

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text: inputText.trim(),
      time: currentTime,
      isRead: true
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = `Hola! Sí, estoy disponible. Contame con más detalle o si querés coordinamos una visita técnica para presupuestar.`;
      if (provider.isEmergency247) {
        reply = `Hola! Recibido. Al tener servicio de guardia activa puedo acercarme a la brevedad si es una urgencia.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'm-reply-' + Date.now(),
          sender: 'provider',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        }
      ]);
    }, 1400);
  };

  const handleAttachRealPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = {
          id: 'm-img-' + Date.now(),
          sender: 'user',
          text: 'Te adjunto foto de la situación:',
          image: reader.result,
          time: currentTime,
          isRead: true
        };

        setMessages((prev) => [...prev, userMsg]);

        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: 'm-reply-img-' + Date.now(),
              sender: 'provider',
              text: 'Recibí la foto perfectamente. Ya veo el trabajo a realizar.',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isRead: true
            }
          ]);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden h-[90vh] flex flex-col border border-purple-100">
        
        {/* Cabecera del Chat */}
        <div className="p-3.5 bg-white border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-purple-50 transition-colors"
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

            <div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                {provider.name}
              </h3>
              <span className="text-[11px] text-brand-700 font-semibold flex items-center gap-1">
                {provider.locationName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
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

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8FF]">
          
          <div className="text-center my-2">
            <span className="px-3 py-1 bg-purple-100/70 text-purple-900 text-[10px] font-bold rounded-full">
              Conversación directa Lynx
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-brand-700 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-purple-100 rounded-bl-none'
                }`}
              >
                {msg.text}

                {msg.image && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-purple-200">
                    <img src={msg.image} alt="Adjunto real" className="w-full h-40 object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                <span>{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-brand-600" />}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-purple-100 text-xs text-brand-700 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium ml-1">{provider.name} está respondiendo...</span>
            </div>
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

          {/* Botón (+) para adjuntar foto real desde dispositivo */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 text-brand-700 flex items-center justify-center transition-colors shrink-0"
            title="Adjuntar foto de tu dispositivo"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Input de texto */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribí un mensaje..."
            className="flex-1 text-xs sm:text-sm p-3 bg-purple-50/60 focus:bg-white rounded-2xl border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
          />

          {/* Botón Enviar Violeta */}
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
