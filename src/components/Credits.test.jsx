// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Credits from "./Credits";

afterEach(cleanup);

describe("Credits", () => {
  it("lists the three core contributors with photo and email", () => {
    render(<Credits />);
    expect(screen.getByText("Core Contributors")).toBeTruthy();
    for (const [name, email, photo] of [
      ["Shubhajeet Das", "shubhajeet [at] kgpian.iitkgp.ac.in", "shubhajeet.jpeg"],
      ["Kingshuk Patra", "kingshuk [at] kgpian.iitkgp.ac.in", "kingshuk.jpeg"],
      ["Durva Daga", "durva [at] kgpian.iitkgp.ac.in", "durva.jpeg"],
    ]) {
      expect(screen.getByText(name)).toBeTruthy();
      expect(screen.getByText(email)).toBeTruthy();
      expect(screen.getByAltText(name).getAttribute("src")).toContain(photo);
    }
  });
});
