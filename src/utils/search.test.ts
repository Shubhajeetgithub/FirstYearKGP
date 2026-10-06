import { describe, it, expect } from "vitest";
import {
  levenshteinDistance,
  getSubjectAcronyms,
  calculateSubjectDistance,
  extractAllSubjects,
  searchSubjects,
  wordMatchIndex,
} from "./search";
import type { SearchableSemesterMap, SearchableSubject } from "../types/search";

/**
 * Lets a test pass a value the type system rejects, to pin down how the search behaves for
 * plain-JS callers and malformed data. Test-only.
 */
function untyped<T>(value: unknown): T {
  return value as T;
}

/** Fails the test the same way the JS version did (a TypeError) if `value` is missing. */
function defined<T>(value: T | undefined): T {
  if (value === undefined) throw new TypeError("expected a value, got undefined");
  return value;
}

const SUBJECTS = [
  { id: "MA11001", name: "Advanced Calculus" },
  { id: "CS21002", name: "Design and Analysis of Algorithms" },
  { id: "CS31003", name: "Reinforcement Learning" },
  { id: "PH11001", name: "Physics of Waves" },
  { id: "EE11002", name: "Basic Electronics" },
];

const SEMESTER_DATA = {
  s1: {
    name: "Semester One",
    subjects: [
      { id: "MA11001", name: "Advanced Calculus" },
      { id: "PH11001", name: "Physics of Waves", semester: "custom" },
    ],
  },
  s2: {
    subjects: [{ id: "CS21002", name: "Design and Analysis of Algorithms", semesterName: "Custom Name" }],
  },
};

describe("levenshteinDistance", () => {
  it.each([
    ["", "", 0],
    ["abc", "", 3],
    ["", "abc", 3],
    ["abc", "abc", 0],
    ["kitten", "sitting", 3],
    ["flaw", "lawn", 2],
    ["saturday", "sunday", 3],
    ["a", "b", 1],
    ["ab", "ba", 2], // transposition costs 2 (no Damerau)
    ["abc", "abcd", 1],
    ["abc", "xabc", 1],
  ])("distance(%j, %j) === %i", (a, b, expected) => {
    expect(levenshteinDistance(a, b)).toBe(expected);
  });

  it("is symmetric", () => {
    const pairs = [["kitten", "sitting"], ["algorithms", "algo"], ["", "xyz"], ["abc", "cba"]];
    for (const [a, b] of pairs) {
      expect(levenshteinDistance(a, b)).toBe(levenshteinDistance(b, a));
    }
  });

  it("satisfies the triangle inequality", () => {
    const words = ["", "a", "ab", "abc", "bca", "kitten", "sitten", "sitting"];
    for (const a of words)
      for (const b of words)
        for (const c of words) {
          expect(levenshteinDistance(a, c)).toBeLessThanOrEqual(
            levenshteinDistance(a, b) + levenshteinDistance(b, c)
          );
        }
  });

  it("is bounded by the longer string's length and at least the length difference", () => {
    const a = "calculus";
    const b = "algebra";
    const d = levenshteinDistance(a, b);
    expect(d).toBeLessThanOrEqual(Math.max(a.length, b.length));
    expect(d).toBeGreaterThanOrEqual(Math.abs(a.length - b.length));
  });

  it("is case-sensitive", () => {
    expect(levenshteinDistance("ABC", "abc")).toBe(3);
  });

  it("handles missing arguments via defaults", () => {
    expect(levenshteinDistance()).toBe(0);
    expect(levenshteinDistance("abc")).toBe(3);
    expect(levenshteinDistance(undefined, "ab")).toBe(2);
  });

  it("coerces non-string input to strings", () => {
    expect(levenshteinDistance(untyped(123), "123")).toBe(0);
    expect(levenshteinDistance(untyped(12), untyped(13))).toBe(1);
    expect(levenshteinDistance(untyped(null), "ab")).toBe(levenshteinDistance("null", "ab"));
  });

  it("handles repeated characters and long strings", () => {
    expect(levenshteinDistance("a".repeat(500), "a".repeat(500))).toBe(0);
    expect(levenshteinDistance("a".repeat(500), "b".repeat(500))).toBe(500);
    expect(levenshteinDistance("a".repeat(300), "a".repeat(100))).toBe(200);
  });

  it("handles unicode within the BMP", () => {
    expect(levenshteinDistance("café", "cafe")).toBe(1);
    expect(levenshteinDistance("日本語", "日本")).toBe(1);
  });

  it("handles whitespace as ordinary characters", () => {
    expect(levenshteinDistance("a b", "ab")).toBe(1);
    expect(levenshteinDistance(" ", "")).toBe(1);
  });
});

