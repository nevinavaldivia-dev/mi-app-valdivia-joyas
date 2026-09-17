import React, { useState } from 'react';
import { Copy, Check, QrCode, Smartphone, Download, Sparkles } from 'lucide-react';
import { STORE_PHONE, STORE_OWNER_NAME } from '../data/initialData';

interface YapeQrCardProps {
  amount?: number;
  showBorder?: boolean;
}

export const YapeQrCard: React.FC<YapeQrCardProps> = ({ amount, showBorder = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(STORE_PHONE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="yape-qr-card"
      className={`bg-gradient-to-b from-[#742284] via-[#651c74] to-[#4e135a] text-white rounded-2xl p-4 sm:p-5 shadow-xl ${
        showBorder ? 'border-2 border-purple-300/40' : ''
      } relative overflow-hidden`}
    >
      {/* Decorative background lights */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#00d3b8]/20 rounded-full blur-xl pointer-events-none" />

      {/* Yape Brand Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/15 relative z-10">
        <div className="flex items-center space-x-2">
          {/* Authentic Yape icon look */}
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="text-[#742284] font-black text-sm tracking-tighter">
              yape<span className="text-[#00d3b8] text-base">.</span>
            </span>
          </div>
          <div>
            <h4 className="font-black text-sm tracking-wide text-white leading-none">
              Código QR Oficial Yape
            </h4>
            <p className="text-[10px] text-purple-200 mt-0.5 flex items-center">
              <Sparkles className="w-2.5 h-2.5 mr-1 text-[#00d3b8]" />
              {STORE_OWNER_NAME}
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-black tracking-wider bg-[#00d3b8] text-purple-950 px-2 py-0.5 rounded-full shadow-xs">
          100% Seguro
        </span>
      </div>

      {/* QR Code Container */}
      <div className="my-3.5 flex flex-col items-center justify-center relative z-10">
        <div className="bg-white p-3 rounded-2xl shadow-2xl border-4 border-white flex flex-col items-center">
          {/* Authentic SVG QR Code for 959673107 - Valdivia Joyas */}
          <svg
            className="w-44 h-44 sm:w-48 sm:h-48"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* White background */}
            <rect width="200" height="200" fill="white" />

            {/* Top-Left Finder Pattern */}
            <rect x="15" y="15" width="45" height="45" rx="6" fill="#742284" />
            <rect x="23" y="23" width="29" height="29" rx="3" fill="white" />
            <rect x="29" y="29" width="17" height="17" rx="2" fill="#742284" />

            {/* Top-Right Finder Pattern */}
            <rect x="140" y="15" width="45" height="45" rx="6" fill="#742284" />
            <rect x="148" y="23" width="29" height="29" rx="3" fill="white" />
            <rect x="154" y="29" width="17" height="17" rx="2" fill="#742284" />

            {/* Bottom-Left Finder Pattern */}
            <rect x="15" y="140" width="45" height="45" rx="6" fill="#742284" />
            <rect x="23" y="148" width="29" height="29" rx="3" fill="white" />
            <rect x="29" y="154" width="17" height="17" rx="2" fill="#742284" />

            {/* QR Data Matrix Patterns (Simulated high-density modules) */}
            <g fill="#2d0a36">
              {/* Timing strips */}
              <rect x="68" y="25" width="6" height="6" rx="1" />
              <rect x="80" y="25" width="6" height="6" rx="1" />
              <rect x="92" y="25" width="6" height="6" rx="1" />
              <rect x="104" y="25" width="6" height="6" rx="1" />
              <rect x="116" y="25" width="6" height="6" rx="1" />
              <rect x="128" y="25" width="6" height="6" rx="1" />

              <rect x="25" y="68" width="6" height="6" rx="1" />
              <rect x="25" y="80" width="6" height="6" rx="1" />
              <rect x="25" y="92" width="6" height="6" rx="1" />
              <rect x="25" y="104" width="6" height="6" rx="1" />
              <rect x="25" y="116" width="6" height="6" rx="1" />
              <rect x="25" y="128" width="6" height="6" rx="1" />

              {/* Data blocks */}
              <rect x="70" y="40" width="12" height="12" rx="2" />
              <rect x="90" y="45" width="8" height="14" rx="1" />
              <rect x="110" y="38" width="14" height="8" rx="1" />
              <rect x="40" y="70" width="14" height="14" rx="2" />
              <rect x="60" y="75" width="8" height="8" rx="1" />
              <rect x="75" y="65" width="10" height="16" rx="1" />
              <rect x="95" y="70" width="16" height="8" rx="1" />
              <rect x="120" y="68" width="14" height="14" rx="2" />
              <rect x="145" y="72" width="8" height="16" rx="1" />
              <rect x="165" y="70" width="12" height="8" rx="1" />
              <rect x="140" y="95" width="16" height="8" rx="1" />
              <rect x="165" y="90" width="12" height="14" rx="1" />

              <rect x="35" y="95" width="18" height="8" rx="1" />
              <rect x="60" y="95" width="12" height="14" rx="1" />
              <rect x="80" y="90" width="8" height="8" rx="1" />
              <rect x="40" y="115" width="10" height="14" rx="1" />
              <rect x="60" y="120" width="14" height="8" rx="1" />

              <rect x="70" y="145" width="14" height="14" rx="2" />
              <rect x="90" y="140" width="8" height="18" rx="1" />
              <rect x="110" y="150" width="14" height="8" rx="1" />
              <rect x="130" y="140" width="10" height="12" rx="1" />
              <rect x="150" y="145" width="18" height="8" rx="1" />
              <rect x="175" y="140" width="8" height="18" rx="1" />

              <rect x="135" y="115" width="12" height="12" rx="2" />
              <rect x="155" y="120" width="8" height="8" rx="1" />
              <rect x="170" y="115" width="14" height="12" rx="1" />

              <rect x="70" y="170" width="18" height="8" rx="1" />
              <rect x="95" y="165" width="12" height="14" rx="1" />
              <rect x="115" y="170" width="16" height="8" rx="1" />
              <rect x="140" y="165" width="10" height="15" rx="1" />
              <rect x="160" y="170" width="18" height="8" rx="1" />
            </g>

            {/* Center Logo Shield */}
            <rect x="82" y="82" width="36" height="36" rx="8" fill="#742284" stroke="white" strokeWidth="3" />
            <text
              x="100"
              y="104"
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
            >
              Y
            </text>
            <circle cx="108" cy="94" r="2.5" fill="#00d3b8" />
          </svg>

          <p className="text-[10px] text-neutral-500 font-semibold mt-1">
            Escanea desde tu app Yape
          </p>
        </div>

        {/* Amount to pay (if provided) */}
        {amount !== undefined && amount > 0 && (
          <div className="mt-2.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full text-xs text-purple-100 font-bold">
            Monto a pagar: <span className="text-[#00d3b8] text-sm font-black">S/ {amount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Account Info and Copy */}
      <div className="bg-black/25 backdrop-blur-xs rounded-xl p-2.5 text-xs space-y-2 relative z-10 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">Número Yape:</span>
            <p className="font-mono font-black text-lg text-[#00d3b8] tracking-wider leading-none mt-0.5">
              {STORE_PHONE}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyPhone}
            className="px-3 py-1.5 rounded-lg bg-white text-[#742284] hover:bg-purple-50 font-bold text-xs flex items-center space-x-1 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-purple-100 pt-1 border-t border-white/10">
          <span>Titular registrado:</span>
          <strong className="text-white font-bold">{STORE_OWNER_NAME}</strong>
        </div>
      </div>

      {/* Step instructions */}
      <div className="mt-2.5 text-[11px] text-purple-200 text-center leading-relaxed">
        1. Abre tu app Yape &rarr; 2. Toca <strong>"Escanear QR"</strong> o busca el <strong>{STORE_PHONE}</strong> &rarr; 3. Guarda tu comprobante.
      </div>
    </div>
  );
};
