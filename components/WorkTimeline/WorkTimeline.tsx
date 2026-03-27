import { useState } from "react";
import type { WorkEntry } from "../../data/work";
import styles from "../../styles/Work.module.css";

const WorkTimeline = ({ entries }: { entries: WorkEntry[] }) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggle = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className={styles.timeline}>
      {entries.map((entry, i) => (
        <div key={entry.company} className={styles.entry}>
          <div
            className={styles.entryHeader}
            onClick={() => toggle(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(i);
              }
            }}
            aria-expanded={!!expanded[i]}
          >
            <h3 className={styles.company}>{entry.company}</h3>
            <span className={styles.role}>{entry.title}</span>
            <span className={styles.period}>{entry.period}</span>
            <span className={styles.toggle}>
              {expanded[i] ? "▾" : "▸"}
            </span>
          </div>

          <ul className={styles.stackList}>
            {entry.stack.map((tech) => (
              <li key={tech} className={styles.stackChip}>
                {tech}
              </li>
            ))}
          </ul>

          {expanded[i] && (
            <ul className={styles.highlights}>
              {entry.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkTimeline;
