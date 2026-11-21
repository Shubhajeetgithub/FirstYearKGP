/**
 * Normalises a request pathname to the public URL form: no ".html", no trailing "/index",
 * and no trailing slash (trailingSlash is "never"), with "/" for the home page.
 * With `build.format: "file"`, Astro reports the home page as "/index" or "/index.html" at build time.
 */
export function cleanPath(pathname: string): string {
  const path = pathname
    .replace(/\.html$/, "")
    .replace(/\/index$/, "")
    .replace(/\/+$/, "");
  return path || "/";
}
