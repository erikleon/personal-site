import { useState, FormEvent } from "react";
import styles from "./RSVPForm.module.css";
import type { RSVP } from "../../lib/rsvp";

interface RSVPFormProps {
  slug: string;
  maxGuests?: number;
  onSuccess: (rsvp: RSVP) => void;
}

export default function RSVPForm({ slug, maxGuests, onSuccess }: RSVPFormProps) {
  const [name, setName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/events/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, name, guestCount, contact, note }),
    });

    setLoading(false);

    if (res.ok) {
      const rsvp = await res.json();
      onSuccess(rsvp);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.heading}>RSVP</h2>

      <label className={styles.label}>
        Your name *
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Number of guests
        <input
          type="number"
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          min={1}
          max={maxGuests || 10}
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Email or phone *
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Note (optional)
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className={styles.textarea}
        />
      </label>

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? "Sending..." : "Count me in!"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
