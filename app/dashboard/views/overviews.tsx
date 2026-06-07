// views/overviews.tsx
import type { Order, Product, Period } from '../types'
import { DAILY_SALES, MONTHLY_SALES, DAYS_LABELS, MONTH_LABELS } from '../mockData'
import { STATUS_LABEL } from '../constants'
import PhotoThumb from '../components/PhotoThumb'
import styles from '../dashboard.module.css'

interface Props {
  period:      Period
  setPeriod:   (p: Period) => void
  orders:      Order[]
  products:    Product[]
  setView:     (v: 'orders') => void
}

export default function OverviewView({ period, setPeriod, orders, products, setView }: Props) {
  const salesData   = period === 'day' ? DAILY_SALES   : MONTHLY_SALES
  const salesLabels = period === 'day' ? DAYS_LABELS   : MONTH_LABELS
  const maxSale     = Math.max(...salesData)

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + o.total, 0)
  const activeOrders = orders.filter(o => o.status !== 'delivered').length
  const activeProds  = products.filter(p => p.status === 'active').length

  const productSales: Record<string, number> = {
    p1: period === 'day' ? 12 : 142,
    p2: period === 'day' ? 1  : 12,
    p3: period === 'day' ? 8  : 98,
    p4: period === 'day' ? 5  : 60,
    p5: period === 'day' ? 0  : 4,
  }

  const sortedByTop  = [...products].sort((a, b) => (productSales[b.id] || 0) - (productSales[a.id] || 0))
  const topProducts  = sortedByTop.slice(0, 2)
  const deadProducts = [...sortedByTop].reverse().slice(0, 2)

  return (
    <div className={styles.fadeIn}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Xush kelibsiz 👋</h1>
          <p className={styles.pageSubtitle}>Bugungi holat</p>
        </div>
        <div className={styles.periodToggle}>
          <button
            className={`${styles.periodBtn} ${period === 'day' ? styles.periodActive : ''}`}
            onClick={() => setPeriod('day')}
          >Bugun</button>
          <button
            className={`${styles.periodBtn} ${period === 'month' ? styles.periodActive : ''}`}
            onClick={() => setPeriod('month')}
          >Bu oy</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        {[
          { icon: '◈', label: 'Umumiy tushum',    value: `${(totalRevenue / 1000).toFixed(0)} 000 so'm`, delta: '+12%',  color: '#4ade80' },
          { icon: '◎', label: 'Faol buyurtmalar', value: String(activeOrders),                            delta: 'hozir', color: '#38bdf8' },
          { icon: '⊞', label: 'Mahsulotlar',      value: String(activeProds),                             delta: 'faol',  color: '#a78bfa' },
          { icon: '◉', label: 'Tashriflar',       value: '148',                                           delta: 'bugun', color: '#fb923c' },
        ].map((s, i) => (
          <div key={i} className={styles.statCard} style={{ animationDelay: `${i * 70}ms` }}>
            <span className={styles.statIcon} style={{ color: s.color }}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statDelta} style={{ color: s.color }}>{s.delta}</span>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{period === 'day' ? 'Haftalik' : 'Yillik'} sotuv</h2>
          <span className={styles.sectionNote}>so'mda (ming)</span>
        </div>
        <div className={styles.chartCard}>
          <div className={styles.barChart}>
            {salesData.map((v, i) => (
              <div key={i} className={styles.barCol}>
                <div className={styles.barTooltip}>{v}k</div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ height: `${(v / maxSale) * 100}%`, animationDelay: `${i * 50}ms` }}
                  />
                </div>
                <div className={styles.barDay}>{salesLabels[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top / Dead products */}
      <div className={styles.highlightRow}>
        <div className={styles.highlightCard}>
          <div className={styles.hlBadge} style={{ background: 'rgba(74,222,128,.12)', color: '#4ade80', borderColor: 'rgba(74,222,128,.2)' }}>
            🔥 Top mahsulotlar
          </div>
          {topProducts.map(p => (
            <div key={p.id} className={styles.hlItem}>
              <PhotoThumb photo={p.photo} photoType={p.photoType} size={32} />
              <span className={styles.hlName}>{p.name}</span>
              <span className={styles.hlCount} style={{ color: '#4ade80' }}>
                +{productSales[p.id]} {period === 'day' ? 'bugun' : 'bu oy'}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.highlightCard}>
          <div className={styles.hlBadge} style={{ background: 'rgba(239,68,68,.12)', color: '#f87171', borderColor: 'rgba(239,68,68,.2)' }}>
            ❄️ Kam sotilganlar
          </div>
          {deadProducts.map(p => (
            <div key={p.id} className={styles.hlItem}>
              <PhotoThumb photo={p.photo} photoType={p.photoType} size={32} />
              <span className={styles.hlName}>{p.name}</span>
              <span className={styles.hlCount} style={{ color: '#f87171' }}>
                {productSales[p.id]} {period === 'day' ? 'bugun' : 'bu oy'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>So'nggi buyurtmalar</h2>
          <button className={styles.sectionLink} onClick={() => setView('orders')}>
            Barchasini ko'rish →
          </button>
        </div>
        <div className={styles.orderList}>
          {orders.slice(0, 4).map(o => (
            <div key={o.id} className={styles.orderRow}>
              <div className={styles.orderLeft}>
                <span className={styles.orderId}>{o.id}</span>
                <span className={styles.orderCustomer}>{o.customer}</span>
              </div>
              <div className={styles.orderRight}>
                <span className={styles.orderTotal}>{o.total.toLocaleString()} so'm</span>
                <span className={`${styles.osBadge} ${styles['os_' + o.status as keyof typeof styles]}`}>
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}