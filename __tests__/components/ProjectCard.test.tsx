import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import type { ProjectEntry } from "../../data/projects";

const project = (overrides: Partial<ProjectEntry> = {}): ProjectEntry => ({
  name: "Async Job Pipeline",
  company: "Open Source",
  type: "Library",
  description: "A description",
  stack: ["TypeScript"],
  highlights: ["First highlight"],
  ...overrides,
});

describe("ProjectCard", () => {
  it("renders no link row when no URLs are set", () => {
    render(<ProjectCard project={project()} theme="light" />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders only the links whose URLs are set, in Demo/Repo/Package order", () => {
    render(
      <ProjectCard
        project={project({
          repoUrl: "https://github.com/erikleon/x",
          packageUrl: "https://www.npmjs.com/package/x",
        })}
        theme="light"
      />,
    );
    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["Repo ↗", "Package ↗"]);
    expect(links[0]).toHaveAttribute("href", "https://github.com/erikleon/x");
    expect(links[1]).toHaveAttribute("href", "https://www.npmjs.com/package/x");
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("does not toggle highlights when a link is clicked", () => {
    render(
      <ProjectCard
        project={project({ repoUrl: "https://github.com/erikleon/x" })}
        theme="light"
      />,
    );
    fireEvent.click(screen.getByRole("link", { name: "Repo ↗" }));
    expect(screen.queryByText("First highlight")).not.toBeInTheDocument();
  });

  it("wires aria-controls to a whitespace-free highlights id", () => {
    render(<ProjectCard project={project()} theme="light" />);
    const button = screen.getByRole("button", { name: "Show highlights" });
    expect(button).toHaveAttribute(
      "aria-controls",
      "highlights-async-job-pipeline",
    );

    fireEvent.click(button);
    expect(screen.getByRole("list")).toHaveAttribute(
      "id",
      "highlights-async-job-pipeline",
    );
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
