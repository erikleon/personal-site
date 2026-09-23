export interface ProjectEntry {
  name: string;
  company: string;
  type:
    | "Feature"
    | "Architecture"
    | "DX"
    | "Library"
    | "Tool"
    | "App"
    | "Template";
  description: string;
  stack: string[];
  highlights: string[];
  demoUrl?: string;
  repoUrl?: string;
  packageUrl?: string;
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
    name: "rss-reader",
    company: "Open Source",
    type: "App",
    description:
      "A personal RSS reader that groups items by day with read/unread tracking. Runs as a web app or a CLI over the same core, and gets each user's identity from the Tailscale ingress header instead of passwords.",
    stack: ["Python", "FastAPI", "SQLModel", "Alembic", "Svelte", "Typer"],
    highlights: [
      "Feed autodiscovery: paste a site homepage and the real feed is found from its <link rel=\"alternate\"> tags",
      "OPML import from the web UI, CLI, or API, plus background auto-refresh on a configurable interval",
      "Reader view strips articles to text with no navigation, sidebars, or scripts",
      "Multi-user with per-person subscriptions and read state, checked against an allowlist",
    ],
    repoUrl: "https://github.com/erikleon/rss-reader",
  },
  {
    name: "fresh-direct-tool",
    company: "Open Source",
    type: "App",
    description:
      "An agent and web app that plans a household's weekly FreshDirect order: predicts which staples are due for restock, builds a draft cart with live prices, keeps it under a weekly budget, and hands off a ready-to-checkout cart once the household approves it.",
    stack: ["Python", "FastAPI", "SQLite", "Playwright", "Claude API", "MCP"],
    highlights: [
      "Reads full order history through FreshDirect's GraphQL API from a real Chrome session",
      "Suggests cheaper swaps when the draft cart runs over budget and flags low-confidence lines for review",
      "Token-authenticated JSON API used by a Home Assistant / Apple Reminders shopping-list bridge",
      "Local-first by design: runs on your own machine or server, with the stored session encrypted at rest",
    ],
    repoUrl: "https://github.com/erikleon/fresh-direct-tool",
  },
  {
    name: "strictdatetime",
    company: "Open Source",
    type: "Library",
    description:
      "Strict, immutable date and time utilities for JavaScript and TypeScript with zero runtime dependencies. Pure named functions over frozen records, with separate exact elapsed-time and calendar wall-time arithmetic.",
    stack: ["TypeScript", "ESM", "CommonJS", "Intl", "Vitest"],
    highlights: [
      "Strict typed parsers: native Date.parse strings are never accepted implicitly",
      "IANA time zones through the host runtime's Intl data, plus fixed-offset zones",
      "Millisecond precision; finer non-zero precision is rejected instead of silently truncated",
      "Published to npm with ESM and CommonJS builds sharing one set of type declarations",
    ],
    repoUrl: "https://github.com/erikleon/strictdatetime",
    packageUrl: "https://www.npmjs.com/package/strictdatetime",
  },
  {
    name: "minisiwyg-editor",
    company: "Open Source",
    type: "Library",
    description:
      "A ~6KB gzipped WYSIWYG editor for the browser with a built-in XSS sanitizer. Built on contentEditable and MutationObserver, with a customizable tag/attribute allowlist and a standalone sanitizer module that can be used on its own.",
    stack: [
      "TypeScript",
      "Vanilla JS",
      "ESM",
      "contentEditable",
      "MutationObserver",
    ],
    highlights: [
      "6054 bytes gzipped for the full ESM bundle (all 4 modules)",
      "Ships a standalone HTML sanitizer that strips scripts and dangerous attributes from pasted content",
      "Customizable allowlist policy for permitted tags and attributes",
      "Accessible toolbar with keyboard navigation and ARIA labels",
    ],
    demoUrl: "https://erikleon.github.io/minisiwyg-editor/",
    repoUrl: "https://github.com/erikleon/minisiwyg-editor",
  },
  {
    name: "citibike2strava",
    company: "Open Source",
    type: "Tool",
    description:
      "A small, auditable Python CLI that turns Citi Bike ride receipt emails in Gmail into Strava activities with the real route map, correct distance, and proper timestamps. You register your own Google and Strava apps, so tokens never leave your machine.",
    stack: ["Python", "Gmail API", "Strava API", "GPX"],
    highlights: [
      "Decodes the route polyline from the receipt because the Gmail API corrupts the map URL's scalar coordinates",
      "Rate-limit aware, resumable backfill of your whole ride history, plus scheduled auto-sync",
      "Works with other Lyft bikeshares: Divvy, Bay Wheels, Bluebikes, and Capital Bikeshare",
      "Tags e-bike rides as E-Bike Ride and labels each email so nothing uploads twice",
    ],
    repoUrl: "https://github.com/erikleon/citibike2strava",
  },
  {
    name: "stoop",
    company: "Open Source",
    type: "Template",
    description:
      "An MIT-licensed template for a small, private neighborhood website: approval-gated sign-in, event pages, and a searchable archive of the block's Google Group. Runs entirely within Cloudflare's free tiers.",
    stack: ["SvelteKit", "Cloudflare Pages", "Cloudflare D1", "Auth.js"],
    highlights: [
      "Full-text search over the group archive with SQLite FTS5 on D1",
      "A Cloudflare Email Worker ingests new posts; a Node script imports the historical .mbox backlog",
      "Sign in with Google or an emailed magic link, gated by admin approval",
      "One npm run setup pass personalizes the site name, group address, and domain",
    ],
    repoUrl: "https://github.com/erikleon/stoop",
  },
  {
    name: "access-dissect",
    company: "Open Source",
    type: "Tool",
    description:
      "A Windows-native Python tool that reverse-engineers Microsoft Access .accdb/.mdb applications into a structured catalog, then renders documentation and migration artifacts from it.",
    stack: ["Python", "COM automation", "pyodbc", "Pydantic", "Jinja2"],
    highlights: [
      "Extracts schema, queries, forms, reports, and VBA into a JSON/YAML catalog",
      "Renders cross-linked Markdown, a self-contained HTML report with Mermaid ER diagrams, and SQL DDL for PostgreSQL, SQLite, or SQL Server",
      "Analysis pass produces a dependency graph, complexity scores, and modernization recommendations",
      "117 unit tests; rendering and analysis run on any OS from an extracted catalog",
    ],
    repoUrl: "https://github.com/erikleon/msft-access-dissect",
  },
];
