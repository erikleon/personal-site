import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { events } from "../../../data/events";

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

  const event = events.find((e) => e.slug === slug);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const valid = await bcrypt.compare(password, event.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Wrong password" });
  }

  // Set access cookie for 30 days
  res.setHeader(
    "Set-Cookie",
    `event-access-${slug}=1; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; SameSite=Lax`
  );

  return res.status(200).json({ ok: true });
}
