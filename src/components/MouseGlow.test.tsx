// @vitest-environment jsdom
import { Profiler } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import MouseGlow from "./MouseGlow";
import { required } from "../test/required";

let frames: FrameRequestCallback[] = [];

beforeEach(() => {
  frames = [];
  vi.stubGlobal("requestAnimationFrame", vi.fn((cb: FrameRequestCallback) => frames.push(cb)));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const flushFrames = () => {
  const pending = frames;
  frames = [];
  pending.forEach((cb) => cb(0));
};

const move = (clientX: number, clientY: number) =>
  window.dispatchEvent(new MouseEvent("mousemove", { clientX, clientY }));

const stubReducedMotion = (reduce: boolean) =>
  vi.stubGlobal("matchMedia", vi.fn((query: string) => ({ matches: reduce && query.includes("reduce") })));

// The overlay is the first child of the wrapper div.
const glowOf = (container: HTMLElement) =>
  required(container.querySelector<HTMLElement>(":scope > div > div:first-child"));

describe("MouseGlow", () => {
  it("renders its children after a fixed glow overlay driven by CSS variables", () => {
    const { container } = render(<MouseGlow><p>child</p></MouseGlow>);
    expect(screen.getByText("child")).toBeTruthy();
    expect(glowOf(container).className).toContain("pointer-events-none fixed");
    expect(glowOf(container).style.background).toContain("var(--x, 0px) var(--y, 0px)");
  });

  it("moves the glow to the mouse position on the next animation frame", () => {
    const { container } = render(<MouseGlow />);
    move(120, 45);
    expect(glowOf(container).style.getPropertyValue("--x")).toBe("");
    flushFrames();
    expect(glowOf(container).style.getPropertyValue("--x")).toBe("120px");
    expect(glowOf(container).style.getPropertyValue("--y")).toBe("45px");
  });

  it("schedules at most one frame for a burst of mouse moves, using the latest position", () => {
    const { container } = render(<MouseGlow />);
    move(1, 1);
    move(2, 2);
    move(3, 4);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    flushFrames();
    expect(glowOf(container).style.getPropertyValue("--x")).toBe("3px");
    expect(glowOf(container).style.getPropertyValue("--y")).toBe("4px");
  });

  it("does not re-render on mouse move", () => {
    const onRender = vi.fn();
    render(<Profiler id="glow" onRender={onRender}><MouseGlow><p>child</p></MouseGlow></Profiler>);
    const renders = onRender.mock.calls.length;
    act(() => {
      move(10, 10);
      flushFrames();
      move(20, 20);
      flushFrames();
    });
    expect(onRender).toHaveBeenCalledTimes(renders);
  });

  it("renders no glow and no listener under prefers-reduced-motion", () => {
    stubReducedMotion(true);
    const add = vi.spyOn(window, "addEventListener");
    const { container } = render(<MouseGlow><p>child</p></MouseGlow>);
    expect(screen.getByText("child")).toBeTruthy();
    expect(container.querySelector(".pointer-events-none")).toBeNull();
    expect(add).not.toHaveBeenCalledWith("mousemove", expect.any(Function), expect.anything());
  });

  it("removes its mousemove listener on unmount", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<MouseGlow />);
    unmount();
    expect(remove).toHaveBeenCalledWith("mousemove", expect.any(Function));
  });
});
