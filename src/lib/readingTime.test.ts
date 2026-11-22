import { describe, expect, it } from "vitest";
import { minutesToRead, proseText, remarkReadingTime } from "./readingTime";
import type { Root } from "mdast";

describe("reading time", () => {
  it("is at least one minute", () => {
    expect(minutesToRead("")).toBe(1);
    expect(minutesToRead("a few words")).toBe(1);
  });

  it("scales with length (~200 words a minute)", () => {
    expect(minutesToRead("word ".repeat(1000))).toBe(5);
  });

  it("counts prose only, with paragraphs kept apart", () => {
    const tree: Root = {
      type: "root",
      children: [
        { type: "paragraph", children: [{ type: "text", value: "first" }] },
        { type: "paragraph", children: [{ type: "text", value: "second" }, { type: "inlineCode", value: "x" }] },
        { type: "code", value: "print('not prose')" },
        { type: "html", value: "<b>skip</b>" },
      ],
    };
    expect(proseText(tree)).toBe("first second x");
    // remark-math nodes are skipped too.
    expect(proseText({ type: "root", children: [{ type: "math", value: "x^2" }, { type: "inlineMath", value: "y" }] })).toBe("");
  });

  it("writes minutesRead into the Astro frontmatter", () => {
    const tree: Root = { type: "root", children: [{ type: "paragraph", children: [{ type: "text", value: "word ".repeat(600) }] }] };
    const file: { data: { astro?: { frontmatter?: Record<string, unknown> } } } = { data: {} };
    remarkReadingTime()(tree, file);
    expect(file.data.astro?.frontmatter?.minutesRead).toBe(3);
  });
});
