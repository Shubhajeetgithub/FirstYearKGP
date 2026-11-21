import { describe, expect, it } from "vitest";
import { cleanResultUrl, isSearchType } from "./pagefind";

describe("cleanResultUrl", () => {
  it.each([
    ["/blog/post.html", "/blog/post"],
    ["/resources/s3.html", "/resources/s3"],
    ["/index.html", "/"],
    ["/blog/post.html#heading", "/blog/post#heading"],
    ["/blog/post", "/blog/post"],
  ])("%s -> %s", (input, expected) => {
    expect(cleanResultUrl(input)).toBe(expected);
  });
});

describe("isSearchType", () => {
  it("accepts only known types", () => {
    expect(isSearchType("blog")).toBe(true);
    expect(isSearchType("resource")).toBe(true);
    expect(isSearchType("all")).toBe(true);
    expect(isSearchType("x")).toBe(false);
    expect(isSearchType(null)).toBe(false);
  });
});
