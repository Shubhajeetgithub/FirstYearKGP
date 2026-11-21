import { afterEach, describe, expect, it, vi } from "vitest";
import { loadBuildSheet } from "./buildSheet";

const HEADER = "semester,subject_id,subject_name,subject_image,resource_name,resource_url,icon";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("loadBuildSheet", () => {
  it("fails with a clear message when no URL is configured", async () => {
    await expect(loadBuildSheet(undefined)).rejects.toThrow(/SHEET_CSV_URL is not set/);
  });

  it("returns the parsed data and when it was fetched", async () => {
    vi.spyOn(Date, "now").mockReturnValue(99);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(`${HEADER}\n1,A,Alpha,,,,`, { status: 200 })));
    const sheet = await loadBuildSheet("https://example.test/sheet.csv");
    expect(sheet.fetchedAt).toBe(99);
    expect(Object.keys(sheet.data)).toEqual(["s1"]);
  });

  it("retries, then fails the build rather than deploying empty pages", async () => {
    const fetchMock = vi.fn(async () => new Response("down", { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(loadBuildSheet("https://example.test/sheet.csv")).rejects.toThrow(
      /Could not load the resources Google Sheet at build time \(3 attempts\): Sheet fetch failed: 503.*Failing the build/
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("treats an empty sheet as a failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(HEADER, { status: 200 })));
    await expect(loadBuildSheet("https://example.test/sheet.csv")).rejects.toThrow(/Sheet returned no data/);
  });

  it("recovers when a retry succeeds", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("blip"))
      .mockResolvedValue(new Response(`${HEADER}\n2,B,Beta,,,,`, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(loadBuildSheet("https://example.test/sheet.csv")).resolves.toMatchObject({ data: { s2: expect.any(Object) } });
  });
});
