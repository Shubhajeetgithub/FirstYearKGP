import { describe, expect, it } from "vitest";
import { minutesToRead, remarkReadingTime } from "./readingTime";
import type { Root } from "mdast";

describe("reading time", () => {
  it("is at least one minute", () => {
    expect(minutesToRead("")).toBe(1);
    expect(minutesToRead("a few words")).toBe(1);
  });

  it("scales with length (~200 words a minute)", () => {
    expect(minutesToRead("word ".repeat(1000))).toBe(5);
  });

  it("writes minutesRead into the Astro frontmatter", () => {
    const tree: Root = { type: "root", children: [{ type: "paragraph", children: [{ type: "text", value: "word ".repeat(600) }] }] };
    const file: { data: { astro?: { frontmatter?: Record<string, unknown> } } } = { data: {} };
    remarkReadingTime()(tree, file);
    expect(file.data.astro?.frontmatter?.minutesRead).toBe(3);
  });
});
