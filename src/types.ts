export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface Order {
  id: number;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
}