describe("getSubjectAcronyms", () => {
  it("returns [] for empty / missing / whitespace-only / nullish input", () => {
    expect(getSubjectAcronyms()).toEqual([]);
    expect(getSubjectAcronyms("")).toEqual([]);
    expect(getSubjectAcronyms("   ")).toEqual([]);
    expect(getSubjectAcronyms(untyped(null))).toEqual([]);
    expect(getSubjectAcronyms(" - _ / ")).toEqual([]);
  });

  it("returns a single acronym when no stop words are present", () => {
    expect(getSubjectAcronyms("Reinforcement Learning")).toEqual(["rl"]);
  });

  it("returns both full and significant-word acronyms when stop words are present", () => {
    expect(getSubjectAcronyms("Design and Analysis of Algorithms")).toEqual(["daaoa", "daa"]);
  });

  it("deduplicates identical acronyms", () => {
    expect(getSubjectAcronyms("Machine Learning")).toHaveLength(1);
  });

  it("is case-insensitive (output is lowercased)", () => {
    expect(getSubjectAcronyms("MACHINE LEARNING")).toEqual(["ml"]);
  });

  it("splits on hyphens, underscores, slashes and runs of whitespace", () => {
    expect(getSubjectAcronyms("Signals-and-Systems")).toEqual(["sas", "ss"]);
    expect(getSubjectAcronyms("Data_Structures/Algorithms")).toEqual(["dsa"]);
    expect(getSubjectAcronyms("Machine    Learning")).toEqual(["ml"]);
  });

  it("works for a single word", () => {
    expect(getSubjectAcronyms("Calculus")).toEqual(["c"]);
  });

  it("omits all-stop-word names from the significant acronym", () => {
    expect(getSubjectAcronyms("The A")).toEqual(["ta"]);
  });

  it("treats '&' as a stop word", () => {
    expect(getSubjectAcronyms("Research & Development")).toEqual(["r&d", "rd"]);
  });

  it("coerces non-string input", () => {
    expect(getSubjectAcronyms(untyped(42))).toEqual(["4"]);
  });
});

