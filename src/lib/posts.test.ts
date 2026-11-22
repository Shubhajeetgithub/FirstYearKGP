import { describe, expect, it } from "vitest";
import { avatarUrl, containsMath, formatDate, isVisible, neighbours, sortByDateDesc, tagCounts } from "./posts";
import type { PostLike } from "./posts";

const post = (id: string, date: string, tags: string[] = [], draft = false): PostLike => ({
  id,
  data: { pubDate: new Date(date), draft, tags },
});

describe("posts helpers", () => {
  it("hides drafts only in production", () => {
    expect(isVisible(post("a", "2026-01-01", [], true), true)).toBe(false);
    expect(isVisible(post("a", "2026-01-01", [], true), false)).toBe(true);
    expect(isVisible(post("a", "2026-01-01"), true)).toBe(true);
  });

  it("sorts newest first, ties by id", () => {
    const sorted = sortByDateDesc([post("b", "2026-01-01"), post("c", "2026-03-01"), post("a", "2026-01-01")]);
    expect(sorted.map((p) => p.id)).toEqual(["c", "a", "b"]);
  });

  it("counts tags once per post, most used first", () => {
    expect(tagCounts([post("a", "2026-01-01", ["x", "y", "x"]), post("b", "2026-01-02", ["y"])])).toEqual([
      ["y", 2],
      ["x", 1],
    ]);
  });

  it("finds newer and older neighbours", () => {
    const sorted = sortByDateDesc([post("old", "2026-01-01"), post("mid", "2026-02-01"), post("new", "2026-03-01")]);
    expect(neighbours(sorted, "mid")).toEqual({ newer: sorted[0], older: sorted[2] });
    expect(neighbours(sorted, "new").newer).toBeUndefined();
    expect(neighbours(sorted, "missing")).toEqual({});
  });

  it("falls back to the GitHub avatar", () => {
    expect(avatarUrl({ github: "octocat" })).toBe("https://avatars.githubusercontent.com/octocat?s=160");
    expect(avatarUrl({ github: "octocat", avatar: "https://x/y.png" })).toBe("https://x/y.png");
  });

  it.each([
    ["display maths", "Before\n\n$$\nx^2\n$$\n", true],
    ["inline maths", "Euler: $e^{i\\pi} + 1 = 0$.", true],
    ["no maths", "Just text.", false],
    ["prices", "It costs $5 and $10.", false],
    ["an escaped dollar", "Costs \\$3 or \\$4.", false],
    ["dollars in inline code", "Use `$x$` like this.", false],
    ["dollars in a code block", "```sh\necho $HOME $PATH\n```", false],
    ["undefined", undefined, false],
  ])("containsMath: %s", (_label, markdown, expected) => {
    expect(containsMath(markdown)).toBe(expected);
  });

  it("formats frontmatter dates in UTC", () => {
    expect(formatDate(new Date("2026-03-05"))).toBe("5 Mar 2026");
  });
});
