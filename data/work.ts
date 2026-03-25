export interface WorkEntry {
  company: string;
  title: string;
  period: string;
  stack: string[];
  highlights: string[];
}

export const work: WorkEntry[] = [
  {
    company: "Copy.ai",
    title: "Full-Stack Engineer",
    period: "2021–2024",
    stack: ["NestJS", "MongoDB", "Next.js", "BullMQ"],
    highlights: [
      "Led integration of OneSchema for scalable CSV imports, reducing support tickets by 40%",
      "Built async job pipeline with BullMQ to process bulk content-generation requests",
      "Migrated legacy REST endpoints to a modular NestJS architecture with full test coverage",
      "Designed and shipped a collaborative workflow editor used by 50k+ monthly active users",
      "Implemented role-based access control across the platform with JWT and session management",
    ],
  },
  {
    company: "Jopwell",
    title: "Software Engineer",
    period: "2019–2022",
    stack: ["React", "Next.js", "Redux", "TypeScript"],
    highlights: [
      "Rebuilt the candidate-facing dashboard in Next.js, improving page load times by 60%",
      "Developed a component library with Material UI and Storybook adopted across three teams",
      "Integrated third-party analytics and attribution tracking to measure campaign effectiveness",
      "Implemented server-side rendering for SEO-critical marketing pages, boosting organic traffic",
    ],
  },
];
