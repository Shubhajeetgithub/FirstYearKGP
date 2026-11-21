// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import SiteSearch from "./SiteSearch";
import type { Pagefind, PagefindResultData } from "../lib/pagefind";

const RESULTS: PagefindResultData[] = [
  { url: "/blog/fourier.html", excerpt: "the <mark>fourier</mark> transform", meta: { title: "Fourier tricks", date: "2026-11-21" }, filters: { type: ["blog"] } },
  { url: "/resources/s3.html", excerpt: "signals and <mark>fourier</mark>", meta: { title: "Semester 3 resources" }, filters: { type: ["resource"] } },
];

function fakePagefind() {
  const debouncedSearch = vi.fn<Pagefind["debouncedSearch"]>(async (_q, options) => {
    const type = options?.filters?.type;
    const matching = RESULTS.filter((r) => !type || r.filters.type.includes(String(type)));
    return { results: matching.map((r, i) => ({ id: String(i), data: async () => r })) };
  });
  const pagefind: Pagefind = { init: vi.fn(async () => {}), options: vi.fn(async () => {}), debouncedSearch };
  return { pagefind, debouncedSearch };
}

beforeEach(() => window.history.replaceState(null, "", "/search"));
afterEach(cleanup);

const box = () => screen.getByRole<HTMLInputElement>("searchbox");

describe("SiteSearch", () => {
  it("searches as you type and links to clean URLs", async () => {
    const { pagefind, debouncedSearch } = fakePagefind();
    render(<SiteSearch loadPagefind={async () => pagefind} />);
    await waitFor(() => expect(pagefind.init).toHaveBeenCalled());
    fireEvent.change(box(), { target: { value: "fourier" } });
    await screen.findByText("Fourier tricks");
    expect(debouncedSearch).toHaveBeenLastCalledWith("fourier", { filters: undefined }, 200);
    expect(screen.getByText("Fourier tricks").closest("a")?.getAttribute("href")).toBe("/blog/fourier");
    expect(screen.getByText("Semester 3 resources").closest("a")?.getAttribute("href")).toBe("/resources/s3");
    expect(screen.getByText('2 results for "fourier".')).toBeTruthy();
    expect(window.location.search).toBe("?q=fourier");
  });

  it("filters by type and keeps it in the URL", async () => {
    const { pagefind, debouncedSearch } = fakePagefind();
    render(<SiteSearch loadPagefind={async () => pagefind} />);
    fireEvent.change(box(), { target: { value: "fourier" } });
    await screen.findByText("Fourier tricks");
    fireEvent.click(screen.getByLabelText("Resources"));
    await waitFor(() => expect(screen.queryByText("Fourier tricks")).toBeNull());
    expect(debouncedSearch).toHaveBeenLastCalledWith("fourier", { filters: { type: "resource" } }, 200);
    expect(screen.getByText("Semester 3 resources")).toBeTruthy();
    expect(window.location.search).toBe("?q=fourier&type=resource");
  });

  it("reads ?q= and ?type= on load", async () => {
    window.history.replaceState(null, "", "/search?q=fourier&type=blog");
    const { pagefind } = fakePagefind();
    render(<SiteSearch loadPagefind={async () => pagefind} />);
    await screen.findByText("Fourier tricks");
    expect(box().value).toBe("fourier");
    expect(screen.queryByText("Semester 3 resources")).toBeNull();
  });

  it("explains when the index is missing (dev server)", async () => {
    render(<SiteSearch loadPagefind={async () => { throw new Error("404"); }} />);
    await screen.findByText(/search index isn't available/);
  });

  it("says when nothing matches", async () => {
    const pagefind: Pagefind = { debouncedSearch: async () => ({ results: [] }) };
    render(<SiteSearch loadPagefind={async () => pagefind} />);
    await waitFor(() => expect(box()).toBeTruthy());
    await new Promise((r) => setTimeout(r, 0));
    fireEvent.change(box(), { target: { value: "zzz" } });
    await screen.findByText('No results for "zzz".');
  });
});
