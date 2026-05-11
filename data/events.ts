export interface EventEntry {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  locationUrl?: string;
  description: string;
  passwordHash: string;
  theme: string;
  rsvpDeadline: string;
  maxGuests?: number;
  heroEmoji?: string;
  /** ISO 8601 datetime for calendar links, e.g. "2026-04-26T10:00:00" */
  startDateTime: string;
  /** ISO 8601 datetime for calendar links, e.g. "2026-04-26T13:00:00" */
  endDateTime: string;
  /** IANA timezone, e.g. "America/New_York" */
  timezone: string;
}

export const events: EventEntry[] = [];
