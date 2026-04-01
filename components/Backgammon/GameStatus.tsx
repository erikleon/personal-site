import type { GameState } from "../../lib/backgammon/types";
import { pipCount } from "../../lib/backgammon/engine";
import styles from "../../styles/Backgammon.module.css";

interface GameStatusProps {
  state: GameState;
  isAiThinking: boolean;
}

export default function GameStatus({ state, isAiThinking }: GameStatusProps) {
  if (state.winner) {
    const label = state.winner === "white" ? "White" : "Black";
    return <div className={styles.winner}>{label} wins!</div>;
  }

  const currentLabel = state.currentPlayer === "white" ? "White" : "Black";

  return (
    <div>
      <div className={styles.status}>
        {isAiThinking ? (
          <span>
            <span className={styles.statusHighlight}>{currentLabel}</span> is
            thinking...
          </span>
        ) : (
          <span>
            <span className={styles.statusHighlight}>{currentLabel}</span>
            {state.phase === "rolling" ? " to roll" : " to move"}
          </span>
        )}
      </div>
      <div className={styles.pipCounts}>
        <span>White pip: {pipCount(state, "white")}</span>
        <span>Black pip: {pipCount(state, "black")}</span>
      </div>
    </div>
  );
}
