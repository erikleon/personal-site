import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "../../styles/Navigation.module.css";

const Navigation = ({
  handleThemeToggle,
}: {
  handleThemeToggle: () => void;
}) => {
  const { data: session } = useSession();

  return (
    <header className="header">
      <nav>
        <Link href="/" className={styles.pageLink}>
          Home
        </Link>

        <Link href="/about" className={styles.pageLink}>
          About
        </Link>

        <Link href="/work" className={styles.pageLink}>
          Work
        </Link>

        <Link href="/projects" className={styles.pageLink}>
          Projects
        </Link>

        <Link href="mailto:yeserikcan@gmail.com" className={styles.pageLink}>
          Contact
        </Link>

        {session && (
          <Link href="/tools" className={styles.pageLink}>
            Tools
          </Link>
        )}

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
};

export default Navigation;
