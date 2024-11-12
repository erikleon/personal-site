import Link from "next/link"
import styles from '../../styles/Navigation.module.css'

const Footer = () => (
  <footer className={styles.footer}>
    <Link href="/Karwatowski_Erik_Resume.pdf" target="_blank" rel="noreferrer" className={styles.pageLink}>
      Resume
    </Link>

    <a className={styles.pageLink} target="_blank" rel="noreferrer" href="https://github.com/erikleon/">GitHub</a>

    <a className={styles.pageLink} target="_blank" rel="noreferrer" href="https://linkedin.com/in/erikkarwatowski/">LinkedIn</a>
  </footer>
)

export default Footer