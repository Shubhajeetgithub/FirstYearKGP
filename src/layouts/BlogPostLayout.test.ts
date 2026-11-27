import { describe, expect, it } from "vitest";
import BlogPostLayout from "./BlogPostLayout.astro";
import { parseHtml, renderAstro } from "../test/astro";

const post = {
  id: "hello",
  body: "Energy is $E = mc^2$.",
  data: {
    title: "Hello",
    description: "A short summary",
    pubDate: new Date("2026-01-01"),
    tags: ["maths"],
    math: false,
    draft: false,
  },
};
const author = { id: "kp", data: { name: "KP", github: "kp" } };

async function render() {
  const html = await renderAstro(BlogPostLayout, {
    path: "/blog/hello",
    props: { post, authors: [author], headings: [] },
  });
  return parseHtml(html);
}

describe("BlogPostLayout", () => {
  it("makes the post's title, summary and body selectable, and nothing else", async () => {
    const doc = await render();
    const selectable = Array.from(doc.querySelectorAll(".selectable"));
    expect(selectable.map((el) => el.tagName)).toEqual(["H1", "P", "DIV"]);
    expect(selectable[0].textContent).toBe("Hello");
    expect(selectable[1].textContent).toBe("A short summary");
    expect(selectable[2].classList.contains("prose-post")).toBe(true);
    // The navigation, tags and footer stay interface text.
    expect(doc.querySelector("nav .selectable, footer .selectable, aside .selectable")).toBeNull();
  });

  it("loads the KaTeX stylesheet for posts with maths", async () => {
    const doc = await render();
    expect(doc.querySelector('link[href="/vendor/katex/katex.min.css"]')).not.toBeNull();
  });
});
