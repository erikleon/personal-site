import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dice from "../../components/Backgammon/Dice";

type Roll = [number, number] | null;

const renderDice = (dice: Roll, usedDice: number[] = []) =>
  render(<Dice dice={dice} usedDice={usedDice} player="white" />);

const dieElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(".die"));

const isRolling = (container: HTMLElement) =>
  dieElements(container).some((d) => d.classList.contains("dieRolling"));

const visiblePips = (die: HTMLElement) =>
  die.querySelectorAll(".pip:not(.pipHidden)").length;

describe("Dice", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("renders an empty area when there are no dice", () => {
    const { container } = renderDice(null);
    expect(dieElements(container)).toHaveLength(0);
  });

  it("shows dice present at mount without animating", () => {
    const { container } = renderDice([3, 5]);
    expect(isRolling(container)).toBe(false);
    expect(dieElements(container).map(visiblePips)).toEqual([3, 5]);
  });

  it("animates a new roll, then settles on the rolled values", () => {
    const { container, rerender } = renderDice(null);
    rerender(<Dice dice={[3, 5]} usedDice={[]} player="white" />);
    act(() => jest.advanceTimersByTime(100));
    expect(isRolling(container)).toBe(true);

    act(() => jest.advanceTimersByTime(600));
    expect(isRolling(container)).toBe(false);
    expect(dieElements(container).map(visiblePips)).toEqual([3, 5]);
  });

  it("does not get stuck rolling when the dice change mid-animation", () => {
    const { container, rerender } = renderDice(null);
    rerender(<Dice dice={[3, 5]} usedDice={[]} player="white" />);
    act(() => jest.advanceTimersByTime(300));
    rerender(<Dice dice={[2, 4]} usedDice={[]} player="white" />);
    act(() => jest.advanceTimersByTime(1000));

    expect(isRolling(container)).toBe(false);
    expect(dieElements(container).map(visiblePips)).toEqual([2, 4]);
  });

  it("marks used dice once settled", () => {
    const { container } = renderDice([3, 5], [5]);
    const used = dieElements(container).map((d) =>
      d.classList.contains("dieUsed"),
    );
    expect(used).toEqual([false, true]);
  });

  it("shows four dice for doubles", () => {
    const { container } = renderDice([4, 4], [4]);
    const dice = dieElements(container);
    expect(dice).toHaveLength(4);
    expect(dice.filter((d) => d.classList.contains("dieUsed"))).toHaveLength(1);
  });

  it("clears the dice when the roll is removed", () => {
    const { container, rerender } = renderDice([3, 5]);
    rerender(<Dice dice={null} usedDice={[]} player="white" />);
    expect(dieElements(container)).toHaveLength(0);
  });
});
