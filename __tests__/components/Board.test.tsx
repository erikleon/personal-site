import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../../components/Backgammon/Board";

const rollButton = () => screen.getByRole("button", { name: "Roll Dice" });

describe("Board", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("starts on white's roll", () => {
    render(<Board />);
    expect(rollButton()).toBeEnabled();
  });

  it("rolling moves white into the moving phase and shows two dice", () => {
    const { container } = render(<Board />);
    fireEvent.click(rollButton());
    act(() => jest.advanceTimersByTime(1000));

    expect(rollButton()).toBeDisabled();
    // Doubles render four dice, anything else two.
    expect([2, 4]).toContain(container.querySelectorAll(".die").length);
    fireEvent.click(screen.getByRole("button", { name: "New Game" }));
    expect(rollButton()).toBeEnabled();
    expect(container.querySelectorAll(".die")).toHaveLength(0);
  });
});
