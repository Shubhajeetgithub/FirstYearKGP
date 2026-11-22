// Where the blog's posts and authors come from. Kept free of heavy imports so astro.config.mjs can
// use it too. Blog content lives in its own repository (see README → "Blog content") and is
// downloaded at build time, so new posts never need a commit to the site repository.
import { isAbsolute, relative, resolve, sep } from "node:path";
import { loadEnv } from "vite";
import { SITE } from "../config/site";

/** owner/name of the content repository. Override with BLOG_CONTENT_REPO. */
export const DEFAULT_BLOG_REPO: string = SITE.blogRepo;
/** Branch, tag or commit to build from. Override with BLOG_CONTENT_REF. */
export const DEFAULT_BLOG_REF: string = SITE.blogBranch;
/** Download location inside the project (gitignored). */
export const BLOG_CACHE_DIR = ".blog-content";
/** Folders of the content repository the site reads. */
export const BLOG_FOLDERS = ["posts", "authors"] as const;
export type BlogFolder = (typeof BLOG_FOLDERS)[number];

export type BlogEnv = Readonly<Record<string, string | undefined>>;

export type BlogSource =
  /** A local checkout of the content repository (BLOG_CONTENT_DIR), e.g. while writing a post. */
  | { kind: "local"; dir: string; repo: string }
  /** The content repository on GitHub, downloaded into `dir`. */
  | { kind: "github"; dir: string; repo: string; ref: string; token?: string };

/** Environment variables from the shell, falling back to .env files (process env wins). */
export function readBlogEnv(cwd: string = process.cwd()): BlogEnv {
  const mode = process.env.NODE_ENV === "production" ? "production" : "development";
  return { ...loadEnv(mode, cwd, ""), ...process.env };
}

const REPO_PATTERN = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;

/** The configured repository as owner/name. */
export function blogRepo(env: BlogEnv): string {
  const repo = env.BLOG_CONTENT_REPO?.trim() || DEFAULT_BLOG_REPO;
  if (!REPO_PATTERN.test(repo)) {
    throw new Error(`[blog] BLOG_CONTENT_REPO must look like "owner/name", got "${repo}".`);
  }
  return repo;
}

/** Works out where to read blog content from. */
export function resolveBlogSource(env: BlogEnv, cwd: string = process.cwd()): BlogSource {
  const repo = blogRepo(env);
  const localDir = env.BLOG_CONTENT_DIR?.trim();
  if (localDir) return { kind: "local", dir: resolve(cwd, localDir), repo };
  return {
    kind: "github",
    dir: resolve(cwd, BLOG_CACHE_DIR),
    repo,
    ref: env.BLOG_CONTENT_REF?.trim() || DEFAULT_BLOG_REF,
    token: env.BLOG_CONTENT_TOKEN?.trim() || undefined,
  };
}

/**
 * The tarball to download. Public repositories use codeload (no API rate limit); a token switches
 * to the authenticated API so private repositories work too.
 */
export function tarballRequest(source: Extract<BlogSource, { kind: "github" }>): { url: string; headers: Record<string, string> } {
  const ref = encodeURIComponent(source.ref);
  if (source.token) {
    return {
      url: `https://api.github.com/repos/${source.repo}/tarball/${ref}`,
      headers: {
        Authorization: `Bearer ${source.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    };
  }
  return { url: `https://codeload.github.com/${source.repo}/tar.gz/${ref}`, headers: {} };
}

/**
 * A content file's path inside the content repository (e.g. "posts/my-post/index.md"), from the
 * project-relative `filePath` Astro records. Undefined when the file is not inside `contentDir`.
 */
export function contentRepoPath(filePath: string, contentDir: string, cwd: string = process.cwd()): string | undefined {
  const rel = relative(contentDir, resolve(cwd, filePath));
  // On Windows, a path on another drive comes back absolute.
  if (!rel || rel.startsWith("..") || isAbsolute(rel)) return undefined;
  return rel.split(sep).join("/");
}
