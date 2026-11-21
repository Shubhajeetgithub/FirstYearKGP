import { describe, expect, it } from "vitest";
import Nav from "./Nav.astro";
import { parseHtml, renderAstro } from "../test/astro";

async function navLinks(path: string) {
  const doc = parseHtml(await renderAstro(Nav, { path }));
  return Array.from(doc.querySelectorAll("a")).map((a) => ({
    label: a.textContent?.trim(),
    href: a.getAttribute("href"),
    current: a.getAttribute("aria-current"),
    className: a.getAttribute("class") ?? "",
  }));
}

describe("Nav", () => {
  it("renders Home, Resources and Blog as plain links, in order", async () => {
    expect((await navLinks("/")).map(({ label, href }) => [label, href])).toEqual([
      ["Home", "/"],
      ["Resources", "/resources"],
      ["Blog", "/blog"],
    ]);
  });

  it.each([
    ["/", "Home"],
    ["/index.html", "Home"],
    ["/resources", "Resources"],
    ["/resources/s3", "Resources"],
    ["/blog", "Blog"],
    ["/blog/some-post", "Blog"],
    ["/authors/someone", "Blog"],
  ])("at %s marks %s as the current page", async (path, active) => {
    const links = await navLinks(path);
    for (const link of links) {
      if (link.label === active) {
        expect(link.current).toBe("page");
        expect(link.className).toContain("text-white bg-white/10");
      } else {
        expect(link.current).toBeNull();
        expect(link.className).toContain("text-slate-400");
      }
    }
  });
});
