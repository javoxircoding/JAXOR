'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './checkout.module.css'

const planDetails: Record<string, { name: string; price: string }> = {
  starter: { name: "Starter — Bepul", price: "0 so'm" },
  standart: { name: "Standart Plan", price: "300 000 so'm / oy" },
  pro: { name: "Pro Plan", price: "500 000 so'm / oy" },
}

// 1. Внутренний компонент, который работает с URL параметрами
function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'starter'
  const currentPlan = planDetails[plan] || planDetails.starter

  const [loading, setLoading] = useState(false)

  const handlePayment = () => {
    setLoading(true)
    
    // Имитация интеграции Click / Payme
    setTimeout(() => {
      setLoading(false)
      router.push('/onboarding')
    }, 2000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Obunani faollashtirish</h1>
        <p className={styles.subtitle}>SaaS platformamizdan to'liq foydalanish uchun to'lovni amalga oshiring</p>
        
        <div className={styles.planInfo}>
          <span>Tanlangan tarif:</span>
          <strong>{currentPlan.name}</strong>
        </div>

        <div className={styles.priceBox}>
          <span>To'lov miqdori:</span>
          <span className={styles.amount}>{currentPlan.price}</span>
        </div>

        <div className={styles.paymentMethods}>
          <p>To'lov usulini tanlang:</p>
          <div className={styles.mockMethods}>
            <div className={`${styles.method} ${styles.active}`}>Uzkard / Humo</div>
            <div className={styles.method}>Click / Payme</div>
          </div>
        </div>

        <button 
          className={styles.payBtn} 
          onClick={handlePayment} 
          disabled={loading}
        >
          {loading ? "To'lov tekshirilmoqda..." : "To'lovni tasdiqlash →"}
        </button>
      </div>
    </div>
  )
}

// 2. ГЛАВНЫЙ КОМПОНЕНТ СТРАНИЦЫ (Обязательно export default)
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Yuklanmoqda...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}