// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import ResourcesExplorer from "./ResourcesExplorer";
import { refreshSemesterData } from "../lib/sheet";
import type { RefreshOptions } from "../lib/sheet";
import { required } from "../test/required";
import type { Resource, SemesterData, Subject } from "../types/semester";

vi.mock("../lib/sheet", () => ({ refreshSemesterData: vi.fn(() => () => {}) }));

const subject = (
  semester: string,
  id: string,
  name: string,
  resources: Resource[] = [],
  image = ""
): Subject => ({
  id,
  name,
  image,
  semester,
  semesterName: `Semester ${semester.slice(1)}`,
  resources,
});

const DATA: SemesterData = {
  s1: {
    name: "Semester 1",
    subjects: [
      subject("s1", "MA11001", "Advanced Calculus", [
        { name: "Calculus Notes", url: "https://r/notes", icon: "book" },
        { name: "Problem Set", url: "#", icon: "file" },
      ], "https://img/calc.png"),
      subject("s1", "PH11001", "Physics of Waves", [{ name: "Waves PDF", url: "https://r/waves", icon: "download" }]),
    ],
  },
  s2: {
    name: "Semester 2",
    subjects: [
      subject("s2", "CS21002", "Design and Analysis of Algorithms"),
      subject("s2", "CS21003", "Data Structures"),
    ],
  },
  s6: {
    name: "Semester 6",
    subjects: [subject("s6", "AI60001", "Reinforcement Learning")],
  },
};

