import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";

/** Shape of the vfile data Astro reads remark frontmatter from. */
interface AstroVFileData {
  astro?: { frontmatter?: Record<string, unknown> };
}

/** Whole minutes to read `text`, at least 1. */
export function minutesToRead(text: string): number {
  return Math.max(1, Math.round(getReadingTime(text).minutes));
}

/**
 * Remark plugin: writes `minutesRead` (a number) into the post's frontmatter, available as
 * `remarkPluginFrontmatter.minutesRead` from `render(entry)`.
 */
export function remarkReadingTime() {
  return (tree: Root, file: { data: AstroVFileData }) => {
    const astro = (file.data.astro ??= {});
    const frontmatter = (astro.frontmatter ??= {});
    frontmatter.minutesRead = minutesToRead(toString(tree));
  };
}
