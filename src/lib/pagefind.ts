// Minimal types for the parts of Pagefind's browser API we use (https://pagefind.app/docs/api/).

export interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: { title?: string; date?: string; image?: string };
  filters: Record<string, string[]>;
}

export interface PagefindResult {
  id: string;
  data: () => Promise<PagefindResultData>;
}

export interface PagefindSearch {
  results: PagefindResult[];
}

export interface Pagefind {
  init?: () => Promise<void>;
  options?: (opts: Record<string, unknown>) => Promise<void>;
  debouncedSearch: (
    query: string,
    options?: { filters?: Record<string, string | string[]> },
    timeoutMs?: number
  ) => Promise<PagefindSearch | null>;
}

/** Pagefind writes URLs as file paths (`/blog/post.html`); the site serves them without `.html`. */
export function cleanResultUrl(url: string): string {
  const [path, hash = ""] = url.split("#");
  const clean = path.replace(/\.html$/, "").replace(/\/index$/, "") || "/";
  return hash ? `${clean}#${hash}` : clean;
}

export type SearchType = "all" | "blog" | "resource";

export function isSearchType(value: string | null): value is SearchType {
  return value === "all" || value === "blog" || value === "resource";
}