describe("calculateSubjectDistance", () => {
  const algo = { id: "CS21002", name: "Design and Analysis of Algorithms" };
  const rl = { id: "CS31003", name: "Reinforcement Learning" };

  describe("empty queries", () => {
    it.each([[""], ["   "], [undefined], [null]])("query %j yields Infinity", (q) => {
      expect(calculateSubjectDistance(untyped(q), algo)).toEqual({ distance: Infinity, matchedOn: "name" });
    });
  });

  describe("name matching", () => {
    it("gives 0 for an exact name match (case-insensitive)", () => {
      expect(calculateSubjectDistance("REINFORCEMENT learning", rl).distance).toBe(0);
    });

    it("trims the query", () => {
      expect(calculateSubjectDistance("  reinforcement learning  ", rl).distance).toBe(0);
    });

    it("gives 0 for a prefix of the name", () => {
      expect(calculateSubjectDistance("reinf", rl).distance).toBe(0);
    });

    it("gives 0.5 for a non-prefix substring of the name", () => {
      expect(calculateSubjectDistance("learn", rl).distance).toBe(0.5);
    });

    it("matches a single word of the name by word-level edit distance", () => {
      // "algorthms" is 1 edit from "algorithms" and a typo, so not a substring
      const r = calculateSubjectDistance("algorthms", algo);
      expect(r.distance).toBe(1);
      expect(r.matchedOn).toBe("name");
    });

    it("tolerates typos in full names", () => {
      const r = calculateSubjectDistance("reinforcment learning", rl);
      expect(r.distance).toBe(1);
      expect(r.matchedOn).toBe("name");
    });

    it("reports matchedOn 'name' when only the name matches and id is unrelated", () => {
      const r = calculateSubjectDistance("calculus", { id: "ZZ99999", name: "Advanced Calculus" });
      expect(r.matchedOn).toBe("name");
      expect(r.distance).toBe(0); // "calculus" equals a whole word of the name
    });

    it("reports matchedOn 'name' for a name prefix match when the id is unrelated", () => {
      const r = calculateSubjectDistance("calc", { id: "MA11001", name: "Calculus" });
      expect(r.matchedOn).toBe("name");
      expect(r.distance).toBe(0);
    });
  });

  describe("id matching", () => {
    it("gives 0 for an exact id match (case-insensitive)", () => {
      const r = calculateSubjectDistance("cs21002", algo);
      expect(r).toEqual({ distance: 0, matchedOn: "id" });
    });

    it("gives 0 for an id prefix", () => {
      expect(calculateSubjectDistance("CS21", algo)).toEqual({ distance: 0, matchedOn: "id" });
    });

    it("gives 0.5 for a non-prefix id substring", () => {
      expect(calculateSubjectDistance("1002", algo)).toEqual({ distance: 0.5, matchedOn: "id" });
    });

    it("tolerates a typo in the id", () => {
      expect(calculateSubjectDistance("cs21003", algo)).toEqual({ distance: 1, matchedOn: "id" });
    });
  });

  describe("acronym matching", () => {
    it("matches the significant-word acronym exactly", () => {
      expect(calculateSubjectDistance("daa", algo)).toEqual({ distance: 0, matchedOn: "acronym" });
    });

    it("matches the full-initials acronym exactly", () => {
      expect(calculateSubjectDistance("daaoa", algo)).toEqual({ distance: 0, matchedOn: "acronym" });
    });

    it("matches simple acronyms", () => {
      expect(calculateSubjectDistance("rl", rl)).toEqual({ distance: 0, matchedOn: "acronym" });
    });

    it("tolerates a typo in the acronym", () => {
      const r = calculateSubjectDistance("dab", algo);
      expect(r.distance).toBe(1);
    });

    it("does not report acronym when considerAcronyms is false", () => {
      const r = calculateSubjectDistance("rl", rl, { considerAcronyms: false });
      expect(r.matchedOn).not.toBe("acronym");
      expect(r.distance).toBeGreaterThan(0);
    });

    it("acronym distance is never smaller with considerAcronyms=false", () => {
      for (const q of ["daa", "rl", "calc", "xyz"]) {
        for (const s of SUBJECTS) {
          const on = calculateSubjectDistance(q, s).distance;
          const off = calculateSubjectDistance(q, s, { considerAcronyms: false }).distance;
          expect(off).toBeGreaterThanOrEqual(on);
        }
      }
    });

    it("defaults considerAcronyms to true when options omitted or empty", () => {
      expect(calculateSubjectDistance("rl", rl)).toEqual(calculateSubjectDistance("rl", rl, {}));
      expect(calculateSubjectDistance("rl", rl).matchedOn).toBe("acronym");
    });

    it("prefers name/id when they tie with acronym", () => {
      // "ml" is a prefix of the id "ml101" (distance 0) and also the acronym of "Machine Learning"
      const r = calculateSubjectDistance("ml", { id: "ML101", name: "Machine Learning" });
      expect(r.distance).toBe(0);
      expect(r.matchedOn).toBe("id");
    });
  });

  describe("malformed subjects", () => {
    it("handles a subject with no id", () => {
      const r = calculateSubjectDistance("calculus", { name: "Calculus" });
      expect(r.distance).toBe(0);
    });

    it("handles a subject with no name", () => {
      const r = calculateSubjectDistance("ma110", { id: "MA11001" });
      expect(r).toEqual({ distance: 0, matchedOn: "id" });
    });

    it("handles an empty subject object without throwing", () => {
      const r = calculateSubjectDistance("abc", {});
      expect(r.distance).toBe(3);
    });

    it("handles null name / id", () => {
      expect(() => calculateSubjectDistance("abc", { id: null, name: null })).not.toThrow();
    });

    it("throws on a null subject (documents current behaviour)", () => {
      expect(() => calculateSubjectDistance("abc", untyped(null))).toThrow();
    });
  });

  describe("invariants", () => {
    it("returns a non-negative distance and valid matchedOn for assorted queries", () => {
      for (const q of ["a", "calc", "ma", "xyz", "design analysis", "1", "waves of physics"]) {
        for (const s of SUBJECTS) {
          const { distance, matchedOn } = calculateSubjectDistance(q, s);
          expect(distance).toBeGreaterThanOrEqual(0);
          expect(Number.isFinite(distance)).toBe(true);
          expect(["id", "name", "acronym"]).toContain(matchedOn);
        }
      }
    });

    it("is case-insensitive in the query", () => {
      for (const s of SUBJECTS) {
        expect(calculateSubjectDistance("CALC", s)).toEqual(calculateSubjectDistance("calc", s));
      }
    });
  });
});

