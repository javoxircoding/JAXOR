// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

export type View = 'overview' | 'products' | 'orders' | 'settings'
export type Period = 'day' | 'month'
export type OrderStatus = 'new' | 'accepted' | 'delivered'
export type ProductStatus = 'active' | 'hidden'

export interface Category {
  id: string
  name: string
  frozen: boolean
}

export interface Product {
  id: string
  categoryId: string
  photo: string        // URL yoki emoji
  photoType: 'emoji' | 'image'
  name: string
  price: number
  info: string
  quantity: number
  status: ProductStatus
}

export interface Order {
  id: string
  customer: string
  phone: string
  address: string
  items: string
  total: number
  status: OrderStatus
  date: string
}

export interface ProductForm {
  id?: string
  categoryId: string
  photo: string
  photoType: 'emoji' | 'image'
  name: string
  price: string
  info: string
  quantity: string
  status: ProductStatus
}