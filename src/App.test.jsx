// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "./App";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<p>home page</p>} />
          <Route path="/Resources" element={<p>resources page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("App", () => {
  it("renders the nav links in order", () => {
    renderAt("/");
    const links = screen.getAllByRole("link");
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Home", "/"],
      ["Resources", "/Resources"],
    ]);
  });

  it("renders the matched child route in the outlet", () => {
    renderAt("/Resources");
    expect(screen.getByText("resources page")).toBeTruthy();
    expect(screen.getByRole("main").textContent).toBe("resources page");
  });

  it.each([
    ["/", "Home", "Resources"],
    ["/Resources", "Resources", "Home"],
  ])("at %s highlights %s", (path, active, inactive) => {
    renderAt(path);
    expect(screen.getByText(active).className).toContain("text-white bg-white/10");
    expect(screen.getByText(inactive).className).toContain("text-slate-400");
  });
});