describe("extractAllSubjects", () => {
  it("returns [] for nullish input", () => {
    expect(extractAllSubjects()).toEqual([]);
    expect(extractAllSubjects(null)).toEqual([]);
    expect(extractAllSubjects(undefined)).toEqual([]);
  });

  it("returns the same array reference when given an array", () => {
    expect(extractAllSubjects(SUBJECTS)).toBe(SUBJECTS);
  });

  it("flattens a semester map and annotates semester info", () => {
    const out = extractAllSubjects(SEMESTER_DATA);
    expect(out).toHaveLength(3);
    expect(out[0]).toEqual({ id: "MA11001", name: "Advanced Calculus", semester: "s1", semesterName: "Semester One" });
  });

  it("preserves a subject's own semester / semesterName", () => {
    const out = extractAllSubjects(SEMESTER_DATA);
    expect(out[1].semester).toBe("custom");
    expect(out[2].semesterName).toBe("Custom Name");
  });

  it("falls back to 'Semester N' when the semester has no name", () => {
    const out = extractAllSubjects(SEMESTER_DATA);
    expect(out[2].semester).toBe("s2");
    // subject-level name overrides, so check the fallback separately
    const out2 = extractAllSubjects({ s3: { subjects: [{ id: "X" }] } });
    expect(out2[0].semesterName).toBe("Semester 3");
    const out3 = extractAllSubjects({ S4: { subjects: [{ id: "X" }] } });
    expect(out3[0].semesterName).toBe("Semester 4");
  });

  it("only strips a leading 's' when computing the fallback name", () => {
    const out = extractAllSubjects({ summer: { subjects: [{ id: "X" }] } });
    expect(out[0].semesterName).toBe("Semester ummer");
  });

  it("skips entries without a subjects array", () => {
    const out = extractAllSubjects(untyped<SearchableSemesterMap<SearchableSubject>>({
      s1: null,
      s2: {},
      s3: { subjects: "nope" },
      s4: { subjects: { id: "x" } },
      s5: { subjects: [{ id: "OK" }] },
    }));
    expect(out.map((s) => s.id)).toEqual(["OK"]);
  });

  it("does not mutate the input", () => {
    const input = JSON.parse(JSON.stringify(SEMESTER_DATA));
    extractAllSubjects(input);
    expect(input).toEqual(SEMESTER_DATA);
  });

  it("returns [] for an empty object", () => {
    expect(extractAllSubjects({})).toEqual([]);
  });
});

