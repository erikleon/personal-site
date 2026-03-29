import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";

export interface RSVP {
  id: string;
  slug: string;
  name: string;
  guestCount: number;
  contact: string;
  note?: string;
  createdAt: string;
}

function getRedis() {
  return Redis.fromEnv();
}

export async function saveRSVP(
  slug: string,
  data: { name: string; guestCount: number; contact: string; note?: string }
): Promise<RSVP> {
  const redis = getRedis();
  const id = uuidv4();
  const rsvp: RSVP = {
    id,
    slug,
    name: data.name,
    guestCount: data.guestCount,
    contact: data.contact,
    note: data.note,
    createdAt: new Date().toISOString(),
  };

  await redis.set(`rsvp:${slug}:${id}`, JSON.stringify(rsvp));
  await redis.sadd(`rsvp-index:${slug}`, id);

  return rsvp;
}

export async function getRSVPs(slug: string): Promise<RSVP[]> {
  const redis = getRedis();
  const ids = await redis.smembers(`rsvp-index:${slug}`);

  if (ids.length === 0) return [];

  const keys = ids.map((id) => `rsvp:${slug}:${id}`);
  const results = await redis.mget<string[]>(...keys);

  return results
    .filter((r): r is string => r !== null)
    .map((r) => (typeof r === "string" ? JSON.parse(r) : r) as RSVP)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
