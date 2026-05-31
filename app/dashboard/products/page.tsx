'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProductInput {
  nom: string
  tavsif: string
  narx: string
  stock: string
  image: string
}

const VendorAddProducts = () => {
  const [products, setProducts] = useState<ProductInput[]>([
    { nom: '', tavsif: '', narx: '', stock: '0', image: '' }
  ])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Добавить еще одну пустую строчку для товара в форму
  const addRow = () => {
    setProducts([...products, { nom: '', tavsif: '', narx: '', stock: '0', image: '' }])
  }

  // Удалить конкретную строчку из формы
  const removeRow = (index: number) => {
    if (products.length === 1) return
    setProducts(products.filter((_, i) => i !== index))
  }

  // Следим за изменениями полей ввода
  const handleChange = (index: number, field: keyof ProductInput, value: string) => {
    const updated = [...products]
    updated[index][field] = value
    setProducts(updated)
  }

  // Отправка формы на бэкенд
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(false)

    // Простая проверка перед отправкой
    const hasEmptyNom = products.some(p => !p.nom.trim())
    const hasInvalidPrice = products.some(p => isNaN(Number(p.narx)) || Number(p.narx) <= 0)

    if (hasEmptyNom || hasInvalidPrice) {
      alert("Iltimos, barcha tovarlarning nomi va narxini to'g'ri kiriting!")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }) // Отправляем массив объектов
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi')

      alert(`Muvaffaqiyatli saqlandi! ${data.count} ta tovar qo'shildi 🚀`)
      
      // Сбрасываем форму в исходное состояние
      setProducts([{ nom: '', tavsif: '', narx: '', stock: '0', image: '' }])
      
      // Можно редиректнуть на страницу списка товаров
      router.push('/dashboard/products/list') 
    } catch (err: any) {
      alert(`Xatolik: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '30px', color: '#fff', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Tovarlar qo'shish 📦</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Do'koningiz uchun tovarlarni bir vaqtning o'zida ommaviy kiriting</p>

        <form onSubmit={handleSubmit}>
          {products.map((product, index) => (
            <div key={index} style={{ 
              backgroundColor: '#1e293b', 
              padding: '20px', 
              borderRadius: '12px', 
              marginBottom: '20px',
              border: '1px solid #334155',
              position: 'relative'
            }}>
              
              <h3 style={{ marginBottom: '15px', color: '#38bdf8' }}>Tovar #{index + 1}</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Nom *</label>
                  <input 
                    type="text" 
                    required
                    value={product.nom}
                    onChange={(e) => handleChange(index, 'nom', e.target.value)}
                    placeholder="Masalan: Erkaklar ko'ylagi"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Narxi (so'm) *</label>
                  <input 
                    type="number" 
                    required
                    value={product.narx}
                    onChange={(e) => handleChange(index, 'narx', e.target.value)}
                    placeholder="Masalan: 150000"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Soni (Skladda)</label>
                  <input 
                    type="number" 
                    value={product.stock}
                    onChange={(e) => handleChange(index, 'stock', e.target.value)}
                    placeholder="0"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Rasm URL (ixtiyoriy)</label>
                  <input 
                    type="text" 
                    value={product.image}
                    onChange={(e) => handleChange(index, 'image', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '5px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Tavsif (Tafsilotlar)</label>
                <textarea 
                  value={product.tavsif}
                  onChange={(e) => handleChange(index, 'tavsif', e.target.value)}
                  placeholder="Tovar haqida qisqacha ma'lumot..."
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', resize: 'vertical' }}
                />
              </div>

              {products.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeRow(index)}
                  style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  O'chirish
                </button>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button 
              type="button" 
              onClick={addRow}
              style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + Yana bir tovar qo'shish
            </button>

            <button 
              type="submit" 
              disabled={loading}
              style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flexGrow: 1 }}
            >
              {loading ? "Saqlanmoqda..." : "Barcha tovarlarni bazaga saqlash 🏎️💨"}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default VendorAddProducts