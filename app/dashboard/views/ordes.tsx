// views/ordes.tsx
import { useState } from 'react'
import type { Order, OrderStatus } from '../types'
import { STATUS_LABEL } from '../constants'
import styles from '../dashboard.module.css'

interface Props {
  orders:       Order[]
  onAdvance:    (id: string) => void
}

export default function OrdersView({ orders, onAdvance }: Props) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  return (
    <div className={styles.fadeIn}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Buyurtmalar</h1>
          <p className={styles.pageSubtitle}>{orders.length} ta buyurtma</p>
        </div>
        <div className={styles.orderLegend}>
          <span className={styles.legendDot} style={{ background: '#fbbf24' }} />Yangi
          <span className={styles.legendDot} style={{ background: '#38bdf8', marginLeft: 12 }} />Jarayonda
          <span className={styles.legendDot} style={{ background: '#4ade80', marginLeft: 12 }} />Yetkazildi
        </div>
      </div>

      {/* Kanban columns */}
      <div className={styles.ordersGrid}>
        {(['new', 'accepted', 'delivered'] as OrderStatus[]).map(col => (
          <div key={col} className={styles.orderCol}>
            <div className={`${styles.orderColHeader} ${styles['och_' + col as keyof typeof styles]}`}>
              {STATUS_LABEL[col]}
              <span className={styles.orderColCount}>
                {orders.filter(o => o.status === col).length}
              </span>
            </div>

            {orders.filter(o => o.status === col).map(o => (
              <div
                key={o.id}
                className={styles.orderCard}
                onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
              >
                <div className={styles.orderCardTop}>
                  <span className={styles.orderCardId}>{o.id}</span>
                  <span className={styles.orderCardDate}>{o.date}</span>
                </div>
                <div className={styles.orderCardCustomer}>{o.customer}</div>
                <div className={styles.orderCardItems}>{o.items}</div>

                {expandedOrder === o.id && (
                  <div className={styles.orderCardExpanded}>
                    <div className={styles.expandRow}><span>📞</span>{o.phone}</div>
                    <div className={styles.expandRow}><span>📍</span>{o.address}</div>
                  </div>
                )}

                <div className={styles.orderCardBottom}>
                  <span className={styles.orderCardTotal}>{o.total.toLocaleString()} so'm</span>
                  {o.status !== 'delivered' && (
                    <button
                      className={styles.advanceBtn}
                      onClick={e => { e.stopPropagation(); onAdvance(o.id) }}
                    >
                      {o.status === 'new' ? 'Qabul →' : 'Yetkazildi ✓'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {orders.filter(o => o.status === col).length === 0 && (
              <div className={styles.emptyCol}>Bo'sh</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}