import { personalProjects, projects } from "../../data/projects";

describe("projects data", () => {
  it("has unique names across work and personal projects", () => {
    const names = [...projects, ...personalProjects].map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each(personalProjects.map((p) => [p.name, p]))(
    "%s links to its public GitHub repo",
    (_name, project) => {
      expect(project.company).toBe("Open Source");
      expect(project.repoUrl).toMatch(
        /^https:\/\/github\.com\/erikleon\/[A-Za-z0-9._-]+$/,
      );
    },
  );

  it.each(personalProjects.map((p) => [p.name, p]))(
    "%s has a description, stack, and highlights",
    (_name, project) => {
      expect(project.description.length).toBeGreaterThan(0);
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.highlights.length).toBeGreaterThan(0);
    },
  );
});
