import { describe, expect, it } from "vitest";
import Credits from "./Credits.astro";
import { parseHtml, renderAstro } from "../test/astro";

const author = (id: string, name: string, github: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { name, github, core: true, order: 1, ...extra },
});

describe("Credits", () => {
  it("lists contributors in the given order with photo, email and profile link", async () => {
    const doc = parseHtml(
      await renderAstro(Credits, {
        props: {
          authors: [
            author("shubhajeet-das", "Shubhajeet Das", "Shubhajeetgithub", {
              email: "shubhajeet [at] kgpian.iitkgp.ac.in",
              avatar: "https://raw.githubusercontent.com/Shubhajeetgithub/photos/main/shubhajeet.jpeg",
            }),
            author("kingshuk-patra", "Kingshuk Patra", "kingshuk7995"),
          ],
        },
      })
    );
    expect(doc.querySelector("h2")?.textContent).toBe("Core Contributors");
    const names = Array.from(doc.querySelectorAll("a")).map((a) => [a.textContent, a.getAttribute("href")]);
    expect(names).toEqual([
      ["Shubhajeet Das", "/authors/shubhajeet-das"],
      ["Kingshuk Patra", "/authors/kingshuk-patra"],
    ]);
    expect(doc.body.textContent).toContain("shubhajeet [at] kgpian.iitkgp.ac.in");
    const photo = (name: string) => decodeURIComponent(doc.querySelector(`img[alt="${name}"]`)?.getAttribute("src") ?? "");
    expect(photo("Shubhajeet Das")).toContain("shubhajeet.jpeg");
    // Without an avatar, the GitHub avatar is used.
    expect(photo("Kingshuk Patra")).toContain("avatars.githubusercontent.com/kingshuk7995");
  });
});
