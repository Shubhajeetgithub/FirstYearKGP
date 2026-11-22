import getReadingTime from "reading-time";
import type { Root } from "mdast";

/** Shape of the vfile data Astro reads remark frontmatter from. */
interface AstroVFileData {
  astro?: { frontmatter?: Record<string, unknown> };
}

/** Whole minutes to read `text`, at least 1. */
export function minutesToRead(text: string): number {
  return Math.max(1, Math.round(getReadingTime(text).minutes));
}

/** Node types whose text is not read as prose: code blocks, maths (remark-math) and raw HTML. */
const SKIPPED = new Set(["code", "math", "inlineMath", "html"]);

interface MdNode {
  type: string;
  value?: unknown;
  children?: MdNode[];
}

/**
 * The prose of a Markdown tree, with a space between nodes so words in neighbouring paragraphs
 * don't run together. Code and maths are left out: the CMS preview (public/admin/preview.js)
 * estimates the same way, so both show the same reading time.
 */
export function proseText(node: MdNode): string {
  if (SKIPPED.has(node.type)) return "";
  if ((node.type === "text" || node.type === "inlineCode") && typeof node.value === "string") return node.value;
  return (node.children ?? []).map(proseText).filter(Boolean).join(" ");
}

/**
 * Remark plugin: writes `minutesRead` (a number) into the post's frontmatter, available as
 * `remarkPluginFrontmatter.minutesRead` from `render(entry)`.
 */
export function remarkReadingTime() {
  return (tree: Root, file: { data: AstroVFileData }) => {
    const astro = (file.data.astro ??= {});
    const frontmatter = (astro.frontmatter ??= {});
    frontmatter.minutesRead = minutesToRead(proseText(tree));
  };
}
