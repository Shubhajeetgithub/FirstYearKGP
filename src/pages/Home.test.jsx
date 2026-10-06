// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

afterEach(cleanup);

describe("Home", () => {
  it("shows the welcome section followed by the credits", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const welcome = screen.getByText("AI Batch 2024");
    const credits = screen.getByText("Core Contributors");
    expect(welcome.compareDocumentPosition(credits) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
