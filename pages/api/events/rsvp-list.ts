import type { NextApiRequest, NextApiResponse } from "next";
import { events } from "../../../data/events";
import { getRSVP, getRSVPs, toPublicRSVP } from "../../../lib/rsvp";
import { isValidSlug } from "../../../lib/event-cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const slug = req.query.slug as string;
  if (!slug || !isValidSlug(slug)) {
    return res.status(400).json({ error: "Missing or invalid slug" });
  }

  const event = events.find((e) => e.slug === slug);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const rsvpId = req.cookies[`rsvped-${slug}`];
  if (!rsvpId) {
    return res.status(403).json({ error: "RSVP required to view list" });
  }

  try {
    const rsvp = await getRSVP(slug, rsvpId);
    if (!rsvp) {
      return res.status(403).json({ error: "RSVP not found" });
    }

    const rsvps = await getRSVPs(slug);
    return res.status(200).json(rsvps.map(toPublicRSVP));
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
}
