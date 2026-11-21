import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CACHE_KEY,
  fetchSemesterData,
  fetchSheetCsv,
  parseSheet,
  readCachedSheet,
  refreshSemesterData,
  rowsToSemesterData,
  toResourceIcon,
} from "./sheet";
import { RESOURCE_ICONS } from "../types/semester";

const URL = "https://example.test/sheet.csv";
const HEADER = "semester,subject_id,subject_name,subject_image,resource_name,resource_url,icon";
const csv = (...rows: string[]) => [HEADER, ...rows].join("\n");

/** Minimal in-memory Storage; Node has no localStorage. */
class MemoryStorage {
  store = new Map<string, string>();
  getItem(key: string): string | null { return this.store.get(key) ?? null; }
  setItem(key: string, value: string): void { this.store.set(key, value); }
  removeItem(key: string): void { this.store.delete(key); }
  clear(): void { this.store.clear(); }
}

let storage: MemoryStorage;

function stubFetch(impl: typeof fetch) {
  const fetchMock = vi.fn<typeof fetch>(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const ok = (body: string) => async () => new Response(body, { status: 200 });

beforeEach(() => {
  vi.useRealTimers();
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("parseSheet / rowsToSemesterData", () => {
  it("builds semesters, subjects and resources with icon names", () => {
    expect(
      parseSheet(csv(
        "1,MA11001,Calculus,https://img/calc.png,Notes,https://r/notes,book",
        "1,MA11001,Calculus,https://img/calc.png,Slides,https://r/slides,download",
      ))
    ).toEqual({
      s1: {
        name: "Semester 1",
        subjects: [
          {
            id: "MA11001",
            name: "Calculus",
            image: "https://img/calc.png",
            semester: "s1",
            semesterName: "Semester 1",
            resources: [
              { name: "Notes", url: "https://r/notes", icon: "book" },
              { name: "Slides", url: "https://r/slides", icon: "download" },
            ],
          },
        ],
      },
    });
  });

  it("produces only serialisable icon names (islands take JSON props)", () => {
    const data = parseSheet(csv("1,A,Alpha,,R1,u,book", "1,A,Alpha,,R2,u,FILE", "1,A,Alpha,,R3,u,video"));
    const icons = data.s1.subjects[0].resources.map((r) => r.icon);
    expect(icons).toEqual(["book", "file", "file"]);
    for (const icon of icons) expect(RESOURCE_ICONS).toContain(icon);
    expect(JSON.parse(JSON.stringify(data))).toEqual(data);
  });

  it("accepts the semester as '1', 's1' or 'S1'", () => {
    const data = parseSheet(csv("1,A,Alpha,,,,", "s1,B,Beta,,,,", "S1,C,Gamma,,,,"));
    expect(Object.keys(data)).toEqual(["s1"]);
    expect(data.s1.subjects.map((s) => s.id)).toEqual(["A", "B", "C"]);
  });

  it("only strips a single leading 's'", () => {
    const data = parseSheet(csv("ss2,A,Alpha,,,,"));
    expect(Object.keys(data)).toEqual(["ss2"]);
    expect(data.ss2.name).toBe("Semester s2");
  });

  it("treats '01' and '1' as different semesters", () => {
    const data = parseSheet(csv("1,A,Alpha,,,,", "01,B,Beta,,,,"));
    expect(Object.keys(data).sort()).toEqual(["s01", "s1"]);
  });

  it("trims cells and matches headers case-insensitively, in any column order", () => {
    const data = parseSheet([
      " ICON , Resource_URL,resource_name ,subject_image,Subject_Name,SUBJECT_ID,Semester",
      " book , https://r/x , Notes , https://img , Calculus , MA1 , 2 ",
    ].join("\n"));
    expect(data.s2.subjects[0]).toEqual({
      id: "MA1",
      name: "Calculus",
      image: "https://img",
      semester: "s2",
      semesterName: "Semester 2",
      resources: [{ name: "Notes", url: "https://r/x", icon: "book" }],
    });
  });

  it("treats missing columns and short rows as empty strings", () => {
    const data = parseSheet(["semester,subject_id", "3,X1"].join("\n"));
    expect(data.s3.subjects[0]).toEqual({
      id: "X1",
      name: "",
      image: "",
      semester: "s3",
      semesterName: "Semester 3",
      resources: [],
    });
    expect(parseSheet([HEADER, "4,X2"].join("\n")).s4.subjects[0].name).toBe("");
  });

  it("skips rows without a semester or subject id", () => {
    const data = parseSheet(csv("1,A,Alpha,,,,", ",B,Beta,,,,", "1,,Gamma,,Notes,,", "s,C,Delta,,,,"));
    expect(Object.keys(data)).toEqual(["s1"]);
    expect(data.s1.subjects.map((s) => s.id)).toEqual(["A"]);
  });

  it("declares a subject with no resources when resource_name is empty", () => {
    expect(parseSheet(csv("1,A,Alpha,,,https://ignored,book")).s1.subjects[0].resources).toEqual([]);
  });

  it("keeps the first row's subject details when an id repeats", () => {
    const data = parseSheet(csv("1,A,First,img1,R1,u1,", "1,A,Second,img2,R2,u2,"));
    expect(data.s1.subjects).toHaveLength(1);
    expect(data.s1.subjects[0]).toMatchObject({ name: "First", image: "img1" });
    expect(data.s1.subjects[0].resources.map((r) => r.name)).toEqual(["R1", "R2"]);
  });

  it("keeps the same subject id in different semesters separate", () => {
    const data = parseSheet(csv("1,A,Alpha,,,,", "2,A,Alpha,,,,"));
    expect(data.s1.subjects).toHaveLength(1);
    expect(data.s2.subjects).toHaveLength(1);
  });

  it("defaults a blank resource_url to '#'", () => {
    expect(parseSheet(csv("1,A,Alpha,,Notes,,book")).s1.subjects[0].resources[0].url).toBe("#");
  });

  it("parses quoted cells containing commas and newlines", () => {
    const data = parseSheet(csv('1,A,"Signals, Systems",,"Notes\nPart 1",u,'));
    expect(data.s1.subjects[0].name).toBe("Signals, Systems");
    expect(data.s1.subjects[0].resources[0].name).toBe("Notes\nPart 1");
  });

  it("orders semesters numerically regardless of row order", () => {
    expect(Object.keys(parseSheet(csv("10,A,,,,,", "2,B,,,,,", "1,C,,,,,")))).toEqual(["s1", "s2", "s10"]);
  });

  it("keeps subjects in row order within a semester", () => {
    expect(parseSheet(csv("1,Z,,,,,", "1,A,,,,,", "1,M,,,,,")).s1.subjects.map((s) => s.id)).toEqual(["Z", "A", "M"]);
  });

  it("rejects a sheet with no usable rows", () => {
    expect(() => parseSheet(HEADER)).toThrow("Sheet returned no data");
    expect(() => parseSheet("")).toThrow("Sheet returned no data");
    expect(() => parseSheet(csv(",A,Alpha,,,,", "1,,Alpha,,,,"))).toThrow("Sheet returned no data");
  });

  it("rowsToSemesterData returns {} for no rows at all", () => {
    expect(rowsToSemesterData([])).toEqual({});
  });
});

describe("toResourceIcon", () => {
  it.each([
    ["book", "book"],
    ["BOOK", "book"],
    [" file ", "file"],
    ["download", "download"],
    ["Download", "download"],
    ["", "file"],
    ["video", "file"],
    // Previously ICONS["constructor"] returned Object.prototype.constructor. Fixed by the allow-list.
    ["constructor", "file"],
    ["__proto__", "file"],
  ])("maps %j to %j", (cell, expected) => {
    expect(toResourceIcon(cell)).toBe(expected);
  });
});

describe("fetchSheetCsv", () => {
  it("rejects without fetching when no URL is configured", async () => {
    const fetchMock = stubFetch(ok(""));
    await expect(fetchSheetCsv("")).rejects.toThrow("Sheet CSV URL is not set");
    await expect(fetchSheetCsv(undefined)).rejects.toThrow("Sheet CSV URL is not set");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches the URL with an abort signal and returns the body", async () => {
    const fetchMock = stubFetch(ok("a,b"));
    await expect(fetchSheetCsv(URL)).resolves.toBe("a,b");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(URL);
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("rejects with the HTTP status on a non-OK response", async () => {
    stubFetch(async () => new Response("nope", { status: 404 }));
    await expect(fetchSheetCsv(URL)).rejects.toThrow("Sheet fetch failed: 404");
  });

  it("propagates a fetch rejection", async () => {
    stubFetch(async () => { throw new TypeError("network down"); });
    await expect(fetchSheetCsv(URL)).rejects.toThrow("network down");
  });

  it("aborts the request after 8 seconds by default", async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | null | undefined;
    stubFetch((_url, init) => {
      signal = init?.signal;
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
      });
    });
    const assertion = expect(fetchSheetCsv(URL)).rejects.toThrow("aborted");
    await vi.advanceTimersByTimeAsync(7999);
    expect(signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(signal?.aborted).toBe(true);
    await assertion;
  });

  it("clears the timeout once the request settles", async () => {
    vi.useFakeTimers();
    const fetchMock = stubFetch(ok("x"));
    await fetchSheetCsv(URL);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(false);
  });
});

describe("browser cache (stale-while-revalidate)", () => {
  const seed = (csvText: string, timestamp = 1) => storage.setItem(CACHE_KEY, JSON.stringify({ csv: csvText, timestamp }));
  const cachedCsv = () => (JSON.parse(storage.getItem(CACHE_KEY) ?? "null") as { csv: string } | null)?.csv;

  it("fetchSemesterData stores the raw CSV and a timestamp", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1234);
    const text = csv("1,A,Alpha,,,,");
    stubFetch(ok(text));
    await fetchSemesterData(URL);
    expect(JSON.parse(storage.getItem(CACHE_KEY) ?? "null")).toEqual({ csv: text, timestamp: 1234 });
  });

  it("does not cache a sheet that parses to nothing", async () => {
    seed(csv("1,OLD,Old,,,,"));
    stubFetch(ok(HEADER));
    await expect(fetchSemesterData(URL)).rejects.toThrow("Sheet returned no data");
    expect(cachedCsv()).toBe(csv("1,OLD,Old,,,,"));
  });

  it("readCachedSheet returns parsed data and the timestamp", () => {
    seed(csv("1,OLD,Old,,,,"), 42);
    const cached = readCachedSheet();
    expect(cached?.timestamp).toBe(42);
    expect(cached?.data.s1.subjects[0].id).toBe("OLD");
  });

  it.each([
    ["missing", null],
    ["not JSON", "{oops"],
    ["the wrong shape", JSON.stringify({ csv: 5 })],
    ["an empty sheet", JSON.stringify({ csv: "semester,subject_id", timestamp: 1 })],
  ])("readCachedSheet ignores an entry that is %s", (_label, raw) => {
    if (raw !== null) storage.setItem(CACHE_KEY, raw);
    expect(readCachedSheet()).toBeNull();
  });

  it("works when localStorage throws on every access", async () => {
    vi.stubGlobal("localStorage", {
      getItem: () => { throw new DOMException("blocked", "SecurityError"); },
      setItem: () => { throw new DOMException("blocked", "SecurityError"); },
    });
    stubFetch(ok(csv("1,A,Alpha,,,,")));
    expect(readCachedSheet()).toBeNull();
    await expect(fetchSemesterData(URL)).resolves.toMatchObject({ s1: expect.any(Object) });
  });

  describe("refreshSemesterData", () => {
    it("shows a cache newer than the build at once, then the fresh fetch", async () => {
      seed(csv("1,CACHED,Cached,,,,"), 200);
      let release: (r: Response) => void = () => {};
      stubFetch(() => new Promise<Response>((resolve) => { release = resolve; }));
      const onUpdate = vi.fn();
      refreshSemesterData({ url: URL, builtAt: 100, onUpdate });
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate.mock.calls[0][0].s1.subjects[0].id).toBe("CACHED");

      release(new Response(csv("1,FRESH,Fresh,,,,"), { status: 200 }));
      await vi.waitFor(() => expect(onUpdate).toHaveBeenCalledTimes(2));
      expect(onUpdate.mock.calls[1][0].s1.subjects[0].id).toBe("FRESH");
      expect(cachedCsv()).toBe(csv("1,FRESH,Fresh,,,,"));
    });

    it("ignores a cache older than the build", async () => {
      seed(csv("1,STALE,Stale,,,,"), 50);
      stubFetch(() => new Promise<Response>(() => {}));
      const onUpdate = vi.fn();
      refreshSemesterData({ url: URL, builtAt: 100, onUpdate });
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it("logs and otherwise ignores a failed refresh", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      stubFetch(async () => { throw new TypeError("offline"); });
      const onUpdate = vi.fn();
      refreshSemesterData({ url: URL, builtAt: 0, onUpdate });
      await vi.waitFor(() => expect(warn).toHaveBeenCalled());
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it("does not fetch without a URL", () => {
      const fetchMock = stubFetch(ok(""));
      refreshSemesterData({ url: undefined, builtAt: 0, onUpdate: vi.fn() });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("stops calling onUpdate once cancelled", async () => {
      let release: (r: Response) => void = () => {};
      stubFetch(() => new Promise<Response>((resolve) => { release = resolve; }));
      const onUpdate = vi.fn();
      const cancel = refreshSemesterData({ url: URL, builtAt: 0, onUpdate });
      cancel();
      release(new Response(csv("1,A,Alpha,,,,"), { status: 200 }));
      await new Promise((r) => setTimeout(r, 0));
      expect(onUpdate).not.toHaveBeenCalled();
    });
  });
});
