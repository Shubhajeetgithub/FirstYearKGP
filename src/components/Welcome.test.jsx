// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Welcome from "./Welcome";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const renderWelcome = () => render(<MemoryRouter><Welcome /></MemoryRouter>);

describe("Welcome", () => {
  it("renders the hero and the two calls to action", () => {
    renderWelcome();
    expect(screen.getByText("AI Batch 2024")).toBeTruthy();
    expect(screen.getByText("Browse Resources").getAttribute("href")).toBe("/Resources");
    const feedback = screen.getByText("Feedback Form");
    expect(feedback.getAttribute("href")).toBe("https://forms.gle/bMiuhPwQ4ees6BDQ9");
    expect(feedback.getAttribute("target")).toBe("_blank");
    expect(feedback.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("types the terminal command one character every 80ms", () => {
    renderWelcome();
    const command = "cat init_academic_resources.sh";
    act(() => vi.advanceTimersByTime(80 * 3));
    expect(screen.getByText("cat")).toBeTruthy();
    act(() => vi.advanceTimersByTime(80 * command.length));
    expect(screen.getByText(command)).toBeTruthy();
  });

  it("blinks the cursor every 500ms", () => {
    const { container } = renderWelcome();
    const cursor = () => container.querySelector(".bg-indigo-300.inline-block");
    expect(cursor().className).toContain("opacity-100");
    act(() => vi.advanceTimersByTime(500));
    expect(cursor().className).toContain("opacity-0");
    act(() => vi.advanceTimersByTime(500));
    expect(cursor().className).toContain("opacity-100");
  });

  it("clears its timers on unmount", () => {
    const { unmount } = renderWelcome();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
