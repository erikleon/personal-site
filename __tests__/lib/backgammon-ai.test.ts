import { pickBestTurn } from "../../lib/backgammon/ai";
import {
  createInitialState,
  applyMove,
  cloneState,
} from "../../lib/backgammon/engine";

describe("backgammon AI", () => {
  it("returns a non-empty turn from the opening position", () => {
    const state = createInitialState();
    state.dice = [3, 1];
    state.usedDice = [];
    state.phase = "moving";
    state.currentPlayer = "black";

    const turn = pickBestTurn(state);
    expect(turn.length).toBeGreaterThan(0);
  });

  it("returns empty turn when no moves available", () => {
    const state = createInitialState();
    state.currentPlayer = "white";
    state.bar.white = 1;
    state.points[23].count = 1;
    state.dice = [1, 2];
    state.usedDice = [];
    state.phase = "moving";

    // Block entry points
    state.points[23] = { player: "black", count: 2 };
    state.points[22] = { player: "black", count: 2 };

    const turn = pickBestTurn(state);
    expect(turn).toEqual([]);
  });

  it("prefers hitting a blot over a non-hitting move", () => {
    const state = createInitialState();
    // Clear the board for a controlled scenario
    for (let i = 0; i < 24; i++) {
      state.points[i] = { player: null, count: 0 };
    }

    state.currentPlayer = "black";
    state.dice = [3, 3];
    state.usedDice = [];
    state.phase = "moving";

    // Black checker on point 1 (idx 0)
    state.points[0] = { player: "black", count: 2 };
    // White blot on point 4 (idx 3) — hittable with die=3
    state.points[3] = { player: "white", count: 1 };

    const turn = pickBestTurn(state);
    const hitMove = turn.find((m) => m.hit);
    expect(hitMove).toBeDefined();
  });

  it("bears off when possible", () => {
    const state = createInitialState();
    for (let i = 0; i < 24; i++) {
      state.points[i] = { player: null, count: 0 };
    }

    state.currentPlayer = "white";
    state.dice = [6, 5];
    state.usedDice = [];
    state.phase = "moving";
    state.borneOff.white = 13;

    // Two white checkers in home
    state.points[5] = { player: "white", count: 1 }; // point 6
    state.points[4] = { player: "white", count: 1 }; // point 5

    const turn = pickBestTurn(state);
    const bearOffs = turn.filter((m) => m.to === "off");
    expect(bearOffs.length).toBe(2);
  });

  it("uses all available dice moves", () => {
    const state = createInitialState();
    state.currentPlayer = "black";
    state.dice = [5, 3];
    state.usedDice = [];
    state.phase = "moving";

    const turn = pickBestTurn(state);
    // Should use both dice from opening
    expect(turn.length).toBe(2);
  });

  it("produces valid resulting state after applying turn", () => {
    const state = createInitialState();
    state.currentPlayer = "white";
    state.dice = [6, 4];
    state.usedDice = [];
    state.phase = "moving";

    const turn = pickBestTurn(state);
    let s = cloneState(state);
    for (const move of turn) {
      s = applyMove(s, move);
    }

    // Total checkers should still be 15 per player
    let white = s.borneOff.white + s.bar.white;
    let black = s.borneOff.black + s.bar.black;
    for (const pt of s.points) {
      if (pt.player === "white") white += pt.count;
      if (pt.player === "black") black += pt.count;
    }
    expect(white).toBe(15);
    expect(black).toBe(15);
  });
});
