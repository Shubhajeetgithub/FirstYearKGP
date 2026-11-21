import { describe, expect, it } from "vitest";
import Credits from "./Credits.astro";
import { parseHtml, renderAstro } from "../test/astro";

describe("Credits", () => {
  it("lists the three core contributors with photo and email", async () => {
    const doc = parseHtml(await renderAstro(Credits));
    expect(doc.querySelector("h2")?.textContent).toBe("Core Contributors");
    for (const [name, email, photo] of [
      ["Shubhajeet Das", "shubhajeet [at] kgpian.iitkgp.ac.in", "shubhajeet.jpeg"],
      ["Kingshuk Patra", "kingshuk [at] kgpian.iitkgp.ac.in", "kingshuk.jpeg"],
      ["Durva Daga", "durva [at] kgpian.iitkgp.ac.in", "durva.jpeg"],
    ]) {
      expect(doc.body.textContent).toContain(name);
      expect(doc.body.textContent).toContain(email);
      const img = doc.querySelector(`img[alt="${name}"]`);
      // Optimised through astro:assets; the original URL is the source.
      expect(decodeURIComponent(img?.getAttribute("src") ?? "")).toContain(photo);
      expect(img?.getAttribute("loading")).toBe("lazy");
    }
  });
});
