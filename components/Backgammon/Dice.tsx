import type { Player } from "../../lib/backgammon/types";
import styles from "../../styles/Backgammon.module.css";

// Pip positions on a die face (3x3 grid, 0-indexed)
const PIP_LAYOUTS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [
    [0, 2],
    [2, 0],
  ],
  3: [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
  ],
};

interface DiceProps {
  dice: [number, number] | null;
  usedDice: number[];
  player: Player;
}

export default function Dice({ dice, usedDice, player }: DiceProps) {
  if (!dice) return <div className={styles.diceArea} />;

  // Track which dice values have been used
  const used = [...usedDice];
  const dieStates = dice.map((value) => {
    const idx = used.indexOf(value);
    if (idx !== -1) {
      used.splice(idx, 1);
      return { value, isUsed: true };
    }
    return { value, isUsed: false };
  });

  // For doubles, show 4 dice
  if (dice[0] === dice[1]) {
    const totalUsed = usedDice.filter((d) => d === dice[0]).length;
    const allDice = Array.from({ length: 4 }, (_, i) => ({
      value: dice[0],
      isUsed: i < totalUsed,
    }));
    return (
      <div className={styles.diceArea}>
        {allDice.map((d, i) => (
          <DieFace key={i} value={d.value} used={d.isUsed} player={player} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.diceArea}>
      {dieStates.map((d, i) => (
        <DieFace key={i} value={d.value} used={d.isUsed} player={player} />
      ))}
    </div>
  );
}

function DieFace({
  value,
  used,
  player,
}: {
  value: number;
  used: boolean;
  player: Player;
}) {
  const pips = PIP_LAYOUTS[value] || [];
  const grid = Array.from({ length: 9 }, (_, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const hasPip = pips.some(([r, c]) => r === row && c === col);
    return hasPip;
  });

  const playerClass = player === "white" ? styles.dieWhite : styles.dieBlack;

  return (
    <div
      className={`${styles.die} ${playerClass} ${used ? styles.dieUsed : ""}`}
    >
      {grid.map((hasPip, i) => (
        <span
          key={i}
          className={`${styles.pip} ${!hasPip ? styles.pipHidden : ""}`}
        />
      ))}
    </div>
  );
}
