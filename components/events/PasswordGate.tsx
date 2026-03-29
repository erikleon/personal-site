import { useState, FormEvent } from "react";
import styles from "./PasswordGate.module.css";

interface PasswordGateProps {
  slug: string;
  onSuccess: () => void;
}

export default function PasswordGate({ slug, onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/events/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      });

      if (res.ok) {
        onSuccess();
      } else if (res.status === 429) {
        setError("Too many attempts. Please wait a few minutes.");
      } else {
        setError("Wrong password. Try again!");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>You&apos;re invited!</h1>
        <p className={styles.subtitle}>Enter the party password to continue</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={styles.input}
            autoFocus
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Checking..." : "Let me in!"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
