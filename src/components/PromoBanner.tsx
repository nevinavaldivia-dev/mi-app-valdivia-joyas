import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, ShieldCheck, Truck, Smartphone, QrCode, Gem } from 'lucide-react';
import { STORE_PHONE, STORE_OWNER_NAME } from '../data/initialData';
import { useStore } from '../context/StoreContext';

export const PromoBanner: React.FC = () => {
  const { setIsYapeQrOpen } = useStore();
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 38,
    seconds: 24,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      {/* Exclusive Jewelry Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6e182f] via-[#942944] to-[#b33956] text-white p-5 sm:p-7 shadow-xl border border-rose-300/30">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Left Text */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 bg-white/15 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold text-amber-200 uppercase tracking-widest border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>TEMPORADA DE GALA • VALDIVIA JOYAS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-['Playfair_Display',serif] font-bold tracking-tight text-white drop-shadow-sm">
              Hasta 68% Dcto. en Joyas de Oro & Plata 925
            </h1>

            <p className="text-xs sm:text-sm text-rose-100 max-w-xl font-normal leading-relaxed">
              Descubre anillos de compromiso, collares de perlas y brazaletes de lujo.
              Paga al instante escaneando el <strong>QR Yape</strong>, <strong>Plin</strong> o transferencias al <strong>{STORE_PHONE}</strong>.
            </p>

            {/* Quick QR & WhatsApp action buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <button
                id="banner-btn-open-yape-qr"
                onClick={() => setIsYapeQrOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-700/90 hover:bg-purple-600 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition-all active:scale-95 cursor-pointer border border-purple-400/40"
              >
                <QrCode className="w-4 h-4 text-[#00d3b8]" />
                <span>Pagar con QR Yape</span>
              </button>

              <span className="text-xs text-rose-200 hidden sm:inline">
                Titular: <strong>{STORE_OWNER_NAME}</strong>
              </span>
            </div>
          </div>

          {/* Countdown Clock for Special Jewelry Sale */}
          <div className="bg-[#481120]/80 backdrop-blur-md rounded-2xl p-4 text-center border border-rose-300/20 shrink-0 shadow-lg">
            <div className="flex items-center justify-center space-x-1 text-amber-300 text-[11px] font-bold mb-1.5 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 mr-1 text-amber-300" />
              <span>Ofertas del día terminan en:</span>
            </div>
            <div className="flex items-center space-x-2 text-white font-mono font-black text-xl sm:text-2xl">
              <div className="flex flex-col items-center">
                <span className="bg-black/50 px-2.5 py-1.5 rounded-lg text-amber-300 border border-amber-400/20">
                  {formatDigit(timeLeft.hours)}
                </span>
                <span className="text-[9px] text-rose-200 font-sans font-medium mt-1">Horas</span>
              </div>
              <span className="text-amber-300 text-lg -mt-3">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-black/50 px-2.5 py-1.5 rounded-lg text-amber-300 border border-amber-400/20">
                  {formatDigit(timeLeft.minutes)}
                </span>
                <span className="text-[9px] text-rose-200 font-sans font-medium mt-1">Min</span>
              </div>
              <span className="text-amber-300 text-lg -mt-3">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-black/50 px-2.5 py-1.5 rounded-lg text-amber-300 border border-amber-400/20">
                  {formatDigit(timeLeft.seconds)}
                </span>
                <span className="text-[9px] text-rose-200 font-sans font-medium mt-1">Seg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background sparkle */}
        <div className="absolute -right-8 -bottom-12 opacity-15 pointer-events-none">
          <Gem className="w-64 h-64 text-rose-200" />
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="mt-3.5 grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        <div className="flex items-center space-x-2.5 bg-white p-3 rounded-2xl border border-rose-200/80 text-neutral-800 shadow-xs hover:border-rose-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-[#9d2d44] shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs text-neutral-900 leading-tight">Envío Asegurado Gratis</p>
            <p className="text-[11px] text-neutral-500">A todo el Perú con Olva</p>
          </div>
        </div>

        <div
          onClick={() => setIsYapeQrOpen(true)}
          className="flex items-center space-x-2.5 bg-white p-3 rounded-2xl border border-rose-200/80 text-neutral-800 shadow-xs hover:border-purple-300 transition-colors cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#742284] group-hover:bg-purple-100 shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs text-purple-900 leading-tight flex items-center">
              QR Yape & Plin
              <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#00d3b8]" />
            </p>
            <p className="text-[11px] text-neutral-500 font-mono">Al 959 673 107</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 bg-white p-3 rounded-2xl border border-rose-200/80 text-neutral-800 shadow-xs hover:border-rose-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs text-neutral-900 leading-tight">Joyería Certificada</p>
            <p className="text-[11px] text-neutral-500">Oro 18K & Plata Ley 925</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 bg-white p-3 rounded-2xl border border-rose-200/80 text-neutral-800 shadow-xs hover:border-rose-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs text-neutral-900 leading-tight">Estuche de Regalo</p>
            <p className="text-[11px] text-neutral-500">Listo para entregar</p>
          </div>
        </div>
      </div>
    </div>
  );
};
