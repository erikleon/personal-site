/** Player color — White moves from point 24→1 (bearing off from home 1–6),
 *  Black moves from point 1→24 (bearing off from home 19–24). */
export type Player = "white" | "black";

/** A single point on the board. `null` means empty, otherwise the count
 *  is positive for the owning player's checkers. */
export interface Point {
  player: Player | null;
  count: number;
}

/** Two dice values (1–6 each). */
export type DiceRoll = [number, number];

/** A single move: from → to. Bar is represented as "bar", bearing off as "off". */
export interface Move {
  from: number | "bar";
  to: number | "off";
  die: number;
  /** True if this move hits an opponent blot. */
  hit?: boolean;
}

/** A full turn is a sequence of 1–4 moves (doubles give 4). */
export type Turn = Move[];

export type GamePhase = "rolling" | "moving" | "finished";

export interface GameState {
  /** 24 points, indexed 0–23 (representing points 1–24). */
  points: Point[];
  /** Checkers on the bar per player. */
  bar: Record<Player, number>;
  /** Checkers borne off per player. */
  borneOff: Record<Player, number>;
  /** Current player. */
  currentPlayer: Player;
  /** Current dice roll, null if not yet rolled. */
  dice: DiceRoll | null;
  /** Which dice values have been used this turn. */
  usedDice: number[];
  /** Current phase. */
  phase: GamePhase;
  /** Winner, if any. */
  winner: Player | null;
}
