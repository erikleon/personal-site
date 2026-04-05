import type { GameState } from "../../lib/backgammon/types";
import { remainingDice } from "../../lib/backgammon/engine";
import styles from "../../styles/Backgammon.module.css";

interface GameControlsProps {
  state: GameState;
  isPlayerTurn: boolean;
  isAiThinking: boolean;
  twoPlayer: boolean;
  onRoll: () => void;
  onEndTurn: () => void;
  onNewGame: () => void;
  onToggleMode: () => void;
}

export default function GameControls({
  state,
  isPlayerTurn,
  isAiThinking,
  twoPlayer,
  onRoll,
  onEndTurn,
  onNewGame,
  onToggleMode,
}: GameControlsProps) {
  const canRoll = state.phase === "rolling" && isPlayerTurn && !isAiThinking;
  const remaining = remainingDice(state);
  const canEnd =
    state.phase === "moving" && remaining.length === 0 && isPlayerTurn;

  return (
    <div className={styles.controls}>
      <button
        className={`${styles.btn} ${styles.btnPrimary}`}
        disabled={!canRoll}
        onClick={onRoll}
      >
        Roll Dice
      </button>
      <button className={styles.btn} disabled={!canEnd} onClick={onEndTurn}>
        End Turn
      </button>
      <button className={styles.btn} onClick={onNewGame}>
        New Game
      </button>
      <label className={styles.modeToggle}>
        <span className={styles.modeLabel}>
          {twoPlayer ? "2 Players" : "vs AI"}
        </span>
        <input
          type="checkbox"
          checked={twoPlayer}
          onChange={onToggleMode}
          className={styles.modeCheckbox}
        />
        <span className={styles.modeSwitch} />
      </label>
    </div>
  );
}
