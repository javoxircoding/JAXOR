'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import styles from './register.module.css'

const planNames: Record<string, string> = {
  starter: "Starter — Bepul",
  standart: "Standart — 300 000 so'm/oy",
  pro: "Pro — 500 000 so'm/oy",
}

const Register = () => {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'starter'

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
          Biznesingizni <br />
          <span className={styles.gradient}>raqamlashtiring</span>
        </h1>
        <p className={styles.desc}>14 kun bepul. Kredit karta kerak emas.</p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🤖</div>
            Telegram bot avtomatik sozlanadi
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📦</div>
            Ombor boshqaruvi
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🛵</div>
            Kuryer tizimi
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            Real-vaqt hisobotlar
          </div>
        </div>
      </div>

      {/* O'NG */}
      <div className={styles.right}>
        <div className={styles.formBox}>

          <div className={styles.selectedPlan}>
            ✓ Tanlangan tarif: <strong>{planNames[plan]}</strong>
          </div>

          <div className={styles.steps}>
            <div className={`${styles.stepDot} ${step === 1 ? styles.active : styles.done}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className={`${styles.stepLine} ${step > 1 ? styles.lineDone : ''}`}></div>
            <div className={`${styles.stepDot} ${step === 2 ? styles.active : ''}`}>2</div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2) }}>
              <h2 className={styles.formTitle}>Do'kon ma'lumotlari</h2>
              <p className={styles.formSubtitle}>Do'koningiz haqida bir oz ayting</p>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Do'kon nomi</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Gagarin Oshxonasi"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Do'kon turi</label>
                <select className={styles.input} required>
                  <option value="">Tanlang...</option>
                  <option>Kafe / Oshxona</option>
                  <option>Market / Do'kon</option>
                  <option>Dorixona</option>
                  <option>Xizmat ko'rsatish</option>
                  <option>Boshqa</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Telefon raqam</label>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="+998 90 000 00 00"
                  required
                />
              </div>

              <button type="submit" className={styles.btn}>
                Davom etish →
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault() }}>
              <h2 className={styles.formTitle}>Akkaunt yarating</h2>
              <p className={styles.formSubtitle}>Kirish ma'lumotlaringizni kiriting</p>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Ism Familiya</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Javohir Hamidjanov"
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
              <div className={styles.inputGroup}>
                <label className={styles.label}>Parolni tasdiqlang</label>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>

              <div className={styles.btns}>
                <button
                  type="button"
                  className={styles.btnBack}
                  onClick={() => setStep(1)}
                >
                  ← Orqaga
                </button>
                <button type="submit" className={styles.btn}>
                  Ro'yxatdan o'tish ✓
                </button>
              </div>

              <p className={styles.loginLink}>
                Akkauntingiz bormi? <a href="/auth/login">Kirish</a>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default Register