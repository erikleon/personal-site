import Navbar from "../navigation/Navigation";
import Footer from "../footer/Footer";
import styles from "../../styles/Layout.module.css";
import { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Layout({ children }: Record<string, React.ReactNode>) {
  console.log(
    "Hey there! If you're inspecting this page, you should hire me! I'm a great teammate and I'm looking for a job right now!"
  );

  const handleThemeToggle = () => {
    // toggle theme
    const wrapperElement = document.getElementById("wrapperElement");
    const themeToggleButton = document.getElementById("themeToggleButton");
    if (wrapperElement && themeToggleButton) {
      wrapperElement.classList.toggle(styles.light);
      themeToggleButton.classList.toggle(styles.light);
      wrapperElement.classList.toggle(styles.dark);
      themeToggleButton.classList.toggle(styles.dark);
    }
  };

  useEffect(() => {
    // get browser theme
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    // set theme
    const wrapperElement = document.getElementById("wrapperElement");
    const themeToggleButton = document.getElementById("themeToggleButton");
    if (wrapperElement && themeToggleButton) {
      if (theme === "dark") {
        wrapperElement.classList.add(styles.dark);
        themeToggleButton.classList.add(styles.dark);
      }
      if (theme === "light") {
        wrapperElement.classList.add(styles.light);
        themeToggleButton.classList.add(styles.light);
      }
    }
  }, []);

  return (
    <div id="wrapperElement" className={styles.layout}>
      <Navbar handleThemeToggle={handleThemeToggle} />
      <main>{children}</main>
      <Footer />
      <SpeedInsights />
    </div>
  );
}
