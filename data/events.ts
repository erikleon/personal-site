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

export const events: EventEntry[] = [
  {
    slug: "odin-3rd-birthday",
    title: "Odin's 3rd Birthday Party",
    date: "Sunday 04-26-2026",
    time: "10:00 am - 1:00 pm",
    location: "Odin's House",
    locationUrl:
      "https://maps.google.com/?q=186+Midwood+Street,+Brooklyn,+NY+11225",
    description:
      "Join us to celebrate Odin's 3rd birthday! There will be games, cupcakes, and lots of fun. Kids and adults welcome! Please RSVP by April 20th. No gifts, just bring your party spirit! 🥳",
    passwordHash:
      "$2b$10$JK9ysIlAl12FGsrorSigxuj5nCpQB5R0tM4X2MVpdgYqOOdqIVZyC",
    theme: "Basketball",
    rsvpDeadline: "2026-04-20",
    maxGuests: 50,
    heroEmoji: "🏀",
    startDateTime: "2026-04-26T10:00:00",
    endDateTime: "2026-04-26T13:00:00",
    timezone: "America/New_York",
  },
];
