import { describe, expect, it } from "vitest";
import SEO from "./SEO.astro";
import { parseHtml, renderAstro } from "../test/astro";

const meta = (doc: Document, key: string) =>
  doc.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.getAttribute("content");

describe("SEO", () => {
  it("renders title, description, canonical, OG and Twitter tags", async () => {
    const doc = parseHtml(
      `<head>${await renderAstro(SEO, { path: "/resources/s3.html", props: { title: "T", description: "D" } })}</head>`
    );
    expect(doc.title).toBe("T");
    expect(meta(doc, "description")).toBe("D");
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://ai2024-chi.vercel.app/resources/s3");
    expect(meta(doc, "og:type")).toBe("website");
    expect(meta(doc, "og:url")).toBe("https://ai2024-chi.vercel.app/resources/s3");
    expect(meta(doc, "og:image")).toBe("https://ai2024-chi.vercel.app/og.png");
    expect(meta(doc, "twitter:card")).toBe("summary_large_image");
    expect(meta(doc, "robots")).toBeUndefined();
  });

  it("uses / as the home page canonical", async () => {
    const doc = parseHtml(`<head>${await renderAstro(SEO, { path: "/index", props: { title: "T", description: "D" } })}</head>`);
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://ai2024-chi.vercel.app/");
  });

  it("adds article tags and noindex when asked", async () => {
    const doc = parseHtml(
      `<head>${await renderAstro(SEO, {
        path: "/blog/x",
        props: {
          title: "T",
          description: "D",
          type: "article",
          publishedTime: new Date("2026-01-02T00:00:00Z"),
          authors: ["https://ai2024-chi.vercel.app/authors/a"],
          noindex: true,
        },
      })}</head>`
    );
    expect(meta(doc, "og:type")).toBe("article");
    expect(meta(doc, "article:published_time")).toBe("2026-01-02T00:00:00.000Z");
    expect(meta(doc, "article:author")).toBe("https://ai2024-chi.vercel.app/authors/a");
    expect(meta(doc, "robots")).toBe("noindex");
  });
});
