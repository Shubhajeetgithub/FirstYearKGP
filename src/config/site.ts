/** Site-wide constants. Nothing here is secret. */
export const SITE = {
  name: "AI Batch 2024",
  title: "AI Batch 2024 · IIT Kharagpur — Academic Resources",
  description:
    "Student-maintained study materials, notes, resources and a blog for the AI Batch 2024 at IIT Kharagpur, organised by semester and subject.",
  url: "https://ai2024-chi.vercel.app",
  /** owner/name on GitHub. */
  repo: "Shubhajeetgithub/FirstYearKGP",
  repoUrl: "https://github.com/Shubhajeetgithub/FirstYearKGP",
  branch: "main",
  feedbackFormUrl: "https://forms.gle/bMiuhPwQ4ees6BDQ9",
  ogImage: "/og.png",
  themeColor: "#07070a",
  locale: "en",
} as const;

/** Main navigation, in display order. `match` decides which item is current for a path. */
export const NAV_ITEMS = [
  { label: "Home", href: "/", match: (path: string) => path === "/" },
  { label: "Resources", href: "/resources", match: (path: string) => path.startsWith("/resources") },
  {
    label: "Blog",
    href: "/blog",
    match: (path: string) => path.startsWith("/blog") || path.startsWith("/authors"),
  },
] as const;

/** `<title>` for a semester page, e.g. "Semester 3 resources — AI Batch 2024, IIT KGP". */
export function semesterPageTitle(semesterName: string): string {
  return `${semesterName} resources — AI Batch 2024, IIT KGP`;
}

/** Meta description for a semester page. */
export function semesterPageDescription(semesterName: string, subjectNames: readonly string[]): string {
  const list = subjectNames.filter(Boolean).slice(0, 4).join(", ");
  const base = `${semesterName} notes, slides and study material for the AI Batch 2024 at IIT Kharagpur`;
  return list ? `${base}: ${list}${subjectNames.length > 4 ? " and more" : ""}.` : `${base}.`;
}

/**
 * Giscus (GitHub Discussions) settings. The IDs are public identifiers, not secrets.
 * 🧑 HUMAN STEP (Phase 5): fill these in from https://giscus.app. Comments stay hidden while
 * they are empty.
 */
export const GISCUS = {
  repo: SITE.repo,
  repoId: "",
  category: "Blog Comments",
  categoryId: "",
} as const;
