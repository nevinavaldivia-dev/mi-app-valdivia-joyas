import React, { useState } from 'react';
import { X, Search, PackageCheck, CheckCircle2, Clock, ShieldAlert, MessageCircle, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_PHONE, STORE_PHONE_INTL, STORE_OWNER_NAME } from '../data/initialData';
import { OrderStatus } from '../types';

export const OrderTrackerModal: React.FC = () => {
  const { isOrderTrackerOpen, setIsOrderTrackerOpen, orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOrderTrackerOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanTerm = searchTerm.trim().toUpperCase().replace('#', '');
    const found = orders.find(
      (o) =>
        o.id.toUpperCase().includes(cleanTerm) ||
        o.customer.phone.includes(cleanTerm) ||
        o.customer.documentNumber.includes(cleanTerm)
    );
    setSearchedOrder(found || null);
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pendiente', label: 'Pedido Registrado', desc: 'Comprobante recibido en sistema' },
    { key: 'confirmado', label: 'Pago Confirmado', desc: 'Verificado por Yape / Plin / Banco' },
    { key: 'empaquetando', label: 'En Taller y Joyero', desc: 'Limpieza, estuche y certificado' },
    { key: 'en_camino', label: 'En Camino', desc: 'Despachado con Olva / Shalom Courier' },
    { key: 'entregado', label: 'Entregado', desc: 'Recibido en tu domicilio' },
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderRanks: Record<OrderStatus, number> = {
      pendiente: 1,
      confirmado: 2,
      empaquetando: 3,
      en_camino: 4,
      entregado: 5,
      cancelado: 0,
    };

    const currentRank = orderRanks[currentStatus] || 1;
    const stepRank = orderRanks[stepKey] || 1;

    if (stepRank < currentRank) return 'completed';
    if (stepRank === currentRank) return 'current';
    return 'upcoming';
  };

  return (
    <div
      id="order-tracker-modal-overlay"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsOrderTrackerOpen(false)}
    >
      <div
        id="order-tracker-modal-content"
        className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center space-x-2">
            <PackageCheck className="w-5 h-5 text-[#8d253c]" />
            <h3 className="font-['Playfair_Display',serif] font-bold text-base text-neutral-900">
              Rastrear Pedido de Joyas
            </h3>
          </div>
          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="mt-4">
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Ingresa tu Código de Pedido o Número de Teléfono:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              required
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: VJ-PE-95901 o 987654321"
              className="flex-1 h-10 px-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 outline-hidden bg-rose-50/20 font-mono"
            />
            <button
              type="submit"
              className="px-4 bg-gradient-to-r from-[#be3e57] to-[#9d2d44] hover:from-[#aa324a] hover:to-[#882238] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </button>
          </div>
        </form>

        {/* Search Result */}
        {hasSearched && (
          <div className="mt-5">
            {searchedOrder ? (
              <div className="bg-rose-50/40 rounded-2xl p-4 border border-rose-100 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-rose-200/70">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold">PEDIDO</span>
                    <p className="font-mono font-black text-sm text-[#8d253c]">#{searchedOrder.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold">DESTINATARIO</span>
                    <p className="text-xs font-bold text-neutral-900">{searchedOrder.customer.name}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3 py-1">
                  {steps.map((step) => {
                    const status = getStepStatus(step.key, searchedOrder.status);
                    return (
                      <div key={step.key} className="flex items-start space-x-3 text-xs">
                        <div className="mt-0.5">
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : status === 'current' ? (
                            <Clock className="w-4 h-4 text-[#8d253c] animate-pulse" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-rose-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-bold ${
                              status === 'completed'
                                ? 'text-neutral-800'
                                : status === 'current'
                                ? 'text-[#8d253c]'
                                : 'text-neutral-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] text-neutral-500">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* WhatsApp Help */}
                <a
                  href={`https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent(
                    `Hola ${STORE_OWNER_NAME}, deseo consultar el estado de mi pedido de joyas #${searchedOrder.id} a nombre de ${searchedOrder.customer.name}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Consultar por WhatsApp ({STORE_PHONE})</span>
                </a>
              </div>
            ) : (
              <div className="text-center py-6 bg-rose-50/40 rounded-2xl border border-rose-100 text-neutral-500 text-xs">
                <ShieldAlert className="w-8 h-8 mx-auto text-amber-500 mb-1" />
                <p className="font-semibold text-neutral-800">No se encontró ningún pedido con ese código</p>
                <p className="text-[11px] mt-1">Verifica el código o tu número de teléfono e intenta nuevamente.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
