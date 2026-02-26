import styles from './aloqa.module.css'

const Aloqa = () => {
  return (
    <section id='aloqa' className={styles.contact}>
      <div className={styles.container}>

        {/* CHAP — Info */}
        <div className={styles.left}>
          <span className={styles.eyebrow}>Boglanish</span>
          <h2 className={styles.title}>
            Savolingiz bormi? <br />
            <span className={styles.gradient}>Javob beramiz.</span>
          </h2>
          <p className={styles.desc}>
            Har kuni 9:00 — 22:00 orasida javob beramiz.
          </p>

          <div className={styles.channels}>
            <a href="https://t.me/Javoxir_Vision" className={styles.channel}>
              <div className={styles.channelIcon}>✈️</div>
              <div>
                <span className={styles.channelLabel}>Telegram</span>
                <span className={styles.channelValue}>@Javoxir_Vsion</span>
              </div>
              <span className={styles.arrow}>→</span>
            </a>
            <a href="mailto:javoxirhamidjanov89@gmail.com" className={styles.channel}>
              <div className={styles.channelIcon}>📧</div>
              <div>
                <span className={styles.channelLabel}>Email</span>
                <span className={styles.channelValue}>hq@jaxor.uz</span>
              </div>
              <span className={styles.arrow}>→</span>
            </a>
            <div className={styles.channel}>
              <div className={styles.channelIcon}>📍</div>
              <div>
                <span className={styles.channelLabel}>Manzil</span>
                <span className={styles.channelValue}>Jizzax, O'zbekiston</span>
              </div>
              <span className={styles.arrow}>→</span>
            </div>
          </div>

          <div className={styles.trust}>
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>14</span>
              <span className={styles.trustLabel}>Kun bepul</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>12 soat</span>
              <span className={styles.trustLabel}>Javob vaqti</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>24/7</span>
              <span className={styles.trustLabel}>Tizim ishlaydi</span>
            </div>
          </div>
        </div>

        {/* O'NG — Form */}
        <div className={styles.right}>
          <div className={styles.formBox}>
            <h3 className={styles.formTitle}>Xabar yuboring</h3>
            <p className={styles.formSubtitle}>
              Demo ko'rish yoki savol — hammasi shu yerda.
            </p>
            <form action="">
              <div className={styles.inputGroup}>
              <label className={styles.label}>Ismingiz</label>
              <input className={styles.input} type="text" placeholder="Ismingizni kiriting" required />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Telefon</label>
              <input className={styles.input} type="tel" placeholder="+998 90 000 00 00" required />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Xabar</label>
              <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Xabaringizni qo'shing..." required />
            </div>
            <button className={styles.submit}>
              Yuborish
              <span className={styles.submitArrow}>→</span>
            </button>
            </form>
            <p className={styles.note}>🔒 Ma'lumotlaringiz xavfsiz. Spam yo'q.</p>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        <span className={styles.footerLogo}>JAXOR</span>
        <span className={styles.footerText}>© 2026 JAXOR. Barcha huquqlar himoyalangan.</span>
        <span className={styles.footerText}>Jizzax, O'zbekiston 🇺🇿</span>
      </div>
    </section>
  )
}

export default Aloqa