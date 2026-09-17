import React, { useState } from 'react';
import {
  X,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  AlertTriangle,
  Search,
  Download,
  RotateCcw,
  MessageCircle,
  Sparkles,
  Database,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_PHONE, STORE_OWNER_NAME } from '../data/initialData';
import { OrderStatus } from '../types';

export const AdminDatabaseModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    updateProductStock,
    deleteProduct,
    customers,
    orders,
    updateOrderStatus,
    stats,
    resetDatabase,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'customers' | 'orders' | 'metrics'>('inventory');
  const [inventorySearch, setInventorySearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Add Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Anillos');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('todos');

  if (!isAdminOpen) return null;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch) ||
    c.documentNumber.includes(customerSearch) ||
    c.department.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'todos') return true;
    return o.status === orderStatusFilter;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const price = parseFloat(newProdPrice);
    const origPrice = newProdOrigPrice ? parseFloat(newProdOrigPrice) : price * 1.5;
    const discount = Math.round(((origPrice - price) / origPrice) * 100);

    addProduct({
      sku: 'VJ-JOY-' + Math.floor(100 + Math.random() * 900),
      name: newProdName,
      price,
      originalPrice: origPrice,
      discountPercent: discount,
      rating: 5.0,
      reviewCount: 1,
      soldCount: 0,
      image:
        newProdImage ||
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&auto=format&fit=crop&q=80',
      category: newProdCategory,
      inStock: parseInt(newProdStock) > 0,
      stockCount: parseInt(newProdStock) || 10,
      badges: ['Exclusivo'],
      description: newProdDescription || 'Joya fina artesanal con certificado de autenticidad Valdivia Joyas.',
      specs: ['Certificado de Autenticidad', 'Estuche de Terciopelo', 'Envío Asegurado Perú'],
    });

    // reset form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdOrigPrice('');
    setNewProdStock('10');
    setNewProdImage('');
    setNewProdDescription('');
    setIsAddingProduct(false);
  };

  const handleExportJson = () => {
    const backup = {
      storeName: 'Valdivia Joyas',
      timestamp: new Date().toISOString(),
      storePhone: STORE_PHONE,
      products,
      customers,
      orders,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valdivia_joyas_database_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="admin-database-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={() => setIsAdminOpen(false)}
    >
      <div
        id="admin-database-modal-content"
        className="bg-white rounded-3xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#6e182f] via-[#942944] to-[#b33956] text-white p-4 sm:p-5 flex items-center justify-between border-b border-rose-900/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#8d253c] flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-['Playfair_Display',serif] font-bold text-base sm:text-lg text-white tracking-tight">
                  Base de Datos & Almacén • Valdivia Joyas
                </h3>
                <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full border border-white/30">
                  ONLINE • PERSISTENTE
                </span>
              </div>
              <p className="text-xs text-rose-200">
                Inventario de Joyas, Registro de Clientes y Gestión de Pedidos Automáticos (WhatsApp: {STORE_PHONE})
              </p>
            </div>
          </div>

          <button
            id="btn-close-admin-db"
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-rose-50/50 border-b border-rose-100 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
            <button
              id="tab-db-inventory"
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-white text-[#8d253c] shadow-xs border border-rose-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventario de Joyas ({products.length})</span>
              {stats.lowStockCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {stats.lowStockCount} bajo stock
                </span>
              )}
            </button>

            <button
              id="tab-db-customers"
              onClick={() => setActiveTab('customers')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-white text-[#8d253c] shadow-xs border border-rose-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Base de Clientes ({customers.length})</span>
            </button>

            <button
              id="tab-db-orders"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-[#8d253c] shadow-xs border border-rose-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pedidos Web ({orders.length})</span>
            </button>

            <button
              id="tab-db-metrics"
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-white text-[#8d253c] shadow-xs border border-rose-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Métricas & Respaldo</span>
            </button>
          </div>

          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1 text-xs text-neutral-700 hover:text-neutral-900 bg-white px-2.5 py-1.5 rounded-xl border border-rose-200 cursor-pointer font-medium hover:bg-rose-50"
            title="Descargar base de datos completa en archivo JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#8d253c]" />
            <span className="hidden sm:inline">Exportar JSON</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fffafb]">
          {/* TAB 1: INVENTORY CONTROL */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-rose-100">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Buscar joya por nombre o SKU..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 outline-hidden bg-rose-50/20"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    id="btn-admin-add-product"
                    onClick={() => setIsAddingProduct(!isAddingProduct)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#be3e57] to-[#9d2d44] hover:from-[#aa324a] hover:to-[#882238] text-white text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddingProduct ? 'Cancelar' : 'Nueva Joya'}</span>
                  </button>
                </div>
              </div>

              {/* Form to Add New Product */}
              {isAddingProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="bg-white p-4 rounded-2xl border-2 border-rose-200 shadow-xs space-y-3"
                >
                  <h4 className="font-bold text-xs text-neutral-900 flex items-center">
                    <Sparkles className="w-4 h-4 text-[#8d253c] mr-1" />
                    Registrar Nueva Joya al Inventario
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-700">Nombre de la Joya</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="Ej: Anillo Corona de Circones en Oro Rosa 18K"
                        className="w-full h-8 px-2 rounded-lg border border-rose-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700">Categoría</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full h-8 px-2 rounded-lg border border-rose-200 text-xs bg-white"
                      >
                        <option value="Anillos">Anillos</option>
                        <option value="Collares y Dijes">Collares y Dijes</option>
                        <option value="Aretes">Aretes</option>
                        <option value="Pulseras">Pulseras</option>
                        <option value="Juegos de Novia">Juegos de Novia</option>
                        <option value="Oro 18K">Oro 18K</option>
                        <option value="Plata 925">Plata 925</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700">Precio Venta (S/)</label>
                      <input
                        type="number"
                        step="0.10"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        placeholder="189.00"
                        className="w-full h-8 px-2 rounded-lg border border-rose-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700">Precio Antes (S/)</label>
                      <input
                        type="number"
                        step="0.10"
                        value={newProdOrigPrice}
                        onChange={(e) => setNewProdOrigPrice(e.target.value)}
                        placeholder="380.00"
                        className="w-full h-8 px-2 rounded-lg border border-rose-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700">Stock Inicial (unidades)</label>
                      <input
                        type="number"
                        required
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        placeholder="10"
                        className="w-full h-8 px-2 rounded-lg border border-rose-200 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-neutral-700">URL Foto de la Joya</label>
                      <input
                        type="url"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full h-8 px-2 rounded-lg border border-rose-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs bg-gradient-to-r from-[#be3e57] to-[#9d2d44] text-white font-bold rounded-lg cursor-pointer"
                    >
                      Guardar en Base de Datos
                    </button>
                  </div>
                </form>
              )}

              {/* Table of Products */}
              <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-rose-50/70 text-neutral-700 font-bold border-b border-rose-100">
                      <tr>
                        <th className="p-3">Joya</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Precio</th>
                        <th className="p-3">Stock Actual</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3 text-right">Control Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100/60">
                      {filteredProducts.map((prod) => {
                        const isLow = prod.stockCount <= 5;
                        const isOut = prod.stockCount === 0;

                        return (
                          <tr key={prod.id} className="hover:bg-rose-50/30">
                            <td className="p-3 flex items-center space-x-2.5">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover bg-rose-50 shrink-0 border border-rose-200"
                              />
                              <div>
                                <p className="font-semibold text-neutral-900 max-w-xs truncate">{prod.name}</p>
                                <p className="text-[10px] text-neutral-500">{prod.category}</p>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-neutral-600">{prod.sku}</td>
                            <td className="p-3 font-black text-neutral-900 font-mono">S/ {prod.price.toFixed(2)}</td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[11px] ${
                                  isOut
                                    ? 'bg-red-100 text-red-700'
                                    : isLow
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {prod.stockCount} unids.
                              </span>
                            </td>
                            <td className="p-3">
                              {isOut ? (
                                <span className="text-red-600 font-bold text-[11px]">Agotado</span>
                              ) : isLow ? (
                                <span className="text-amber-600 font-bold text-[11px] flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1" /> Reabastecer
                                </span>
                              ) : (
                                <span className="text-emerald-600 font-semibold text-[11px]">Disponible</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center space-x-1">
                                <button
                                  onClick={() => updateProductStock(prod.id, Math.max(0, prod.stockCount - 1))}
                                  className="w-7 h-7 bg-rose-50 hover:bg-rose-100 text-neutral-700 font-bold rounded-lg flex items-center justify-center cursor-pointer"
                                  title="Restar 1 unidad"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => updateProductStock(prod.id, prod.stockCount + 5)}
                                  className="px-2 h-7 bg-rose-100/70 hover:bg-rose-100 text-[#8d253c] font-bold rounded-lg text-[10px] cursor-pointer"
                                  title="Sumar +5 unidades"
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => updateProductStock(prod.id, prod.stockCount + 20)}
                                  className="px-2 h-7 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] cursor-pointer"
                                  title="Sumar +20 unidades"
                                >
                                  +20
                                </button>
                                <button
                                  onClick={() => deleteProduct(prod.id)}
                                  className="w-7 h-7 text-neutral-400 hover:text-red-600 rounded-lg flex items-center justify-center cursor-pointer"
                                  title="Eliminar producto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMERS DATABASE */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-rose-100">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Buscar por nombre, celular o DNI..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 outline-hidden bg-rose-50/20"
                  />
                </div>
                <div className="text-xs text-neutral-500">
                  Total Registrados: <strong className="text-neutral-900">{customers.length} clientes</strong>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-rose-50/70 text-neutral-700 font-bold border-b border-rose-100">
                      <tr>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Documento</th>
                        <th className="p-3">Contacto / WhatsApp</th>
                        <th className="p-3">Ubicación</th>
                        <th className="p-3">Pedidos</th>
                        <th className="p-3">Total Comprado</th>
                        <th className="p-3 text-right">Acción WhatsApp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100/60">
                      {filteredCustomers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-rose-50/30">
                          <td className="p-3">
                            <p className="font-bold text-neutral-900">{cust.name}</p>
                            <p className="text-[10px] text-neutral-500">{cust.email}</p>
                          </td>
                          <td className="p-3 font-mono text-neutral-700">
                            {cust.documentType}: {cust.documentNumber}
                          </td>
                          <td className="p-3 font-semibold text-neutral-800">
                            {cust.phone}
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-neutral-800">{cust.district}, {cust.department}</p>
                            <p className="text-[10px] text-neutral-500 truncate max-w-xs">{cust.address}</p>
                          </td>
                          <td className="p-3 font-bold text-neutral-800">
                            {cust.ordersCount} {cust.ordersCount === 1 ? 'pedido' : 'pedidos'}
                          </td>
                          <td className="p-3 font-black text-emerald-600 font-mono">
                            S/ {cust.totalSpent.toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            <a
                              href={`https://wa.me/51${cust.phone}?text=${encodeURIComponent(
                                `¡Hola ${cust.name.split(' ')[0]}! Te saludamos de ${STORE_OWNER_NAME}. Gracias por tu preferencia.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>Escribir</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATED ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-rose-100 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-neutral-700">Filtrar Estado:</span>
                  {['todos', 'pendiente', 'confirmado', 'empaquetando', 'en_camino', 'entregado'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg capitalize font-medium cursor-pointer transition-colors ${
                        orderStatusFilter === st
                          ? 'bg-neutral-900 text-white font-bold'
                          : 'bg-rose-50 text-neutral-700 hover:bg-rose-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <span className="text-neutral-500">
                  Mostrando <strong>{filteredOrders.length}</strong> pedidos
                </span>
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-rose-100 p-4 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-rose-100">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-sm text-[#8d253c]">#{order.id}</span>
                        <span className="text-xs text-neutral-500">
                          {new Date(order.createdAt).toLocaleString('es-PE')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            order.paymentMethod === 'yape'
                              ? 'bg-purple-100 text-[#742284]'
                              : order.paymentMethod === 'plin'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-rose-100 text-[#8d253c]'
                          }`}
                        >
                          Pago: {order.paymentMethod}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-neutral-500">Estado Pedido:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="h-8 px-2.5 rounded-lg border border-rose-200 text-xs font-bold bg-white text-neutral-800 cursor-pointer"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Pago Confirmado</option>
                          <option value="empaquetando">En Taller / Empaque</option>
                          <option value="en_camino">En Camino (Courier)</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {/* Customer info */}
                      <div className="space-y-0.5">
                        <p className="font-bold text-neutral-900">{order.customer.name}</p>
                        <p className="text-neutral-600">📱 Celular: {order.customer.phone}</p>
                        <p className="text-neutral-600">
                          📍 {order.customer.address}, {order.customer.district} ({order.customer.department})
                        </p>
                        {order.customer.reference && (
                          <p className="text-neutral-500 text-[11px]">Ref: {order.customer.reference}</p>
                        )}
                      </div>

                      {/* Products purchased */}
                      <div>
                        <p className="font-semibold text-neutral-700 mb-1">Joyas:</p>
                        <ul className="space-y-1">
                          {order.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between text-[11px] text-neutral-600">
                              <span className="truncate max-w-[200px]">
                                {it.quantity}x {it.productName}
                              </span>
                              <span className="font-semibold font-mono">S/ {(it.price * it.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Payment & WhatsApp action */}
                      <div className="flex flex-col justify-between items-end">
                        <div className="text-right">
                          <p className="text-[10px] text-neutral-500 uppercase font-semibold">Monto Total</p>
                          <p className="text-base font-black text-neutral-900 font-mono">S/ {order.total.toFixed(2)}</p>
                          {order.paymentReference && (
                            <p className="text-[10px] text-neutral-600">Op: {order.paymentReference}</p>
                          )}
                        </div>

                        <a
                          href={`https://wa.me/51${order.customer.phone}?text=${encodeURIComponent(
                            `¡Hola ${order.customer.name.split(' ')[0]}! Te saludamos de ${STORE_OWNER_NAME} con respecto a tu pedido #${order.id}. Tu pedido de joyas se encuentra en estado: *${order.status.toUpperCase()}*. Para coordinar la entrega con estuche de regalo y guía de remisión.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Notificar Cliente WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: METRICS & BACKUP */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                  <p className="text-xs text-neutral-500 uppercase font-bold">Ventas Totales</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1 font-mono">S/ {stats.totalSales.toFixed(2)}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">En Soles peruanos</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                  <p className="text-xs text-neutral-500 uppercase font-bold">Pedidos Totales</p>
                  <p className="text-2xl font-black text-neutral-900 mt-1 font-mono">{stats.totalOrders}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Automáticos en web</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                  <p className="text-xs text-neutral-500 uppercase font-bold">Base de Clientes</p>
                  <p className="text-2xl font-black text-[#8d253c] mt-1 font-mono">{stats.totalCustomers}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Registrados con teléfono</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                  <p className="text-xs text-neutral-500 uppercase font-bold">Joyas Activas</p>
                  <p className="text-2xl font-black text-purple-600 mt-1 font-mono">{stats.totalProducts}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">{stats.lowStockCount} con alerta de stock</p>
                </div>
              </div>

              {/* Maintenance Actions */}
              <div className="bg-white p-5 rounded-2xl border border-rose-100 space-y-4">
                <h4 className="font-bold text-sm text-neutral-900">Mantenimiento de Base de Datos y Joyería</h4>
                <p className="text-xs text-neutral-600">
                  La base de datos de Valdivia Joyas se almacena de forma persistente y sincroniza automáticamente cada compra realizada en la web.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleExportJson}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Respaldo JSON</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('¿Seguro que deseas restaurar la base de datos a las joyas iniciales de Valdivia Joyas?')) {
                        resetDatabase();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#8d253c] border border-rose-200 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restaurar Joyas Iniciales</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
