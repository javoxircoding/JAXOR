'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'

interface StoreData {
  id: string
  name: string
  slug: string
  type: string
  plan: string
  status: string
  phone: string
}

export default function DashboardHome() {
  const [store, setStore] = useState<StoreData | null>(null)
  const [metrics, setMetrics] = useState({ totalSales: 0, ordersCount: 0, productsCount: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    // В реальном проекте тут будет запрос к твоему API (например, /api/dashboard/overview)
    // Сейчас сделаем имитацию загрузки данных из бэкенда для MVP
    const fetchDashboardData = async () => {
      try {
        // Имитируем задержку сети
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        // Мок-данные созданного магазина
        setStore({
          id: 'store-123',
          name: 'Gagarin Burger',
          slug: 'gagarin-burger',
          type: 'FOOD',
          plan: 'STARTER',
          status: 'TRIAL',
          phone: '+998 (90) 499-76-82'
        })

        setMetrics({
          totalSales: 450000, // в сумах
          ordersCount: 12,
          productsCount: 8
        })
      } catch (error) { 
        console.error("Ma'lumot yuklashda xatolik:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Функция копирования публичной ссылки для клиентов
  const handleCopyLink = () => {
    if (!store) return
    // Формируем ссылку динамически на основе текущего домена
    const publicLink = `${window.location.origin}/store/${store.slug}`
    navigator.clipboard.writeText(publicLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Jaxor tizimi yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Шапка дашборда */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.welcomeTitle}>Xush kelibsiz, {store?.name}! 👋</h1>
          <p className={styles.welcomeSubtitle}>Do'koningiz statistikasi va boshqaruv paneli</p>
        </div>
        
        {/* Блок с тарифом */}
        <div className={styles.planBadge}>
          <span>Tarif: <b>{store?.plan}</b></span>
          <span className={styles.statusDot} data-status={store?.status}>
            {store?.status === 'TRIAL' ? 'Sinov muddati' : 'Faol'}
          </span>
        </div>
      </div>

      {/* 🔥 КАРТОЧКА ПУБЛИЧНОЙ ССЫЛКИ ДЛЯ КЛИЕНТОВ */}
      <div className={styles.linkCard}>
        <div className={styles.linkInfo}>
          <h3 className={styles.linkTitle}>Xaridorlar uchun do'kon havolasi 🔗</h3>
          <p className={styles.linkSubtitle}>Ushbu havolani nusxalang va mijozlaringizga (Telegram, Instagram) yuboring</p>
          <div className={styles.linkInputGroup}>
            <input 
              type="text" 
              readOnly 
              value={typeof window !== 'undefined' ? `${window.location.origin}/store/${store?.slug}` : ''} 
              className={styles.linkInput}
            />
            <button onClick={handleCopyLink} className={styles.copyBtn}>
              {copied ? "Nusxalandi! ✅" : "Nusxa olish 📋"}
            </button>
          </div>
        </div>
      </div>

      {/* МЕТРИКИ / СТАТИСТИКА */}
      <div className={styles.gridMetrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>💰</div>
          <div>
            <p className={styles.metricLabel}>Umumiy savdo</p>
            <h2 className={styles.metricValue}>{metrics.totalSales.toLocaleString()} UZS</h2>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📦</div>
          <div>
            <p className={styles.metricLabel}>Buyurtmalar soni</p>
            <h2 className={styles.metricValue}>{metrics.ordersCount} ta</h2>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🍔</div>
          <div>
            <p className={styles.metricLabel}>Mahsulotlar</p>
            <h2 className={styles.metricValue}>{metrics.productsCount} turda</h2>
          </div>
        </div>
      </div>

      {/* БЫСТРЫЕ ДЕЙСТВИЯ */}
      <div className={styles.quickActions}>
        <h2>Tezkor harakatlar ⚡</h2>
        <div className={styles.actionButtons}>
          <button onClick={() => router.push('/dashboard/products')} className={styles.actionBtn}>
            ➕ Yangi mahsulot qo'shish
          </button>
          <button onClick={() => router.push('/dashboard/orders')} className={styles.actionBtnSecondary}>
            🛒 Buyurtmalarni ko'rish
          </button>
        </div>
      </div>
    </div>
  )
}