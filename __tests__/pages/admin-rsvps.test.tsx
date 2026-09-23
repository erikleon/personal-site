import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("../../lib/auth", () => ({ requireAuth: jest.fn() }));
jest.mock("../../data/events", () => ({
  events: [
    { slug: "first", title: "First Event" },
    { slug: "second", title: "Second Event" },
  ],
}));

import AdminRSVPs from "../../pages/admin/rsvps";

const rsvp = (name: string) => ({
  id: name,
  slug: "x",
  name,
  attending: true,
  guestCount: 1,
  contact: `${name}@example.com`,
  createdAt: "2026-09-01T00:00:00.000Z",
});

type Pending = { slug: string; resolve: (body: unknown) => void };
let pending: Pending[] = [];

beforeEach(() => {
  pending = [];
  global.fetch = jest.fn((url: string) => {
    const slug = new URL(url, "http://x").searchParams.get("slug")!;
    return new Promise((resolveResponse) => {
      pending.push({
        slug,
        resolve: (body) => resolveResponse({ json: async () => body } as Response),
      });
    });
  }) as unknown as typeof fetch;
});

const respond = async (slug: string, body: unknown) => {
  const req = pending.find((p) => p.slug === slug)!;
  await act(async () => req.resolve(body));
};

describe("AdminRSVPs", () => {
  it("shows loading, then the RSVPs for the selected event", async () => {
    render(<AdminRSVPs />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await respond("first", [rsvp("Alice")]);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows loading again when switching events", async () => {
    render(<AdminRSVPs />);
    await respond("first", [rsvp("Alice")]);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "second" },
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await respond("second", []);
    expect(screen.getByText("No RSVPs yet.")).toBeInTheDocument();
  });

  it("ignores a slow response for an event that is no longer selected", async () => {
    render(<AdminRSVPs />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "second" },
    });

    await respond("second", [rsvp("Bob")]);
    await respond("first", [rsvp("Alice")]);

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("stops loading when the request fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("network")),
    ) as unknown as typeof fetch;
    render(<AdminRSVPs />);
    await act(async () => {});
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
