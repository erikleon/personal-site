import {
  createInitialState,
  rollDice,
  remainingDice,
  getLegalMoves,
  applyMove,
  checkWinner,
  canBearOff,
  opponent,
  direction,
  homeBoard,
  barEntryIndex,
  cloneState,
  pipCount,
  startTurn,
  endTurn,
} from "../../lib/backgammon/engine";
import type { GameState, Move } from "../../lib/backgammon/types";

describe("backgammon engine", () => {
  describe("createInitialState", () => {
    it("sets up 15 checkers per player", () => {
      const state = createInitialState();
      let white = 0;
      let black = 0;
      for (const pt of state.points) {
        if (pt.player === "white") white += pt.count;
        if (pt.player === "black") black += pt.count;
      }
      expect(white).toBe(15);
      expect(black).toBe(15);
    });

    it("starts with empty bar and borne off", () => {
      const state = createInitialState();
      expect(state.bar).toEqual({ white: 0, black: 0 });
      expect(state.borneOff).toEqual({ white: 0, black: 0 });
    });

    it("starts in rolling phase with white to play", () => {
      const state = createInitialState();
      expect(state.phase).toBe("rolling");
      expect(state.currentPlayer).toBe("white");
      expect(state.dice).toBeNull();
    });

    it("places checkers in standard positions", () => {
      const state = createInitialState();
      // White: 2 on point 24 (idx 23), 5 on 13 (idx 12), 3 on 8 (idx 7), 5 on 6 (idx 5)
      expect(state.points[23]).toEqual({ player: "white", count: 2 });
      expect(state.points[12]).toEqual({ player: "white", count: 5 });
      expect(state.points[7]).toEqual({ player: "white", count: 3 });
      expect(state.points[5]).toEqual({ player: "white", count: 5 });

      // Black: 2 on point 1 (idx 0), 5 on 12 (idx 11), 3 on 17 (idx 16), 5 on 19 (idx 18)
      expect(state.points[0]).toEqual({ player: "black", count: 2 });
      expect(state.points[11]).toEqual({ player: "black", count: 5 });
      expect(state.points[16]).toEqual({ player: "black", count: 3 });
      expect(state.points[18]).toEqual({ player: "black", count: 5 });
    });
  });

  describe("helpers", () => {
    it("opponent returns the other player", () => {
      expect(opponent("white")).toBe("black");
      expect(opponent("black")).toBe("white");
    });

    it("direction: white moves negative, black moves positive", () => {
      expect(direction("white")).toBe(-1);
      expect(direction("black")).toBe(1);
    });

    it("homeBoard returns correct indices", () => {
      expect(homeBoard("white")).toEqual([0, 1, 2, 3, 4, 5]);
      expect(homeBoard("black")).toEqual([18, 19, 20, 21, 22, 23]);
    });

    it("barEntryIndex returns correct entry point", () => {
      // White enters from 24-side: die 1 → idx 23, die 6 → idx 18
      expect(barEntryIndex("white", 1)).toBe(23);
      expect(barEntryIndex("white", 6)).toBe(18);
      // Black enters from 1-side: die 1 → idx 0, die 6 → idx 5
      expect(barEntryIndex("black", 1)).toBe(0);
      expect(barEntryIndex("black", 6)).toBe(5);
    });
  });

  describe("rollDice", () => {
    it("returns two values between 1 and 6", () => {
      for (let i = 0; i < 100; i++) {
        const [a, b] = rollDice();
        expect(a).toBeGreaterThanOrEqual(1);
        expect(a).toBeLessThanOrEqual(6);
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(6);
      }
    });
  });

  describe("remainingDice", () => {
    it("returns both dice when none used", () => {
      const state = createInitialState();
      state.dice = [3, 5];
      state.usedDice = [];
      expect(remainingDice(state)).toEqual([3, 5]);
    });

    it("returns one die when one used", () => {
      const state = createInitialState();
      state.dice = [3, 5];
      state.usedDice = [3];
      expect(remainingDice(state)).toEqual([5]);
    });

    it("returns four dice for doubles", () => {
      const state = createInitialState();
      state.dice = [4, 4];
      state.usedDice = [];
      expect(remainingDice(state)).toEqual([4, 4, 4, 4]);
    });

    it("returns two after using two of a double", () => {
      const state = createInitialState();
      state.dice = [4, 4];
      state.usedDice = [4, 4];
      expect(remainingDice(state)).toEqual([4, 4]);
    });

    it("returns empty when no dice rolled", () => {
      const state = createInitialState();
      expect(remainingDice(state)).toEqual([]);
    });
  });

  describe("getLegalMoves", () => {
    it("generates moves from the opening position", () => {
      const state = createInitialState();
      state.dice = [3, 1];
      state.usedDice = [];
      state.phase = "moving";
      const moves = getLegalMoves(state);
      expect(moves.length).toBeGreaterThan(0);
      // All moves should be for white (current player)
      for (const m of moves) {
        if (m.from !== "bar") {
          expect(state.points[m.from].player).toBe("white");
        }
      }
    });

    it("forces bar entry when checker is on bar", () => {
      const state = createInitialState();
      state.currentPlayer = "white";
      state.bar.white = 1;
      // Remove one white checker from point 24 to keep count correct
      state.points[23].count = 1;
      state.dice = [3, 5];
      state.usedDice = [];
      state.phase = "moving";

      const moves = getLegalMoves(state);
      // All moves should be from bar
      for (const m of moves) {
        expect(m.from).toBe("bar");
      }
    });

    it("returns empty when all entry points blocked", () => {
      const state = createInitialState();
      state.currentPlayer = "white";
      state.bar.white = 1;
      state.points[23].count = 1;
      state.dice = [1, 2];
      state.usedDice = [];
      state.phase = "moving";

      // Block points 23 (die=1) and 22 (die=2) with black
      state.points[23] = { player: "black", count: 2 };
      state.points[22] = { player: "black", count: 2 };

      const moves = getLegalMoves(state);
      expect(moves).toEqual([]);
    });
  });

  describe("applyMove", () => {
    it("moves a checker between points", () => {
      const state = createInitialState();
      state.currentPlayer = "white";
      state.dice = [1, 2];
      state.usedDice = [];

      // Move white from point 24 (idx 23) by 1 to point 23 (idx 22)
      const move: Move = { from: 23, to: 22, die: 1 };
      const next = applyMove(state, move);
      expect(next.points[23].count).toBe(1);
      expect(next.points[22].player).toBe("white");
      expect(next.points[22].count).toBe(1);
      expect(next.usedDice).toEqual([1]);
    });

    it("hits a blot and sends it to bar", () => {
      const state = createInitialState();
      state.currentPlayer = "white";
      // Place a black blot on point 22 (idx 21)
      state.points[21] = { player: "black", count: 1 };

      const move: Move = { from: 23, to: 21, die: 2, hit: true };
      const next = applyMove(state, move);
      expect(next.points[21].player).toBe("white");
      expect(next.points[21].count).toBe(1);
      expect(next.bar.black).toBe(1);
    });

    it("enters from bar", () => {
      const state = createInitialState();
      state.currentPlayer = "white";
      state.bar.white = 1;
      state.points[23].count = 1;

      const move: Move = { from: "bar", to: 21, die: 3 };
      const next = applyMove(state, move);
      expect(next.bar.white).toBe(0);
      expect(next.points[21].player).toBe("white");
    });

    it("bears off a checker", () => {
      const state = createInitialState();
      state.currentPlayer = "white";

      const move: Move = { from: 2, to: "off", die: 3 };
      const next = applyMove(state, move);
      expect(next.borneOff.white).toBe(1);
    });
  });

  describe("canBearOff", () => {
    it("returns false in opening position", () => {
      const state = createInitialState();
      expect(canBearOff(state, "white")).toBe(false);
      expect(canBearOff(state, "black")).toBe(false);
    });

    it("returns true when all checkers in home board", () => {
      const state = createInitialState();
      // Clear all points
      for (let i = 0; i < 24; i++) {
        state.points[i] = { player: null, count: 0 };
      }
      // White all in home (points 1-6, idx 0-5)
      state.points[0] = { player: "white", count: 5 };
      state.points[3] = { player: "white", count: 5 };
      state.points[5] = { player: "white", count: 5 };
      expect(canBearOff(state, "white")).toBe(true);
    });

    it("returns false when checker is on bar", () => {
      const state = createInitialState();
      // Clear and set up home
      for (let i = 0; i < 24; i++) {
        state.points[i] = { player: null, count: 0 };
      }
      state.points[0] = { player: "white", count: 14 };
      state.bar.white = 1;
      expect(canBearOff(state, "white")).toBe(false);
    });
  });

  describe("checkWinner", () => {
    it("returns null when game in progress", () => {
      const state = createInitialState();
      expect(checkWinner(state)).toBeNull();
    });

    it("returns white when all 15 borne off", () => {
      const state = createInitialState();
      state.borneOff.white = 15;
      expect(checkWinner(state)).toBe("white");
    });

    it("returns black when all 15 borne off", () => {
      const state = createInitialState();
      state.borneOff.black = 15;
      expect(checkWinner(state)).toBe("black");
    });
  });

  describe("cloneState", () => {
    it("produces a deep copy", () => {
      const state = createInitialState();
      const clone = cloneState(state);
      clone.points[0].count = 99;
      clone.bar.white = 5;
      expect(state.points[0].count).toBe(2);
      expect(state.bar.white).toBe(0);
    });
  });

  describe("pipCount", () => {
    it("calculates pip count for opening position", () => {
      const state = createInitialState();
      // White: 2×24 + 5×13 + 3×8 + 5×6 = 48+65+24+30 = 167
      expect(pipCount(state, "white")).toBe(167);
      // Black: 2×24 + 5×13 + 3×8 + 5×6 = 167 (symmetric)
      expect(pipCount(state, "black")).toBe(167);
    });
  });

  describe("startTurn", () => {
    it("rolls dice and enters moving phase", () => {
      const state = createInitialState();
      const next = startTurn(state);
      expect(next.dice).not.toBeNull();
      expect(next.dice!.length).toBe(2);
      expect(next.usedDice).toEqual([]);
      // Should be in moving phase (unless no legal moves, which is very unlikely from opening)
    });
  });

  describe("endTurn", () => {
    it("switches player and resets dice", () => {
      const state = createInitialState();
      state.currentPlayer = "white";
      state.dice = [3, 4];
      const next = endTurn(state);
      expect(next.currentPlayer).toBe("black");
      expect(next.dice).toBeNull();
      expect(next.phase).toBe("rolling");
    });

    it("detects winner", () => {
      const state = createInitialState();
      state.borneOff.white = 15;
      const next = endTurn(state);
      expect(next.winner).toBe("white");
      expect(next.phase).toBe("finished");
    });
  });
});
