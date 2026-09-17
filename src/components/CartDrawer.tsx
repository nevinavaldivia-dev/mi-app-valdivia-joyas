import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, MessageCircle, QrCode, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_PHONE, STORE_PHONE_INTL, STORE_OWNER_NAME } from '../data/initialData';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartCount,
    setIsCheckoutOpen,
    setIsYapeQrOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="cart-drawer-content"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#9d2d44]" />
            <h3 className="font-['Playfair_Display',serif] font-bold text-base text-neutral-900">
              Bolsa de Joyas ({cartCount})
            </h3>
          </div>
          <button
            id="btn-close-cart"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-rose-100/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="bg-rose-50 border-b border-rose-100 px-4 py-2.5 text-xs text-rose-950 flex items-center space-x-2">
          <Truck className="w-4 h-4 text-[#8d253c] shrink-0" />
          <span className="font-medium">
            ¡Felicidades! Calificas para <strong>Envío Asegurado Gratis a todo el Perú</strong>.
          </span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-rose-100/80">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-[#8d253c]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-neutral-800 font-['Playfair_Display',serif] text-base">
                Tu bolsa de compras está vacía
              </p>
              <p className="text-xs text-neutral-500 max-w-xs">
                Descubre exclusivas piezas de joyería en oro 18K y plata ley 925 con hasta 68% de descuento.
              </p>
              <button
                id="btn-cart-continue-shopping"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#be3e57] to-[#9d2d44] text-white font-bold text-xs hover:from-[#aa324a] hover:to-[#882238] transition-colors cursor-pointer shadow-xs"
              >
                Ver Joyas en Oferta
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-3 flex items-start space-x-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 rounded-xl object-cover bg-rose-50/50 shrink-0 border border-rose-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-neutral-900 truncate" title={item.product.name}>
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">SKU: {item.product.sku}</p>

                  <div className="flex items-baseline space-x-1.5 mt-1">
                    <span className="text-sm font-black text-[#8d253c]">
                      S/ {item.product.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-neutral-400 line-through">
                      S/ {item.product.originalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-rose-200 rounded-lg overflow-hidden bg-white">
                      <button
                        id={`btn-cart-minus-${item.product.id}`}
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-rose-50 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        id={`btn-cart-plus-${item.product.id}`}
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-rose-50 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      id={`btn-cart-remove-${item.product.id}`}
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-rose-100 bg-rose-50/40 space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">S/ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío asegurado + Estuche</span>
                <span className="font-bold text-emerald-700">GRATIS</span>
              </div>
              <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-rose-200">
                <span>Total a Pagar</span>
                <span className="text-[#8d253c] font-mono">S/ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="btn-cart-proceed-checkout"
              onClick={handleGoToCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#be3e57] to-[#9d2d44] hover:from-[#aa324a] hover:to-[#882238] text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Completar Pedido (Yape QR / Plin)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Yape QR Code button */}
            <button
              type="button"
              onClick={() => setIsYapeQrOpen(true)}
              className="w-full py-2 rounded-xl bg-purple-100/70 hover:bg-purple-100 text-[#742284] font-bold text-xs flex items-center justify-center space-x-1.5 border border-purple-200 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Ver QR Yape Oficial ({STORE_PHONE})</span>
            </button>

            {/* Assistance link */}
            <a
              id="btn-cart-whatsapp-help"
              href={`https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent(
                `Hola ${STORE_OWNER_NAME}, tengo una consulta sobre mi carrito por un total de S/ ${cartTotal.toFixed(2)}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600" />
              <span>¿Deseas ayuda? WhatsApp {STORE_PHONE}</span>
            </a>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-neutral-500">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Garantía de Joyería Fina • Control en base de datos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
