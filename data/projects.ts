export interface ProjectEntry {
  name: string;
  company: string;
  type: "Feature" | "Architecture" | "DX";
  description: string;
  stack: string[];
  highlights: string[];
  demoUrl?: string;
  repoUrl?: string;
}

export const projects: ProjectEntry[] = [
  {
    name: "Enum-to-Database Architecture Migration",
    company: "DDC",
    type: "Architecture",
    description:
      "Replaced compile-time C# enums with database-driven workflow statuses across 5 API layers (controller, business logic, data access, storage, and frontend), eliminating code deployments for status configuration changes.",
    stack: [".NET 8", "EF Core", "Angular", "SQL Server"],
    highlights: [
      "Introduced WorkflowActionIds constants class for compile-time safety on critical workflow transitions",
      "Fixed a subtle bug where one code path silently fell back to hardcoded defaults due to missing database context",
    ],
  },
  {
    name: "Reusable DataFieldComponent",
    company: "DDC",
    type: "DX",
    description:
      "Angular component that replaced 600+ lines of duplicated form markup across contract details and insurance record forms with a single configurable field renderer.",
    stack: ["Angular", "TypeScript", "PrimeNG"],
    highlights: [
      "Net reduction of ~600 lines of template code across the application",
      "Supports text, textarea, dropdown, calendar, and currency input types with read-only/editable modes",
    ],
  },
  {
    name: "Server-Side Pagination with URL State",
    company: "DDC",
    type: "Feature",
    description:
      "Migrated dashboard from client-side filtering to server-side pagination using PrimeNG lazy-loaded tables with bookmarkable URL query parameter state.",
    stack: ["Angular", "PrimeNG", ".NET 8", "SQL Server"],
    highlights: [
      "Dashboard state (page, search, sort, status filter) is fully bookmarkable and back-button friendly",
      "Fixed an infinite sort loop caused by PrimeNG's lazy table re-emitting sort events on data load",
    ],
  },
  {
    name: "Test Infrastructure from Zero",
    company: "DDC",
    type: "DX",
    description:
      "Built the entire unit test infrastructure for a .NET 8 API with zero existing tests, plus fixed 20+ broken Angular component tests to restore CI green status.",
    stack: [".NET 8", "MSTest", "Moq", "EF Core InMemoryDatabase", "Angular"],
    highlights: [
      "34+ API tests covering auth, dashboard search, and insurance record retrieval",
      "InMemoryDatabase tests caught a navigation property mapping bug during the stored-procedure-to-LINQ migration",
    ],
  },
  {
    name: "Export Data Integrity Fix",
    company: "DDC",
    type: "Feature",
    description:
      "Fixed a critical bug where PDF and Excel exports only included the current paginated page instead of all filtered results, silently sending incomplete data to stakeholders.",
    stack: [".NET 8", "Angular", "PrimeNG"],
    highlights: [
      "Created a dedicated GetDataForExport() method that fetches the full filtered dataset",
      "Added confirmation dialogs and disabled-state buttons to prevent accidental exports",
    ],
  },
  {
    name: "OneSchema CSV Import Integration",
    company: "Copy.ai",
    type: "Feature",
    description:
      "End-to-end integration of OneSchema for bulk data imports, replacing a brittle in-house parser.",
    stack: ["Next.js", "NestJS", "MongoDB"],
    highlights: [
      "Reduced CSV-related support tickets by 40%",
      "Handled files with 100k+ rows via streaming upload",
    ],
  },
  {
    name: "Async Job Pipeline",
    company: "Copy.ai",
    type: "Architecture",
    description:
      "Distributed job queue for long-running content generation tasks using BullMQ and Redis.",
    stack: ["BullMQ", "NestJS", "Redis"],
    highlights: [
      "Processed 500k+ jobs per month with automatic retries",
      "Added observability dashboards for queue health",
    ],
  },
  {
    name: "Collaborative Workflow Editor",
    company: "Copy.ai",
    type: "Feature",
    description:
      "Drag-and-drop workflow builder enabling teams to chain AI prompts into reusable pipelines.",
    stack: ["React", "Next.js", "TypeScript"],
    highlights: [
      "Used by 50k+ monthly active users",
      "Implemented real-time collaboration via WebSocket sync",
    ],
  },
  {
    name: "NestJS API Migration",
    company: "Copy.ai",
    type: "Architecture",
    description:
      "Migrated monolithic Express handlers to a modular NestJS architecture with dependency injection.",
    stack: ["NestJS", "TypeScript", "Jest"],
    highlights: [
      "Achieved 90%+ unit test coverage on migrated modules",
      "Reduced average API latency by 25%",
    ],
  },
  {
    name: "Role-Based Access Control",
    company: "Copy.ai",
    type: "Feature",
    description:
      "Platform-wide RBAC system supporting workspace-level roles and fine-grained permissions.",
    stack: ["NestJS", "MongoDB", "JWT"],
    highlights: [
      "Enabled enterprise tier with custom role definitions",
      "Integrated with existing JWT session management",
    ],
  },
  {
    name: "Candidate Dashboard Rebuild",
    company: "Jopwell",
    type: "Feature",
    description:
      "Rebuilt the primary candidate-facing dashboard from a Rails view into a Next.js SPA.",
    stack: ["Next.js", "Redux", "TypeScript"],
    highlights: [
      "Improved page load times by 60%",
      "Increased candidate engagement metrics by 25%",
    ],
  },
  {
    name: "Shared Component Library",
    company: "Jopwell",
    type: "DX",
    description:
      "Design-system component library built with Material UI and documented in Storybook.",
    stack: ["React", "Material UI", "Storybook"],
    highlights: [
      "Adopted across three product teams",
      "Reduced UI inconsistency bugs by 50%",
    ],
  },
  {
    name: "SSR Marketing Pages",
    company: "Jopwell",
    type: "Feature",
    description:
      "Server-side rendered marketing and landing pages optimised for SEO and Core Web Vitals.",
    stack: ["Next.js", "React", "CSS Modules"],
    highlights: [
      "Boosted organic search traffic by 35%",
      "Achieved 95+ Lighthouse performance scores",
    ],
  },
];

export const personalProjects: ProjectEntry[] = [
  {
    name: "minisiwyg-editor",
    company: "Open Source",
    type: "DX",
    description:
      "A ~4KB gzipped WYSIWYG editor for the browser with a built-in XSS sanitizer. Built on contentEditable and MutationObserver, with a customizable tag/attribute allowlist and a standalone sanitizer module that can be used on its own.",
    stack: [
      "TypeScript",
      "Vanilla JS",
      "ESM",
      "contentEditable",
      "MutationObserver",
    ],
    highlights: [
      "4054 bytes gzipped for the full ESM bundle (all 4 modules)",
      "Ships a standalone HTML sanitizer that strips scripts and dangerous attributes from pasted content",
      "Customizable allowlist policy for permitted tags and attributes",
      "Accessible toolbar with keyboard navigation and ARIA labels",
    ],
    demoUrl: "https://erikleon.github.io/minisiwyg-editor/",
    repoUrl: "https://github.com/erikleon/minisiwyg-editor",
  },
];
