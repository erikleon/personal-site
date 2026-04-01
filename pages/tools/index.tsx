import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { requireAuth } from "../../lib/auth";
import styles from "../../styles/Backgammon.module.css";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return requireAuth(ctx);
};

const tools = [
  {
    name: "Backgammon",
    description: "Play backgammon against an AI opponent",
    href: "/tools/backgammon",
  },
];

export default function ToolsIndex() {
  return (
    <>
      <Head>
        <title>Tools | Erik Karwatowski</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Tools</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                display: "block",
                padding: "1.5rem",
                border: "2px solid #a08060",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>
                {tool.name}
              </h2>
              <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
