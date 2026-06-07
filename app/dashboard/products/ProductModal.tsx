// products/ProductModal.tsx
'use client'
import { useRef, useState } from 'react'
import imageCompression from 'browser-image-compression'
import styles from '../dashboard.module.css'

export interface ProductFormData {
  id?:         string
  name:        string
  description: string
  price:       string
  stock:       string
  image:       string   // Supabase URL
}

interface Props {
  form:      ProductFormData
  setForm:   (fn: (f: ProductFormData) => ProductFormData) => void
  editingId: string | null
  onSave:    () => void
  onClose:   () => void
}

export default function ProductModal({ form, setForm, editingId, onSave, onClose }: Props) {
  const fileInputRef    = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [imgPreview, setImgPreview] = useState(form.image)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Мгновенный превью
    const local = URL.createObjectURL(file)
    setImgPreview(local)
    setUploading(true)

    try {
      const compressed = await imageCompression(file, { maxSizeMB: 0.8, maxWidthOrHeight: 800, useWebWorker: true })
      const ext      = file.name.split('.').pop() || 'jpg'
      const safeName = `product_${Date.now()}.${ext}`
      const safeFile = new File([compressed], safeName, { type: file.type })
      const fd       = new FormData()
      fd.append('file', safeFile)
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setForm(f => ({ ...f, image: data.url }))
    } catch (err: any) {
      alert(`Rasm yuklashda xatolik: ${err.message}`)
      setImgPreview(form.image)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{editingId ? 'Tahrirlash' : 'Yangi mahsulot'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        {/* ── Картинка ── */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Rasm
            {uploading && <span style={{ marginLeft: 8, color: '#38bdf8', fontSize: 10 }}>· yuklanmoqda...</span>}
          </label>
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            style={{ cursor: uploading ? 'wait' : 'pointer', position: 'relative', borderRadius: 12 }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            {imgPreview ? (
              <>
                <img src={imgPreview} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, opacity: uploading ? 0.5 : 1 }} />
                {uploading && (
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.5)', color: '#38bdf8', fontWeight: 700, fontSize: 13 }}>
                    ⏳ Yuklanmoqda...
                  </div>
                )}
                {!uploading && (
                  <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,.65)', borderRadius: 8, padding: '3px 10px', fontSize: 11, color: '#e2e8f0', fontWeight: 600 }}>
                    ✎ O'zgartirish
                  </div>
                )}
              </>
            ) : (
              <div className={styles.uploadZone}>
                <div className={styles.uploadIcon}>📷</div>
                <div className={styles.uploadText}>Rasm yuklash</div>
                <div className={styles.uploadHint}>JPG, PNG, WEBP · max 5MB</div>
              </div>
            )}
          </div>
        </div>

        {/* ── Name + Price ── */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nomi *</label>
            <input
              className={styles.formInput}
              placeholder="Gagarin Burger"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Narxi (so'm) *</label>
            <input
              className={styles.formInput}
              type="number"
              placeholder="45000"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            />
          </div>
        </div>

        {/* ── Stock + Description ── */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Miqdor (dona)</label>
            <input
              className={styles.formInput}
              type="number"
              placeholder="100"
              value={form.stock}
              onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tavsif</label>
            <input
              className={styles.formInput}
              placeholder="Tarkib, tavsif..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
          <button className={styles.primaryBtn} onClick={onSave} disabled={uploading}>
            {editingId ? 'Saqlash →' : "Qo'shish →"}
          </button>
        </div>
      </div>
    </div>
  )
}