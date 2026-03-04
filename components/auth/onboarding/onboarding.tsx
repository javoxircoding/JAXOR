'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './onboarding.module.css'

const Onboarding = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [bannerPreview, setBannerPreview] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  // Step 2
  const [tovarlar, setTovarlar] = useState([{ nom: '', narx: '', tavsif: '' }])

  const router = useRouter()

  const addTovar = () => {
    setTovarlar([...tovarlar, { nom: '', narx: '', tavsif: '' }])
  }

  const updateTovar = (i: number, field: string, value: string) => {
    const yangi = [...tovarlar]
    yangi[i] = { ...yangi[i], [field]: value }
    setTovarlar(yangi)
  }

  // Rasm preview
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  // Rasm yuklash
  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    return data.url
  }

  // Step 1 saqlash
  const handleStep1 = async () => {
    setLoading(true)
    setError('')
    try {
      let logoUrl = ''
      let bannerUrl = ''

      if (logoFile) logoUrl = await uploadImage(logoFile)
      if (bannerFile) bannerUrl = await uploadImage(bannerFile)

      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, address, logoUrl, bannerUrl })
      })

      setStep(2)
    } catch {
      setError('Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 saqlash
  const handleStep2 = async () => {
    setLoading(true)
    setError('')
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: tovarlar })
      })
      setStep(3)
    } catch {
      setError('Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div className={styles.logo}>JAXOR</div>
        <h1 className={styles.title}>Do'koningizni sozlaylik 🎉</h1>
        <p className={styles.subtitle}>Faqat 3 qadam — 2 daqiqa ketadi</p>
      </div>

      <div className={styles.steps}>
        <div className={styles.stepItem}>
          <div className={`${styles.stepDot} ${step === 1 ? styles.active : step > 1 ? styles.done : ''}`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <div className={`${styles.stepLabel} ${step === 1 ? styles.labelActive : ''}`}>Do'kon</div>
        </div>
        <div className={`${styles.stepLine} ${step > 1 ? styles.lineDone : ''}`}></div>
        <div className={styles.stepItem}>
          <div className={`${styles.stepDot} ${step === 2 ? styles.active : step > 2 ? styles.done : ''}`}>
            {step > 2 ? '✓' : '2'}
          </div>
          <div className={`${styles.stepLabel} ${step === 2 ? styles.labelActive : ''}`}>Tovarlar</div>
        </div>
        <div className={`${styles.stepLine} ${step > 2 ? styles.lineDone : ''}`}></div>
        <div className={styles.stepItem}>
          <div className={`${styles.stepDot} ${step === 3 ? styles.active : ''}`}>3</div>
          <div className={`${styles.stepLabel} ${step === 3 ? styles.labelActive : ''}`}>Tayyor</div>
        </div>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {/* STEP 1 */}
      {step === 1 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Do'kon sahifasini sozlang</h2>
          <p className={styles.cardSubtitle}>Logo va banner qo'shing — mijozlar buni ko'radi</p>

          {/* LOGO */}
          <div className={styles.uploadArea} style={logoPreview ? { padding: '0', border: 'none' } : {}}>
            <input type="file" accept="image/*" className={styles.fileInput} onChange={handleLogoChange} />
            {logoPreview ? (
              <img src={logoPreview} alt="logo" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '20px' }} />
            ) : (
              <>
                <div className={styles.uploadIcon}>🏪</div>
                <div className={styles.uploadTitle}>Logo yuklang</div>
                <div className={styles.uploadDesc}>PNG, JPG — max 2MB</div>
              </>
            )}
          </div>

          {/* BANNER */}
          <div className={styles.uploadArea} style={bannerPreview ? { padding: '0', border: 'none' } : {}}>
            <input type="file" accept="image/*" className={styles.fileInput} onChange={handleBannerChange} />
            {bannerPreview ? (
              <img src={bannerPreview} alt="banner" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '20px' }} />
            ) : (
              <>
                <div className={styles.uploadIcon}>🖼️</div>
                <div className={styles.uploadTitle}>Banner yuklang</div>
                <div className={styles.uploadDesc}>1200×400px tavsiya etiladi</div>
              </>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Do'kon tavsifi</label>
            <textarea
              className={styles.textarea}
              placeholder="Masalan: Toshkentdagi eng mazali somsa va choy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Manzil</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Toshkent, Chilonzor tumani"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button className={styles.btn} onClick={handleStep1} disabled={loading}>
            {loading ? 'Saqlanmoqda...' : 'Davom etish →'}
          </button>
          <p className={styles.skip} onClick={() => setStep(2)}>Hozircha o'tkazib yuborish</p>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Birinchi tovarlarni qo'shing</h2>
          <p className={styles.cardSubtitle}>Kamida 1 ta tovar qo'shing — keyinchalik ko'paytirasiz</p>

          {tovarlar.map((tovar, i) => (
            <div key={i} className={styles.tovarBox}>
              <div className={styles.tovarGrid}>

                <div className={styles.tovarLogo} style={logoPreview ? { padding: '0', border: 'none' } : {}}>
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={handleLogoChange} />
                    {logoPreview ? (
                    <img src={logoPreview} alt="Tovar logosi" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} />
                    ) : (
                  <>
                  <div className={styles.uploadIcon}><img src="/cutlery.png" alt="logo" /></div>
                  <div className={styles.uploadTitle}>Tovar logosi</div>
                  <div className={styles.uploadDesc}>PNG, JPG — max 2MB</div>
                </>
                )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Tovar nomi</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Somsa"
                    value={tovar.nom}
                    onChange={(e) => updateTovar(i, 'nom', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Narxi (so'm)</label>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="5000"
                    value={tovar.narx}
                    onChange={(e) => updateTovar(i, 'narx', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Qisqa tavsif</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Tandirda pishirilgan..."
                  value={tovar.tavsif}
                  onChange={(e) => updateTovar(i, 'tavsif', e.target.value)}
                />
              </div>
            </div>
          ))}

          <button className={styles.addTovar} onClick={addTovar}>
            + Tovar qo'shish
          </button>

          <div className={styles.btns}>
            <button className={styles.btnBack} onClick={() => setStep(1)}>← Orqaga</button>
            <button className={styles.btn} onClick={handleStep2} disabled={loading}>
              {loading ? 'Saqlanmoqda...' : 'Davom etish →'}
            </button>
          </div>
          <p className={styles.skip} onClick={() => setStep(3)}>Hozircha o'tkazib yuborish</p>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className={`${styles.card} ${styles.successCard}`}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>Do'koningiz tayyor!</h2>
          <p className={styles.successDesc}>
            Endi mijozlar buyurtma bera boshlashi mumkin.
          </p>

          <div className={styles.linkBox}>
            <div className={styles.linkLabel}>Sizning havolangiz</div>
            <div className={styles.linkValue}>jaxor.uz/sizning-dokoningiz</div>
          </div>

          <button className={styles.btn} onClick={() => router.push('/dashboard')}>
            Dashboardga o'tish →
          </button>
        </div>
      )}

    </div>
  )
}

export default Onboarding