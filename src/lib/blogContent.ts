// Downloads the blog content repository at build time and loads it into content collections.
import { existsSync } from "node:fs";
import { mkdir, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { pathToFileURL } from "node:url";
import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";
import { x as extract } from "tar";
import { BLOG_FOLDERS, readBlogEnv, resolveBlogSource, tarballRequest } from "./blogSource";
import type { BlogEnv, BlogFolder, BlogSource } from "./blogSource";

const DOWNLOAD_TIMEOUT_MS = 60_000;

type GithubSource = Extract<BlogSource, { kind: "github" }>;

interface Log {
  info: (message: string) => void;
  warn: (message: string) => void;
}

export interface DownloadOptions {
  fetchImpl?: typeof fetch;
}

/**
 * The commit a GitHub tarball was made from, shortened. `git archive` records it as the pax
 * "comment" on every entry; API tarballs also name their top folder "<owner>-<repo>-<sha>".
 */
function commitOf(entry: { comment?: string; path: string }): string | undefined {
  const full = entry.comment?.trim();
  if (full && /^[0-9a-f]{40}$/.test(full)) return full.slice(0, 7);
  return entry.path.split("/")[0].match(/-([0-9a-f]{7,40})$/)?.[1]?.slice(0, 7);
}

/**
 * Downloads the repository tarball and unpacks its posts/ and authors/ folders into `source.dir`,
 * replacing what was there only once the download has fully succeeded.
 */
export async function downloadBlogContent(source: GithubSource, { fetchImpl = fetch }: DownloadOptions = {}): Promise<{ sha?: string }> {
  const { url, headers } = tarballRequest(source);
  const res = await fetchImpl(url, { headers, redirect: "follow", signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });
  if (!res.ok || !res.body) {
    const hint = res.status === 404 ? " (does the repository exist, is it public, and does the branch exist?)" : "";
    throw new Error(`GET ${url} returned HTTP ${res.status}${hint}`);
  }

  const tmp = `${source.dir}.download`;
  await rm(tmp, { recursive: true, force: true });
  await mkdir(tmp, { recursive: true });
  let sha: string | undefined;
  const wanted = new RegExp(`^[^/]+/(${BLOG_FOLDERS.join("|")})(/|$)`);
  try {
    await pipeline(
      Readable.fromWeb(res.body as NodeReadableStream<Uint8Array>),
      extract({
        cwd: tmp,
        strip: 1,
        // Only the content folders; tar also refuses absolute paths and "..". The filter sees every
        // entry, so it also picks up the commit.
        filter: (path, entry) => {
          const comment = "comment" in entry && typeof entry.comment === "string" ? entry.comment : undefined;
          sha ??= commitOf({ path, comment });
          return wanted.test(path);
        },
      })
    );
    await rm(source.dir, { recursive: true, force: true });
    await rename(tmp, source.dir);
  } catch (err) {
    await rm(tmp, { recursive: true, force: true });
    throw err;
  }
  return { sha };
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

/** Checks the folder looks like the content repository; creates a missing (empty) half. */
export async function checkLayout(dir: string): Promise<void> {
  const present = await Promise.all(BLOG_FOLDERS.map((f) => isDirectory(join(dir, f))));
  if (!present.some(Boolean)) {
    throw new Error(
      `[blog] ${dir} doesn't look like the blog content repository: it has no ${BLOG_FOLDERS.join("/ or ")}/ folder.`
    );
  }
  // Git doesn't keep empty folders, so a repository with authors but no posts yet is fine.
  await Promise.all(BLOG_FOLDERS.map((f, i) => (present[i] ? undefined : mkdir(join(dir, f), { recursive: true }))));
}

export interface PrepareOptions extends DownloadOptions {
  /** Project folder; .blog-content and relative BLOG_CONTENT_DIR resolve against it. */
  cwd?: string;
}

/** Downloads (or locates) the content and returns its folder. */
export async function prepareBlogContent(env: BlogEnv, log: Log, options: PrepareOptions = {}): Promise<string> {
  const source = resolveBlogSource(env, options.cwd);
  if (source.kind === "local") {
    log.info(`Blog content: using the local folder ${source.dir} (BLOG_CONTENT_DIR)`);
    await checkLayout(source.dir);
    return source.dir;
  }

  try {
    const { sha } = await downloadBlogContent(source, options);
    log.info(`Blog content: downloaded github.com/${source.repo} @ ${source.ref}${sha ? ` (${sha})` : ""}`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    // Offline local development can carry on with the last download; CI and Vercel never do.
    if (!env.CI && !env.VERCEL && existsSync(source.dir)) {
      log.warn(`Blog content: download failed (${reason}); using the copy from the last successful download.`);
    } else {
      throw new Error(
        `[blog] Could not download the blog content from github.com/${source.repo} @ ${source.ref}: ${reason}. ` +
          "Set BLOG_CONTENT_TOKEN for a private repository, or BLOG_CONTENT_DIR to build from a local clone.",
        { cause: err }
      );
    }
  }
  await checkLayout(source.dir);
  return source.dir;
}

let pending: Promise<string> | undefined;

/** Prepares the content once per process; both collections share it. A failure can be retried. */
function sharedBlogContent(log: Log): Promise<string> {
  pending ??= prepareBlogContent(readBlogEnv(), log).catch((err: unknown) => {
    pending = undefined;
    throw err;
  });
  return pending;
}

/**
 * A content-collection loader for one folder of the blog content repository. It fetches the
 * repository (once), then hands over to Astro's glob() loader for that folder.
 */
export function blogContentLoader(folder: BlogFolder, pattern: string): Loader {
  return {
    name: `blog-content:${folder}`,
    load: async (context) => {
      const root = await sharedBlogContent(context.logger);
      const base = pathToFileURL(join(root, folder)).href;
      await glob({ pattern, base }).load(context);
    },
  };
}
