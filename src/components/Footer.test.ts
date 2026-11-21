import { describe, expect, it } from "vitest";
import Footer from "./Footer.astro";
import { parseHtml, renderAstro } from "../test/astro";

describe("Footer", () => {
  it("links to the feedback form, the repo and the contribute page", async () => {
    const doc = parseHtml(await renderAstro(Footer));
    const links = Object.fromEntries(
      Array.from(doc.querySelectorAll("a")).map((a) => [a.textContent?.trim(), a.getAttribute("href")])
    );
    expect(links).toMatchObject({
      Feedback: "https://forms.gle/bMiuhPwQ4ees6BDQ9",
      GitHub: "https://github.com/Shubhajeetgithub/FirstYearKGP",
      "Write for us": "/blog/contribute",
    });
  });
});
