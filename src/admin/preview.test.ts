import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { marked } from "marked";
import katex from "katex";

type Render = (markdown: string, m: typeof marked, k: typeof katex) => string;

interface Helpers {
  minutesToRead: (markdown: string) => number;
  nameFromId: (id: string) => string;
  formatDate: (value: string) => string;
  resolveImages: (html: string, getAsset?: (src: string) => unknown) => string;
  externalLinks: (html: string) => string;
}

interface PreviewGlobals {
  renderMarkdownWithMath: Render;
  blogPreviewHelpers: Helpers;
}

// public/admin/preview.js is a classic browser script; run it in a bare context (no CMS) to get
// the renderer and helpers it exposes.
function loadPreview(): PreviewGlobals {
  const code = readFileSync(new URL("../../public/admin/preview.js", import.meta.url), "utf8");
  const context = vm.createContext({ Intl });
  vm.runInContext(code, context);
  return context as PreviewGlobals;
}

const preview = loadPreview();
const render = (md: string) => preview.renderMarkdownWithMath(md, marked, katex);
const helpers = preview.blogPreviewHelpers;

/** KaTeX draws commands it does not know in red instead of throwing. */
const KATEX_ERROR = /katex-error|#cc0000/;

describe("CMS preview: Markdown with maths", () => {
  it("renders display maths with KaTeX, keeping LaTeX spacing commands", () => {
    const html = render(String.raw`$$
X(f)\,H(f) \;\Longleftrightarrow\; x\!
$$`);
    expect(html).toContain('class="katex-display"');
    expect(html).not.toMatch(KATEX_ERROR);
    expect(html).toContain("⟺"); // \Longleftrightarrow
    expect(html).not.toContain("@@MATH");
  });

  it("renders inline maths inside a paragraph", () => {
    const html = render(String.raw`Euler: $e^{j\pi} + 1 = 0$ is neat.`);
    expect(html).toMatch(/<p>Euler: <span class="katex">/);
    expect(html).toContain("is neat.");
    expect(html).not.toMatch(KATEX_ERROR);
  });

  it("does not treat * and _ inside maths as Markdown emphasis", () => {
    const html = render("$$\n(x * h)(t) = a_1 * b_2\n$$");
    expect(html).not.toContain("<em>");
    expect(html).not.toMatch(KATEX_ERROR);
  });

  it("leaves dollar signs in code and escaped dollars alone", () => {
    const html = render("Use `$x$` for inline maths.\n\n```sh\necho $HOME $PATH\n```\n\nCosts \\$3 or \\$4.");
    expect(html).toContain("<code>$x$</code>");
    expect(html).toContain("echo $HOME $PATH");
    expect(html).not.toContain('class="katex"');
  });

  it("does not turn prices into maths", () => {
    expect(render("It costs $5 and $10.")).not.toContain("katex");
  });

  it("shows bad LaTeX in red instead of throwing", () => {
    expect(render(String.raw`$$
\notacommand{x}
$$`)).toMatch(KATEX_ERROR);
  });

  it("renders the sample post without KaTeX errors", () => {
    const post = readFileSync(new URL("./fixtures/math-post.md", import.meta.url), "utf8");
    const html = render(post.replace(/^---[\s\S]*?---/, ""));
    expect(html).not.toMatch(KATEX_ERROR);
    expect((html.match(/class="katex-display"/g) ?? []).length).toBe(9);
    expect(html).toContain("⟺");
    expect(html).toContain("<pre><code");
  });
});

describe("CMS preview: helpers", () => {
  it("resolves images through the CMS and never requests an unresolved relative path", () => {
    const html = '<p><img src="figure.png" alt="a"><img src="other.png" alt="b"><img src="https://x.test/y.png" alt="c"></p>';
    const out = helpers.resolveImages(html, (src) => (src === "figure.png" ? "blob:http://cms/123" : "other.png"));
    expect(out).toContain('<img src="blob:http://cms/123" alt="a">');
    expect(out).toContain('<img data-pending-src="other.png" alt="b">');
    expect(out).not.toMatch(/\ssrc="other\.png"/);
    expect(out).toContain('src="https://x.test/y.png"');
  });

  it("treats a throwing getAsset as not ready yet", () => {
    const out = helpers.resolveImages('<img src="a.png">', () => {
      throw new Error("not loaded");
    });
    expect(out).toBe('<img data-pending-src="a.png">');
  });

  it("opens external links in a new tab, like the site", () => {
    expect(helpers.externalLinks('<a href="https://example.com">x</a> <a href="/blog">y</a>')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">x</a> <a href="/blog">y</a>'
    );
  });

  it("turns author ids into names", () => {
    expect(helpers.nameFromId("shubhajeet-das")).toBe("Shubhajeet Das");
  });

  it("estimates reading time like the site (at least a minute, ~200 words a minute)", () => {
    expect(helpers.minutesToRead("")).toBe(1);
    expect(helpers.minutesToRead("word ".repeat(1000))).toBe(5);
  });

  it("formats dates like the site", () => {
    expect(helpers.formatDate("2026-11-21")).toBe("21 Nov 2026");
    expect(helpers.formatDate("")).toBe("");
  });
});
