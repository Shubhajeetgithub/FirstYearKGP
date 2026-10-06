// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import MouseGlow from "./MouseGlow";
import { required } from "../test/required";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// The overlay is the first child of the wrapper div.
const glowOf = (container: HTMLElement) =>
  required(container.querySelector<HTMLElement>(":scope > div > div:first-child"));

describe("MouseGlow", () => {
  it("renders its children after a fixed glow overlay", () => {
    const { container } = render(<MouseGlow><p>child</p></MouseGlow>);
    expect(screen.getByText("child")).toBeTruthy();
    expect(glowOf(container).className).toContain("pointer-events-none fixed");
    expect(glowOf(container).style.background).toContain("0px 0px");
  });

  it("moves the glow to the mouse position", () => {
    const { container } = render(<MouseGlow />);
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 120, clientY: 45 }));
    });
    expect(glowOf(container).style.background).toContain("120px 45px");
  });

  it("removes its mousemove listener on unmount", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<MouseGlow />);
    unmount();
    expect(remove).toHaveBeenCalledWith("mousemove", expect.any(Function));
  });
});
