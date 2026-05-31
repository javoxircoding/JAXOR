'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './superadmin.module.css'

interface Store {
  id: string
  name: string
  type: string
  plan: string
  status: string
  createdAt: string
  trialEndsAt: string
  subdomain: string
  daysLeft: number // ИСПРАВЛЕНО: Принимаем готовые дни от сервера
  owner: {
    name: string
    phone: string
  }
}

const SuperAdmin = () => {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const router = useRouter()

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/admin/stores')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi')
      setStores(data.stores)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  // 1. DO'KON STATUSINI O'ZGARTIRISH (MUZLATISH / FAOLLASHTIRISH)
  const toggleStoreStatus = async (id: string, currentStatus: string, currentPlan: string) => {
    const nextStatus = currentStatus === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED'
    const confirmMsg = nextStatus === 'BLOCKED' 
      ? "Do'konni muzlatishni xohlaysizmi? Foydalanuvchi tizimga kira olmaydi!" 
      : "Do'konni qayta faollashtirmoqchimisiz?"
    
    if (!confirm(confirmMsg)) return

    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/stores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        // ИСПРАВЛЕНО: передаем и статус, и текущий план, чтобы бэк не запутался
        body: JSON.stringify({ status: nextStatus })    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi')
      
      // Обновляем состояние
      setStores(stores.map(s => s.id === id ? { ...s, status: nextStatus } : s))
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  // 2. TARIFNI O'ZGARTIRISH (НОВАЯ ФУНКЦИЯ ДЛЯ СМЕНЫ ТАРИФА И СЧЕТЧИКА ДНЕЙ)
  const changeStorePlan = async (id: string, newPlan: string, currentStatus: string) => {
    if (!confirm(`Do'kon tarifini ${newPlan} ga o'zgartirmoqchimisiz? Muddat avtomat yangilanadi!`)) return

    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/stores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        // Отправляем бэкенду новый план и текущий статус
        body: JSON.stringify({ plan: newPlan, status: currentStatus })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi')
      
      // После успешного изменения перезапрашиваем базу, чтобы подтянуть новые дни!
      await fetchStores()
      alert("Tarif va muddat muvaffaqiyatli yangilandi! 🏎️💨")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  // 3. DO'KONNI BUTUNLAY O'CHIRISH
  const deleteStore = async (id: string, name: string) => {
    if (!confirm(`DIQQAT! "${name}" do'konini bazadan butunlay o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!`)) return

    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/stores/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi')
      
      setStores(stores.filter(s => s.id !== id))
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className={styles.center}>Yuklanmoqda... Nazorat paneli yuklanmoqda...</div>
  if (error) return <div className={styles.errorBox}>Xatolik: {error}</div>

  return (
    <div className={styles.bigger}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>JAXOR Super Admin 👑</h1>
          <p>Platformadagi barcha do'konlarni nazorat qilish paneli</p>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <h3>{stores.length}</h3>
            <p>Jami do'konlar</p>
          </div>
          <div className={styles.statCard}>
            <h3>{stores.filter(s => s.status === 'BLOCKED').length}</h3>
            <p>Muzlatilganlar</p>
          </div>
          <div className={styles.statCard}>
            <h3>{stores.filter(s => s.plan === 'PRO').length}</h3>
            <p>PRO tariflar</p>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Do'kon nomi</th>
                <th>Subdomen</th>
                <th>Yaratuvchi / Tel</th>
                <th>Tarifni o'zgartirish</th>
                <th>Muddati</th>
                <th>Yaratilgan sana</th>
                <th style={{ textAlign: 'center' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className={store.status === 'BLOCKED' ? styles.rowBlocked : ''}>
                  <td className={styles.bold}>
                    {store.name} 
                    <span className={styles.typeBadge}>{store.type}</span>
                    {store.status === 'BLOCKED' && <span className={styles.blockedBadge}>Muzlatilgan</span>}
                  </td>
                  <td className={styles.subdomain}>{store.subdomain}.jaxor.uz</td>
                  <td>
                    <div>{store.owner?.name}</div>
                    <div className={styles.phone}>{store.owner?.phone}</div>
                  </td>
                  <td>
                    {/* ИСПРАВЛЕНО: Выпадающий список для изменения тарифа на лету */}
                    <select
                      disabled={actionLoading === store.id}
                      value={store.plan}
                      onChange={(e) => changeStorePlan(store.id, e.target.value, store.status)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor: '#1e293b',
                        color: '#fff',
                        border: '1px solid #475569',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="STARTER">STARTER (14 kun)</option>
                      <option value="STANDART">STANDART (30 kun)</option>
                      <option value="PRO">PRO (30 kun)</option>
                    </select>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {/* ИСПРАВЛЕНО: Сервер вычитает таймзоны сам, мы просто берем store.daysLeft */}
                    {store.daysLeft > 0 ? (
                      <span style={{ color: store.daysLeft <= 3 ? '#ef4444' : '#10b981' }}>
                        {store.daysLeft} kun qoldi
                      </span>
                    ) : (
                      <span style={{ color: '#ef4444' }}>Muddati tugagan</span>
                    )}
                  </td>
                  <td>{new Date(store.createdAt).toLocaleDateString('uz-UZ')}</td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        disabled={actionLoading === store.id}
                        onClick={() => toggleStoreStatus(store.id, store.status, store.plan)}
                        className={`${styles.actionBtn} ${store.status === 'BLOCKED' ? styles.unfreezeBtn : styles.freezeBtn}`}
                      >
                        {store.status === 'BLOCKED' ? 'Faollashtirish' : 'Muzlatish'}
                      </button>

                      <button
                        disabled={actionLoading === store.id}
                        onClick={() => deleteStore(store.id, store.name)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      >
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SuperAdmin