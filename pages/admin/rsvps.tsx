import { useState, useEffect } from "react";
import Head from "next/head";
import type { GetServerSidePropsContext } from "next";
import { requireAuth } from "../../lib/auth";
import { events } from "../../data/events";
import type { RSVP } from "../../lib/rsvp";
import styles from "../../styles/events/admin.module.css";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return requireAuth(ctx);
}

export default function AdminRSVPs() {
  const [selectedSlug, setSelectedSlug] = useState(
    events.length > 0 ? events[0].slug : ""
  );
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedSlug) return;
    setLoading(true);
    fetch(`/api/events/rsvp?slug=${selectedSlug}`)
      .then((r) => r.json())
      .then((data) => {
        setRsvps(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedSlug]);

  const attendingRsvps = rsvps.filter((r) => r.attending !== false);
  const decliningRsvps = rsvps.filter((r) => r.attending === false);
  const totalGuests = attendingRsvps.reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <>
      <Head>
        <title>RSVP Admin</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.heading}>RSVP Admin</h1>

        {events.length === 0 ? (
          <p>No events configured yet.</p>
        ) : (
          <>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className={styles.select}
            >
              {events.map((ev) => (
                <option key={ev.slug} value={ev.slug}>
                  {ev.title}
                </option>
              ))}
            </select>

            {loading ? (
              <p>Loading...</p>
            ) : rsvps.length === 0 ? (
              <p>No RSVPs yet.</p>
            ) : (
              <>
                <p className={styles.summary}>
                  {attendingRsvps.length} attending ({totalGuests}{" "}
                  {totalGuests === 1 ? "guest" : "guests"}),{" "}
                  {decliningRsvps.length} declined
                </p>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Guests</th>
                        <th>Contact</th>
                        <th>Note</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps.map((r) => (
                        <tr key={r.id}>
                          <td>{r.name}</td>
                          <td>{r.attending === false ? "Declined" : "Attending"}</td>
                          <td>{r.attending === false ? "—" : r.guestCount}</td>
                          <td>{r.contact}</td>
                          <td>{r.note || "—"}</td>
                          <td>
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
