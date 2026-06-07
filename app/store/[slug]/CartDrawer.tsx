'use client'
// app/[slug]/CartDrawer.tsx
import { useState } from 'react'
import { useCart } from '@/lib/cartStore'

interface Props {
  open:      boolean
  onClose:   () => void
  storeId:   string
  storeSlug: string
}

export default function CartDrawer({ open, onClose, storeId, storeSlug }: Props) {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart()

  const [phone,    setPhone]    = useState('')
  const [address,  setAddress]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  const handleOrder = async () => {
    if (!phone.trim())   return setError('Telefon raqamini kiriting')
    if (!address.trim()) return setError('Manzilni kiriting')
    if (items.length === 0) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/store/order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          phone:   phone.trim(),
          address: address.trim(),
          items:   items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
          total:   totalPrice(),
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xatolik')
      setSuccess(true)
      clearCart()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)',
          backdropFilter: 'blur(4px)', zIndex: 100,
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 400,
        background: '#0d1420', borderLeft: '1px solid rgba(255,255,255,0.08)',
        zIndex: 101, display: 'flex', flexDirection: 'column',
        animation: 'slideIn .25s ease',
      }}>

        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#f1f5f9' }}>🛒 Savat</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, width: 32, height: 32, color: '#64748b', cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>

        {success ? (
          /* ── Успех ── */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#4ade80', margin: '0 0 8px' }}>Buyurtma qabul qilindi!</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Tez orada siz bilan bog'lanamiz</p>
            <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#38bdf8,#818cf8)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Yopish
            </button>
          </div>
        ) : (
          <>
            {/* ── Items ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🛒</div>
                  <p style={{ margin: 0 }}>Savat bo'sh</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {item.image && (
                      <img src={item.image} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: 13, color: '#4ade80', fontWeight: 700 }}>{(item.price * item.quantity).toLocaleString()} so'm</div>
                    </div>
                    {/* Кол-во */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', cursor: 'pointer', fontWeight: 700 }}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', cursor: 'pointer', fontWeight: 700 }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, padding: 4 }}>✕</button>
                  </div>
                ))
              )}
            </div>

            {/* ── Форма заказа ── */}
            {items.length > 0 && (
              <div style={{ padding: '16px 20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Jami:</span>
                  <span style={{ color: '#4ade80' }}>{totalPrice().toLocaleString()} so'm</span>
                </div>

                <input
                  placeholder="+998 90 000-00-00"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 13px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#f1f5f9', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }}
                />
                <input
                  placeholder="Manzil (ko'cha, uy raqami)"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 13px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#f1f5f9', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' }}
                />

                {error && (
                  <div style={{ fontSize: 12, color: '#f87171', marginBottom: 10, padding: '8px 12px', background: 'rgba(239,68,68,.1)', borderRadius: 8 }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleOrder}
                  disabled={loading}
                  style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#38bdf8,#818cf8)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Yuborilmoqda...' : 'Buyurtma berish 🚀'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: none } }`}</style>
    </>
  )
}