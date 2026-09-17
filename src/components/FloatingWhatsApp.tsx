import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { STORE_PHONE, STORE_PHONE_INTL, STORE_OWNER_NAME } from '../data/initialData';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div
          id="whatsapp-tooltip"
          className="mb-2.5 max-w-xs bg-white text-neutral-800 p-3 rounded-2xl shadow-xl border border-rose-100 flex items-start space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 animate-ping" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-[#8d253c] leading-tight font-['Playfair_Display',serif] flex items-center">
              <span>{STORE_OWNER_NAME}</span>
              <Sparkles className="w-3 h-3 text-amber-500 ml-1" />
            </p>
            <p className="text-[11px] text-neutral-600 mt-0.5">
              ¿Deseas pagar con <strong>Yape (QR)</strong>, Plin o pedir una joya personalizada? ¡Escríbenos al <strong>{STORE_PHONE}</strong>!
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-neutral-600 p-0.5 -mr-1 -mt-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        id="btn-floating-whatsapp"
        href={`https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent(
          `¡Hola ${STORE_OWNER_NAME}! Deseo consultar por una joya y pagar con Yape o transferencia bancaria.`
        )}`}
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer"
        title={`Chat directo en WhatsApp con Valdivia Joyas: ${STORE_PHONE}`}
      >
        <MessageCircle className="w-8 h-8 fill-white" />
        {/* Active badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#be3e57] border-2 border-white rounded-full" />
      </a>
    </div>
  );
};
