import { useRouter } from "next/router";
import Navbar from "../navigation/Navigation";
import Footer from "../footer/Footer";
import styles from "../../styles/Layout.module.css";
import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isEventPage = router.pathname.startsWith("/events");
  console.log(
    "Hey there! If you're inspecting this page, you should hire me! I'm a great teammate and I'm looking for a job right now!"
  );

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleThemeToggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(saved || system);
  }, []);

  return (
    <div id="wrapperElement" className={`${styles.layout} ${theme === "dark" ? styles.dark : styles.light}`}>
      {!isEventPage && <Navbar handleThemeToggle={handleThemeToggle} theme={theme} />}
      <main>{children}</main>
      {!isEventPage && <Footer />}
      <SpeedInsights />
    </div>
  );
}
