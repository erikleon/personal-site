import type {
  Player,
  Point,
  DiceRoll,
  Move,
  Turn,
  GameState,
} from "./types";

// ── Helpers ──────────────────────────────────────────────

export function opponent(p: Player): Player {
  return p === "white" ? "black" : "white";
}

/** Direction of movement: white moves high→low, black moves low→high. */
export function direction(p: Player): 1 | -1 {
  return p === "white" ? -1 : 1;
}

/** Home board indices (0-based) for a player. */
export function homeBoard(p: Player): number[] {
  return p === "white"
    ? [0, 1, 2, 3, 4, 5] // points 1–6
    : [18, 19, 20, 21, 22, 23]; // points 19–24
}

/** The bar entry point index when re-entering. White enters from 24-side,
 *  black enters from 1-side. Returns the target index for a given die. */
export function barEntryIndex(p: Player, die: number): number {
  return p === "white" ? 24 - die : die - 1;
}

// ── Initial Setup ────────────────────────────────────────

function emptyPoint(): Point {
  return { player: null, count: 0 };
}

export function createInitialState(): GameState {
  const points: Point[] = Array.from({ length: 24 }, emptyPoint);

  // Standard backgammon opening layout
  // White (moves 24→1): 2 on 24, 5 on 13, 3 on 8, 5 on 6
  points[23] = { player: "white", count: 2 }; // point 24
  points[12] = { player: "white", count: 5 }; // point 13
  points[7] = { player: "white", count: 3 }; // point 8
  points[5] = { player: "white", count: 5 }; // point 6

  // Black (moves 1→24): 2 on 1, 5 on 12, 3 on 17, 5 on 19
  points[0] = { player: "black", count: 2 }; // point 1
  points[11] = { player: "black", count: 5 }; // point 12
  points[16] = { player: "black", count: 3 }; // point 17
  points[18] = { player: "black", count: 5 }; // point 19

  return {
    points,
    bar: { white: 0, black: 0 },
    borneOff: { white: 0, black: 0 },
    currentPlayer: "white",
    dice: null,
    usedDice: [],
    phase: "rolling",
    winner: null,
  };
}

// ── Dice ─────────────────────────────────────────────────

export function rollDice(): DiceRoll {
  const a = Math.floor(Math.random() * 6) + 1;
  const b = Math.floor(Math.random() * 6) + 1;
  return [a, b];
}

/** The individual die values available for moves. Doubles give 4 uses. */
export function remainingDice(state: GameState): number[] {
  if (!state.dice) return [];
  const all =
    state.dice[0] === state.dice[1]
      ? [state.dice[0], state.dice[0], state.dice[0], state.dice[0]]
      : [state.dice[0], state.dice[1]];
  const used = [...state.usedDice];
  return all.filter((d) => {
    const idx = used.indexOf(d);
    if (idx !== -1) {
      used.splice(idx, 1);
      return false;
    }
    return true;
  });
}

// ── Bearing Off Check ────────────────────────────────────

export function canBearOff(state: GameState, player: Player): boolean {
  if (state.bar[player] > 0) return false;
  const home = homeBoard(player);
  for (let i = 0; i < 24; i++) {
    const pt = state.points[i];
    if (pt.player === player && !home.includes(i)) return false;
  }
  return true;
}

// ── Legal Moves ──────────────────────────────────────────

/** Get all legal individual moves for a single die value. */
function legalMovesForDie(
  state: GameState,
  player: Player,
  die: number
): Move[] {
  const moves: Move[] = [];
  const opp = opponent(player);

  // Must enter from bar first
  if (state.bar[player] > 0) {
    const target = barEntryIndex(player, die);
    const pt = state.points[target];
    if (pt.player !== opp || pt.count <= 1) {
      moves.push({
        from: "bar",
        to: target,
        die,
        hit: pt.player === opp && pt.count === 1,
      });
    }
    return moves; // Can only enter from bar when checkers are on bar
  }

  const bearingOff = canBearOff(state, player);
  const home = homeBoard(player);

  for (let i = 0; i < 24; i++) {
    const pt = state.points[i];
    if (pt.player !== player || pt.count === 0) continue;

    const targetIdx = i + die * direction(player);

    // Bearing off
    if (bearingOff && home.includes(i)) {
      if (player === "white" && targetIdx < 0) {
        // Exact bear-off or highest checker
        if (targetIdx === -1) {
          moves.push({ from: i, to: "off", die });
        } else {
          // Can bear off with a higher die only if no checker on a higher point
          const higherPoints = home.filter((h) => h > i);
          const hasHigher = higherPoints.some(
            (h) =>
              state.points[h].player === player && state.points[h].count > 0
          );
          if (!hasHigher) {
            moves.push({ from: i, to: "off", die });
          }
        }
        continue;
      }
      if (player === "black" && targetIdx > 23) {
        if (targetIdx === 24) {
          moves.push({ from: i, to: "off", die });
        } else {
          const higherPoints = home.filter((h) => h < i);
          const hasHigher = higherPoints.some(
            (h) =>
              state.points[h].player === player && state.points[h].count > 0
          );
          if (!hasHigher) {
            moves.push({ from: i, to: "off", die });
          }
        }
        continue;
      }
    }

    // Normal move
    if (targetIdx < 0 || targetIdx > 23) continue;
    const dest = state.points[targetIdx];
    if (dest.player === opp && dest.count > 1) continue; // blocked

    moves.push({
      from: i,
      to: targetIdx,
      die,
      hit: dest.player === opp && dest.count === 1,
    });
  }

  return moves;
}

