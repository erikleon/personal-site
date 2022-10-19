import Link from "next/link"
import styles from '../../styles/Navigation.module.css'

const Navigation = () => (
  <header className={styles.header}>
    <nav>
      <Link href="/">
        <a className={styles.pageLink}>Home</a>
      </Link>

      <Link href="/about">
        <a className={styles.pageLink}>About</a>
      </Link>
      
      <Link href="/contact">
        <a className={styles.pageLink}>Contact</a>
      </Link>
    </nav>
  </header>

)

export default Navigation