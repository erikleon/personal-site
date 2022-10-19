import Link from "next/link"
import styles from '../../styles/Navigation.module.css'

const Footer = () => (
  <footer className={styles.footer}>
    <Link href="/Karwatowski_Erik_Resume.pdf">
      <a target="_blank"  className={styles.pageLink}>Resume</a>
    </Link>

    <a className={styles.pageLink} target="_blank" href="https://github.com/erikleon/">GitHub</a>

    <a className={styles.pageLink} target="_blank" href="https://linkedin.com/in/erikkarwatowski/">LinkedIn</a>
  </footer>
)

export default Footer