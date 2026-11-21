import { describe, expect, it } from "vitest";
import { cleanPath } from "./url";

describe("cleanPath", () => {
  it.each([
    ["/", "/"],
    ["", "/"],
    ["/index", "/"],
    ["/index.html", "/"],
    ["/resources", "/resources"],
    ["/resources/", "/resources"],
    ["/resources.html", "/resources"],
    ["/resources/s1.html", "/resources/s1"],
    ["/blog/index", "/blog"],
    ["/blog/my-index-post", "/blog/my-index-post"],
  ])("%j -> %j", (input, expected) => {
    expect(cleanPath(input)).toBe(expected);
  });
});