/** Apply a move to a state, returning a new state. Does NOT validate legality. */
export function applyMove(state: GameState, move: Move): GameState {
  const s = cloneState(state);
  const player = s.currentPlayer;
  const opp = opponent(player);

  // Remove checker from source
  if (move.from === "bar") {
    s.bar[player]--;
  } else {
    s.points[move.from].count--;
    if (s.points[move.from].count === 0) {
      s.points[move.from].player = null;
    }
  }

  // Place checker at destination
  if (move.to === "off") {
    s.borneOff[player]++;
  } else {
    // Hit opponent blot
    if (move.hit) {
      s.points[move.to].count = 0;
      s.points[move.to].player = null;
      s.bar[opp]++;
    }
    s.points[move.to].count++;
    s.points[move.to].player = player;
  }

  // Mark die as used
  s.usedDice.push(move.die);

  return s;
}

// ── Get All Legal Turns ──────────────────────────────────

/** Get all unique legal moves for the current remaining dice. */
export function getLegalMoves(state: GameState): Move[] {
  if (state.phase === "finished") return [];
  const dice = remainingDice(state);
  const uniqueDice = Array.from(new Set(dice));
  const allMoves: Move[] = [];
  const seen = new Set<string>();

  for (const die of uniqueDice) {
    for (const m of legalMovesForDie(state, state.currentPlayer, die)) {
      const key = `${m.from}-${m.to}-${m.die}`;
      if (!seen.has(key)) {
        seen.add(key);
        allMoves.push(m);
      }
    }
  }

  return allMoves;
}

/** Find all legal complete turns (sequences of moves using maximum dice).
 *  Backgammon rules require using both dice if possible, or the larger
 *  die if only one can be used. */
export function getLegalTurns(state: GameState): Turn[] {
  const dice = remainingDice(state);
  if (dice.length === 0) return [[]];

  const turns: Turn[] = [];
  let maxLen = 0;

  function search(s: GameState, usedCount: number, currentTurn: Move[]) {
    const remaining = remainingDice(s);
    if (remaining.length === 0) {
      if (usedCount >= maxLen) {
        if (usedCount > maxLen) {
          maxLen = usedCount;
          turns.length = 0;
        }
        turns.push([...currentTurn]);
      }
      return;
    }

    const moves = getLegalMoves(s);
    if (moves.length === 0) {
      if (usedCount >= maxLen) {
        if (usedCount > maxLen) {
          maxLen = usedCount;
          turns.length = 0;
        }
        turns.push([...currentTurn]);
      }
      return;
    }

    for (const move of moves) {
      const next = applyMove(s, move);
      currentTurn.push(move);
      search(next, usedCount + 1, currentTurn);
      currentTurn.pop();
    }
  }

  search(state, 0, []);

  // Deduplicate turns that result in the same board state
  const unique: Turn[] = [];
  const seenStates = new Set<string>();
  for (const turn of turns) {
    let s = state;
    for (const m of turn) {
      s = applyMove(s, m);
    }
    const key = stateKey(s);
    if (!seenStates.has(key)) {
      seenStates.add(key);
      unique.push(turn);
    }
  }

  const result = unique.length > 0 ? unique : [[]];

  // Backgammon rule: if only one die can be used (not both), must use the larger.
  if (
    result.length > 0 &&
    result[0].length === 1 &&
    state.dice &&
    state.dice[0] !== state.dice[1]
  ) {
    const largerDie = Math.max(state.dice[0], state.dice[1]);
    const turnsWithLarger = result.filter((t) => t[0]?.die === largerDie);
    if (turnsWithLarger.length > 0) return turnsWithLarger;
  }

  return result;
}

// ── Win Check ────────────────────────────────────────────

export function checkWinner(state: GameState): Player | null {
  if (state.borneOff.white === 15) return "white";
  if (state.borneOff.black === 15) return "black";
  return null;
}

// ── State Transitions ────────────────────────────────────

export function startTurn(state: GameState): GameState {
  if (state.phase === "finished") return state;
  const s = cloneState(state);
  s.dice = rollDice();
  s.usedDice = [];
  s.phase = "moving";

  // If no legal moves, skip turn
  const moves = getLegalMoves(s);
  if (moves.length === 0) {
    s.currentPlayer = opponent(s.currentPlayer);
    s.dice = null;
    s.phase = "rolling";
  }

  return s;
}

export function endTurn(state: GameState): GameState {
  const s = cloneState(state);
  const winner = checkWinner(s);
  if (winner) {
    s.winner = winner;
    s.phase = "finished";
    return s;
  }
  s.currentPlayer = opponent(s.currentPlayer);
  s.dice = null;
  s.usedDice = [];
  s.phase = "rolling";
  return s;
}

// ── Utility ──────────────────────────────────────────────

export function cloneState(state: GameState): GameState {
  return {
    points: state.points.map((p) => ({ ...p })),
    bar: { ...state.bar },
    borneOff: { ...state.borneOff },
    currentPlayer: state.currentPlayer,
    dice: state.dice ? [...state.dice] : null,
    usedDice: [...state.usedDice],
    phase: state.phase,
    winner: state.winner,
  };
}

function stateKey(s: GameState): string {
  const pts = s.points
    .map((p) => `${p.player?.[0] || "e"}${p.count}`)
    .join(",");
  return `${pts}|${s.bar.white},${s.bar.black}|${s.borneOff.white},${s.borneOff.black}`;
}

/** Get pip count for a player (total distance to bear off). */
export function pipCount(state: GameState, player: Player): number {
  let total = 0;

  for (let i = 0; i < 24; i++) {
    const pt = state.points[i];
    if (pt.player === player) {
      const distance = player === "white" ? i + 1 : 24 - i;
      total += distance * pt.count;
    }
  }

  // Bar checkers must travel full board + re-enter
  total += state.bar[player] * 25;

  return total;
}
