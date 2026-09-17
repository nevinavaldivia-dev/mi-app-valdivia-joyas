import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Customer, Order, OrderStatus, PaymentStatus, StoreStats } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_ORDERS, STORE_PHONE_INTL, STORE_PHONE, STORE_OWNER_NAME } from '../data/initialData';

interface StoreContextType {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  cart: CartItem[];
  stats: StoreStats;
  selectedCategory: string;
  searchQuery: string;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isAdminOpen: boolean;
  isOrderTrackerOpen: boolean;
  isYapeQrOpen: boolean;
  selectedProduct: Product | null;
  lastCreatedOrder: Order | null;
  // State setters
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setIsOrderTrackerOpen: (open: boolean) => void;
  setIsYapeQrOpen: (open: boolean) => void;
  setSelectedProduct: (prod: Product | null) => void;
  setLastCreatedOrder: (order: Order | null) => void;
  // Cart Actions
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Store & Inventory Database Actions
  updateProductStock: (productId: string, newStock: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  // Order & Customer Database Actions
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => void;
  // Helpers
  getWhatsAppOrderUrl: (order: Order) => string;
  getWhatsAppProductUrl: (product: Product) => string;
  resetDatabase: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products persistence (clean legacy temu keys if present)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      // Clear legacy temu storage to immediately show Valdivia Joyas fine jewelry
      if (localStorage.getItem('temu_products')) {
        localStorage.removeItem('temu_products');
        localStorage.removeItem('temu_cart');
      }
      const saved = localStorage.getItem('valdivia_joyas_products_v3');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Customers persistence
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      if (localStorage.getItem('temu_customers')) {
        localStorage.removeItem('temu_customers');
      }
      const saved = localStorage.getItem('valdivia_joyas_customers_v3');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Orders persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      if (localStorage.getItem('temu_orders')) {
        localStorage.removeItem('temu_orders');
      }
      const saved = localStorage.getItem('valdivia_joyas_orders_v3');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Cart persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('valdivia_joyas_cart_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Navigation state
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState<boolean>(false);
  const [isYapeQrOpen, setIsYapeQrOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('valdivia_joyas_products_v3', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('valdivia_joyas_customers_v3', JSON.stringify(customers));
    } catch (e) {
      console.error(e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('valdivia_joyas_orders_v3', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('valdivia_joyas_cart_v3', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Cart Calculations
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cart Actions
  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockCount) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stockCount), selectedVariant: variant }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.stockCount) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Inventory Management
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId
          ? {
              ...prod,
              stockCount: Math.max(0, newStock),
              inStock: newStock > 0,
            }
          : prod
      )
    );
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== productId));
  };

  // Order & Automated Customer/Inventory Processing
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const orderId = `VJ-PE-${randomCode}`;
    const timestamp = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // 1. Automatically decrement stock in database for all purchased jewelry
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const purchasedItem = newOrder.items.find((item) => item.productId === prod.id);
        if (purchasedItem) {
          const updatedStock = Math.max(0, prod.stockCount - purchasedItem.quantity);
          return {
            ...prod,
            stockCount: updatedStock,
            inStock: updatedStock > 0,
            soldCount: prod.soldCount + purchasedItem.quantity,
          };
        }
        return prod;
      })
    );

    // 2. Automatically register or update client in customers database
    setCustomers((prevCustomers) => {
      const existingCust = prevCustomers.find(
        (c) =>
          (c.phone && c.phone === newOrder.customer.phone) ||
          (c.documentNumber && c.documentNumber === newOrder.customer.documentNumber)
      );

      if (existingCust) {
        return prevCustomers.map((c) =>
          c.id === existingCust.id
            ? {
                ...c,
                name: newOrder.customer.name || c.name,
                email: newOrder.customer.email || c.email,
                department: newOrder.customer.department || c.department,
                province: newOrder.customer.province || c.province,
                district: newOrder.customer.district || c.district,
                address: newOrder.customer.address || c.address,
                reference: newOrder.customer.reference || c.reference,
                ordersCount: c.ordersCount + 1,
                totalSpent: Number((c.totalSpent + newOrder.total).toFixed(2)),
                lastOrderDate: timestamp,
              }
            : c
        );
      } else {
        const newCustomer: Customer = {
          id: 'cust-' + Date.now(),
          name: newOrder.customer.name,
          phone: newOrder.customer.phone,
          email: newOrder.customer.email,
          documentType: (newOrder.customer.documentType as 'DNI') || 'DNI',
          documentNumber: newOrder.customer.documentNumber,
          department: newOrder.customer.department,
          province: newOrder.customer.province,
          district: newOrder.customer.district,
          address: newOrder.customer.address,
          reference: newOrder.customer.reference,
          ordersCount: 1,
          totalSpent: Number(newOrder.total.toFixed(2)),
          createdAt: timestamp,
          lastOrderDate: timestamp,
        };
        return [newCustomer, ...prevCustomers];
      }
    });

    // 3. Save order to orders database
    setOrders((prev) => [newOrder, ...prev]);

    // 4. Update last created order and clear cart
    setLastCreatedOrder(newOrder);
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              paymentStatus: paymentStatus || order.paymentStatus,
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  // WhatsApp Message Generators
  const getWhatsAppOrderUrl = (order: Order): string => {
    const itemsList = order.items
      .map((item) => `• ${item.quantity}x ${item.productName} (S/ ${(item.price * item.quantity).toFixed(2)})`)
      .join('\n');

    const paymentLabel =
      order.paymentMethod === 'yape'
        ? `Yape con QR (Ref: ${order.paymentReference || 'Adjunto comprobante'})`
        : order.paymentMethod === 'plin'
        ? `Plin (Ref: ${order.paymentReference || 'Adjunto comprobante'})`
        : `Transferencia Bancaria (Ref: ${order.paymentReference || 'Adjunto comprobante'})`;

    const message = `💎 *¡Hola Valdivia Joyas! Acabo de realizar mi pedido en la web:*

📦 *N° Pedido:* #${order.id}
👤 *Cliente:* ${order.customer.name}
📱 *Celular:* ${order.customer.phone}
🆔 *DNI:* ${order.customer.documentNumber}
📍 *Destino:* ${order.customer.address}, ${order.customer.district}, ${order.customer.province} (${order.customer.department})
${order.customer.reference ? `🏢 *Referencia:* ${order.customer.reference}\n` : ''}
💍 *Joyas Solicitadas:*
${itemsList}

💵 *Subtotal:* S/ ${order.subtotal.toFixed(2)}
🚚 *Envío:* Gratis a domicilio
💰 *TOTAL PAGADO:* S/ ${order.total.toFixed(2)}
💳 *Método de Pago:* ${paymentLabel}

📸 *Adjunto aquí mi comprobante de pago para la preparación de mi pedido y envío en estuche de regalo.* ¡Muchas gracias!`;

    return `https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent(message)}`;
  };

  const getWhatsAppProductUrl = (product: Product): string => {
    const message = `💎 *¡Hola Valdivia Joyas!* Estoy interesada/o en esta exclusiva pieza de joyería:

💍 *${product.name}*
💰 *Precio Especial:* S/ ${product.price.toFixed(2)} (Antes S/ ${product.originalPrice.toFixed(2)})
📦 *Código SKU:* ${product.sku}
📊 *Disponibilidad:* ${product.stockCount} unidades en taller/almacén

¿Deseo consultar sobre medidas, tiempo de entrega o pagar directamente con Yape (QR) al ${STORE_PHONE}?`;

    return `https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent(message)}`;
  };

  const resetDatabase = () => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    localStorage.removeItem('valdivia_joyas_products_v3');
    localStorage.removeItem('valdivia_joyas_customers_v3');
    localStorage.removeItem('valdivia_joyas_orders_v3');
    localStorage.removeItem('valdivia_joyas_cart_v3');
  };

  // Stats calculation
  const stats: StoreStats = {
    totalSales: orders.reduce((acc, o) => (o.status !== 'cancelado' ? acc + o.total : acc), 0),
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: products.length,
    lowStockCount: products.filter((p) => p.stockCount <= 5).length,
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        customers,
        orders,
        cart,
        stats,
        selectedCategory,
        searchQuery,
        isCartOpen,
        isCheckoutOpen,
        isAdminOpen,
        isOrderTrackerOpen,
        isYapeQrOpen,
        selectedProduct,
        lastCreatedOrder,
        setSelectedCategory,
        setSearchQuery,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsAdminOpen,
        setIsOrderTrackerOpen,
        setIsYapeQrOpen,
        setSelectedProduct,
        setLastCreatedOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        updateProductStock,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        updateOrderStatus,
        getWhatsAppOrderUrl,
        getWhatsAppProductUrl,
        resetDatabase,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
