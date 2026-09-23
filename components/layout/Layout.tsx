import { useRouter } from "next/router";
import Navbar from "../navigation/Navigation";
import Footer from "../footer/Footer";
import styles from "../../styles/Layout.module.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeContext, usePreferredTheme } from "../../lib/theme-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isEventPage = router.pathname.startsWith("/events");
  console.log(
    "Hey there! If you're inspecting this page, you should hire me! I'm a great teammate and I'm looking for a job right now!",
  );

  const [theme, setTheme] = usePreferredTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      id="wrapperElement"
      className={`${styles.layout} ${theme === "dark" ? styles.dark : styles.light}`}
    >
      {!isEventPage && (
        <Navbar handleThemeToggle={handleThemeToggle} theme={theme} />
      )}
      <ThemeContext.Provider value={theme}>
        <main>{children}</main>
      </ThemeContext.Provider>
      {!isEventPage && <Footer />}
      <SpeedInsights />
    </div>
  );
}
