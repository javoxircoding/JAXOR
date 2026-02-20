import styles from './home.module.css'

const Home = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.badge}>⚡ ALL-IN-ONE PLATFORM</div>
        <h1 className={styles.title}>
          Biznesingizni <br />
          <span className={styles.glimmer}>JAXOR</span> bilan boshqaring
        </h1>
        <p className={styles.description}>
          Sotuv, ombor va kuryerlar nazorati — har bir tadbirkor uchun
          maxsus ajratilgan xavfsiz raqamli makonda.
        </p>
        <div className={styles.heroBtns}>
          <button className={styles.primaryBtn}>14 kun bepul boshlash</button>
          <button className={styles.secondaryBtn}>Videoni ko'rish</button>
        </div>
      </div>

      <div className={styles.heroVisual}>
        <div className={styles.crystalContainer}>
          <div className={styles.crystalCore}></div>
          <div className={styles.glowSphere}></div>
        </div>
        <div className={`${styles.fCard} ${styles.sales}`}>
          <div className={`${styles.dot} ${styles.green}`}></div>
          Sotuvlar: +32%
        </div>
        <div className={`${styles.fCard} ${styles.stock}`}>
          <div className={`${styles.dot} ${styles.blue}`}></div>
          Ombor: 1.240 ta
        </div>
      </div>
    </section>
  )
}

export default Home