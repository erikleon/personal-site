import styles from "./RSVPSuccess.module.css";
import type { RSVP } from "../../lib/rsvp";

interface RSVPSuccessProps {
  rsvp: RSVP;
}

export default function RSVPSuccess({ rsvp }: RSVPSuccessProps) {
  if (!rsvp.attending) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Thanks for letting us know</h2>
        <p className={styles.message}>
          Sorry you can't make it, <strong>{rsvp.name}</strong>. We'll miss you!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>You're in!</h2>
      <p className={styles.message}>
        Thanks, <strong>{rsvp.name}</strong>! We've got you down for{" "}
        {rsvp.guestCount} {rsvp.guestCount === 1 ? "guest" : "guests"}.
      </p>
      <p className={styles.note}>See you there!</p>
    </div>
  );
}
