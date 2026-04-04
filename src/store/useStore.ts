import { create } from 'zustand'
import type { Product, Order, Customer } from '../types'

interface ProductWithImage extends Product {
  image: string
  sku: string
  sold: number
}

interface Category {
  id: number
  name: string
  description: string
  productCount: number
  parentCategory: string
  status: 'active' | 'inactive'
}

interface PendingOrder {
  id: number
  orderCode: string
  customerName: string
  customerEmail: string
  items: Array<{ productId: number; productName: string; quantity: number; price: number; image: string }>
  total: number
  timestamp: Date
  status: 'pending' | 'approved' | 'rejected'
}

interface StoreState {
  products: ProductWithImage[]
  orders: Order[]
  customers: Customer[]
  categories: Category[]
  currentUser: { id: number; email: string; name: string; role: 'admin' | 'user' } | null
  currentPage: 'dashboard' | 'products' | 'orders' | 'customers' | 'category' | 'users' | 'user-mgmt' | 'audit' | 'promo' | 'shipping' | 'warranty' | 'reports' | 'rights' | 'inventory'
  pendingOrders: PendingOrder[]
  setCurrentPage: (page: 'dashboard' | 'products' | 'orders' | 'customers' | 'category' | 'users' | 'user-mgmt' | 'audit' | 'promo' | 'shipping' | 'warranty' | 'reports' | 'rights' | 'inventory') => void
  setCurrentUser: (user: { id: number; email: string; name: string; role: 'admin' | 'user' } | null) => void
  addProduct: (product: ProductWithImage) => void
  updateProduct: (id: number, product: Partial<ProductWithImage>) => void
  deleteProduct: (id: number) => void
  addCategory: (category: Category) => void
  updateCategory: (id: number, category: Partial<Category>) => void
  deleteCategory: (id: number) => void
  setCategories: (categories: Category[]) => void
  addPendingOrder: (order: PendingOrder) => void
  approveOrder: (id: number) => void
  rejectOrder: (id: number) => void
}

