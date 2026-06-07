import type { OrderStatus, ProductForm } from './types'

// ═══════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new:       'Yangi',
  accepted:  'Qabul qilindi',
  delivered: 'Yetkazildi',
}

export const EMOJI_LIST = [
  '🍔', '🌮', '🍕', '🍟', '🥗', '🥤', '🧃', '🍰',
  '🍩', '☕', '🍜', '🌯', '🥙', '🍱', '🧆', '🎁',
  '👗', '👟', '💄', '📱',
]

export const EMPTY_FORM: ProductForm = {
  categoryId: 'c1',
  photo:      '🍔',
  photoType:  'emoji',
  name:       '',
  price:      '',
  info:       '',
  quantity:   '',
  status:     'active',
}