describe("searchSubjects", () => {
  describe("input handling", () => {
    it.each([[""], ["   "], [undefined], [null]])("returns [] for empty query %j", (q) => {
      expect(searchSubjects(untyped(q), SUBJECTS)).toEqual([]);
    });

    it("returns [] for empty / missing source", () => {
      expect(searchSubjects("calc", [])).toEqual([]);
      expect(searchSubjects("calc", null)).toEqual([]);
      expect(searchSubjects("calc", undefined)).toEqual([]);
      expect(searchSubjects("calc", {})).toEqual([]);
    });

    it("accepts both array and semester-map sources", () => {
      expect(searchSubjects("calculus", SUBJECTS)[0].id).toBe("MA11001");
      expect(searchSubjects("calculus", SEMESTER_DATA)[0].id).toBe("MA11001");
    });

    it("carries semester metadata through for semester-map sources", () => {
      const [top] = searchSubjects("calculus", SEMESTER_DATA);
      expect(top.semester).toBe("s1");
      expect(top.semesterName).toBe("Semester One");
    });
  });

  describe("ranking", () => {
    it("ranks an exact name match first", () => {
      expect(searchSubjects("Basic Electronics", SUBJECTS)[0].id).toBe("EE11002");
    });

    it("ranks by id", () => {
      const [top] = searchSubjects("CS31003", SUBJECTS);
      expect(top.id).toBe("CS31003");
      expect(top._distance).toBe(0);
      expect(top._matchedOn).toBe("id");
    });

    it("finds subjects by acronym", () => {
      const [top] = searchSubjects("daa", SUBJECTS);
      expect(top.id).toBe("CS21002");
      expect(top._matchedOn).toBe("acronym");
    });

    it("finds subjects by a single word of the name", () => {
      expect(searchSubjects("algorithms", SUBJECTS)[0].id).toBe("CS21002");
    });

    it("finds subjects despite typos", () => {
      expect(searchSubjects("calclus", SUBJECTS)[0].id).toBe("MA11001");
      expect(searchSubjects("electronis", SUBJECTS)[0].id).toBe("EE11002");
    });

    it("is case-insensitive and trims whitespace", () => {
      expect(searchSubjects("  CALCULUS ", SUBJECTS)).toEqual(searchSubjects("calculus", SUBJECTS));
    });

    it("sorts results by ascending distance", () => {
      const res = searchSubjects("physics", SUBJECTS, 10);
      for (let i = 1; i < res.length; i++) {
        expect(res[i]._distance).toBeGreaterThanOrEqual(res[i - 1]._distance);
      }
    });

    it("breaks ties alphabetically by name", () => {
      const subjects = [
        { id: "3", name: "Zebra Studies" },
        { id: "1", name: "Alpha Studies" },
        { id: "2", name: "Mango Studies" },
      ];
      // "studies" matches each as a non-prefix word equally
      const res = searchSubjects("studies", subjects, 10);
      expect(res.map((r) => r.name)).toEqual(["Alpha Studies", "Mango Studies", "Zebra Studies"]);
    });

    it("breaks ties with missing names without throwing", () => {
      const subjects = [{ id: "b" }, { id: "a", name: "Named" }];
      expect(() => searchSubjects("zzz", subjects, 10)).not.toThrow();
    });
  });

  describe("limit", () => {
    it("defaults to 3 results", () => {
      expect(searchSubjects("a", SUBJECTS)).toHaveLength(3);
    });

    it("respects a custom limit", () => {
      expect(searchSubjects("a", SUBJECTS, 1)).toHaveLength(1);
      expect(searchSubjects("a", SUBJECTS, 5)).toHaveLength(5);
    });

    it("returns everything when limit exceeds the number of subjects", () => {
      expect(searchSubjects("a", SUBJECTS, 100)).toHaveLength(SUBJECTS.length);
    });

    it("returns [] for limit 0", () => {
      expect(searchSubjects("a", SUBJECTS, 0)).toEqual([]);
    });
  });

  describe("result shape", () => {
    it("adds _distance and _matchedOn while preserving original fields", () => {
      const [top] = searchSubjects("calculus", SUBJECTS);
      expect(top).toMatchObject({ id: "MA11001", name: "Advanced Calculus" });
      expect(typeof top._distance).toBe("number");
      expect(["id", "name", "acronym"]).toContain(top._matchedOn);
    });

    it("does not mutate the input subjects", () => {
      const copy = JSON.parse(JSON.stringify(SUBJECTS));
      searchSubjects("calculus", SUBJECTS, 10);
      expect(SUBJECTS).toEqual(copy);
      expect(SUBJECTS[0]).not.toHaveProperty("_distance");
    });

    it("returns new objects, not the originals", () => {
      const [top] = searchSubjects("calculus", SUBJECTS);
      expect(SUBJECTS).not.toContain(top);
    });
  });

  describe("deduplication", () => {
    it("keeps only the first subject per id", () => {
      const subjects = [
        { id: "X1", name: "First Copy" },
        { id: "X1", name: "Second Copy" },
        { id: "Y2", name: "Other" },
      ];
      const res = searchSubjects("copy", subjects, 10);
      expect(res.filter((r) => r.id === "X1")).toHaveLength(1);
      expect(defined(res.find((r) => r.id === "X1")).name).toBe("First Copy");
    });

    it("drops subjects that have no id (documents current behaviour)", () => {
      const subjects = [{ name: "No Id" }, { id: "A1", name: "Has Id" }];
      const res = searchSubjects("id", subjects, 10);
      expect(res.map((r) => r.id)).toEqual(["A1"]);
    });

    it("dedupes across semesters in a semester map", () => {
      const data = {
        s1: { subjects: [{ id: "C1", name: "Shared Course" }] },
        s2: { subjects: [{ id: "C1", name: "Shared Course" }] },
      };
      const res = searchSubjects("shared", data, 10);
      expect(res).toHaveLength(1);
      expect(res[0].semester).toBe("s1");
    });
  });

  describe("options", () => {
    it("passes considerAcronyms through to scoring", () => {
      const withAcr = searchSubjects("rl", SUBJECTS, 1)[0];
      expect(withAcr.id).toBe("CS31003");
      expect(withAcr._matchedOn).toBe("acronym");
      expect(withAcr._distance).toBe(0);

      const withoutAcr = searchSubjects("rl", SUBJECTS, 5, { considerAcronyms: false });
      const rlResult = defined(withoutAcr.find((r) => r.id === "CS31003"));
      expect(rlResult._matchedOn).not.toBe("acronym");
      expect(rlResult._distance).toBeGreaterThan(0);
    });
  });

  describe("realistic queries", () => {
    it.each([
      ["calc", "MA11001"],
      ["wave", "PH11001"],
      ["ee11002", "EE11002"],
      ["rl", "CS31003"],
      ["daa", "CS21002"],
      ["reinforcement", "CS31003"],
    ])("query %j ranks %s first", (q, id) => {
      expect(searchSubjects(q, SUBJECTS)[0].id).toBe(id);
    });
  });
});

