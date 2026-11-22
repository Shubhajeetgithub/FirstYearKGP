import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BLOG_CACHE_DIR, DEFAULT_BLOG_REPO, contentRepoPath, resolveBlogSource, tarballRequest } from "./blogSource";

const cwd = resolve("/work/site");

describe("resolveBlogSource", () => {
  it("downloads the default repository's main branch by default", () => {
    expect(resolveBlogSource({}, cwd)).toEqual({
      kind: "github",
      dir: join(cwd, BLOG_CACHE_DIR),
      repo: DEFAULT_BLOG_REPO,
      ref: "main",
      token: undefined,
    });
    expect(DEFAULT_BLOG_REPO).toBe("Shubhajeetgithub/FirstYearKGP-blog");
  });

  it("takes the repository, ref and token from the environment", () => {
    expect(resolveBlogSource({ BLOG_CONTENT_REPO: "me/posts", BLOG_CONTENT_REF: "v2", BLOG_CONTENT_TOKEN: "t0k" }, cwd)).toMatchObject({
      kind: "github",
      repo: "me/posts",
      ref: "v2",
      token: "t0k",
    });
  });

  it("uses a local folder when BLOG_CONTENT_DIR is set, resolved from the project", () => {
    expect(resolveBlogSource({ BLOG_CONTENT_DIR: "../FirstYearKGP-blog" }, cwd)).toEqual({
      kind: "local",
      dir: resolve(cwd, "../FirstYearKGP-blog"),
      repo: DEFAULT_BLOG_REPO,
    });
  });

  it("ignores blank values", () => {
    expect(resolveBlogSource({ BLOG_CONTENT_DIR: " ", BLOG_CONTENT_REPO: "", BLOG_CONTENT_REF: "" }, cwd)).toMatchObject({
      kind: "github",
      repo: DEFAULT_BLOG_REPO,
      ref: "main",
    });
  });

  it("rejects a repository that isn't owner/name", () => {
    expect(() => resolveBlogSource({ BLOG_CONTENT_REPO: "https://github.com/me/posts" }, cwd)).toThrow(/owner\/name/);
  });
});

describe("tarballRequest", () => {
  const source = resolveBlogSource({ BLOG_CONTENT_REPO: "me/posts", BLOG_CONTENT_REF: "feature/x" }, cwd);
  if (source.kind !== "github") throw new Error("expected a github source");

  it("uses codeload, without credentials, for public repositories", () => {
    expect(tarballRequest(source)).toEqual({ url: "https://codeload.github.com/me/posts/tar.gz/feature%2Fx", headers: {} });
  });

  it("uses the authenticated API when a token is set", () => {
    const { url, headers } = tarballRequest({ ...source, token: "t0k" });
    expect(url).toBe("https://api.github.com/repos/me/posts/tarball/feature%2Fx");
    expect(headers.Authorization).toBe("Bearer t0k");
  });
});

describe("contentRepoPath", () => {
  const contentDir = join(cwd, BLOG_CACHE_DIR);

  it("maps a downloaded file to its path in the content repository", () => {
    expect(contentRepoPath(".blog-content/posts/my-post/index.md", contentDir, cwd)).toBe("posts/my-post/index.md");
  });

  it("works for a local clone outside the project", () => {
    expect(contentRepoPath("../FirstYearKGP-blog/posts/a.md", resolve(cwd, "../FirstYearKGP-blog"), cwd)).toBe("posts/a.md");
  });

  it("returns undefined for files outside the content folder", () => {
    expect(contentRepoPath("src/pages/index.astro", contentDir, cwd)).toBeUndefined();
    expect(contentRepoPath(".blog-content", contentDir, cwd)).toBeUndefined();
  });
});
