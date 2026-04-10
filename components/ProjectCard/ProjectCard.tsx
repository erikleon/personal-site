import { useState } from "react";
import type { ProjectEntry } from "../../data/projects";
import styles from "../../styles/Projects.module.css";

interface ProjectCardProps {
  project: ProjectEntry;
  theme: "light" | "dark";
}

export default function ProjectCard({ project, theme }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`${styles.card} ${theme === "dark" ? styles.cardDark : styles.cardLight}`}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardName}>{project.name}</h3>
        <span className={styles.cardMeta}>
          {project.company} &middot; {project.type}
        </span>
      </div>
      <p className={styles.cardDescription}>{project.description}</p>
      <div className={styles.chips}>
        {project.stack.map((tech) => (
          <span key={tech} className={styles.chip}>
            {tech}
          </span>
        ))}
      </div>
      {(project.demoUrl || project.repoUrl) && (
        <div className={styles.links}>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={(e) => e.stopPropagation()}
            >
              Demo ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={(e) => e.stopPropagation()}
            >
              Repo ↗
            </a>
          )}
        </div>
      )}
      {project.highlights.length > 0 && (
        <>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={`highlights-${project.name}`}
            className={styles.expandButton}
          >
            {expanded ? "Hide highlights" : "Show highlights"}
          </button>
          {expanded && (
            <ul id={`highlights-${project.name}`} className={styles.highlights}>
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
