import styles from "./AddToCalendar.module.css";
import type { EventEntry } from "../../data/events";

type CalendarEvent = Pick<
  EventEntry,
  | "title"
  | "description"
  | "location"
  | "startDateTime"
  | "endDateTime"
  | "timezone"
>;

function toGoogleDatetime(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d+/, "");
}

function buildGoogleUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toGoogleDatetime(event.startDateTime)}/${toGoogleDatetime(event.endDateTime)}`,
    details: event.description,
    location: event.location,
    ctz: event.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsContent(event: CalendarEvent): string {
  const uid = `${Date.now()}@event`;
  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+/, "");
  const start = toGoogleDatetime(event.startDateTime);
  const end = toGoogleDatetime(event.endDateTime);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Personal Site//Events//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=${event.timezone}:${start}`,
    `DTEND;TZID=${event.timezone}:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs(event: CalendarEvent) {
  const content = buildIcsContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, "-")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface AddToCalendarProps {
  event: CalendarEvent;
  className?: string;
}

export default function AddToCalendar({ event, className }: AddToCalendarProps) {
  return (
    <div className={`${styles.buttons} ${className || ""}`}>
      <a
        href={buildGoogleUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
      >
        Google Calendar
      </a>
      <button
        type="button"
        onClick={() => downloadIcs(event)}
        className={styles.button}
      >
        Apple Calendar
      </button>
    </div>
  );
}