/* -------------------------------------------------------------------------- */
/* Additional tests: gaps found by mutation testing, and probes for real bugs */
/* -------------------------------------------------------------------------- */

describe("getSubjectAcronyms: every stop word is skipped in the significant acronym", () => {
  it.each(["and", "of", "in", "to", "for", "the", "a", "an", "with", "on", "at", "&"])(
    "stop word %j",
    (w) => {
      expect(getSubjectAcronyms(`Alpha ${w} Beta`)).toEqual([`a${w[0]}b`, "ab"]);
    }
  );

  it("treats stop words case-insensitively", () => {
    expect(getSubjectAcronyms("Alpha AND Beta")).toEqual(["aab", "ab"]);
  });
});

describe("calculateSubjectDistance: word splitting and trimming", () => {
  const far = "ZZZZZZZZZZ";
  it.each([
    ["hyphen", "Signals-Systems", "systems"],
    ["underscore", "Data_Science", "science"],
    ["slash", "Input/Output", "output"],
    ["space", "Input Output", "output"],
  ])("matches a whole word after a %s separator with distance 0", (_n, name, q) => {
    expect(calculateSubjectDistance(q, { id: far, name }).distance).toBe(0);
  });

  it("trims whitespace around the subject name", () => {
    expect(calculateSubjectDistance("abc def", { id: far, name: "  abc def  " }).distance).toBe(0);
  });

  it("trims whitespace around the subject id", () => {
    expect(calculateSubjectDistance("ma101", { id: "  MA101  ", name: "Zzzzzzzzzzzzzzzzz" }).distance).toBe(0);
  });

  it("is case-insensitive for the id", () => {
    expect(calculateSubjectDistance("MA101", { id: "ma101", name: "Zzzzzzzzzzzzzzzzz" }).distance).toBe(0);
  });
});

describe("calculateSubjectDistance: tie-breaking between acronym, id and name", () => {
  it("prefers id over acronym when both score equally and name is worse", () => {
    // id "ML1" is 1 edit from "mlx"; acronym "ml" is also 1 edit; name is far away.
    const r = calculateSubjectDistance("mlx", { id: "ML1", name: "Machine Learning" });
    expect(r).toEqual({ distance: 1, matchedOn: "id" });
  });

  it("prefers name over acronym when both score equally and id is worse", () => {
    // word "mlq" is 1 edit from "mlx"; acronym "ml" is also 1 edit; id is far away.
    const r = calculateSubjectDistance("mlx", { id: "ZZZZZZZZZZ", name: "Mlq Lx" });
    expect(r).toEqual({ distance: 1, matchedOn: "name" });
  });

  it("uses acronym only when strictly better than both name and id", () => {
    const r = calculateSubjectDistance("mlx", { id: "ZZZZZZZZZZ", name: "Machine Learning Xtra" });
    expect(r.matchedOn).toBe("acronym");
    expect(r.distance).toBe(0);
  });
});

describe("extractAllSubjects: semester name fallback", () => {
  it("strips only the leading 's' from the key", () => {
    expect(extractAllSubjects({ s2s: { subjects: [{ id: "X" }] } })[0].semesterName).toBe("Semester 2s");
  });
});

describe("searchSubjects: ranking invariants", () => {
  it("never returns more results than requested, nor more than exist", () => {
    for (const limit of [0, 1, 2, 3, 4, 5, 6, 50]) {
      expect(searchSubjects("a", SUBJECTS, limit)).toHaveLength(Math.min(limit, SUBJECTS.length));
    }
  });

  it("a smaller limit returns a prefix of a larger limit's results", () => {
    const all = searchSubjects("physics", SUBJECTS, 10).map((r) => r.id);
    expect(searchSubjects("physics", SUBJECTS, 2).map((r) => r.id)).toEqual(all.slice(0, 2));
  });

  it("is deterministic and independent of input order for distinct scores", () => {
    const fwd = searchSubjects("calclus", SUBJECTS, 5).map((r) => r.id);
    const rev = searchSubjects("calclus", [...SUBJECTS].reverse(), 5).map((r) => r.id);
    expect(rev).toEqual(fwd);
  });

  it("keeps input order for subjects with identical names and scores (stable sort)", () => {
    const subjects = [{ id: "1", name: "Same" }, { id: "2", name: "Same" }, { id: "3", name: "Same" }];
    expect(searchSubjects("same", subjects, 3).map((r) => r.id)).toEqual(["1", "2", "3"]);
  });

  it("every query that is a subject's exact id returns that subject first", () => {
    for (const s of SUBJECTS) {
      expect(searchSubjects(s.id, SUBJECTS, 1)[0].id).toBe(s.id);
    }
  });

  it("every query that is a subject's exact name returns that subject first", () => {
    for (const s of SUBJECTS) {
      expect(searchSubjects(s.name, SUBJECTS, 1)[0].id).toBe(s.id);
    }
  });

  it("handles regex metacharacters in the query literally", () => {
    const subjects = [{ id: "1", name: "C++ Programming" }, { id: "2", name: "Calculus" }];
    expect(() => searchSubjects("c++ (", subjects)).not.toThrow();
    expect(searchSubjects("c++", subjects, 1)[0].id).toBe("1");
    expect(searchSubjects(".*", subjects, 2).every((r) => r._distance > 0)).toBe(true);
  });

  it("accepts numeric ids", () => {
    expect(searchSubjects("123", [{ id: 123, name: "Numeric" }])[0].id).toBe(123);
  });
});

