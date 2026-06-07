'use client'
import { useState } from 'react'
import type { View, Period } from './types'
import { INIT_ORDERS } from './mockData'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useProducts, type RealProduct } from '@/hooks/useProducts'
import type { ProductFormData } from './products/ProductModal'

import OverviewView from './views/overviews'
import ProductView  from './views/product'
import OrdersView   from './views/ordes'
import SettingsView from './views/settings'
import ProductModal from './products/ProductModal'

import styles from './dashboard.module.css'

const PLAN_COLOR: Record<string, string> = {
  STARTER: '#94a3b8', STANDART: '#4ade80', PRO: '#f59e0b',
}

const EMPTY_FORM: ProductFormData = {
  name: '', description: '', price: '', stock: '', image: ''
}

export default function Dashboard() {
  const [view,        setView]        = useState<View>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [period,      setPeriod]      = useState<Period>('day')

  const { data: store, loading: storeLoading, refetch: refetchStore } = useStoreInfo()
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts()

  const [orders] = useState(INIT_ORDERS)

  // ── Modal ──
  const [modal,     setModal]     = useState(false)
  const [form,      setForm]      = useState<ProductFormData>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  const openEdit = (p: RealProduct) => {
    setEditingId(p.id)
    setForm({
      id:          p.id,
      name:        p.name,
      description: p.description,
      price:       String(p.price),
      stock:       String(p.stock),
      image:       p.image ?? '',
    })
    setModal(true)
  }

  const saveProduct = async () => {
    if (!form.name.trim() || !form.price) return

    const method = editingId ? 'PATCH' : 'POST'
    const body   = {
      ...(editingId && { id: editingId }),
      name:        form.name.trim(),
      description: form.description,
      price:       Number(form.price),
      stock:       Number(form.stock) || 0,
      image:       form.image || null,
    }

    const res = await fetch('/api/dashboard/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setModal(false)
      refetchProducts()
    } else {
      const data = await res.json()
      alert(data.error || 'Xatolik')
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Bu mahsulotni o'chirishni xohlaysizmi?")) return
    const res = await fetch(`/api/dashboard/products?id=${id}`, { method: 'DELETE' })
    if (res.ok) refetchProducts()
  }

  // ── Sidebar ──
  const displayName  = storeLoading ? '...' : (store?.storeName ?? "Do'kon")
  const displayPlan  = store?.plan ?? 'STARTER'
  const planColor    = PLAN_COLOR[displayPlan] ?? '#94a3b8'
  const avatarLetter = displayName.charAt(0).toUpperCase()
  const planBadge    = store?.status === 'TRIAL'
    ? `${displayPlan} · ${store.daysLeft} kun`
    : displayPlan

  const navItems: { id: View; icon: string; label: string }[] = [
    { id: 'overview', icon: '◈', label: 'Umumiy'      },
    { id: 'products', icon: '⊞', label: 'Mahsulotlar' },
    { id: 'orders',   icon: '◎', label: 'Buyurtmalar' },
    { id: 'settings', icon: '⊙', label: 'Sozlamalar'  },
  ]

  return (
    <div className={styles.root}>
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoMark}>J</span>
          <span className={styles.logoText}>JAXOR</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map(item => (
            <button key={item.id}
              className={`${styles.navItem} ${view === item.id ? styles.navItemActive : ''}`}
              onClick={() => { setView(item.id); setSidebarOpen(false) }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {view === item.id && <span className={styles.navActiveBar} />}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.storeInfo}>
            {store?.logo
              ? <img src={store.logo} alt="logo" style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
              : <div className={styles.storeAvatar}>{avatarLetter}</div>
            }
            <div>
              <div className={styles.storeName}>{displayName}</div>
              <div className={styles.storePlan} style={{ color: planColor }}>{planBadge}</div>
            </div>
          </div>
          {store?.storeSlug
            ? <a href={`/store/${store.storeSlug}`} target="_blank" rel="noreferrer" className={styles.viewStoreBtn}>Do'konni ko'rish ↗</a>
            : <span className={styles.viewStoreBtn} style={{ opacity: 0.4, cursor: 'default' }}>Do'kon topilmadi</span>
          }
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
          <div className={styles.topbarTitle}>{navItems.find(n => n.id === view)?.label}</div>
          <div className={styles.topbarRight}>
            <span className={styles.topbarDate}>
              {new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </header>

        <div className={styles.content}>
          {view === 'overview' && (
            <OverviewView period={period} setPeriod={setPeriod} orders={orders} products={[]} setView={setView} />
          )}

          {view === 'products' && (
            <ProductView
              products={products}
              loading={productsLoading}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={deleteProduct}
            />
          )}

          {view === 'orders' && <OrdersView orders={orders} onAdvance={() => {}} />}

          {view === 'settings' && <SettingsView store={store} onSaved={refetchStore} />}
        </div>
      </main>

      {modal && (
        <ProductModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          onSave={saveProduct}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  )
}