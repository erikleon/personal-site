import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { projects } from "../data/projects";
import type { ProjectEntry } from "../data/projects";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import styles from "../styles/Projects.module.css";

type CompanyFilter = "All" | "Copy.ai" | "Jopwell";
type TypeFilter = "All" | "Feature" | "Architecture" | "DX";

const companyOptions: CompanyFilter[] = ["All", "Copy.ai", "Jopwell"];
const typeOptions: TypeFilter[] = ["All", "Feature", "Architecture", "DX"];

const Projects: NextPage = () => {
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");

  const filtered = projects.filter((p: ProjectEntry) => {
    if (companyFilter !== "All" && p.company !== companyFilter) return false;
    if (typeFilter !== "All" && p.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Projects: Erik Karwatowski&rsquo;s Personal Website</title>
        <meta
          name="description"
          content="Projects and highlights from my engineering career"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>Projects</h2>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Company:</span>
          {companyOptions.map((opt) => (
            <button
              key={opt}
              className={`${styles.filterButton} ${companyFilter === opt ? styles.filterButtonActive : ""}`}
              onClick={() => setCompanyFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Type:</span>
          {typeOptions.map((opt) => (
            <button
              key={opt}
              className={`${styles.filterButton} ${typeFilter === opt ? styles.filterButtonActive : ""}`}
              onClick={() => setTypeFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
