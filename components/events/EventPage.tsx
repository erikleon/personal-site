import { useState } from "react";
import styles from "./EventPage.module.css";
import AddToCalendar from "./AddToCalendar";
import EmojiRain from "./EmojiRain";
import RSVPForm from "./RSVPForm";
import RSVPSuccess from "./RSVPSuccess";
import RSVPList from "./RSVPList";
import type { EventEntry } from "../../data/events";
import type { RSVP, PublicRSVP } from "../../lib/rsvp";

interface EventPageProps {
  event: Omit<EventEntry, "passwordHash">;
  existingRsvp?: RSVP | null;
  rsvpList?: PublicRSVP[];
  themeStyles?: Record<string, string>;
}

export default function EventPage({ event, existingRsvp, rsvpList: initialList, themeStyles }: EventPageProps) {
  const [rsvp, setRsvp] = useState<RSVP | null>(existingRsvp ?? null);
  const [rsvpList, setRsvpList] = useState<PublicRSVP[]>(initialList ?? []);
  const s = themeStyles || styles;

  async function handleRsvpSuccess(newRsvp: RSVP) {
    setRsvp(newRsvp);
    const res = await fetch(`/api/events/rsvp-list?slug=${event.slug}`);
    if (res.ok) {
      setRsvpList(await res.json());
    }
  }

  return (
    <div className={s.container || styles.container}>
      <div className={s.hero || styles.hero}>
        {event.heroEmoji && (
          <span className={s.heroEmoji || styles.heroEmoji}>
            {event.heroEmoji}
          </span>
        )}
        <h1 className={s.title || styles.title}>{event.title}</h1>
      </div>

      <div className={s.details || styles.details}>
        <p className={s.detail || styles.detail}>
          <strong>Date:</strong> {event.date}
        </p>
        <p className={s.detail || styles.detail}>
          <strong>Time:</strong> {event.time}
        </p>
        <p className={s.detail || styles.detail}>
          <strong>Location:</strong>{" "}
          {event.locationUrl ? (
            <a
              href={event.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {event.location}
            </a>
          ) : (
            event.location
          )}
        </p>
        <AddToCalendar event={event} />
      </div>

      <p className={s.description || styles.description}>
        {event.description}
      </p>

      {rsvp && rsvp.attending && event.heroEmoji && <EmojiRain emoji={event.heroEmoji} />}

      {rsvp ? (
        <>
          <RSVPSuccess rsvp={rsvp} />
          {rsvpList.length > 0 && <RSVPList rsvps={rsvpList} />}
        </>
      ) : (
        <RSVPForm
          slug={event.slug}
          maxGuests={event.maxGuests}
          onSuccess={handleRsvpSuccess}
        />
      )}
    </div>
  );
}
