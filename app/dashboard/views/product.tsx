// views/product.tsx
import type { RealProduct } from '@/hooks/useProducts'
import styles from '../dashboard.module.css'

interface Props {
  products: RealProduct[]
  loading:  boolean
  onAdd:    () => void
  onEdit:   (p: RealProduct) => void
  onDelete: (id: string) => void
}

export default function ProductView({ products, loading, onAdd, onEdit, onDelete }: Props) {

  const PhotoCell = ({ p }: { p: RealProduct }) => (
    p.image
      ? <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
      : <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🍽️</div>
  )

  return (
    <div className={styles.fadeIn}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Mahsulotlar</h1>
          <p className={styles.pageSubtitle}>{products.length} ta mahsulot</p>
        </div>
        <button className={styles.primaryBtn} onClick={onAdd}>+ Yangi</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>Yuklanmoqda...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          <p style={{ margin: 0 }}>Hozircha mahsulot yo'q</p>
          <button className={styles.primaryBtn} onClick={onAdd} style={{ marginTop: 16 }}>+ Birinchi mahsulot qo'shish</button>
        </div>
      ) : (
        <>
          {/* ── Mobile cards ── */}
          <div className={styles.productCards}>
            {products.map((p, i) => (
              <div key={p.id} className={styles.productCard} style={{ animationDelay: `${i * 40}ms` }}>
                <PhotoCell p={p} />
                <div className={styles.productCardBody}>
                  <div className={styles.productCardName}>{p.name}</div>
                  <div className={styles.productCardMeta}>
                    <span className={styles.monoCell} style={{ color: p.stock < 10 ? '#f87171' : p.stock < 30 ? '#fbbf24' : '#4ade80' }}>
                      {p.stock} dona
                    </span>
                  </div>
                  <div className={styles.productCardBottom}>
                    <span className={styles.productCardPrice}>{p.price.toLocaleString()} so'm</span>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.editBtn}`}   onClick={() => onEdit(p)}>✎</button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(p.id)}>✕</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop table ── */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Narx</th>
                  <th>Miqdor</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className={styles.tableRow} style={{ animationDelay: `${i * 40}ms` }}>
                    <td>
                      <div className={styles.productCell}>
                        <PhotoCell p={p} />
                        <div>
                          <div className={styles.productName}>{p.name}</div>
                          {p.description && <div className={styles.productInfo}>{p.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className={styles.monoCell}>{p.price.toLocaleString()} so'm</td>
                    <td className={styles.monoCell}>
                      <span style={{ color: p.stock < 10 ? '#f87171' : p.stock < 30 ? '#fbbf24' : '#4ade80' }}>
                        {p.stock} dona
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={`${styles.actionBtn} ${styles.editBtn}`}   onClick={() => onEdit(p)}>✎</button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(p.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}