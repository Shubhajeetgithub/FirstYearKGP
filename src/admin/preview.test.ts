import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { marked } from "marked";
import katex from "katex";

type Render = (markdown: string, m: typeof marked, k: typeof katex) => string;

// public/admin/preview.js is a classic browser script; run it in a bare context to get the renderer.
function loadRenderer(): Render {
  const code = readFileSync(new URL("../../public/admin/preview.js", import.meta.url), "utf8");
  const context = vm.createContext({});
  vm.runInContext(code, context);
  return (context as { renderMarkdownWithMath: Render }).renderMarkdownWithMath;
}

const render = (md: string) => loadRenderer()(md, marked, katex);

/** KaTeX draws commands it does not know in red instead of throwing. */
const KATEX_ERROR = /katex-error|#cc0000/;

describe("CMS preview renderer", () => {
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
    const post = readFileSync(new URL("../content/blog/fourier-tricks-for-signals/index.md", import.meta.url), "utf8");
    const body = post.replace(/^---[\s\S]*?---/, "");
    const html = render(body);
    expect(html).not.toMatch(KATEX_ERROR);
    expect((html.match(/class="katex-display"/g) ?? []).length).toBe(9);
    expect(html).toContain("⟺");
    expect(html).toContain("<pre><code");
  });
});
