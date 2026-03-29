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
}

export const events: EventEntry[] = [];
