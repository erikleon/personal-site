import { useState } from "react";
import type { ProjectEntry } from "../../data/projects";
import styles from "../../styles/Projects.module.css";

interface ProjectCardProps {
  project: ProjectEntry;
  theme: "light" | "dark";
}

function toDomId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProjectCard({ project, theme }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const highlightsId = `highlights-${toDomId(project.name)}`;
  const links = [
    { label: "Demo", url: project.demoUrl },
    { label: "Repo", url: project.repoUrl },
    { label: "Package", url: project.packageUrl },
  ].filter((link): link is { label: string; url: string } => !!link.url);

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
      {links.length > 0 && (
        <div className={styles.links}>
          {links.map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={(e) => e.stopPropagation()}
            >
              {label} ↗
            </a>
          ))}
        </div>
      )}
      {project.highlights.length > 0 && (
        <>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={highlightsId}
            className={styles.expandButton}
          >
            {expanded ? "Hide highlights" : "Show highlights"}
          </button>
          {expanded && (
            <ul id={highlightsId} className={styles.highlights}>
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
