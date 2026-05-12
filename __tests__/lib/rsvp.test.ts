import { toPublicRSVP, getRSVP } from "../../lib/rsvp";
import type { RSVP } from "../../lib/rsvp";

jest.mock("uuid", () => ({ v4: () => "test-uuid" }));

const mockGet = jest.fn();
jest.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: () => ({ get: mockGet }),
  },
}));

const baseRsvp: RSVP = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  slug: "my-event",
  name: "Alice",
  attending: true,
  guestCount: 2,
  contact: "alice@example.com",
  note: "Vegetarian",
  createdAt: "2026-05-12T10:00:00.000Z",
};

describe("toPublicRSVP", () => {
  it("returns only public fields", () => {
    const pub = toPublicRSVP(baseRsvp);
    expect(pub).toEqual({
      name: "Alice",
      attending: true,
      guestCount: 2,
      note: "Vegetarian",
    });
  });

  it("omits sensitive fields", () => {
    const pub = toPublicRSVP(baseRsvp) as Record<string, unknown>;
    expect(pub.id).toBeUndefined();
    expect(pub.contact).toBeUndefined();
    expect(pub.createdAt).toBeUndefined();
    expect(pub.slug).toBeUndefined();
  });

  it("works when note is undefined", () => {
    const noNote = { ...baseRsvp, note: undefined };
    const pub = toPublicRSVP(noNote);
    expect(pub.note).toBeUndefined();
    expect(pub.name).toBe("Alice");
  });
});

describe("getRSVP", () => {
  beforeEach(() => mockGet.mockReset());

  it("returns null for invalid UUID format (rejects crafted Redis keys)", async () => {
    const result = await getRSVP("my-event", "abc-123");
    expect(result).toBeNull();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("returns null when key is not in Redis", async () => {
    mockGet.mockResolvedValue(null);
    const result = await getRSVP("my-event", "a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    expect(result).toBeNull();
  });

  it("parses a JSON string from Redis", async () => {
    mockGet.mockResolvedValue(JSON.stringify(baseRsvp));
    const result = await getRSVP("my-event", "a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    expect(result).toEqual(baseRsvp);
  });

  it("returns a pre-parsed object from Redis without double-parsing", async () => {
    mockGet.mockResolvedValue(baseRsvp);
    const result = await getRSVP("my-event", "a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    expect(result).toEqual(baseRsvp);
  });
});
