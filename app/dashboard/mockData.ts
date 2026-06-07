import type { Category, Product, Order } from './types'

// ═══════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════

export const INIT_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Burgerlar',   frozen: false },
  { id: 'c2', name: 'Ichimliklar', frozen: false },
  { id: 'c3', name: 'Salatlar',    frozen: false },
]

export const INIT_PRODUCTS: Product[] = [
  { id: 'p1', categoryId: 'c1', photo: '🍔', photoType: 'emoji', name: 'Gagarin Burger',   price: 45000, info: "Mol go'shti, salat, sous", quantity: 58,  status: 'active' },
  { id: 'p2', categoryId: 'c1', photo: '🌮', photoType: 'emoji', name: 'Shawarma klassik', price: 35000, info: 'Tovuq, sabzavot, sous',    quantity: 88,  status: 'active' },
  { id: 'p3', categoryId: 'c2', photo: '🥤', photoType: 'emoji', name: 'Coca-Cola 0.5L',   price: 12000, info: 'Sovuq ichimlik',           quantity: 120, status: 'active' },
  { id: 'p4', categoryId: 'c2', photo: '🧃', photoType: 'emoji', name: 'Lipton choy',      price: 8000,  info: 'Issiq yoki sovuq',         quantity: 200, status: 'active' },
  { id: 'p5', categoryId: 'c3', photo: '🥗', photoType: 'emoji', name: 'Grek salati',      price: 28000, info: 'Yangi sabzavotlar',        quantity: 30,  status: 'hidden' },
]

export const INIT_ORDERS: Order[] = [
  { id: '#1042', customer: 'Jahongir T.', phone: '+998 90 123-45-67', address: 'Chilonzor 5-uy',   items: 'Gagarin Burger x2, Cola x1', total: 102000, status: 'new',       date: '03.06.2026' },
  { id: '#1041', customer: 'Malika R.',   phone: '+998 91 234-56-78', address: 'Yunusobod 12',     items: 'Shawarma x1, Lipton x2',     total: 51000,  status: 'accepted',  date: '03.06.2026' },
  { id: '#1040', customer: 'Sardor A.',   phone: '+998 93 345-67-89', address: "Mirzo Ulug'bek 3", items: 'Grek salati x2, Cola x1',    total: 68000,  status: 'delivered', date: '02.06.2026' },
  { id: '#1039', customer: 'Nilufar K.',  phone: '+998 97 456-78-90', address: 'Sergeli 7-mavze',  items: 'Gagarin Burger x1',          total: 45000,  status: 'delivered', date: '02.06.2026' },
  { id: '#1038', customer: 'Bobur M.',    phone: '+998 90 567-89-01', address: 'Bektemir 2',       items: 'Shawarma x2, Lipton x1',     total: 78000,  status: 'delivered', date: '01.06.2026' },
]

export const DAILY_SALES   = [180, 320, 480, 290, 610, 750, 540]
export const MONTHLY_SALES = [4200, 5100, 3800, 6200, 5900, 7100, 4800, 6500, 5200, 7800, 6100, 5400]
export const DAYS_LABELS   = ['Du', 'Se', 'Ch', 'Pa', 'Sh', 'Ya', 'Bu']
export const MONTH_LABELS  = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']