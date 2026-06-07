// views/settings.tsx
'use client'
import { useState, useEffect } from 'react'
import imageCompression from 'browser-image-compression'
import type { StoreInfo } from '@/hooks/useStoreInfo'
import styles from '../dashboard.module.css'

interface Props {
  store:    StoreInfo | null
  onSaved:  () => void          // refetch после сохранения
}

export default function SettingsView({ store, onSaved }: Props) {
  const [name,        setName]        = useState('')
  const [description, setDescription] = useState('')
  const [address,     setAddress]     = useState('')
  const [logoUrl,     setLogoUrl]     = useState('')
  const [bannerUrl,   setBannerUrl]   = useState('')
  const [saving,      setSaving]      = useState(false)
  const [msg,         setMsg]         = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Заполняем форму когда данные загрузились
  useEffect(() => {
    if (!store) return
    setName(store.storeName)
    setDescription(store.description)
    setAddress(store.address)
    setLogoUrl(store.logo)
    setBannerUrl(store.banner)
  }, [store])

  // ── Загрузка изображения через /api/upload ──────────────
  const uploadImage = async (file: File, maxMB: number, maxPx: number): Promise<string> => {
    const compressed = await imageCompression(file, {
      maxSizeMB: maxMB, maxWidthOrHeight: maxPx, useWebWorker: true
    })
    const ext      = file.name.split('.').pop() || 'png'
    const safeName = `img_${Date.now()}.${ext}`
    const safeFile = new File([compressed], safeName, { type: file.type })
    const fd       = new FormData()
    fd.append('file', safeFile)
    const res  = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    return data.url as string
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file, 0.4, 600)
    setLogoUrl(url)
  }

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file, 0.8, 1200)
    setBannerUrl(url)
  }

  // ── Сохранение ──────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim()) return setMsg({ type: 'err', text: "Nom bo'sh bo'lishi mumkin emas" })
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch('/api/dashboard/store', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, address, logo: logoUrl, banner: bannerUrl })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xatolik')
      setMsg({ type: 'ok', text: "Muvaffaqiyatli saqlandi ✓" })
      onSaved()   // обновляем сайдбар
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.fadeIn}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Sozlamalar</h1>
          <p className={styles.pageSubtitle}>Do'kon ma'lumotlari</p>
        </div>
      </div>

      {/* Toast */}
      {msg && (
        <div style={{
          marginBottom: 16,
          padding: '10px 16px',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 600,
          background: msg.type === 'ok' ? 'rgba(74,222,128,.12)' : 'rgba(239,68,68,.12)',
          border:     `1px solid ${msg.type === 'ok' ? 'rgba(74,222,128,.25)' : 'rgba(239,68,68,.25)'}`,
          color:      msg.type === 'ok' ? '#4ade80' : '#f87171',
        }}>
          {msg.text}
        </div>
      )}

      <div className={styles.settingsGrid}>
        {/* ── Основные данные ── */}
        <div className={styles.settingsCard}>
          <h3 className={styles.settingsCardTitle}>Asosiy ma'lumotlar</h3>

          <div className={styles.settingsGroup}>
            <label className={styles.settingsLabel}>Do'kon nomi</label>
            <input
              className={styles.settingsInput}
              placeholder="Gagarin Burger"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className={styles.settingsGroup}>
            <label className={styles.settingsLabel}>Manzil</label>
            <input
              className={styles.settingsInput}
              placeholder="Toshkent, ko'cha..."
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className={styles.settingsGroup}>
            <label className={styles.settingsLabel}>Tavsif</label>
            <textarea
              className={styles.settingsTextarea}
              placeholder="Do'koningiz haqida..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <button
            className={styles.primaryBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saqlanmoqda...' : 'Saqlash →'}
          </button>
        </div>

        {/* ── Media ── */}
        <div className={styles.settingsCard}>
          <h3 className={styles.settingsCardTitle}>Media</h3>

          {/* Logo */}
          <div className={styles.settingsGroup}>
            <label className={styles.settingsLabel}>Logo</label>
            <label style={{ cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
              <div className={styles.uploadZone} style={logoUrl ? { padding: 0, border: 'none' } : {}}>
                {logoUrl
                  ? <img src={logoUrl} alt="logo" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12 }} />
                  : <>
                      <div className={styles.uploadIcon}>🏪</div>
                      <div className={styles.uploadText}>Logo yuklash</div>
                      <div className={styles.uploadHint}>PNG, JPG · max 2MB · 400×400px</div>
                    </>
                }
              </div>
            </label>
          </div>

          {/* Banner */}
          <div className={styles.settingsGroup}>
            <label className={styles.settingsLabel}>Banner</label>
            <label style={{ cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerChange} />
              <div className={`${styles.uploadZone} ${styles.uploadBanner}`} style={bannerUrl ? { padding: 0, border: 'none' } : {}}>
                {bannerUrl
                  ? <img src={bannerUrl} alt="banner" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12 }} />
                  : <>
                      <div className={styles.uploadIcon}>🖼️</div>
                      <div className={styles.uploadText}>Banner yuklash</div>
                      <div className={styles.uploadHint}>PNG, JPG · max 5MB · 1200×400px</div>
                    </>
                }
              </div>
            </label>
          </div>

          <button
            className={styles.primaryBtn}
            style={{ width: '100%', marginTop: 8 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saqlanmoqda...' : 'Saqlash →'}
          </button>
        </div>
      </div>
    </div>
  )
}