beforeEach(() => {
  window.history.replaceState(null, "", "/resources");
  vi.mocked(refreshSemesterData).mockClear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderExplorer(data: SemesterData = DATA, initialSemester = "s1", sheetUrl?: string) {
  return render(<ResourcesExplorer data={data} initialSemester={initialSemester} builtAt={123} sheetUrl={sheetUrl} />);
}

const searchBox = () => screen.getByRole<HTMLInputElement>("searchbox");
const search = (value: string) => fireEvent.change(searchBox(), { target: { value } });
const cardTitles = () => screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);
const semesterLink = (n: number) =>
  required(within(screen.getByRole("navigation", { name: "Semesters" })).getByText(`Semester ${n}`).closest("a"));
const cardFor = (name: string) => required(screen.getByText(name).closest("button"));
const cardContainer = (toggle: HTMLElement) => required(toggle.parentElement);

describe("ResourcesExplorer", () => {
  describe("data", () => {
    it("renders the build-time data straight away (no loader)", () => {
      renderExplorer();
      expect(cardTitles()).toEqual(["Advanced Calculus", "Physics of Waves"]);
    });

    it("starts a background refresh with the sheet URL and build time", () => {
      renderExplorer(DATA, "s1", "https://sheet.test/csv");
      expect(refreshSemesterData).toHaveBeenCalledTimes(1);
      expect(vi.mocked(refreshSemesterData).mock.calls[0][0]).toMatchObject({ url: "https://sheet.test/csv", builtAt: 123 });
    });

    it("shows data passed to onUpdate by the refresh", () => {
      let options: RefreshOptions | undefined;
      vi.mocked(refreshSemesterData).mockImplementationOnce((o) => { options = o; return () => {}; });
      renderExplorer();
      act(() => options?.onUpdate({ s1: { name: "Semester 1", subjects: [subject("s1", "NEW1", "Fresh Subject")] } }));
      expect(cardTitles()).toEqual(["Fresh Subject"]);
    });

    it("cancels the refresh on unmount", () => {
      const cancel = vi.fn();
      vi.mocked(refreshSemesterData).mockReturnValueOnce(cancel);
      const { unmount } = renderExplorer();
      unmount();
      expect(cancel).toHaveBeenCalled();
    });
  });

  describe("semester view", () => {
    it("lists loaded semesters as links, then disabled placeholders for missing 6-8", () => {
      renderExplorer();
      const nav = screen.getByRole("navigation", { name: "Semesters" });
      const links = within(nav).getAllByRole("link");
      expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
        ["1Semester 1", "/resources/s1"],
        ["2Semester 2", "/resources/s2"],
        ["6Semester 6", "/resources/s6"],
      ]);
      const placeholders = within(nav).getAllByRole<HTMLButtonElement>("button");
      expect(placeholders.map((b) => [b.textContent, b.disabled])).toEqual([
        ["7Semester 7", true],
        ["8Semester 8", true],
      ]);
    });

    it("opens the initial semester and marks it current", () => {
      renderExplorer(DATA, "s2");
      expect(cardTitles()).toEqual(["Design and Analysis of Algorithms", "Data Structures"]);
      expect(semesterLink(2).getAttribute("aria-current")).toBe("page");
      expect(semesterLink(1).getAttribute("aria-current")).toBeNull();
    });

    it("switches semesters in place, pushing /resources/sN and updating the title", () => {
      renderExplorer();
      fireEvent.click(semesterLink(2));
      expect(cardTitles()).toEqual(["Design and Analysis of Algorithms", "Data Structures"]);
      expect(semesterLink(2).className).toContain("bg-indigo-500/20");
      expect(semesterLink(1).className).not.toContain("bg-indigo-500/20");
      expect(window.location.pathname).toBe("/resources/s2");
      expect(document.title).toBe("Semester 2 resources — AI Batch 2024, IIT KGP");
    });

    it("leaves modified clicks (new tab) to the browser", () => {
      renderExplorer();
      const event = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true });
      semesterLink(2).dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
      expect(cardTitles()).toEqual(["Advanced Calculus", "Physics of Waves"]);
    });

    it("follows back/forward navigation", () => {
      renderExplorer();
      fireEvent.click(semesterLink(2));
      act(() => {
        window.history.replaceState(null, "", "/resources/s6");
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
      expect(cardTitles()).toEqual(["Reinforcement Learning"]);
    });

    it("shows nothing in the content area when the initial semester does not exist", () => {
      renderExplorer({ s2: DATA.s2 }, "s1");
      expect(cardTitles()).toEqual([]);
    });
  });

  describe("subject card", () => {
    it("shows id, name, resource count and image, and toggles resources", () => {
      renderExplorer();
      const card = cardFor("Advanced Calculus");
      expect(within(card).getByText("MA11001")).toBeTruthy();
      expect(within(card).getByText("2 resources")).toBeTruthy();
      expect(required(card.querySelector("img")).getAttribute("src")).toBe("https://img/calc.png");
      expect(card.getAttribute("aria-expanded")).toBe("false");

      const link = required(screen.getByText("Calculus Notes").closest("a"));
      expect(link.getAttribute("href")).toBe("https://r/notes");
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("tabindex")).toBe("-1");

      fireEvent.click(card);
      expect(card.getAttribute("aria-expanded")).toBe("true");
      expect(link.getAttribute("tabindex")).toBe("0");
      fireEvent.click(card);
      expect(card.getAttribute("aria-expanded")).toBe("false");
    });

    it("renders an icon for every icon name", () => {
      renderExplorer();
      for (const name of ["Calculus Notes", "Problem Set", "Waves PDF"]) {
        expect(required(screen.getByText(name).closest("a")).querySelector("svg")).not.toBeNull();
      }
    });

    it("uses singular wording and a placeholder icon without an image", () => {
      renderExplorer();
      const card = cardFor("Physics of Waves");
      expect(within(card).getByText("1 resource")).toBeTruthy();
      expect(card.querySelector("img")).toBeNull();
    });

    it("says when a subject has no resources", () => {
      renderExplorer(DATA, "s2");
      expect(screen.getAllByText("No resources listed for this subject yet.")).toHaveLength(2);
      expect(screen.getAllByText("0 resources")).toHaveLength(2);
    });

    it("does not show rank or semester badges outside search", () => {
      renderExplorer();
      expect(screen.queryByText("#1")).toBeNull();
      expect(screen.queryByText("View in semester →")).toBeNull();
    });
  });

  describe("search", () => {
    it("pre-fills the query from ?q= on mount", () => {
      window.history.replaceState(null, "", "/resources?q=data");
      renderExplorer();
      expect(searchBox().value).toBe("data");
      expect(cardTitles()[0]).toBe("Data Structures");
    });

    it("writes the query to ?q= without adding history entries", () => {
      renderExplorer();
      const length = window.history.length;
      search("daa");
      expect(window.location.search).toBe("?q=daa");
      search("");
      expect(window.location.search).toBe("");
      expect(window.history.length).toBe(length);
    });

    it("renders 'View in semester' as its own button, not inside the card toggle", () => {
      renderExplorer();
      search("reinforcement");
      const card = cardFor("Reinforcement Learning");
      const view = within(cardContainer(card)).getByText("View in semester →");
      expect(view.tagName).toBe("BUTTON");
      expect(view.getAttribute("type")).toBe("button");
      expect(card.contains(view)).toBe(false);
      expect(card.querySelector("button, a")).toBeNull();
    });

    it("shows ranked matches with semester badges", () => {
      renderExplorer();
      search("data");
      expect(screen.getByText('"data"')).toBeTruthy();
      expect(cardTitles()[0]).toBe("Data Structures");
      expect(screen.getByText("#1")).toBeTruthy();
      const top = cardFor("Data Structures");
      expect(within(top).getByText("Semester 2")).toBeTruthy();
      expect(screen.getByText(/subjects? found/).textContent).toMatch(/^\d+ subjects? found$/);
    });

    it("returns at least three results, fuzzy ones included", () => {
      renderExplorer();
      search("zzzz");
      expect(cardTitles()).toHaveLength(3);
      expect(screen.getByText("3 subjects found")).toBeTruthy();
    });

    it("uses singular wording for a single result", () => {
      renderExplorer({ s1: { name: "Semester 1", subjects: [DATA.s1.subjects[0]] } });
      search("calculus");
      expect(screen.getByText("1 subject found")).toBeTruthy();
    });

    it("ignores a whitespace-only query", () => {
      renderExplorer();
      search("   ");
      expect(screen.queryByText(/Matches for/)).toBeNull();
      expect(cardTitles()).toEqual(["Advanced Calculus", "Physics of Waves"]);
    });

    it("clears the query from the X button and from 'Clear filter'", () => {
      renderExplorer();
      search("data");
      fireEvent.click(screen.getByLabelText("Clear search"));
      expect(searchBox().value).toBe("");
      search("data");
      fireEvent.click(screen.getByText("Clear filter"));
      expect(searchBox().value).toBe("");
      expect(screen.queryByLabelText("Clear search")).toBeNull();
      expect(window.location.search).toBe("");
    });

    it("'View in semester' opens that semester, clears the search and updates the URL", () => {
      renderExplorer();
      search("reinforcement");
      const card = cardFor("Reinforcement Learning");
      fireEvent.click(within(cardContainer(card)).getByText("View in semester →"));
      expect(searchBox().value).toBe("");
      expect(cardTitles()).toEqual(["Reinforcement Learning"]);
      expect(card.isConnected).toBe(false);
      expect(window.location.pathname).toBe("/resources/s6");
      expect(window.location.search).toBe("");
    });

    it("'View in semester' does not toggle the card", () => {
      renderExplorer();
      search("reinforcement");
      const card = cardFor("Reinforcement Learning");
      fireEvent.click(within(cardContainer(card)).getByText("View in semester →"));
      // The search card unmounts; the semester card starts collapsed.
      expect(cardFor("Reinforcement Learning").getAttribute("aria-expanded")).toBe("false");
    });

    it("shows the empty state when no subjects exist", () => {
      renderExplorer({ s1: { name: "Semester 1", subjects: [] } });
      search("anything");
      expect(screen.getByText("No matching subjects found")).toBeTruthy();
      expect(screen.getByText(/We couldn't find any subjects matching "anything"/)).toBeTruthy();
      fireEvent.click(screen.getByText("View all semesters"));
      expect(searchBox().value).toBe("");
    });
  });
});
