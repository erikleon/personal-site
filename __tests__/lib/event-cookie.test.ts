import { isValidSlug, signCookieValue, verifyCookieValue, cookieName, makeSetCookieHeader, hasValidAccess } from "../../lib/event-cookie";

// Set test secret
beforeAll(() => {
  process.env.NEXTAUTH_SECRET = "test-secret-for-unit-tests";
});

describe("isValidSlug", () => {
  it("accepts lowercase alphanumeric with hyphens", () => {
    expect(isValidSlug("basketball-birthday")).toBe(true);
    expect(isValidSlug("my-event-2025")).toBe(true);
    expect(isValidSlug("simple")).toBe(true);
  });

  it("rejects invalid slugs", () => {
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("Has Spaces")).toBe(false);
    expect(isValidSlug("UPPERCASE")).toBe(false);
    expect(isValidSlug("special!chars")).toBe(false);
    expect(isValidSlug("under_score")).toBe(false);
    expect(isValidSlug("../traversal")).toBe(false);
  });
});

describe("signCookieValue / verifyCookieValue", () => {
  it("produces a hex string", () => {
    const sig = signCookieValue("test-event");
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });

  it("verifies a valid signature", () => {
    const sig = signCookieValue("test-event");
    expect(verifyCookieValue("test-event", sig)).toBe(true);
  });

  it("rejects a tampered signature", () => {
    const sig = signCookieValue("test-event");
    const tampered = sig.replace(sig[0], sig[0] === "a" ? "b" : "a");
    expect(verifyCookieValue("test-event", tampered)).toBe(false);
  });

  it("rejects signature from different slug", () => {
    const sig = signCookieValue("event-a");
    expect(verifyCookieValue("event-b", sig)).toBe(false);
  });
});

describe("cookieName", () => {
  it("returns prefixed cookie name", () => {
    expect(cookieName("my-party")).toBe("event-access-my-party");
  });
});

describe("makeSetCookieHeader", () => {
  it("returns a valid Set-Cookie header", () => {
    const header = makeSetCookieHeader("test-event");
    expect(header).toContain("event-access-test-event=");
    expect(header).toContain("Path=/");
    expect(header).toContain("HttpOnly");
    expect(header).toContain("SameSite=Lax");
    expect(header).toContain("Max-Age=2592000");
  });
});

describe("hasValidAccess", () => {
  it("returns true for valid cookie", () => {
    const sig = signCookieValue("my-event");
    const cookies = { "event-access-my-event": sig };
    expect(hasValidAccess(cookies, "my-event")).toBe(true);
  });

  it("returns false for missing cookie", () => {
    expect(hasValidAccess({}, "my-event")).toBe(false);
  });

  it("returns false for invalid cookie value", () => {
    const cookies = { "event-access-my-event": "forged-value-not-valid-hex" };
    expect(hasValidAccess(cookies, "my-event")).toBe(false);
  });

  it("returns false for wrong slug cookie", () => {
    const sig = signCookieValue("other-event");
    const cookies = { "event-access-my-event": sig };
    expect(hasValidAccess(cookies, "my-event")).toBe(false);
  });
});
