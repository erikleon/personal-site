import type { GameState } from "../../lib/backgammon/types";
import { remainingDice } from "../../lib/backgammon/engine";
import styles from "../../styles/Backgammon.module.css";

interface GameControlsProps {
  state: GameState;
  isPlayerTurn: boolean;
  isAiThinking: boolean;
  onRoll: () => void;
  onEndTurn: () => void;
  onNewGame: () => void;
}

export default function GameControls({
  state,
  isPlayerTurn,
  isAiThinking,
  onRoll,
  onEndTurn,
  onNewGame,
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
    </div>
  );
}
