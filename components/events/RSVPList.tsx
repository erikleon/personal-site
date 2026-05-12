import styles from "./RSVPList.module.css";
import type { PublicRSVP } from "../../lib/rsvp";

interface RSVPListProps {
  rsvps: PublicRSVP[];
}

export default function RSVPList({ rsvps }: RSVPListProps) {
  const attending = rsvps.filter((r) => r.attending);
  const notAttending = rsvps.filter((r) => !r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Who&apos;s coming</h2>
      {attending.length > 0 ? (
        <>
          <p className={styles.summary}>
            {totalGuests} {totalGuests === 1 ? "guest" : "guests"} attending
          </p>
          <ul className={styles.list}>
            {attending.map((rsvp, i) => (
              <li key={`${rsvp.name}-${i}`} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.name}>{rsvp.name}</span>
                  {rsvp.guestCount > 1 && (
                    <span className={styles.guestCount}>
                      {rsvp.guestCount} guests
                    </span>
                  )}
                </div>
                {rsvp.note && <p className={styles.note}>{rsvp.note}</p>}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className={styles.empty}>No one has RSVP&apos;d yet.</p>
      )}

      {notAttending.length > 0 && (
        <>
          <h3 className={styles.subheading}>Can&apos;t make it</h3>
          <ul className={styles.list}>
            {notAttending.map((rsvp, i) => (
              <li key={`${rsvp.name}-${i}`} className={styles.item}>
                <span className={styles.name}>{rsvp.name}</span>
                {rsvp.note && <p className={styles.note}>{rsvp.note}</p>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
