// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import BackgroundFX from "./BackGroundFX";

function stubPointer(coarse) {
  vi.stubGlobal("matchMedia", vi.fn((query) => ({ matches: coarse && query === "(pointer: coarse)" })));
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const mouseGlowOverlay = (container) => container.querySelector(".pointer-events-none.fixed");

describe("BackgroundFX", () => {
  it("uses the mouse glow on fine pointers", () => {
    stubPointer(false);
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { container } = render(<BackgroundFX><p>child</p></BackgroundFX>);
    expect(screen.getByText("child")).toBeTruthy();
    expect(mouseGlowOverlay(container)).not.toBeNull();
  });

  it("switches to the touch effect on coarse pointers", () => {
    stubPointer(true);
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { container } = render(<BackgroundFX><p>child</p></BackgroundFX>);
    expect(screen.getByText("child")).toBeTruthy();
    expect(mouseGlowOverlay(container)).toBeNull();
  });

  it("logs the detected pointer type", () => {
    stubPointer(true);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<BackgroundFX />);
    expect(log).toHaveBeenCalledWith("hasTouch: true");
  });
});