/* Regression tests for previously fixed bugs. */
describe("regressions in search.js", () => {
  it("calculateSubjectDistance reports matchedOn 'name' when only the name contains the query", () => {
    expect(calculateSubjectDistance("oo", { id: "CS21002", name: "Foo" }).matchedOn).toBe("name");
  });

  it("searchSubjects ranks an exact id match above an id that merely starts with the query", () => {
    const res = searchSubjects("ma101", [
      { id: "MA1010", name: "Apple" },
      { id: "MA101", name: "Zebra" },
    ]);
    expect(res[0].id).toBe("MA101");
  });

  it("searchSubjects ranks an exact name match above a longer name that starts with the query", () => {
    const res = searchSubjects("art", [
      { id: "1", name: "Art" },
      { id: "2", name: "Art" },
      { id: "3", name: "Art History" },
      { id: "4", name: "Arthropods" },
    ]);
    // Exact matches must come first, ahead of the alphabetical tie-breaker.
    expect(res.slice(0, 2).every((r) => r.name === "Art")).toBe(true);
    expect(searchSubjects("bio", [
      { id: "1", name: "Bio Chemistry" },
      { id: "2", name: "Bio" },
      { id: "3", name: "Bio-Informatics" },
    ], 1)[0].name).toBe("Bio");
  });

  it("searchSubjects treats a negative limit as 'no results' instead of dropping the last item", () => {
    expect(searchSubjects("a", SUBJECTS, -1)).toEqual([]);
  });

  it("searchSubjects ignores null / undefined entries in an array source", () => {
    expect(() => searchSubjects("alpha", [null, undefined, { id: "A1", name: "Alpha" }])).not.toThrow();
  });

  it("searchSubjects keeps subjects whose id is the number 0", () => {
    expect(searchSubjects("zero", [{ id: 0, name: "Zero" }])).toHaveLength(1);
  });

  it("levenshteinDistance counts an astral-plane character (emoji) as one edit", () => {
    expect(levenshteinDistance("😀", "a")).toBe(1);
  });
});

describe("wordMatchIndex", () => {
  it.each([
    ["data", "Data Science", 0],
    ["data", "Database Management Systems", 0],
    ["data", "Programming and Data Structures", 2],
    ["data structures", "Programming and Data Structures", 2],
    ["data struct", "Programming and Data Structures", 2],
    ["DATA", "programming and data structures", 2],
    ["science", "Data-Science", 1],
    ["output", "Input/Output", 1],
    ["data", "Metadata Engineering", -1],
    ["ata", "Data Science", -1],
    ["data mining", "Data Science", -1],
    ["", "Data Science", -1],
    ["   ", "Data Science", -1],
    ["data", "", -1],
  ])("wordMatchIndex(%j, %j) === %i", (q, name, expected) => {
    expect(wordMatchIndex(q, name)).toBe(expected);
  });

  it("normalises separators and spacing in the query", () => {
    expect(wordMatchIndex("  data   structures ", "Programming and Data Structures")).toBe(2);
    expect(wordMatchIndex("data-structures", "Programming and Data Structures")).toBe(2);
  });

  it("returns the earliest matching word", () => {
    expect(wordMatchIndex("data", "Data and Data")).toBe(0);
  });
});

