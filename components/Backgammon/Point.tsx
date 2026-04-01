import type { Point as PointType } from "../../lib/backgammon/types";
import styles from "../../styles/Backgammon.module.css";

interface PointProps {
  point: PointType;
  index: number;
  /** Top row points render upside-down (checkers stack from bottom) */
  reversed: boolean;
  selected: boolean;
  isLegalTarget: boolean;
  onClick: () => void;
  onCheckerClick: () => void;
  onDoubleClick: () => void;
}

export default function Point({
  point,
  index,
  reversed,
  selected,
  isLegalTarget,
  onClick,
  onCheckerClick,
  onDoubleClick,
}: PointProps) {
  const isDark = index % 2 === 0;
  const clickable = point.count > 0 || isLegalTarget;

  const classNames = [
    styles.point,
    reversed ? styles.pointReversed : "",
    selected ? styles.selected : "",
    isLegalTarget ? styles.legalTarget : "",
    clickable ? styles.clickable : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (isLegalTarget) {
      onClick();
    } else if (point.count > 0) {
      onCheckerClick();
    }
  };

  // Display point number (1-24)
  const displayNum = index + 1;

  // Stack checkers, show count badge if > 5
  const maxVisible = 5;
  const visibleCount = Math.min(point.count, maxVisible);

  return (
    <div className={classNames} onClick={handleClick} onDoubleClick={onDoubleClick}>
      <span className={styles.pointNumber}>{displayNum}</span>
      <div
        className={`${styles.triangle} ${isDark ? styles.triangleDark : styles.triangleLight}`}
      />
      <div className={styles.checkers}>
        {point.player &&
          Array.from({ length: visibleCount }, (_, i) => (
            <div
              key={i}
              className={`${styles.checker} ${
                point.player === "white"
                  ? styles.checkerWhite
                  : styles.checkerBlack
              } ${i === visibleCount - 1 && selected ? styles.checkerSelected : ""}`}
            >
              {i === visibleCount - 1 && point.count > maxVisible && (
                <span className={styles.checkerCount}>{point.count}</span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
