import { afterEach, describe, expect, it, vi } from "vitest";
import { parseHtml, renderAstro } from "../test/astro";

afterEach(() => {
  vi.doUnmock("../config/site");
  vi.resetModules();
});

async function renderWith(repoId: string, categoryId: string) {
  vi.resetModules();
  vi.doMock("../config/site", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../config/site")>();
    return { ...actual, GISCUS: { ...actual.GISCUS, repoId, categoryId } };
  });
  const { default: Comments } = await import("./Comments.astro");
  return parseHtml(await renderAstro(Comments, { path: "/blog/post" }));
}

describe("Comments", () => {
  it("renders the giscus container with the agreed settings once ids are set", async () => {
    const doc = await renderWith("R_123", "DIC_456");
    const container = doc.querySelector(".giscus");
    const attrs = JSON.parse(container?.getAttribute("data-giscus-attributes") ?? "{}");
    expect(attrs).toMatchObject({
      "data-repo": "Shubhajeetgithub/FirstYearKGP",
      "data-repo-id": "R_123",
      "data-category": "Blog Comments",
      "data-category-id": "DIC_456",
      "data-mapping": "pathname",
      "data-strict": "1",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": "transparent_dark",
      "data-lang": "en",
      "data-loading": "lazy",
    });
    expect(doc.querySelector("#comments-heading")?.textContent).toContain("Comments");
  });

  it("renders no giscus container while the ids are empty", async () => {
    const doc = await renderWith("", "");
    expect(doc.querySelector(".giscus")).toBeNull();
  });
});
