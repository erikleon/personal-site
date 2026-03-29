import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";
import { events } from "../../../data/events";
import { isValidSlug, makeSetCookieHeader } from "../../../lib/event-cookie";

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 300; // 5 minutes

async function isRateLimited(ip: string, slug: string): Promise<boolean> {
  const redis = Redis.fromEnv();
  const key = `ratelimit:password:${ip}:${slug}`;
  const attempts = (await redis.get<number>(key)) ?? 0;
  if (attempts >= MAX_ATTEMPTS) return true;
  await redis.incr(key);
  if (attempts === 0) await redis.expire(key, WINDOW_SECONDS);
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, password } = req.body;

  if (!slug || !password) {
    return res.status(400).json({ error: "Missing slug or password" });
  }

  if (typeof slug !== "string" || !isValidSlug(slug)) {
    return res.status(400).json({ error: "Invalid slug format" });
  }

  const event = events.find((e) => e.slug === slug);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  // Rate limit by IP + slug
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";
  if (await isRateLimited(ip, slug)) {
    return res.status(429).json({ error: "Too many attempts. Try again later." });
  }

  const valid = await bcrypt.compare(password, event.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Wrong password" });
  }

  // Set HMAC-signed access cookie for 30 days
  res.setHeader("Set-Cookie", makeSetCookieHeader(slug));

  return res.status(200).json({ ok: true });
}
