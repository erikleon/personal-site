import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { events } from "../../../data/events";
import { saveRSVP, getRSVPs } from "../../../lib/rsvp";

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
  const { slug, name, guestCount, contact, note } = req.body;

  if (!slug || !name || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const event = events.find((e) => e.slug === slug);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  // Check RSVP deadline
  if (new Date() > new Date(event.rsvpDeadline)) {
    return res.status(400).json({ error: "RSVP deadline has passed" });
  }

  const rsvp = await saveRSVP(slug, {
    name,
    guestCount: Number(guestCount) || 1,
    contact,
    note: note || undefined,
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
  if (!slug) {
    return res.status(400).json({ error: "Missing slug parameter" });
  }

  const rsvps = await getRSVPs(slug);
  return res.status(200).json(rsvps);
}
