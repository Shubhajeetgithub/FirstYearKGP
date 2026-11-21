// Pure helpers for blog posts. Kept free of `astro:content` so they are unit-testable.

/** The fields these helpers need from a blog entry. */
export interface PostLike {
  id: string;
  data: { pubDate: Date; draft: boolean; tags: string[] };
}

/** Posts visible in this build: drafts only show in `astro dev`. */
export function isVisible(post: PostLike, isProd: boolean): boolean {
  return !(isProd && post.data.draft);
}

/** Newest first; ties broken by id so the order is stable across builds. */
export function sortByDateDesc<P extends PostLike>(posts: readonly P[]): P[] {
  return [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || a.id.localeCompare(b.id)
  );
}

/** Tag → number of posts, sorted by count (desc) then name. */
export function tagCounts(posts: readonly PostLike[]): [tag: string, count: number][] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of new Set(post.data.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts].sort(([a, x], [b, y]) => y - x || a.localeCompare(b));
}

/** The neighbours of a post in a newest-first list: `newer` is above it, `older` below. */
export function neighbours<P extends PostLike>(sorted: readonly P[], id: string): { newer?: P; older?: P } {
  const i = sorted.findIndex((p) => p.id === id);
  if (i === -1) return {};
  return { newer: sorted[i - 1], older: sorted[i + 1] };
}

export const postUrl = (id: string): string => `/blog/${id}`;
export const tagUrl = (tag: string): string => `/blog/tags/${tag}`;
export const authorUrl = (id: string): string => `/authors/${id}`;

/** Photo for an author: their own avatar URL, else their GitHub avatar. */
export function avatarUrl(author: { github: string; avatar?: string }, size = 160): string {
  return author.avatar ?? `https://avatars.githubusercontent.com/${author.github}?s=${size}`;
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "5 Mar 2026". Dates come from frontmatter as UTC midnight, so format in UTC. */
export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date);
}
