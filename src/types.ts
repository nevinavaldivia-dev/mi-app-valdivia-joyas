export type PaymentMethod = 'yape' | 'plin' | 'transferencia';

export type OrderStatus = 'pendiente' | 'confirmado' | 'empaquetando' | 'en_camino' | 'entregado' | 'cancelado';

export type PaymentStatus = 'pendiente' | 'verificado' | 'rechazado';

export interface Product {
  id: string;
  name: string;
  originalPrice: number; // in S/ (PEN)
  price: number; // in S/ (PEN)
  discountPercent: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  image: string;
  gallery?: string[];
  category: string;
  inStock: boolean;
  stockCount: number;
  isFlashSale?: boolean;
  badges: string[];
  description: string;
  specs: string[];
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  documentType: 'DNI' | 'RUC' | 'CE';
  documentNumber: string;
  department: string;
  province: string;
  district: string;
  address: string;
  reference?: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  lastOrderDate: string;
}

export interface Order {
  id: string; // e.g. TEMU-PE-84920
  customer: {
    name: string;
    phone: string;
    email: string;
    documentType: string;
    documentNumber: string;
    department: string;
    province: string;
    district: string;
    address: string;
    reference?: string;
  };
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  paymentProofUrl?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface StoreStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
}