export const useStore = create<StoreState>((set) => ({
  currentPage: 'dashboard',
  currentUser: null,
  pendingOrders: [
    {
      id: 1,
      orderCode: 'ORD-001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      items: [
        { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=150&h=150&fit=crop' },
        { productId: 6, productName: 'AirPods Pro', quantity: 2, price: 6000000, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=150&h=150&fit=crop' }
      ],
      total: 37000000,
      timestamp: new Date('2024-04-04T10:30:00'),
      status: 'pending'
    },
    {
      id: 2,
      orderCode: 'ORD-002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@email.com',
      items: [
        { productId: 2, productName: 'iPhone 15 Pro', quantity: 1, price: 30000000, image: 'https://images.unsplash.com/photo-1592286927505-4a9d1b4b0b8d?w=150&h=150&fit=crop' }
      ],
      total: 30000000,
      timestamp: new Date('2024-04-04T11:15:00'),
      status: 'pending'
    },
    {
      id: 3,
      orderCode: 'ORD-003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      items: [
        { productId: 4, productName: 'MacBook Pro M3', quantity: 1, price: 45000000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop' },
        { productId: 5, productName: 'iPad Pro', quantity: 1, price: 28000000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop' }
      ],
      total: 73000000,
      timestamp: new Date('2024-04-04T12:00:00'),
      status: 'pending'
    },
    {
      id: 4,
      orderCode: 'ORD-004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      items: [
        { productId: 3, productName: 'Samsung Galaxy S24', quantity: 2, price: 22000000, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&h=150&fit=crop' }
      ],
      total: 44000000,
      timestamp: new Date('2024-04-04T13:20:00'),
      status: 'pending'
    },
    {
      id: 5,
      orderCode: 'ORD-005',
      customerName: 'Hoàng Văn E',
      customerEmail: 'hoangvane@email.com',
      items: [
        { productId: 6, productName: 'AirPods Pro', quantity: 3, price: 6000000, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=150&h=150&fit=crop' }
      ],
      total: 18000000,
      timestamp: new Date('2024-04-04T14:45:00'),
      status: 'pending'
    },
    {
      id: 6,
      orderCode: 'ORD-006',
      customerName: 'Vũ Thị F',
      customerEmail: 'vuthif@email.com',
      items: [
        { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=150&h=150&fit=crop' },
        { productId: 2, productName: 'iPhone 15 Pro', quantity: 1, price: 30000000, image: 'https://images.unsplash.com/photo-1592286927505-4a9d1b4b0b8d?w=150&h=150&fit=crop' },
        { productId: 6, productName: 'AirPods Pro', quantity: 1, price: 6000000, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=150&h=150&fit=crop' }
      ],
      total: 61000000,
      timestamp: new Date('2024-04-04T15:10:00'),
      status: 'pending'
    },
    {
      id: 7,
      orderCode: 'ORD-007',
      customerName: 'Đặng Văn G',
      customerEmail: 'dangvang@email.com',
      items: [
        { productId: 5, productName: 'iPad Pro', quantity: 2, price: 28000000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop' }
      ],
      total: 56000000,
      timestamp: new Date('2024-04-04T16:00:00'),
      status: 'pending'
    },
    {
      id: 8,
      orderCode: 'ORD-008',
      customerName: 'Bùi Thị H',
      customerEmail: 'buithih@email.com',
      items: [
        { productId: 4, productName: 'MacBook Pro M3', quantity: 1, price: 45000000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop' }
      ],
      total: 45000000,
      timestamp: new Date('2024-04-04T16:30:00'),
      status: 'pending'
    },
    {
      id: 9,
      orderCode: 'ORD-009',
      customerName: 'Đinh Văn I',
      customerEmail: 'dinhvani@email.com',
      items: [
        { productId: 3, productName: 'Samsung Galaxy S24', quantity: 1, price: 22000000, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&h=150&fit=crop' },
        { productId: 6, productName: 'AirPods Pro', quantity: 2, price: 6000000, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=150&h=150&fit=crop' }
      ],
      total: 34000000,
      timestamp: new Date('2024-04-04T17:00:00'),
      status: 'pending'
    },
    {
      id: 10,
      orderCode: 'ORD-010',
      customerName: 'Dương Thị K',
      customerEmail: 'duongthik@email.com',
      items: [
        { productId: 2, productName: 'iPhone 15 Pro', quantity: 2, price: 30000000, image: 'https://images.unsplash.com/photo-1592286927505-4a9d1b4b0b8d?w=150&h=150&fit=crop' },
        { productId: 5, productName: 'iPad Pro', quantity: 1, price: 28000000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop' }
      ],
      total: 88000000,
      timestamp: new Date('2024-04-04T17:45:00'),
      status: 'pending'
    }
  ],
  
  products: [
    // Laptop
    { 
      id: 1, 
      name: 'Laptop Dell XPS 13', 
      price: 25000000, 
      stock: 15, 
      category: 'Laptop',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=150&h=150&fit=crop',
      sku: 'SKU-0001',
      sold: 45
    },
    { 
      id: 4, 
      name: 'MacBook Pro M3', 
      price: 45000000, 
      stock: 5, 
      category: 'Laptop',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
      sku: 'SKU-0004',
      sold: 34
    },
    { 
      id: 7, 
      name: 'Laptop HP Pavilion 15', 
      price: 18000000, 
      stock: 20, 
      category: 'Laptop',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop',
      sku: 'SKU-0007',
      sold: 67
    },
    { 
      id: 8, 
      name: 'Laptop Asus ROG Strix', 
      price: 35000000, 
      stock: 8, 
      category: 'Laptop',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=150&h=150&fit=crop',
      sku: 'SKU-0008',
      sold: 28
    },
    { 
      id: 9, 
      name: 'Laptop Lenovo ThinkPad X1', 
      price: 32000000, 
      stock: 12, 
      category: 'Laptop',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=150&h=150&fit=crop',
      sku: 'SKU-0009',
      sold: 41
    },
    { 
      id: 10, 
      name: 'Laptop Acer Swift 3', 
      price: 16000000, 
      stock: 18, 
      category: 'Laptop',
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=150&h=150&fit=crop',
      sku: 'SKU-0010',
      sold: 52
    },
    
    // Điện thoại
    { 
      id: 2, 
      name: 'iPhone 15 Pro', 
      price: 30000000, 
      stock: 8, 
      category: 'Điện thoại',
      image: 'https://images.unsplash.com/photo-1592286927505-4a9d1b4b0b8d?w=150&h=150&fit=crop',
      sku: 'SKU-0002',
      sold: 89
    },
    { 
      id: 3, 
      name: 'Samsung Galaxy S24', 
      price: 22000000, 
      stock: 12, 
      category: 'Điện thoại',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&h=150&fit=crop',
      sku: 'SKU-0003',
      sold: 67
    },
    { 
      id: 11, 
      name: 'iPhone 14 Pro Max', 
      price: 28000000, 
      stock: 10, 
      category: 'Điện thoại',
      image: 'https://images.unsplash.com/photo-1678652197950-91e3f0a3a0e4?w=150&h=150&fit=crop',
      sku: 'SKU-0011',
      sold: 95
    },
    { 
      id: 12, 
      name: 'Samsung Galaxy Z Fold 5', 
      price: 42000000, 
      stock: 6, 
      category: 'Điện thoại',
      image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=150&h=150&fit=crop',
      sku: 'SKU-0012',
      sold: 38
    },
    { 
      id: 13, 
      name: 'Xiaomi 13 Pro', 
      price: 18000000, 
      stock: 15, 
      category: 'Điện thoại',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150&h=150&fit=crop',
      sku: 'SKU-0013',
      sold: 72
    },
    { 
      id: 14, 
      name: 'OPPO Find X6 Pro', 
      price: 24000000, 
      stock: 11, 
      category: 'Điện thoại',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop',
      sku: 'SKU-0014',
      sold: 54
    },
    
    // Máy tính bảng
    { 
      id: 5, 
      name: 'iPad Pro', 
      price: 28000000, 
      stock: 10, 
      category: 'Máy tính bảng',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop',
      sku: 'SKU-0005',
      sold: 56
    },
    { 
      id: 15, 
      name: 'iPad Air M2', 
      price: 18000000, 
      stock: 14, 
      category: 'Máy tính bảng',
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=150&h=150&fit=crop',
      sku: 'SKU-0015',
      sold: 63
    },
    { 
      id: 16, 
      name: 'Samsung Galaxy Tab S9', 
      price: 22000000, 
      stock: 9, 
      category: 'Máy tính bảng',
      image: 'https://images.unsplash.com/photo-1585790050230-5dd28404f1e4?w=150&h=150&fit=crop',
      sku: 'SKU-0016',
      sold: 47
    },
    { 
      id: 17, 
      name: 'iPad Mini 6', 
      price: 15000000, 
      stock: 16, 
      category: 'Máy tính bảng',
      image: 'https://images.unsplash.com/photo-1544244015-9c72fd9c866d?w=150&h=150&fit=crop',
      sku: 'SKU-0017',
      sold: 71
    },
    { 
      id: 18, 
      name: 'Xiaomi Pad 6', 
      price: 9000000, 
      stock: 20, 
      category: 'Máy tính bảng',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=150&h=150&fit=crop',
      sku: 'SKU-0018',
      sold: 85
    },
    
    // Phụ kiện
    { 
      id: 6, 
      name: 'AirPods Pro', 
      price: 6000000, 
      stock: 25, 
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=150&h=150&fit=crop',
      sku: 'SKU-0006',
      sold: 123
    },
    { 
      id: 19, 
      name: 'Apple Watch Series 9', 
      price: 12000000, 
      stock: 18, 
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=150&h=150&fit=crop',
      sku: 'SKU-0019',
      sold: 92
    },
    { 
      id: 20, 
      name: 'Samsung Galaxy Buds Pro', 
      price: 4500000, 
      stock: 30, 
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&h=150&fit=crop',
      sku: 'SKU-0020',
      sold: 108
    },
    { 
      id: 21, 
      name: 'Magic Keyboard cho iPad', 
      price: 8000000, 
      stock: 12, 
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&h=150&fit=crop',
      sku: 'SKU-0021',
      sold: 45
    },
    { 
      id: 22, 
      name: 'Apple Pencil 2', 
      price: 3500000, 
      stock: 22, 
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=150&h=150&fit=crop',
      sku: 'SKU-0022',
      sold: 87
    },
    { 
      id: 23, 
      name: 'Sạc dự phòng Anker 20000mAh', 
      price: 1200000, 
      stock: 35, 
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=150&h=150&fit=crop',
      sku: 'SKU-0023',
      sold: 156
    },
    { 
      id: 24, 
      name: 'Ốp lưng iPhone 15 Pro', 
      price: 500000, 
      stock: 50, 
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=150&h=150&fit=crop',
      sku: 'SKU-0024',
      sold: 203
    }
  ],

  categories: [
    { id: 1, name: 'Điện thoại', description: 'Điện thoại thông minh', productCount: 45, parentCategory: 'Điện tử', status: 'active' },
    { id: 2, name: 'Laptop', description: 'Máy tính xách tay', productCount: 32, parentCategory: 'Điện tử', status: 'active' },
    { id: 3, name: 'Máy tính bảng', description: 'Tablet các loại', productCount: 18, parentCategory: 'Điện tử', status: 'active' },
    { id: 4, name: 'Phụ kiện', description: 'Phụ kiện điện tử', productCount: 67, parentCategory: 'Điện tử', status: 'active' },
    { id: 5, name: 'Tai nghe', description: 'Tai nghe và loa', productCount: 28, parentCategory: 'Phụ kiện', status: 'active' },
    { id: 6, name: 'Sạc dự phòng', description: 'Pin sạc dự phòng', productCount: 15, parentCategory: 'Phụ kiện', status: 'active' },
  ],

  orders: [
    { id: 1, customerName: 'Nguyễn Văn A', total: 25000000, status: 
'completed', date: '2024-03-15' },
    { id: 2, customerName: 'Trần Thị B', total: 30000000, status: 'processing', date: '2024-03-20' },
    { id: 3, customerName: 'Lê Văn C', total: 22000000, status: 'pending', date: '2024-03-25' },
    { id: 4, customerName: 'Phạm Thị D', total: 45000000, status: 'completed', date: '2024-03-28' }
  ],

  customers: [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', totalOrders: 5 },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0912345678', totalOrders: 3 },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0923456789', totalOrders: 8 },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0934567890', totalOrders: 2 }
  ],

  setCurrentPage: (page) => set({ currentPage: page }),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
  
  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
  })),
  
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),

  addCategory: (category) => set((state) => ({ 
    categories: [...state.categories, category] 
  })),
  
  updateCategory: (id, updatedCategory) => set((state) => ({
    categories: state.categories.map(c => c.id === id ? { ...c, ...updatedCategory } : c)
  })),
  
  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter(c => c.id !== id)
  })),

  setCategories: (categories) => set({ categories }),

  addPendingOrder: (order) => set((state) => ({
    pendingOrders: [order, ...state.pendingOrders]
  })),

  approveOrder: (id) => set((state) => ({
    pendingOrders: state.pendingOrders.map(o => 
      o.id === id ? { ...o, status: 'approved' as const } : o
    )
  })),

  rejectOrder: (id) => set((state) => ({
    pendingOrders: state.pendingOrders.map(o => 
      o.id === id ? { ...o, status: 'rejected' as const } : o
    )
  }))
}))
