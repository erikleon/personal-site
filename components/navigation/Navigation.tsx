import Link from "next/link";
import styles from "../../styles/Navigation.module.css";

const Navigation = ({
  handleThemeToggle,
}: {
  handleThemeToggle: () => void;
}) => (
  <header className="header">
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

      <button
        id="themeToggleButton"
        aria-label="Toggle theme"
        className={styles.themeToggleButton}
        onClick={handleThemeToggle}
      >
        Toggle Theme
      </button>
    </nav>
  </header>
);

export default Navigation;
