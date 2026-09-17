import React from 'react';
import { Search, ShoppingCart, MessageCircle, Database, PackageCheck, Zap, ShieldCheck, Sparkles, X, QrCode } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_PHONE, STORE_PHONE_INTL, STORE_OWNER_NAME } from '../data/initialData';

export const Header: React.FC = () => {
  const {
    cartCount,
    cartTotal,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    setIsAdminOpen,
    setIsOrderTrackerOpen,
    setIsYapeQrOpen,
    setSelectedCategory,
    stats,
  } = useStore();

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  return (
    <header id="valdivia-main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-rose-100">
      {/* Top Notification Strip */}
      <div id="valdivia-top-strip" className="bg-[#4a1525] text-rose-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="flex items-center text-amber-300 font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300 animate-pulse" />
              ENVÍO GRATIS A TODO EL PERÚ + ESTUCHE DE REGALO
            </span>
            <span className="hidden sm:inline text-rose-300/40">|</span>
            <span className="hidden sm:flex items-center text-rose-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Certificado de Autenticidad en Oro 18K & Plata 925
            </span>
            <span className="hidden md:inline text-rose-300/40">|</span>
            <span className="hidden md:inline text-rose-200">
              Paga fácil con Yape (QR), Plin y Transferencias
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs ml-auto">
            <button
              onClick={() => setIsYapeQrOpen(true)}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-purple-700/80 hover:bg-purple-600 text-white font-bold text-[11px] transition-colors cursor-pointer"
            >
              <QrCode className="w-3 h-3 text-[#00d3b8]" />
              <span>Ver QR Yape</span>
            </button>

            <a
              id="header-whatsapp-top-link"
              href={`https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent(
                'Hola Valdivia Joyas, deseo consultar sobre una pieza o pedido.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1 fill-emerald-500 text-emerald-500" />
              WhatsApp: <strong className="ml-1 text-white">{STORE_PHONE}</strong>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 lg:gap-6">
          {/* Valdivia Joyas Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="btn-home-logo"
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9d2d44] via-[#c44d67] to-[#e8879b] text-white flex items-center justify-center shadow-md mr-2 ring-2 ring-rose-200">
                  <Sparkles className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-['Playfair_Display',serif] font-bold tracking-tight text-[#751b32] group-hover:text-[#9d2d44] transition-colors">
                    Valdivia Joyas
                  </span>
                  <p className="text-[10px] text-[#9d2d44]/80 uppercase tracking-widest font-semibold -mt-1 hidden sm:block">
                    Joyería Fina & Exclusiva • Perú
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <input
                id="input-global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca anillos, collares, pulseras, aretes, plata 925, oro..."
                className="w-full h-11 pl-4 pr-24 rounded-full border-2 border-rose-200 focus:border-[#be3e57] focus:outline-hidden focus:ring-2 focus:ring-rose-300/40 text-sm placeholder:text-neutral-400 bg-rose-50/40 text-neutral-900 shadow-inner"
              />
              {searchQuery && (
                <button
                  id="btn-clear-search"
                  onClick={handleSearchClear}
                  className="absolute right-14 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                id="btn-submit-search"
                className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-[#be3e57] to-[#9d2d44] hover:from-[#aa324a] hover:to-[#882238] text-white rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Direct Yape QR Button */}
            <button
              id="header-btn-yape-qr"
              onClick={() => setIsYapeQrOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#742284] border border-purple-200 transition-colors text-xs font-bold cursor-pointer shadow-xs"
              title="Ver código QR oficial de Yape"
            >
              <QrCode className="w-4 h-4 text-[#742284]" />
              <span className="hidden sm:inline">QR Yape</span>
            </button>

            {/* Direct WhatsApp button */}
            <a
              id="header-btn-whatsapp"
              href={`https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent(
                '¡Hola Valdivia Joyas! Deseo realizar una consulta sobre sus joyas.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors text-xs font-semibold"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp: <strong>{STORE_PHONE}</strong></span>
            </a>

            {/* Track Orders Button */}
            <button
              id="btn-open-order-tracker"
              onClick={() => setIsOrderTrackerOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-rose-50 text-neutral-700 hover:text-rose-900 transition-colors text-xs font-medium cursor-pointer"
              title="Rastrear mi pedido con código"
            >
              <PackageCheck className="w-4 h-4 text-rose-700" />
              <span className="hidden md:inline">Rastrear Pedido</span>
            </button>

            {/* Database & Admin Panel Button */}
            <button
              id="btn-open-admin-db"
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#9d2d44] border border-rose-200 transition-colors text-xs font-bold relative cursor-pointer"
              title="Panel de Base de Datos e Inventario"
            >
              <Database className="w-4 h-4" />
              <span className="hidden md:inline">Base de Datos</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] bg-[#9d2d44] text-white font-bold ml-1">
                {stats.totalProducts}
              </span>
            </button>

            {/* Shopping Cart Button */}
            <button
              id="btn-open-cart"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#be3e57] to-[#9d2d44] hover:from-[#aa324a] hover:to-[#882238] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute -top-2 -right-2.5 bg-amber-300 text-neutral-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono font-bold">S/ {cartTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Category Bar */}
      <div className="bg-[#fff8fa] border-b border-rose-100 px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-4 text-xs font-medium whitespace-nowrap">
          <button
            id="nav-cat-todos"
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
            }}
            className="text-neutral-900 font-bold hover:text-[#9d2d44] flex items-center transition-colors cursor-pointer"
          >
            💎 Colección Completa
          </button>
          <span className="text-rose-200">|</span>
          <button
            id="nav-cat-anillos"
            onClick={() => setSelectedCategory('Anillos & Compromiso')}
            className="text-neutral-700 hover:text-[#9d2d44] transition-colors cursor-pointer"
          >
            💍 Anillos & Compromiso
          </button>
          <button
            id="nav-cat-collares"
            onClick={() => setSelectedCategory('Collares & Dijes')}
            className="text-neutral-700 hover:text-[#9d2d44] transition-colors cursor-pointer"
          >
            ✨ Collares & Dijes
          </button>
          <button
            id="nav-cat-pulseras"
            onClick={() => setSelectedCategory('Pulseras & Brazaletes')}
            className="text-neutral-700 hover:text-[#9d2d44] transition-colors cursor-pointer"
          >
            ⚜️ Pulseras & Brazaletes
          </button>
          <button
            id="nav-cat-aretes"
            onClick={() => setSelectedCategory('Aretes & Pendientes')}
            className="text-neutral-700 hover:text-[#9d2d44] transition-colors cursor-pointer"
          >
            👑 Aretes & Pendientes
          </button>
          <button
            id="nav-cat-sets"
            onClick={() => setSelectedCategory('Sets Exclusivos')}
            className="text-neutral-700 hover:text-[#9d2d44] transition-colors cursor-pointer"
          >
            🎁 Sets de Regalo
          </button>
          <span className="text-rose-200 hidden sm:inline">|</span>
          <span className="text-[#9d2d44] font-bold flex items-center ml-auto shrink-0">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Joyería en Oro 18K & Plata 925
          </span>
        </div>
      </div>
    </header>
  );
};
