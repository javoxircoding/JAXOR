'use client'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

const Login = () => {
  const router = useRouter()

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

          <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard') }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Telefon raqam</label>
              <input
                className={styles.input}
                type="tel"
                placeholder="+998 90 000 00 00"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Parol</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            <button type="submit" className={styles.btn}>
              Kirish →
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