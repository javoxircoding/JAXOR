'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './register.module.css'

const planNames: Record<string, string> = {
  starter: "Starter — Bepul",
  standart: "Standart — 300 000 so'm/oy",
  pro: "Pro — 500 000 so'm/oy",
}

const Register = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'starter'

  // Просим ТОЛЬКО имя владельца и пароль
  const [name, setName] = useState('') 
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Parollar mos kelmaydi!')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Отправляем на бэк ТОЛЬКО имя, пароль и выбранный план
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name,
          password, 
          plan 
        })
      })

      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Xatolik yuz berdi')

      // Сразу после регистрации кидаем на оплату
      router.push(`/checkout?plan=${plan}`)
    } catch {
      setError('Internet bilan muammo bor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <button className={styles.backHome} onClick={() => router.push('/')}>← Bosh sahifa</button>
        <div className={styles.logo}>JAXOR</div>
        <h1 className={styles.title}>Biznesingizni <br /><span className={styles.gradient}>raqamlashtiring</span></h1>
        <p className={styles.desc}>14 kun bepul. Kredit karta kerak emas.</p>
      </div>

      <div className={styles.right}>
        <div className={styles.formBox}>
          <div className={styles.selectedPlan}>✓ Tanlangan tarif: <strong>{planNames[plan]}</strong></div>

          <form onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>Ro'yxatdan o'tish</h2>
            <p className={styles.formSubtitle}>Tizimga kirish uchun profilingizni yarating</p>

            {error && <div className={styles.errorBox}>{error}</div>}

            {/* Поле Имя */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Foydalanuvchi nomi (Ism Familiya)</label>
              <input 
                className={styles.input} 
                type="text" 
                placeholder="Javoxir Hamidjanov" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            {/* Поле Пароль */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Parol</label>
              <input 
                className={styles.input} 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                minLength={8} 
                required 
              />
            </div>

            {/* Подтверждение Пароля */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Parolni tasdiqlang</label>
              <input 
                className={styles.input} 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                minLength={8} 
                required 
              />
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Yuklanmoqda...' : "Davom etish (To'lovga o'tish) →"}
            </button>

            <p className={styles.loginLink}>Akkauntingiz bormi? <a href="/auth/login">Kirish</a></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register