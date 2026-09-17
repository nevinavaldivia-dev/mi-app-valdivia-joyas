import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, MessageCircle, Database, Sparkles, QrCode } from 'lucide-react';
import { STORE_PHONE, STORE_PHONE_INTL, STORE_OWNER_NAME } from '../data/initialData';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setIsAdminOpen, setIsOrderTrackerOpen, setIsYapeQrOpen } = useStore();

  return (
    <footer id="valdivia-footer" className="bg-[#240b12] text-rose-100/80 pt-10 pb-8 mt-12 border-t border-rose-900/40">
      <div className="max-w-7xl mx-auto px-4">
        {/* Value propositions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-rose-900/30 text-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Envío Asegurado a Todo el Perú</p>
              <p className="text-rose-200/70 mt-0.5">Envíos discretos y con seguro incluido a Lima y provincias.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Pagos con QR Yape & Plin</p>
              <p className="text-rose-200/70 mt-0.5">Escanea nuestro código QR oficial al {STORE_PHONE} sin comisiones.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Certificado de Autenticidad</p>
              <p className="text-rose-200/70 mt-0.5">Oro 18K y Plata Ley 925 con sello de garantía permanente.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Asesoría Personalizada</p>
              <p className="text-rose-200/70 mt-0.5">Atención directa por WhatsApp al <strong>{STORE_PHONE}</strong>.</p>
            </div>
          </div>
        </div>

        {/* Links and Payment Badges */}
        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs border-b border-rose-900/30">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-rose-300 flex items-center justify-center text-[#240b12] font-serif font-bold text-xs shadow-xs">
                VJ
              </div>
              <span className="font-['Playfair_Display',serif] font-bold text-lg text-white tracking-wide">
                Valdivia Joyas
              </span>
            </div>
            <p className="text-rose-200/70 text-[11px] leading-relaxed">
              Taller de alta joyería peruana. Diseñamos y elaboramos anillos de compromiso, aros de matrimonio, collares y aretes exclusivos.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2">Medios de Pago Autorizados</h4>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setIsYapeQrOpen(true)}
                className="px-2.5 py-1 bg-purple-900/70 text-purple-200 border border-purple-600/50 rounded-lg hover:bg-purple-800 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <QrCode className="w-3 h-3" />
                <span>QR YAPE ({STORE_PHONE})</span>
              </button>
              <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800/50 rounded-lg">
                💙 PLIN
              </span>
              <span className="px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-800/50 rounded-lg">
                🏦 BCP Soles
              </span>
              <span className="px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-800/50 rounded-lg">
                🏛️ BBVA
              </span>
              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/50 rounded-lg">
                🟢 Interbank
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2">Servicios al Cliente</h4>
            <ul className="space-y-1.5 text-rose-200/75">
              <li>
                <button
                  onClick={() => setIsYapeQrOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center text-purple-300 font-semibold"
                >
                  <QrCode className="w-3.5 h-3.5 mr-1" />
                  Ver Código QR de Yape
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsOrderTrackerOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Rastrear Envío de Joyas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-amber-300 text-amber-400 transition-colors cursor-pointer flex items-center"
                >
                  <Database className="w-3.5 h-3.5 mr-1" />
                  Base de Datos (Inventario y Clientes)
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent('Hola Valdivia Joyas, deseo una cotización de una joya.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 flex items-center transition-colors text-emerald-400 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  WhatsApp Asesoría: {STORE_PHONE}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2">Garantía y Embalaje</h4>
            <p className="text-[11px] text-rose-200/70 leading-relaxed">
              Cada joya se entrega en un estuche de lujo con paño de pulido y tarjeta de autenticidad. El inventario se actualiza automáticamente con cada compra online.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-rose-300/50 gap-2">
          <p>© 2026 Valdivia Joyas. Alta Joyería y Orfebrería Fina en Perú. Consultas al WhatsApp {STORE_PHONE}.</p>
          <div className="flex items-center space-x-4">
            <span className="text-rose-300/70">Garantía de Metales</span>
            <span className="text-rose-300/70">Términos de Envío</span>
            <span className="text-rose-300/70">Libro de Reclamaciones</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
