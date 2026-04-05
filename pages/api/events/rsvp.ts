import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { Redis } from "@upstash/redis";
import { authOptions } from "../../../lib/auth";
import { events } from "../../../data/events";
import { saveRSVP, getRSVPs, redisKey } from "../../../lib/rsvp";
import { isValidSlug, hasValidAccess } from "../../../lib/event-cookie";

const MAX_NAME_LENGTH = 200;
const MAX_CONTACT_LENGTH = 200;
const MAX_NOTE_LENGTH = 1000;
const MAX_RSVPS_PER_HOUR = 10;
const RATE_WINDOW_SECONDS = 3600;

async function isRateLimited(ip: string, slug: string): Promise<boolean> {
  const redis = Redis.fromEnv();
  const key = redisKey(`ratelimit:rsvp:${ip}:${slug}`);
  const attempts = (await redis.get<number>(key)) ?? 0;
  if (attempts >= MAX_RSVPS_PER_HOUR) return true;
  await redis.incr(key);
  if (attempts === 0) await redis.expire(key, RATE_WINDOW_SECONDS);
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return handlePost(req, res);
  }

  if (req.method === "GET") {
    return handleGet(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { slug, name, attending, guestCount, contact, note } = req.body;

  if (!slug || !name || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (typeof slug !== "string" || !isValidSlug(slug)) {
    return res.status(400).json({ error: "Invalid slug format" });
  }

  const event = events.find((e) => e.slug === slug);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  // Verify password access cookie
  if (!hasValidAccess(req.cookies, slug)) {
    return res.status(403).json({ error: "Password verification required" });
  }

  // Check RSVP deadline
  if (new Date() > new Date(event.rsvpDeadline)) {
    return res.status(400).json({ error: "RSVP deadline has passed" });
  }

  // Input validation
  const trimmedName = String(name).trim().slice(0, MAX_NAME_LENGTH);
  const trimmedContact = String(contact).trim().slice(0, MAX_CONTACT_LENGTH);
  const trimmedNote = note ? String(note).trim().slice(0, MAX_NOTE_LENGTH) : undefined;

  if (!trimmedName || !trimmedContact) {
    return res.status(400).json({ error: "Name and contact cannot be empty" });
  }

  // Validate contact is a valid email or phone number
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
  const isPhone = /^\d{7,15}$/.test(trimmedContact.replace(/[\s\-().+]/g, ""));
  if (!isEmail && !isPhone) {
    return res.status(400).json({ error: "Please enter a valid email address or phone number" });
  }

  // Parse attending flag (defaults to true for backward compat)
  const isAttending = attending !== false;

  // Validate guestCount against event's maxGuests
  const maxAllowed = event.maxGuests || 10;
  const parsedGuestCount = isAttending
    ? Math.min(Math.max(1, Math.floor(Number(guestCount) || 1)), maxAllowed)
    : 0;

  // Rate limit by IP
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";
  if (await isRateLimited(ip, slug)) {
    return res.status(429).json({ error: "Too many submissions. Try again later." });
  }

  const rsvp = await saveRSVP(slug, {
    name: trimmedName,
    attending: isAttending,
    guestCount: parsedGuestCount,
    contact: trimmedContact,
    note: trimmedNote,
  });

  return res.status(201).json(rsvp);
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  // Admin-only: require auth
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const authorizedId = process.env.AUTHORIZED_GITHUB_ID;
  const userId = (session.user as { id?: string } | null)?.id;
  if (userId !== authorizedId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const slug = req.query.slug as string;
  if (!slug || !isValidSlug(slug)) {
    return res.status(400).json({ error: "Missing or invalid slug parameter" });
  }

  // Validate slug against known events
  const event = events.find((e) => e.slug === slug);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const rsvps = await getRSVPs(slug);
  return res.status(200).json(rsvps);
}
