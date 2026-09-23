import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../pages/index";

// 300 - 0.5 * 100 = 250ms per typed or deleted character.
const STEP = 250;
const PAUSE = 2000;

const typed = () =>
  document.querySelector(".typewrite .wrap")?.textContent ?? "";
// Each timer is scheduled by an effect after React commits, so advance in
// small slices with a commit (act) between them.
const advance = (ms: number) => {
  for (let left = ms; left > 0; left -= 50) {
    act(() => jest.advanceTimersByTime(Math.min(50, left)));
  }
};

describe("Home typewriter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0.5);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("waits before typing the first word, then types one letter per step", () => {
    render(<Home />);
    expect(typed()).toBe("");
    advance(PAUSE - 1);
    expect(typed()).toBe("");
    advance(1);
    expect(typed()).toBe("B");
    advance(STEP * 4);
    expect(typed()).toBe("Build");
  });

  it("pauses on a full word, deletes it, then types the next one", () => {
    render(<Home />);
    advance(PAUSE + STEP * 4); // "Build"
    advance(PAUSE - 1);
    expect(typed()).toBe("Build");
    advance(1);
    expect(typed()).toBe("Buil");
    advance(STEP * 4);
    expect(typed()).toBe("");
    advance(STEP);
    expect(typed()).toBe("B");
    advance(STEP * 4);
    expect(typed()).toBe("Break");
  });

  it("stops on the last phrase", () => {
    render(<Home />);
    advance(10 * 60 * 1000);
    expect(typed()).toBe("Join your team");
    expect(jest.getTimerCount()).toBe(0);
  });

  it("leaves no timers running after unmount", () => {
    const { unmount } = render(<Home />);
    advance(PAUSE + STEP * 2);
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });

  it("renders the heading", () => {
    render(<Home />);
    expect(screen.getByText(/Hi, I.m Erik Karwatowski/)).toBeInTheDocument();
  });
});
