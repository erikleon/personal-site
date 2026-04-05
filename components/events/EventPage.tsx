import { useState } from "react";
import styles from "./EventPage.module.css";
import AddToCalendar from "./AddToCalendar";
import EmojiRain from "./EmojiRain";
import RSVPForm from "./RSVPForm";
import RSVPSuccess from "./RSVPSuccess";
import type { EventEntry } from "../../data/events";
import type { RSVP } from "../../lib/rsvp";

interface EventPageProps {
  event: Omit<EventEntry, "passwordHash">;
  themeStyles?: Record<string, string>;
}

export default function EventPage({ event, themeStyles }: EventPageProps) {
  const [rsvp, setRsvp] = useState<RSVP | null>(null);
  const s = themeStyles || styles;

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
        <RSVPSuccess rsvp={rsvp} />
      ) : (
        <RSVPForm
          slug={event.slug}
          maxGuests={event.maxGuests}
          onSuccess={setRsvp}
        />
      )}
    </div>
  );
}
