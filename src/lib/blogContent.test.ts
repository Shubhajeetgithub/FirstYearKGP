import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { c as createTar } from "tar";
import { checkLayout, downloadBlogContent, prepareBlogContent } from "./blogContent";

let work: string;

beforeEach(() => {
  work = mkdtempSync(join(tmpdir(), "blog-content-"));
});

afterEach(() => {
  rmSync(work, { recursive: true, force: true });
});

/** A gzipped tarball shaped like GitHub's: everything under "<owner>-<repo>-<sha>/". */
async function githubTarball(files: Record<string, string>, top = "me-posts-abc1234"): Promise<Uint8Array> {
  const src = join(work, "src");
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(src, top, path, ".."), { recursive: true });
    writeFileSync(join(src, top, path), body);
  }
  const chunks: Buffer[] = [];
  const stream = createTar({ gzip: true, cwd: src, portable: true }, [top]);
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  return new Uint8Array(Buffer.concat(chunks));
}

const respond = (body: Uint8Array | null, status = 200) =>
  vi.fn<typeof fetch>(async () => new Response(body as BodyInit | null, { status }));

const log = () => ({ info: vi.fn(), warn: vi.fn() });

const source = () => ({ kind: "github" as const, dir: join(work, ".blog-content"), repo: "me/posts", ref: "main" });

describe("downloadBlogContent", () => {
  it("unpacks only posts/ and authors/, without the top folder, and reports the commit", async () => {
    const fetchImpl = respond(
      await githubTarball({
        "posts/hello/index.md": "# Hello",
        "posts/hello/figure.png": "png",
        "authors/me.json": "{}",
        "README.md": "readme",
        ".github/workflows/publish.yml": "on: push",
      })
    );
    const { sha } = await downloadBlogContent(source(), { fetchImpl });
    expect(sha).toBe("abc1234");
    expect(fetchImpl).toHaveBeenCalledWith("https://codeload.github.com/me/posts/tar.gz/main", expect.objectContaining({ redirect: "follow" }));
    const dir = source().dir;
    expect(readFileSync(join(dir, "posts/hello/index.md"), "utf8")).toBe("# Hello");
    expect(readFileSync(join(dir, "authors/me.json"), "utf8")).toBe("{}");
    expect(readdirSync(dir).sort()).toEqual(["authors", "posts"]);
  });

  it("replaces the previous download completely", async () => {
    const dir = source().dir;
    mkdirSync(join(dir, "posts/old"), { recursive: true });
    writeFileSync(join(dir, "posts/old/index.md"), "stale");
    await downloadBlogContent(source(), { fetchImpl: respond(await githubTarball({ "posts/new/index.md": "fresh" })) });
    expect(existsSync(join(dir, "posts/old"))).toBe(false);
    expect(existsSync(join(dir, "posts/new/index.md"))).toBe(true);
  });

  it("keeps the previous download when the request fails", async () => {
    const dir = source().dir;
    mkdirSync(join(dir, "posts"), { recursive: true });
    writeFileSync(join(dir, "posts/keep.md"), "kept");
    await expect(downloadBlogContent(source(), { fetchImpl: respond(null, 404) })).rejects.toThrow(
      /HTTP 404 \(does the repository exist/
    );
    expect(readFileSync(join(dir, "posts/keep.md"), "utf8")).toBe("kept");
    expect(existsSync(`${dir}.download`)).toBe(false);
  });

  it("keeps the previous download when the archive is corrupt", async () => {
    const dir = source().dir;
    mkdirSync(join(dir, "authors"), { recursive: true });
    await expect(downloadBlogContent(source(), { fetchImpl: respond(new Uint8Array([1, 2, 3, 4])) })).rejects.toThrow();
    expect(existsSync(join(dir, "authors"))).toBe(true);
    expect(existsSync(`${dir}.download`)).toBe(false);
  });
});

describe("checkLayout", () => {
  it("rejects a folder that has neither posts/ nor authors/", async () => {
    await expect(checkLayout(work)).rejects.toThrow(/doesn't look like the blog content repository/);
  });

  it("creates the missing half (git does not keep empty folders)", async () => {
    mkdirSync(join(work, "authors"));
    await checkLayout(work);
    expect(existsSync(join(work, "posts"))).toBe(true);
  });
});

describe("prepareBlogContent", () => {
  it("uses BLOG_CONTENT_DIR without downloading", async () => {
    mkdirSync(join(work, "posts"));
    const fetchImpl = respond(null, 500);
    const logger = log();
    await expect(prepareBlogContent({ BLOG_CONTENT_DIR: work }, logger, { fetchImpl })).resolves.toBe(work);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("local folder"));
  });

  it("downloads into .blog-content under the project", async () => {
    const fetchImpl = respond(await githubTarball({ "posts/a/index.md": "a" }));
    const logger = log();
    const dir = await prepareBlogContent({ BLOG_CONTENT_REPO: "me/posts" }, logger, { fetchImpl, cwd: work });
    expect(dir).toBe(join(work, ".blog-content"));
    expect(existsSync(join(dir, "posts/a/index.md"))).toBe(true);
    expect(existsSync(join(dir, "authors"))).toBe(true);
    expect(logger.info).toHaveBeenCalledWith("Blog content: downloaded github.com/me/posts @ main (abc1234)");
  });

  it("offline in local development, falls back to the last download with a warning", async () => {
    mkdirSync(join(work, ".blog-content/posts"), { recursive: true });
    const logger = log();
    const dir = await prepareBlogContent({}, logger, { fetchImpl: vi.fn<typeof fetch>(async () => { throw new TypeError("offline"); }), cwd: work });
    expect(dir).toBe(join(work, ".blog-content"));
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("using the copy from the last successful download"));
  });

  it("never falls back to an old download on Vercel", async () => {
    mkdirSync(join(work, ".blog-content/posts"), { recursive: true });
    await expect(
      prepareBlogContent({ VERCEL: "1" }, log(), { fetchImpl: respond(null, 503), cwd: work })
    ).rejects.toThrow(/Could not download the blog content/);
  });

  it("fails the build with a clear message in CI when the download fails", async () => {
    await expect(
      prepareBlogContent({ BLOG_CONTENT_REPO: "me/missing", CI: "true" }, log(), { fetchImpl: respond(null, 404), cwd: work })
    ).rejects.toThrow(/Could not download the blog content from github.com\/me\/missing @ main: .*HTTP 404/);
  });
});
