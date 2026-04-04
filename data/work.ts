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
    stack: [
      ".NET 8",
      "Angular",
      "PrimeNG",
      "EF Core",
      "SQL Server",
      "Azure Blob Storage",
    ],
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
    period: "2022–2024",
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
  {
    company: "Freelance",
    title: "Software Engineer",
    period: "2017–2019",
    stack: ["React", "JavaScript", "Python", "Google Sheets API"],
    highlights: [
      "Independently managed client engagements and project timelines including coordinating with client stakeholders and strategists",
      "Delivered private art collection CRUD app to catalog pieces and generate PDF reports, coordinating with a globally distributed team",
      "Built legacy support for scripts scraping data from Google Sheets, a research group website with proposal collection form, and Optimizely A/B testing integrations",
    ],
  },
  {
    company: "Dressler",
    title: "Software Engineer",
    period: "2014–2017",
    stack: ["Magento", "WordPress", "PHP", "JavaScript"],
    highlights: [
      "Built custom WordPress themes and plugins and Magento CE e-commerce sites",
      "Developed a kiosk web application for in-store interactive experiences",
      "Ran large-scale A/B and multivariate user experiments to optimize front-end designs and increase revenue",
    ],
  },
  {
    company: "Complex Media",
    title: "Software Engineer",
    period: "2014",
    stack: ["JavaScript", "HTML5", "CSS3"],
    highlights: [
      "Built a production-ready enterprise site for a marketing recap database with multi-level user login",
      "Developed a skinless video comment widget and branded content generator",
      "Created a 3D World Cup soccer ball interactive experience",
    ],
  },
];
