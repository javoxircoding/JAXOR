'use client'
// app/[slug]/StoreFront.tsx
import { useState } from 'react'
import { useCart } from '@/lib/cartStore'
import CartDrawer from './CartDrawer'

interface Product {
  id:          string
  name:        string
  description: string | null
  price:       number
  image:       string | null
  stock:       number
}

interface Store {
  id:          string
  name:        string
  slug:        string
  description: string | null
  logo:        string | null
  banner:      string | null
  products:    Product[]
}

export default function StoreFront({ store }: { store: Store }) {
  const { addItem, totalCount } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [added,    setAdded]    = useState<string | null>(null)

  const handleAdd = (p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, image: p.image ?? '' })
    setAdded(p.id)
    setTimeout(() => setAdded(null), 900)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06090f', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Banner ── */}
      {store.banner && (
        <div style={{ width: '100%', height: 200, overflow: 'hidden', position: 'relative' }}>
          <img src={store.banner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #06090f)' }} />
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0 8px', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {store.logo && (
              <img src={store.logo} alt="logo" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
            )}
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#f1f5f9' }}>{store.name}</h1>
              {store.description && (
                <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>{store.description}</p>
              )}
            </div>
          </div>

          {/* Корзина */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              position: 'relative', background: 'rgba(56,189,248,0.1)',
              border: '1px solid rgba(56,189,248,0.25)', borderRadius: 12,
              padding: '10px 16px', color: '#38bdf8', fontWeight: 700,
              fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            🛒 Savat
            {totalCount() > 0 && (
              <span style={{
                background: '#38bdf8', color: '#0f172a', borderRadius: '50%',
                width: 20, height: 20, fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalCount()}
              </span>
            )}
          </button>
        </div>

        {/* ── Products grid ── */}
        {store.products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <p>Hozircha mahsulotlar yo'q</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 14, paddingBottom: 80, marginTop: 16,
          }}>
            {store.products.map(p => (
              <div key={p.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden',
                transition: 'border-color .15s, transform .15s',
              }}>
                {/* Фото */}
                <div style={{ width: '100%', height: 160, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                  {p.image
                    ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🍽️</div>
                  }
                </div>

                {/* Инфо */}
                <div style={{ padding: '12px 14px 14px' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', marginBottom: 4, lineHeight: 1.3 }}>
                    {p.name}
                  </div>
                  {p.description && (
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {p.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>
                      {p.price.toLocaleString()} so'm
                    </span>
                    <button
                      onClick={() => handleAdd(p)}
                      style={{
                        padding: '7px 14px', borderRadius: 10, border: 'none',
                        background: added === p.id ? '#4ade80' : 'linear-gradient(135deg,#38bdf8,#818cf8)',
                        color: added === p.id ? '#0f172a' : '#fff',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        transition: 'all .2s', whiteSpace: 'nowrap',
                      }}
                    >
                      {added === p.id ? '✓ Qo\'shildi' : '+ Qo\'shish'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Cart Drawer ── */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        storeId={store.id}
        storeSlug={store.slug}
      />
    </div>
  )
}