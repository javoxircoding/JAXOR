'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

const Login = () => {
  const router = useRouter()
  
  // Разделяем стейты для чистых цифр и для красивой маски
  const [phone, setPhone] = useState('') // Сюда пойдут чистые 9 цифр (например: 901234567)
  const [phoneDisplay, setPhoneDisplay] = useState('') // Сюда пойдет маска: (90) 000-00-00
  
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Функция маски для Узбекистана
  const formatUzbekPhone = (value: string) => {
    const digits = value.replace(/\D/g, '') // Только цифры
    const trimmed = digits.slice(0, 9)     // Ограничение до 9 знаков после +998

    if (trimmed.length <= 2) return trimmed ? `(${trimmed}` : ''
    if (trimmed.length <= 5) return `(${trimmed.slice(0, 2)}) ${trimmed.slice(2)}`
    if (trimmed.length <= 7) return `(${trimmed.slice(0, 2)}) ${trimmed.slice(2, 5)}-${trimmed.slice(5)}`
    return `(${trimmed.slice(0, 2)}) ${trimmed.slice(2, 5)}-${trimmed.slice(5, 7)}-${trimmed.slice(7)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Проверяем заполненность номера перед отправкой
    if (phone.length !== 9) {
      setError("Telefon raqamini to'liq kiriting (9 ta raqam bo'lishi shart!)")
      return
    }

    setLoading(true)
    setError('')

    // Склеиваем префикс с чистыми цифрами для бэкенда логина
    const fullPhoneNumber = `+998${phone}`

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhoneNumber, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi')
        return
      }

      // FIX: Динамический редирект в зависимости от роли из бэкенда
      if (data.user?.role === 'SUPER_ADMIN') {
        // Если заходишь ты (Король платформы) — летишь в суперадминку
        router.push('/super-admin')
      } else {
        // Если заходит обычный вендор — летит в свой магазин
        router.push('/dashboard')
      }

    } catch {
      setError('Internet bilan muammo bor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* CHAP */}
      <div className={styles.left}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>

        <button className={styles.backHome} onClick={() => router.push('/')}>
          ← Bosh sahifa
        </button>

        <div className={styles.logo}>JAXOR</div>
        <h1 className={styles.title}>
          Xush kelibsiz <br />
          <span className={styles.gradient}>qaytib!</span>
        </h1>
        <p className={styles.desc}>
          Biznesingiz sizi kutmoqda. Kiring va boshqaring.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            Real-vaqt hisobotlar
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🛵</div>
            Kuryer holati
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📦</div>
            Ombor nazorati
          </div>
        </div>
      </div>

      {/* O'NG */}
      <div className={styles.right}>
        <div className={styles.formBox}>

          <h2 className={styles.formTitle}>Tizimga kirish</h2>
          <p className={styles.formSubtitle}>Telefon va parolingizni kiriting</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            
            {/* Измененный inputGroup со стильным телефонным контейнером */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Telefon raqam</label>
              <div className={styles.phoneContainer}>
                <span style={{ 
                  color: '#0F172A', 
                  fontWeight: '700', 
                  marginRight: '8px', 
                  userSelect: 'none',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  +998
                </span>
                <input
                  type="text"
                  placeholder="(90) 000-00-00"
                  value={phoneDisplay}
                  onChange={(e) => {
                    const formatted = formatUzbekPhone(e.target.value)
                    setPhoneDisplay(formatted)
                    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 9)
                    setPhone(cleanDigits)
                  }}
                  required
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '14px 0',
                    fontSize: '15px',
                    color: '#0F172A',
                    width: '100%',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: '500'
                  }}
                />
              </div>
            </div>

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

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Yuklanmoqda...' : 'Kirish →'}
            </button>
          </form>

          <p className={styles.registerLink}>
            Akkauntingiz yo'qmi? <a href="/#tariflar">Ro'yxatdan o'tish</a>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login