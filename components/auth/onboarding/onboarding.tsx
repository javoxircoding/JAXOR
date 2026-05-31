'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'
import styles from './onboarding.module.css'

const UZ_VALID_OPERATOR_CODES = [
  '33', '50', '55', '77', '88', '90', '91', '93', '94', '95', '97', '98', '99'
]

const VALID_MOCK_CODES: Record<string, string> = {
  '+998 (90) 499-76-82': '111111', 
  '+998 (90) 123-45-67': '777777',
  '+998 (90) 333-33-33': '177777',
  '+998 (90) 000-00-00': '117777',
  '+998 (90) 100-00-00': '117777',
  '+998 (90) 200-00-00': '117777',
}

const Onboarding = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [storeType, setStoreType] = useState('')
  const [storeName, setStoreName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [bannerPreview, setBannerPreview] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [smsCode, setSmsCode] = useState('')
  const [timer, setTimer] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const router = useRouter()

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const formatPhoneNumber = (digits: string) => {
    if (!digits) return '+998'
    let res = '+998'
    if (digits.length > 0) res += ' (' + digits.slice(0, 2)
    if (digits.length <= 2) return res
    res += ') ' + digits.slice(2, 5)
    if (digits.length <= 5) return res
    res += '-' + digits.slice(5, 7)
    if (digits.length <= 7) return res
    res += '-' + digits.slice(7, 9)
    return res
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const onlyDigits = value.replace(/\D/g, '')
    if (onlyDigits === '998' || onlyDigits.length < 3) {
      setPhoneDigits('')
      return
    }
    const cleanDigits = onlyDigits.startsWith('998') ? onlyDigits.slice(3) : onlyDigits
    if (cleanDigits.length <= 9) {
      setPhoneDigits(cleanDigits)
    }
  }

  const handleSmsCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleanValue = value.replace(/\D/g, '')
    if (cleanValue.length <= 6) {
      setSmsCode(cleanValue)
    }
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoPreview(URL.createObjectURL(file))
      const compressedBlob = await imageCompression(file, { maxSizeMB: 0.4, maxWidthOrHeight: 600, useWebWorker: true })
      setLogoFile(new File([compressedBlob], file.name, { type: file.type }))
    }
  }

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerPreview(URL.createObjectURL(file))
      const compressedBlob = await imageCompression(file, { maxSizeMB: 0.8, maxWidthOrHeight: 1200, useWebWorker: true })
      setBannerFile(new File([compressedBlob], file.name, { type: file.type }))
    }
  }

  // --- ИСПРАВЛЕННАЯ ФУНКЦИЯ (КЛЮЧЕВАЯ ПРАВКА) ---
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop() || 'png'
    // Генерируем чистое имя файла, чтобы Supabase не давал ошибку
    const safeName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`
    const safeFile = new File([file], safeName, { type: file.type })
    
    const formData = new FormData()
    formData.append('file', safeFile)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    return data.url
  }

  const handleNextToPhone = () => {
    if (!storeType) return setError("Iltimos, do'kon turini tanlang!")
    if (!storeName.trim()) return setError("Iltimos, do'kon nomini kiriting!")
    setError('')
    setStep(2)
  }

  const handleRequestSms = async () => {
    if (phoneDigits.length !== 9) {
      return setError("Telefon raqamini to'liq kiriting! Masalan: (93) 567-70-81")
    }
    const operatorCode = phoneDigits.slice(0, 2)
    if (!UZ_VALID_OPERATOR_CODES.includes(operatorCode)) {
      return setError(`Noto'g'ri kod operator kiritildi (${operatorCode}).`)
    }
    setLoading(true)
    setError('')
    setAttempts(0)
    const fullFormattedPhone = formatPhoneNumber(phoneDigits)
    try {
      const res = await fetch('/api/onboarding/sms-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullFormattedPhone })
      })
      if (res.ok) {
        setTimer(300)
        setStep(3)
        setLoading(false)
        return
      }
    } catch { console.log("MVP режим") }
    setTimeout(() => {
      setTimer(300)
      setStep(3)
      setLoading(false)
    }, 1000)
  }

  const handleVerifyAndSubmit = async () => {
    const fullFormattedPhone = formatPhoneNumber(phoneDigits)
    const trimmedCode = smsCode.trim()
    if (attempts >= 5) return setError("Siz 5 marta noto'g'ri kod kiritingiz!")
    if (!trimmedCode) return setError("Tasdiqlash kodini kiritishingiz shart!")
    if (trimmedCode.length !== 6) return setError("SMS kod 6 ta raqam bo'lishi kerak!")
    setLoading(true)
    setError('')
    const expectedCode = VALID_MOCK_CODES[fullFormattedPhone]
    if (!expectedCode) {
      setError("Ushbu abonentga ruxsat berilmagan!")
      setLoading(false)
      return
    }
    if (trimmedCode !== expectedCode) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setError(`Kiritilgan SMS kod noto'g'ri! Qolgan urinishlar: ${5 - newAttempts}/5`)
      setLoading(false)
      return
    }
    try {
      let logoUrl = ''
      let bannerUrl = ''
      if (logoFile) logoUrl = await uploadImage(logoFile)
      if (bannerFile) bannerUrl = await uploadImage(bannerFile)
      const storeRes = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: storeName, type: storeType, phone: fullFormattedPhone, description, address, logo: logoUrl, banner: bannerUrl })
      })
      if (storeRes.ok) router.push('/dashboard')
      else {
        const storeData = await storeRes.json()
        setError(storeData.error || "Do'konni saqlashda xatolik yuz berdi.")
      }
    } catch { setError("Kritik xatolik yuz berdi.") }
    finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logo}>JAXOR</div>
        <h1 className={styles.title}>Do'koningizni sozlaylik 🎉</h1>
        <p className={styles.subtitle}>Ma'lumotlarni to'ldiring va faollashtiring</p>
      </div>
      {error && <div className={styles.errorBox}>{error}</div>}
      <div className={styles.card}>
        {step === 1 && (
          <>
            <h2 className={styles.cardTitle}>Do'kon ma'lumotlari</h2>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Do'kon turi</label>
              <select className={styles.input} value={storeType} onChange={(e) => setStoreType(e.target.value)}>
                <option value="">Tanlang...</option>
                <option value="FOOD">Kafe / Oshxona</option>
                <option value="CLOTHES">Market / Do'kon (Oshxonadan tashqari)</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Do'kon nomi</label>
              <input className={styles.input} type="text" placeholder="Gagarin Burger" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
            <div className={styles.uploadArea} style={logoPreview ? { padding: '0', border: 'none' } : {}}>
              <input type="file" accept="image/*" className={styles.fileInput} onChange={handleLogoChange} />
              {logoPreview ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '20px' }} /> : <div className={styles.uploadTitle}>🏪 Logo yuklang</div>}
            </div>
            <div className={styles.uploadArea} style={bannerPreview ? { padding: '0', border: 'none' } : {}}>
              <input type="file" accept="image/*" className={styles.fileInput} onChange={handleBannerChange} />
              {bannerPreview ? <img src={bannerPreview} alt="banner" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '20px' }} /> : <div className={styles.uploadTitle}>🖼️ Banner yuklang</div>}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Do'kon tavsifi</label>
              <textarea className={styles.textarea} placeholder="Do'koningiz haqida qisqacha..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Manzil</label>
              <input className={styles.input} type="text" placeholder="Jizzax, Gagarin sh." value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <button className={styles.btn} onClick={handleNextToPhone}>Davom etish →</button>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className={styles.cardTitle}>Verifikatsiya</h2>
            <p className={styles.cardSubtitle}>Telefon raqamingizni kiriting</p>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Telefon raqam</label>
              <input className={styles.input} type="text" value={formatPhoneNumber(phoneDigits)} onChange={handlePhoneChange} style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }} />
            </div>
            <button className={styles.btn} onClick={handleRequestSms} disabled={loading}>{loading ? "Yuborilmoqda..." : "SMS kod olish →"}</button>
            <p className={styles.skip} onClick={() => setStep(1)} style={{ marginTop: '15px', textAlign: 'center', cursor: 'pointer' }}>← Orqaga qaytish</p>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className={styles.cardTitle}>Telefon raqamni tasdiqlash</h2>
            <p className={styles.cardSubtitle}><b>{formatPhoneNumber(phoneDigits)}</b> raqamiga yuborilgan kodni kiriting</p>
            <div className={styles.inputGroup}>
              <label className={styles.label}>SMS Kod</label>
              <input className={styles.input} type="text" placeholder="123456" value={smsCode} onChange={handleSmsCodeChange} disabled={attempts >= 5} style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px' }} />
            </div>
            <button className={styles.btn} onClick={handleVerifyAndSubmit} disabled={loading || attempts >= 5}>{loading ? "Tekshirilmoqda..." : "Tasdiqlash va Do'konni ochish 🎉"}</button>
            <div className={styles.smsTimerBox} style={{ marginTop: '15px', textAlign: 'center' }}>
              {timer > 0 ? <p style={{ color: '#666' }}>Yangi kod yuborish: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p> : <button className={styles.skip} onClick={handleRequestSms}>Kodni qayta yuborish</button>}
            </div>
            <p className={styles.skip} onClick={() => setStep(2)} style={{ marginTop: '10px', textAlign: 'center', cursor: 'pointer' }}>← Raqamni o'zgartirish</p>
          </>
        )}
      </div>
    </div>
  )
}
export default Onboarding