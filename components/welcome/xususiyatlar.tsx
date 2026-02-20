import styles from './xususiyatlar.module.css'

const features = [
  {
    id: 'sales',
    label: 'Real-Vaqt',
    title: 'Savdo Analitikasi',
    desc: 'Har bir tranzaksiyani chuqur tahlil qiluvchi va daromadni bashorat qiluvchi intellektual tizim.',
    type: 'sales',
  },
  {
    id: 'stock',
    title: 'Aqlli Ombor',
    desc: 'Mahsulot 5 ta qolganda avtomatik xabar keladi. Hech narsa nazardan chetda qolmaydi.',
    type: 'stock',
  },
  {
    id: 'logistics',
    title: 'Logistika Hub',
    desc: 'Kuryerlar xaritada ko\'rinadi. Marshrut avtomatik optimallashadi. Vaqt tejaldi.',
    type: 'logistics',
  },
  {
    id: 'vault',
    title: 'JAXOR Vault',
    desc: 'Sizning ma\'lumotlaringiz faqat sizga tegishli. Izolyatsiyalangan xavfsiz muhit.',
    type: 'vault',
  },
]


const Xususiyatlar = () => {
  return (
    <section id='xususiyatlar' className={styles.features}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Texnologik Quvvat</span>
        <h2 className={styles.title}>
          Biznesingiz uchun{' '}
          <span className={styles.gradient}>Yagona Ekotizim</span>
        </h2>
        <p className={styles.subtitle}>
          To'rtta kuchli modul — bitta yaxlit tizimda.
        </p>
      </div>

      <div className={styles.grid}>
        {/* SALES — katta karta */}
        <div className={`${styles.card} ${styles.salesCard}`}>
          <div className={styles.cardTop}>
            <span className={styles.label}>Real-Vaqt</span>
            <h3 className={styles.cardTitle}>Savdo Analitikasi</h3>
            <p className={styles.cardDesc}>
              Har bir tranzaksiyani chuqur tahlil qiluvchi va daromadni
              bashorat qiluvchi intellektual tizim.
            </p>
          </div>
          <div className={styles.chartArea}>
            <div className={styles.chartLine}>
              <svg viewBox="0 0 300 80" className={styles.svg}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2083c5" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2083c5" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 C50,50 80,20 120,30 C160,40 180,10 240,15 C270,18 290,10 300,5"
                  fill="none"
                  stroke="#2083c5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={styles.linePath}
                />
                <path
                  d="M0,60 C50,50 80,20 120,30 C160,40 180,10 240,15 C270,18 290,10 300,5 L300,80 L0,80 Z"
                  fill="url(#lineGrad)"
                />
              </svg>
            </div>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>+32%</span>
                <span className={styles.statLabel}>Bu oy</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>1.24M</span>
                <span className={styles.statLabel}>Sotuv</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>98%</span>
                <span className={styles.statLabel}>Aniqlik</span>
              </div>
            </div>
          </div>
        </div>

        {/* STOCK */}
        <div className={`${styles.card} ${styles.stockCard}`}>
          <div className={styles.stockIcon}>📦</div>
          <h3 className={styles.cardTitle}>Aqlli Ombor</h3>
          <p className={styles.cardDesc}>
            Mahsulot tugayotganda avtomatik ogohlantirish.
          </p>
          <div className={styles.stockBars}>
            <div className={styles.stockRow}>
              <span>Somsa</span>
              <div className={styles.barTrack}>
                <div className={`${styles.barFill} ${styles.high}`}></div>
              </div>
            </div>
            <div className={styles.stockRow}>
              <span>Non</span>
              <div className={styles.barTrack}>
                <div className={`${styles.barFill} ${styles.mid}`}></div>
              </div>
            </div>
            <div className={styles.stockRow}>
              <span>Choy</span>
              <div className={styles.barTrack}>
                <div className={`${styles.barFill} ${styles.low}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* LOGISTICS */}
        <div className={`${styles.card} ${styles.logisticsCard}`}>
          <h3 className={styles.cardTitle}>Logistika Hub</h3>
          <p className={styles.cardDesc}>
            Kuryerlar xaritada ko'rinadi. Marshrut optimallashadi.
          </p>
          <div className={styles.mapMock}>
            <div className={styles.mapDot} style={{top: '30%', left: '40%'}}>
              <span className={styles.pulse}></span>
              🛵
            </div>
            <div className={styles.mapDot} style={{top: '55%', left: '65%'}}>
              <span className={styles.pulse}></span>
              🛵
            </div>
            <div className={styles.mapPin} style={{top: '20%', left: '60%'}}>📍</div>
            <div className={styles.mapPin} style={{top: '65%', left: '30%'}}>📍</div>
          </div>
        </div>

        {/* VAULT */}
        <div className={`${styles.card} ${styles.vaultCard}`}>
          <div className={styles.vaultLeft}>
            <h3 className={styles.cardTitle}>JAXOR Vault</h3>
            <p className={styles.cardDesc}>
              Sizning ma'lumotlaringiz faqat sizga tegishli. Izolyatsiyalangan xavfsiz muhit.
            </p>
            <div className={styles.vaultTags}>
              <span className={styles.tag}>🔒 Encrypted</span>
              <span className={styles.tag}>🛡️ Isolated</span>
              <span className={styles.tag}>✅ Verified</span>
            </div>
          </div>
          <div className={styles.shieldWrap}>
            <div className={styles.shieldRing}></div>
            <div className={styles.shieldIcon}>🛡️</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Xususiyatlar;