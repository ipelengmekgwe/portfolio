import { describe, expect, it } from "vitest";

import { formatPushed, languageColor } from "./github";

describe("formatPushed", () => {
  const NOW = new Date("2026-05-01T12:00:00Z");

  it("returns 'today' for a same-day timestamp", () => {
    expect(formatPushed("2026-05-01T08:00:00Z", NOW)).toBe("today");
  });

  it("returns 'yesterday' for a one-day-old timestamp", () => {
    expect(formatPushed("2026-04-30T12:00:00Z", NOW)).toBe("yesterday");
  });

  it("formats a multi-day age in days", () => {
    expect(formatPushed("2026-04-25T12:00:00Z", NOW)).toBe("6 days ago");
  });

  it("formats a multi-month age in months", () => {
    expect(formatPushed("2026-01-01T12:00:00Z", NOW)).toMatch(/months ago$/);
  });

  it("formats a multi-year age in years", () => {
    expect(formatPushed("2023-05-01T12:00:00Z", NOW)).toMatch(/years ago$/);
  });
});

describe("languageColor", () => {
  it("returns the GitHub colour for known languages", () => {
    expect(languageColor("C#")).toBe("#178600");
    expect(languageColor("TypeScript")).toBe("#3178c6");
    expect(languageColor("JavaScript")).toBe("#f1e05a");
  });

  it("falls back to the gold accent for unknown / null languages", () => {
    expect(languageColor(null)).toBe("var(--color-gold)");
    expect(languageColor("Brainfuck")).toBe("var(--color-gold)");
  });
});
