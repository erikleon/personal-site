import Link from "next/link"
import styles from '../../styles/Navigation.module.css'

const Navigation = () => (
  <header className={styles.header}>
    <nav>
      <Link href="/" className={styles.pageLink}>
        Home
      </Link>

      <Link href="/about" className={styles.pageLink}>
        About
      </Link>
      
      <Link href="/contact" className={styles.pageLink}>
        Contact
      </Link>
    </nav>
  </header>

)

export default Navigation