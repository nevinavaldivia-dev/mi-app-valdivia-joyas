import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { PromoBanner } from './components/PromoBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDatabaseModal } from './components/AdminDatabaseModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { YapeQrModal } from './components/YapeQrModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { Sparkles, SearchX } from 'lucide-react';

const MainCatalog: React.FC = () => {
  const { products, selectedCategory, searchQuery, setSearchQuery } = useStore();

  const filteredProducts = products.filter((product) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory === 'Ofertas Relámpago') {
      return product.isFlashSale;
    } else if (selectedCategory !== 'Todos') {
      return product.category === selectedCategory;
    }
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
      {/* Search status or Section header */}
      <div className="flex items-center justify-between my-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-rose-100/70 text-[#8d253c] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-['Playfair_Display',serif] tracking-tight">
              {searchQuery ? (
                <span>
                  Resultados para: <span className="text-[#8d253c]">"{searchQuery}"</span>
                </span>
              ) : selectedCategory === 'Todos' ? (
                'Colección Exclusiva de Joyería Fina'
              ) : (
                `${selectedCategory}`
              )}
            </h2>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              Oro 18K y Plata Ley 925 • Pagos con QR Yape, Plin y Transferencia
            </p>
          </div>
          <span className="text-xs bg-rose-100 text-[#8d253c] px-2.5 py-0.5 rounded-full font-bold border border-rose-200">
            {filteredProducts.length}
          </span>
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-[#8d253c] hover:underline font-semibold cursor-pointer"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-rose-100 my-6 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-[#8d253c] flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-neutral-800 font-['Playfair_Display',serif]">
            No encontramos joyas que coincidan
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Intenta buscando términos como solitario, esmeralda, aretes, collar, o explora todas nuestras categorías.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#be3e57] to-[#9d2d44] text-white text-xs font-bold hover:from-[#aa324a] hover:to-[#882238] transition-colors cursor-pointer shadow-xs"
          >
            Ver Todas las Joyas
          </button>
        </div>
      )}
    </main>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[#fff5f7] text-neutral-900 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Navigation Header */}
        <Header />

        {/* Hero Promo Banner with Flash Timer and Yape QR CTA */}
        <PromoBanner />

        {/* Interactive Categories Bar */}
        <CategoryFilter />

        {/* Main Catalog View */}
        <MainCatalog />

        {/* Floating WhatsApp Action Button (959673107) */}
        <FloatingWhatsApp />

        {/* Modals & Slide-ins */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <AdminDatabaseModal />
        <OrderTrackerModal />
        <YapeQrModal />

        {/* Footer */}
        <Footer />
      </div>
    </StoreProvider>
  );
}
