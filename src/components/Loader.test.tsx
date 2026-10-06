// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Loader from "./Loader";
import { required } from "../test/required";

afterEach(cleanup);

describe("Loader", () => {
  it("renders a 48px spinner and 'Loading...' by default", () => {
    const { container } = render(<Loader />);
    const spinner = required(container.querySelector<HTMLElement>(".animate-spin"));
    expect(spinner.style.width).toBe("48px");
    expect(spinner.style.height).toBe("48px");
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("accepts a custom size and text", () => {
    const { container } = render(<Loader size={20} text="Fetching" />);
    expect(required(container.querySelector<HTMLElement>(".animate-spin")).style.width).toBe("20px");
    expect(screen.getByText("Fetching")).toBeTruthy();
  });
});
