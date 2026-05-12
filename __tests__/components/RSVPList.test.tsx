import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RSVPList from "../../components/events/RSVPList";
import type { PublicRSVP } from "../../lib/rsvp";

const attending = (overrides: Partial<PublicRSVP> = {}): PublicRSVP => ({
  name: "Alice",
  attending: true,
  guestCount: 1,
  ...overrides,
});

const notAttending = (overrides: Partial<PublicRSVP> = {}): PublicRSVP => ({
  name: "Bob",
  attending: false,
  guestCount: 0,
  ...overrides,
});

describe("RSVPList", () => {
  it("shows total guest count when everyone is attending", () => {
    render(<RSVPList rsvps={[attending({ guestCount: 2 }), attending({ name: "Carol", guestCount: 3 })]} />);
    expect(screen.getByText("5 guests attending")).toBeInTheDocument();
  });

  it("hides the 'Can't make it' section when all are attending", () => {
    render(<RSVPList rsvps={[attending()]} />);
    expect(screen.queryByText(/Can't make it/i)).not.toBeInTheDocument();
  });

  it("shows both attending and not-attending sections for mixed lists", () => {
    render(<RSVPList rsvps={[attending(), notAttending()]} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText(/Can't make it/i)).toBeInTheDocument();
  });

  it("shows empty message when no one is attending", () => {
    render(<RSVPList rsvps={[notAttending()]} />);
    expect(screen.getByText(/No one has RSVP/i)).toBeInTheDocument();
  });

  it("shows singular 'guest' and no badge for guestCount === 1", () => {
    render(<RSVPList rsvps={[attending({ guestCount: 1 })]} />);
    expect(screen.getByText("1 guest attending")).toBeInTheDocument();
    expect(screen.queryByText("1 guests")).not.toBeInTheDocument();
  });

  it("shows guest count badge when guestCount > 1", () => {
    render(<RSVPList rsvps={[attending({ guestCount: 3 })]} />);
    expect(screen.getByText("3 guests")).toBeInTheDocument();
  });

  it("renders note when present", () => {
    render(<RSVPList rsvps={[attending({ note: "Gluten free please" })]} />);
    expect(screen.getByText("Gluten free please")).toBeInTheDocument();
  });

  it("does not render note element when absent", () => {
    render(<RSVPList rsvps={[attending({ note: undefined })]} />);
    expect(screen.queryByText(/Gluten free/i)).not.toBeInTheDocument();
  });
});