describe("searchSubjects: flexible result count (minResults)", () => {
  const CATALOGUE = [
    { id: "CS10001", name: "Data Science" },
    { id: "CS10002", name: "Programming and Data Structures" },
    { id: "CS10003", name: "Database Management Systems" },
    { id: "CS10004", name: "Data Mining" },
    { id: "MA10001", name: "Advanced Calculus" },
    { id: "PH10001", name: "Physics of Waves" },
    { id: "EE10001", name: "Metadata Engineering" },
    { id: "EE10002", name: "Basic Electronics" },
    { id: "CS20001", name: "Reinforcement Learning" },
  ];
  const flexible = (q: string, limit = 12) => searchSubjects(q, CATALOGUE, limit, { minResults: 3 });

  it("returns every subject with a word starting with the query, beyond minResults", () => {
    expect(flexible("data").map((r) => r.name)).toEqual([
      "Data Mining",
      "Data Science",
      "Database Management Systems",
      "Programming and Data Structures",
    ]);
  });

  it("does not pad strong matches with mid-word substring matches once minResults is met", () => {
    expect(flexible("data").map((r) => r.name)).not.toContain("Metadata Engineering");
  });

  it("pads up to minResults with fuzzy matches when there are few strong matches", () => {
    const res = flexible("calclus");
    expect(res).toHaveLength(3);
    expect(res[0].name).toBe("Advanced Calculus");
  });

  it("still returns minResults for an acronym query when acronyms are disabled", () => {
    const res = searchSubjects("rl", CATALOGUE, 12, { minResults: 3, considerAcronyms: false });
    expect(res).toHaveLength(3);
  });

  it("treats an exact acronym as a strong match", () => {
    const res = searchSubjects("rl", CATALOGUE, 12, { minResults: 0 });
    expect(res.map((r) => r.id)).toEqual(["CS20001"]);
  });

  it("treats an id prefix as a strong match", () => {
    const res = searchSubjects("cs1", CATALOGUE, 12, { minResults: 0 });
    expect(res.map((r) => r.id).sort()).toEqual(["CS10001", "CS10002", "CS10003", "CS10004"]);
  });

  it("returns only strong matches with minResults 0, so gibberish yields nothing", () => {
    expect(searchSubjects("qqqqqqqq", CATALOGUE, 12, { minResults: 0 })).toEqual([]);
  });

  it("never exceeds limit, even with more strong matches", () => {
    expect(flexible("data", 2)).toHaveLength(2);
    expect(flexible("data", 2).map((r) => r.name)).toEqual(["Data Mining", "Data Science"]);
  });

  it("clamps minResults to limit", () => {
    expect(searchSubjects("qqqqqqqq", CATALOGUE, 2, { minResults: 10 })).toHaveLength(2);
  });

  it("defaults minResults to limit (a fixed number of results)", () => {
    expect(searchSubjects("data", CATALOGUE, 3)).toHaveLength(3);
    expect(searchSubjects("qqqqqqqq", CATALOGUE, 3)).toHaveLength(3);
    expect(searchSubjects("data", CATALOGUE, 3, { minResults: untyped("nope") })).toHaveLength(3);
  });

  it("returns the same top results as a fixed limit would", () => {
    const fixed = searchSubjects("data", CATALOGUE, 3).map((r) => r.id);
    expect(flexible("data").slice(0, 3).map((r) => r.id)).toEqual(fixed);
  });
});

describe("searchSubjects: first-word priority", () => {
  it("ranks a match on an earlier word above the alphabetical order", () => {
    const res = searchSubjects("systems", [
      { id: "1", name: "Applied Systems" },
      { id: "2", name: "Signals and Systems" },
      { id: "3", name: "Systems Biology" },
    ], 3);
    expect(res.map((r) => r.name)).toEqual(["Systems Biology", "Applied Systems", "Signals and Systems"]);
  });

  it("ranks a name-prefix match above a later whole-word match", () => {
    const res = searchSubjects("data", [
      { id: "1", name: "Applied Data Analysis" },
      { id: "2", name: "Database Systems" },
    ], 2);
    expect(res.map((r) => r.name)).toEqual(["Database Systems", "Applied Data Analysis"]);
  });

  it("does not add ranking metadata beyond _distance and _matchedOn", () => {
    const [top] = searchSubjects("data", [{ id: "1", name: "Data Science" }]);
    expect(Object.keys(top).sort()).toEqual(["_distance", "_matchedOn", "id", "name"]);
  });
});

// Documents current behaviour that looks unintended. Not fixed during the TypeScript migration.
describe("known bugs in search.ts (documented, not fixed)", () => {
  it("BUG: calculateSubjectDistance scores a numeric id 0 as if the id were empty", () => {
    // `String(subject.id || "")` turns 0 into "", so an exact id query does not score 0.
    expect(calculateSubjectDistance("0", { id: 0, name: "Zzzz" })).toEqual({ distance: 1, matchedOn: "id" });
  });
});
