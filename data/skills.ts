export interface SkillCategory {
  label: string;
  skills: string[];
}

export const skills: SkillCategory[] = [
  {
    label: "Languages",
    skills: ["TypeScript", "JavaScript", "C#"],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "Angular", "Redux", "PrimeNG", "Material UI", "CSS Modules"],
  },
  {
    label: "Backend",
    skills: [".NET 8", "NestJS", "Node.js", "EF Core", "REST APIs"],
  },
  {
    label: "Databases",
    skills: ["MongoDB", "SQL Server"],
  },
  {
    label: "Cloud & Storage",
    skills: ["Azure Blob Storage"],
  },
  {
    label: "Tooling",
    skills: ["BullMQ", "pnpm", "Jest", "Vitest", "MSTest", "Moq", "ESLint", "Git"],
  },
  {
    label: "Integrations",
    skills: ["Spotify API", "OAuth"],
  },
];
