import type { GameState, Turn, Player } from "./types";
import {
  getLegalTurns,
  applyMove,
  canBearOff,
  opponent,
  homeBoard,
  pipCount,
} from "./engine";

// ── Heuristic Weights ────────────────────────────────────

const WEIGHTS = {
  hitBlot: 3.0,
  makePoint: 2.5,
  blockOpponent: 2.0,
  advanceToHome: 1.0,
  bearOff: 4.0,
  exposedBlot: -2.5,
  pipAdvantage: 0.05,
  anchorInOpponentHome: 1.5,
  primeLength: 3.0,
};

// ── Evaluation ───────────────────────────────────────────

function countBlots(state: GameState, player: Player): number {
  let count = 0;
  for (const pt of state.points) {
    if (pt.player === player && pt.count === 1) count++;
  }
  return count;
}

function countMadePoints(state: GameState, player: Player): number {
  let count = 0;
  for (const pt of state.points) {
    if (pt.player === player && pt.count >= 2) count++;
  }
  return count;
}

/** Longest consecutive run of made points (prime). */
function longestPrime(state: GameState, player: Player): number {
  let best = 0;
  let run = 0;
  for (let i = 0; i < 24; i++) {
    if (state.points[i].player === player && state.points[i].count >= 2) {
      run++;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }
  return best;
}

/** Count checkers in opponent's home board (anchors). */
function anchorsInOpponentHome(state: GameState, player: Player): number {
  const oppHome = homeBoard(opponent(player));
  let count = 0;
  for (const idx of oppHome) {
    if (state.points[idx].player === player && state.points[idx].count >= 2) {
      count++;
    }
  }
  return count;
}

function evaluate(state: GameState, player: Player): number {
  const opp = opponent(player);
  let score = 0;

  // Bearing off
  score += state.borneOff[player] * WEIGHTS.bearOff;

  // Made points and primes
  score += countMadePoints(state, player) * WEIGHTS.makePoint;
  score += longestPrime(state, player) * WEIGHTS.primeLength;

  // Blots (penalize exposed checkers)
  score += countBlots(state, player) * WEIGHTS.exposedBlot;

  // Opponent on bar
  score += state.bar[opp] * WEIGHTS.hitBlot;

  // Our bar (very bad)
  score -= state.bar[player] * WEIGHTS.hitBlot * 2;

  // Pip count advantage
  const myPips = pipCount(state, player);
  const oppPips = pipCount(state, opp);
  score += (oppPips - myPips) * WEIGHTS.pipAdvantage;

  // Anchors in opponent's home
  if (!canBearOff(state, player)) {
    score += anchorsInOpponentHome(state, player) * WEIGHTS.anchorInOpponentHome;
  }

  // Home board checkers (closer to bearing off)
  const home = homeBoard(player);
  for (const idx of home) {
    if (state.points[idx].player === player) {
      score += state.points[idx].count * WEIGHTS.advanceToHome;
    }
  }

  // Block opponent's re-entry from bar
  if (state.bar[opp] > 0) {
    const oppEntryPoints =
      opp === "white"
        ? [23, 22, 21, 20, 19, 18]
        : [0, 1, 2, 3, 4, 5];
    let blocked = 0;
    for (const idx of oppEntryPoints) {
      if (state.points[idx].player === player && state.points[idx].count >= 2) {
        blocked++;
      }
    }
    score += blocked * WEIGHTS.blockOpponent;
  }

  return score;
}

// ── AI Move Selection ────────────────────────────────────

/** Pick the best turn for the current player using heuristic evaluation. */
export function pickBestTurn(state: GameState): Turn {
  const turns = getLegalTurns(state);
  if (turns.length === 0 || (turns.length === 1 && turns[0].length === 0)) {
    return [];
  }

  const player = state.currentPlayer;
  let bestScore = -Infinity;
  let bestTurn = turns[0];

  for (const turn of turns) {
    let s = state;
    for (const move of turn) {
      s = applyMove(s, move);
    }
    const score = evaluate(s, player);
    if (score > bestScore) {
      bestScore = score;
      bestTurn = turn;
    }
  }

  return bestTurn;
}
