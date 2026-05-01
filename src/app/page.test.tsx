import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Prologue } from "@/components/chapter/Prologue";

/**
 * The Cover component depends on Framer Motion's useScroll, which doesn't
 * exercise meaningfully in a happy-dom environment. We smoke-test the
 * Prologue here instead — it's a server component with no motion deps and
 * gives us coverage on the chapter-rendering pipeline.
 */
describe("Prologue", () => {
  it("renders the Hello introduction", () => {
    render(<Prologue />);
    expect(
      screen.getByRole("heading", { level: 2, name: /hello/i }),
    ).toBeInTheDocument();
  });

  it("renders the table of contents with all four chapters and the epilogue", () => {
    render(<Prologue />);
    expect(screen.getByText(/how we got here/i)).toBeInTheDocument();
    expect(screen.getByText(/the toolkit/i)).toBeInTheDocument();
    expect(screen.getByText(/selected works/i)).toBeInTheDocument();
    expect(screen.getByText(/credentials & honours/i)).toBeInTheDocument();
    expect(screen.getAllByText(/epilogue/i).length).toBeGreaterThan(0);
  });
});
