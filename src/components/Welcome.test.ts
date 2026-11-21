import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import Welcome from "./Welcome.astro";
import { parseHtml, renderAstro } from "../test/astro";

describe("Welcome", () => {
  it("renders the hero and the two calls to action", async () => {
    const doc = parseHtml(await renderAstro(Welcome));
    expect(doc.querySelector("h1")?.textContent).toContain("AI Batch 2024");
    const links = Array.from(doc.querySelectorAll("a"));
    const browse = links.find((a) => a.textContent?.trim() === "Browse Resources");
    expect(browse?.getAttribute("href")).toBe("/resources");
    const feedback = links.find((a) => a.textContent?.trim() === "Feedback Form");
    expect(feedback?.getAttribute("href")).toBe("https://forms.gle/bMiuhPwQ4ees6BDQ9");
    expect(feedback?.getAttribute("target")).toBe("_blank");
    expect(feedback?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("types the terminal command with CSS only: full text in the HTML, one step per character", async () => {
    const html = await renderAstro(Welcome);
    const typing = parseHtml(html).querySelector(".typing");
    expect(typing?.textContent).toBe("cat init_academic_resources.sh");
    expect(typing?.getAttribute("style")).toContain("--chars: 30");
    expect(html).not.toContain("<script");
    // Scoped styles go to the CSS bundle, not the HTML, so check the component source.
    const source = readFileSync(new URL("./Welcome.astro", import.meta.url), "utf8");
    expect(source).toContain("steps(var(--chars), end)");
    expect(source).toMatch(/prefers-reduced-motion: reduce\)\s*\{\s*\.typing \{\s*animation: none;/);
  });
});
