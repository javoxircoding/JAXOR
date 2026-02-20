import styles from './tariflar.module.css'

const plans = [
  {
    name: 'Starter',
    desc: 'Kichik bizneslar uchun',
    price: 'Bepul',
    period: '14 kun',
    price2: 'keyin 150 000 so\'m/oy',
    features: ['Oylik hisobot', 'Telegram bot', 'Bazaviy ombor', 'Buyurtma tizimi'],
    cta: 'Bepul boshlash',
    highlight: false,
  },
  {
    name: 'Standart',
    desc: 'O\'sib borayotgan bizneslar uchun',
    price: '300 000',
    period: 'so\'m/oy',
    features: ['Hisobotlar', 'Telegram bot', 'Ombor + xabarlar', 'Kuryer tizimi', 'Xodimlar boshqaruvi'],
    cta: 'Hozir boshlash',
    highlight: true,
  },
  {
    name: 'Pro',
    desc: 'Katta jamoalar uchun',
    price: '500 000',
    period: 'so\'m/oy',
    features: ['Kengaytirilgan analitika', 'Barcha modullar', 'Ustuvor yordam', 'Maxsus sozlamalar', 'API kirish'],
    cta: 'Pro boshlash',
    highlight: false,
  },
]

const Tariflar = () => {
  return (
    <section id='tariflar' className={styles.pricing}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Narxlar</span>
        <h2 className={styles.title}>
          Sizning o'sishingiz uchun{' '}
          <span className={styles.gradient}>shaffof narxlar</span>
        </h2>
        <p className={styles.subtitle}>
          14 kun bepul. Kredit karta kerak emas.
        </p>
      </div>

      <div className={styles.grid}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`${styles.card} ${plan.highlight ? styles.highlighted : ''}`}
          >
            {plan.highlight && (
              <div className={styles.badge}>⭐ Tavsiya etiladi</div>
            )}
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planDesc}>{plan.desc}</p>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.price}>{plan.price}</span>
              <span className={styles.period}>{plan.period}</span>
            </div>
            <div className={styles.priceRow}>
              <span style={{marginTop: '-20px'}} className={styles.period}>{plan.price2}</span>
            </div>
            <ul className={styles.features}>
              {plan.features.map((f) => (
                <li key={f} className={styles.featureItem}>
                  <span className={styles.check}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`${styles.cta} ${plan.highlight ? styles.ctaMain : ''}`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Tariflar