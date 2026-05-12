export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  barcode: string;
  sku: string;
  imageUrl: string;
  brand?: string | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  categoryId: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  parentSlug?: string | null;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
  brand?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF';
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface SalesStats {
  daily: { date: string; revenue: number; orders: number }[];
  monthly: { month: string; revenue: number; orders: number }[];
  forecast: { month: string; projected: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  totalRevenue: number;
  totalOrders: number;
  averageOrder: number;
}
