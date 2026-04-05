import { useState, FormEvent } from "react";
import styles from "./RSVPForm.module.css";
import type { RSVP } from "../../lib/rsvp";

interface RSVPFormProps {
  slug: string;
  maxGuests?: number;
  onSuccess: (rsvp: RSVP) => void;
}

export default function RSVPForm({
  slug,
  maxGuests,
  onSuccess,
}: RSVPFormProps) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value: string): boolean {
    const digits = value.replace(/[\s\-().+]/g, "");
    return /^\d{7,15}$/.test(digits);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const trimmed = contact.trim();
    if (!isValidEmail(trimmed) && !isValidPhone(trimmed)) {
      setError("Please enter a valid email address or phone number.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/events/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, name, attending, guestCount, contact, note }),
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
        Your name(s) *
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Will you be attending?</legend>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="attending"
              checked={attending}
              onChange={() => setAttending(true)}
              className={styles.radio}
            />
            Yes
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="attending"
              checked={!attending}
              onChange={() => setAttending(false)}
              className={styles.radio}
            />
            No, can't make it
          </label>
        </div>
      </fieldset>

      {attending && (
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
      )}

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
        {loading ? "Sending..." : attending ? "Count me in!" : "Send regrets"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
