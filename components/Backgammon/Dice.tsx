import { useState, useEffect, useRef } from "react";
import type { Player } from "../../lib/backgammon/types";
import styles from "../../styles/Backgammon.module.css";

const ROLL_DURATION = 600; // ms
const CYCLE_INTERVAL = 75; // ms

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
  // Use a stable string key to avoid firing on cloned-array re-renders
  const diceKey = dice ? `${dice[0]}-${dice[1]}` : null;

  const [displayDice, setDisplayDice] = useState<[number, number] | null>(dice);
  const [isRolling, setIsRolling] = useState(false);
  const prevKeyRef = useRef<string | null>(diceKey);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    prevKeyRef.current = diceKey;

    if (diceKey === null) {
      setDisplayDice(null);
      setIsRolling(false);
      return;
    }

    // Dice was already showing (e.g. usedDice changed, not a new roll)
    if (prevKey !== null) {
      setDisplayDice(dice);
      return;
    }

    // Dice just appeared: animate
    const finalDice = dice; // capture at effect time; dice prop may change
    setIsRolling(true);
    const interval = setInterval(() => {
      setDisplayDice([
        (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6,
        (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6,
      ]);
    }, CYCLE_INTERVAL);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayDice(finalDice);
      setIsRolling(false);
    }, ROLL_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [diceKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!displayDice) return <div className={styles.diceArea} />;

  // While rolling, show 2 cycling dice (doubles resolved after settle)
  if (isRolling) {
    return (
      <div className={styles.diceArea}>
        {displayDice.map((v, i) => (
          <DieFace
            key={i}
            value={v}
            used={false}
            player={player}
            rolling
            rollDelay={i * 60}
          />
        ))}
      </div>
    );
  }

  // Settled: show real dice with used state (use displayDice — dice prop may be null already)
  const used = [...usedDice];
  const dieStates = displayDice.map((value) => {
    const idx = used.indexOf(value);
    if (idx !== -1) {
      used.splice(idx, 1);
      return { value, isUsed: true };
    }
    return { value, isUsed: false };
  });

  // For doubles, show 4 dice
  if (displayDice[0] === displayDice[1]) {
    const totalUsed = usedDice.filter((d) => d === displayDice[0]).length;
    const allDice = Array.from({ length: 4 }, (_, i) => ({
      value: displayDice[0],
      isUsed: i < totalUsed,
    }));
    return (
      <div className={styles.diceArea}>
        {allDice.map((d, i) => (
          <DieFace
            key={i}
            value={d.value}
            used={d.isUsed}
            player={player}
            rolling={false}
            rollDelay={0}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.diceArea}>
      {dieStates.map((d, i) => (
        <DieFace
          key={i}
          value={d.value}
          used={d.isUsed}
          player={player}
          rolling={false}
          rollDelay={0}
        />
      ))}
    </div>
  );
}

function DieFace({
  value,
  used,
  player,
  rolling,
  rollDelay,
}: {
  value: number;
  used: boolean;
  player: Player;
  rolling: boolean;
  rollDelay: number;
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
      className={`${styles.die} ${playerClass} ${used ? styles.dieUsed : ""} ${rolling ? styles.dieRolling : ""}`}
      style={
        rolling && rollDelay > 0
          ? { animationDelay: `${rollDelay}ms` }
          : undefined
      }
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
