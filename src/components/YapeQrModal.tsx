import React from 'react';
import { X, Smartphone, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { YapeQrCard } from './YapeQrCard';
import { STORE_PHONE, STORE_PHONE_INTL, STORE_OWNER_NAME } from '../data/initialData';

export const YapeQrModal: React.FC = () => {
  const { isYapeQrOpen, setIsYapeQrOpen, cartTotal } = useStore();

  if (!isYapeQrOpen) return null;

  return (
    <div
      id="yape-qr-modal-overlay"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsYapeQrOpen(false)}
    >
      <div
        id="yape-qr-modal-content"
        className="bg-white rounded-3xl max-w-sm w-full p-4 sm:p-5 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsYapeQrOpen(false)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Paga con Yape en Valdivia Joyas</span>
          </div>
          <h3 className="font-['Playfair_Display',serif] font-bold text-lg text-neutral-900">
            Código QR Oficial
          </h3>
        </div>

        {/* QR Card */}
        <YapeQrCard amount={cartTotal > 0 ? cartTotal : undefined} />

        {/* Action WhatsApp */}
        <div className="mt-3">
          <a
            href={`https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent(
              `¡Hola ${STORE_OWNER_NAME}! Deseo enviar mi constancia de pago por Yape.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Confirmar pago al WhatsApp {STORE_PHONE}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
