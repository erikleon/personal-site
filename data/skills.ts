export interface SkillCategory {
  label: string;
  skills: string[];
}

export const skills: SkillCategory[] = [
  {
    label: "Languages",
    skills: ["TypeScript", "JavaScript"],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "Redux", "Material UI", "CSS Modules"],
  },
  {
    label: "Backend",
    skills: ["NestJS", "Node.js", "REST APIs"],
  },
  {
    label: "Databases",
    skills: ["MongoDB"],
  },
  {
    label: "Tooling",
    skills: ["BullMQ", "pnpm", "Jest", "Vitest", "ESLint", "Git"],
  },
  {
    label: "Integrations",
    skills: ["Spotify API", "OAuth"],
  },
];
