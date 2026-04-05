import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";

const KEY_PREFIX =
  process.env.NODE_ENV === "production" ? "" : "dev:";

export function redisKey(key: string): string {
  return `${KEY_PREFIX}${key}`;
}

export interface RSVP {
  id: string;
  slug: string;
  name: string;
  attending: boolean;
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
  data: { name: string; attending: boolean; guestCount: number; contact: string; note?: string }
): Promise<RSVP> {
  const redis = getRedis();
  const id = uuidv4();
  const rsvp: RSVP = {
    id,
    slug,
    name: data.name,
    attending: data.attending,
    guestCount: data.attending ? data.guestCount : 0,
    contact: data.contact,
    note: data.note,
    createdAt: new Date().toISOString(),
  };

  const pipeline = redis.pipeline();
  pipeline.set(redisKey(`rsvp:${slug}:${id}`), JSON.stringify(rsvp));
  pipeline.sadd(redisKey(`rsvp-index:${slug}`), id);
  await pipeline.exec();

  return rsvp;
}

export async function getRSVPs(slug: string): Promise<RSVP[]> {
  const redis = getRedis();
  const ids = await redis.smembers(redisKey(`rsvp-index:${slug}`));

  if (ids.length === 0) return [];

  const keys = ids.map((id) => redisKey(`rsvp:${slug}:${id}`));
  const results = await redis.mget<string[]>(...keys);

  return results
    .filter((r): r is string => r !== null)
    .map((r) => (typeof r === "string" ? JSON.parse(r) : r) as RSVP)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
