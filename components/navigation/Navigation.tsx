import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/Navigation.module.css";

const Navigation = ({
  handleThemeToggle,
  theme,
}: {
  handleThemeToggle: () => void;
  theme: "light" | "dark";
}) => {
  const router = useRouter();
  const linkClass = (href: string) =>
    `${router.pathname === href ? styles.pageLinkActive : ""} ${styles.pageLink} `;

  return (
    <header className={styles.header}>
      <nav>
        <Link href="/" className={linkClass("/")}>
          Home
        </Link>

        <Link href="/about" className={linkClass("/about")}>
          About
        </Link>

        <Link href="/work" className={linkClass("/work")}>
          Work
        </Link>

        <Link href="/projects" className={linkClass("/projects")}>
          Projects
        </Link>

        <button
          id="themeToggleButton"
          aria-label="Toggle theme"
          className={`${styles.themeToggleButton} ${theme === "dark" ? styles.dark : styles.light}`}
          onClick={handleThemeToggle}
        >
          Toggle Theme
        </button>
      </nav>
    </header>
  );
};

export default Navigation;
