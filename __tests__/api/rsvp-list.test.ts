import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/events/rsvp-list";

const mockGetRSVP = jest.fn();
const mockGetRSVPs = jest.fn();
const mockToPublicRSVP = jest.fn((r: unknown) => r);

jest.mock("../../lib/rsvp", () => ({
  getRSVP: (...args: unknown[]) => mockGetRSVP(...args),
  getRSVPs: (...args: unknown[]) => mockGetRSVPs(...args),
  toPublicRSVP: (r: unknown) => mockToPublicRSVP(r),
}));

jest.mock("../../data/events", () => ({
  events: [{ slug: "test-event", passwordHash: "x", title: "Test", date: "2026-01-01", time: "noon", location: "here", description: "d", theme: "t", rsvpDeadline: "2026-01-01T00:00:00Z", startDateTime: "2026-01-01T12:00:00Z", endDateTime: "2026-01-01T14:00:00Z", timezone: "UTC" }],
}));

jest.mock("../../lib/event-cookie", () => ({
  isValidSlug: (s: string) => /^[a-z0-9-]+$/.test(s),
}));

function makeReq(overrides: Partial<NextApiRequest> = {}): NextApiRequest {
  return {
    method: "GET",
    query: { slug: "test-event" },
    cookies: { "rsvped-test-event": "valid-id" },
    ...overrides,
  } as unknown as NextApiRequest;
}

function makeRes() {
  const res: Partial<NextApiResponse> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
}

describe("GET /api/events/rsvp-list", () => {
  beforeEach(() => {
    mockGetRSVP.mockReset();
    mockGetRSVPs.mockReset();
    mockToPublicRSVP.mockImplementation((r: unknown) => r);
  });

  it("returns 405 for non-GET methods", async () => {
    const req = makeReq({ method: "POST" });
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("returns 400 when slug is missing", async () => {
    const req = makeReq({ query: {} });
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when slug is invalid", async () => {
    const req = makeReq({ query: { slug: "INVALID SLUG!" } });
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when slug not in events", async () => {
    const req = makeReq({ query: { slug: "unknown-event" } });
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 403 when no rsvped cookie is present", async () => {
    const req = makeReq({ cookies: {} });
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 403 when rsvped cookie does not match a real RSVP", async () => {
    mockGetRSVP.mockResolvedValue(null);
    const res = makeRes();
    await handler(makeReq(), res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 200 with public RSVP list for valid cookie", async () => {
    const fakeRsvp = { id: "valid-id", slug: "test-event", name: "Alice", attending: true, guestCount: 1, contact: "a@b.com", createdAt: "" };
    mockGetRSVP.mockResolvedValue(fakeRsvp);
    mockGetRSVPs.mockResolvedValue([fakeRsvp]);
    const res = makeRes();
    await handler(makeReq(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([fakeRsvp]);
  });
});
