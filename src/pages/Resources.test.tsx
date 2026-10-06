// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { BookOpen, FileText } from "lucide-react";
import Resources from "./Resources";
import { loadSemesterData } from "../data/loadSemesterData";
import { required } from "../test/required";
import type { Resource, SemesterData, Subject } from "../types/semester";

vi.mock("../data/loadSemesterData", () => ({ loadSemesterData: vi.fn() }));

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
        { name: "Calculus Notes", url: "https://r/notes", icon: BookOpen },
        { name: "Problem Set", url: "#", icon: FileText },
      ], "https://img/calc.png"),
      subject("s1", "PH11001", "Physics of Waves", [{ name: "Waves PDF", url: "https://r/waves", icon: FileText }]),
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
  vi.mocked(loadSemesterData).mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function renderLoaded(data: SemesterData = DATA) {
  vi.mocked(loadSemesterData).mockResolvedValue(data);
  render(<Resources />);
  await screen.findByText("Academic Resources");
}

const searchBox = () => screen.getByRole<HTMLInputElement>("textbox");
const search = (value: string) => fireEvent.change(searchBox(), { target: { value } });
const cardTitles = () => screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);
const semesterButton = (n: number) => required(screen.getByText(`Semester ${n}`).closest("button"));
const cardFor = (name: string) => required(screen.getByText(name).closest("button"));

describe("Resources", () => {
  describe("loading and errors", () => {
    it("shows a loader while the data loads", () => {
      vi.mocked(loadSemesterData).mockReturnValue(new Promise<SemesterData>(() => {}));
      render(<Resources />);
      expect(screen.getByText("Loading Archives...")).toBeTruthy();
    });

    it("shows an error with a retry button that reloads", async () => {
      vi.mocked(loadSemesterData).mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce(DATA);
      render(<Resources />);
      const retry = await screen.findByText("Try again");
      expect(screen.getByText("Couldn't load resources right now.")).toBeTruthy();
      expect(console.error).toHaveBeenCalledWith("Failed to load resources:", expect.any(Error));
      fireEvent.click(retry);
      await screen.findByText("Academic Resources");
      expect(loadSemesterData).toHaveBeenCalledTimes(2);
    });
  });

  describe("semester view", () => {
    it("lists loaded semesters, then disabled placeholders for missing 6-8", async () => {
      await renderLoaded();
      const buttons = screen
        .getAllByRole<HTMLButtonElement>("button")
        .filter((b) => b.textContent?.includes("Semester"));
      expect(buttons.map((b) => [b.textContent, b.disabled])).toEqual([
        ["1Semester 1", false],
        ["2Semester 2", false],
        ["6Semester 6", false],
        ["7Semester 7", true],
        ["8Semester 8", true],
      ]);
    });

    it("opens semester 1 by default and switches semesters", async () => {
      await renderLoaded();
      expect(cardTitles()).toEqual(["Advanced Calculus", "Physics of Waves"]);
      fireEvent.click(semesterButton(2));
      expect(cardTitles()).toEqual(["Design and Analysis of Algorithms", "Data Structures"]);
      expect(semesterButton(2).className).toContain("bg-indigo-500/20");
      expect(semesterButton(1).className).not.toContain("bg-indigo-500/20");
    });

    it("shows nothing in the content area when there is no semester 1", async () => {
      await renderLoaded({ s2: DATA.s2 });
      expect(cardTitles()).toEqual([]);
    });
  });

  describe("subject card", () => {
    it("shows id, name, resource count and image, and toggles resources", async () => {
      await renderLoaded();
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

    it("uses singular wording and a placeholder icon without an image", async () => {
      await renderLoaded();
      const card = cardFor("Physics of Waves");
      expect(within(card).getByText("1 resource")).toBeTruthy();
      expect(card.querySelector("img")).toBeNull();
    });

    it("says when a subject has no resources", async () => {
      await renderLoaded();
      fireEvent.click(semesterButton(2));
      expect(screen.getAllByText("No resources listed for this subject yet.")).toHaveLength(2);
      expect(screen.getAllByText("0 resources")).toHaveLength(2);
    });

    it("does not show rank or semester badges outside search", async () => {
      await renderLoaded();
      expect(screen.queryByText("#1")).toBeNull();
      expect(screen.queryByText("View in semester →")).toBeNull();
    });
  });

  describe("search", () => {
    it("shows ranked matches with semester badges", async () => {
      await renderLoaded();
      search("data");
      expect(screen.getByText('"data"')).toBeTruthy();
      expect(cardTitles()[0]).toBe("Data Structures");
      expect(screen.getByText("#1")).toBeTruthy();
      const top = cardFor("Data Structures");
      expect(within(top).getByText("Semester 2")).toBeTruthy();
      expect(screen.getByText(/subjects? found/).textContent).toMatch(/^\d+ subjects? found$/);
    });

    it("returns at least three results, fuzzy ones included", async () => {
      await renderLoaded();
      search("zzzz");
      expect(cardTitles()).toHaveLength(3);
      expect(screen.getByText("3 subjects found")).toBeTruthy();
    });

    it("uses singular wording for a single result", async () => {
      await renderLoaded({ s1: { name: "Semester 1", subjects: [DATA.s1.subjects[0]] } });
      search("calculus");
      expect(screen.getByText("1 subject found")).toBeTruthy();
    });

    it("ignores a whitespace-only query", async () => {
      await renderLoaded();
      search("   ");
      expect(screen.queryByText(/Matches for/)).toBeNull();
      expect(cardTitles()).toEqual(["Advanced Calculus", "Physics of Waves"]);
    });

    it("clears the query from the X button and from 'Clear filter'", async () => {
      await renderLoaded();
      search("data");
      fireEvent.click(screen.getByLabelText("Clear search"));
      expect(searchBox().value).toBe("");
      search("data");
      fireEvent.click(screen.getByText("Clear filter"));
      expect(searchBox().value).toBe("");
      expect(screen.queryByLabelText("Clear search")).toBeNull();
    });

    it("'View in semester' opens that semester and clears the search", async () => {
      await renderLoaded();
      search("reinforcement");
      const card = cardFor("Reinforcement Learning");
      fireEvent.click(within(card).getByText("View in semester →"));
      expect(searchBox().value).toBe("");
      expect(cardTitles()).toEqual(["Reinforcement Learning"]);
      expect(card.isConnected).toBe(false);
    });

    it("'View in semester' does not toggle the card", async () => {
      await renderLoaded();
      search("reinforcement");
      const card = cardFor("Reinforcement Learning");
      fireEvent.click(within(card).getByText("View in semester →"));
      // The search card unmounts; the semester card starts collapsed.
      const semesterCard = cardFor("Reinforcement Learning");
      expect(semesterCard.getAttribute("aria-expanded")).toBe("false");
    });

    it("shows the empty state when no subjects exist", async () => {
      await renderLoaded({ s1: { name: "Semester 1", subjects: [] } });
      search("anything");
      expect(screen.getByText("No matching subjects found")).toBeTruthy();
      expect(screen.getByText(/We couldn't find any subjects matching "anything"/)).toBeTruthy();
      fireEvent.click(screen.getByText("View all semesters"));
      expect(searchBox().value).toBe("");
    });
  });

  it("does not reload when the search changes", async () => {
    await renderLoaded();
    await act(async () => search("data"));
    expect(loadSemesterData).toHaveBeenCalledTimes(1);
  });
});
