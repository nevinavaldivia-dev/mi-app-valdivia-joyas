import React from 'react';
import { ShoppingCart, MessageCircle, Star, Sparkles, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { STORE_PHONE } from '../data/initialData';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, getWhatsAppProductUrl } = useStore();

  const isOutOfStock = product.stockCount <= 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-rose-100/90 hover:border-rose-300 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Clickable Image & Header */}
      <div
        className="relative cursor-pointer overflow-hidden aspect-square bg-rose-50/40"
        onClick={() => setSelectedProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            <span className="bg-gradient-to-r from-[#9d2d44] to-[#be3e57] text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md shadow-sm">
              -{product.discountPercent}%
            </span>
            {product.isFlashSale && (
              <span className="bg-[#4a1525] text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center shadow-xs">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-300" />
                Edición Lujo
              </span>
            )}
          </div>
        )}

        {/* Stock status indicator */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-neutral-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Agotado
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
              ¡Últimas {product.stockCount} piezas!
            </span>
          ) : (
            <span className="bg-white/90 text-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
              Stock disponible
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between text-[11px] text-rose-800/80 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[9px] bg-rose-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <span className="text-neutral-400 text-[10px] font-mono">SKU: {product.sku}</span>
          </div>

          {/* Product Title */}
          <h2
            onClick={() => setSelectedProduct(product)}
            className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 hover:text-[#9d2d44] cursor-pointer transition-colors leading-snug mb-1.5"
            title={product.name}
          >
            {product.name}
          </h2>

          {/* Ratings & Sold Count */}
          <div className="flex items-center space-x-1.5 text-[11px] text-neutral-500 mb-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-neutral-800 ml-0.5">{product.rating}</span>
            </div>
            <span>•</span>
            <span className="text-neutral-500 font-medium">+{product.soldCount.toLocaleString()} vendidos</span>
          </div>
        </div>

        {/* Price & Action Bottom */}
        <div className="pt-2 border-t border-rose-100">
          <div className="flex items-baseline space-x-1.5 mb-2.5">
            <span className="text-lg sm:text-xl font-black text-[#8d253c] tracking-tight">
              S/ {product.price.toFixed(2)}
            </span>
            <span className="text-xs text-neutral-400 line-through font-normal">
              S/ {product.originalPrice.toFixed(2)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-5 gap-1.5">
            {/* WhatsApp Quick Inquire Button */}
            <a
              id={`btn-whatsapp-ask-${product.id}`}
              href={getWhatsAppProductUrl(product)}
              target="_blank"
              rel="noreferrer"
              className="col-span-1 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center transition-colors"
              title={`Consultar disponibilidad por WhatsApp (${STORE_PHONE})`}
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600" />
            </a>

            {/* Add to Cart Button */}
            <button
              id={`btn-add-cart-${product.id}`}
              disabled={isOutOfStock}
              onClick={() => addToCart(product, 1)}
              className={`col-span-4 h-9 px-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#be3e57] to-[#9d2d44] hover:from-[#aa324a] hover:to-[#882238] text-white shadow-xs hover:shadow-md'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Sin Stock' : 'Comprar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
