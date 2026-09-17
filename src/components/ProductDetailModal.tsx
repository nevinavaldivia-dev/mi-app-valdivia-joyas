import React, { useState } from 'react';
import { X, Star, ShoppingCart, MessageCircle, ShieldCheck, Truck, RotateCcw, Check, Sparkles, Gem, QrCode } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_PHONE, STORE_OWNER_NAME } from '../data/initialData';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCheckoutOpen, setIsYapeQrOpen, getWhatsAppProductUrl } = useStore();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const isOutOfStock = selectedProduct.stockCount <= 0;

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={() => setSelectedProduct(null)}
    >
      <div
        id="product-detail-modal-content"
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200 border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-product-detail"
          onClick={() => setSelectedProduct(null)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative bg-rose-50/50 aspect-square md:aspect-auto">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <span className="bg-gradient-to-r from-[#9d2d44] to-[#be3e57] text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                -{selectedProduct.discountPercent}% DESCUENTO
              </span>
              <span className="bg-[#4a1525] text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md shadow-md flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-amber-300" />
                VALDIVIA JOYAS EXCLUSIVO
              </span>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="p-5 sm:p-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                <span className="bg-rose-50 text-[#8d253c] px-2.5 py-0.5 rounded-full font-semibold">
                  {selectedProduct.category}
                </span>
                <span className="font-mono text-neutral-400">SKU: {selectedProduct.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-base sm:text-xl font-['Playfair_Display',serif] font-bold text-neutral-900 leading-snug mb-2">
                {selectedProduct.name}
              </h1>

              {/* Rating & Sold count */}
              <div className="flex items-center space-x-2 text-xs text-neutral-600 mb-3">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-neutral-900 ml-1">{selectedProduct.rating}</span>
                </div>
                <span>•</span>
                <span>{selectedProduct.reviewCount.toLocaleString()} valoraciones</span>
                <span>•</span>
                <span className="text-[#8d253c] font-semibold">+{selectedProduct.soldCount.toLocaleString()} adquiridos</span>
              </div>

              {/* Pricing Box */}
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#8d253c]">
                    S/ {selectedProduct.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-neutral-400 line-through">
                    S/ {selectedProduct.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs bg-[#8d253c] text-white px-2 py-0.5 rounded-sm font-bold ml-auto">
                    Ahorras S/ {(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-rose-200/60">
                  <p className="text-[11px] text-rose-950 font-medium flex items-center">
                    <Gem className="w-3.5 h-3.5 mr-1 text-[#8d253c]" />
                    Paga con Yape (QR), Plin o Transferencia
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsYapeQrOpen(true)}
                    className="text-[11px] text-purple-700 hover:text-purple-900 font-bold underline flex items-center cursor-pointer"
                  >
                    <QrCode className="w-3 h-3 mr-0.5" />
                    Ver QR Yape
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-700">Disponibilidad en taller:</span>
                  <span
                    className={`font-bold ${
                      isOutOfStock
                        ? 'text-red-600'
                        : selectedProduct.stockCount <= 5
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    {isOutOfStock ? 'Sin existencias' : `${selectedProduct.stockCount} piezas disponibles`}
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOutOfStock ? 'bg-red-500 w-0' : selectedProduct.stockCount <= 5 ? 'bg-amber-500 w-1/4' : 'bg-gradient-to-r from-rose-500 to-rose-700 w-3/4'
                    }`}
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 mb-4 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Specs */}
              {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-3 mb-4 text-xs">
                  <h4 className="font-bold text-neutral-800 mb-2">Detalles de la Joya:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-neutral-600">
                    {selectedProduct.specs.map((spec, index) => (
                      <li key={index} className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-[#8d253c] shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="flex items-center space-x-3 mb-5">
                  <span className="text-xs font-semibold text-neutral-700">Cantidad:</span>
                  <div className="flex items-center border border-rose-200 rounded-xl overflow-hidden bg-white">
                    <button
                      id="btn-detail-qty-minus"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 bg-rose-50 hover:bg-rose-100 text-neutral-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-neutral-900">{quantity}</span>
                    <button
                      id="btn-detail-qty-plus"
                      onClick={() => setQuantity((q) => Math.min(selectedProduct.stockCount, q + 1))}
                      className="w-8 h-8 bg-rose-50 hover:bg-rose-100 text-neutral-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Total: <strong className="text-neutral-900">S/ {(selectedProduct.price * quantity).toFixed(2)}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-rose-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  id="btn-detail-buy-now"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      : 'bg-neutral-900 hover:bg-black text-amber-300 shadow-md hover:shadow-lg'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Comprar Ahora (Yape / Plin)</span>
                </button>

                <button
                  id="btn-detail-add-cart"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#be3e57] to-[#9d2d44] hover:from-[#aa324a] hover:to-[#882238] text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </button>
              </div>

              {/* Direct WhatsApp Consultation */}
              <a
                id="btn-detail-whatsapp-direct"
                href={getWhatsAppProductUrl(selectedProduct)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Consultar por WhatsApp ({STORE_PHONE})</span>
              </a>

              {/* Guarantees */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-500">
                <div className="flex items-center justify-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-rose-700" />
                  <span>Envío Gratis Perú</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Garantía Valdivia</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>Estuche de Lujo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
