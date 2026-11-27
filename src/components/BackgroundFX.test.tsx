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

describe("BackgroundFX", () => {
  it("renders nothing on fine pointers", () => {
    stubPointer(false);
    const { container } = render(<BackgroundFX />);
    expect(container.innerHTML).toBe("");
  });

  it("does not log to the console", () => {
    stubPointer(true);
    const log = vi.spyOn(console, "log");
    render(<BackgroundFX />);
    expect(log).not.toHaveBeenCalled();
  });
});
