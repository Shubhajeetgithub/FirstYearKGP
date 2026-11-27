// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import katex from "katex";
import { expandToFormulas, formulaAround, handleCopy, installCopyTex, plainTextWithTex } from "./copyTex";

const inline = (tex: string) => katex.renderToString(tex);
const display = (tex: string) => katex.renderToString(tex, { displayMode: true });

/** A blog-like body: a paragraph with inline maths, display maths, then a plain paragraph. */
function mount(): HTMLElement {
  document.body.innerHTML = `
    <div class="prose-post">
      <p id="p1">Energy is ${inline("E = mc^2")} for a body at rest.</p>
      ${display("\\int_0^1 x^2\\,dx = \\frac{1}{3}")}
      <p id="p2">No maths here.</p>
    </div>`;
  return document.querySelector(".prose-post")!;
}

/** A text node deep inside the rendered (visible) part of a formula. */
function renderedText(formula: Element): Text {
  const walker = document.createTreeWalker(formula.querySelector(".katex-html")!, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) if (node.textContent!.trim()) return node as Text;
  throw new Error("no rendered text");
}

function select(startNode: Node, startOffset: number, endNode: Node, endOffset: number): Selection {
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  return selection;
}

function copy(selection: Selection | null) {
  const data: Record<string, string> = {};
  const event = { clipboardData: { setData: (type: string, value: string) => void (data[type] = value) }, preventDefault: vi.fn() };
  const handled = handleCopy(event, selection);
  return { handled, data, prevented: event.preventDefault.mock.calls.length > 0 };
}

const inlineFormula = () => document.querySelector("#p1 .katex")!;
const displayFormula = () => document.querySelector(".katex-display")!;

afterEach(() => {
  document.body.innerHTML = "";
  window.getSelection()?.removeAllRanges();
});

describe("formulaAround", () => {
  it("finds the inline formula around a node inside it", () => {
    mount();
    expect(formulaAround(renderedText(inlineFormula()))).toBe(inlineFormula());
  });

  it("prefers the display block over the formula inside it", () => {
    mount();
    expect(formulaAround(renderedText(displayFormula()))).toBe(displayFormula());
  });

  it("returns null outside maths", () => {
    mount();
    expect(formulaAround(document.querySelector("#p2")!.firstChild!)).toBeNull();
  });
});

describe("expandToFormulas", () => {
  it("widens a range inside one formula to the whole formula, leaving the original alone", () => {
    mount();
    const text = renderedText(inlineFormula());
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 1);
    const expanded = expandToFormulas(range);
    expect(expanded.cloneContents().querySelector(".katex")).not.toBeNull();
    expect(range.startContainer).toBe(text); // the visible selection is not changed
  });
});

describe("plainTextWithTex", () => {
  it("writes inline maths as $…$ and display maths as $$…$$ on its own paragraph", () => {
    const body = mount();
    expect(plainTextWithTex(body)).toBe(
      "Energy is $E = mc^2$ for a body at rest.\n\n$$\\int_0^1 x^2\\,dx = \\frac{1}{3}$$\n\nNo maths here.",
    );
  });

  it("keeps TeX special characters as written", () => {
    document.body.innerHTML = `<p>${inline("a < b \\& c > d")}</p>`;
    expect(plainTextWithTex(document.body)).toBe("$a < b \\& c > d$");
  });

  it("leaves a formula without TeX source as its text", () => {
    document.body.innerHTML = `<p>see <span class="katex">x²</span></p>`;
    expect(plainTextWithTex(document.body)).toBe("see x²");
  });

  it("keeps code blocks' whitespace and lists' line breaks", () => {
    document.body.innerHTML = `<pre><code>a  =  1\n  b</code></pre><ul>\n<li>one ${inline("x")}</li>\n<li>two</li>\n</ul>`;
    expect(plainTextWithTex(document.body)).toBe("a  =  1\n  b\n\none $x$\ntwo");
  });
});

describe("handleCopy", () => {
  it("copies the whole inline formula with its $ delimiters when only part of it is selected", () => {
    mount();
    const text = renderedText(inlineFormula());
    const { handled, data, prevented } = copy(select(text, 0, text, 1));
    expect(handled).toBe(true);
    expect(prevented).toBe(true);
    expect(data["text/plain"]).toBe("$E = mc^2$");
    expect(data["text/html"]).toContain('class="katex"');
  });

  it("copies the whole display formula with $$ delimiters when only part of it is selected", () => {
    mount();
    const text = renderedText(displayFormula());
    const { data } = copy(select(text, 0, text, 1));
    expect(data["text/plain"]).toBe("$$\\int_0^1 x^2\\,dx = \\frac{1}{3}$$");
  });

  it("expands a selection that starts in plain text and ends inside a formula", () => {
    mount();
    const lead = document.querySelector("#p1")!.firstChild!; // "Energy is "
    const { data } = copy(select(lead, 7, renderedText(inlineFormula()), 1));
    expect(data["text/plain"]).toBe("is $E = mc^2$");
  });

  it("expands a selection that starts inside a formula and ends in plain text", () => {
    mount();
    const tail = inlineFormula().nextSibling!; // " for a body at rest."
    const { data } = copy(select(renderedText(inlineFormula()), 0, tail, 4));
    expect(data["text/plain"]).toBe("$E = mc^2$ for");
  });

  it("copies text and every formula across paragraphs", () => {
    mount();
    const lead = document.querySelector("#p1")!.firstChild!;
    const end = document.querySelector("#p2")!.firstChild!;
    const { data } = copy(select(lead, 0, end, 2));
    expect(data["text/plain"]).toBe(
      "Energy is $E = mc^2$ for a body at rest.\n\n$$\\int_0^1 x^2\\,dx = \\frac{1}{3}$$\n\nNo",
    );
  });

  it("leaves copies without maths to the browser", () => {
    mount();
    const text = document.querySelector("#p2")!.firstChild!;
    const { handled, data, prevented } = copy(select(text, 0, text, 2));
    expect(handled).toBe(false);
    expect(prevented).toBe(false);
    expect(data).toEqual({});
  });

  it("does nothing for an empty selection or without clipboard access", () => {
    mount();
    const text = renderedText(inlineFormula());
    expect(copy(select(text, 0, text, 0)).handled).toBe(false);
    expect(copy(null).handled).toBe(false);
    expect(handleCopy({ clipboardData: null, preventDefault: vi.fn() }, select(text, 0, text, 1))).toBe(false);
  });
});

describe("installCopyTex", () => {
  it("handles copy events on the document until removed", () => {
    mount();
    const text = renderedText(inlineFormula());
    select(text, 0, text, 1);
    const setData = vi.fn();
    const fire = () => {
      const event = new Event("copy", { cancelable: true }) as Event & { clipboardData: unknown };
      event.clipboardData = { setData };
      document.dispatchEvent(event);
      return event;
    };

    const remove = installCopyTex(document);
    expect(fire().defaultPrevented).toBe(true);
    expect(setData).toHaveBeenCalledWith("text/plain", "$E = mc^2$");

    remove();
    setData.mockClear();
    expect(fire().defaultPrevented).toBe(false);
    expect(setData).not.toHaveBeenCalled();
  });
});
