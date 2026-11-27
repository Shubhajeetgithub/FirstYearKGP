// Copying maths from a blog post: a selection that touches a rendered formula copies the whole
// formula as its TeX source, `$…$` for inline maths and `$$…$$` for display maths.
// KaTeX keeps the source in each formula's MathML: <annotation encoding="application/x-tex">.

const DISPLAY = ".katex-display";
const INLINE = ".katex";

/** Elements whose text starts on a new line when copied as plain text. */
const BLOCK = new Set([
  "ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DD", "DIV", "DL", "DT", "FIGCAPTION", "FIGURE",
  "FOOTER", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HR", "LI", "OL", "P", "PRE", "SECTION",
  "TABLE", "TR", "UL",
]);

function elementOf(node: Node): Element | null {
  return node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
}

/** The whole formula `node` is part of: the display block if there is one, else the inline formula. */
export function formulaAround(node: Node): Element | null {
  const el = elementOf(node);
  return el?.closest(DISPLAY) ?? el?.closest(INLINE) ?? null;
}

/** A copy of `range` widened so that it never starts or ends inside a formula. */
export function expandToFormulas(range: Range): Range {
  const expanded = range.cloneRange();
  const start = formulaAround(range.startContainer);
  if (start) expanded.setStartBefore(start);
  const end = formulaAround(range.endContainer);
  if (end) expanded.setEndAfter(end);
  return expanded;
}

/** The TeX source of a rendered formula, or null when it has none (e.g. a KaTeX error). */
function texOf(formula: Element): string | null {
  const annotation = formula.querySelector('annotation[encoding="application/x-tex"]');
  return annotation ? (annotation.textContent ?? "").trim() : null;
}

/**
 * Plain text for copied content, with each formula replaced by its delimited TeX source.
 * Block elements are separated by blank lines, as browsers do when copying.
 */
export function plainTextWithTex(root: Node): string {
  let out = "";
  const newline = (count: number) => {
    out = out.replace(/[ \t]+$/, "");
    const trailing = out.length - out.replace(/\n*$/, "").length;
    if (out.length > 0 && trailing < count) out += "\n".repeat(count - trailing);
  };

  let inPre = 0;
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      // Outside <pre>, runs of whitespace (including the HTML's own line breaks) read as one space.
      out += inPre ? text : text.replace(/\s+/g, " ");
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    const el = node as Element;

    if (el.matches?.(DISPLAY)) {
      const tex = texOf(el);
      if (tex !== null) {
        newline(2);
        out += `$$${tex}$$`;
        newline(2);
        return;
      }
    } else if (el.matches?.(INLINE)) {
      const tex = texOf(el);
      if (tex !== null) {
        out += `$${tex}$`;
        return;
      }
    }

    if (el.tagName === "BR") {
      out += "\n";
      return;
    }
    const block = BLOCK.has(el.tagName);
    const gap = el.tagName === "LI" || el.tagName === "TR" ? 1 : 2;
    const pre = el.tagName === "PRE";
    if (block) newline(gap);
    if (pre) inPre++;
    node.childNodes.forEach(walk);
    if (pre) inPre--;
    if (block) newline(gap);
  };

  walk(root);
  return out
    .replace(/[ \t]+\n/g, "\n") // spaces left at the end of a line
    .replace(/\n[ \t]+(?=\n|$|\$\$)/g, "\n") // spaces before a blank line or display maths
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function hasFormula(fragment: DocumentFragment): boolean {
  return fragment.querySelector(`${INLINE}, ${DISPLAY}`) !== null;
}

/** The parts of a copy event the handler uses (a real ClipboardEvent satisfies it). */
export interface CopyEventLike {
  clipboardData: Pick<DataTransfer, "setData"> | null;
  preventDefault(): void;
}

/**
 * Handles a copy: when the selection touches a formula, puts whole formulas on the clipboard
 * (TeX in the plain text, the rendered maths in the HTML). Returns true when it took over.
 */
export function handleCopy(event: CopyEventLike, selection: Selection | null): boolean {
  if (!selection || selection.isCollapsed || selection.rangeCount === 0 || !event.clipboardData) return false;

  const fragments: DocumentFragment[] = [];
  for (let i = 0; i < selection.rangeCount; i++) {
    fragments.push(expandToFormulas(selection.getRangeAt(i)).cloneContents());
  }
  if (!fragments.some(hasFormula)) return false; // no maths: the browser's own copy is right

  const html = fragments
    .map((f) => Array.from(f.childNodes, (n) => (n instanceof Element ? n.outerHTML : (n.textContent ?? ""))).join(""))
    .join("");
  event.clipboardData.setData("text/plain", fragments.map(plainTextWithTex).join("\n"));
  event.clipboardData.setData("text/html", html);
  event.preventDefault();
  return true;
}

/** Installs the copy handler on a document. Returns a function that removes it. */
export function installCopyTex(doc: Document = document): () => void {
  const listener = (event: ClipboardEvent) => {
    handleCopy(event, doc.getSelection());
  };
  doc.addEventListener("copy", listener);
  return () => doc.removeEventListener("copy", listener);
}
