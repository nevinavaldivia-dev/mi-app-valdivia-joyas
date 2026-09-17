import React from 'react';
import { useStore } from '../context/StoreContext';
import { LayoutGrid, Gem, Sparkles, Star, Gift, Zap, Crown } from 'lucide-react';

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory, products } = useStore();

  const categories = [
    { id: 'Todos', label: 'Toda la Colección', icon: LayoutGrid },
    { id: 'Anillos & Compromiso', label: 'Anillos & Compromiso', icon: Gem },
    { id: 'Collares & Dijes', label: 'Collares & Dijes', icon: Sparkles },
    { id: 'Aretes & Pendientes', label: 'Aretes & Pendientes', icon: Star },
    { id: 'Pulseras & Brazaletes', label: 'Pulseras & Brazaletes', icon: Crown },
    { id: 'Sets Exclusivos', label: 'Sets de Gala', icon: Gift },
    { id: 'Ofertas Relámpago', label: 'Ofertas Flash ⚡', icon: Zap },
  ];

  const getProductCount = (catId: string) => {
    if (catId === 'Todos') return products.length;
    if (catId === 'Ofertas Relámpago') return products.filter((p) => p.isFlashSale).length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-1 pb-3">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = getProductCount(cat.id);

          return (
            <button
              key={cat.id}
              id={`filter-btn-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#9d2d44] to-[#be3e57] text-white shadow-sm ring-2 ring-rose-300'
                  : 'bg-white text-neutral-700 hover:bg-rose-50/70 border border-rose-200/80 hover:border-rose-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-rose-700'}`} />
              <span>{cat.label}</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-black/30 text-amber-200' : 'bg-rose-100/70 text-rose-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
