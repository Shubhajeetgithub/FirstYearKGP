// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import BackgroundFX from "./BackgroundFX";

function stubPointer(coarse: boolean) {
  vi.stubGlobal("matchMedia", vi.fn((query: string) => ({ matches: coarse && query === "(pointer: coarse)" })));
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const mouseGlowOverlay = (container: HTMLElement) => container.querySelector(".pointer-events-none.fixed");

describe("BackgroundFX", () => {
  it("uses the mouse glow on fine pointers", () => {
    stubPointer(false);
    const { container } = render(<BackgroundFX />);
    expect(mouseGlowOverlay(container)).not.toBeNull();
  });

  it("switches to the touch effect on coarse pointers", () => {
    stubPointer(true);
    const { container } = render(<BackgroundFX />);
    expect(mouseGlowOverlay(container)).toBeNull();
  });

  it("does not log to the console", () => {
    stubPointer(true);
    const log = vi.spyOn(console, "log");
    render(<BackgroundFX />);
    expect(log).not.toHaveBeenCalled();
  });
});
