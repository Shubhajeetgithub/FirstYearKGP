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
  document.body.querySelectorAll("div[style]").forEach((el) => el.remove());
});

function touch(x, y) {
  const event = new Event("touchstart");
  event.touches = [{ clientX: x, clientY: y }];
  window.dispatchEvent(event);
}

const glows = () => [...document.body.children].filter((el) => el.style.borderRadius === "50%");

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

  it("stops listening after unmount", () => {
    const { unmount } = render(<TouchEffect />);
    unmount();
    touch(10, 10);
    expect(glows()).toHaveLength(0);
  });
});
