import Link from "next/link";
import styles from "../../styles/Navigation.module.css";
import { useSession } from "next-auth/react";

const Footer = () => {
  const { data: session } = useSession();

  return (
    <footer className={styles.footer}>
      {session && (
        <Link href="/tools" className={styles.pageLink}>
          Tools
        </Link>
      )}
      <Link
        href="/Karwatowski_Erik_Resume.pdf"
        target="_blank"
        rel="noreferrer"
        className={styles.pageLink}
      >
        Resume
      </Link>

      <a
        className={styles.pageLink}
        target="_blank"
        rel="noreferrer"
        href="https://github.com/erikleon/"
      >
        GitHub
      </a>

      <a
        className={styles.pageLink}
        target="_blank"
        rel="noreferrer"
        href="https://linkedin.com/in/erikkarwatowski/"
      >
        LinkedIn
      </a>
    </footer>
  );
};

export default Footer;
