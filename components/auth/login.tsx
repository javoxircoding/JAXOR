'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

const Login = () => {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi')
        return
      }

      router.push('/dashboard')

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
            <div className={styles.inputGroup}>
              <label className={styles.label}>Telefon raqam</label>
              <input
                className={styles.input}
                type="tel"
                placeholder="+998 90 000 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
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