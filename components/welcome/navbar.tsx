'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from 'react-scroll'
import styles from './navbar.module.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      setMenuOpen(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>JAXOR</div>

      <div className={styles.navLinks}>
        <Link to="xususiyatlar" smooth={true} duration={500} offset={-100} className={styles.navLink}>Xususiyatlar</Link>
        <Link to="tariflar" smooth={true} duration={500} offset={-100} className={styles.navLink}>Tariflar</Link>
        <Link to="aloqa" smooth={true} duration={500} offset={-100} className={styles.navLink}>Aloqa</Link>
      </div>

      <button onClick={() => router.push('/auth/login')} className={`${styles.navBtn} ${styles.desktopBtn}`}>Kirish</button>

      <button
        className={styles.burger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span className={`${styles.burgerLine} ${menuOpen ? styles.line1Open : ''}`}></span>
        <span className={`${styles.burgerLine} ${menuOpen ? styles.line2Open : ''}`}></span>
        <span className={`${styles.burgerLine} ${menuOpen ? styles.line3Open : ''}`}></span>
      </button>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <Link to="xususiyatlar" smooth={true} duration={50} offset={80} onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Xususiyatlar</Link>
        <Link to="tariflar" smooth={true} duration={50} offset={-100} onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Tariflar</Link>
        <Link to="aloqa" smooth={true} duration={50} offset={-100} onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Aloqa</Link>
        <button onClick={() => { router.push('/auth/login'); setMenuOpen(false) }} className={styles.navBtn}>Kirish</button>
      </div>
    </nav>
  )
}

export default Navbar