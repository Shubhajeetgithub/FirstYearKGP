import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BookOpen, Download, FileText } from "lucide-react";

const URL = "https://example.test/sheet.csv";
const HEADER = "semester,subject_id,subject_name,subject_image,resource_name,resource_url,icon";

// SHEET_CSV_URL is read once at module load, so each test imports a fresh copy.
interface LoadOptions {
  env?: string;
  response?: Response;
}

async function load(csv: string, { env = URL, response }: LoadOptions = {}) {
  vi.stubEnv("VITE_SHEET_CSV_URL", env);
  const fetchMock = vi.fn<typeof fetch>(async () => response ?? new Response(csv, { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.resetModules();
  const { loadSemesterData } = await import("./loadSemesterData");
  return { result: loadSemesterData(), fetchMock };
}

const csv = (...rows: string[]) => [HEADER, ...rows].join("\n");

beforeEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("loadSemesterData", () => {
  describe("configuration and fetch errors", () => {
    it("rejects when VITE_SHEET_CSV_URL is empty, without fetching", async () => {
      const { result, fetchMock } = await load(csv("1,A,Alpha,,,,"), { env: "" });
      await expect(result).rejects.toThrow("VITE_SHEET_CSV_URL is not set");
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("fetches the configured URL with an abort signal", async () => {
      const { result, fetchMock } = await load(csv("1,A,Alpha,,,,"));
      await result;
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(URL);
      expect(init?.signal).toBeInstanceOf(AbortSignal);
    });

    it("rejects with the HTTP status on a non-OK response", async () => {
      const { result } = await load("", { response: new Response("nope", { status: 404 }) });
      await expect(result).rejects.toThrow("Sheet fetch failed: 404");
    });

    it("rejects when the sheet yields no semesters", async () => {
      await expect((await load(HEADER)).result).rejects.toThrow("Sheet returned no data");
      await expect((await load(csv(",A,Alpha,,,,", "1,,Alpha,,,,"))).result).rejects.toThrow(
        "Sheet returned no data"
      );
    });

    it("rejects when the body is completely empty", async () => {
      // csvParseRows("") is [], so there is no header row to destructure.
      await expect((await load("")).result).rejects.toThrow();
    });

    it("propagates a fetch rejection", async () => {
      vi.stubEnv("VITE_SHEET_CSV_URL", URL);
      vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("network down"); }));
      vi.resetModules();
      const { loadSemesterData } = await import("./loadSemesterData");
      await expect(loadSemesterData()).rejects.toThrow("network down");
    });

    it("aborts the request after 8 seconds", async () => {
      vi.useFakeTimers();
      vi.stubEnv("VITE_SHEET_CSV_URL", URL);
      let signal: AbortSignal | null | undefined;
      vi.stubGlobal(
        "fetch",
        vi.fn((_url: RequestInfo | URL, init?: RequestInit) => {
          signal = init?.signal;
          return new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
          });
        })
      );
      vi.resetModules();
      const { loadSemesterData } = await import("./loadSemesterData");
      const result = loadSemesterData();
      const assertion = expect(result).rejects.toThrow("aborted");
      await vi.advanceTimersByTimeAsync(7999);
      expect(signal?.aborted).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      expect(signal?.aborted).toBe(true);
      await assertion;
    });

    it("clears the timeout once the request settles", async () => {
      vi.useFakeTimers();
      const { result, fetchMock } = await load(csv("1,A,Alpha,,,,"));
      await result;
      await vi.advanceTimersByTimeAsync(10_000);
      expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(false);
    });
  });

  describe("parsing", () => {
    it("builds semesters, subjects and resources", async () => {
      const data = await (await load(csv(
        "1,MA11001,Calculus,https://img/calc.png,Notes,https://r/notes,book",
        "1,MA11001,Calculus,https://img/calc.png,Slides,https://r/slides,download",
      ))).result;
      expect(data).toEqual({
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
                { name: "Notes", url: "https://r/notes", icon: BookOpen },
                { name: "Slides", url: "https://r/slides", icon: Download },
              ],
            },
          ],
        },
      });
    });

    it("accepts the semester as '1', 's1' or 'S1'", async () => {
      const data = await (await load(csv("1,A,Alpha,,,,", "s1,B,Beta,,,,", "S1,C,Gamma,,,,"))).result;
      expect(Object.keys(data)).toEqual(["s1"]);
      expect(data.s1.subjects.map((s) => s.id)).toEqual(["A", "B", "C"]);
    });

    it("only strips a single leading 's'", async () => {
      const data = await (await load(csv("ss2,A,Alpha,,,,"))).result;
      expect(Object.keys(data)).toEqual(["ss2"]);
      expect(data.ss2.name).toBe("Semester s2");
    });

    it("treats '01' and '1' as different semesters", async () => {
      const data = await (await load(csv("1,A,Alpha,,,,", "01,B,Beta,,,,"))).result;
      expect(Object.keys(data).sort()).toEqual(["s01", "s1"]);
    });

    it("trims cells and matches headers case-insensitively, in any column order", async () => {
      const text = [
        " ICON , Resource_URL,resource_name ,subject_image,Subject_Name,SUBJECT_ID,Semester",
        " book , https://r/x , Notes , https://img , Calculus , MA1 , 2 ",
      ].join("\n");
      const data = await (await load(text)).result;
      expect(data.s2.subjects[0]).toEqual({
        id: "MA1",
        name: "Calculus",
        image: "https://img",
        semester: "s2",
        semesterName: "Semester 2",
        resources: [{ name: "Notes", url: "https://r/x", icon: BookOpen }],
      });
    });

    it("treats missing columns and short rows as empty strings", async () => {
      const text = ["semester,subject_id", "3,X1"].join("\n");
      const data = await (await load(text)).result;
      expect(data.s3.subjects[0]).toEqual({
        id: "X1",
        name: "",
        image: "",
        semester: "s3",
        semesterName: "Semester 3",
        resources: [],
      });
      const short = await (await load([HEADER, "4,X2"].join("\n"))).result;
      expect(short.s4.subjects[0].name).toBe("");
    });

    it("skips rows without a semester or subject id", async () => {
      const data = await (await load(csv("1,A,Alpha,,,,", ",B,Beta,,,,", "1,,Gamma,,Notes,,", "s,C,Delta,,,,"))).result;
      expect(data).toEqual({ s1: expect.any(Object) });
      expect(data.s1.subjects.map((s) => s.id)).toEqual(["A"]);
    });

    it("declares a subject with no resources when resource_name is empty", async () => {
      const data = await (await load(csv("1,A,Alpha,,,https://ignored,book"))).result;
      expect(data.s1.subjects[0].resources).toEqual([]);
    });

    it("keeps the first row's subject details when an id repeats", async () => {
      const data = await (await load(csv("1,A,First,img1,R1,u1,", "1,A,Second,img2,R2,u2,"))).result;
      expect(data.s1.subjects).toHaveLength(1);
      expect(data.s1.subjects[0]).toMatchObject({ name: "First", image: "img1" });
      expect(data.s1.subjects[0].resources.map((r) => r.name)).toEqual(["R1", "R2"]);
    });

    it("keeps the same subject id in different semesters separate", async () => {
      const data = await (await load(csv("1,A,Alpha,,,,", "2,A,Alpha,,,,"))).result;
      expect(data.s1.subjects).toHaveLength(1);
      expect(data.s2.subjects).toHaveLength(1);
    });

    it("defaults a blank resource_url to '#'", async () => {
      const data = await (await load(csv("1,A,Alpha,,Notes,,book"))).result;
      expect(data.s1.subjects[0].resources[0].url).toBe("#");
    });

    it.each([
      ["book", BookOpen],
      ["BOOK", BookOpen],
      ["file", FileText],
      ["download", Download],
      ["Download", Download],
      ["", FileText],
      ["video", FileText],
    ])("maps icon %j to the right component", async (icon, expected) => {
      const data = await (await load(csv(`1,A,Alpha,,Notes,u,${icon}`))).result;
      expect(data.s1.subjects[0].resources[0].icon).toBe(expected);
    });

    it("parses quoted cells containing commas and newlines", async () => {
      const data = await (await load(csv('1,A,"Signals, Systems",,"Notes\nPart 1",u,'))).result;
      expect(data.s1.subjects[0].name).toBe("Signals, Systems");
      expect(data.s1.subjects[0].resources[0].name).toBe("Notes\nPart 1");
    });

    it("orders semesters numerically regardless of row order", async () => {
      const data = await (await load(csv("10,A,,,,,", "2,B,,,,,", "1,C,,,,,"))).result;
      expect(Object.keys(data)).toEqual(["s1", "s2", "s10"]);
    });

    it("keeps subjects in row order within a semester", async () => {
      const data = await (await load(csv("1,Z,,,,,", "1,A,,,,,", "1,M,,,,,"))).result;
      expect(data.s1.subjects.map((s) => s.id)).toEqual(["Z", "A", "M"]);
    });
  });

  // Documents current behaviour that looks unintended. Not fixed during the TypeScript migration.
  describe("known bugs (documented, not fixed)", () => {
    it("BUG: an icon name that is an Object.prototype key returns that inherited member", async () => {
      // `ICONS[name] ?? FileText` finds Object.prototype.constructor for "constructor",
      // so the resource's icon is the global `Object` instead of the FileText fallback.
      const data = await (await load(csv("1,A,Alpha,,Notes,u,constructor"))).result;
      expect(data.s1.subjects[0].resources[0].icon).toBe(Object);
    });
  });
});
