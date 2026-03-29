import crypto from "crypto";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET required for cookie signing");
  return secret;
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function signCookieValue(slug: string): string {
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(`event-access:${slug}`);
  return hmac.digest("hex");
}

export function verifyCookieValue(slug: string, value: string): boolean {
  const expected = signCookieValue(slug);
  return crypto.timingSafeEqual(
    Buffer.from(value),
    Buffer.from(expected)
  );
}

export function cookieName(slug: string): string {
  return `event-access-${slug}`;
}

export function makeSetCookieHeader(slug: string): string {
  const value = signCookieValue(slug);
  const maxAge = 30 * 24 * 60 * 60;
  return `${cookieName(slug)}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
}

export function hasValidAccess(
  cookies: Partial<Record<string, string>>,
  slug: string
): boolean {
  const value = cookies[cookieName(slug)];
  if (!value) return false;
  try {
    return verifyCookieValue(slug, value);
  } catch {
    return false;
  }
}
