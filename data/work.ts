export interface WorkEntry {
  company: string;
  title: string;
  period: string;
  stack: string[];
  highlights: string[];
}

export const work: WorkEntry[] = [
  {
    company: "DDC",
    title: "Full-Stack Engineer",
    period: "2025–2026",
    stack: [".NET 8", "Angular", "PrimeNG", "EF Core", "SQL Server", "Azure Blob Storage"],
    highlights: [
      "Built a full-stack contract insurance management application from the ground up with .NET 8 Web API and Angular, delivering dashboard search, document upload workflows, and PDF/Excel export",
      "Architected a migration from compile-time enums to database-driven workflow statuses across 5 API layers, eliminating code deployments for status configuration changes",
      "Designed a reusable DataFieldComponent in Angular that replaced 600+ lines of duplicated form markup, reducing template complexity by ~50%",
      "Migrated the dashboard from client-side to server-side pagination with PrimeNG lazy-loaded tables and URL query parameter state synchronization",
      "Bootstrapped the entire unit test infrastructure — created the test project, introduced MSTest/Moq/EF Core InMemoryDatabase, and wrote 34+ API tests while fixing 20+ broken Angular component tests",
    ],
  },
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
