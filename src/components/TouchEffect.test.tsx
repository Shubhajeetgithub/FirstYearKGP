// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import TouchEffect from "./TouchEffect";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.querySelectorAll<HTMLElement>("div[style]").forEach((el) => el.remove());
});

// jsdom has no Touch constructor, so attach a minimal touches list to a plain event.
function touch(x: number, y: number) {
  const event = Object.assign(new Event("touchstart"), { touches: [{ clientX: x, clientY: y }] });
  window.dispatchEvent(event);
}

const glows = () =>
  Array.from(document.body.querySelectorAll<HTMLElement>(":scope > *")).filter(
    (el) => el.style.borderRadius === "50%"
  );

describe("TouchEffect", () => {
  it("renders its children", () => {
    render(<TouchEffect><p>child</p></TouchEffect>);
    expect(screen.getByText("child")).toBeTruthy();
  });

  it("adds a glow centred on the touch point, then removes it after 600ms", () => {
    render(<TouchEffect />);
    touch(200, 100);
    const [glow] = glows();
    expect(glows()).toHaveLength(1);
    expect(glow.style.left).toBe("125px");
    expect(glow.style.top).toBe("25px");
    expect(glow.style.zIndex).toBe("9999");
    expect(glow.style.pointerEvents).toBe("none");
    vi.advanceTimersByTime(599);
    expect(glows()).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(glows()).toHaveLength(0);
  });

  it("registers a passive touchstart listener", () => {
    const add = vi.spyOn(window, "addEventListener");
    render(<TouchEffect />);
    expect(add).toHaveBeenCalledWith("touchstart", expect.any(Function), { passive: true });
  });

  it("adds no glow under prefers-reduced-motion", () => {
    vi.stubGlobal("matchMedia", vi.fn((query: string) => ({ matches: query.includes("reduce") })));
    render(<TouchEffect><p>child</p></TouchEffect>);
    touch(50, 50);
    expect(glows()).toHaveLength(0);
    expect(screen.getByText("child")).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it("stops listening after unmount", () => {
    const { unmount } = render(<TouchEffect />);
    unmount();
    touch(10, 10);
    expect(glows()).toHaveLength(0);
  });
});
